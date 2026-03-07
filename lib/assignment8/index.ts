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
} from "@/lib/assignment8/solvers";

type QuestionKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9";

type SolverFn = (...args: number[]) => Record<string, number>;

interface SolverSpec {
  requiredKeys: string[];
  solve: SolverFn;
}

const ORDERED_QUESTIONS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"] as const;

const solverSpecs: Record<QuestionKey, SolverSpec> = {
  q1: {
    requiredKeys: ["a_m", "b_m", "i_A", "angle_deg"],
    solve: (a, b, i, angle) => solve_q1(a, b, i, angle),
  },
  q2: {
    requiredKeys: ["i_A", "a_cm"],
    solve: (i, a) => solve_q2(i, a),
  },
  q3: {
    requiredKeys: ["i1_A", "i2_A", "r_mm"],
    solve: (i1, i2, r) => solve_q3(i1, i2, r),
  },
  q4: {
    requiredKeys: ["b1_uT", "d1_cm", "b2_uT", "i_A", "wire_spacing_mm", "r_cm", "ratio_decimal"],
    solve: (b1, d1, b2, i, spacing, r, ratio) => solve_q4(b1, d1, b2, i, spacing, r, ratio),
  },
  q5: {
    requiredKeys: ["radius_cm", "i_A"],
    solve: (radius, i) => solve_q5(radius, i),
  },
  q6: {
    requiredKeys: [
      "solenoid_diameter_m",
      "solenoid_length_m",
      "i_A",
      "n_turns",
      "disk_radius_m",
      "annulus_inner_cm",
      "annulus_outer_cm",
    ],
    solve: (diameter, length, i, n, diskRadius, inner, outer) =>
      solve_q6(diameter, length, i, n, diskRadius, inner, outer),
  },
  q7: {
    requiredKeys: ["r_cm", "q_uC", "omega_rad_s"],
    solve: (r, q, omega) => solve_q7(r, q, omega),
  },
  q8: {
    requiredKeys: ["n_turns", "r_m", "d_m", "i_A"],
    solve: (n, r, d, i) => solve_q8(n, r, d, i),
  },
  q9: {
    requiredKeys: ["i1_A", "l_m", "r_m", "i2_A"],
    solve: (i1, l, r, i2) => solve_q9(i1, l, r, i2),
  },
};

const problemIdMap: Partial<Record<string, QuestionKey>> = {
  "sb-prob3011.problem": "q1",
  "sb-prob3014a.problem": "q2",
  "sb-prob3021a.problem": "q3",
  "sb-prob3022a.problem": "q4",
  "sb-prob3024a.problem": "q5",
  "sb-prob3034a.problem": "q6",
  "sb-prob3042.problem": "q7",
  "sb-prob3058.problem": "q8",
  "sb-prob3066.problem": "q9",
};

const questionSignatures: Record<QuestionKey, RegExp[]> = {
  q1: [/current-carrying loop/i, /point p/i, /a=.*m, b=.*m/i],
  q2: [/three long, parallel conductors/i, /point a/i, /point b/i],
  q3: [/coaxial cable/i, /inner conductor/i, /outer conductor/i],
  q4: [/magnetic field is .*ut/i, /extension cord/i, /coaxial cable/i],
  q5: [/cylindrical conductor/i, /r=\/?2/i, /distance beyond the surface/i],
  q6: [/solenoid/i, /flux through/i, /annulus/i],
  q7: [/uniform ring/i, /total charge/i, /magnetic moment/i],
  q8: [/helmholtz coils/i, /identical, flat, circular coils/i],
  q9: [/infinitely long, straight wire/i, /force exerted on the loop/i],
};

function normalizeUnit(unit: string | null): string {
  const raw = (unit ?? "").toLowerCase().replace(/\s+/g, "");
  if (raw === "ua" || raw === "\u00b5a" || raw === "\u03bca") return "uA";
  if (raw === "uc" || raw === "\u00b5c" || raw === "\u03bcc") return "uC";
  if (raw === "ut" || raw === "\u00b5t" || raw === "\u03bct") return "uT";
  if (raw === "rad/s") return "rad/s";
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
    a_m: (i) => normalizeUnit(values[i].unit) === "m",
    b_m: (i) => normalizeUnit(values[i].unit) === "m",
    i_A: (i) => normalizeUnit(values[i].unit) === "a",
    angle_deg: (i) => normalizeUnit(values[i].unit) === "deg",
    a_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    i1_A: (i) => normalizeUnit(values[i].unit) === "a",
    i2_A: (i) => normalizeUnit(values[i].unit) === "a",
    r_mm: (i) => normalizeUnit(values[i].unit) === "mm",
    b1_uT: (i) => normalizeUnit(values[i].unit) === "uT",
    d1_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    b2_uT: (i) => normalizeUnit(values[i].unit) === "uT",
    wire_spacing_mm: (i) => normalizeUnit(values[i].unit) === "mm",
    r_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    ratio_decimal: (i) => /decimal|tenth|ratio/i.test(values[i].context),
    radius_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    solenoid_diameter_m: (i) => normalizeUnit(values[i].unit) === "m",
    solenoid_length_m: (i) => normalizeUnit(values[i].unit) === "m",
    n_turns: (i) => /turn/i.test(values[i].raw + values[i].context),
    disk_radius_m: (i) => normalizeUnit(values[i].unit) === "m",
    annulus_inner_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    annulus_outer_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    q_uC: (i) => normalizeUnit(values[i].unit) === "uC",
    omega_rad_s: (i) => normalizeUnit(values[i].unit) === "rad/s",
    r_m: (i) => normalizeUnit(values[i].unit) === "m",
    d_m: (i) => normalizeUnit(values[i].unit) === "m",
    l_m: (i) => normalizeUnit(values[i].unit) === "m",
  };

  const matcher = byKey[key];
  if (matcher) {
    const value = pickWhere(matcher);
    if (value !== undefined) return value;
  }

  const fallbackUnits: Record<string, string[]> = {
    a_m: ["m"],
    b_m: ["m"],
    i_A: ["a"],
    angle_deg: ["deg"],
    a_cm: ["cm"],
    i1_A: ["a"],
    i2_A: ["a"],
    r_mm: ["mm"],
    b1_uT: ["uT"],
    d1_cm: ["cm"],
    b2_uT: ["uT"],
    wire_spacing_mm: ["mm"],
    r_cm: ["cm"],
    radius_cm: ["cm"],
    solenoid_diameter_m: ["m"],
    solenoid_length_m: ["m"],
    disk_radius_m: ["m"],
    annulus_inner_cm: ["cm"],
    annulus_outer_cm: ["cm"],
    q_uC: ["uC"],
    omega_rad_s: ["rad/s"],
    r_m: ["m"],
    d_m: ["m"],
    l_m: ["m"],
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
    const a = readNumber(raw, new RegExp(`\\ba\\s*=\\s*${num}\\s*m`, "i"));
    const b = readNumber(raw, new RegExp(`\\bb\\s*=\\s*${num}\\s*m`, "i"));
    const i = readNumber(raw, new RegExp(`\\bi\\s*=\\s*${num}\\s*a`, "i"));
    if (a !== undefined) inputs.a_m = a;
    if (b !== undefined) inputs.b_m = b;
    if (i !== undefined) inputs.i_A = i;
  } else if (question === "q2") {
    const i = readNumber(raw, new RegExp(`currents\\s+of\\s*i\\s*=\\s*${num}\\s*a`, "i"));
    const a = readNumber(raw, new RegExp(`\\ba\\s*=\\s*${num}\\s*cm`, "i"));
    if (i !== undefined) inputs.i_A = i;
    if (a !== undefined) inputs.a_cm = a;
  } else if (question === "q3") {
    const i1 = readNumber(raw, new RegExp(`inner\\s+conductor\\s+is\\s*${num}\\s*a`, "i"));
    const i2 = readNumber(raw, new RegExp(`outer\\s+conductor\\s+is\\s*${num}\\s*a`, "i"));
    if (i1 !== undefined) inputs.i1_A = i1;
    if (i2 !== undefined) inputs.i2_A = i2;
  } else if (question === "q4") {
    const b1 = readNumber(raw, new RegExp(`field\\s+is\\s*${num}\\s*uT\\s+at\\s+a\\s+distance\\s*${num}\\s*cm`, "i"));
    const d1 = readNumber(raw, new RegExp(`distance\\s*${num}\\s*cm\\s+away`, "i"));
    const b2 = readNumber(raw, new RegExp(`distance\\s+is\\s+it\\s*${num}\\s*uT`, "i"));
    const i = readNumber(raw, new RegExp(`carry\\s+equal\\s*${num}\\s*a\\s+currents`, "i"));
    const spacing = readNumber(raw, new RegExp(`wires\\s+are\\s*${num}\\s*mm\\s+apart`, "i"));
    const r = readNumber(raw, new RegExp(`field\\s*${num}\\s*cm\\s+way\\s+from\\s+the\\s+middle`, "i"));
    if (b1 !== undefined) inputs.b1_uT = b1;
    if (d1 !== undefined) inputs.d1_cm = d1;
    if (b2 !== undefined) inputs.b2_uT = b2;
    if (i !== undefined) inputs.i_A = i;
    if (spacing !== undefined) inputs.wire_spacing_mm = spacing;
    if (r !== undefined) inputs.r_cm = r;
    if (/one-?tenth/i.test(raw)) inputs.ratio_decimal = 0.1;
  } else if (question === "q5") {
    const radius = readNumber(raw, new RegExp(`radius\\s*r\\s*=\\s*${num}\\s*cm`, "i"));
    const i = readNumber(raw, new RegExp(`of\\s*i\\s*=\\s*${num}\\s*a`, "i"));
    if (radius !== undefined) inputs.radius_cm = radius;
    if (i !== undefined) inputs.i_A = i;
  } else if (question === "q6") {
    const diameter = readNumber(raw, new RegExp(`solenoid\\s*${num}\\s*m\\s+in\\s+diameter`, "i"));
    const length = readNumber(raw, new RegExp(`diameter\\s+and\\s*${num}\\s*m\\s+long`, "i"));
    const n = readNumber(raw, new RegExp(`long\\s+has\\s*${num}\\s*turns`, "i"));
    const i = readNumber(raw, new RegExp(`turns\\s+and\\s+carries\\s*${num}\\s*a`, "i"));
    const diskRadius = readNumber(raw, new RegExp(`disk\\s+of\\s+radius\\s*${num}\\s*m`, "i"));
    const inner = readNumber(raw, new RegExp(`inner\\s+radius\\s+of\\s*${num}\\s*cm`, "i"));
    const outer = readNumber(raw, new RegExp(`outer\\s+radius\\s+of\\s*${num}\\s*cm`, "i"));
    if (diameter !== undefined) inputs.solenoid_diameter_m = diameter;
    if (length !== undefined) inputs.solenoid_length_m = length;
    if (n !== undefined) inputs.n_turns = n;
    if (i !== undefined) inputs.i_A = i;
    if (diskRadius !== undefined) inputs.disk_radius_m = diskRadius;
    if (inner !== undefined) inputs.annulus_inner_cm = inner;
    if (outer !== undefined) inputs.annulus_outer_cm = outer;
  } else if (question === "q7") {
    const r = readNumber(raw, new RegExp(`radius\\s+of\\s*${num}\\s*cm`, "i"));
    const q = readNumber(raw, new RegExp(`charge\\s+of\\s*${num}\\s*uC`, "i"));
    const omega = readNumber(raw, new RegExp(`speed\\s+of\\s*${num}\\s*rad/s`, "i"));
    if (r !== undefined) inputs.r_cm = r;
    if (q !== undefined) inputs.q_uC = q;
    if (omega !== undefined) inputs.omega_rad_s = omega;
  } else if (question === "q8") {
    const n = readNumber(raw, new RegExp(`each\\s+have\\s*${num}\\s*turns`, "i"));
    const r = readNumber(raw, new RegExp(`radius\\s+of\\s*${num}\\s*m`, "i"));
    const d = readNumber(raw, new RegExp(`separation\\s+of\\s*${num}\\s*m`, "i"));
    const i = readNumber(raw, new RegExp(`current\\s+of\\s*${num}\\s*a`, "i"));
    if (n !== undefined) inputs.n_turns = n;
    if (r !== undefined) inputs.r_m = r;
    if (d !== undefined) inputs.d_m = d;
    if (i !== undefined) inputs.i_A = i;
  } else if (question === "q9") {
    const i1 = readNumber(raw, new RegExp(`i\\s*1\\s*=\\s*${num}\\s*a`, "i"));
    const l = readNumber(raw, new RegExp(`l\\s*=\\s*${num}\\s*m`, "i"));
    const r = readNumber(raw, new RegExp(`r\\s*=\\s*${num}\\s*m`, "i"));
    const i2 = readNumber(raw, new RegExp(`i\\s*2\\s*=\\s*${num}\\s*a`, "i"));
    if (i1 !== undefined) inputs.i1_A = i1;
    if (l !== undefined) inputs.l_m = l;
    if (r !== undefined) inputs.r_m = r;
    if (i2 !== undefined) inputs.i2_A = i2;
  }
}

function applyQuestionSpecificFallbacks(question: QuestionKey, inputs: Record<string, number>) {
  if (question === "q1" && !("angle_deg" in inputs)) {
    inputs.angle_deg = 60.0;
  }

  if (question === "q3" && !("r_mm" in inputs)) {
    inputs.r_mm = 1.0;
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

export function runAssignment8SolveAll(problems: ParsedProblem[]) {
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
