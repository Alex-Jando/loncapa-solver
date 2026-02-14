import { NextResponse } from "next/server";
import { assignmentOutputUnits } from "@/lib/assignments/outputUnits";
import { wrapSolverOutput } from "@/lib/formatSolverOutput";
import { solverRegistry } from "@/lib/solverRegistry";

export const runtime = "nodejs";

type SolveInput = number | { value: number; raw?: string };

interface SolveBody {
  assignmentId?: unknown;
  questionId?: unknown;
  inputs?: unknown;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseInputs(
  value: unknown,
): { ok: true; inputs: Record<string, SolveInput> } | { ok: false; error: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "Invalid request: 'inputs' must be an object." };
  }

  const out: Record<string, SolveInput> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (isFiniteNumber(item)) {
      out[key] = item;
      continue;
    }
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const inputObj = item as { value?: unknown; raw?: unknown };
      if (!isFiniteNumber(inputObj.value)) {
        return { ok: false, error: `Invalid numeric value for input '${key}'.` };
      }
      if (inputObj.raw !== undefined && typeof inputObj.raw !== "string") {
        return { ok: false, error: `Invalid raw string for input '${key}'.` };
      }
      out[key] = {
        value: inputObj.value,
        raw: inputObj.raw,
      };
      continue;
    }
    return { ok: false, error: `Invalid input format for '${key}'.` };
  }

  return { ok: true, inputs: out };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SolveBody;
    if (typeof body.assignmentId !== "string" || typeof body.questionId !== "string") {
      return NextResponse.json(
        { ok: false, error: "Invalid request: expected { assignmentId, questionId, inputs }." },
        { status: 400 },
      );
    }

    const assignmentId = body.assignmentId.toLowerCase();
    const questionId = body.questionId.toLowerCase();

    const assignment = solverRegistry[assignmentId];
    if (!assignment) {
      return NextResponse.json(
        { ok: false, error: "Unsupported assignmentId. Expected a1..a10." },
        { status: 400 },
      );
    }

    const solver = assignment[questionId];
    if (!solver) {
      return NextResponse.json(
        { ok: false, error: `Unsupported questionId for ${assignmentId}.` },
        { status: 400 },
      );
    }

    const parsedInputs = parseInputs(body.inputs);
    if (!parsedInputs.ok) {
      return NextResponse.json({ ok: false, error: parsedInputs.error }, { status: 400 });
    }

    const missing: string[] = [];
    const orderedArgs: number[] = [];
    for (const key of solver.requiredKeys) {
      const input = parsedInputs.inputs[key];
      if (input === undefined) {
        missing.push(key);
        continue;
      }
      if (typeof input === "number") {
        orderedArgs.push(input);
      } else {
        orderedArgs.push(input.value);
      }
    }

    if (missing.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Missing required inputs.", missing },
        { status: 400 },
      );
    }

    const rawResults = solver.solve(orderedArgs);
    const invalidResult = Object.values(rawResults).some((value) => !Number.isFinite(value));
    if (invalidResult) {
      return NextResponse.json(
        { ok: false, error: "Solver produced non-finite output." },
        { status: 400 },
      );
    }

    const wrapped = wrapSolverOutput(
      assignmentId,
      questionId,
      rawResults,
      assignmentOutputUnits,
    );

    return NextResponse.json({
      ok: true,
      assignmentId,
      questionId,
      sigFigsUsed: wrapped.sigFigsUsed,
      results: wrapped.results,
      resultsObjectFormatted: wrapped.resultsObjectFormatted,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body. Expected { assignmentId, questionId, inputs }." },
      { status: 400 },
    );
  }
}
