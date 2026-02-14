"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ToastItem } from "@/components/ui-types";

interface ToastViewportProps {
  toasts: ToastItem[];
}

const toneMap = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-indigo-200 bg-indigo-50 text-indigo-700",
} as const;

export function ToastViewport({ toasts }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow-sm ${toneMap[toast.kind]}`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

