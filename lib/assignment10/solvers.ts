const PI = Math.PI;

export function solve_q1(v: number, l: number, m: number): Record<string, number> {
  const u = m / l;
  return { tension_N: v ** 2 * u };
}

export function solve_q2(A_cm: number, k: number, w: number, phi_deg: number): Record<string, number> {
  void A_cm;
  void w;
  const wavelength = (2 * PI) / k;
  const x_cm = wavelength * (10 / phi_deg);
  return { x_cm };
}

export function solve_q3(A_m: number, k: number, w: number): Record<string, number> {
  return {
    amplitude_m: A_m,
    angular_frequency_rad_s: w,
    angular_wavenumber_rad_m: k,
    wavelength_m: (2 * PI) / k,
    speed_m_s: w / k,
  };
}

export function solve_q4(T_ms: number, v: number, x0_cm: number, v_down: number): Record<string, number> {
  const T = T_ms * 1e-3;
  const x = x0_cm / 100;
  const w = (2 * PI) / T;
  const d = v_down / (x * w);
  const rad = Math.atan(d);
  const amp = x / Math.cos(rad);
  const phi = Math.asin((-x) / amp) + PI;
  return { amplitude_m: amp, phase_constant_rad: phi, max_transverse_speed_m_s: w * amp };
}

export function solve_q5(l: number, m_g: number, f: number, n: number, peak_to_valley_cm: number): Record<string, number> {
  const m = m_g / 1000;
  const amp = peak_to_valley_cm / 200;
  const u = m / l;
  const wavelength = l / n;
  const v = f * wavelength;
  const w = 2 * PI * f;
  const power = 0.5 * u * w ** 2 * amp ** 2 * v;
  return { power_W: power };
}

export function solve_q6(omega: number, k: number): Record<string, number> {
  const speed = omega / k;
  return { speed_positive_m_s: speed, speed_negative_m_s: -speed };
}

export function solve_q7(v1: number, t1: number, v2: number): Record<string, number> {
  const ratio = (v2 ** 2) / (v1 ** 2);
  return { required_tension_N: ratio * t1 };
}

export function solve_q8(w_air_nm: number, w_solid_nm: number): Record<string, number> {
  const c = 3.0e8;
  const w1 = w_air_nm * 1e-9;
  const w2 = w_solid_nm * 1e-9;
  const n = w1 / w2;
  const v = c / n;
  return { speed_m_s: v, frequency_Hz: v / w2 };
}

export function solve_q9(
  u_g_m: number,
  T: number,
  f: number,
  amp_mm: number,
  x_m: number,
  t_ms: number,
): Record<string, number> {
  const u = u_g_m / 1000;
  const amp = amp_mm / 1000;
  const t = t_ms * 1e-3;
  const v = Math.sqrt(T / u);
  const wavelength = v / f;
  const phi = 4.71;
  const w = 2 * PI * f;
  const k = (2 * PI) / wavelength;
  const y = amp * Math.sin(k * x_m - w * t + phi);
  return { speed_m_s: v, wavelength_m: wavelength, amplitude_m: amp, phase_constant_rad: phi, displacement_m: y };
}
