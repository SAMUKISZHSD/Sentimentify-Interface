# Sentimentify - ML-Powered Sentiment Analysis Tool

## Overview

Sentimentify is a modern web application that analyzes the emotional tone of text using OpenAI's ChatGPT API. The application provides users with instant insights into whether text has a positive, negative, or neutral sentiment, along with confidence scores and explanations.

## Features

- **Text Analysis**: Enter any text to analyze its emotional tone
- **ML Processing**: Advanced machine learning model processes your text using OpenAI's API
- **Sentiment Scoring**: Get precise sentiment scores with confidence metrics
- **Instant Results**: See results in seconds with visual indicators (😊/😐/☹️)
- **Language Detection**: Automatically detects the language of the input text
- **Analysis History**: View and reload previous analyses (requires authentication)
- **User Authentication**: Secure sign-up and sign-in functionality

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI/ML**: OpenAI ChatGPT API
- **Styling**: Tailwind CSS with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase and OpenAI API credentials

### Running the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Project Structure

- `/src/components/sentiment-analyzer.tsx` - Main sentiment analysis component
- `/src/lib/openai.ts` - OpenAI API integration
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
