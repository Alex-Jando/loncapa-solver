import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              aria-label="Go to NO-CAPA homepage"
            >
              <Logo />
              <div>
                <p className="text-lg font-bold tracking-[0.12em]">NO-CAPA</p>
                <p className="text-xs text-slate-600">Extract. Map. Solve.</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-600">
              No login · No storage
            </span>
            <Link
              href="https://github.com/Alex-Jando/loncapa-solver"
              className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-indigo-600 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.25.82-.56l-.02-2.16c-3.34.72-4.04-1.42-4.04-1.42a3.2 3.2 0 0 0-1.34-1.77c-1.1-.75.08-.74.08-.74a2.54 2.54 0 0 1 1.85 1.25 2.59 2.59 0 0 0 3.53 1 2.57 2.57 0 0 1 .77-1.61c-2.67-.31-5.48-1.32-5.48-5.86a4.55 4.55 0 0 1 1.25-3.2 4.2 4.2 0 0 1 .12-3.16s1-.32 3.3 1.23a11.57 11.57 0 0 1 6 0c2.28-1.55 3.3-1.23 3.3-1.23a4.2 4.2 0 0 1 .12 3.16 4.55 4.55 0 0 1 1.25 3.2c0 4.55-2.82 5.54-5.5 5.85a2.9 2.9 0 0 1 .84 2.24l-.02 3.31c0 .31.22.68.83.56A12 12 0 0 0 12 .5Z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">{children}</main>

      <footer className="border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-600 sm:px-6">
        NO-CAPA does not log into LON-CAPA or submit answers. All inputs are user-provided via PDF.
      </footer>
    </div>
  );
}
