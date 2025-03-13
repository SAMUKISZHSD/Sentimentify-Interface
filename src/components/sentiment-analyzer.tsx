"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { InfoIcon, Loader2 } from "lucide-react";

type SentimentResult = {
  text: string;
  sentiment: "positive" | "neutral" | "negative";
  score: number;
  timestamp: Date;
  language: string;
  explanation?: string;
};

export default function SentimentAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [history, setHistory] = useState<SentimentResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch history when component mounts
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      if (response.ok) {
        const data = await response.json();
        // Convert the timestamp strings to Date objects
        const formattedHistory = data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.created_at),
          text: item.text,
          sentiment: item.sentiment,
          score: item.score,
          language: item.language,
          explanation: item.explanation,
        }));
        setHistory(formattedHistory);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error(
            "Rate limit exceeded. Please try again in a few moments.",
          );
        } else {
          throw new Error(errorData.error || "Failed to analyze sentiment");
        }
      }

      const analysisResult = await response.json();

      // Format the result
      const formattedResult = {
        text: analysisResult.text,
        sentiment: analysisResult.sentiment,
        score: analysisResult.score,
        language: analysisResult.language,
        explanation: analysisResult.explanation,
        timestamp: new Date(analysisResult.timestamp),
      };

      setResult(formattedResult);

      // Update local history
      setHistory((prev) => [formattedResult, ...prev.slice(0, 9)]);

      // Refresh history from server
      fetchHistory();
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to analyze sentiment. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadFromHistory = (item: SentimentResult) => {
    setText(item.text);
    setResult(item);
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "😊";
      case "neutral":
        return "😐";
      case "negative":
        return "☹️";
      default:
        return "";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-800/20 text-green-400 dark:bg-green-950/50 dark:text-green-300";
      case "neutral":
        return "bg-gray-800/20 text-gray-400 dark:bg-gray-900/50 dark:text-gray-300";
      case "negative":
        return "bg-red-800/20 text-red-400 dark:bg-red-950/50 dark:text-red-300";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-md border-0 dark:bg-gray-900 dark:border-gray-800">
        <CardHeader className="dark:border-b dark:border-gray-800">
          <CardTitle className="text-2xl font-bold dark:text-gray-100">
            Sentimentify
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Analyze the sentiment of your text using ChatGPT's advanced language
            model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analyze" className="w-full">
            <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
              <TabsTrigger
                value="analyze"
                className="dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
              >
                Analyze
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="space-y-4 pt-4">
              <Textarea
                placeholder="Enter text to analyze sentiment..."
                className="min-h-32 text-base p-4 dark:bg-gray-800 dark:border-gray-700 dark:placeholder:text-gray-500"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <Button
                onClick={handleAnalyze}
                className="w-full py-6 text-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                disabled={!text.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Sentiment"
                )}
              </Button>

              {error && (
                <div className="p-3 text-sm bg-red-100 text-red-800 rounded-md dark:bg-red-900/30 dark:text-red-300">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-6 p-4 rounded-lg border dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold dark:text-gray-100">
                      Analysis Result
                    </h3>
                    <Badge className={getSentimentColor(result.sentiment)}>
                      {result.sentiment.toUpperCase()}{" "}
                      {getSentimentEmoji(result.sentiment)}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground mb-2 dark:text-gray-300">
                    {result.text.length > 100
                      ? `${result.text.substring(0, 100)}...`
                      : result.text}
                  </div>

                  {result.explanation && (
                    <div className="mt-3 p-3 bg-muted/30 rounded text-sm dark:bg-gray-800/50 dark:text-gray-300">
                      {result.explanation}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-3">
                      <div className="text-sm text-muted-foreground dark:text-gray-400">
                        Confidence: {Math.round(result.score * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground dark:text-gray-400 border-l pl-3 dark:border-gray-700">
                        Language:{" "}
                        {result.language.charAt(0).toUpperCase() +
                          result.language.slice(1)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground dark:text-gray-500">
                      {result.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 p-4 bg-muted/50 rounded-lg flex gap-3 dark:bg-gray-800/50 dark:border dark:border-gray-700">
                <InfoIcon
                  size={18}
                  className="text-muted-foreground mt-1 flex-shrink-0 dark:text-blue-400"
                />
                <div className="text-sm text-muted-foreground dark:text-gray-300">
                  <p className="font-medium mb-1 dark:text-gray-200">
                    How it works
                  </p>
                  <p>
                    Our sentiment analysis tool uses a rule-based approach to
                    analyze the emotional tone of text. The system identifies
                    positive and negative words in your text and calculates a
                    sentiment score based on their frequency.
                  </p>
                  <p className="mt-2">
                    The analyzer examines word patterns, counts positive and
                    negative terms, and provides a confidence score representing
                    how strongly the text leans toward a particular sentiment.
                    It also includes basic language detection for English,
                    Portuguese, and Spanish texts.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="pt-4">
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
                  No analysis history yet. Start by analyzing some text!
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800 hover:bg-accent/50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => loadFromHistory(item)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium truncate pr-2 dark:text-gray-200">
                          {item.text.length > 40
                            ? `${item.text.substring(0, 40)}...`
                            : item.text}
                        </div>
                        <Badge className={getSentimentColor(item.sentiment)}>
                          {getSentimentEmoji(item.sentiment)}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground dark:text-gray-500">
                        <div className="flex gap-2">
                          <span>
                            Confidence: {Math.round(item.score * 100)}%
                          </span>
                          <span className="border-l pl-2 dark:border-gray-700">
                            Language:{" "}
                            {item.language.charAt(0).toUpperCase() +
                              item.language.slice(1)}
                          </span>
                        </div>
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground border-t dark:border-gray-800 dark:text-gray-500 pt-4">
          Sentimentify - ChatGPT-Powered Sentiment Analysis Tool
        </CardFooter>
      </Card>
    </div>
  );
}
