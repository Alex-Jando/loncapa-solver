"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface UploadCardProps {
  file: File | null;
  parseStatus: "idle" | "parsing" | "done" | "error";
  parseError: string | null;
  onFileSelect: (file: File | null) => void;
  onParse: () => void;
  onClear: () => void;
}

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export function UploadCard({ file, parseStatus, parseError, onFileSelect, onParse, onClear }: UploadCardProps) {
  const statusTone =
    parseStatus === "done"
      ? "text-emerald-600"
      : parseStatus === "error"
        ? "text-rose-600"
        : parseStatus === "parsing"
          ? "text-amber-500"
          : "text-slate-600";

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm uppercase tracking-wide text-slate-500">Upload</p>
      <div className="mb-4 mt-2 flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">Upload LON-CAPA PDF</h2>
        <Link
          href="/help/lon-capa-pdf"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:border-indigo-600 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
            <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-12.6c-1.57 0-2.6.9-2.7 2.3h1.5c.07-.58.48-.97 1.18-.97.68 0 1.12.37 1.12.9 0 .4-.24.7-.83 1.07-.92.58-1.5 1.1-1.45 2.27l.01.22h1.43v-.17c0-.61.2-.9.9-1.34.77-.49 1.42-1.09 1.42-2.18 0-1.34-1.08-2.1-2.58-2.1Zm-.02 8.76a.95.95 0 1 0 0-1.9.95.95 0 0 0 0 1.9Z" />
          </svg>
          How to get PDF
        </Link>
      </div>

      <motion.label
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.18 }}
        className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-indigo-600"
      >
        <input
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
        />
        <p className="text-sm font-medium text-slate-900">Drag and drop or click to upload</p>
        <p className="mt-1 text-xs text-slate-600">PDF only</p>
      </motion.label>

      <div className="mt-4 space-y-1 text-sm">
        <p className="text-slate-900">
          File: <span className="font-medium">{file ? file.name : "None selected"}</span>
        </p>
        <p className="text-slate-600">Size: {file ? formatFileSize(file.size) : "-"}</p>
        <p className={statusTone}>Status: {parseStatus}</p>
        {parseError ? <p className="text-rose-600">{parseError}</p> : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!file || parseStatus === "parsing"}
          onClick={onParse}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {parseStatus === "parsing" ? "Parsing..." : "Parse PDF"}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
        >
          Clear
        </button>
      </div>
    </motion.section>
  );
}

