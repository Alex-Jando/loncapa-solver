const KE = 8.99e9;
const EPS = 8.85e-12;
const E_Q = 1.602e-19;
const M_E = 9.11e-31;
const M_P = 1.67e-27;
const A_M = 1.66e-27;

export function solve_q1(field_V_m: number, charge_C: number, x_cm: number): Record<string, number> {
  const x_m = x_cm / 100;
  const U_J = -charge_C * field_V_m * x_m;
  const deltaV_V = -field_V_m * x_m;
  return { U_J, deltaV_V };
}

export function solve_q2(q_uC: number, x_m: number, y_m: number, q3_uC: number): Record<string, number> {
  const q1 = q_uC * 1e-6;
  const V_V = KE * 2 * (q1/Math.sqrt(x_m**2+y_m**2));
  const q2 = q3_uC * 1e-6;
  const U_J = V_V * q2;
  return { V_V, U_J };
}

export function solve_q3(x_m: number, sigma_nC_m: number, r_m: number): Record<string, number> {
  const s = sigma_nC_m * 1e-9;
  const part1 = (-2 * E_Q) / M_E;
  const part2 = (2 * Math.PI * KE * s * r_m) / Math.sqrt(r_m ** 2 + x_m ** 2) - 2 * Math.PI * KE * s;
  const velocity_m_s = Math.sqrt(part1 * part2);
  return { velocity_m_s };
}

export function solve_q4(lambda_C_m: number): Record<string, number> {
  const V_V = KE * lambda_C_m * (Math.PI + 2 * Math.log(3));
  return { V_V };
}

export function solve_q5(
  r1_cm: number,
  q1_nC: number,
  r2_cm: number,
  q2_nC: number,
  d1_cm: number,
  d2_cm: number,
  d3_cm: number,
): Record<string, number> {

  const r1 = r1_cm / 100;
  const r2 = r2_cm / 100;
  const q1 = q1_nC * 1e-9;
  const q2 = Math.abs(q2_nC * 1e-9);
  const d1 = d1_cm / 100;
  const d2 = d2_cm / 100;
  const d3 = d3_cm / 100;

  console.log({ r1, q1, r2, q2, d1, d2, d3 })

  const b_N_C = KE * (q1 / d2 ** 2);
  const c_N_C = KE * ((q1 - q2) / d3 ** 2);
  const d_V = KE * (q1 / r1 - q2 / r2);
  const e_V = KE * (q1 / d2 - q2 / r2);
  const f_V = KE * ((q1 - q2) / d3);
  return { a_N_C: 0, b_N_C, c_N_C, d_V, e_V, f_V };
}

export function solve_q6(v1_V: number, v2_V: number, v3_V: number, speedA_m_s: number): Record<string, number> {
  void v2_V;
  const part1 = v3_V * E_Q - v1_V * E_Q - 0.5 * M_P * speedA_m_s ** 2;
  const part2 = Math.abs((2 * part1) / M_P);
  const speedB_m_s = Math.sqrt(part2);
  return { speedB_m_s };
}

export function solve_q7(nucleus_diameter_fm: number, proton_speed_m_s: number): Record<string, number> {
  const d = (nucleus_diameter_fm * 1e-15) / 2;
  const U = 0.5 * M_P * proton_speed_m_s ** 2;
  const dmax = (KE * 80 * E_Q ** 2) / U;
  const closest_distance_from_surface_m = dmax - d;
  return { closest_distance_from_surface_m };
}

export function solve_q8(speed_fraction_c: number): Record<string, number> {
  const s = speed_fraction_c * 3e8;
  const d =
    (E_Q * 2 * E_Q) /
    ((4 * Math.PI * EPS) * s ** 2 * ((2 * M_P * A_M * 4) / (M_P + A_M * 4)));
  return { closest_approach_m: d };
}

export function solve_q9(charge_nC: number, potential_V: number): Record<string, number> {
  const q = charge_nC * 1e-9;
  const r = KE * (q / potential_V);
  const ro = 2 ** (1 / 3) * r;
  const qt = 2 * q;
  const newPotential_V = (KE * qt) / ro;
  return { newPotential_V };
}

export function solve_q10(side_nm: number): Record<string, number> {
  const s = side_nm * 1e-9;
  const U_J = KE * ((3 * E_Q ** 2) / s - (3 * E_Q ** 2) / (s / Math.sqrt(3)));
  return { U_J };
}

export function solve_q11(mass_g: number, charge_nC: number, d_cm: number): Record<string, number> {
  const m = mass_g / 1000;
  const q = charge_nC * 1e-9;
  const d = d_cm / 100;
  const v = Math.sqrt((((5.41 * KE * (q ** 2 / d)) / 4) * 2) / m);
  return { speed_m_s: v };
}

