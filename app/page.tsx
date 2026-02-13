"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ParseLonCapaResult } from "@/lib/types";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ParseLonCapaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setResult(payload as ParseLonCapaResult);
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
              Download JSON
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

          <h2>JSON Output</h2>
          <pre>{resultJson}</pre>
        </section>
      ) : null}
    </main>
  );
}
