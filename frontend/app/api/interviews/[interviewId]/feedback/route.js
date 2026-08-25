import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const { interviewId } = params;
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(asc(UserAnswer.id));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/interviews/[interviewId]/feedback:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
