"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ParseLonCapaResult } from "@/lib/types";

type SolveAllAnswer =
  | {
      ok: true;
      problemId: string;
      inputsUsed: Record<string, number>;
      results: Record<string, number>;
    }
  | {
      ok: false;
      problemId: string | null;
      error: string;
      missing?: string[];
    };

interface SolveAllResponse {
  ok: true;
  answers: Record<string, SolveAllAnswer>;
  matchedProblems?: string[];
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ParseLonCapaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [solveAllLoading, setSolveAllLoading] = useState(false);
  const [solveAllError, setSolveAllError] = useState<string | null>(null);
  const [solveAllResponse, setSolveAllResponse] = useState<SolveAllResponse | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(5);

  const canParse = !!file && !loading;
  const resultJson = useMemo(() => (result ? JSON.stringify(result, null, 2) : ""), [result]);

  async function handleParse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Choose a PDF file before parsing.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSolveAllError(null);
    setSolveAllResponse(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      const rawResponse = await response.text();
      let payload: unknown = null;
      try {
        payload = rawResponse ? JSON.parse(rawResponse) : null;
      } catch {
        payload = null;
      }

      if (!response.ok) {
        const parsedError =
          payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error: unknown }).error)
            : null;
        const fallback = rawResponse
          ? `Parse request failed (${response.status}). ${rawResponse.slice(0, 180)}`
          : `Parse request failed (${response.status}).`;
        throw new Error(parsedError ?? fallback);
      }

      if (!payload || typeof payload !== "object") {
        throw new Error("Server returned invalid JSON.");
      }
      const parsed = payload as ParseLonCapaResult;
      setResult(parsed);
      if (
        parsed.assignmentMetadata.assignmentNumber === 1 ||
        parsed.assignmentMetadata.assignmentNumber === 2 ||
        parsed.assignmentMetadata.assignmentNumber === 3 ||
        parsed.assignmentMetadata.assignmentNumber === 4 ||
        parsed.assignmentMetadata.assignmentNumber === 5 ||
        parsed.assignmentMetadata.assignmentNumber === 6 ||
        parsed.assignmentMetadata.assignmentNumber === 7 ||
        parsed.assignmentMetadata.assignmentNumber === 8 ||
        parsed.assignmentMetadata.assignmentNumber === 9 ||
        parsed.assignmentMetadata.assignmentNumber === 10
      ) {
        setSelectedAssignment(parsed.assignmentMetadata.assignmentNumber);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadJson() {
    if (!result) {
      return;
    }

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lon-capa-extracted.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSolveAll() {
    if (!result) {
      setSolveAllError("Parse a PDF first.");
      return;
    }

    setSolveAllLoading(true);
    setSolveAllError(null);
    setSolveAllResponse(null);

    try {
      const response = await fetch("/api/solve-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentNumber: selectedAssignment,
          problems: result.problems,
        }),
      });

      const raw = await response.text();
      let payload: unknown = null;
      try {
        payload = raw ? JSON.parse(raw) : null;
      } catch {
        payload = null;
      }

      if (!response.ok) {
        const message =
          payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error: unknown }).error)
            : `Solve all request failed (${response.status}).`;
        throw new Error(message);
      }

      if (!payload || typeof payload !== "object") {
        throw new Error("Solve all API returned invalid JSON.");
      }

      setSolveAllResponse(payload as SolveAllResponse);
    } catch (err) {
      setSolveAllError(err instanceof Error ? err.message : "Unexpected solve-all error.");
    } finally {
      setSolveAllLoading(false);
    }
  }

  async function copySolveAllResult() {
    if (!solveAllResponse) {
      return;
    }
    await navigator.clipboard.writeText(JSON.stringify(solveAllResponse, null, 2));
  }

  function downloadSolveAllResult() {
    if (!solveAllResponse) {
      return;
    }
    const blob = new Blob([JSON.stringify(solveAllResponse, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assignment${selectedAssignment}-solve-all.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <h1>LON-CAPA PDF Value Extractor</h1>
      <p className="subtitle">Upload a LON-CAPA assignment PDF and extract numeric values + units.</p>

      <section className="card">
        <form onSubmit={handleParse}>
          <div className="controls">
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <button type="submit" disabled={!canParse}>
              {loading ? "Parsing..." : "Parse PDF"}
            </button>
            <button type="button" onClick={handleDownloadJson} disabled={!result || loading}>
              Download Parsed JSON
            </button>
          </div>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </section>

      {result ? (
        <section className="card">
          <h2>Assignment Metadata</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Assignment Number</th>
                <th>Problems Detected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{result.assignmentMetadata.title ?? "-"}</td>
                <td>{result.assignmentMetadata.assignmentNumber ?? "-"}</td>
                <td>{result.problems.length}</td>
              </tr>
            </tbody>
          </table>

          <div className="controls top-gap">
            <label htmlFor="assignment-picker" className="field-label">
              Solver Assignment
            </label>
            <select
              id="assignment-picker"
              value={selectedAssignment}
              onChange={(e) =>
                setSelectedAssignment(
                  Number.parseInt(e.target.value, 10) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
                )
              }
            >
              <option value={1}>Assignment 1</option>
              <option value={2}>Assignment 2</option>
              <option value={3}>Assignment 3</option>
              <option value={4}>Assignment 4</option>
              <option value={5}>Assignment 5</option>
              <option value={6}>Assignment 6</option>
              <option value={7}>Assignment 7</option>
              <option value={8}>Assignment 8</option>
              <option value={9}>Assignment 9</option>
              <option value={10}>Assignment 10</option>
            </select>
            <button type="button" onClick={handleSolveAll} disabled={solveAllLoading}>
              {solveAllLoading ? "Solving all..." : `Solve All (Assignment ${selectedAssignment})`}
            </button>
            <button
              type="button"
              onClick={copySolveAllResult}
              disabled={!solveAllResponse || solveAllLoading}
            >
              Copy All Answers
            </button>
            <button
              type="button"
              onClick={downloadSolveAllResult}
              disabled={!solveAllResponse || solveAllLoading}
            >
              Download All Answers JSON
            </button>
          </div>

          {solveAllError ? <p className="error">{solveAllError}</p> : null}

          {solveAllResponse ? (
            <article className="card">
              <h3>All Answers</h3>
              <table>
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Problem</th>
                    <th>Status</th>
                    <th>Outputs</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(solveAllResponse.answers).map(([question, answer]) => (
                    <tr key={question}>
                      <td className="mono">{question}</td>
                      <td className="mono">{answer.problemId ?? "-"}</td>
                      <td>{answer.ok ? "Solved" : "Error"}</td>
                      <td>
                        {answer.ok ? (
                          <pre>{JSON.stringify(answer.results, null, 2)}</pre>
                        ) : (
                          <div>
                            {answer.error}
                            {answer.missing && answer.missing.length > 0
                              ? ` Missing: ${answer.missing.join(", ")}`
                              : ""}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3>Raw Solve-All JSON</h3>
              <pre>{JSON.stringify(solveAllResponse, null, 2)}</pre>
            </article>
          ) : null}

          <h2>Problems</h2>
          {result.problems.length === 0 ? <p>No problem blocks detected.</p> : null}
          {result.problems.map((problem) => (
            <article key={problem.problemId} className="card">
              <h3 className="problem-title mono">{problem.problemId}</h3>
              <details>
                <summary>Show raw text</summary>
                <pre>{problem.rawText}</pre>
              </details>

              <table>
                <thead>
                  <tr>
                    <th>raw</th>
                    <th>value</th>
                    <th>unit</th>
                    <th>context</th>
                    <th>position</th>
                  </tr>
                </thead>
                <tbody>
                  {problem.extractedValues.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No values detected in this block.</td>
                    </tr>
                  ) : (
                    problem.extractedValues.map((item, index) => (
                      <tr key={`${problem.problemId}-${index}-${item.position ?? 0}`}>
                        <td className="mono">{item.raw}</td>
                        <td>{item.value ?? "-"}</td>
                        <td className="mono">{item.unit ?? "-"}</td>
                        <td>{item.context}</td>
                        <td>{item.position ?? "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </article>
          ))}

          <h2>Parsed JSON</h2>
          <pre>{resultJson}</pre>
        </section>
      ) : null}
    </main>
  );
}
