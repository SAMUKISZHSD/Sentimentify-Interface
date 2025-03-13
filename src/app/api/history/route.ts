import { NextRequest, NextResponse } from "next/server";
import { getUserHistory } from "@/lib/sentiment-analyzer";
import { createClient } from "../../../../supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get user's history
    const history = await getUserHistory(user.id);

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}
