export const DEFAULT_SIG_FIGS = 3;

export function formatScientific(value: number, sigFigs: number): string {
  const sf = Math.max(1, Math.trunc(sigFigs));
  if (!Number.isFinite(value)) {
    return String(value);
  }

  if (Object.is(value, 0) || value === 0) {
    const zeroMantissa = (0).toFixed(Math.max(0, sf - 1));
    return `${zeroMantissa}E+00`;
  }

  let exponent = Math.floor(Math.log10(Math.abs(value)));
  let mantissa = value / 10 ** exponent;
  let rounded = Number(mantissa.toPrecision(sf));
  if (Math.abs(rounded) >= 10) {
    rounded /= 10;
    exponent += 1;
  }

  const mantissaString = rounded.toFixed(Math.max(0, sf - 1));
  const exponentSign = exponent >= 0 ? "+" : "-";
  const exponentAbs = Math.abs(exponent).toString().padStart(2, "0");
  return `${mantissaString}E${exponentSign}${exponentAbs}`;
}
