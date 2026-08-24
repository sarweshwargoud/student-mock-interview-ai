from pydantic import BaseModel
from typing import Optional, List

class InterviewCreate(BaseModel):
    jobPosition: str
    jobDesc: str
    jobExperience: str
    difficulty: str  # "Low", "Medium", "High"
    userEmail: str

class InterviewResponse(BaseModel):
    id: int
    jsonMockResp: str
    jobPosition: str
    jobDesc: str
    jobExperience: str
    createdBy: str
    createdAt: str
    mockId: str

    class Config:
        from_attributes = True

class AnswerCreate(BaseModel):
    mockIdRef: str
    question: str
    correctAns: str
    userAns: str
    userEmail: str

class AnswerResponse(BaseModel):
    id: int
    mockId: str
    question: str
    correctAns: Optional[str] = None
    userAns: Optional[str] = None
    feedback: Optional[str] = None
    rating: Optional[str] = None
    userEmail: Optional[str] = None
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True
