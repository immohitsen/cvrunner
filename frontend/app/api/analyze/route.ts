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

    const prompt = `You are a strict, highly critical ATS (Applicant Tracking System) scanner and professional resume auditor. 
      Analyze the following Resume against the target Job Description (JD) or Job Role.

      Scoring Rules & Rubric (Be Rigorous - Do NOT inflate scores):
      - Resumes should rarely get >75 unless they are exceptionally tailored, highly quantified, and contain all core keywords.
      - Maximum Score 60: If the resume contains zero quantified metrics (no numbers, percentages, dollar amounts, or timelines).
      - Maximum Score 65: If the resume is missing core technical keywords/skills specified in the JD or expected for the Job Role.
      - Rubric:
        * 0 - 45: Poor alignment, major missing skill gaps, lack of metrics, poor action verbs.
        * 45 - 65: Average alignment, has basic skills but lacks core stack requirements or fails to show impact.
        * 65 - 80: Good alignment, possesses most key skills, but lacks optimization.
        * 80 - 100: Exceptional alignment, perfectly tailored, quantified achievements on almost every line.

      Tasks:
      1. Calculate a realistic "resume_score" (0-100) using the rubric above.
      2. Grade the resume on 4 metrics out of 100:
        - "impact": Action verbs & quantified achievements.
        - "brevity": Conciseness and readability.
        - "style": Formatting, structure, and readability.
        - "skills": Keyword matching and semantic alignment.
      3. Extract a list of technical/professional skills found in the Resume.
      4. Extract a list of technical/professional skills required in the JD/Job Role.
      5. Identify the skills from the JD/Job Role that are MISSING from the Resume.
      6. Provide exactly 3 highly specific, structural suggestions. For each suggestion, output:
        - "section": The section/job experience where the change should be made.
        - "issue": What is wrong (e.g. weak verbs, lack of numbers).
        - "fix": What the candidate needs to do.
        - "before": A direct quote or realistic representation of the weak line from the resume.
        - "after": A rewritten, high-impact version with strong action verbs and simulated metrics.

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
          "suggestions": [
              {
                  "section": "str",
                  "issue": "str",
                  "fix": "str",
                  "before": "str",
                  "after": "str"
              }
          ]
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
