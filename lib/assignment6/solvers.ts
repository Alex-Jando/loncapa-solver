export function solve_q1(
  r1: number,
  r2: number,
  r3: number,
  r4: number,
  r5: number,
  r6: number,
): Record<string, number> {
  const ra = 1 / (1 / r3 + 1 / r4);
  const rb = r5 + r6;
  const rc = 1 / (1 / ra + 1 / rb);
  const rd = rc + r2;
  const re = 1 / r1 + 1 / rd;
  return { total_resistance_ohm: 1 / re };
}

export function solve_q2(
  r1: number,
  r4: number,
  r5: number,
  a1: number,
  a2: number,
  a3: number,
  v: number,
): Record<string, number> {
  const a5 = a1 - a2 + a3;
  const v1 = r1 * a1;
  const v2 = v - v1;
  const r2 = v2 / a2;
  const v5 = a5 * r5;
  const v3 = v - v5;
  const r3 = v3 / a3;
  return { a5_A: a5, r2_ohm: r2, r3_ohm: r3 };
}

export function solve_q3(r1: number): Record<string, number> {
  const rPrime = (r1 * (Math.sqrt(2) - 1)) / (1 - Math.sqrt(2) / 2);
  return { r_prime_ohm: rPrime };
}

export function solve_q4(
  e1: number,
  i2: number,
  r1: number,
  r2: number,
  r3: number,
): Record<string, number> {
  const i1 = (e1 - i2 * r2) / r1;
  const i3 = i2 - i1;
  const e2 = i2 * r2 + i3 * r3;
  return { i1_A: i1, i3_A: i3, e2_V: e2 };
}

export function solve_q5(
  r1: number,
  r2: number,
  r3: number,
  r4: number,
  r5: number,
  r6: number,
  r7: number,
  r8: number,
  e1: number,
  e4: number,
  e6: number,
): Record<string, number> {
  const i = (e1 + e6) / (r1 + r2 + r3 + r6 + r7);
  const vab = Math.abs(-e4 - i * r7 + e6 - i * r6);
  const denom =
    r1 * r4 +
    r1 * r5 +
    r1 * r6 +
    r1 * r7 +
    r1 * r8 +
    r2 * r4 +
    r2 * r5 +
    r2 * r6 +
    r2 * r7 +
    r2 * r8 +
    r3 * r4 +
    r3 * r5 +
    r3 * r6 +
    r3 * r7 +
    r3 * r8 +
    r4 * r6 +
    r4 * r7 +
    r5 * r6 +
    r5 * r7 +
    r6 * r8 +
    r7 * r8;
  const iR8 = Math.abs(
    (e1 * r6 + e1 * r7 + e4 * r1 + e4 * r2 + e4 * r3 + e4 * r6 + e4 * r7 - e6 * r1 - e6 * r2 - e6 * r3) /
      denom,
  );
  return { vab_V: vab, i_r8_A: iR8 };
}

export function solve_q6(r1: number, r2: number, r3: number, r4: number, v1: number): Record<string, number> {
  const rt = 1 / (1 / (r1 + r2) + 1 / r3) + r4;
  const i3 = v1 / rt;
  const i1 = (v1 - r4 * i3) / (r1 + r2);
  const pR2 = i1 ** 2 * r2;
  return { p_r2_W: pR2 };
}

export function solve_q7(series_total: number, parallel_total: number): Record<string, number> {
  const disc = Math.sqrt(series_total ** 2 - 4 * -1 * (-series_total * parallel_total));
  const r1 = (-series_total + disc) / -2;
  const r2 = (-series_total - disc) / -2;
  return { r1_ohm: r1, r2_ohm: r2 };
}

export function solve_q8(
  r1: number,
  r2: number,
  r3: number,
  e1: number,
  e2: number,
  e3: number,
): Record<string, number> {
  const v = (e1 / r1 + e2 / r2 + e3 / r3) / (1 / r1 + 1 / r2 + 1 / r3);
  return { i1_mA: (v - e1) / r1, i2_mA: (v - e2) / r2, i3_mA: (v - e3) / r3, v_cf_V: v };
}

export function solve_q9(r: number, e: number): Record<string, number> {
  const i2 = (1.71 * r * e - 2.71 * r * 2 * e) / (1.71 * r * 1.71 * r - 2.71 * r * 3.71 * r);
  const i1 = (e - 1.71 * r * i2) / (2.71 * r);
  const v = (i1 + i2) * (1.71 * r);
  const i4 = v / (4 * r);
  return { i_ae_A: i4 - i1 };
}

export function solve_q10(c_nF: number, q1_uC: number, r_kohm: number, t1_us: number, t2_us: number): Record<string, number> {
  const c = c_nF * 1e-9;
  const q1 = q1_uC * 1e-6;
  const r = r_kohm * 1e3;
  const t1 = t1_us * 1e-6;
  const t2 = t2_us * 1e-6;
  const current = ((q1 / c) / r) * Math.exp(-t1 / (r * c));
  const charge = q1 * Math.exp(-t2 / (r * c));
  const maxCurrent = (q1 / c) / r;
  return { current_A: current, charge_remaining_C: charge, max_current_A: maxCurrent };
}

export function solve_q11(r1: number, r2: number, v1: number, v2: number): Record<string, number> {
  const i = v1 / (r1 + r2);
  const v = i * r2;
  return { vab_V: Math.abs(v2 - v) };
}

export function solve_q12(v: number, r: number, p: number): Record<string, number> {
  const x1 = (v + Math.sqrt((-v) ** 2 - 4 * r * p)) / (2 * r);
  const x2 = (v - Math.sqrt((-v) ** 2 - 4 * r * p)) / (2 * r);
  return { r_a_ohm: p / x1 ** 2, r_b_ohm: p / x2 ** 2 };
}

export function solve_q13(c: number, v1: number, v2: number, t: number): Record<string, number> {
  const r = t / (c * (Math.log(v1) - Math.log(v1 - v2)));
  return { resistance_ohm: r };
}

export function solve_q14(
  r1_k: number,
  r2_k: number,
  c1_u: number,
  c2_u: number,
  e: number,
  t1_ms: number,
  t2_ms: number,
): Record<string, number> {
  const r1 = r1_k * 1e3;
  const r2 = r2_k * 1e3;
  const c1 = c1_u * 1e-6;
  const c2 = c2_u * 1e-6;
  const t1 = t1_ms * 1e-3;
  const t2 = t2_ms * 1e-3;
  const ct = c1 + c2;
  const rt = 1 / (1 / r1 + 1 / r2);
  const q1 = c1 * e * (1 - Math.exp(-t1 / (rt * ct)));
  const q2 = c2 * e * (1 - Math.exp(-t2 / (rt * ct)));
  return { q1_C: q1, q2_C: q2 };
}
