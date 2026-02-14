"use client";

import { useMemo, useState } from "react";
import { ProblemsList } from "@/components/ProblemsList";
import { ResultsPanel } from "@/components/ResultsPanel";
import { SelectedProblemCard } from "@/components/SelectedProblemCard";
import { SolverPanel } from "@/components/SolverPanel";
import { ToastViewport } from "@/components/ToastViewport";
import { UploadCard } from "@/components/UploadCard";
import type { SolveAllResponse, ToastItem, ToastKind } from "@/components/ui-types";
import type { ParseLonCapaResult } from "@/lib/types";

function isAssignmentNumber(value: unknown): value is 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 {
  return (
    value === 1 ||
    value === 2 ||
    value === 3 ||
    value === 4 ||
    value === 5 ||
    value === 6 ||
    value === 7 ||
    value === 8 ||
    value === 9 ||
    value === 10
  );
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ParseLonCapaResult | null>(null);
  const [parseLoading, setParseLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const [solveAllLoading, setSolveAllLoading] = useState(false);
  const [solveAllError, setSolveAllError] = useState<string | null>(null);
  const [solveAllResponse, setSolveAllResponse] = useState<SolveAllResponse | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(5);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const parseStatus: "idle" | "parsing" | "done" | "error" = parseLoading
    ? "parsing"
    : parseError
      ? "error"
      : result
        ? "done"
        : "idle";

  const selectedProblem = useMemo(() => {
    if (!result || !selectedProblemId) {
      return null;
    }
    return result.problems.find((problem) => problem.problemId === selectedProblemId) ?? null;
  }, [result, selectedProblemId]);
  const parserDetectedAssignment = isAssignmentNumber(result?.assignmentMetadata.assignmentNumber)
    ? result.assignmentMetadata.assignmentNumber
    : null;

  function pushToast(message: string, kind: ToastKind = "info") {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3000);
  }

  async function handleParse() {
    if (!file) {
      pushToast("Choose a PDF file before parsing.", "error");
      setParseError("Choose a PDF file before parsing.");
      return;
    }

    setParseLoading(true);
    setParseError(null);
    setResult(null);
    setSolveAllResponse(null);
    setSolveAllError(null);

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
      setSelectedProblemId(parsed.problems[0]?.problemId ?? null);
      if (isAssignmentNumber(parsed.assignmentMetadata.assignmentNumber)) {
        setSelectedAssignment(parsed.assignmentMetadata.assignmentNumber);
      }
      pushToast("PDF parsed successfully.", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error.";
      setParseError(message);
      pushToast(message, "error");
    } finally {
      setParseLoading(false);
    }
  }

  async function handleSolveAll() {
    if (!result) {
      const message = "Parse a PDF first.";
      setSolveAllError(message);
      pushToast(message, "error");
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
      pushToast("Solve completed.", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected solve-all error.";
      setSolveAllError(message);
      pushToast(message, "error");
    } finally {
      setSolveAllLoading(false);
    }
  }

  async function copySolveAllResult() {
    if (!solveAllResponse) {
      return;
    }
    await navigator.clipboard.writeText(JSON.stringify(solveAllResponse, null, 2));
    pushToast("Copied all formatted results.", "info");
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
    pushToast("Downloaded solve JSON.", "info");
  }

  function resetAll() {
    setFile(null);
    setResult(null);
    setParseError(null);
    setSolveAllError(null);
    setSolveAllResponse(null);
    setSelectedProblemId(null);
    pushToast("Reset complete.", "info");
  }

  async function copyFormattedValue(value: string) {
    await navigator.clipboard.writeText(value);
    pushToast("Copied value.", "info");
  }

  return (
    <>
      <ToastViewport toasts={toasts} />
      <div className="grid w-full gap-6 lg:grid-cols-5">
        <section className="space-y-6 lg:col-span-2">
          <UploadCard
            file={file}
            parseStatus={parseStatus}
            parseError={parseError}
            onFileSelect={setFile}
            onParse={handleParse}
            onClear={resetAll}
          />
          <ProblemsList
            problems={result?.problems ?? []}
            selectedProblemId={selectedProblemId}
            onSelect={setSelectedProblemId}
          />
          <SelectedProblemCard problem={selectedProblem} />
        </section>
        <section className="space-y-6 lg:col-span-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">NO-CAPA Solver Workspace</h1>
            <p className="mt-2 text-sm text-slate-600">Extract. Map. Solve.</p>
          </section>
          <SolverPanel
            selectedAssignment={selectedAssignment}
            onAssignmentChange={setSelectedAssignment}
            assignmentLocked={parserDetectedAssignment !== null}
            onSolve={handleSolveAll}
            solving={solveAllLoading}
            disabled={!result}
          />
          <ResultsPanel
            response={solveAllResponse}
            error={solveAllError}
            onCopyAll={copySolveAllResult}
            onDownload={downloadSolveAllResult}
            onReset={() => {
              setSolveAllResponse(null);
              setSolveAllError(null);
              pushToast("Results reset.", "info");
            }}
            onCopyValue={copyFormattedValue}
          />
        </section>
      </div>
    </>
  );
}

