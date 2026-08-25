import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const email = decodeURIComponent(params.email);
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.userEmail, email));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/answers/user/[email]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user answers" },
      { status: 500 }
    );
  }
}
