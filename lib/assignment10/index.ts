import type { ParsedProblem } from "@/lib/types";
import { solve_q1, solve_q3, solve_q4, solve_q5, solve_q7, solve_q9 } from "@/lib/assignment10/solvers";

type QuestionKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6";

type SolverFn = (...args: number[]) => Record<string, number>;

interface SolverSpec {
  requiredKeys: string[];
  solve: SolverFn;
}

const ORDERED_QUESTIONS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

const solverSpecs: Record<QuestionKey, SolverSpec> = {
  q1: {
    requiredKeys: ["v_m_s", "l_m", "m_kg"],
    solve: (v, l, m) => solve_q1(v, l, m),
  },
  q2: {
    requiredKeys: ["a_m", "k_rad_m", "w_rad_s"],
    solve: (a, k, w) => solve_q3(a, k, w),
  },
  q3: {
    requiredKeys: ["t_ms", "v_m_s", "x0_cm", "v_down_m_s"],
    solve: (t, v, x0, vDown) => solve_q4(t, v, x0, vDown),
  },
  q4: {
    requiredKeys: ["l_m", "m_g", "f_hz", "n_waves", "peak_to_valley_cm"],
    solve: (l, m, f, n, peakToValley) => solve_q5(l, m, f, n, peakToValley),
  },
  q5: {
    requiredKeys: ["v1_m_s", "t1_N", "v2_m_s"],
    solve: (v1, t1, v2) => solve_q7(v1, t1, v2),
  },
  q6: {
    requiredKeys: ["u_g_m", "tension_N", "f_hz", "amp_mm"],
    solve: (u, tension, f, amp) => {
      const solved = solve_q9(u, tension, f, amp, 0, 0);
      return {
        speed_m_s: solved.speed_m_s,
        wavelength_m: solved.wavelength_m,
        amplitude_m: solved.amplitude_m,
      };
    },
  },
};

const problemIdMap: Partial<Record<string, QuestionKey>> = {
  "sb-prob1611.problem": "q1",
  "sb-prob1629a.problem": "q2",
  "sb-prob1632a.problem": "q3",
  "sb-prob1642b.problem": "q4",
  "kn-prob2008.problem": "q5",
  "kn-prob2062a.problem": "q6",
};

const questionSignatures: Record<QuestionKey, RegExp[]> = {
  q1: [/transverse waves/i, /required tension/i],
  q2: [/sinusoidal wave/i, /d\(x,t\)/i],
  q3: [/period/i, /travels downward/i, /maximum transverse speed/i],
  q4: [/four complete waves/i, /peak-to-valley/i, /power/i],
  q5: [/wave speed on a string/i, /what tension will give/i],
  q6: [/linear density/i, /what is the wave speed/i, /what is the wavelength/i],
};

function normalizeUnit(unit: string | null): string {
  return (unit ?? "").toLowerCase().replace(/\s+/g, "");
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
    v_m_s: (i) => normalizeUnit(values[i].unit) === "m/s",
    l_m: (i) => normalizeUnit(values[i].unit) === "m",
    m_kg: (i) => normalizeUnit(values[i].unit) === "kg",
    a_m: (i) => normalizeUnit(values[i].unit) === "m",
    k_rad_m: (i) => /sin\(/i.test(values[i].context),
    w_rad_s: (i) => /sin\(/i.test(values[i].context),
    t_ms: (i) => normalizeUnit(values[i].unit) === "ms",
    x0_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    v_down_m_s: (i) => normalizeUnit(values[i].unit) === "m/s",
    m_g: (i) => normalizeUnit(values[i].unit) === "g",
    f_hz: (i) => normalizeUnit(values[i].unit) === "hz",
    n_waves: (i) => /wave/i.test(values[i].context),
    peak_to_valley_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    v1_m_s: (i) => normalizeUnit(values[i].unit) === "m/s",
    t1_N: (i) => normalizeUnit(values[i].unit) === "n",
    v2_m_s: (i) => normalizeUnit(values[i].unit) === "m/s",
    u_g_m: (i) => normalizeUnit(values[i].unit) === "g/m",
    tension_N: (i) => normalizeUnit(values[i].unit) === "n",
    amp_mm: (i) => normalizeUnit(values[i].unit) === "mm",
  };

  const matcher = byKey[key];
  if (matcher) {
    const value = pickWhere(matcher);
    if (value !== undefined) return value;
  }

  const fallbackUnits: Record<string, string[]> = {
    v_m_s: ["m/s"],
    l_m: ["m"],
    m_kg: ["kg"],
    a_m: ["m"],
    t_ms: ["ms"],
    x0_cm: ["cm"],
    v_down_m_s: ["m/s"],
    m_g: ["g"],
    f_hz: ["hz"],
    peak_to_valley_cm: ["cm"],
    v1_m_s: ["m/s"],
    t1_N: ["n"],
    v2_m_s: ["m/s"],
    u_g_m: ["g/m"],
    tension_N: ["n"],
    amp_mm: ["mm"],
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
    const v = readNumber(raw, new RegExp(`speed\\s+of\\s*${num}\\s*m/s`, "i"));
    const l = readNumber(raw, new RegExp(`a\\s*${num}\\s*m\\s+length`, "i"));
    const m = readNumber(raw, new RegExp(`mass\\s+of\\s*${num}\\s*kg`, "i"));
    if (v !== undefined) inputs.v_m_s = v;
    if (l !== undefined) inputs.l_m = l;
    if (m !== undefined) inputs.m_kg = m;
  } else if (question === "q2") {
    const equation = raw.match(
      new RegExp(`D\\s*\\(\\s*x\\s*,\\s*t\\s*\\)\\s*=\\s*\\(\\s*${num}\\s*m\\s*\\)\\s*sin\\s*\\(\\s*${num}\\s*x\\s*[-+]\\s*${num}\\s*t\\s*\\)`, "i"),
    );
    if (equation) {
      const a = Number.parseFloat(equation[1]);
      const k = Number.parseFloat(equation[2]);
      const w = Number.parseFloat(equation[3]);
      if (Number.isFinite(a)) inputs.a_m = a;
      if (Number.isFinite(k)) inputs.k_rad_m = k;
      if (Number.isFinite(w)) inputs.w_rad_s = w;
    }
  } else if (question === "q3") {
    const t = readNumber(raw, new RegExp(`period\\s*t\\s*=\\s*${num}\\s*ms`, "i"));
    const v = readNumber(raw, new RegExp(`speed\\s+of\\s*${num}\\s*m/s`, "i"));
    const x0 = readNumber(raw, new RegExp(`displacement\\s+of\\s*${num}\\s*cm`, "i"));
    const vDown = readNumber(raw, new RegExp(`downward\\s+with\\s+a\\s+speed\\s+of\\s*${num}\\s*m/s`, "i"));
    if (t !== undefined) inputs.t_ms = t;
    if (v !== undefined) inputs.v_m_s = v;
    if (x0 !== undefined) inputs.x0_cm = x0;
    if (vDown !== undefined) inputs.v_down_m_s = vDown;
  } else if (question === "q4") {
    const l = readNumber(raw, new RegExp(`a\\s*${num}\\s*m\\s+segment`, "i"));
    const m = readNumber(raw, new RegExp(`mass\\s+of\\s*${num}\\s*g`, "i"));
    const f = readNumber(raw, new RegExp(`frequency\\s+of\\s*${num}\\s*hz`, "i"));
    const peakValley = readNumber(raw, new RegExp(`peak-to-valley\\s+displacement\\s+of\\s*${num}\\s*cm`, "i"));
    if (l !== undefined) inputs.l_m = l;
    if (m !== undefined) inputs.m_g = m;
    if (f !== undefined) inputs.f_hz = f;
    if (peakValley !== undefined) inputs.peak_to_valley_cm = peakValley;
    if (/four\s+complete\s+waves/i.test(raw)) inputs.n_waves = 4;
  } else if (question === "q5") {
    const v1 = readNumber(raw, new RegExp(`is\\s*${num}\\s*m/s\\s+when\\s+the\\s+tension`, "i"));
    const t1 = readNumber(raw, new RegExp(`tension\\s+is\\s*${num}\\s*n`, "i"));
    const v2 = readNumber(raw, new RegExp(`speed\\s*${num}\\s*m/s`, "i"));
    if (v1 !== undefined) inputs.v1_m_s = v1;
    if (t1 !== undefined) inputs.t1_N = t1;
    if (v2 !== undefined) inputs.v2_m_s = v2;
  } else if (question === "q6") {
    const u = readNumber(raw, new RegExp(`linear\\s+density\\s*${num}\\s*g/m`, "i"));
    const tension = readNumber(raw, new RegExp(`tension\\s*${num}\\s*n`, "i"));
    const f = readNumber(raw, new RegExp(`frequency\\s+of\\s*${num}\\s*hz`, "i"));
    const amp = readNumber(raw, new RegExp(`displacement\\s+of\\s*${num}\\s*mm`, "i"));
    if (u !== undefined) inputs.u_g_m = u;
    if (tension !== undefined) inputs.tension_N = tension;
    if (f !== undefined) inputs.f_hz = f;
    if (amp !== undefined) inputs.amp_mm = amp;
  }
}

export function runAssignment10SolveAll(problems: ParsedProblem[]) {
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
