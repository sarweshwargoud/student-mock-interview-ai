import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
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
    const { mockIdRef, question, correctAns, userAns, userEmail } = body;

    const prompt = `Question: ${question},
Correct Answer: ${correctAns},
User Answer: ${userAns}.
Please evaluate the user's answer. Give a rating out of 10 (as an integer number or string) and feedback on improvement.
Format the response strictly as a JSON object: { "rating": 7, "feedback": "Your constructive feedback here" }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleaned = cleanJsonResponse(responseText);
    const feedbackData = JSON.parse(cleaned);

    const newAnswer = await db
      .insert(UserAnswer)
      .values({
        mockIdRef: mockIdRef,
        question: question,
        correctAns: correctAns,
        userAns: userAns,
        feedback: feedbackData.feedback || "",
        rating: String(feedbackData.rating || "0"),
        userEmail: userEmail || "",
        createdAt: moment().format("DD-MM-YYYY"),
      })
      .returning();

    return NextResponse.json(newAnswer[0]);
  } catch (error) {
    console.error("Error in POST /api/answers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save answer" },
      { status: 500 }
    );
  }
}
