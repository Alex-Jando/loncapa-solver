const EPS = 8.85e-12;
const KE = 8.99e9;
const PI = Math.PI;

export function solve_q1(mean_radius_m: number): Record<string, number> {
  const capacitance_F = 4 * PI * EPS * mean_radius_m;
  return { capacitance_F };
}

export function solve_q2(parallel_pF: number, series_pF: number): Record<string, number> {
  const a = -1;
  const b = parallel_pF;
  const c = -(series_pF * parallel_pF);
  const c1 = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  const c2 = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  return { C_small_pF: Math.min(c1, c2), C_large_pF: Math.max(c1, c2) };
}

export function solve_q3(C1_uF: number, C2_uF: number, C3_uF: number): Record<string, number> {
  const branch = (C1_uF * C2_uF) / (C1_uF + C2_uF);
  const bottom = 2 * C2_uF;
  const triple = 2 * branch + C3_uF;
  const total_uF = (triple * bottom) / (triple + bottom);
  return { equivalent_uF: total_uF };
}

export function solve_q4(C1_uF: number, C2_uF: number, C3_uF: number, C4_uF: number): Record<string, number> {
  const mid = (C2_uF * C3_uF) / (C2_uF + C3_uF);
  const equivalent_uF = C1_uF + mid + C4_uF;
  return { equivalent_uF };
}

export function solve_q5(C_F: number, V_V: number, kappa: number): Record<string, number> {
  const C_initial = C_F / kappa;
  const Q = C_F * V_V;
  const W_init = Q ** 2 / (2 * C_initial);
  const W_without = Q ** 2 / (2 * C_F);
  const work_required_J = W_init - W_without;
  const voltage_withdrawn_V = V_V * kappa;
  return { work_required_J, voltage_withdrawn_V };
}

export function solve_q6(A_m2: number, d_m: number, k1: number, k2: number, k3: number): Record<string, number> {
  const C1 = (k1 * EPS * (A_m2 / 2)) / d_m;
  const C2 = (k2 * EPS * (A_m2 / 2)) / (d_m / 2);
  const C3 = (k3 * EPS * (A_m2 / 2)) / (d_m / 2);
  const C23 = (C2 * C3) / (C2 + C3);
  const C_total_F = C23 + C1;
  return { C_total_F };
}

export function solve_q7(C1_F: number, C2_F: number, V_V: number): Record<string, number> {
  const V_new = ((C1_F - C2_F) / (C1_F + C2_F)) * V_V;
  const Q1_new_C = C1_F * V_new;
  const Q2_new_C = C2_F * V_new;
  return { Q1_new_C, Q2_new_C };
}

export function solve_q8(C1_F: number, V_initial_V: number, V_new_V: number): Record<string, number> {
  const Q1 = C1_F * V_initial_V;
  const C2_F = (Q1 - V_new_V * C1_F) / V_new_V;
  return { C2_F };
}

export function solve_q9(
  diameter_m: number,
  d_m: number,
  V_V: number,
  d_new_m: number,
  new_diameter_m: number,
): Record<string, number> {
  const R = diameter_m / 2;
  const charge1_C = (V_V * EPS * PI * R ** 2) / d_m;
  const field1_V_m = charge1_C / (EPS * PI * R ** 2);
  const charge2_C = (V_V * EPS * PI * R ** 2) / d_new_m;
  const field2_V_m = charge2_C / (EPS * PI * R ** 2);
  const R2 = new_diameter_m / 2;
  console.log(diameter_m, d_m, V_V, d_new_m, new_diameter_m)
  const charge3_C = (V_V * EPS * PI * R2 ** 2) / d_m;
  const field3_V_m = charge3_C / (EPS * PI * R2 ** 2);
  return { charge1_C, field1_V_m, voltage_V1: V_V, charge2_C, field2_V_m, voltage_V2: V_V, charge3_C, field3_V_m, voltage_V3: V_V };
}

