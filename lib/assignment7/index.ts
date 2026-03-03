import type { ParsedProblem } from "@/lib/types";
import {
  solve_q1,
  solve_q2,
  solve_q3,
  solve_q4,
  solve_q5,
  solve_q7,
  solve_q8,
  solve_q9,
  solve_q10,
} from "@/lib/assignment7/solvers";

type QuestionKey =
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9";

type SolverFn = (...args: number[]) => Record<string, number>;

interface SolverSpec {
  requiredKeys: string[];
  solve: SolverFn;
}

const ORDERED_QUESTIONS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
] as const;

const solverSpecs: Record<QuestionKey, SolverSpec> = {
  q1: {
    requiredKeys: ["v_m_s", "a_m_s2", "e_N_C"],
    solve: (v, a, e) => solve_q1(v, a, e),
  },
  q2: {
    requiredKeys: ["l_cm", "i_A", "b_T"],
    solve: (l, i, b) => solve_q2(l, i, b),
  },
  q3: {
    requiredKeys: ["m_kg", "l_m", "n_turns", "i_A", "b_T"],
    solve: (m, l, n, i, b) => solve_q3(m, l, n, i, b),
  },
  q4: {
    requiredKeys: ["v_kV", "b_T"],
    solve: (v, b) => solve_q4(v, b),
  },
  q5: {
    requiredKeys: ["e_MeV", "b_T"],
    solve: (e, b) => solve_q5(e, b),
  },
  q6: {
    requiredKeys: ["e_MeV", "angle_deg", "b_T"],
    solve: (e, angle, b) => solve_q7(e, angle, b),
  },
  q7: {
    requiredKeys: ["torque_Nm", "angle_deg", "b_T"],
    solve: (torque, angle, b) => solve_q8(torque, angle, b),
  },
  q8: {
    requiredKeys: ["b_T", "spacing_cm"],
    solve: (b, spacing) => solve_q9(b, spacing),
  },
  q9: {
    requiredKeys: ["l_cm", "w_cm", "i_A", "m_g", "n_turns"],
    solve: (l, w, i, m, n) => solve_q10(l, w, i, m, n),
  },
};

const problemIdMap: Partial<Record<string, QuestionKey>> = {
  "sb-prob2910a.problem": "q1",
  "sb-prob2918a.problem": "q2",
  "sb-prob2926a.problem": "q3",
  "sb-prob2942a.problem": "q4",
  "sb-prob2944.problem": "q5",
  "sb-prob2969a.problem": "q6",
  "kn-prob3242.problem": "q7",
  "kn-prob3270a.problem": "q8",
  "kn-prob3280.problem": "q9",
};

const questionSignatures: Record<QuestionKey, RegExp[]> = {
  q1: [/electron has a velocity/i, /acceleration/i, /electric field/i],
  q2: [/cube .* on each edge/i, /segments of wire/i, /magnetic force on segment/i],
  q3: [/square coil/i, /hinged/i, /torque acting on the coil/i],
  q4: [/uranium-238/i, /uranium-235/i, /circular path/i],
  q5: [/radius of a cyclotron/i, /protons .* mev/i],
  q6: [/proton moving/i, /kinetic energy/i, /point of entry/i],
  q7: [/small bar magnet/i, /magnetic dipole moment/i],
  q8: [/mass spectrometer/i, /charge-to-mass ratio/i, /entrance and exit holes/i],
  q9: [/turn loop of wire/i, /mass hangs from one edge/i, /prevent the loop from rotating/i],
};

function normalizeUnit(unit: string | null): string {
  const raw = (unit ?? "").toLowerCase().replace(/\s+/g, "");
  if (raw === "ua" || raw === "\u00b5a" || raw === "\u03bca") return "uA";
  if (raw === "uv" || raw === "\u00b5v" || raw === "\u03bcv") return "uV";
  if (raw === "ma") return "mA";
  if (raw === "nc") return "nC";
  if (raw === "n/c") return "N/C";
  if (raw === "mev") return "MeV";
  if (raw === "kv") return "kV";
  if (raw === "m/s") return "m/s";
  if (raw === "deg" || raw === "degrees" || raw === "degree") return "deg";
  if (raw === "n*m" || raw === "n\u00b7m") return "N*m";
  return raw;
}

function findQuestionForProblem(problem: ParsedProblem): QuestionKey | null {
  const mapped = problemIdMap[problem.problemId.toLowerCase()];
  if (mapped) return mapped;

  let best: { question: QuestionKey; score: number } | null = null;
  for (const question of ORDERED_QUESTIONS) {
    let score = 0;
    for (const regex of questionSignatures[question]) {
      if (regex.test(problem.rawText)) score += 1;
    }
    if (score === 0) continue;
    if (!best || score > best.score) best = { question, score };
  }

  return best?.question ?? null;
}

function pickInputValue(
  problem: ParsedProblem,
  key: string,
  usedIndices: Set<number>,
): number | undefined {
  const values = problem.extractedValues;

  function pickWhere(predicate: (index: number) => boolean): number | undefined {
    for (let i = 0; i < values.length; i += 1) {
      if (usedIndices.has(i)) continue;
      const candidate = values[i];
      if (typeof candidate.value !== "number" || !Number.isFinite(candidate.value)) continue;
      if (!predicate(i)) continue;
      usedIndices.add(i);
      return candidate.value;
    }
    return undefined;
  }

  const byKey: Record<string, (index: number) => boolean> = {
    v_m_s: (i) => normalizeUnit(values[i].unit) === "m/s" && /velocity/i.test(values[i].context),
    a_m_s2: (i) => normalizeUnit(values[i].unit) === "m/s" && /acceleration/i.test(values[i].context),
    e_N_C: (i) => normalizeUnit(values[i].unit) === "N/C",
    l_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    i_A: (i) => normalizeUnit(values[i].unit) === "a",
    b_T: (i) => normalizeUnit(values[i].unit) === "t",
    m_kg: (i) => normalizeUnit(values[i].unit) === "kg",
    l_m: (i) => normalizeUnit(values[i].unit) === "m",
    n_turns: (i) => /turn/i.test(values[i].raw + values[i].context),
    v_kV: (i) => normalizeUnit(values[i].unit) === "kV",
    e_MeV: (i) => normalizeUnit(values[i].unit) === "MeV",
    angle_deg: (i) => normalizeUnit(values[i].unit) === "deg",
    torque_Nm: (i) => normalizeUnit(values[i].unit) === "N*m",
    spacing_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    w_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    m_g: (i) => normalizeUnit(values[i].unit) === "g",
  };

  const matcher = byKey[key];
  if (matcher) {
    const value = pickWhere(matcher);
    if (value !== undefined) return value;
  }

  const fallbackUnits: Record<string, string[]> = {
    v_m_s: ["m/s"],
    a_m_s2: ["m/s"],
    e_N_C: ["N/C"],
    l_cm: ["cm"],
    i_A: ["a"],
    b_T: ["t"],
    m_kg: ["kg"],
    l_m: ["m"],
    v_kV: ["kV"],
    e_MeV: ["MeV"],
    angle_deg: ["deg"],
    torque_Nm: ["N*m"],
    spacing_cm: ["cm"],
    w_cm: ["cm"],
    m_g: ["g"],
  };

  const acceptedUnits = fallbackUnits[key] ?? [];
  if (acceptedUnits.length > 0) {
    const fallbackValue = pickWhere((i) => acceptedUnits.includes(normalizeUnit(values[i].unit)));
    if (fallbackValue !== undefined) return fallbackValue;
  }

  return undefined;
}

function readNumber(rawText: string, regex: RegExp): number | undefined {
  const match = rawText.match(regex);
  if (!match) return undefined;
  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function applyRawTextOverrides(question: QuestionKey, raw: string, inputs: Record<string, number>) {
  const num = String.raw`([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)`;

  if (question === "q1") {
    const v = readNumber(raw, new RegExp(`velocity\\s+of\\s*${num}\\s*m\\s*\\/\\s*s`, "i"));
    const a = readNumber(raw, new RegExp(`acceleration\\s+of\\s*${num}\\s*m\\s*\\/\\s*s(?:\\s*2)?`, "i"));
    const e = readNumber(raw, new RegExp(`magnitude\\s+of\\s*${num}\\s*n\\s*\\/\\s*c`, "i"));
    if (v !== undefined) inputs.v_m_s = v;
    if (a !== undefined) inputs.a_m_s2 = a;
    if (e !== undefined) inputs.e_N_C = e;
  } else if (question === "q2") {
    const l = readNumber(raw, new RegExp(`cube\\s+is\\s*${num}\\s*cm`, "i"));
    const i = readNumber(raw, new RegExp(`current\\s*i?\\s*=\\s*${num}\\s*a`, "i"));
    const b = readNumber(raw, new RegExp(`magnitude\\s*b\\s*=\\s*${num}\\s*t`, "i"));
    if (l !== undefined) inputs.l_cm = l;
    if (i !== undefined) inputs.i_A = i;
    if (b !== undefined) inputs.b_T = b;
  } else if (question === "q3") {
    const m = readNumber(raw, new RegExp(`mass\\s*${num}\\s*kg`, "i"));
    const l = readNumber(raw, new RegExp(`length\\s+of\\s*${num}\\s*m`, "i"));
    const n = readNumber(raw, new RegExp(`with\\s*${num}\\s*turns`, "i"));
    const i = readNumber(raw, new RegExp(`carries\\s+a\\s*${num}\\s*a\\s*current`, "i"));
    const b = readNumber(raw, new RegExp(`magnitude\\s+of\\s*${num}\\s*t`, "i"));
    if (m !== undefined) inputs.m_kg = m;
    if (l !== undefined) inputs.l_m = l;
    if (n !== undefined) inputs.n_turns = n;
    if (i !== undefined) inputs.i_A = i;
    if (b !== undefined) inputs.b_T = b;
  } else if (question === "q4") {
    const v = readNumber(raw, new RegExp(`potential\\s+difference\\s+of\\s*${num}\\s*kv`, "i"));
    const b = readNumber(raw, new RegExp(`magnetic\\s+field\\s+of\\s*${num}\\s*t`, "i"));
    if (v !== undefined) inputs.v_kV = v;
    if (b !== undefined) inputs.b_T = b;
  } else if (question === "q5") {
    const e = readNumber(raw, new RegExp(`energies\\s+of\\s*${num}\\s*mev`, "i"));
    const b = readNumber(raw, new RegExp(`magnetic\\s+field\\s+of\\s*${num}\\s*t`, "i"));
    if (e !== undefined) inputs.e_MeV = e;
    if (b !== undefined) inputs.b_T = b;
  } else if (question === "q6") {
    const e = readNumber(raw, new RegExp(`kinetic\\s+energy\\s+of\\s*${num}\\s*mev`, "i"));
    const angle = readNumber(raw, new RegExp(`angle[^\\d+-]{0,20}=\\s*${num}\\s*deg`, "i"));
    const b = readNumber(raw, new RegExp(`magnitude\\s*b\\s*=\\s*${num}\\s*t`, "i"));
    if (e !== undefined) inputs.e_MeV = e;
    if (angle !== undefined) inputs.angle_deg = angle;
    if (b !== undefined) inputs.b_T = b;
  } else if (question === "q7") {
    const torque = readNumber(
      raw,
      new RegExp(`experiences\\s+a\\s*${num}\\s*n\\s*(?:\\u00b7|\\*)?\\s*m\\s*torque`, "i"),
    );
    const angle = readNumber(raw, new RegExp(`at\\s+a\\s*${num}\\s*deg`, "i"));
    const b = readNumber(raw, new RegExp(`to\\s+a\\s*${num}\\s*t\\s*magnetic\\s+field`, "i"));
    if (torque !== undefined) inputs.torque_Nm = torque;
    if (angle !== undefined) inputs.angle_deg = angle;
    if (b !== undefined) inputs.b_T = b;
  } else if (question === "q8") {
    const b = readNumber(raw, new RegExp(`field\\s+strength\\s*b\\s*=\\s*${num}\\s*t`, "i"));
    const spacing = readNumber(raw, new RegExp(`holes\\s*d\\s*=\\s*${num}\\s*cm`, "i"));
    if (b !== undefined) inputs.b_T = b;
    if (spacing !== undefined) inputs.spacing_cm = spacing;
  } else if (question === "q9") {
    const n = readNumber(raw, new RegExp(`the\\s*${num}\\s*turn\\s+loop`, "i"));
    const l = readNumber(raw, new RegExp(`\\bl\\s*=\\s*${num}\\s*cm`, "i"));
    const w = readNumber(raw, new RegExp(`\\bw\\s*=\\s*${num}\\s*cm`, "i"));
    const i = readNumber(raw, new RegExp(`carries\\s+a\\s*${num}\\s*a\\s*current`, "i"));
    const m = readNumber(raw, new RegExp(`\\b${num}\\s*g\\s*mass`, "i"));
    if (n !== undefined) inputs.n_turns = n;
    if (l !== undefined) inputs.l_cm = l;
    if (w !== undefined) inputs.w_cm = w;
    if (i !== undefined) inputs.i_A = i;
    if (m !== undefined) inputs.m_g = m;
  }
}

function inferInputOrder(problems: ParsedProblem[]): QuestionKey[] {
  const seen = new Set<QuestionKey>();
  const ordered: QuestionKey[] = [];

  for (const problem of problems) {
    const q = findQuestionForProblem(problem);
    if (!q || seen.has(q)) continue;
    seen.add(q);
    ordered.push(q);
  }

  for (const q of ORDERED_QUESTIONS) {
    if (!seen.has(q)) ordered.push(q);
  }

  return ordered;
}

export function runAssignment7SolveAll(problems: ParsedProblem[]) {
  const outputs: Record<
    QuestionKey,
    | {
        ok: true;
        problemId: string;
        inputsUsed: Record<string, number>;
        results: Record<string, number>;
      }
    | { ok: false; problemId: string | null; error: string; missing?: string[] }
  > = {} as Record<
    QuestionKey,
    | {
        ok: true;
        problemId: string;
        inputsUsed: Record<string, number>;
        results: Record<string, number>;
      }
    | { ok: false; problemId: string | null; error: string; missing?: string[] }
  >;

  const problemByQuestion: Partial<Record<QuestionKey, ParsedProblem>> = {};

  for (const problem of problems) {
    const q = findQuestionForProblem(problem);
    if (!q || problemByQuestion[q]) continue;
    problemByQuestion[q] = problem;
  }

  const renderOrder = inferInputOrder(problems);

  for (const question of renderOrder) {
    const problem = problemByQuestion[question];
    if (!problem) {
      outputs[question] = {
        ok: false,
        problemId: null,
        error: "No matching parsed problem found for this question.",
      };
      continue;
    }

    const spec = solverSpecs[question];
    const usedIndices = new Set<number>();
    const inputs: Record<string, number> = {};

    for (const key of spec.requiredKeys) {
      const value = pickInputValue(problem, key, usedIndices);
      if (value !== undefined && Number.isFinite(value)) {
        inputs[key] = value;
      }
    }

    applyRawTextOverrides(question, problem.rawText, inputs);

    const missing = spec.requiredKeys.filter((key) => !(key in inputs) || !Number.isFinite(inputs[key]));
    if (missing.length > 0) {
      outputs[question] = {
        ok: false,
        problemId: problem.problemId,
        error: "Could not infer all required inputs from extracted values.",
        missing,
      };
      continue;
    }

    const orderedArgs = spec.requiredKeys.map((key) => inputs[key]);
    const results = spec.solve(...orderedArgs);
    const invalidResult = Object.values(results).some((v) => !Number.isFinite(v));

    if (invalidResult) {
      outputs[question] = {
        ok: false,
        problemId: problem.problemId,
        error: "Solver produced non-finite output. Check parsed inputs.",
      };
      continue;
    }

    outputs[question] = {
      ok: true,
      problemId: problem.problemId,
      inputsUsed: inputs,
      results,
    };
  }

  return { ok: true, answers: outputs };
}
