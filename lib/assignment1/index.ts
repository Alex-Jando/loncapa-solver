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
} from "@/lib/assignment1/solvers";
import type { ParsedProblem } from "@/lib/types";

type QuestionKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9";

type SolveOk = {
  ok: true;
  problemId: string;
  inputsUsed: Record<string, number>;
  results: Record<string, number>;
};

type SolveErr = {
  ok: false;
  problemId: string | null;
  error: string;
  missing?: string[];
};

const ORDERED_QUESTIONS: QuestionKey[] = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"];

const questionSignatures: Record<QuestionKey, RegExp[]> = {
  q1: [/net force/i, /located at the origin/i],
  q2: [/point between the two charges/i, /force on it is zero/i],
  q3: [/charged cork ball/i, /xcomponent/i, /ycomponent/i],
  q4: [/styrofoam balls/i, /equilateral triangle/i],
  q5: [/two small spheres/i, /uniform electric field/i, /enable the spheres/i],
  q6: [/three point charges are arranged/i, /x- and y-components/i],
  q7: [/aligned along thexaxis/i, /L ?1/i, /L ?2/i, /electric field at the position/i],
  q8: [/electric dipole/i, /what is the charge q/i],
  q9: [/an electron is launched/i, /lands d=/i, /electric field strength inside the capacitor/i],
};

function normalizeUnit(unit: string | null): string {
  return (unit ?? "").toLowerCase().replace(/\s+/g, "");
}

function asC(value: number, unit: string | null): number {
  const normalized = normalizeUnit(unit);
  if (normalized === "nc") {
    return value * 1e-9;
  }
  return value;
}

function asKg(value: number, unit: string | null): number {
  const normalized = normalizeUnit(unit);
  if (normalized === "g") {
    return value / 1000;
  }
  return value;
}

function asM(value: number, unit: string | null): number {
  const normalized = normalizeUnit(unit);
  if (normalized === "cm") {
    return value / 100;
  }
  if (normalized === "mm") {
    return value / 1000;
  }
  return value;
}

function findQuestionForProblem(problem: ParsedProblem): QuestionKey | null {
  const text = problem.rawText;
  let best: { question: QuestionKey; score: number } | null = null;

  for (const question of ORDERED_QUESTIONS) {
    const signatures = questionSignatures[question];
    let score = 0;
    for (const regex of signatures) {
      if (regex.test(text)) {
        score += 1;
      }
    }

    if (score === 0) {
      continue;
    }
    if (!best || score > best.score) {
      best = { question, score };
    }
  }

  return best?.question ?? null;
}

function collectValues(problem: ParsedProblem, predicate: (unit: string, raw: string, context: string) => boolean) {
  return problem.extractedValues.filter((item) => {
    if (typeof item.value !== "number" || !Number.isFinite(item.value)) {
      return false;
    }
    const unit = normalizeUnit(item.unit);
    return predicate(unit, item.raw, item.context);
  });
}

function extractInputsForQuestion(question: QuestionKey, problem: ParsedProblem) {
  const missing: string[] = [];
  const out: Record<string, number> = {};

  const chargeCandidates = collectValues(problem, (unit) => unit === "c" || unit === "nc");
  const meterCandidates = collectValues(problem, (unit) => unit === "m");
  const cmCandidates = collectValues(problem, (unit) => unit === "cm");
  const mmCandidates = collectValues(problem, (unit) => unit === "mm");
  const gramCandidates = collectValues(problem, (unit) => unit === "g");
  const fieldCandidates = collectValues(problem, (unit) => unit === "n/c");
  const degCandidates = collectValues(problem, (unit, raw) => unit === "deg" || /(theta|alpha|θ|α)\s*=/.test(raw));
  const speedCandidates = collectValues(problem, (unit) => unit === "m/s");

  if (question === "q1") {
    if (chargeCandidates.length < 3) missing.push("q1_c,q2_c,q3_c");
    if (meterCandidates.length < 2) missing.push("x1_m,x2_m");
    if (missing.length === 0) {
      out.q1_c = asC(chargeCandidates[0].value!, chargeCandidates[0].unit);
      out.q2_c = asC(chargeCandidates[1].value!, chargeCandidates[1].unit);
      out.q3_c = asC(chargeCandidates[2].value!, chargeCandidates[2].unit);
      out.x1_m = meterCandidates[0].value!;
      out.x2_m = meterCandidates[1].value!;
    }
    return { missing, inputs: out };
  }

  if (question === "q2") {
    if (chargeCandidates.length < 2) missing.push("q1_c,q2_c");
    if (meterCandidates.length < 1) missing.push("x1_m");
    if (missing.length === 0) {
      out.q1_c = asC(chargeCandidates[0].value!, chargeCandidates[0].unit);
      out.q2_c = asC(chargeCandidates[1].value!, chargeCandidates[1].unit);
      out.x1_m = meterCandidates[0].value!;
    }
    return { missing, inputs: out };
  }

  if (question === "q3") {
    if (gramCandidates.length < 1) missing.push("mass");
    if (fieldCandidates.length < 2) missing.push("x_comp,y_comp");
    if (degCandidates.length < 1) missing.push("theta_deg");
    if (missing.length === 0) {
      out.mass_kg = asKg(gramCandidates[0].value!, gramCandidates[0].unit);
      out.x_comp_N_C = fieldCandidates[0].value!;
      out.y_comp_N_C = fieldCandidates[1].value!;
      out.theta_deg = degCandidates[0].value!;
    }
    return { missing, inputs: out };
  }

  if (question === "q4") {
    if (gramCandidates.length < 1) missing.push("mass");
    if (cmCandidates.length < 2) missing.push("length,side");
    if (missing.length === 0) {
      out.mass_kg = asKg(gramCandidates[0].value!, gramCandidates[0].unit);
      out.length_m = asM(cmCandidates[0].value!, cmCandidates[0].unit);
      out.side_m = asM(cmCandidates[1].value!, cmCandidates[1].unit);
    }
    return { missing, inputs: out };
  }

  if (question === "q5") {
    if (gramCandidates.length < 1) missing.push("mass");
    if (cmCandidates.length < 1) missing.push("length");
    if (chargeCandidates.length < 1) missing.push("charge");
    if (degCandidates.length < 1) missing.push("theta_deg");
    if (missing.length === 0) {
      out.mass_kg = asKg(gramCandidates[0].value!, gramCandidates[0].unit);
      out.length_m = asM(cmCandidates[0].value!, cmCandidates[0].unit);
      out.charge_C = Math.abs(asC(chargeCandidates[0].value!, chargeCandidates[0].unit));
      out.theta_deg = degCandidates[0].value!;
    }
    return { missing, inputs: out };
  }

  if (question === "q6") {
    if (chargeCandidates.length < 3) missing.push("q1,q2,q3");
    if (meterCandidates.length < 2) missing.push("a,b");
    if (missing.length === 0) {
      out.q1_c = asC(chargeCandidates[0].value!, chargeCandidates[0].unit);
      out.q2_c = asC(chargeCandidates[1].value!, chargeCandidates[1].unit);
      out.q3_c = asC(chargeCandidates[2].value!, chargeCandidates[2].unit);
      out.a_m = meterCandidates[0].value!;
      out.b_m = meterCandidates[1].value!;
    }
    return { missing, inputs: out };
  }

  if (question === "q7") {
    if (chargeCandidates.length < 3) missing.push("q1,q2,q3");
    if (meterCandidates.length < 3) missing.push("l1,l2,a");
    if (missing.length === 0) {
      out.q1_c = asC(chargeCandidates[0].value!, chargeCandidates[0].unit);
      out.q2_c = asC(chargeCandidates[1].value!, chargeCandidates[1].unit);
      out.q3_c = asC(chargeCandidates[2].value!, chargeCandidates[2].unit);
      out.l1_m = meterCandidates[0].value!;
      out.l2_m = meterCandidates[1].value!;
      out.a_m = meterCandidates[2].value!;
    }
    return { missing, inputs: out };
  }

  if (question === "q8") {
    if (mmCandidates.length < 1) missing.push("d");
    if (cmCandidates.length < 1) missing.push("y");
    if (fieldCandidates.length < 1) missing.push("field");
    if (missing.length === 0) {
      const yCandidate = cmCandidates.find((item) => item.value !== 0) ?? cmCandidates[0];
      out.d_m = asM(mmCandidates[0].value!, mmCandidates[0].unit);
      out.y_m = asM(yCandidate.value!, yCandidate.unit);
      out.field_N_C = fieldCandidates[0].value!;
    }
    return { missing, inputs: out };
  }

  if (question === "q9") {
    if (degCandidates.length < 1) missing.push("angle");
    if (speedCandidates.length < 1) missing.push("speed");
    if (cmCandidates.length < 1) missing.push("d");
    if (missing.length === 0) {
      out.angle_deg = degCandidates[0].value!;
      out.speed_m_s = speedCandidates[0].value!;
      out.d_m = asM(cmCandidates[0].value!, cmCandidates[0].unit);
    }
    return { missing, inputs: out };
  }

  return { missing: ["unsupported_question"], inputs: out };
}

function solveQuestion(question: QuestionKey, inputs: Record<string, number>) {
  switch (question) {
    case "q1":
      return solve_q1(inputs.q1_c, inputs.x1_m, inputs.q2_c, inputs.x2_m, inputs.q3_c);
    case "q2":
      return solve_q2(inputs.q1_c, inputs.q2_c, inputs.x1_m);
    case "q3":
      return solve_q3(inputs.mass_kg, inputs.x_comp_N_C, inputs.y_comp_N_C, inputs.theta_deg);
    case "q4":
      return solve_q4(inputs.mass_kg, inputs.length_m, inputs.side_m);
    case "q5":
      return solve_q5(inputs.mass_kg, inputs.length_m, inputs.charge_C, inputs.theta_deg);
    case "q6":
      return solve_q6(inputs.q1_c, inputs.q2_c, inputs.q3_c, inputs.a_m, inputs.b_m);
    case "q7":
      return solve_q7(inputs.q1_c, inputs.q2_c, inputs.q3_c, inputs.l1_m, inputs.l2_m, inputs.a_m);
    case "q8":
      return solve_q8(inputs.d_m, inputs.y_m, inputs.field_N_C);
    case "q9":
      return solve_q9(inputs.angle_deg, inputs.speed_m_s, inputs.d_m);
  }
}

export function runAssignment1SolveAll(problems: ParsedProblem[]) {
  const outputs: Record<string, SolveOk | SolveErr> = {};
  const mappedProblems: Partial<Record<QuestionKey, ParsedProblem>> = {};

  for (const problem of problems) {
    const q = findQuestionForProblem(problem);
    if (q && !mappedProblems[q]) {
      mappedProblems[q] = problem;
    }
  }

  for (const question of ORDERED_QUESTIONS) {
    const problem = mappedProblems[question];
    if (!problem) {
      outputs[question] = {
        ok: false,
        problemId: null,
        error: "No matching parsed problem found for this question.",
      };
      continue;
    }

    const extracted = extractInputsForQuestion(question, problem);
    if (extracted.missing.length > 0) {
      outputs[question] = {
        ok: false,
        problemId: problem.problemId,
        error: "Could not infer all required inputs from extracted values.",
        missing: extracted.missing,
      };
      continue;
    }

    outputs[question] = {
      ok: true,
      problemId: problem.problemId,
      inputsUsed: extracted.inputs,
      results: solveQuestion(question, extracted.inputs),
    };
  }

  return {
    ok: true,
    answers: outputs,
  };
}

