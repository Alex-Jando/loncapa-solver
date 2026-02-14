const PI = Math.PI;
const ELEM_CHARGE_C = 1.6e-19;

export function solve_q1(battery_ah: number): Record<string, number> {
  const charge_c = battery_ah * 3600;
  return { charge_c };
}

export function solve_q2(D_mm: number, I_uA: number): Record<string, number> {
  const D_m = D_mm / 1000;
  const radius_m = D_m / 2;
  const I_A = I_uA * 1e-6;
  const electrons_per_s = I_A / ELEM_CHARGE_C;
  const area_m2 = PI * radius_m ** 2;
  const current_density_A_m2 = I_A / area_m2;

  return { electrons_per_s, current_density_A_m2 };
}

export function solve_q3(Q_coulomb: number, omega_rad_s: number): Record<string, number> {
  const current_A = (Q_coulomb * omega_rad_s) / (2 * PI);
  return { current_A };
}

export function solve_q4(beam_MeV: number, current_A: number): Record<string, number> {
  const beam_volts = beam_MeV * 1e6;
  const mass_kg = 3.3475e-27;
  const energy_joule_per_charge = beam_volts * ELEM_CHARGE_C;
  const speed_m_s = Math.sqrt((energy_joule_per_charge * 2) / mass_kg);
  const time_s = ELEM_CHARGE_C / current_A;
  const atom_spacing_m = speed_m_s * time_s;

  return { atom_spacing_m };
}

export function solve_q5(R_initial_ohm: number, length_factor: number): Record<string, number> {
  const R_new_ohm = R_initial_ohm * length_factor ** 2;
  return { R_new_ohm };
}

export function solve_q6(
  side_mm: number,
  rho1_ohm_m: number,
  L1_cm: number,
  rho2_ohm_m: number,
  L2_cm: number,
): Record<string, number> {
  const side_m = side_mm / 1000;
  const area_m2 = side_m ** 2;
  const L1_m = L1_cm / 100;
  const L2_m = L2_cm / 100;
  const R1_ohm = (rho1_ohm_m * L1_m) / area_m2;
  const R2_ohm = (rho2_ohm_m * L2_m) / area_m2;
  const R_total_ohm = R1_ohm + R2_ohm;

  return { R_total_ohm };
}

export function solve_q7(
  diameter_cm: number,
  length_km: number,
  current_A: number,
  n_per_m3: number,
): Record<string, number> {
  const d_m = diameter_cm / 100;
  const length_m = length_km * 1000;
  const radius_m = d_m / 2;
  const area_m2 = PI * radius_m ** 2;
  const drift_speed_m_s = current_A / (n_per_m3 * ELEM_CHARGE_C * area_m2);
  const travel_time_s = length_m / drift_speed_m_s;

  return { travel_time_s };
}

export function solve_q8(drift_speed_m_s: number, mean_free_time_s: number): Record<string, number> {
  const electron_mass_kg = 9.11e-31;
  const electric_field_N_C = (electron_mass_kg * drift_speed_m_s) / (ELEM_CHARGE_C * mean_free_time_s);
  return { electric_field_N_C };
}

export function solve_q9(
  V_line_V: number,
  length_m: number,
  resistance_value_ohm: number,
  resistance_distance_m: number,
  load_current_A: number,
): Record<string, number> {
  const resistance_per_m_ohm = resistance_value_ohm / resistance_distance_m;
  const one_wire_resistance_ohm = length_m * resistance_per_m_ohm;
  const round_trip_resistance_ohm = one_wire_resistance_ohm * 2;
  const V_house_V = V_line_V - load_current_A * round_trip_resistance_ohm;
  const P_customer_W = V_house_V * load_current_A;
  const P_line_loss_W = load_current_A ** 2 * round_trip_resistance_ohm;

  return { V_house_V, P_customer_W, P_line_loss_W };
}

export function solve_q10(
  delta_current_A: number,
  V_initial_V: number,
  V_final_V: number,
): Record<string, number> {
  const resistance_ohm = (V_initial_V - V_final_V) / delta_current_A;
  return { resistance_ohm };
}

export function solve_q11(
  surge_voltage_V: number,
  bulb_voltage_V: number,
  bulb_watt_W: number,
): Record<string, number> {
  const power_scale = surge_voltage_V ** 2 / bulb_voltage_V ** 2;
  const percent_increase = power_scale * 100 - 100;
  void bulb_watt_W;
  return { percent_increase };
}

export function solve_q12(
  mass_g: number,
  resistivity_ohm_m: number,
  density_g_cm3: number,
  total_resistance_ohm: number,
): Record<string, number> {
  const volume_cm3 = mass_g / density_g_cm3;
  const volume_m3 = volume_cm3 / 1e6;
  const length_m = Math.sqrt((volume_m3 * total_resistance_ohm) / resistivity_ohm_m);
  const radius_m = Math.sqrt(volume_m3 / (PI * length_m));
  const diameter_m = radius_m * 2;

  return { length_m, diameter_m };
}
