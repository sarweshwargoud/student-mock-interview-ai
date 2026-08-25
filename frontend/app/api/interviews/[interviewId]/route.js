import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const { interviewId } = params;
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    if (!result || result.length === 0) {
      return NextResponse.json(
        { detail: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error in GET /api/interviews/[interviewId]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch interview" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { interviewId } = params;

    // Delete associated answers first
    await db
      .delete(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId));

    // Delete the interview
    const result = await db
      .delete(MockInterview)
      .where(eq(MockInterview.mockId, interviewId))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json(
        { detail: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/interviews/[interviewId]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete interview" },
      { status: 500 }
    );
  }
}
