import {
  solve_q1,
  solve_q10,
  solve_q11,
  solve_q12,
  solve_q2,
  solve_q3,
  solve_q4,
  solve_q5,
  solve_q6,
  solve_q7,
  solve_q8,
  solve_q9,
} from "@/lib/assignment5/solvers";
import type { ParsedProblem } from "@/lib/types";

type SolverFn = (...args: number[]) => Record<string, number>;

interface SolverSpec {
  requiredKeys: string[];
  solve: SolverFn;
}

const solverSpecs: Record<string, SolverSpec> = {
  q1: { requiredKeys: ["battery_ah"], solve: (battery_ah) => solve_q1(battery_ah) },
  q2: { requiredKeys: ["D_mm", "I_uA"], solve: (D_mm, I_uA) => solve_q2(D_mm, I_uA) },
  q3: {
    requiredKeys: ["Q_coulomb", "omega_rad_s"],
    solve: (Q_coulomb, omega_rad_s) => solve_q3(Q_coulomb, omega_rad_s),
  },
  q4: {
    requiredKeys: ["beam_MeV", "current_A"],
    solve: (beam_MeV, current_A) => solve_q4(beam_MeV, current_A),
  },
  q5: {
    requiredKeys: ["R_initial_ohm", "length_factor"],
    solve: (R_initial_ohm, length_factor) => solve_q5(R_initial_ohm, length_factor),
  },
  q6: {
    requiredKeys: ["side_mm", "rho1_ohm_m", "L1_cm", "rho2_ohm_m", "L2_cm"],
    solve: (side_mm, rho1_ohm_m, L1_cm, rho2_ohm_m, L2_cm) =>
      solve_q6(side_mm, rho1_ohm_m, L1_cm, rho2_ohm_m, L2_cm),
  },
  q7: {
    requiredKeys: ["diameter_cm", "length_km", "current_A", "n_per_m3"],
    solve: (diameter_cm, length_km, current_A, n_per_m3) =>
      solve_q7(diameter_cm, length_km, current_A, n_per_m3),
  },
  q8: {
    requiredKeys: ["drift_speed_m_s", "mean_free_time_s"],
    solve: (drift_speed_m_s, mean_free_time_s) => solve_q8(drift_speed_m_s, mean_free_time_s),
  },
  q9: {
    requiredKeys: [
      "V_line_V",
      "length_m",
      "resistance_value_ohm",
      "resistance_distance_m",
      "load_current_A",
    ],
    solve: (V_line_V, length_m, resistance_value_ohm, resistance_distance_m, load_current_A) =>
      solve_q9(V_line_V, length_m, resistance_value_ohm, resistance_distance_m, load_current_A),
  },
  q10: {
    requiredKeys: ["delta_current_A", "V_initial_V", "V_final_V"],
    solve: (delta_current_A, V_initial_V, V_final_V) =>
      solve_q10(delta_current_A, V_initial_V, V_final_V),
  },
  q11: {
    requiredKeys: ["surge_voltage_V", "bulb_voltage_V", "bulb_watt_W"],
    solve: (surge_voltage_V, bulb_voltage_V, bulb_watt_W) =>
      solve_q11(surge_voltage_V, bulb_voltage_V, bulb_watt_W),
  },
  q12: {
    requiredKeys: ["mass_g", "resistivity_ohm_m", "density_g_cm3", "total_resistance_ohm"],
    solve: (mass_g, resistivity_ohm_m, density_g_cm3, total_resistance_ohm) =>
      solve_q12(mass_g, resistivity_ohm_m, density_g_cm3, total_resistance_ohm),
  },
};

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
  "q10",
  "q11",
  "q12",
] as const;

type QuestionKey = (typeof ORDERED_QUESTIONS)[number];

const questionSignatures: Record<QuestionKey, RegExp[]> = {
  q1: [/car battery/i, /a\s*hr/i],
  q2: [/electron beam/i, /picture tube/i],
  q3: [/small sphere/i, /whirled in a circle/i, /rotating charge/i],
  q4: [/beam produced by the generator/i, /mev/i, /atoms are/i],
  q5: [/resistance .* lengthened/i, /stretched/i, /pulled through a small hole/i],
  q6: [/rod .* two materials/i, /square cross section/i, /L ?1/i, /L ?2/i],
  q7: [/transmission line/i, /electrons\/m3/i, /free charge density/i],
  q8: [/drift speed/i, /mean free time/i, /collisions/i],
  q9: [/customer.?s house/i, /main power lines/i, /ohm per/i],
  q10: [/current .* decreases/i, /potential difference/i, /final voltage/i],
  q11: [/voltage surge/i, /lightbulb/i, /percentage/i],
  q12: [/sample of a conducting material/i, /density/i, /cylindrical wire/i],
};

function normalizeUnit(unit: string | null): string {
  const raw = (unit ?? "").toLowerCase().replace(/\s+/g, "");
  if (raw === "\u03c9" || raw === "\u03a9".toLowerCase() || raw === "\u2126".toLowerCase()) {
    return "\u2126";
  }
  if (raw === "\u03bc" + "a" || raw === "\u00b5a") {
    return "\u00b5a";
  }
  if (
    raw === "\u03c9\u00b7m" ||
    raw === "\u03a9\u00b7m".toLowerCase() ||
    raw === "\u2126\u00b7m".toLowerCase()
  ) {
    return "\u2126\u00b7m";
  }
  return raw;
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

function pickInputValue(
  problem: ParsedProblem,
  key: string,
  usedIndices: Set<number>,
): number | undefined {
  const values = problem.extractedValues;

  function pickWhere(predicate: (index: number) => boolean): number | undefined {
    for (let i = 0; i < values.length; i += 1) {
      if (usedIndices.has(i)) {
        continue;
      }
      const candidate = values[i];
      if (typeof candidate.value !== "number" || !Number.isFinite(candidate.value)) {
        continue;
      }
      if (!predicate(i)) {
        continue;
      }
      usedIndices.add(i);
      return candidate.value;
    }
    return undefined;
  }

  const byKey: Record<string, (index: number) => boolean> = {
    battery_ah: (i) => normalizeUnit(values[i].unit).includes("a") && /a\s*hr/i.test(values[i].raw),
    D_mm: (i) => normalizeUnit(values[i].unit) === "mm",
    I_uA: (i) => ["\u00b5a", "ua"].includes(normalizeUnit(values[i].unit)),
    Q_coulomb: (i) => normalizeUnit(values[i].unit) === "c",
    omega_rad_s: (i) => normalizeUnit(values[i].unit) === "rad/s",
    beam_MeV: (i) => /mev/i.test(values[i].raw) || normalizeUnit(values[i].unit) === "mev",
    current_A: (i) => normalizeUnit(values[i].unit) === "a",
    R_initial_ohm: (i) => normalizeUnit(values[i].unit) === "\u2126",
    length_factor: (i) => normalizeUnit(values[i].unit) === "times",
    side_mm: (i) => normalizeUnit(values[i].unit) === "mm",
    rho1_ohm_m: (i) => normalizeUnit(values[i].unit) === "\u2126\u00b7m",
    L1_cm: (i) => normalizeUnit(values[i].unit) === "cm" && /l1|first material/i.test(values[i].context + values[i].raw),
    rho2_ohm_m: (i) => normalizeUnit(values[i].unit) === "\u2126\u00b7m",
    L2_cm: (i) => normalizeUnit(values[i].unit) === "cm" && /l2|second material/i.test(values[i].context + values[i].raw),
    diameter_cm: (i) => normalizeUnit(values[i].unit) === "cm",
    length_km: (i) => normalizeUnit(values[i].unit) === "km",
    n_per_m3: (i) => normalizeUnit(values[i].unit) === "electrons/m3",
    drift_speed_m_s: (i) => normalizeUnit(values[i].unit) === "m/s",
    mean_free_time_s: (i) => normalizeUnit(values[i].unit) === "s",
    V_line_V: (i) => normalizeUnit(values[i].unit) === "v" && /main|line|power/i.test(values[i].context),
    length_m: (i) => normalizeUnit(values[i].unit) === "m",
    resistance_value_ohm: (i) => normalizeUnit(values[i].unit) === "\u2126",
    resistance_distance_m: (i) => normalizeUnit(values[i].unit) === "m" && /per|meter/i.test(values[i].context + values[i].raw),
    load_current_A: (i) => normalizeUnit(values[i].unit) === "a",
    delta_current_A: (i) => normalizeUnit(values[i].unit) === "a",
    V_initial_V: (i) => normalizeUnit(values[i].unit) === "v" && /from|initial|decreases from/i.test(values[i].context),
    V_final_V: (i) => normalizeUnit(values[i].unit) === "v" && /to|final|decreases .* to/i.test(values[i].context),
    surge_voltage_V: (i) => normalizeUnit(values[i].unit) === "v" && /surge/i.test(values[i].context),
    bulb_voltage_V: (i) => normalizeUnit(values[i].unit) === "v" && /lightbulb|bulb/i.test(values[i].context),
    bulb_watt_W: (i) => normalizeUnit(values[i].unit) === "w",
    mass_g: (i) => normalizeUnit(values[i].unit) === "g",
    resistivity_ohm_m: (i) => normalizeUnit(values[i].unit) === "\u2126\u00b7m",
    density_g_cm3: (i) => normalizeUnit(values[i].unit) === "g/cm3",
    total_resistance_ohm: (i) => normalizeUnit(values[i].unit) === "\u2126",
  };

  const matcher = byKey[key];
  if (matcher) {
    const exact = pickWhere(matcher);
    if (exact !== undefined) {
      return exact;
    }
  }

  const fallbackByUnit: Record<string, string[]> = {
    battery_ah: ["a·hr"],
    D_mm: ["mm"],
    I_uA: ["\u00b5a", "ua"],
    Q_coulomb: ["c"],
    omega_rad_s: ["rad/s"],
    beam_MeV: ["mev"],
    current_A: ["a"],
    R_initial_ohm: ["\u2126"],
    length_factor: ["times"],
    side_mm: ["mm"],
    rho1_ohm_m: ["\u2126\u00b7m"],
    L1_cm: ["cm"],
    rho2_ohm_m: ["\u2126\u00b7m"],
    L2_cm: ["cm"],
    diameter_cm: ["cm"],
    length_km: ["km"],
    n_per_m3: ["electrons/m3"],
    drift_speed_m_s: ["m/s"],
    mean_free_time_s: ["s"],
    V_line_V: ["v"],
    length_m: ["m"],
    resistance_value_ohm: ["\u2126"],
    resistance_distance_m: ["m"],
    load_current_A: ["a"],
    delta_current_A: ["a"],
    V_initial_V: ["v"],
    V_final_V: ["v"],
    surge_voltage_V: ["v"],
    bulb_voltage_V: ["v"],
    bulb_watt_W: ["w"],
    mass_g: ["g"],
    resistivity_ohm_m: ["\u2126\u00b7m"],
    density_g_cm3: ["g/cm3"],
    total_resistance_ohm: ["\u2126"],
  };

  const acceptedUnits = fallbackByUnit[key] ?? [];
  if (acceptedUnits.length > 0) {
    const fallback = pickWhere((i) => acceptedUnits.includes(normalizeUnit(values[i].unit)));
    if (fallback !== undefined) {
      return fallback;
    }
  }

  return undefined;
}

export function runAssignment5Solver(question: string, inputs: Record<string, number>) {
  const spec = solverSpecs[question];
  if (!spec) {
    return { ok: false, error: "Unknown question. Use q1..q12." };
  }

  const missing: string[] = [];
  const invalid: string[] = [];
  const inputsUsed: Record<string, number> = {};

  for (const key of spec.requiredKeys) {
    if (!(key in inputs)) {
      missing.push(key);
      continue;
    }

    const value = inputs[key];
    if (typeof value !== "number" || !Number.isFinite(value)) {
      invalid.push(key);
      continue;
    }
    inputsUsed[key] = value;
  }

  if (missing.length > 0) {
    return {
      ok: false,
      error: "Missing required inputs.",
      missing,
    };
  }

  if (invalid.length > 0) {
    return {
      ok: false,
      error: `Invalid input values for: ${invalid.join(", ")}.`,
      missing: invalid,
    };
  }

  const orderedArgs = spec.requiredKeys.map((key) => inputsUsed[key]);
  const results = spec.solve(...orderedArgs);

  return {
    ok: true,
    results,
    inputsUsed,
  };
}

export function runAssignment5SolveAll(problems: ParsedProblem[]) {
  const outputs: Record<
    string,
    | {
        ok: true;
        problemId: string;
        inputsUsed: Record<string, number>;
        results: Record<string, number>;
      }
    | {
        ok: false;
        problemId: string | null;
        error: string;
        missing?: string[];
      }
  > = {};

  const problemByQuestion: Partial<Record<QuestionKey, ParsedProblem>> = {};
  const usedProblemIds = new Set<string>();

  for (const problem of problems) {
    const guessed = findQuestionForProblem(problem);
    if (!guessed) {
      continue;
    }
    if (!problemByQuestion[guessed]) {
      problemByQuestion[guessed] = problem;
      usedProblemIds.add(problem.problemId);
    }
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
    const usedValueIndices = new Set<number>();
    const inputs: Record<string, number> = {};
    const missing: string[] = [];

    for (const key of spec.requiredKeys) {
      const value = pickInputValue(problem, key, usedValueIndices);
      if (value === undefined || !Number.isFinite(value)) {
        missing.push(key);
      } else {
        inputs[key] = value;
      }
    }

    if (missing.length > 0) {
      outputs[question] = {
        ok: false,
        problemId: problem.problemId,
        error: "Could not infer all required inputs from extracted values.",
        missing,
      };
      continue;
    }

    const solved = runAssignment5Solver(question, inputs);
    if (!solved.ok) {
      outputs[question] = {
        ok: false,
        problemId: problem.problemId,
        error: solved.error ?? "Solve failed.",
        missing: solved.missing,
      };
      continue;
    }

    outputs[question] = {
      ok: true,
      problemId: problem.problemId,
      inputsUsed: solved.inputsUsed as Record<string, number>,
      results: solved.results as Record<string, number>,
    };
  }

  return {
    ok: true,
    answers: outputs,
    matchedProblems: Array.from(usedProblemIds),
  };
}
