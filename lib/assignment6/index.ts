import type { ParsedProblem } from "@/lib/types";
import {
  solve_q1,
  solve_q2,
  solve_q3,
  solve_q4,
  solve_q5,
  solve_q6,
  solve_q7,
  solve_q8,
  solve_q9,
  solve_q10,
  solve_q11,
  solve_q12,
  solve_q13,
  solve_q14,
} from "@/lib/assignment6/solvers";

const ORDERED = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "q11",
  "q12",
  "q13",
  "q14",
] as const;
type QuestionKey = (typeof ORDERED)[number];
const REQUIRED_INPUT_COUNTS: Record<QuestionKey, number> = {
  q1: 6,
  q2: 7,
  q3: 1,
  q4: 5,
  q5: 11,
  q6: 5,
  q7: 2,
  q8: 6,
  q9: 2,
  q10: 5,
  q11: 4,
  q12: 3,
  q13: 4,
  q14: 7,
};

function numericValues(problem: ParsedProblem): number[] {
  return problem.extractedValues
    .map((v) => v.value)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
}

function solveQuestion(index: number, values: number[]): Record<string, number> {
  switch (index) {
    case 1:
      return solve_q1(values[0], values[1], values[2], values[3], values[4], values[5]);
    case 2:
      return solve_q2(values[0], values[1], values[2], values[3], values[4], values[5], values[6]);
    case 3:
      return solve_q3(values[0]);
    case 4:
      return solve_q4(values[0], values[1], values[2], values[3], values[4]);
    case 5:
      return solve_q5(
        values[0],
        values[1],
        values[2],
        values[3],
        values[4],
        values[5],
        values[6],
        values[7],
        values[8],
        values[9],
        values[10],
      );
    case 6:
      return solve_q6(values[0], values[1], values[2], values[3], values[4]);
    case 7:
      return solve_q7(values[0], values[1]);
    case 8:
      return solve_q8(values[0], values[1], values[2], values[3], values[4], values[5]);
    case 9:
      return solve_q9(values[0], values[1]);
    case 10:
      return solve_q10(values[0], values[1], values[2], values[3], values[4]);
    case 11:
      return solve_q11(values[0], values[1], values[2], values[3]);
    case 12:
      return solve_q12(values[0], values[1], values[2]);
    case 13:
      return solve_q13(values[0], values[1], values[2], values[3]);
    case 14:
      return solve_q14(values[0], values[1], values[2], values[3], values[4], values[5], values[6]);
    default:
      return {};
  }
}

export function runAssignment6SolveAll(problems: ParsedProblem[]) {
  const answers: Record<
    QuestionKey,
    | { ok: true; problemId: string; inputsUsed: number[]; results: Record<string, number> }
    | { ok: false; problemId: string | null; error: string }
  > = {} as Record<
    QuestionKey,
    | { ok: true; problemId: string; inputsUsed: number[]; results: Record<string, number> }
    | { ok: false; problemId: string | null; error: string }
  >;

  ORDERED.forEach((question, idx) => {
    const problem = problems[idx];
    if (!problem) {
      answers[question] = {
        ok: false,
        problemId: null,
        error: "No matching parsed problem found for this question.",
      };
      return;
    }

    const values = numericValues(problem);
    const required = REQUIRED_INPUT_COUNTS[question];
    if (values.length < required) {
      answers[question] = {
        ok: false,
        problemId: problem.problemId,
        error: `Insufficient numeric inputs extracted (${values.length}/${required}).`,
      };
      return;
    }

    try {
      const results = solveQuestion(idx + 1, values);
      const invalidResult = Object.values(results).some((v) => !Number.isFinite(v));
      if (invalidResult) {
        answers[question] = {
          ok: false,
          problemId: problem.problemId,
          error: "Solver produced non-finite output. Check parsed inputs.",
        };
        return;
      }
      answers[question] = {
        ok: true,
        problemId: problem.problemId,
        inputsUsed: values.slice(0, required),
        results,
      };
    } catch {
      answers[question] = {
        ok: false,
        problemId: problem.problemId,
        error: "Failed to solve from extracted values.",
      };
    }
  });

  return { ok: true, answers };
}
