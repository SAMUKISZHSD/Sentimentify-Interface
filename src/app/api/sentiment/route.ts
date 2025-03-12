import { NextRequest, NextResponse } from "next/server";
import { analyzeSentiment, saveAnalysisToHistory } from "@/lib/openai";
import { createClient } from "../../../../supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Get the current user if logged in
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Analyze the sentiment
    try {
      const analysis = await analyzeSentiment(text);

      // Save to history if user is logged in
      if (user) {
        await saveAnalysisToHistory(user.id, analysis);
      }

      return NextResponse.json(analysis);
    } catch (error: any) {
      console.error("Error in OpenAI API call:", error);

      // Check if it's a rate limit error
      if (error.message && error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "OpenAI API rate limit exceeded. Please try again later." },
          { status: 429 },
        );
      }

      throw error; // Re-throw for the outer catch block
    }
  } catch (error: any) {
    console.error("Error in sentiment analysis API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze sentiment" },
      { status: 500 },
    );
  }
}
