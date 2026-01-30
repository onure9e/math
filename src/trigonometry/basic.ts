export function sin(x: number, useRadians: boolean = true): number {
  return useRadians ? Math.sin(x) : Math.sin(x * Math.PI / 180);
}

export function cos(x: number, useRadians: boolean = true): number {
  return useRadians ? Math.cos(x) : Math.cos(x * Math.PI / 180);
}

export function tan(x: number, useRadians: boolean = true): number {
  const value = useRadians ? x : x * Math.PI / 180;
  const cosVal = Math.cos(value);
  if (Math.abs(cosVal) < 1e-15) throw new Error('Tangent undefined at odd multiples of π/2');
  return Math.tan(value);
}

export function csc(x: number, useRadians: boolean = true): number {
  const s = sin(x, useRadians);
  if (Math.abs(s) < 1e-15) throw new Error('Cosecant undefined at multiples of π');
  return 1 / s;
}

export function sec(x: number, useRadians: boolean = true): number {
  const c = cos(x, useRadians);
  if (Math.abs(c) < 1e-15) throw new Error('Secant undefined at odd multiples of π/2');
  return 1 / c;
}

export function cot(x: number, useRadians: boolean = true): number {
  const t = tan(x, useRadians);
  if (Math.abs(t) < 1e-15) throw new Error('Cotangent undefined at multiples of π/2');
  return 1 / t;
}

export function sin2(x: number, useRadians: boolean = true): number {
  const s = sin(x, useRadians);
  return s * s;
}

export function cos2(x: number, useRadians: boolean = true): number {
  const c = cos(x, useRadians);
  return c * c;
}

export function tan2(x: number, useRadians: boolean = true): number {
  const t = tan(x, useRadians);
  return t * t;
}

export function sinh(x: number): number {
  return (Math.exp(x) - Math.exp(-x)) / 2;
}

export function cosh(x: number): number {
  return (Math.exp(x) + Math.exp(-x)) / 2;
}

export function tanh(x: number): number {
  const e2x = Math.exp(2 * x);
  return (e2x - 1) / (e2x + 1);
}

export function csch(x: number): number {
  const s = sinh(x);
  if (Math.abs(s) < 1e-15) throw new Error('Hyperbolic cosecant undefined at 0');
  return 1 / s;
}

export function sech(x: number): number {
  const c = cosh(x);
  return 1 / c;
}

export function coth(x: number): number {
  const t = tanh(x);
  if (Math.abs(t) < 1e-15) throw new Error('Hyperbolic cotangent undefined at 0');
  return 1 / t;
}

export function versin(x: number, useRadians: boolean = true): number {
  return 1 - cos(x, useRadians);
}

export function coversin(x: number, useRadians: boolean = true): number {
  return 1 - sin(x, useRadians);
}

export function exsec(x: number, useRadians: boolean = true): number {
  return sec(x, useRadians) - 1;
}

export function excsc(x: number, useRadians: boolean = true): number {
  return csc(x, useRadians) - 1;
}

export function hav(x: number, useRadians: boolean = true): number {
  return (1 - cos(x, useRadians)) / 2;
}

export function lawOfSines(
  a: number,
  _b: number,
  _c: number,
  angleA: number,
  angleB: number,
  angleC: number,
  useRadians: boolean = true
): { a: number; b: number; c: number; angleA: number; angleB: number; angleC: number } {
  if (useRadians) {
    angleA = angleA * Math.PI / 180;
    angleB = angleB * Math.PI / 180;
    angleC = angleC * Math.PI / 180;
  }
  
  const ratio = a / Math.sin(angleA);
  const newB = ratio * Math.sin(angleB);
  const newC = ratio * Math.sin(angleC);
  const sumAngles = angleA + angleB + angleC;
  const newAngleA = angleA * Math.PI / sumAngles;
  const newAngleB = angleB * Math.PI / sumAngles;
  const newAngleC = angleC * Math.PI / sumAngles;
  
  return {
    a: newB,
    b: newC,
    c: a,
    angleA: useRadians ? newAngleA : newAngleA * 180 / Math.PI,
    angleB: useRadians ? newAngleB : newAngleB * 180 / Math.PI,
    angleC: useRadians ? newAngleC : newAngleC * 180 / Math.PI
  };
}

export function lawOfCosines(
  a: number,
  b: number,
  c: number,
  useRadians: boolean = true
): { angleA: number; angleB: number; angleC: number } {
  const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c));
  const angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c));
  const angleC = Math.PI - angleA - angleB;
  
  return {
    angleA: useRadians ? angleA : angleA * 180 / Math.PI,
    angleB: useRadians ? angleB : angleB * 180 / Math.PI,
    angleC: useRadians ? angleC : angleC * 180 / Math.PI
  };
}

export function degreesToRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

export function radiansToDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

export function degreesToGradians(degrees: number): number {
  return degrees * 10 / 9;
}

export function gradiansToDegrees(gradians: number): number {
  return gradians * 9 / 10;
}

export function radiansToGradians(radians: number): number {
  return radians * 200 / Math.PI;
}

export function gradiansToRadians(gradians: number): number {
  return gradians * Math.PI / 200;
}

export function degreesToMinutes(degrees: number): number {
  return degrees * 60;
}

export function minutesToDegrees(minutes: number): number {
  return minutes / 60;
}

export function degreesToSeconds(degrees: number): number {
  return degrees * 3600;
}

export function secondsToDegrees(seconds: number): number {
  return seconds / 3600;
}

export function dmsToDecimal(degrees: number, minutes: number, seconds: number): number {
  return degrees + minutes / 60 + seconds / 3600;
}

export function decimalToDMS(decimal: number): { degrees: number; minutes: number; seconds: number } {
  const d = Math.floor(decimal);
  const remainder = (decimal - d) * 60;
  const m = Math.floor(remainder);
  const s = (remainder - m) * 60;
  return { degrees: d, minutes: m, seconds: s };
}
