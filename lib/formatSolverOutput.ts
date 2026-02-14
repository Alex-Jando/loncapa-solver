import { DEFAULT_SIG_FIGS, formatScientific } from "@/lib/sigfig";

export type AssignmentOutputUnits = Record<
  string,
  Record<string, Record<string, string | null>>
>;

export interface WrappedSolverResultItem {
  key: string;
  value: number;
  unit: string | null;
  formatted: string;
}

export function wrapSolverOutput(
  assignmentId: string,
  questionId: string,
  rawResults: Record<string, number>,
  outputUnitMap: AssignmentOutputUnits,
): {
  sigFigsUsed: number;
  results: WrappedSolverResultItem[];
  resultsObjectFormatted: Record<string, string>;
} {
  const sigFigsUsed = DEFAULT_SIG_FIGS;
  const questionUnits = outputUnitMap[assignmentId]?.[questionId] ?? {};
  const results: WrappedSolverResultItem[] = [];
  const resultsObjectFormatted: Record<string, string> = {};

  for (const [key, value] of Object.entries(rawResults)) {
    const unit = questionUnits[key] ?? null;
    const sci = formatScientific(value, sigFigsUsed);
    const formatted = unit ? `${sci} ${unit}` : sci;
    results.push({ key, value, unit, formatted });
    resultsObjectFormatted[key] = formatted;
  }

  return {
    sigFigsUsed,
    results,
    resultsObjectFormatted,
  };
}
