export type SolveAllAnswer =
  | {
      ok: true;
      problemId: string;
      inputsUsed: Record<string, number> | number[];
      rawResults: Record<string, number>;
      sigFigsUsed: number;
      results: Array<{
        key: string;
        value: number;
        unit: string | null;
        formatted: string;
      }>;
      resultsObjectFormatted: Record<string, string>;
    }
  | {
      ok: false;
      problemId: string | null;
      error: string;
      missing?: string[];
    };

export interface SolveAllResponse {
  ok: true;
  assignmentId?: string;
  answers: Record<string, SolveAllAnswer>;
  matchedProblems?: string[];
}

export type ToastKind = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

