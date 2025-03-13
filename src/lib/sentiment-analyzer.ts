// Simple rule-based sentiment analyzer

type SentimentResult = {
  sentiment: "positive" | "neutral" | "negative";
  score: number;
  explanation: string;
  language: string;
};

// Positive and negative word lists for basic sentiment analysis
const positiveWords = [
  "good",
  "great",
  "excellent",
  "amazing",
  "wonderful",
  "fantastic",
  "terrific",
  "outstanding",
  "superb",
  "brilliant",
  "awesome",
  "happy",
  "joy",
  "love",
  "like",
  "beautiful",
  "best",
  "better",
  "perfect",
  "nice",
  "pleasant",
  "delightful",
  "bom",
  "ótimo",
  "excelente",
  "maravilhoso",
  "fantástico",
  "feliz",
  "alegria",
  "amor",
  "bonito",
  "perfeito",
  "agradável",
  "delicioso",
  "bueno",
  "genial",
  "maravilloso",
];

const negativeWords = [
  "bad",
  "terrible",
  "horrible",
  "awful",
  "poor",
  "disappointing",
  "sad",
  "hate",
  "dislike",
  "worst",
  "failure",
  "negative",
  "ugly",
  "wrong",
  "annoying",
  "angry",
  "ruim",
  "terrível",
  "horrível",
  "péssimo",
  "decepcionante",
  "triste",
  "ódio",
  "feio",
  "errado",
  "irritante",
  "raiva",
  "malo",
  "terrible",
  "horrible",
  "triste",
];

// Simple language detection based on common words
function detectLanguage(text: string): string {
  const lowerText = text.toLowerCase();

  // Portuguese indicators
  const portugueseWords = [
    "não",
    "sim",
    "muito",
    "obrigado",
    "como",
    "está",
    "bem",
    "eu",
    "você",
    "para",
  ];
  let portugueseScore = 0;
  portugueseWords.forEach((word) => {
    if (lowerText.includes(word)) portugueseScore++;
  });

  // Spanish indicators
  const spanishWords = [
    "no",
    "sí",
    "muy",
    "gracias",
    "cómo",
    "está",
    "bien",
    "yo",
    "tú",
    "para",
  ];
  let spanishScore = 0;
  spanishWords.forEach((word) => {
    if (lowerText.includes(word)) spanishScore++;
  });

  // Default to English unless there's strong evidence of Portuguese or Spanish
  if (portugueseScore > 2 && portugueseScore > spanishScore) {
    return "portuguese";
  } else if (spanishScore > 2 && spanishScore > portugueseScore) {
    return "spanish";
  }

  return "english";
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  let positiveCount = 0;
  let negativeCount = 0;

  // Count positive and negative words
  words.forEach((word) => {
    // Remove punctuation
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    if (positiveWords.includes(cleanWord)) {
      positiveCount++;
    }
    if (negativeWords.includes(cleanWord)) {
      negativeCount++;
    }
  });

  // Calculate sentiment score (between 0 and 1)
  const totalSentimentWords = positiveCount + negativeCount;
  let score = 0.5; // Default neutral score
  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  let explanation = "The text appears to be neutral.";

  if (totalSentimentWords > 0) {
    score = positiveCount / totalSentimentWords;

    // Adjust for extreme cases
    if (score > 0.9) score = 0.9;
    if (score < 0.1) score = 0.1;

    // Determine sentiment category
    if (score > 0.6) {
      sentiment = "positive";
      explanation = `The text contains ${positiveCount} positive words and ${negativeCount} negative words, indicating an overall positive sentiment.`;
    } else if (score < 0.4) {
      sentiment = "negative";
      explanation = `The text contains ${positiveCount} positive words and ${negativeCount} negative words, indicating an overall negative sentiment.`;
    } else {
      explanation = `The text contains a balanced mix of ${positiveCount} positive words and ${negativeCount} negative words.`;
    }
  } else if (words.length < 3) {
    explanation = "The text is too short to analyze sentiment accurately.";
  }

  // Detect language
  const language = detectLanguage(text);

  return {
    sentiment,
    score,
    explanation,
    language,
  };
}

export async function saveAnalysisToHistory(userId: string, analysis: any) {
  if (!userId) return null;

  try {
    const { createClient } = await import("../../../supabase/server");
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
    const { createClient } = await import("../../../supabase/server");
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
