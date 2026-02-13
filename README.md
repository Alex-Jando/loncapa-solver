# LON-CAPA PDF Extractor (Next.js)

This project is a Next.js (App Router + TypeScript) web app that:

- uploads a LON-CAPA exported assignment PDF
- extracts text server-side (in memory)
- splits content into problem blocks by problem ID headers
- extracts numeric values + units + context per problem
- displays results and supports JSON download

No credentials, no solving, local parsing on server per request, nothing stored.

## Tech Stack

- Next.js (App Router)
- TypeScript
- `pdf-parse` for PDF text extraction

## Project Structure

- `app/page.tsx`: upload UI, parse trigger, result rendering, JSON download
- `app/api/parse/route.ts`: multipart upload API route and PDF parsing entrypoint
- `lib/parseLonCapaPdf.ts`: core parser logic (normalize text, split blocks, extract values)
- `lib/types.ts`: output JSON types

## Install and Run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Usage

1. Upload a `.pdf` file.
2. Click `Parse PDF`.
3. Inspect assignment metadata and per-problem extracted values.
4. Click `Download JSON` to save structured output.

## API

`POST /api/parse` with `multipart/form-data`:

- field name: `file`
- accepts: PDF only

Response shape:

```json
{
  "assignmentMetadata": {
    "title": "Assignment 5",
    "assignmentNumber": 5
  },
  "problems": [
    {
      "problemId": "kn-prob2838.problem",
      "rawText": "...",
      "extractedValues": [
        {
          "raw": "0.952mm",
          "value": 0.952,
          "unit": "mm",
          "context": "...",
          "position": 123
        }
      ]
    }
  ]
}
```

## Parsing Notes

- Problem split regex (line-based, case-insensitive):
  - `^[a-z]{2}-prob[0-9]+[a-z]?\.problem$`
- Numeric parser supports:
  - decimals (e.g. `91.7`, `0.952`)
  - scientific notation (e.g. `7.00E-9`, `7.90E+28`)
- Unit normalization examples:
  - `uA` -> `µA`
  - `ohm`, `ohms` -> `Ω`
  - `ohm m`, `ohm.m`, `ohm·m` -> `Ω·m`
  - `A hr` -> `A·hr`

## Error Handling

- non-PDF upload -> `400`
- missing file field -> `400`
- empty file -> `400`
- PDF extracted text empty -> `422`
- unexpected parser/server failure -> `500`

