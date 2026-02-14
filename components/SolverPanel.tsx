"use client";

import { motion } from "framer-motion";

interface SolverPanelProps {
  selectedAssignment: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  onAssignmentChange: (value: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) => void;
  assignmentLocked: boolean;
  onSolve: () => void;
  solving: boolean;
  disabled: boolean;
}

export function SolverPanel({
  selectedAssignment,
  onAssignmentChange,
  assignmentLocked,
  onSolve,
  solving,
  disabled,
}: SolverPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm uppercase tracking-wide text-slate-500">Solver</p>
      <h2 className="mt-2 text-lg font-semibold">Solve with NO-CAPA</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Assignment Number</span>
          <select
            value={selectedAssignment}
            onChange={(e) => onAssignmentChange(Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)}
            disabled={assignmentLocked}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
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
          {assignmentLocked ? (
            <p className="mt-2 text-xs text-slate-500">Locked to parser-detected assignment.</p>
          ) : null}
        </label>
      </div>

      <div className="sticky bottom-3 mt-6 border-t border-slate-200 bg-white/95 pt-4 backdrop-blur">
        <button
          type="button"
          onClick={onSolve}
          disabled={disabled || solving}
          className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {solving ? "Solving..." : `Solve Assignment ${selectedAssignment}`}
        </button>
      </div>
    </motion.section>
  );
}

