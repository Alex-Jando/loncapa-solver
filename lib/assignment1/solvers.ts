const KE = 8.99e9;
const G = 9.8;
const PERMITTIVITY = 8.85e-12;
const E_Q = 1.602e-19;
const M_E = 9.11e-31;

export function solve_q1(
  q1_c: number,
  x1_m: number,
  q2_c: number,
  x2_m: number,
  q3_c: number,
): Record<string, number> {
  const fq1 = (q1_c * q3_c) / Math.abs(x1_m) ** 2;
  const fq2 = (q2_c * q3_c) / Math.abs(x2_m) ** 2;
  const fnet_N = KE * (fq1 - fq2);
  return { fnet_N };
}

export function solve_q2(q1_c: number, q2_c: number, x1_m: number): Record<string, number> {
  const a = q2_c / q1_c - 1;
  const b = 2 * x1_m;
  const c = -1 * x1_m ** 2;
  const numerator1 = -b + Math.sqrt(b ** 2 - 4 * a * c);
  const denominator = 2 * a;
  const x_m = numerator1 / denominator;
  return { x_m };
}

export function solve_q3(
  mass_kg: number,
  x_comp_N_C: number,
  y_comp_N_C: number,
  theta_deg: number,
): Record<string, number> {
  const theta_rad = (theta_deg * Math.PI) / 180;
  const charge_C = (mass_kg * G) / (x_comp_N_C * (Math.cos(theta_rad) / Math.sin(theta_rad)) + y_comp_N_C);
  const tension_N = (x_comp_N_C * charge_C) / Math.sin(theta_rad);
  return { charge_C, tension_N };
}

export function solve_q4(mass_kg: number, length_m: number, side_m: number): Record<string, number> {
  const h = side_m / (2 * Math.sin(Math.PI / 3));
  const theta = Math.asin(h / length_m);
  const charge_C = Math.sqrt((mass_kg * G * Math.tan(theta) * side_m ** 2) / (2 * KE * Math.cos(Math.PI / 6)));
  return { charge_C };
}

export function solve_q5(
  mass_kg: number,
  length_m: number,
  charge_C: number,
  theta_deg: number,
): Record<string, number> {
  const theta_rad = (theta_deg * Math.PI) / 180;
  const d = 2 * length_m * Math.sin(theta_rad);
  const tension = (mass_kg * G) / Math.cos(theta_rad);
  const fe = tension * Math.sin(theta_rad) + KE * (charge_C ** 2 / d ** 2);
  const field_N_C = fe / charge_C;
  return { field_N_C };
}

export function solve_q6(
  q1_c: number,
  q2_c: number,
  q3_c: number,
  a_m: number,
  b_m: number,
): Record<string, number> {
  const q2Abs = Math.abs(q2_c);
  const ex_N_C = -1 * ((KE * q3_c) / a_m ** 2);
  const ey_N_C = -1 * ((KE * q2Abs) / b_m ** 2);
  const fx_N = -1 * ((KE * q1_c * q3_c) / a_m ** 2);
  const fy_N = -1 * ((KE * q1_c * q2Abs) / b_m ** 2);
  return { ex_N_C, ey_N_C, fx_N, fy_N };
}

export function solve_q7(
  q1_c: number,
  q2_c: number,
  q3_c: number,
  l1_m: number,
  l2_m: number,
  a_m: number,
): Record<string, number> {
  const q1Abs = Math.abs(q1_c);
  const q2Abs = Math.abs(q2_c);
  const q3Abs = Math.abs(q3_c);

  const field_x_N_C = KE * (q2Abs / a_m ** 2 + q3Abs / (a_m - l2_m) ** 2 - q1Abs / (l1_m + a_m) ** 2);

  const deg1 = Math.atan(a_m / l1_m);
  const deg2 = Math.atan(a_m / l2_m);
  const r1 = a_m ** 2 + l1_m ** 2;
  const r2 = a_m ** 2 + l2_m ** 2;

  const x_comp = KE * ((q1Abs / r1) * Math.cos(deg1) + (q3Abs / r2) * Math.cos(deg2));
  const y_comp = KE * ((q3Abs / r2) * Math.sin(deg2) + q2Abs / a_m ** 2 - (q1Abs / r1) * Math.sin(deg1));
  const field_mag_N_C = Math.sqrt(x_comp ** 2 + y_comp ** 2);
  const angle_deg = 180 - (Math.atan(y_comp / x_comp) * 180) / Math.PI;

  return { field_x_N_C, field_mag_N_C, angle_deg };
}

export function solve_q8(d_m: number, y_m: number, field_N_C: number): Record<string, number> {
  const s = d_m / 2;
  const angle = Math.atan(s / y_m);
  const charge_C = (field_N_C * y_m ** 3 * 2 * Math.PI * PERMITTIVITY) / d_m;
  const e_field_N_C = (KE * charge_C * 2 * Math.sin(angle)) / y_m ** 2;
  return { charge_C, e_field_N_C };
}

export function solve_q9(angle_deg: number, speed_m_s: number, d_m: number): Record<string, number> {
  const angle = (angle_deg * Math.PI) / 180;
  const vx = speed_m_s * Math.cos(angle);
  const vy = speed_m_s * Math.sin(angle);
  const t = d_m / vx;
  const a = (2 * vy) / t;
  const field_N_C = (M_E * a) / E_Q;
  const tHalf = vy / a;
  const plate_spacing_m = 0.5 * a * tHalf ** 2;
  return { field_N_C, plate_spacing_m };
}

