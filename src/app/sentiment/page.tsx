import Navbar from "@/components/navbar";
import SentimentAnalyzer from "@/components/sentiment-analyzer";
import Footer from "@/components/footer";

export default function SentimentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 dark:text-gray-100">
            Sentimentify
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto dark:text-gray-300">
            Analyze the emotional tone of your text with our ML-powered
            sentiment analysis tool
          </p>
        </div>
        <SentimentAnalyzer />
      </main>
      <Footer />
    </div>
  );
}
