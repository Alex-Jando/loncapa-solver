const KE = 8.99e9;
const EPS = 8.85e-12;
const PI = Math.PI;
const E_Q = 1.602e-19;

export function solve_q1(x_comp_N_C: number, y_comp_N_C: number, area_m2: number): Record<string, number> {
  return {
    flux_yz_Nm2_C: x_comp_N_C * area_m2,
    flux_xz_Nm2_C: y_comp_N_C * area_m2,
    flux_xy_Nm2_C: 0,
  };
}

export function solve_q2(lambda_C_m: number, d_m: number, r_m: number): Record<string, number> {
  const length = Math.sqrt(r_m ** 2 - d_m ** 2);
  const flux_Nm2_C = (2 * lambda_C_m * length) / EPS;
  return { flux_Nm2_C };
}

export function solve_q3(Q_uC: number, side_m: number, q_uC: number): Record<string, number> {
  void side_m;
  const Q = Q_uC * 1e-6;
  const q = Math.abs(q_uC * 1e-6);
  const flux_per_face_Nm2_C = (Q - 6 * q) / (6 * EPS);
  return { flux_per_face_Nm2_C };
}

export function solve_q4(
  radius_cm: number,
  charge_uC: number,
  b_cm: number,
  c_cm: number,
  d_cm: number,
): Record<string, number> {
  console.log(radius_cm, charge_uC, b_cm, c_cm, d_cm);
  const radius_m = radius_cm / 100;
  const q = charge_uC * 1e-6;
  const b = b_cm / 100;
  const c = c_cm / 100;
  const d = d_cm / 100;

  const field_a_N_C = 0;
  const field_b_N_C = KE * (q / radius_m ** 3) * b;
  const field_c_N_C = KE * (q / c ** 2);
  const field_d_N_C = KE * (q / d ** 2);
  return { field_a_N_C, field_b_N_C, field_c_N_C, field_d_N_C };
}

export function solve_q5(diameter_cm: number, charge_uC: number, radius_cm: number): Record<string, number> {
  const R = (diameter_cm / 100) / 2;
  const q = charge_uC * 1e-6;
  const r = radius_cm / 100;
  const v = (4 / 3) * PI * R ** 3;
  const density = q / v;
  const volume = (4 / 3) * PI * r ** 3;
  const enclosed_charge_C = density * volume;
  return { enclosed_charge_C, total_charge_C: q };
}

export function solve_q6(
  r_cm: number,
  q1_uC: number,
  ri_cm: number,
  ro_cm: number,
  q2_uC: number,
  r1_cm: number,
  r2_cm: number,
): Record<string, number> {
  void r_cm;
  void ri_cm;
  void ro_cm;
  const q1 = q1_uC * 1e-6;
  const q2 = Math.abs(q2_uC * 1e-6);
  const r1 = r1_cm / 100;
  const r2 = r2_cm / 100;
  const field_a_N_C = 0;
  const field_b_N_C = KE * (q1 / r1 ** 2);
  const field_c_N_C = 0;
  const q3 = q1 - q2;
  const field_d_N_C = KE * (q3 / r2 ** 2);
  return { field_a_N_C, field_b_N_C, field_c_N_C, field_d_N_C };
}

export function solve_q7(a_m: number, c_m: number, f1_N_C: number, f2_N_C_per_m2: number): Record<string, number> {
  const flux1 = a_m ** 2 * (f1_N_C + f2_N_C_per_m2 * a_m ** 2);
  const flux2 = a_m ** 2 * (f1_N_C + f2_N_C_per_m2 * (a_m + c_m) ** 2);
  const flux_Nm2_C = -flux1 + flux2;
  const charge_C = flux_Nm2_C * EPS;
  return { flux_Nm2_C, charge_C };
}


export function solve_q8(radius_m: number, length_m: number, p_m: number, field_N_C: number): Record<string, number> {
  void radius_m;
  const charge_density_C_m = (field_N_C * p_m * length_m) / (2 * KE);
  const field_inside_N_C = 0;
  return { charge_density_C_m, field_inside_N_C };
}

export function solve_q9(q_nC: number) {
  const q = q_nC * 1e-9;
  const q1_C = 2 * q;
  const q2_C = q;
  const q3_C = -3 * q;
  return { q1_C, q2_C, q3_C };
}

export function solve_q10(length_cm: number, electrons_count: number, p_mm: number): Record<string, number> {
  void p_mm;
  const l = length_cm / 100;
  const density = (E_Q * electrons_count) / l ** 2;
  const field_above_N_C = -density / (2 * EPS);
  const field_inside_N_C = 0;
  return { field_above_N_C, field_inside_N_C };
}

export function solve_q11(
  r_cm: number,
  ri_cm: number,
  ro_cm: number,
  d1_cm: number,
  field_N_C: number,
  d2_cm: number,
): Record<string, number> {
  void r_cm;
  void ri_cm;
  void ro_cm;
  const d1 = d1_cm / 100;
  const d2 = d2_cm / 100;
  const q1_C = -4 * PI * d1 ** 2 * field_N_C * EPS;
  const q_inner_surface_C = -q1_C;
  const q_outer_surface_C = 4 * PI * d2 ** 2 * field_N_C * EPS;
  return { q1_C, q_inner_surface_C, q_outer_surface_C };
}
