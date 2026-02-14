"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { SolveAllResponse } from "@/components/ui-types";

interface ResultsPanelProps {
  response: SolveAllResponse | null;
  error: string | null;
  onCopyAll: () => void;
  onDownload: () => void;
  onReset: () => void;
  onCopyValue: (value: string) => void;
}

export function ResultsPanel({
  response,
  error,
  onCopyAll,
  onDownload,
  onReset,
  onCopyValue,
}: ResultsPanelProps) {
  function questionSort(a: string, b: string): number {
    const ma = a.match(/\d+/);
    const mb = b.match(/\d+/);
    const na = ma ? Number.parseInt(ma[0], 10) : Number.POSITIVE_INFINITY;
    const nb = mb ? Number.parseInt(mb[0], 10) : Number.POSITIVE_INFINITY;
    if (na !== nb) {
      return na - nb;
    }
    return a.localeCompare(b);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm uppercase tracking-wide text-slate-500">Results</p>
      <h2 className="mt-2 text-lg font-semibold">Assignment Outputs</h2>

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <AnimatePresence initial={false}>
        {response ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4"
          >
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              Solve successful.
            </div>

            <div className="overflow-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Output</th>
                    <th className="px-3 py-2">Formatted Value</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(response.answers)
                    .sort(([a], [b]) => questionSort(a, b))
                    .flatMap(([questionId, answer]) => {
                    const rows: ReactNode[] = [
                      <tr key={`${questionId}-group`} className="border-t border-slate-200 bg-slate-100">
                        <td className="px-3 py-2 font-mono text-xs font-semibold text-slate-700">{questionId}</td>
                        <td className="px-3 py-2 text-xs text-slate-600" colSpan={2}></td>
                      </tr>,
                    ];

                    if (!answer.ok) {
                      rows.push(
                        <tr key={`${questionId}-error`} className="border-t border-slate-100 align-top">
                          <td className="px-3 py-2 font-mono text-xs text-rose-600">-</td>
                          <td className="px-3 py-2 text-rose-600" colSpan={2}>
                            {answer.error}
                          </td>
                        </tr>,
                      );
                      return rows;
                    }

                    rows.push(...answer.results.map((item) => (
                      <tr key={`${questionId}-${item.key}`} className="border-t border-slate-100 align-top">
                        <td className="px-3 py-2 font-mono text-xs text-slate-700">{item.key}</td>
                        <td className="px-3 py-2 font-mono text-xs text-slate-900">{item.formatted}</td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => onCopyValue(item.formatted)}
                            className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700 transition hover:border-indigo-600 hover:text-indigo-600"
                          >
                            Copy
                          </button>
                        </td>
                      </tr>
                    )));
                    return rows;
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCopyAll}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-indigo-600 hover:text-indigo-600"
              >
                Copy all formatted results
              </button>
              <button
                type="button"
                onClick={onDownload}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-indigo-600 hover:text-indigo-600"
              >
                Download JSON
              </button>
              <button
                type="button"
                onClick={onReset}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-rose-500 hover:text-rose-600"
              >
                Reset results
              </button>
            </div>

            <details className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <summary className="cursor-pointer text-sm font-medium text-slate-700">Raw JSON</summary>
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-slate-700">
                {JSON.stringify(response, null, 2)}
              </pre>
            </details>
          </motion.div>
        ) : (
          <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-slate-600">
            No results yet. Parse a PDF and run the solver.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

