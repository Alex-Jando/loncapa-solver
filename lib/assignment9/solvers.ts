const PI = Math.PI;
const U = PI * 4e-7;

export function solve_q1(radius_cm: number, B_a: number, B_b: number, r: number): Record<string, number> {
  const R = radius_cm / 100;
  const A = PI * R ** 2;
  const flux = B_a * A;
  const emf = B_b * A;
  return { flux_Wb: flux, induced_emf_V: emf, induced_current_A: emf / r };
}

export function solve_q2(F: number, v: number, r: number): Record<string, number> {
  const I = Math.sqrt((F * v) / r);
  const p1 = I ** 2 * r;
  return { current_A: I, resistor_power_W: p1, mechanical_power_W: F * v };
}

export function solve_q3(
  d: number,
  R3: number,
  R1: number,
  R2: number,
  v1: number,
  v2: number,
  B: number,
): Record<string, number> {
  const X = v1 * R2 - v2 * R1;
  const Y = R1 * R3 + R3 * R2 + R1 * R2;
  return { current_through_R3_A: B * d * (X / Y) };
}

export function solve_q4(N: number, R: number, A: number, Q: number): Record<string, number> {
  const flux = (Q * R) / N;
  return { B_T: flux / A };
}

export function solve_q5(L: number, v: number, I_mA: number, R_cm: number): Record<string, number> {
  const I = I_mA * 1e-3;
  const R = R_cm / 100;
  const E = ((U * I * v) / (2 * PI)) * Math.log(1 + L / R);
  return { emf_V: E };
}

export function solve_q6(L: number, I1: number, I2: number, t: number): Record<string, number> {
  return { average_induced_emf_V: L * ((I2 - I1) / t) };
}

export function solve_q7(E: number, L_mH: number, R: number, t_us: number, percent: number): Record<string, number> {
  const L = L_mH * 1e-3;
  const t = t_us * 1e-6;
  const p = percent / 100;
  const tau = L / R;
  const Ifinal = E / R;
  const I = Ifinal * (1 - Math.exp(-t / tau));
  const t2 = -Math.log(1 - p) * tau;
  return { tau_s: tau, current_at_t_A: I, steady_current_A: Ifinal, time_to_percent_s: t2 };
}

export function solve_q8(R1: number, R2: number, L: number, E: number, E2: number): Record<string, number> {
  const Rp = ((1 / R1) + (1 / R2)) ** -1;
  const Rs = R1 + R2;
  const I = E / Rp;
  const V1 = I * R1;
  const V2 = I * R2;
  const V3 = V1 + V2;
  const tau = L / Rs;
  const t2 = -Math.log(E2 / V3) * tau;
  return { long_time_current_A: I, V_R1_initial_V: V1, V_R2_initial_V: V2, V_L_initial_V: V3, time_s: t2 };
}

export function solve_q9(B: number, diameter_cm: number, length_cm: number): Record<string, number> {
  const R = diameter_cm / 200;
  const L = length_cm / 100;
  const V = PI * R ** 2 * L;
  const energy_density = B ** 2 / (2 * U);
  return { magnetic_energy_density_J_m3: energy_density, stored_energy_J: energy_density * V };
}

export function solve_q10(N: number, side_cm: number, rpm: number, B: number): Record<string, number> {
  const L = side_cm / 100;
  const w = (rpm * PI) / 30;
  const A = L ** 2;
  return { max_emf_V: N * A * B * w };
}
