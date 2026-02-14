"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ParsedProblem } from "@/lib/types";

interface SelectedProblemCardProps {
  problem: ParsedProblem | null;
}

export function SelectedProblemCard({ problem }: SelectedProblemCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={problem?.problemId ?? "empty"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p className="text-sm uppercase tracking-wide text-slate-500">Selected Problem</p>
        {problem ? (
          <>
            <h2 className="mt-2 font-mono text-sm text-slate-900">{problem.problemId}</h2>
            <p className="mt-1 text-sm text-slate-600">{problem.extractedValues.length} extracted values</p>

            <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <summary className="cursor-pointer text-sm font-medium text-slate-700">Raw problem text</summary>
              <pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs text-slate-600">{problem.rawText}</pre>
            </details>

            <div className="mt-4 overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Raw</th>
                    <th className="py-2 pr-3">Value</th>
                    <th className="py-2">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {problem.extractedValues.slice(0, 8).map((item, idx) => (
                    <tr key={`${problem.problemId}-${idx}`} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-3 font-mono text-xs">{item.raw}</td>
                      <td className="py-2 pr-3">{item.value ?? "-"}</td>
                      <td className="py-2 font-mono text-xs">{item.unit ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-600">Parse a PDF and choose a problem from the left column.</p>
        )}
      </motion.section>
    </AnimatePresence>
  );
}

