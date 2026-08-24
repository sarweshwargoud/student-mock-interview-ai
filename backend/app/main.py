import json
import uuid
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import google.generativeai as genai
from .config import settings
from .database import get_db, engine, Base
from . import models, schemas

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Interview Guru API", version="1.0.0")

# CORS middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_json_response(text: str) -> str:
    """Helper to strip markdown JSON codeblock markers if present."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()
    return cleaned

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/interviews", response_model=schemas.InterviewResponse)
def create_interview(data: schemas.InterviewCreate, db: Session = Depends(get_db)):
    prompt = (
        f"Job position: {data.jobPosition}, "
        f"Job Description: {data.jobDesc}, "
        f"Years of Experience: {data.jobExperience}, "
        f"Difficulty Level: {data.difficulty}.\n"
        f"Generate exactly 5 interview questions and answers in JSON format. "
        f"The response must be a JSON array of objects, where each object has exactly two fields: 'question' and 'answer'."
    )

    try:
        response = gemini_model.generate_content(prompt)
        response_text = response.text
        cleaned_json = clean_json_response(response_text)
        
        # Verify it parses correctly as JSON
        parsed_json = json.loads(cleaned_json)
        
        mock_id = str(uuid.uuid4())
        db_interview = models.MockInterview(
            mockId=mock_id,
            jsonMockResp=json.dumps(parsed_json),
            jobPosition=data.jobPosition,
            jobDesc=data.jobDesc,
            jobExperience=data.jobExperience,
            createdBy=data.userEmail,
            createdAt=datetime.now().strftime("%d-%m-%Y")
        )
        
        db.add(db_interview)
        db.commit()
        db.refresh(db_interview)
        return db_interview
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse Gemini JSON output: {str(e)}. Original text: {response_text}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating interview: {str(e)}"
        )

@app.post("/api/answers", response_model=schemas.AnswerResponse)
def save_answer(data: schemas.AnswerCreate, db: Session = Depends(get_db)):
    prompt = (
        f"Question: {data.question},\n"
        f"Correct Answer: {data.correctAns},\n"
        f"User Answer: {data.userAns}.\n"
        f"Please evaluate the user's answer. Give a rating out of 10 (as an integer number) and feedback on improvement. "
        f"Format the response strictly as a JSON object: {{ \"rating\": <number>, \"feedback\": <text> }}"
    )

    try:
        response = gemini_model.generate_content(prompt)
        response_text = response.text
        cleaned_json = clean_json_response(response_text)
        feedback_data = json.loads(cleaned_json)

        db_answer = models.UserAnswer(
            mockId=data.mockIdRef, # maps to 'mockId' column
            question=data.question,
            correctAns=data.correctAns,
            userAns=data.userAns,
            feedback=feedback_data.get("feedback", ""),
            rating=str(feedback_data.get("rating", "0")),
            userEmail=data.userEmail,
            createdAt=datetime.now().strftime("%d-%m-%Y")
        )

        db.add(db_answer)
        db.commit()
        db.refresh(db_answer)
        return db_answer
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving answer feedback: {str(e)}"
        )

@app.get("/api/interviews/user/{email}", response_model=List[schemas.InterviewResponse])
def get_user_interviews(email: str, db: Session = Depends(get_db)):
    return db.query(models.MockInterview).filter(models.MockInterview.createdBy == email).order_by(models.MockInterview.id.desc()).all()

@app.get("/api/answers/user/{email}", response_model=List[schemas.AnswerResponse])
def get_user_answers(email: str, db: Session = Depends(get_db)):
    return db.query(models.UserAnswer).filter(models.UserAnswer.userEmail == email).all()

@app.get("/api/interviews/{mockId}", response_model=schemas.InterviewResponse)
def get_interview(mockId: str, db: Session = Depends(get_db)):
    interview = db.query(models.MockInterview).filter(models.MockInterview.mockId == mockId).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview

@app.get("/api/interviews/{mockId}/feedback", response_model=List[schemas.AnswerResponse])
def get_interview_feedback(mockId: str, db: Session = Depends(get_db)):
    return db.query(models.UserAnswer).filter(models.UserAnswer.mockId == mockId).order_by(models.UserAnswer.id).all()

@app.delete("/api/interviews/{mockId}")
def delete_interview(mockId: str, db: Session = Depends(get_db)):
    interview = db.query(models.MockInterview).filter(models.MockInterview.mockId == mockId).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    db.query(models.UserAnswer).filter(models.UserAnswer.mockId == mockId).delete(synchronize_session=False)
    
    db.delete(interview)
    db.commit()
    return {"message": "Interview deleted successfully"}
