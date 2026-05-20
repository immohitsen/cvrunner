# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import List

class AnalyzeResponse(BaseModel):
    """
    This defines the exact JSON structure that our /analyze endpoint will return.
    Using Pydantic ensures that the data is always validated and formatted correctly
    before it gets sent to the Next.js frontend.
    """
    resume_score: int
    metrics: dict
    extracted_skills: List[str]
    missing_skills: List[str]
    ai_suggestions: List[str]
