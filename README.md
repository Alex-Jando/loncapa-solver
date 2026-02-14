# NO-CAPA

Extract. Map. Solve.

NO-CAPA is a student-friendly web app for working through LON-CAPA assignments from exported PDFs. It helps you upload a LON-CAPA PDF, extract numeric values from each problem, and run assignment solvers to get formatted outputs in one place.

## What NO-CAPA does

- Uploads a LON-CAPA PDF in the browser UI.
- Parses assignment metadata and problem blocks from PDF text.
- Extracts numeric values, units, and nearby context from each detected problem.
- Supports solve-all workflows for Assignments 1 through 10.
- Formats solver outputs in scientific notation with units.
- Applies a consistent 3-significant-figure output format across solver results.
- Provides a modern single-page UI with responsive layout, toasts, and animated transitions.
- Includes a built-in help page showing how to download a LON-CAPA PDF.

## What NO-CAPA does NOT do

- It does not log into LON-CAPA.
- It does not submit answers to LON-CAPA.
- It does not store account credentials.
- It does not scrape courses or assignments from your account.
- It does not provide per-question manual input mapping UI in the current version; solving uses extracted values through the solve-all flow.

## How it works

1. Upload a LON-CAPA PDF.
2. NO-CAPA extracts values from each detected problem.
3. Pick the assignment (auto-locked when detected by parser) and review a selected problem.
4. Confirm extracted information by checking the detected values shown in the UI.
5. Run solve-all and review formatted results.

## Features

### PDF parsing
NO-CAPA includes an API route for parsing uploaded PDFs in memory. It normalizes text, splits problem blocks, and extracts assignment metadata when available. Extracted values include raw token text, numeric value, unit, and context.

### Value review in UI
The main page shows detected problems in a list and lets you inspect a selected problem. You can view raw problem text and extracted value rows before solving. This helps you verify what the parser captured.

### Solver system
The app currently uses a solve-all API flow for assignments 1 to 10. Each assignment has TypeScript solver modules and assignment runners. The UI sends parsed problems plus assignment number to `/api/solve-all` and displays grouped outputs by question.

### Significant-figure handling
Output precision is currently standardized to 3 significant figures in the shared formatting pipeline. This is applied consistently in solver output presentation.

### Output formatting
Solver outputs are displayed in scientific notation with units, along with a formatted results object. Output units are managed via metadata mapping by assignment/question/result key.

### UI/UX highlights
The interface is built around a two-column workspace on desktop and stacked sections on mobile. It uses Tailwind CSS for styling and Framer Motion for subtle transitions. Toast notifications are used for parse/solve/copy/download feedback.

## Tech stack

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS
- Framer Motion
- pdf-parse (PDF text extraction)

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser:

`http://localhost:3000`

Notes:
- No special database setup is required.
- A modern Node.js environment is expected (project uses current Next.js + TypeScript tooling).

## Project status / scope

NO-CAPA is an evolving study tool focused on PDF-driven extraction and solve-all assignment workflows. The current scope emphasizes reliable extraction, consistent output formatting, and a clear UI for reviewing parsed data and results.

## Disclaimer

NO-CAPA is a study/support tool. You are responsible for using it in ways that follow your course and institution policies.

## Closing note

If this tool helps your workflow, explore the code and adapt it to your classes. Feedback and iterative improvements are a natural part of this project.
