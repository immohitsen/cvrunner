import os
import json
# pyrefly: ignore [missing-import]
from groq import Groq  

def analyze_with_ai(resume_text: str, jd_text: str) -> dict:
    """
    Uses Groq (LLaMA 3) to extract skills, find missing skills, calculate match score,
    and generate rewrite suggestions in a single, ultra high-speed API call.
    """
    api_key = os.getenv("GROQ_API_KEY") 
    if not api_key:
        return {
            "resume_score": 0,
            "resume_skills": [],
            "jd_skills": [],
            "missing_skills": [],
            "suggestions": ["Warning: GROQ_API_KEY is not set in .env. AI disabled."]
        }

    try:
        client = Groq(api_key=api_key)
        
        prompt = f"""
        You are an expert ATS (Applicant Tracking System) and Technical Recruiter.
        Analyze the following Resume and Job Description (JD).
        
        Tasks:
        1. Calculate a realistic "resume_score" from 0 to 100 representing how well the Resume matches the JD. Consider semantic fit, skill overlap, and context (e.g. knowing 'React' implies knowing 'JavaScript').
        2. Grade the resume on 4 specific metrics out of 100:
           - "impact": Did they quantify achievements (e.g. used numbers/percentages)?
           - "brevity": Are the bullet points concise and easy to read?
           - "style": Did they use strong action verbs?
           - "skills": How perfectly do their skills match the JD?
        3. Extract a list of technical and professional skills found in the Resume.
        4. Extract a list of technical and professional skills found in the JD.
        5. Identify the skills from the JD that are MISSING from the Resume.
        6. Provide exactly 3 short, actionable bullet points advising how the candidate can improve their resume based on the missing skills.
        
        Rules:
        - Normalize all skills to lowercase (e.g. 'react.js').
        - Return ONLY a valid JSON object.
        - The JSON must match this structure exactly:
        {{
            "resume_score": int,
            "metrics": {{
                "impact": int,
                "brevity": int,
                "style": int,
                "skills": int
            }},
            "resume_skills": ["str"],
            "jd_skills": ["str"],
            "missing_skills": ["str"],
            "suggestions": ["str"]
        }}
        
        Resume:
        {resume_text[:4000]}
        
        Job Description:
        {jd_text[:4000]}
        """
        
        # Using llama-3.1-8b-instant for fast json extraction
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"}, 
        )
        
        clean_text = response.choices[0].message.content.strip()
        data = json.loads(clean_text)
        
        return {
            "resume_score": data.get("resume_score", 0),
            "metrics": data.get("metrics", {"impact": 0, "brevity": 0, "style": 0, "skills": 0}),
            "resume_skills": data.get("resume_skills", []),
            "jd_skills": data.get("jd_skills", []),
            "missing_skills": data.get("missing_skills", []),
            "suggestions": data.get("suggestions", [])
        }
        
    except Exception as e:
        print(f"AI Extraction Error: {e}")
        return {
            "resume_score": 0,
            "resume_skills": [],
            "jd_skills": [],
            "missing_skills": [],
            "suggestions": [f"AI Error: {str(e)}"]
        }
