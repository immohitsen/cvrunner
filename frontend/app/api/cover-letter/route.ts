import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { resume_text, job_description, tone, word_count, candidate_info } = await req.json();

    if (!resume_text) {
      return NextResponse.json({ error: "Missing resume text" }, { status: 400 });
    }
    if (!job_description) {
      return NextResponse.json({ error: "Missing job description" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        cover_letter: "Warning: GROQ_API_KEY is not set in the environment. Unable to generate cover letter."
      }, { status: 500 });
    }

    const targetWordCount = word_count || 250;
    const nameStr = candidate_info?.name || "[Your Name]";
    const emailStr = candidate_info?.email || "[Contact Email]";
    const phoneStr = candidate_info?.phone || "[Contact Phone]";
    const linksStr = candidate_info?.links?.length ? candidate_info.links.join(", ") : "";

    const toneInstructions = {
      professional: "Write in a respectful, formal, and authoritative business tone. Focus on structured achievements and reliability.",
      confident: "Write in a high-impact, bold, and energetic tone. Highlight strong ownership, major results, and proactive problem-solving.",
      creative: "Write in an engaging, conversational, and warm tone. Focus on cultural fit, passion for the company's mission, and creative thinking."
    };

    const selectedTone = toneInstructions[tone as 'professional' | 'confident' | 'creative'] || toneInstructions.professional;

    const prompt = `You are an expert career consultant and high-converting cover letter writer. 
      Draft a tailored, compelling cover letter for a candidate based on their Resume and the target Job Description (JD).

      Tone: ${selectedTone}

      Instructions:
      - Analyze the Resume and target Job Description.
      - Highlight 2-3 of the candidate's strongest matching skills/experiences that directly solve the core challenges outlined in the Job Description.
      - Naturally and constructively weave in or address any important skills/competencies from the JD that the candidate might want to emphasize (even if they are missing or weak in the resume, frame them as areas of enthusiasm, quick learning, or adjacent experience).
      - Ensure the letter has a clear structure:
        1. A compelling hook/opening paragraph.
        2. A body section (1-2 paragraphs) demonstrating value and impact.
        3. A professional closing call-to-action.
      - Keep it concise, high-impact, and strictly around ${targetWordCount} words in length.
      - Format the header details (contact info) and the final sign-off signature using the candidate's actual details:
        * Name: ${nameStr}
        * Email: ${emailStr}
        * Phone: ${phoneStr}
        * Links: ${linksStr}
        If any of these details are bracketed placeholders (like [Your Name] or [Contact Email]), print them as-is or omit them gracefully. Avoid generating generic placeholders if these details are provided.

      Resume:
      ${resume_text.slice(0, 4000)}

      Job Description:
      ${job_description.slice(0, 4000)}`;

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errText}`);
    }

    const responseData = await response.json();
    const coverLetter = responseData.choices[0].message.content.trim();

    return NextResponse.json({ cover_letter: coverLetter });

  } catch (error: any) {
    console.error("Cover Letter Generator Error:", error);
    return NextResponse.json({
      error: `Error generating cover letter: ${error.message || error}`
    }, { status: 500 });
  }
}
