import type { ParsedProblem } from "@/lib/types";
import {
  solve_q1,
  solve_q10,
  solve_q11,
  solve_q2,
  solve_q3,
  solve_q4,
  solve_q5,
  solve_q6,
  solve_q7,
  solve_q8,
  solve_q9,
} from "@/lib/assignment2/solvers";

type QuestionKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9" | "q10" | "q11";
const ORDERED: QuestionKey[] = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11"];

const signatures: Record<QuestionKey, RegExp[]> = {
  q1: [/uniform electric field/i, /flux through this area/i, /yz/i],
  q2: [/infinitely long line charge/i, /distance d/i, /sphere of radius/i],
  q3: [/point charge/i, /center of a cube/i, /six other identical/i],
  q4: [/solid sphere/i, /uniformly distributed throughout its volume/i],
  q5: [/insulating sphere/i, /charge enclosed/i],
  q6: [/solid conducting sphere/i, /conducting spherical shell/i],
  q7: [/closed surface with dimensions/i, /nonuniform/i],
  q8: [/cylindrical shell/i, /radially outward/i],
  q9: [/three gaussian surfaces/i, /charge of q 1/i],
  q10: [/square copper plate/i, /electrons/i],
  q11: [/solid metal sphere/i, /hollow metal sphere/i],
};
const problemIdMap: Partial<Record<string, QuestionKey>> = {
  "sb-prob2406a.problem": "q1",
  "sb-prob2418.problem": "q2",
  "sb-prob2419.problem": "q3",
  "sb-prob2427a.problem": "q4",
  "sb-prob2434a.problem": "q5",
  "sb-prob2449a.problem": "q6",
  "sb-prob2462a.problem": "q7",
  "sb-prob2428a.problem": "q8",
  "kn-prob2730a.problem": "q9",
  "kn-prob2734a.problem": "q10",
  "kn-prob2739a.problem": "q11",
};

function unit(u: string | null) {
  return (u ?? "").toLowerCase().replace(/\s+/g, "");
}

function vals(problem: ParsedProblem, predicate: (v: number, u: string, raw: string, ctx: string) => boolean) {
  return problem.extractedValues.filter((x) => {
    if (typeof x.value !== "number" || !Number.isFinite(x.value)) return false;
    return predicate(x.value, unit(x.unit), x.raw, x.context);
  });
}

function parseLabeledMeterValue(rawText: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = pattern.exec(rawText);
    if (!match) continue;
    const parsed = Number.parseFloat(match[1]);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function findQ(problem: ParsedProblem): QuestionKey | null {
  const mapped = problemIdMap[problem.problemId.toLowerCase()];
  if (mapped) return mapped;
  let best: { q: QuestionKey; score: number } | null = null;
  for (const q of ORDERED) {
    let score = 0;
    for (const r of signatures[q]) {
      if (r.test(problem.rawText)) score += 1;
    }
    if (score === 0) continue;
    if (!best || score > best.score) best = { q, score };
  }
  return best?.q ?? null;
}

function extract(q: QuestionKey, p: ParsedProblem) {
  const missing: string[] = [];
  const inputs: Record<string, number> = {};

  const nOverC = vals(p, (_, u) => u === "n/c");
  const m = vals(p, (_, u) => u === "m");
  const cm = vals(p, (_, u) => u === "cm");
  const mm = vals(p, (_, u) => u === "mm");
  const uc = vals(p, (_, u) => u === "uc");
  const nc = vals(p, (_, u) => u === "nc");
  const cm2 = vals(p, (_, u) => u === "cm2");
  const m2 = vals(p, (_, u) => u === "m2");
  const cperm = vals(p, (_, u) => u === "c/m");
  const components = vals(p, (_, u) => u === "component");

  if (q === "q1") {
    if (components.length < 2) missing.push("x_comp,y_comp");
    if (m2.length < 1) missing.push("area_m2");
    if (missing.length === 0) {
      inputs.x_comp_N_C = components[0].value!;
      inputs.y_comp_N_C = components[1].value!;
      inputs.area_m2 = m2[0].value!;
    }
  } else if (q === "q2") {
    if (cperm.length < 1) missing.push("lambda_C_m");
    if (m.length < 2) missing.push("d_m,r_m");
    if (missing.length === 0) {
      inputs.lambda_C_m = cperm[0].value!;
      inputs.d_m = m[0].value!;
      inputs.r_m = m[1].value!;
    }
  } else if (q === "q3") {
    if (uc.length < 2) missing.push("Q_uC,q_uC");
    if (m.length < 1) missing.push("side_m");
    if (missing.length === 0) {
      inputs.Q_uC = uc[0].value!;
      inputs.side_m = m[0].value!;
      inputs.q_uC = uc[1].value!;
    }
  } else if (q === "q4") {
    if (cm.length < 4) missing.push("radius,b,c,d");
    if (uc.length < 1) missing.push("charge_uC");
    if (missing.length === 0) {
      inputs.radius_cm = cm[0].value!;
      inputs.charge_uC = uc[0].value!;
      void cm[1].value!;
      inputs.b_cm = cm[2].value!;
      inputs.c_cm = cm[3].value!;
      inputs.d_cm = cm[4].value!;
    }
  } else if (q === "q5") {
    if (cm.length < 2) missing.push("diameter_cm,radius_cm");
    if (uc.length < 1) missing.push("charge_uC");
    if (missing.length === 0) {
      inputs.diameter_cm = cm[0].value!;
      inputs.charge_uC = uc[0].value!;
      inputs.radius_cm = cm[1].value!;
    }
  } else if (q === "q6") {
    if (cm.length < 7) missing.push("r,ri,ro,r1,r2");
    if (uc.length < 2) missing.push("q1_uC,q2_uC");
    if (missing.length === 0) {
      inputs.r_cm = cm[0].value!;
      inputs.q1_uC = uc[0].value!;
      inputs.ri_cm = cm[1].value!;
      inputs.ro_cm = cm[2].value!;
      inputs.q2_uC = uc[1].value!;
      inputs.r1_cm = cm[4].value!;
      inputs.r2_cm = cm[6].value!;
    }
  } else if (q === "q7") {
    if (m.length < 2) missing.push("a,c");
    if (missing.length === 0) {
      inputs.a_m = m[0].value!;
      inputs.c_m = m[1].value!;
      inputs.f1_N_C = 3.12;
      inputs.f2_N_C_per_m2 = 1.84;
    }
  } else if (q === "q8") {
    const radiusFromText = parseLabeledMeterValue(p.rawText, [
      /radius[^0-9+\-.]*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)\s*m\b/i,
      /\br\s*=\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)\s*m\b/i,
    ]);
    const lengthFromText = parseLabeledMeterValue(p.rawText, [
      /length[^0-9+\-.]*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)\s*m\b/i,
      /\bl\s*=\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)\s*m\b/i,
    ]);
    const pFromText = parseLabeledMeterValue(p.rawText, [
      /point[^0-9+\-.]*\bp\b[^0-9+\-.]*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)\s*m\b/i,
      /radially outward[^0-9+\-.]*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)\s*m\b/i,
      /\bp\s*=\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)\s*m\b/i,
    ]);

    const meterValues = m.map((item) => item.value!).filter((v) => Number.isFinite(v));
    const radiusCandidate = radiusFromText ?? meterValues[0];
    const lengthCandidate = lengthFromText ?? meterValues[1];
    const pCandidate = pFromText ?? meterValues[2];

    if (!Number.isFinite(radiusCandidate)) missing.push("radius_m");
    if (!Number.isFinite(lengthCandidate)) missing.push("length_m");
    if (!Number.isFinite(pCandidate)) missing.push("p_m");
    if (nOverC.length < 1) missing.push("field_N_C");

    if (missing.length === 0) {
      inputs.radius_m = radiusCandidate!;
      inputs.length_m = lengthCandidate!;
      inputs.p_m = pCandidate!;
      inputs.field_N_C = nOverC[0].value!;
    }
  } else if (q === "q9") {
    if (nc.length < 1) missing.push("q_nC");
    if (missing.length === 0) {
      inputs.q_nC = nc[0].value!;
    }
  } else if (q === "q10") {
    if (cm.length < 1) missing.push("length_cm");
    if (mm.length < 1) missing.push("p_mm");
    if (missing.length === 0) {
      inputs.length_cm = cm[0].value!;
      inputs.electrons_count = 4e8;
      inputs.p_mm = mm[0].value!;
    }
  } else if (q === "q11") {
    if (cm.length < 5) missing.push("r,ri,ro,d1,d2");
    if (nOverC.length < 1) missing.push("field");
    if (missing.length === 0) {
      inputs.r_cm = cm[0].value!;
      inputs.ri_cm = cm[1].value!;
      inputs.ro_cm = cm[2].value!;
      inputs.d1_cm = cm[3].value!;
      inputs.field_N_C = nOverC[0].value!;
      inputs.d2_cm = cm[4].value!;
    }
  }

  return { missing, inputs };
}

function solve(q: QuestionKey, i: Record<string, number>) {
  switch (q) {
    case "q1":
      return solve_q1(i.x_comp_N_C, i.y_comp_N_C, i.area_m2);
    case "q2":
      return solve_q2(i.lambda_C_m, i.d_m, i.r_m);
    case "q3":
      return solve_q3(i.Q_uC, i.side_m, i.q_uC);
    case "q4":
      return solve_q4(i.radius_cm, i.charge_uC, i.b_cm, i.c_cm, i.d_cm);
    case "q5":
      return solve_q5(i.diameter_cm, i.charge_uC, i.radius_cm);
    case "q6":
      return solve_q6(i.r_cm, i.q1_uC, i.ri_cm, i.ro_cm, i.q2_uC, i.r1_cm, i.r2_cm);
    case "q7":
      return solve_q7(i.a_m, i.c_m, i.f1_N_C, i.f2_N_C_per_m2);
    case "q8":
      return solve_q8(i.radius_m, i.length_m, i.p_m, i.field_N_C);
    case "q9":
      return solve_q9(i.q_nC);
    case "q10":
      return solve_q10(i.length_cm, i.electrons_count, i.p_mm);
    case "q11":
      return solve_q11(i.r_cm, i.ri_cm, i.ro_cm, i.d1_cm, i.field_N_C, i.d2_cm);
  }
}

export function runAssignment2SolveAll(problems: ParsedProblem[]) {
  const mapped: Partial<Record<QuestionKey, ParsedProblem>> = {};
  const answers: Record<string, any> = {};

  for (const p of problems) {
    const q = findQ(p);
    if (q && !mapped[q]) mapped[q] = p;
  }

  for (const q of ORDERED) {
    const p = mapped[q];
    if (!p) {
      answers[q] = { ok: false, problemId: null, error: "No matching parsed problem found for this question." };
      continue;
    }
    const ext = extract(q, p);
    if (ext.missing.length > 0) {
      answers[q] = {
        ok: false,
        problemId: p.problemId,
        error: "Could not infer all required inputs from extracted values.",
        missing: ext.missing,
      };
      continue;
    }
    answers[q] = { ok: true, problemId: p.problemId, inputsUsed: ext.inputs, results: solve(q, ext.inputs) };
  }

  return { ok: true, answers };
}
