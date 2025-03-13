# Sentimentify - Sentiment Analysis Tool

## Overview

Sentimentify is a modern web application that analyzes the emotional tone of text using a rule-based sentiment analysis engine. The application provides users with instant insights into whether text has a positive, negative, or neutral sentiment, along with confidence scores and explanations.

## Features

- **Text Analysis**: Enter any text to analyze its emotional tone
- **Rule-Based Processing**: Sentiment analysis engine processes your text
- **Sentiment Scoring**: Get sentiment scores with confidence metrics
- **Instant Results**: See results in seconds with visual indicators (😊/😐/☹️)
- **Language Detection**: Basic detection for English, Portuguese and Spanish
- **Analysis History**: View and reload previous analyses (requires authentication)
- **User Authentication**: Secure sign-up and sign-in functionality

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials

### Running the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Project Structure

- `/src/components/sentiment-analyzer.tsx` - Main sentiment analysis component
- `/src/lib/sentiment-analyzer.ts` - Sentiment analysis engine
- `/src/app/api/sentiment/route.ts` - API endpoint for sentiment analysis
- `/src/app/api/history/route.ts` - API endpoint for user history
- `/src/app/sentiment/page.tsx` - Sentiment analysis page

## Usage

1. Navigate to the sentiment analysis page
2. Enter text in the input area
3. Click "Analyze Sentiment"
4. View the results showing sentiment classification, confidence score, and explanation
5. Sign in to save your analysis history

## License

MIT
