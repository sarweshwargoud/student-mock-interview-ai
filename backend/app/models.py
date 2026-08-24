from sqlalchemy import Column, Integer, String, Text
from .database import Base

class MockInterview(Base):
    __tablename__ = "MockInterview"

    id = Column(Integer, primary_key=True, index=True)
    jsonMockResp = Column(Text, nullable=False)
    jobPosition = Column(String, nullable=False)
    jobDesc = Column(String, nullable=False)
    jobExperience = Column(String, nullable=False)
    createdBy = Column(String, nullable=False)
    createdAt = Column(String)
    mockId = Column(String, nullable=False)

class UserAnswer(Base):
    __tablename__ = "userAnswer"

    id = Column(Integer, primary_key=True, index=True)
    mockId = Column("mockId", String, nullable=False) # Maps to the 'mockId' column in PostgreSQL
    question = Column(String, nullable=False)
    correctAns = Column(Text)
    userAns = Column(Text)
    feedback = Column(Text)
    rating = Column(String)
    userEmail = Column(String)
    createdAt = Column(String)
