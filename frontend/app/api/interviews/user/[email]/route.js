import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const email = decodeURIComponent(params.email);
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, email))
      .orderBy(desc(MockInterview.id));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/interviews/user/[email]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user interviews" },
      { status: 500 }
    );
  }
}
