const PI = Math.PI;
const U = PI * 4e-7;

export function solve_q1(a_m: number, b_m: number, I: number, angle_deg: number): Record<string, number> {
  const theta = (angle_deg * PI) / 180;
  const B = ((U * I * theta) / (4 * PI)) * (1 / a_m - 1 / b_m);
  return { B_T: B };
}

export function solve_q2(I: number, a_cm: number): Record<string, number> {
  const a = a_cm / 100;
  const B2 = (U * I) / (4 * PI * a);
  const B3 = (U * I) / (6 * PI * a);
  return { B_at_a_T: B2 + B2 + B3, B_at_b_T: B2, B_at_c_T: 0 };
}

export function solve_q3(I1: number, I2: number, R_mm: number): Record<string, number> {
  const R = R_mm / 1000;
  const I3 = I2 - I1;
  return {
    B_a_T: (U * I1) / (2 * PI * R),
    B_b_T: (U * I3) / (6 * PI * R),
  };
}

export function solve_q4(
  B1_uT: number,
  D1_cm: number,
  B2_uT: number,
  I: number,
  wire_spacing_mm: number,
  R_cm: number,
  ratio_decimal: number,
): Record<string, number> {
  const D = wire_spacing_mm / 2000;
  const R = R_cm / 100;
  const R1 = R - D;
  const R2 = R + D;
  const B3 = ((U * I) / (2 * PI)) * (1 / R1 - 1 / R2);
  const D2 = (B1_uT / B2_uT) * (D1_cm / 100);
  const D3 = Math.sqrt(ratio_decimal ** -1) * R;
  return {
    distance_for_B2_m: D2,
    field_from_middle_T: B3,
    distance_for_ratio_m: D3,
    outside_coax_field_T: 0,
  };
}

export function solve_q5(radius_cm: number, I: number): Record<string, number> {
  const R = radius_cm / 100;
  const r = R / 2;
  const A = PI * R ** 2;
  const J = I / A;
  const B = (U * J * r) / 2;
  const R1 = (U * I) / (B * 2 * PI);
  return { B_at_R_over_2_T: B, distance_from_surface_m: R1 - R };
}

export function solve_q6(
  solenoid_diameter_m: number,
  solenoid_length_m: number,
  I: number,
  N: number,
  disk_radius_m: number,
  annulus_inner_cm: number,
  annulus_outer_cm: number,
): Record<string, number> {
  const r = solenoid_diameter_m / 2;
  const A = PI * r ** 2;
  const R1 = annulus_inner_cm / 100;
  const R2 = annulus_outer_cm / 100;
  const A1 = PI * (R2 ** 2 - R1 ** 2);
  const B = (U * I * N) / solenoid_length_m;
  void disk_radius_m;
  return { flux_disk_Wb: B * A, flux_annulus_Wb: B * A1 };
}

export function solve_q7(R_cm: number, Q_uC: number, omega: number): Record<string, number> {
  const R = R_cm / 100;
  const Q = Q_uC / 1e6;
  const A = PI * R ** 2;
  const I = (Q * omega) / (2 * PI);
  return { magnetic_moment_A_m2: I * A };
}

export function solve_q8(N: number, R_m: number, D_m: number, I: number): Record<string, number> {
  void D_m;
  const B = ((4 / 5) ** (3 / 2)) * ((U * I * N) / R_m);
  return { B_T: B };
}

export function solve_q9(I1: number, L: number, R: number, I2: number): Record<string, number> {
  const F = (U * I1 * I2 * L) / (PI * R);
  return { force_N: F };
}
