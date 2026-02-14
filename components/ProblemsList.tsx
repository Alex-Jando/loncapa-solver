"use client";

import { motion } from "framer-motion";
import type { ParsedProblem } from "@/lib/types";

interface ProblemsListProps {
  problems: ParsedProblem[];
  selectedProblemId: string | null;
  onSelect: (problemId: string) => void;
}

export function ProblemsList({ problems, selectedProblemId, onSelect }: ProblemsListProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm uppercase tracking-wide text-slate-500">Problems</p>
      <h2 className="mt-2 text-lg font-semibold">Detected Problems</h2>
      <p className="mt-1 text-sm text-slate-600">Select one to inspect extracted values.</p>

      <div className="mt-4 space-y-2">
        {problems.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No problems parsed yet.</p>
        ) : (
          problems.map((problem) => {
            const active = selectedProblemId === problem.problemId;
            return (
              <motion.button
                key={problem.problemId}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.18 }}
                onClick={() => onSelect(problem.problemId)}
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                  active
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs">{problem.problemId}</span>
                  <span className="text-xs text-slate-500">{problem.extractedValues.length} values</span>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </motion.section>
  );
}

