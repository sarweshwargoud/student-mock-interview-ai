import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function cleanJsonResponse(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    if (lines[0].startsWith("```")) {
      lines.shift();
    }
    if (lines.length > 0 && lines[lines.length - 1].trim() === "```") {
      lines.pop();
    }
    cleaned = lines.join("\n").trim();
  }
  return cleaned;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userEmail = formData.get("userEmail") || "";
    const difficulty = formData.get("difficulty") || "Medium";

    if (!file) {
      return NextResponse.json(
        { detail: "No resume file provided." },
        { status: 400 }
      );
    }

    const filename = file.name || "";
    const isPdf = filename.toLowerCase().endsWith(".pdf");
    const isDocx = filename.toLowerCase().endsWith(".docx");

    if (!isPdf && !isDocx) {
      return NextResponse.json(
        { detail: "Only PDF and DOCX files are supported." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let parts = [];

    const promptText = `You are an expert technical interviewer.
Analyze this candidate's resume attached/provided.
Difficulty level requested: ${difficulty}

Do the following:
1. Identify the candidate's primary job role/position.
2. Identify their main tech stack / skills.
3. Estimate their years of experience (as a number or string, e.g. "2").
4. Generate exactly 5 interview questions and model answers tailored to this specific resume.

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "jobPosition": "<detected role>",
  "jobDesc": "<comma-separated key skills>",
  "jobExperience": "<estimated years as a string>",
  "questions": [
    { "question": "...", "answer": "..." }
  ]
}`;

    if (isPdf) {
      const base64Data = buffer.toString("base64");
      parts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: "application/pdf",
          },
        },
        promptText,
      ];
    } else {
      // For text or docx, send the raw string / binary content representation
      const textContent = buffer.toString("utf-8");
      parts = [
        `Resume content:\n${textContent.slice(0, 8000)}\n\n${promptText}`,
      ];
    }

    const result = await model.generateContent(parts);
    const responseText = result.response.text();
    const cleaned = cleanJsonResponse(responseText);
    const parsed = JSON.parse(cleaned);

    const questions = parsed.questions || [];
    if (!questions.length) {
      throw new Error("No questions were generated from the resume.");
    }

    const mockId = uuidv4();
    const newInterview = await db
      .insert(MockInterview)
      .values({
        mockId: mockId,
        jsonMockResp: JSON.stringify(questions),
        jobPosition: parsed.jobPosition || "Resume-based Interview",
        jobDesc: parsed.jobDesc || "Extracted from resume",
        jobExperience: String(parsed.jobExperience || "0"),
        createdBy: userEmail,
        createdAt: moment().format("DD-MM-YYYY"),
      })
      .returning();

    return NextResponse.json(newInterview[0]);
  } catch (error) {
    console.error("Error in POST /api/interviews/from-resume:", error);
    return NextResponse.json(
      { detail: error.message || "Failed to process resume." },
      { status: 500 }
    );
  }
}
