import { NextResponse } from "next/server";
import { runAssignment1SolveAll } from "@/lib/assignment1";
import { runAssignment2SolveAll } from "@/lib/assignment2";
import { runAssignment3SolveAll } from "@/lib/assignment3";
import { runAssignment4SolveAll } from "@/lib/assignment4";
import { runAssignment5SolveAll } from "@/lib/assignment5";
import { runAssignment6SolveAll } from "@/lib/assignment6";
import { runAssignment7SolveAll } from "@/lib/assignment7";
import { runAssignment8SolveAll } from "@/lib/assignment8";
import { runAssignment9SolveAll } from "@/lib/assignment9";
import { runAssignment10SolveAll } from "@/lib/assignment10";
import type { ParsedProblem } from "@/lib/types";

export const runtime = "nodejs";

interface SolveAllBody {
  assignmentNumber?: unknown;
  problems?: unknown;
}

function isParsedProblem(value: unknown): value is ParsedProblem {
  if (!value || typeof value !== "object") {
    return false;
  }
  const v = value as ParsedProblem;
  return (
    typeof v.problemId === "string" &&
    typeof v.rawText === "string" &&
    Array.isArray(v.extractedValues)
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SolveAllBody;
    if (!Array.isArray(body.problems)) {
      return NextResponse.json(
        { ok: false, error: "Invalid request: 'problems' must be an array." },
        { status: 400 },
      );
    }

    const problems = body.problems.filter(isParsedProblem);
    if (problems.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No valid parsed problems provided." },
        { status: 400 },
      );
    }

    let assignmentNumber: number | null = null;
    if (typeof body.assignmentNumber === "number" && Number.isFinite(body.assignmentNumber)) {
      assignmentNumber = Math.trunc(body.assignmentNumber);
    }

    if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(assignmentNumber ?? -1)) {
      return NextResponse.json(
        { ok: false, error: "Unsupported assignment. Currently supported: 1..10." },
        { status: 400 },
      );
    }

    let output;
    if (assignmentNumber === 1) output = runAssignment1SolveAll(problems);
    else if (assignmentNumber === 2) output = runAssignment2SolveAll(problems);
    else if (assignmentNumber === 3) output = runAssignment3SolveAll(problems);
    else if (assignmentNumber === 4) output = runAssignment4SolveAll(problems);
    else if (assignmentNumber === 5) output = runAssignment5SolveAll(problems);
    else if (assignmentNumber === 6) output = runAssignment6SolveAll(problems);
    else if (assignmentNumber === 7) output = runAssignment7SolveAll(problems);
    else if (assignmentNumber === 8) output = runAssignment8SolveAll(problems);
    else if (assignmentNumber === 9) output = runAssignment9SolveAll(problems);
    else output = runAssignment10SolveAll(problems);
    return NextResponse.json(output);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body. Expected { assignmentNumber, problems }." },
      { status: 400 },
    );
  }
}
