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
} from "@/lib/assignment4/solvers";

type QuestionKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9";
const ORDERED: QuestionKey[] = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"];

const signatures: Record<QuestionKey, RegExp[]> = {
  q1: [/capacitance of the earth/i],
  q2: [/connected in parallel/i, /connected in series/i],
  q3: [/equivalent capacitance between pointsaand b/i, /c 1/i, /c 2/i, /c 3/i],
  q4: [/equivalent capacitance between pointsaandb/i, /C 4/i],
  q5: [/parallel-plate capacitor/i, /dielectric material/i],
  q6: [/parallel-plate capacitor with an area/i, /three dielectric materials/i],
  q7: [/capacitorsc 1/i, /230V battery/i],
  q8: [/fully charged across a 18.0V battery/i],
  q9: [/diameter electrodes/i, /parallel plate capacitor/i],
};
const problemIdMap: Partial<Record<string, QuestionKey>> = {
  "sb-prob2616.problem": "q1",
  "sb-prob2619.problem": "q2",
  "sb-prob2628.problem": "q3",
  "sb-prob2630.problem": "q4",
  "sb-prob2656a.problem": "q5",
  "sb-prob2658.problem": "q6",
  "sb-prob2672a.problem": "q7",
  "sf-prob1636.problem": "q8",
  "kn-prob2958a.problem": "q9",
};

function unit(u: string | null) {
  return (u ?? "").toLowerCase().replace(/\s+/g, "");
}

function vals(problem: ParsedProblem, predicate: (v: number, u: string, raw: string) => boolean) {
  return problem.extractedValues.filter((x) => {
    if (typeof x.value !== "number" || !Number.isFinite(x.value)) return false;
    return predicate(x.value, unit(x.unit), x.raw);
  });
}

function extractKappaAssignments(rawText: string): Record<string, number> {
  const out: Record<string, number> = {};
  const regex = /(?:kappa|k|κ|Îº)\s*([123])?\s*=\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[Ee][+-]?\d+)?)/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(rawText)) !== null) {
    const idx = match[1];
    const parsed = Number.parseFloat(match[2]);
    if (!Number.isFinite(parsed)) {
      continue;
    }
    if (idx) {
      out[`k${idx}`] = parsed;
    } else if (out.kappa === undefined) {
      out.kappa = parsed;
    }
  }
  return out;
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

  const m = vals(p, (_, u) => u === "m");
  const cm = vals(p, (_, u) => u === "cm");
  const cm2 = vals(p, (_, u) => u === "cm2");
  const v = vals(p, (_, u) => u === "v");
  const pf = vals(p, (_, u) => u === "pf");
  const uf = vals(p, (_, u) => u === "uf");
  const nf = vals(p, (_, u) => u === "nf");
  const kappas = extractKappaAssignments(p.rawText);

  if (q === "q1") {
    if (m.length < 1) missing.push("mean_radius_m");
    if (missing.length === 0) inputs.mean_radius_m = m[0].value!;
  } else if (q === "q2") {
    if (pf.length < 2) missing.push("parallel_pF,series_pF");
    if (missing.length === 0) {
      inputs.parallel_pF = Math.max(pf[0].value!, pf[1].value!);
      inputs.series_pF = Math.min(pf[0].value!, pf[1].value!);
    }
  } else if (q === "q3") {
    if (uf.length < 3) missing.push("C1_uF,C2_uF,C3_uF");
    if (missing.length === 0) {
      inputs.C1_uF = uf[0].value!;
      inputs.C2_uF = uf[1].value!;
      inputs.C3_uF = uf[2].value!;
    }
  } else if (q === "q4") {
    if (uf.length < 4) missing.push("C1_uF,C2_uF,C3_uF,C4_uF");
    if (missing.length === 0) {
      inputs.C1_uF = uf[0].value!;
      inputs.C2_uF = uf[1].value!;
      inputs.C3_uF = uf[2].value!;
      inputs.C4_uF = uf[3].value!;
    }
  } else if (q === "q5") {
    if (nf.length < 1) missing.push("C_F");
    if (v.length < 1) missing.push("V");
    if (!Number.isFinite(kappas.kappa)) missing.push("kappa");
    if (missing.length === 0) {
      inputs.C_F = nf[0].value! * 1e-9;
      inputs.V_V = v[0].value!;
      inputs.kappa = kappas.kappa;
    }
  } else if (q === "q6") {
    if (cm2.length < 1 || cm.length < 1) missing.push("A,d");
    if (!Number.isFinite(kappas.k1)) missing.push("k1");
    if (!Number.isFinite(kappas.k2)) missing.push("k2");
    if (!Number.isFinite(kappas.k3)) missing.push("k3");
    if (missing.length === 0) {
      inputs.A_m2 = cm2[0].value! / 10000;
      inputs.d_m = cm[0].value! / 100;
      inputs.k1 = kappas.k1;
      inputs.k2 = kappas.k2;
      inputs.k3 = kappas.k3;
    }
  } else if (q === "q7") {
    if (uf.length < 2) missing.push("C1,C2");
    if (v.length < 1) missing.push("V");
    if (missing.length === 0) {
      inputs.C1_F = uf[0].value! * 1e-6;
      inputs.C2_F = uf[1].value! * 1e-6;
      inputs.V_V = v[0].value!;
    }
  } else if (q === "q8") {
    if (uf.length < 1) missing.push("C1");
    if (v.length < 2) missing.push("V_initial,V_new");
    if (missing.length === 0) {
      inputs.C1_F = uf[0].value! * 1e-6;
      inputs.V_initial_V = v[0].value!;
      inputs.V_new_V = v[1].value!;
    }
  } else if (q === "q9") {
    if (cm.length < 4) missing.push("diameter,d,d_new,new_diameter");
    if (v.length < 1) missing.push("V");
    if (missing.length === 0) {
      inputs.diameter_m = cm[0].value! / 100;
      inputs.d_m = cm[1].value! / 100;
      inputs.V_V = v[0].value!;
      inputs.d_new_m = cm[2].value! / 100;
      inputs.new_diameter_m = cm[4].value! / 100;
    }
  }

  return { missing, inputs };
}

function solve(q: QuestionKey, i: Record<string, number>) {
  switch (q) {
    case "q1":
      return solve_q1(i.mean_radius_m);
    case "q2":
      return solve_q2(i.parallel_pF, i.series_pF);
    case "q3":
      return solve_q3(i.C1_uF, i.C2_uF, i.C3_uF);
    case "q4":
      return solve_q4(i.C1_uF, i.C2_uF, i.C3_uF, i.C4_uF);
    case "q5":
      return solve_q5(i.C_F, i.V_V, i.kappa);
    case "q6":
      return solve_q6(i.A_m2, i.d_m, i.k1, i.k2, i.k3);
    case "q7":
      return solve_q7(i.C1_F, i.C2_F, i.V_V);
    case "q8":
      return solve_q8(i.C1_F, i.V_initial_V, i.V_new_V);
    case "q9":
      return solve_q9(i.diameter_m, i.d_m, i.V_V, i.d_new_m, i.new_diameter_m);
  }
}

export function runAssignment4SolveAll(problems: ParsedProblem[]) {
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
