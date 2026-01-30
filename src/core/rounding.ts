// round function removed - conflicts with basic.ts
// Use roundTo or roundToNearest for more control

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest;
}

export function floorTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

export function ceilTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
}

export function truncate(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.trunc(value * factor) / factor;
}

export function roundHalfUp(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  const shifted = value * factor;
  const floored = Math.floor(shifted);
  const remainder = shifted - floored;
  const adjusted = remainder >= 0.5 ? 1 : 0;
  return (floored + adjusted) / factor;
}

export function roundHalfDown(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  const shifted = value * factor;
  const floored = Math.floor(shifted);
  const remainder = shifted - floored;
  const adjusted = remainder > 0.5 ? 1 : 0;
  return (floored + adjusted) / factor;
}

export function roundHalfEven(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  const shifted = value * factor;
  const rounded = Math.round(shifted);
  const remainder = shifted - Math.floor(shifted);
  if (Math.abs(remainder - 0.5) < 1e-10) {
    const lower = Math.floor(shifted);
    const upper = lower + 1;
    const lowerEven = lower % 2 === 0;
    return (lowerEven ? lower : upper) / factor;
  }
  return rounded / factor;
}

export function bankersRound(value: number, decimals: number = 0): number {
  return roundHalfEven(value, decimals);
}

export function formatNumber(value: number, decimals: number = 2, thousandSeparator: boolean = true): string {
  const fixed = value.toFixed(decimals);
  if (!thousandSeparator) return fixed;

  const parts = fixed.split('.');
  if (parts[0] === undefined) return fixed;
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function formatCurrency(value: number, currency: string = '$', decimals: number = 2): string {
  return currency + formatNumber(value, decimals);
}

export function formatPercent(value: number, decimals: number = 2): string {
  return formatNumber(value * 100, decimals) + '%';
}

export function formatScientific(value: number, decimals: number = 2): string {
  return value.toExponential(decimals);
}

export function formatCompact(value: number, decimals: number = 1): string {
  if (Math.abs(value) >= 1e12) return (value / 1e12).toFixed(decimals) + 'T';
  if (Math.abs(value) >= 1e9) return (value / 1e9).toFixed(decimals) + 'B';
  if (Math.abs(value) >= 1e6) return (value / 1e6).toFixed(decimals) + 'M';
  if (Math.abs(value) >= 1e3) return (value / 1e3).toFixed(decimals) + 'K';
  return value.toString();
}
