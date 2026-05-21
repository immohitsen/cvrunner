import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import { getDocumentProxy, extractText } from "unpdf";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get("resume") as File | null;
    const jdText = formData.get("job_description") as string | null;

    if (!resumeFile) {
      return NextResponse.json({ error: "Missing resume file" }, { status: 400 });
    }
    if (!jdText) {
      return NextResponse.json({ error: "Missing job description" }, { status: 400 });
    }

    // 1. Read and parse PDF
    const fileBytes = await resumeFile.arrayBuffer();
    const uint8Array = new Uint8Array(fileBytes);
    const pdf = await getDocumentProxy(uint8Array);
    const { text: resumeText } = await extractText(pdf, { mergePages: true });

    // 2. Use AI to extract skills, score, and suggestions
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        resume_score: 0,
        metrics: { impact: 0, brevity: 0, style: 0, skills: 0 },
        extracted_skills: [],
        missing_skills: [],
        ai_suggestions: ["Warning: GROQ_API_KEY is not set in the environment. AI disabled."]
      });
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) and Technical Recruiter.
        Analyze the following Resume against the provided Job Description (JD) or Job Role.
        Note: If the user provided a job role (e.g., "Frontend Developer", "Data Scientist") instead of a full job description, evaluate the resume against the standard industry skills and expectations for that job role.

        Tasks:
        1. Calculate a realistic "resume_score" from 0 to 100 representing how well the Resume matches the JD/Job Role. Consider semantic fit, skill overlap, and context (e.g. knowing 'React' implies knowing 'JavaScript').
        2. Grade the resume on 4 specific metrics out of 100:
          - "impact": Did they quantify achievements (e.g. used numbers/percentages)?
          - "brevity": Are the bullet points concise and easy to read?
          - "style": Did they use strong action verbs?
          - "skills": How perfectly do their skills match the JD/Job Role?
        3. Extract a list of technical and professional skills found in the Resume.
        4. Extract a list of technical and professional skills found in the JD/Job Role. If only a job role was specified, list the typical skills required for that role.
        5. Identify the skills from the JD/Job Role that are MISSING from the Resume (or standard expected skills for that role that the resume is missing).
        6. Provide exactly 3 short, actionable bullet points advising how the candidate can improve their resume based on the missing skills and the target role/description.

        Rules:
        - Normalize all skills to lowercase (e.g. 'react.js').
        - Return ONLY a valid JSON object.
        - The JSON must match this structure exactly:
        {
            "resume_score": int,
            "metrics": {
                "impact": int,
                "brevity": int,
                "style": int,
                "skills": int
            },
            "resume_skills": ["str"],
            "jd_skills": ["str"],
            "missing_skills": ["str"],
            "suggestions": ["str"]
        }

        Resume:
        ${resumeText.slice(0, 4000)}

        Job Description / Job Role:
        ${jdText.slice(0, 4000)}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API returned error: ${response.status} ${errText}`);
    }

    const responseData = await response.json();
    const cleanContent = responseData.choices[0].message.content.trim();
    const data = JSON.parse(cleanContent);

    // Format output matching original Python API response
    return NextResponse.json({
      resume_score: data.resume_score || 0,
      metrics: data.metrics || { impact: 0, brevity: 0, style: 0, skills: 0 },
      extracted_skills: (data.resume_skills || []).slice(0, 15),
      missing_skills: (data.missing_skills || []).slice(0, 10),
      ai_suggestions: data.suggestions || []
    });

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({
      resume_score: 0,
      metrics: { impact: 0, brevity: 0, style: 0, skills: 0 },
      extracted_skills: [],
      missing_skills: [],
      ai_suggestions: [`Error analyzing resume: ${error.message || error}`]
    }, { status: 500 });
  }
}
