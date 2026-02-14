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
} from "@/lib/assignment3/solvers";

type QuestionKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9" | "q10" | "q11";
const ORDERED: QuestionKey[] = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11"];

const signatures: Record<QuestionKey, RegExp[]> = {
  q1: [/uniform electric field/i, /moves from the origin/i],
  q2: [/two point charges each of magnitude/i, /electric potential on theyaxis/i],
  q3: [/electron is released from rest/i, /charged ring/i],
  q4: [/wire of finite length/i, /shape shown below/i],
  q5: [/two thin, conducting, spherical shells/i],
  q6: [/v 1/i, /proton.?s speed as it passes point A/i],
  q7: [/mercury atom/i, /diameter of the nucleus/i],
  q8: [/proton and an alpha particle/i, /initial speed of/i],
  q9: [/spherical drops of mercury/i, /merge to form a single drop/i],
  q10: [/three electrons form an equilateral triangle/i],
  q11: [/four .* spheres/i, /released simultaneously/i],
};
const problemIdMap: Partial<Record<string, QuestionKey>> = {
  "sb-prob2506a.problem": "q1",
  "sb-prob2524a.problem": "q2",
  "sb-prob2558.problem": "q3",
  "sb-prob2546.problem": "q4",
  "sb-prob2565a.problem": "q5",
  "kn-prob2944.problem": "q6",
  "kn-prob2954.problem": "q7",
  "kn-prob2942.problem": "q8",
  "kn-prob2960.problem": "q9",
  "kn-prob2908.problem": "q10",
  "kn-prob2978.problem": "q11",
};

function unit(u: string | null) {
  return (u ?? "").toLowerCase().replace(/\s+/g, "");
}

function vals(problem: ParsedProblem, predicate: (v: number, u: string) => boolean) {
  return problem.extractedValues.filter((x) => {
    if (typeof x.value !== "number" || !Number.isFinite(x.value)) return false;
    return predicate(x.value, unit(x.unit));
  });
}

function findQ(problem: ParsedProblem): QuestionKey | null {
  const mapped = problemIdMap[problem.problemId.toLowerCase()];
  if (mapped) return mapped;
  let best: { q: QuestionKey; score: number } | null = null;
  for (const q of ORDERED) {
    let score = 0;
    for (const r of signatures[q]) if (r.test(problem.rawText)) score += 1;
    if (score === 0) continue;
    if (!best || score > best.score) best = { q, score };
  }
  return best?.q ?? null;
}

function extract(q: QuestionKey, p: ParsedProblem) {
  const missing: string[] = [];
  const inputs: Record<string, number> = {};

  const V = vals(p, (_, u) => u === "v");
  const m = vals(p, (_, u) => u === "m");
  const cm = vals(p, (_, u) => u === "cm");
  const mm = vals(p, (_, u) => u === "mm");
  const c = vals(p, (_, u) => u === "c");
  const uc = vals(p, (_, u) => u === "uc");
  const nc = vals(p, (_, u) => u === "nc");
  const ncPerM = vals(p, (_, u) => u === "nc/m");
  const cperm = vals(p, (_, u) => u === "c/m");
  const ms = vals(p, (_, u) => u === "m/s");
  const nm = vals(p, (_, u) => u === "nm");
  const fm = vals(p, (_, u) => u === "fm");
  const cf = vals(p, (_, u) => u === "c");
  const ng = vals(p, (_, u) => u === "g");

  if (q === "q1") {
    if (c.length < 1) missing.push("charge_C");
    if (cm.length < 1) missing.push("x_cm");
    if (missing.length === 0) {
      inputs.field_V_m = 209;
      inputs.charge_C = c[0].value!;
      inputs.x_cm = cm[0].value!;
    }
  } else if (q === "q2") {
    if (uc.length < 2) missing.push("q_uC,q3_uC");
    if (m.length < 2) missing.push("x,y");
    if (missing.length === 0) {
      inputs.q_uC = uc[0].value!;
      inputs.x_m = Math.abs(m[0].value!);
      inputs.y_m = m[2].value!;
      inputs.q3_uC = uc[1].value!;
    }
  } else if (q === "q3") {
    if (m.length < 2) missing.push("x,r");
    if (ncPerM.length < 1) missing.push("sigma_nC_m");
    if (missing.length === 0) {
      inputs.x_m = m[0].value!;
      inputs.sigma_nC_m = ncPerM[0].value!;
      inputs.r_m = m[1].value!;
    }
  } else if (q === "q4") {
    if (cperm.length < 1) missing.push("lambda");
    if (missing.length === 0) inputs.lambda_C_m = cperm[0].value!;
  } else if (q === "q5") {
    if (cm.length < 7) missing.push("r1,r2,d1,d2,d4,d5");
    if (nc.length < 2) missing.push("q1,q2");
    if (missing.length === 0) {
      inputs.r1_cm = cm[0].value!;
      inputs.q1_nC = nc[0].value!;
      inputs.r2_cm = cm[1].value!;
      inputs.q2_nC = nc[1].value!;
      inputs.d1_cm = cm[2].value!;
      inputs.d2_cm = cm[3].value!;
      inputs.d3_cm = cm[4].value!;
    }
  } else if (q === "q6") {
    if (V.length < 3) missing.push("v1,v2,v3");
    if (ms.length < 1) missing.push("speedA");
    if (missing.length === 0) {
      inputs.v1_V = V[0].value!;
      inputs.v2_V = V[1].value!;
      inputs.v3_V = V[2].value!;
      inputs.speedA_m_s = ms[0].value!;
    }
  } else if (q === "q7") {
    if (fm.length < 1) missing.push("nucleus_diameter_fm");
    if (ms.length < 1) missing.push("proton_speed");
    if (missing.length === 0) {
      inputs.nucleus_diameter_fm = fm[0].value!;
      inputs.proton_speed_m_s = ms[0].value!;
    }
  } else if (q === "q8") {
    if (cf.length < 1) missing.push("speed_fraction_c");
    if (missing.length === 0) inputs.speed_fraction_c = cf[0].value!;
  } else if (q === "q9") {
    if (nc.length < 1) missing.push("charge_nC");
    if (V.length < 1) missing.push("potential");
    if (missing.length === 0) {
      inputs.charge_nC = nc[0].value!;
      inputs.potential_V = V[0].value!;
    }
  } else if (q === "q10") {
    if (nm.length < 1) missing.push("side_nm");
    if (missing.length === 0) inputs.side_nm = nm[0].value!;
  } else if (q === "q11") {
    if (ng.length < 1) missing.push("mass_g");
    if (nc.length < 1) missing.push("charge_nC");
    if (cm.length < 1) missing.push("d_cm");
    if (missing.length === 0) {
      inputs.mass_g = ng[0].value!;
      inputs.charge_nC = nc[0].value!;
      inputs.d_cm = cm[0].value!;
    }
  }

  return { missing, inputs };
}

function solve(q: QuestionKey, i: Record<string, number>) {
  switch (q) {
    case "q1":
      return solve_q1(i.field_V_m, i.charge_C, i.x_cm);
    case "q2":
      return solve_q2(i.q_uC, i.x_m, i.y_m, i.q3_uC);
    case "q3":
      return solve_q3(i.x_m, i.sigma_nC_m, i.r_m);
    case "q4":
      return solve_q4(i.lambda_C_m);
    case "q5":
      return solve_q5(i.r1_cm, i.q1_nC, i.r2_cm, i.q2_nC, i.d1_cm, i.d2_cm, i.d3_cm);
    case "q6":
      return solve_q6(i.v1_V, i.v2_V, i.v3_V, i.speedA_m_s);
    case "q7":
      return solve_q7(i.nucleus_diameter_fm, i.proton_speed_m_s);
    case "q8":
      return solve_q8(i.speed_fraction_c);
    case "q9":
      return solve_q9(i.charge_nC, i.potential_V);
    case "q10":
      return solve_q10(i.side_nm);
    case "q11":
      return solve_q11(i.mass_g, i.charge_nC, i.d_cm);
  }
}

export function runAssignment3SolveAll(problems: ParsedProblem[]) {
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
