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
} from "@/lib/assignment9/solvers";

type QuestionKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9" | "q10";

type SolverFn = (...args: number[]) => Record<string, number>;

interface SolverSpec {
  requiredKeys: string[];
  solve: SolverFn;
}

const ORDERED_QUESTIONS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"] as const;

const solverSpecs: Record<QuestionKey, SolverSpec> = {
  q1: {
    requiredKeys: ["radius_cm", "b_at_t0_T", "dB_dt_T_per_s", "r_ohm"],
    solve: (radius, bAtT0, dBdt, r) => solve_q1(radius, bAtT0, dBdt, r),
  },
  q2: {
    requiredKeys: ["force_N", "v_m_s", "r_ohm"],
    solve: (force, v, r) => solve_q2(force, v, r),
  },
  q3: {
    requiredKeys: ["d_m", "r3_ohm", "r1_ohm", "r2_ohm", "v1_m_s", "v2_m_s", "b_T"],
    solve: (d, r3, r1, r2, v1, v2, b) => solve_q3(d, r3, r1, r2, v1, v2, b),
  },
  q4: {
    requiredKeys: ["n_turns", "r_ohm", "a_m2", "q_C"],
    solve: (n, r, a, q) => solve_q4(n, r, a, q),
  },
  q5: {
    requiredKeys: ["l_m", "v_m_s", "i_mA", "r_cm"],
    solve: (l, v, i, r) => solve_q5(l, v, i, r),
  },
  q6: {
    requiredKeys: ["l_H", "i1_A", "i2_A", "t_s"],
    solve: (l, i1, i2, t) => solve_q6(l, i1, i2, t),
  },
  q7: {
    requiredKeys: ["e_V", "l_mH", "r_ohm", "t_us", "percent"],
    solve: (e, l, r, t, p) => solve_q7(e, l, r, t, p),
  },
  q8: {
    requiredKeys: ["r1_ohm", "r2_ohm", "l_H", "e1_V", "e2_V"],
    solve: (r1, r2, l, e1, e2) => solve_q8(r1, r2, l, e1, e2),
  },
  q9: {
    requiredKeys: ["b_T", "diameter_cm", "length_cm"],
    solve: (b, d, l) => solve_q9(b, d, l),
  },
  q10: {
    requiredKeys: ["n_turns", "side_cm", "rpm", "b_T"],
    solve: (n, side, rpm, b) => solve_q10(n, side, rpm, b),
  },
};

const problemIdMap: Partial<Record<string, QuestionKey>> = {
  "sb-prob3161a.problem": "q1",
  "sb-prob3122a.problem": "q2",
  "sb-prob3131.problem": "q3",
  "sb-prob3158.problem": "q4",
  "sb-prob3166.problem": "q5",
  "sb-prob3201.problem": "q6",
  "sb-prob3219a.problem": "q7",
  "sb-prob3228a.problem": "q8",
  "sb-prob3232a.problem": "q9",
  "sf-prob2028.problem": "q10",
};

const questionSignatures: Record<QuestionKey, RegExp[]> = {
  q1: [/circular loop of wire/i, /b\(t\)/i, /magnetic flux/i],
  q2: [/conducting rod/i, /constant force/i, /mechanical power/i],
  q3: [/two parallel rails/i, /r\s*1/i, /r\s*2/i],
  q4: [/search coil/i, /57-turn coil/i, /total charge/i],
  q5: [/rod of length/i, /29\.2\s*mA/i, /emf induced/i],
  q6: [/inductance/i, /average induced emf/i],
  q7: [/inductive time constant/i, /steady-state current/i],
  q8: [/rl circuit/i, /r\s*1/i, /r\s*2/i, /thrown quickly/i],
  q9: [/superconducting solenoid/i, /energy density/i, /energy stored/i],
  q10: [/square wire coil/i, /rpm/i, /maximum emf/i],
};

function normalizeUnit(unit: string | null): string {
  const raw = (unit ?? "").toLowerCase().replace(/\s+/g, "");
  if (
    raw === "\u03c9" ||
    raw === "\u03a9".toLowerCase() ||
    raw === "\u2126".toLowerCase() ||
    raw === "ohm" ||
    raw === "ohms"
  ) {
    return "ohm";
  }
  if (raw === "ma") return "mA";
  if (raw === "us" || raw === "\u00b5s" || raw === "\u03bcs") return "us";
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
    radius_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    b_at_t0_T: (i) => normalizeUnit(values[i].unit) === "t",
    dB_dt_T_per_s: (i) => normalizeUnit(values[i].unit) === "t/s",
    r_ohm: (i) => normalizeUnit(values[i].unit) === "ohm",
    force_N: (i) => normalizeUnit(values[i].unit) === "n",
    v_m_s: (i) => normalizeUnit(values[i].unit) === "m/s",
    d_m: (i) => normalizeUnit(values[i].unit) === "m",
    r3_ohm: (i) => normalizeUnit(values[i].unit) === "ohm",
    r1_ohm: (i) => normalizeUnit(values[i].unit) === "ohm",
    r2_ohm: (i) => normalizeUnit(values[i].unit) === "ohm",
    v1_m_s: (i) => normalizeUnit(values[i].unit) === "m/s",
    v2_m_s: (i) => normalizeUnit(values[i].unit) === "m/s",
    b_T: (i) => normalizeUnit(values[i].unit) === "t",
    n_turns: (i) => /turn/i.test(values[i].raw + values[i].context),
    a_m2: (i) => normalizeUnit(values[i].unit) === "m2",
    q_C: (i) => normalizeUnit(values[i].unit) === "c",
    l_m: (i) => normalizeUnit(values[i].unit) === "m",
    i_mA: (i) => normalizeUnit(values[i].unit) === "mA",
    r_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    l_H: (i) => normalizeUnit(values[i].unit) === "h",
    i1_A: (i) => normalizeUnit(values[i].unit) === "a",
    i2_A: (i) => normalizeUnit(values[i].unit) === "a",
    t_s: (i) => normalizeUnit(values[i].unit) === "s",
    e_V: (i) => normalizeUnit(values[i].unit) === "v",
    l_mH: (i) => normalizeUnit(values[i].unit) === "mh",
    t_us: (i) => normalizeUnit(values[i].unit) === "us",
    percent: (i) => /%|percent|maximum value/i.test(values[i].context + values[i].raw),
    e1_V: (i) => normalizeUnit(values[i].unit) === "v",
    e2_V: (i) => normalizeUnit(values[i].unit) === "v",
    diameter_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    length_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    side_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    rpm: (i) => normalizeUnit(values[i].unit) === "rpm",
  };

  const matcher = byKey[key];
  if (matcher) {
    const value = pickWhere(matcher);
    if (value !== undefined) return value;
  }

  const fallbackUnits: Record<string, string[]> = {
    radius_cm: ["cm"],
    r_ohm: ["ohm"],
    v_m_s: ["m/s"],
    d_m: ["m"],
    r3_ohm: ["ohm"],
    r1_ohm: ["ohm"],
    r2_ohm: ["ohm"],
    v1_m_s: ["m/s"],
    v2_m_s: ["m/s"],
    b_T: ["t"],
    a_m2: ["m2"],
    q_C: ["c"],
    l_m: ["m"],
    i_mA: ["mA"],
    r_cm: ["cm"],
    l_H: ["h"],
    i1_A: ["a"],
    i2_A: ["a"],
    t_s: ["s"],
    e_V: ["v"],
    l_mH: ["mh"],
    t_us: ["us"],
    e1_V: ["v"],
    e2_V: ["v"],
    diameter_cm: ["cm"],
    length_cm: ["cm"],
    side_cm: ["cm"],
    rpm: ["rpm"],
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
    const radius = readNumber(raw, new RegExp(`radius\\s*${num}\\s*cm`, "i"));
    const equation = raw.match(new RegExp(`B\\s*\\(\\s*t\\s*\\)\\s*=\\s*${num}\\s*\\+\\s*${num}\\s*t`, "i"));
    const r = readNumber(raw, new RegExp(`resistance[^\\d]{0,30}${num}\\s*(?:ohm|\\u2126|\\u03a9|\\u03c9)`, "i"));
    if (radius !== undefined) inputs.radius_cm = radius;
    if (equation) {
      const b0 = Number.parseFloat(equation[1]);
      const slope = Number.parseFloat(equation[2]);
      if (Number.isFinite(b0)) inputs.b_at_t0_T = b0;
      if (Number.isFinite(slope)) inputs.dB_dt_T_per_s = slope;
    }
    if (r !== undefined) inputs.r_ohm = r;
  } else if (question === "q2") {
    const force = readNumber(raw, new RegExp(`force\\s+of\\s*${num}\\s*n`, "i"));
    const v = readNumber(raw, new RegExp(`speed\\s*${num}\\s*m/s`, "i"));
    const r = readNumber(raw, new RegExp(`through\\s+the\\s*${num}\\s*(?:ohm|\\u2126|\\u03a9|\\u03c9)`, "i"));
    if (force !== undefined) inputs.force_N = force;
    if (v !== undefined) inputs.v_m_s = v;
    if (r !== undefined) inputs.r_ohm = r;
  } else if (question === "q3") {
    const d = readNumber(raw, new RegExp(`are\\s*${num}\\s*m\\s*apart`, "i"));
    const r3 = readNumber(raw, new RegExp(`connected\\s+by\\s+a\\s*${num}\\s*(?:ohm|\\u2126|\\u03a9|\\u03c9)`, "i"));
    const r1 = readNumber(raw, new RegExp(`r\\s*1\\s*=\\s*${num}\\s*(?:ohm|\\u2126|\\u03a9|\\u03c9)`, "i"));
    const r2 = readNumber(raw, new RegExp(`r\\s*2\\s*=\\s*${num}\\s*(?:ohm|\\u2126|\\u03a9|\\u03c9)`, "i"));
    const v1 = readNumber(raw, new RegExp(`v\\s*1\\s*=\\s*${num}\\s*m/s`, "i"));
    const v2 = readNumber(raw, new RegExp(`v\\s*2\\s*=\\s*${num}\\s*m/s`, "i"));
    const b = readNumber(raw, new RegExp(`magnitude\\s*${num}\\s*t`, "i"));
    if (d !== undefined) inputs.d_m = d;
    if (r3 !== undefined) inputs.r3_ohm = r3;
    if (r1 !== undefined) inputs.r1_ohm = r1;
    if (r2 !== undefined) inputs.r2_ohm = r2;
    if (v1 !== undefined) inputs.v1_m_s = v1;
    if (v2 !== undefined) inputs.v2_m_s = v2;
    if (b !== undefined) inputs.b_T = b;
  } else if (question === "q4") {
    const n = readNumber(raw, new RegExp(`${num}-turn\\s+coil`, "i"));
    const r = readNumber(raw, new RegExp(`resistance\\s*${num}\\s*(?:ohm|\\u2126|\\u03a9|\\u03c9)`, "i"));
    const a = readNumber(raw, new RegExp(`area\\s*${num}\\s*m2`, "i"));
    const q = readNumber(raw, new RegExp(`charge\\s+of\\s*${num}\\s*c`, "i"));
    if (n !== undefined) inputs.n_turns = n;
    if (r !== undefined) inputs.r_ohm = r;
    if (a !== undefined) inputs.a_m2 = a;
    if (q !== undefined) inputs.q_C = q;
  } else if (question === "q5") {
    const l = readNumber(raw, new RegExp(`length\\s*${num}\\s*m`, "i"));
    const v = readNumber(raw, new RegExp(`velocity\\s*${num}\\s*m/s`, "i"));
    const i = readNumber(raw, new RegExp(`current\\s+of\\s*${num}\\s*mA`, "i"));
    const r = readNumber(raw, new RegExp(`distance\\s*${num}\\s*cm\\s+away`, "i"));
    if (l !== undefined) inputs.l_m = l;
    if (v !== undefined) inputs.v_m_s = v;
    if (i !== undefined) inputs.i_mA = i;
    if (r !== undefined) inputs.r_cm = r;
  } else if (question === "q6") {
    const l = readNumber(raw, new RegExp(`inductance\\s+of\\s*${num}\\s*h`, "i"));
    const i1 = readNumber(raw, new RegExp(`from\\s*${num}\\s*a\\s+to`, "i"));
    const i2 = readNumber(raw, new RegExp(`to\\s*${num}\\s*a\\s+in\\s+a\\s+time`, "i"));
    const t = readNumber(raw, new RegExp(`time\\s+of\\s*${num}\\s*s`, "i"));
    if (l !== undefined) inputs.l_H = l;
    if (i1 !== undefined) inputs.i1_A = i1;
    if (i2 !== undefined) inputs.i2_A = i2;
    if (t !== undefined) inputs.t_s = t;
  } else if (question === "q7") {
    const e = readNumber(raw, new RegExp(`taking\\s*e\\s*=\\s*${num}\\s*v`, "i"));
    const l = readNumber(raw, new RegExp(`l\\s*=\\s*${num}\\s*mh`, "i"));
    const r = readNumber(raw, new RegExp(`r\\s*=\\s*${num}\\s*(?:ohm|\\u2126|\\u03a9|\\u03c9)`, "i"));
    const t = readNumber(raw, new RegExp(`${num}\\s*us\\s+after`, "i"));
    const p = readNumber(raw, new RegExp(`reach\\s*${num}\\s*its\\s+maximum\\s+value`, "i"));
    if (e !== undefined) inputs.e_V = e;
    if (l !== undefined) inputs.l_mH = l;
    if (r !== undefined) inputs.r_ohm = r;
    if (t !== undefined) inputs.t_us = t;
    if (p !== undefined) inputs.percent = p;
  } else if (question === "q8") {
    const r1 = readNumber(raw, new RegExp(`r\\s*1\\s*=\\s*${num}\\s*(?:ohm|\\u2126|\\u03a9|\\u03c9)`, "i"));
    const r2 = readNumber(raw, new RegExp(`r\\s*2\\s*=\\s*${num}\\s*(?:ohm|\\u2126|\\u03a9|\\u03c9)`, "i"));
    const l = readNumber(raw, new RegExp(`l\\s*=\\s*${num}\\s*h`, "i"));
    const e1 = readNumber(raw, new RegExp(`(?:\u03b5|ǫ|e)\\s*=\\s*${num}\\s*v`, "i"));
    const e2 = readNumber(raw, new RegExp(`drops\\s+to\\s*e\\s*=\\s*${num}\\s*v`, "i"));
    if (r1 !== undefined) inputs.r1_ohm = r1;
    if (r2 !== undefined) inputs.r2_ohm = r2;
    if (l !== undefined) inputs.l_H = l;
    if (e1 !== undefined) inputs.e1_V = e1;
    if (e2 !== undefined) inputs.e2_V = e2;
  } else if (question === "q9") {
    const b = readNumber(raw, new RegExp(`is\\s*${num}\\s*t`, "i"));
    const diameter = readNumber(raw, new RegExp(`diameter\\s+of\\s*${num}\\s*cm`, "i"));
    const length = readNumber(raw, new RegExp(`length\\s+of\\s*${num}\\s*cm`, "i"));
    if (b !== undefined) inputs.b_T = b;
    if (diameter !== undefined) inputs.diameter_cm = diameter;
    if (length !== undefined) inputs.length_cm = length;
  } else if (question === "q10") {
    const n = readNumber(raw, new RegExp(`${num}-turn\\s+square\\s+wire\\s+coil`, "i"));
    const side = readNumber(raw, new RegExp(`length\\s*l\\s*=\\s*${num}\\s*cm`, "i"));
    const rpm = readNumber(raw, new RegExp(`at\\s*${num}\\s*rpm`, "i"));
    const b = readNumber(raw, new RegExp(`field[^\\d]{0,80}${num}\\s*t`, "i"));
    if (n !== undefined) inputs.n_turns = n;
    if (side !== undefined) inputs.side_cm = side;
    if (rpm !== undefined) inputs.rpm = rpm;
    if (b !== undefined) inputs.b_T = b;
  }
}

function applyQuestionSpecificFallbacks(question: QuestionKey, inputs: Record<string, number>) {
  if (question === "q8" && "e1_V" in inputs && !("e2_V" in inputs)) {
    inputs.e2_V = inputs.e1_V;
  }
}

export function runAssignment9SolveAll(problems: ParsedProblem[]) {
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

  for (const question of ORDERED_QUESTIONS) {
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
    applyQuestionSpecificFallbacks(question, inputs);

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
