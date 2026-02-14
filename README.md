# LON-CAPA Assignment Extractor + Solver (Next.js)

This is a Next.js (App Router + TypeScript) app that:

- uploads a LON-CAPA exported PDF
- extracts problem blocks and numeric values with units/context
- runs a single `Solve All` flow for:
  - Assignment 1 (`q1`..`q9`)
  - Assignment 2 (`q1`..`q11`)
  - Assignment 3 (`q1`..`q11`)
  - Assignment 4 (`q1`..`q9`)
  - Assignment 5 (`q1`..`q12`)
  - Assignment 6 (`q1`..`q14`)
  - Assignment 7 (`q1`..`q10`)
  - Assignment 8 (`q1`..`q9`)
  - Assignment 9 (`q1`..`q10`)
  - Assignment 10 (`q1`..`q9`)

Everything runs in Next.js only. No Python, no process spawning, no login/scraping/submission.

## Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main flow

1. Upload a PDF and click `Parse PDF`.
2. Confirm/select solver assignment (`1`..`10`).
3. Click `Solve All`.
4. Review the all-answers table / JSON.
5. Use `Copy All Answers` or `Download All Answers JSON`.

## API routes

### `POST /api/parse`

- Content type: `multipart/form-data`
- Field: `file`
- Returns extracted assignment metadata and problems.

### `POST /api/solve-all`

- Content type: `application/json`
- Body:

```json
{
  "assignmentNumber": 1,
  "problems": [/* parsed problems from /api/parse */]
}
```

- Response:
  - `{ "ok": true, "answers": { ... } }`
  - Each question entry contains either solved `results` + `inputsUsed` or an error with missing inputs.

## Project structure

- `app/page.tsx`: PDF parse UI + solve-all output UI
- `app/api/parse/route.ts`: in-memory PDF parsing route
- `app/api/solve-all/route.ts`: solve-all route for assignments 1..10
- `lib/assignment1/solvers.ts`: pure TypeScript solver functions for Assignment 1
- `lib/assignment1/index.ts`: Assignment 1 solve-all matcher/runner
- `lib/assignment2/solvers.ts`: pure TypeScript solver functions for Assignment 2
- `lib/assignment2/index.ts`: Assignment 2 solve-all matcher/runner
- `lib/assignment3/solvers.ts`: pure TypeScript solver functions for Assignment 3
- `lib/assignment3/index.ts`: Assignment 3 solve-all matcher/runner
- `lib/assignment4/solvers.ts`: pure TypeScript solver functions for Assignment 4
- `lib/assignment4/index.ts`: Assignment 4 solve-all matcher/runner
- `lib/parseLonCapaPdf.ts`: text normalization, block splitting, value extraction
- `lib/assignment5/solvers.ts`: pure TypeScript solver functions for Assignment 5
- `lib/assignment5/index.ts`: Assignment 5 solve-all matcher/runner
- `lib/assignment6/solvers.ts`: pure TypeScript solver functions for Assignment 6
- `lib/assignment6/index.ts`: Assignment 6 solve-all runner
- `lib/assignment7/solvers.ts`: pure TypeScript solver functions for Assignment 7
- `lib/assignment7/index.ts`: Assignment 7 solve-all runner
- `lib/assignment8/solvers.ts`: pure TypeScript solver functions for Assignment 8
- `lib/assignment8/index.ts`: Assignment 8 solve-all runner
- `lib/assignment9/solvers.ts`: pure TypeScript solver functions for Assignment 9
- `lib/assignment9/index.ts`: Assignment 9 solve-all runner
- `lib/assignment10/solvers.ts`: pure TypeScript solver functions for Assignment 10
- `lib/assignment10/index.ts`: Assignment 10 solve-all runner

## Security and storage notes

- No LON-CAPA login automation
- No scraping or submission
- No persistent PDF storage
- PDFs are parsed in memory per request
