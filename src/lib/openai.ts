import { createClient } from "../../supabase/server";

export async function analyzeSentiment(text: string) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a sentiment analysis expert. Analyze the sentiment of the text and respond with a JSON object containing: sentiment (positive, negative, or neutral), score (a number between 0 and 1 representing confidence), and a brief explanation. Also detect the language of the text.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      text,
      sentiment: result.sentiment,
      score: result.score,
      explanation: result.explanation,
      language: result.language || "english",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw error;
  }
}

export async function saveAnalysisToHistory(userId: string, analysis: any) {
  if (!userId) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sentiment_history")
      .insert({
        user_id: userId,
        text: analysis.text,
        sentiment: analysis.sentiment,
        score: analysis.score,
        language: analysis.language,
        explanation: analysis.explanation,
      })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving to history:", error);
    return null;
  }
}

export async function getUserHistory(userId: string) {
  if (!userId) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sentiment_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}
