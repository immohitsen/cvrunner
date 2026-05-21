# CVRunner

CVRunner is an AI-powered resume analyzer designed to help candidates optimize their resumes for Applicant Tracking Systems (ATS) and human recruiters. It performs semantic analysis to match your experience directly against a target job description.

## Key Features

- **ATS Compatibility Scoring**: Generates a score based on style, brevity, impact, and skill alignment.
- **Skill Gap Analysis**: Identifies critical missing keywords/skills and highlights matched qualifications.
- **Actionable Suggestions**: Provides specific before/after rewrites for impact and clarity.
- **Responsive Workspace**: Clean dashboard layout with a toggleable tab bar for mobile viewports.
- **Privacy First**: Resumes are parsed in-memory and immediately discarded after analysis.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **Icons**: Phosphor Icons
- **AI Processing**: Llama 3.3 (via Groq API)

## Getting Started

### Prerequisites

You will need Node.js installed and a Groq API key.

### Setup & Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
