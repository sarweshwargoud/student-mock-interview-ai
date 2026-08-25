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
    const body = await req.json();
    const { jobPosition, jobDesc, jobExperience, difficulty, userEmail } = body;

    const prompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}, Difficulty Level: ${difficulty || "Medium"}.
Generate exactly 5 interview questions and answers in JSON format.
The response must be a JSON array of objects, where each object has exactly two fields: 'question' and 'answer'.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleaned = cleanJsonResponse(responseText);
    const parsedQuestions = JSON.parse(cleaned);

    const mockId = uuidv4();
    const newInterview = await db
      .insert(MockInterview)
      .values({
        mockId: mockId,
        jsonMockResp: JSON.stringify(parsedQuestions),
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: String(jobExperience),
        createdBy: userEmail || "",
        createdAt: moment().format("DD-MM-YYYY"),
      })
      .returning();

    return NextResponse.json(newInterview[0]);
  } catch (error) {
    console.error("Error in POST /api/interviews:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}
