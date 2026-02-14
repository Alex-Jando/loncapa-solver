export type SolverInputValue = { value: number; raw?: string } | number;

export interface SolverDefinition {
  requiredKeys: string[];
  solve: (args: number[]) => Record<string, number>;
}

import * as a1Solvers from "@/lib/assignment1/solvers";
import * as a2Solvers from "@/lib/assignment2/solvers";
import * as a3Solvers from "@/lib/assignment3/solvers";
import * as a4Solvers from "@/lib/assignment4/solvers";
import * as a5Solvers from "@/lib/assignment5/solvers";
import * as a6Solvers from "@/lib/assignment6/solvers";
import * as a7Solvers from "@/lib/assignment7/solvers";
import * as a8Solvers from "@/lib/assignment8/solvers";
import * as a9Solvers from "@/lib/assignment9/solvers";
import * as a10Solvers from "@/lib/assignment10/solvers";

export const solverRegistry: Record<string, Record<string, SolverDefinition>> = {
  a1: {
    q1: { requiredKeys: ["q1_c", "x1_m", "q2_c", "x2_m", "q3_c"], solve: (args) => a1Solvers.solve_q1(args[0], args[1], args[2], args[3], args[4]) },
    q2: { requiredKeys: ["q1_c", "q2_c", "x1_m"], solve: (args) => a1Solvers.solve_q2(args[0], args[1], args[2]) },
    q3: { requiredKeys: ["mass_kg", "x_comp_N_C", "y_comp_N_C", "theta_deg"], solve: (args) => a1Solvers.solve_q3(args[0], args[1], args[2], args[3]) },
    q4: { requiredKeys: ["mass_kg", "length_m", "side_m"], solve: (args) => a1Solvers.solve_q4(args[0], args[1], args[2]) },
    q5: { requiredKeys: ["mass_kg", "length_m", "charge_C", "theta_deg"], solve: (args) => a1Solvers.solve_q5(args[0], args[1], args[2], args[3]) },
    q6: { requiredKeys: ["q1_c", "q2_c", "q3_c", "a_m", "b_m"], solve: (args) => a1Solvers.solve_q6(args[0], args[1], args[2], args[3], args[4]) },
    q7: { requiredKeys: ["q1_c", "q2_c", "q3_c", "l1_m", "l2_m", "a_m"], solve: (args) => a1Solvers.solve_q7(args[0], args[1], args[2], args[3], args[4], args[5]) },
    q8: { requiredKeys: ["d_m", "y_m", "field_N_C"], solve: (args) => a1Solvers.solve_q8(args[0], args[1], args[2]) },
    q9: { requiredKeys: ["angle_deg", "speed_m_s", "d_m"], solve: (args) => a1Solvers.solve_q9(args[0], args[1], args[2]) }
  },
  a2: {
    q1: { requiredKeys: ["x_comp_N_C", "y_comp_N_C", "area_m2"], solve: (args) => a2Solvers.solve_q1(args[0], args[1], args[2]) },
    q2: { requiredKeys: ["lambda_C_m", "d_m", "r_m"], solve: (args) => a2Solvers.solve_q2(args[0], args[1], args[2]) },
    q3: { requiredKeys: ["Q_uC", "side_m", "q_uC"], solve: (args) => a2Solvers.solve_q3(args[0], args[1], args[2]) },
    q4: { requiredKeys: ["radius_cm", "charge_uC", "b_cm", "c_cm", "d_cm"], solve: (args) => a2Solvers.solve_q4(args[0], args[1], args[2], args[3], args[4]) },
    q5: { requiredKeys: ["diameter_cm", "charge_uC", "radius_cm"], solve: (args) => a2Solvers.solve_q5(args[0], args[1], args[2]) },
    q6: { requiredKeys: ["r_cm", "q1_uC", "ri_cm", "ro_cm", "q2_uC", "r1_cm", "r2_cm"], solve: (args) => a2Solvers.solve_q6(args[0], args[1], args[2], args[3], args[4], args[5], args[6]) },
    q7: { requiredKeys: ["a_m", "c_m", "f1_N_C", "f2_N_C_per_m2"], solve: (args) => a2Solvers.solve_q7(args[0], args[1], args[2], args[3]) },
    q8: { requiredKeys: ["radius_m", "length_m", "p_m", "field_N_C"], solve: (args) => a2Solvers.solve_q8(args[0], args[1], args[2], args[3]) },
    q9: { requiredKeys: ["q_nC"], solve: (args) => a2Solvers.solve_q9(args[0]) },
    q10: { requiredKeys: ["length_cm", "electrons_count", "p_mm"], solve: (args) => a2Solvers.solve_q10(args[0], args[1], args[2]) },
    q11: { requiredKeys: ["r_cm", "ri_cm", "ro_cm", "d1_cm", "field_N_C", "d2_cm"], solve: (args) => a2Solvers.solve_q11(args[0], args[1], args[2], args[3], args[4], args[5]) }
  },
  a3: {
    q1: { requiredKeys: ["field_V_m", "charge_C", "x_cm"], solve: (args) => a3Solvers.solve_q1(args[0], args[1], args[2]) },
    q2: { requiredKeys: ["q_uC", "x_m", "y_m", "q3_uC"], solve: (args) => a3Solvers.solve_q2(args[0], args[1], args[2], args[3]) },
    q3: { requiredKeys: ["x_m", "sigma_nC_m", "r_m"], solve: (args) => a3Solvers.solve_q3(args[0], args[1], args[2]) },
    q4: { requiredKeys: ["lambda_C_m"], solve: (args) => a3Solvers.solve_q4(args[0]) },
    q5: { requiredKeys: ["r1_cm", "q1_nC", "r2_cm", "q2_nC", "d1_cm", "d2_cm", "d3_cm"], solve: (args) => a3Solvers.solve_q5(args[0], args[1], args[2], args[3], args[4], args[5], args[6]) },
    q6: { requiredKeys: ["v1_V", "v2_V", "v3_V", "speedA_m_s"], solve: (args) => a3Solvers.solve_q6(args[0], args[1], args[2], args[3]) },
    q7: { requiredKeys: ["nucleus_diameter_fm", "proton_speed_m_s"], solve: (args) => a3Solvers.solve_q7(args[0], args[1]) },
    q8: { requiredKeys: ["speed_fraction_c"], solve: (args) => a3Solvers.solve_q8(args[0]) },
    q9: { requiredKeys: ["charge_nC", "potential_V"], solve: (args) => a3Solvers.solve_q9(args[0], args[1]) },
    q10: { requiredKeys: ["side_nm"], solve: (args) => a3Solvers.solve_q10(args[0]) },
    q11: { requiredKeys: ["mass_g", "charge_nC", "d_cm"], solve: (args) => a3Solvers.solve_q11(args[0], args[1], args[2]) }
  },
  a4: {
    q1: { requiredKeys: ["mean_radius_m"], solve: (args) => a4Solvers.solve_q1(args[0]) },
    q2: { requiredKeys: ["parallel_pF", "series_pF"], solve: (args) => a4Solvers.solve_q2(args[0], args[1]) },
    q3: { requiredKeys: ["C1_uF", "C2_uF", "C3_uF"], solve: (args) => a4Solvers.solve_q3(args[0], args[1], args[2]) },
    q4: { requiredKeys: ["C1_uF", "C2_uF", "C3_uF", "C4_uF"], solve: (args) => a4Solvers.solve_q4(args[0], args[1], args[2], args[3]) },
    q5: { requiredKeys: ["C_F", "V_V", "kappa"], solve: (args) => a4Solvers.solve_q5(args[0], args[1], args[2]) },
    q6: { requiredKeys: ["A_m2", "d_m", "k1", "k2", "k3"], solve: (args) => a4Solvers.solve_q6(args[0], args[1], args[2], args[3], args[4]) },
    q7: { requiredKeys: ["C1_F", "C2_F", "V_V"], solve: (args) => a4Solvers.solve_q7(args[0], args[1], args[2]) },
    q8: { requiredKeys: ["C1_F", "V_initial_V", "V_new_V"], solve: (args) => a4Solvers.solve_q8(args[0], args[1], args[2]) },
    q9: { requiredKeys: ["diameter_m", "d_m", "V_V", "d_new_m", "new_diameter_m"], solve: (args) => a4Solvers.solve_q9(args[0], args[1], args[2], args[3], args[4]) }
  },
  a5: {
    q1: { requiredKeys: ["battery_ah"], solve: (args) => a5Solvers.solve_q1(args[0]) },
    q2: { requiredKeys: ["D_mm", "I_uA"], solve: (args) => a5Solvers.solve_q2(args[0], args[1]) },
    q3: { requiredKeys: ["Q_coulomb", "omega_rad_s"], solve: (args) => a5Solvers.solve_q3(args[0], args[1]) },
    q4: { requiredKeys: ["beam_MeV", "current_A"], solve: (args) => a5Solvers.solve_q4(args[0], args[1]) },
    q5: { requiredKeys: ["R_initial_ohm", "length_factor"], solve: (args) => a5Solvers.solve_q5(args[0], args[1]) },
    q6: { requiredKeys: ["side_mm", "rho1_ohm_m", "L1_cm", "rho2_ohm_m", "L2_cm"], solve: (args) => a5Solvers.solve_q6(args[0], args[1], args[2], args[3], args[4]) },
    q7: { requiredKeys: ["diameter_cm", "length_km", "current_A", "n_per_m3"], solve: (args) => a5Solvers.solve_q7(args[0], args[1], args[2], args[3]) },
    q8: { requiredKeys: ["drift_speed_m_s", "mean_free_time_s"], solve: (args) => a5Solvers.solve_q8(args[0], args[1]) },
    q9: { requiredKeys: ["V_line_V", "length_m", "resistance_value_ohm", "resistance_distance_m", "load_current_A"], solve: (args) => a5Solvers.solve_q9(args[0], args[1], args[2], args[3], args[4]) },
    q10: { requiredKeys: ["delta_current_A", "V_initial_V", "V_final_V"], solve: (args) => a5Solvers.solve_q10(args[0], args[1], args[2]) },
    q11: { requiredKeys: ["surge_voltage_V", "bulb_voltage_V", "bulb_watt_W"], solve: (args) => a5Solvers.solve_q11(args[0], args[1], args[2]) },
    q12: { requiredKeys: ["mass_g", "resistivity_ohm_m", "density_g_cm3", "total_resistance_ohm"], solve: (args) => a5Solvers.solve_q12(args[0], args[1], args[2], args[3]) }
  },
  a6: {
    q1: { requiredKeys: ["r1", "r2", "r3", "r4", "r5", "r6"], solve: (args) => a6Solvers.solve_q1(args[0], args[1], args[2], args[3], args[4], args[5]) },
    q2: { requiredKeys: ["r1", "r4", "r5", "a1", "a2", "a3", "v"], solve: (args) => a6Solvers.solve_q2(args[0], args[1], args[2], args[3], args[4], args[5], args[6]) },
    q3: { requiredKeys: ["r1"], solve: (args) => a6Solvers.solve_q3(args[0]) },
    q4: { requiredKeys: ["e1", "i2", "r1", "r2", "r3"], solve: (args) => a6Solvers.solve_q4(args[0], args[1], args[2], args[3], args[4]) },
    q5: { requiredKeys: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "e1", "e4", "e6"], solve: (args) => a6Solvers.solve_q5(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10]) },
    q6: { requiredKeys: ["r1", "r2", "r3", "r4", "v1"], solve: (args) => a6Solvers.solve_q6(args[0], args[1], args[2], args[3], args[4]) },
    q7: { requiredKeys: ["series_total", "parallel_total"], solve: (args) => a6Solvers.solve_q7(args[0], args[1]) },
    q8: { requiredKeys: ["r1", "r2", "r3", "e1", "e2", "e3"], solve: (args) => a6Solvers.solve_q8(args[0], args[1], args[2], args[3], args[4], args[5]) },
    q9: { requiredKeys: ["r", "e"], solve: (args) => a6Solvers.solve_q9(args[0], args[1]) },
    q10: { requiredKeys: ["c_nF", "q1_uC", "r_kohm", "t1_us", "t2_us"], solve: (args) => a6Solvers.solve_q10(args[0], args[1], args[2], args[3], args[4]) },
    q11: { requiredKeys: ["r1", "r2", "v1", "v2"], solve: (args) => a6Solvers.solve_q11(args[0], args[1], args[2], args[3]) },
    q12: { requiredKeys: ["v", "r", "p"], solve: (args) => a6Solvers.solve_q12(args[0], args[1], args[2]) },
    q13: { requiredKeys: ["c", "v1", "v2", "t"], solve: (args) => a6Solvers.solve_q13(args[0], args[1], args[2], args[3]) },
    q14: { requiredKeys: ["r1_k", "r2_k", "c1_u", "c2_u", "e", "t1_ms", "t2_ms"], solve: (args) => a6Solvers.solve_q14(args[0], args[1], args[2], args[3], args[4], args[5], args[6]) }
  },
  a7: {
    q1: { requiredKeys: ["v", "a", "E"], solve: (args) => a7Solvers.solve_q1(args[0], args[1], args[2]) },
    q2: { requiredKeys: ["L_cm", "I", "B"], solve: (args) => a7Solvers.solve_q2(args[0], args[1], args[2]) },
    q3: { requiredKeys: ["M", "L", "N", "I", "B"], solve: (args) => a7Solvers.solve_q3(args[0], args[1], args[2], args[3], args[4]) },
    q4: { requiredKeys: ["V_kV", "B"], solve: (args) => a7Solvers.solve_q4(args[0], args[1]) },
    q5: { requiredKeys: ["E_MeV", "B"], solve: (args) => a7Solvers.solve_q5(args[0], args[1]) },
    q6: { requiredKeys: ["I_mA", "B1", "V1_uV", "V2_uV", "D_mm"], solve: (args) => a7Solvers.solve_q6(args[0], args[1], args[2], args[3], args[4]) },
    q7: { requiredKeys: ["E_MeV", "angle_deg", "B"], solve: (args) => a7Solvers.solve_q7(args[0], args[1], args[2]) },
    q8: { requiredKeys: ["torque", "angle_deg", "B"], solve: (args) => a7Solvers.solve_q8(args[0], args[1], args[2]) },
    q9: { requiredKeys: ["B", "spacing_cm"], solve: (args) => a7Solvers.solve_q9(args[0], args[1]) },
    q10: { requiredKeys: ["L_cm", "W_cm", "I", "M_g", "N"], solve: (args) => a7Solvers.solve_q10(args[0], args[1], args[2], args[3], args[4]) }
  },
  a8: {
    q1: { requiredKeys: ["a_m", "b_m", "I", "angle_deg"], solve: (args) => a8Solvers.solve_q1(args[0], args[1], args[2], args[3]) },
    q2: { requiredKeys: ["I", "a_cm"], solve: (args) => a8Solvers.solve_q2(args[0], args[1]) },
    q3: { requiredKeys: ["I1", "I2", "R_mm"], solve: (args) => a8Solvers.solve_q3(args[0], args[1], args[2]) },
    q4: { requiredKeys: ["B1_uT", "D1_cm", "B2_uT", "I", "wire_spacing_mm", "R_cm", "ratio_decimal"], solve: (args) => a8Solvers.solve_q4(args[0], args[1], args[2], args[3], args[4], args[5], args[6]) },
    q5: { requiredKeys: ["radius_cm", "I"], solve: (args) => a8Solvers.solve_q5(args[0], args[1]) },
    q6: { requiredKeys: ["solenoid_diameter_m", "solenoid_length_m", "I", "N", "disk_radius_m", "annulus_inner_cm", "annulus_outer_cm"], solve: (args) => a8Solvers.solve_q6(args[0], args[1], args[2], args[3], args[4], args[5], args[6]) },
    q7: { requiredKeys: ["R_cm", "Q_uC", "omega"], solve: (args) => a8Solvers.solve_q7(args[0], args[1], args[2]) },
    q8: { requiredKeys: ["N", "R_m", "D_m", "I"], solve: (args) => a8Solvers.solve_q8(args[0], args[1], args[2], args[3]) },
    q9: { requiredKeys: ["I1", "L", "R", "I2"], solve: (args) => a8Solvers.solve_q9(args[0], args[1], args[2], args[3]) }
  },
  a9: {
    q1: { requiredKeys: ["radius_cm", "B_a", "B_b", "r"], solve: (args) => a9Solvers.solve_q1(args[0], args[1], args[2], args[3]) },
    q2: { requiredKeys: ["F", "v", "r"], solve: (args) => a9Solvers.solve_q2(args[0], args[1], args[2]) },
    q3: { requiredKeys: ["d", "R3", "R1", "R2", "v1", "v2", "B"], solve: (args) => a9Solvers.solve_q3(args[0], args[1], args[2], args[3], args[4], args[5], args[6]) },
    q4: { requiredKeys: ["N", "R", "A", "Q"], solve: (args) => a9Solvers.solve_q4(args[0], args[1], args[2], args[3]) },
    q5: { requiredKeys: ["L", "v", "I_mA", "R_cm"], solve: (args) => a9Solvers.solve_q5(args[0], args[1], args[2], args[3]) },
    q6: { requiredKeys: ["L", "I1", "I2", "t"], solve: (args) => a9Solvers.solve_q6(args[0], args[1], args[2], args[3]) },
    q7: { requiredKeys: ["E", "L_mH", "R", "t_us", "percent"], solve: (args) => a9Solvers.solve_q7(args[0], args[1], args[2], args[3], args[4]) },
    q8: { requiredKeys: ["R1", "R2", "L", "E", "E2"], solve: (args) => a9Solvers.solve_q8(args[0], args[1], args[2], args[3], args[4]) },
    q9: { requiredKeys: ["B", "diameter_cm", "length_cm"], solve: (args) => a9Solvers.solve_q9(args[0], args[1], args[2]) },
    q10: { requiredKeys: ["N", "side_cm", "rpm", "B"], solve: (args) => a9Solvers.solve_q10(args[0], args[1], args[2], args[3]) }
  },
  a10: {
    q1: { requiredKeys: ["v", "l", "m"], solve: (args) => a10Solvers.solve_q1(args[0], args[1], args[2]) },
    q2: { requiredKeys: ["A_cm", "k", "w", "phi_deg"], solve: (args) => a10Solvers.solve_q2(args[0], args[1], args[2], args[3]) },
    q3: { requiredKeys: ["A_m", "k", "w"], solve: (args) => a10Solvers.solve_q3(args[0], args[1], args[2]) },
    q4: { requiredKeys: ["T_ms", "v", "x0_cm", "v_down"], solve: (args) => a10Solvers.solve_q4(args[0], args[1], args[2], args[3]) },
    q5: { requiredKeys: ["l", "m_g", "f", "n", "peak_to_valley_cm"], solve: (args) => a10Solvers.solve_q5(args[0], args[1], args[2], args[3], args[4]) },
    q6: { requiredKeys: ["omega", "k"], solve: (args) => a10Solvers.solve_q6(args[0], args[1]) },
    q7: { requiredKeys: ["v1", "t1", "v2"], solve: (args) => a10Solvers.solve_q7(args[0], args[1], args[2]) },
    q8: { requiredKeys: ["w_air_nm", "w_solid_nm"], solve: (args) => a10Solvers.solve_q8(args[0], args[1]) },
    q9: { requiredKeys: ["u_g_m", "T", "f", "amp_mm", "x_m", "t_ms"], solve: (args) => a10Solvers.solve_q9(args[0], args[1], args[2], args[3], args[4], args[5]) }
  }
};
