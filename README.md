# VC Intelligence Interface

A premium VC Sourcing & Intelligence platform designed for modern investment teams. This interface allows you to discover, track, and enrich company profiles using AI-powered scraping and analysis.

## Features

- **Live AI Enrichment**: Scrape company websites in real-time using Jina AI & Gemini to extract summaries, capabilities, keywords, and derived signals.
- **Smart Discovery**: Search and filter through thousands of startups with advanced filtering by industry, stage, and location.
- **Curated Lists**: Organize companies into custom collections for easy tracking and collaboration.
- **Saved Searches**: Save your complex search queries and re-run them with one click.
- **Interactive Profiles**: Build a knowledge base with private notes and AI-generated insights for every company.
- **Export Capabilities**: Export your curated lists as JSON for further analysis.
- **Premium UX**: High-performance interface with dark mode, glassmorphism, and smooth animations.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, Prisma (PostgreSQL).
- **AI/Extraction**: Google Gemini 1.5 Flash, Jina AI Read API.
- **Auth**: JWT-based authentication with bcrypt password hashing.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Gemini API Key

### Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/vcdb"
   GEMINI_API_KEY="your_gemini_api_key_here"
   JWT_SECRET="your_secret_here"
   PORT=5000
   ```
4. Run Prisma migrations: `npx prisma db push`
5. Seed the database (optional): `npm run seed`
6. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```
4. Start the development server: `npm run dev`

## Implementation Notes

- **Enrichment Logic**: The app uses `r.jina.ai` to convert websites to clean markdown, which is then processed by Gemini to extract structured insights.
- **Security**: All AI processing and API keys are handled server-side. Authentication is required for all data-accessing routes.
- **Data Persistence**: Uses PostgreSQL for robust data management, including relational mapping for lists and notes.

---
Built for the Xartup Fellowship Assignment.
