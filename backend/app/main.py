# pyrefly: ignore [missing-import]
from fastapi import FastAPI, File, UploadFile, Form
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CVRunner MVP API",
    description="Stateless backend for parsing resumes and calculating ATS scores.",
    version="1.0.0"
)

# Enable CORS so Next.js frontend can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CVRunner API is running!"}

from app.models import AnalyzeResponse
from app.services.parser import parse_pdf_bytes
from app.services.llm_service import analyze_with_ai

@app.post("/api/v1/analyze", response_model=AnalyzeResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Core MVP Endpoint.
    Takes a PDF file and a Job Description string.
    Returns the Resume score, skills, and AI suggestions.
    """
    # 1. Read and parse PDF
    file_bytes = await resume.read()
    resume_text = parse_pdf_bytes(file_bytes)
    
    # 2. Use AI to extract all skills, score, and suggestions in one shot
    ai_data = analyze_with_ai(resume_text, job_description)
    
    # 3. Return formatted data
    return AnalyzeResponse(
        resume_score=ai_data.get("resume_score", 0),
        metrics=ai_data.get("metrics", {"impact": 0, "brevity": 0, "style": 0, "skills": 0}),
        extracted_skills=ai_data["resume_skills"][:15], # Limit list sizes for UI
        missing_skills=ai_data["missing_skills"][:10],
        ai_suggestions=ai_data["suggestions"]
    )
