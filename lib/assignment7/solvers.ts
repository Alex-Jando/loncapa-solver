const PI = Math.PI;
const E_CHARGE = 1.6e-19;
const E_MASS = 9.11e-31;
const U = PI * 4e-7;

export function solve_q1(v: number, a: number, E: number): Record<string, number> {
  const by_T = (-(E_CHARGE * E) - E_MASS * a) / (E_CHARGE * v);
  return { By_T: by_T, Bz_T: 0 };
}

export function solve_q2(L_cm: number, I: number, B: number): Record<string, number> {
  const L = L_cm / 100;
  const H = Math.sqrt(L ** 2 + L ** 2);
  return {
    F_ab_N: 0,
    F_bc_N: I * L * B,
    F_cd_N: I * H * B * Math.sin(PI / 4),
    F_da_N: I * H * B,
  };
}

export function solve_q3(M: number, L: number, N: number, I: number, B: number): Record<string, number> {
  const G = 9.8;
  const s = L / (N * 4);
  const A = s ** 2;
  const x = M * G * (s / 2);
  const y = N * I * A * B;
  const thetaDeg = (Math.atan(x / y) * 180) / PI;
  const phiDeg = 90 - thetaDeg;
  const torque = N * I * A * B * Math.sin((thetaDeg * PI) / 180);
  return { phi_deg: phiDeg, torque_Nm: torque };
}

export function solve_q4(V_kV: number, B: number): Record<string, number> {
  const V = V_kV * 1000;
  const m238 = 238 * 1.66e-27;
  const m235 = 235 * 1.66e-27;
  const v238 = Math.sqrt((2 * E_CHARGE * V) / m238);
  const v235 = Math.sqrt((2 * E_CHARGE * V) / m235);
  return { r238_m: (m238 * v238) / (E_CHARGE * B), r235_m: (m235 * v235) / (E_CHARGE * B) };
}

export function solve_q5(E_MeV: number, B: number): Record<string, number> {
  const K = E_MeV * 1e6 * E_CHARGE;
  const M = 1.67e-27;
  const v = Math.sqrt((2 * K) / M);
  return { cyclotron_radius_m: (M * v) / (E_CHARGE * B) };
}

export function solve_q6(I_mA: number, B1: number, V1_uV: number, V2_uV: number, D_mm: number): Record<string, number> {
  const I = I_mA * 1e-3;
  const V1 = V1_uV * 1e-6;
  const V2 = V2_uV * 1e-6;
  const D = D_mm / 1000;
  const B2 = (V2 / V1) * B1;
  const n = (I * B1) / (V1 * E_CHARGE * D);
  return { unknown_field_T: B2, carrier_density_m3: n };
}

export function solve_q7(E_MeV: number, angle_deg: number, B: number): Record<string, number> {
  const E = E_MeV * 1e6 * E_CHARGE;
  const M = 1.67e-27;
  const s = Math.sin((angle_deg * PI) / 180);
  const x = Math.sqrt(2 * E * M) / (B * E_CHARGE * s);
  return { distance_m: x };
}

export function solve_q8(torque: number, angle_deg: number, B: number): Record<string, number> {
  return { magnetic_dipole_Nm_per_T: torque / (B * Math.sin((angle_deg * PI) / 180)) };
}

export function solve_q9(B: number, spacing_cm: number): Record<string, number> {
  const r = spacing_cm / 200;
  const u = 1.66e-27;
  const mN2 = 28 * u;
  const mO2 = 32 * u;
  const mCO = 28 * u;
  const x = B ** 2 * r ** 2 * E_CHARGE;
  return { V_N2plus_V: x / (2 * mN2), V_O2plus_V: x / (2 * mO2), V_COplus_V: x / (2 * mCO) };
}

export function solve_q10(L_cm: number, W_cm: number, I: number, M_g: number, N: number): Record<string, number> {
  const L = L_cm / 100;
  const W = W_cm / 100;
  const M = M_g / 1000;
  const G = 9.8;
  const A = L * W;
  return { required_field_T: (M * G * W) / (2 * N * I * A) };
}
