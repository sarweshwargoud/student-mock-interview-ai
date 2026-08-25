import io
import json
import uuid
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import google.generativeai as genai
import fitz  # PyMuPDF
import docx  # python-docx
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


# ── Resume helpers ─────────────────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract plain text from a PDF using PyMuPDF."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages = [page.get_text() for page in doc]
    return "\n".join(pages).strip()


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract plain text from a DOCX using python-docx."""
    document = docx.Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in document.paragraphs if p.text.strip()]
    return "\n".join(paragraphs).strip()


# ── Resume-based interview endpoint ───────────────────────────────────────

@app.post("/api/interviews/from-resume", response_model=schemas.InterviewResponse)
async def create_interview_from_resume(
    file: UploadFile = File(...),
    userEmail: str = Form(...),
    difficulty: str = Form("Medium"),
    db: Session = Depends(get_db),
):
    """
    Accept a PDF or DOCX resume, extract its text, and generate 5 personalised
    interview questions using Gemini.  The resulting MockInterview is stored
    exactly like a manually created one.
    """
    # ── 1. Validate file type ─────────────────────────────────────────────
    filename = file.filename or ""
    if not (filename.lower().endswith(".pdf") or filename.lower().endswith(".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    file_bytes = await file.read()

    # ── 2. Extract text ───────────────────────────────────────────────────
    try:
        if filename.lower().endswith(".pdf"):
            resume_text = extract_text_from_pdf(file_bytes)
        else:
            resume_text = extract_text_from_docx(file_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read the uploaded file: {str(e)}"
        )

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file appears to be empty or unreadable."
        )

    # ── 3. Ask Gemini to parse the resume AND generate questions ──────────
    prompt = (
        "You are an expert technical interviewer. "
        "Below is the full text of a candidate's resume:\n\n"
        f"{resume_text[:6000]}\n\n"  # cap at ~6 000 chars to stay within token limits
        f"Difficulty level requested: {difficulty}\n\n"
        "Do the following:\n"
        "1. Identify the candidate's primary job role/position.\n"
        "2. Identify their main tech stack / skills.\n"
        "3. Estimate their years of experience.\n"
        "4. Generate exactly 5 interview questions and model answers tailored to this specific resume.\n\n"
        "Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):\n"
        "{\n"
        '  "jobPosition": "<detected role>",\n'
        '  "jobDesc": "<comma-separated key skills>",\n'
        '  "jobExperience": "<estimated years as a number string>",\n'
        '  "questions": [\n'
        '    { "question": "...", "answer": "..." },\n'
        "    ...\n"
        "  ]\n"
        "}"
    )

    try:
        response = gemini_model.generate_content(prompt)
        cleaned = clean_json_response(response.text)
        parsed = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini returned invalid JSON: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calling Gemini: {str(e)}"
        )

    # ── 4. Validate parsed structure ──────────────────────────────────────
    questions = parsed.get("questions", [])
    if not questions:
        raise HTTPException(
            status_code=500,
            detail="Gemini did not return any questions. Please try again."
        )

    # ── 5. Save to DB ─────────────────────────────────────────────────────
    mock_id = str(uuid.uuid4())
    db_interview = models.MockInterview(
        mockId=mock_id,
        jsonMockResp=json.dumps(questions),
        jobPosition=parsed.get("jobPosition", "Resume-based Interview"),
        jobDesc=parsed.get("jobDesc", "Extracted from resume"),
        jobExperience=parsed.get("jobExperience", "0"),
        createdBy=userEmail,
        createdAt=datetime.now().strftime("%d-%m-%Y"),
    )

    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview

