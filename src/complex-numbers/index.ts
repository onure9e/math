export function complex(re: number = 0, im: number = 0): Complex {
  return { re, im };
}

export function complexAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function complexSub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}

export function complexMult(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re
  };
}

export function complexDiv(a: Complex, b: Complex): Complex {
  const denom = b.re * b.re + b.im * b.im;
  if (denom === 0) throw new Error('Division by zero complex number');
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom
  };
}

export function complexConjugate(z: Complex): Complex {
  return { re: z.re, im: -z.im };
}

export function complexMagnitude(z: Complex): number {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}

export function complexModulus(z: Complex): number {
  return complexMagnitude(z);
}

export function complexPhase(z: Complex): number {
  return Math.atan2(z.im, z.re);
}

export function complexArgument(z: Complex): number {
  return complexPhase(z);
}

export function complexExp(z: Complex): Complex {
  const expRe = Math.exp(z.re);
  return {
    re: expRe * Math.cos(z.im),
    im: expRe * Math.sin(z.im)
  };
}

export function complexLog(z: Complex): Complex {
  return {
    re: Math.log(complexMagnitude(z)),
    im: complexPhase(z)
  };
}

export function complexPow(z: Complex, n: number): Complex {
  if (Number.isInteger(n)) {
    return complexIntegerPower(z, n);
  }
  return complexExp(complexMult(complexLog(z), { re: n, im: 0 }));
}

function complexIntegerPower(z: Complex, n: number): Complex {
  if (n === 0) return { re: 1, im: 0 };
  if (n === 1) return { ...z };
  if (n < 0) {
    const inv = complexDiv({ re: 1, im: 0 }, z);
    return complexIntegerPower(inv, -n);
  }
  
  let result: Complex = { re: 1, im: 0 };
  let base = { ...z };
  let exp = Math.abs(n);
  
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = complexMult(result, base);
    }
    base = complexMult(base, base);
    exp = Math.floor(exp / 2);
  }
  
  return result;
}

export function complexSqrt(z: Complex): Complex {
  const r = complexMagnitude(z);
  const theta = complexPhase(z);
  const sqrtR = Math.sqrt(r);
  
  return {
    re: sqrtR * Math.cos(theta / 2),
    im: sqrtR * Math.sin(theta / 2)
  };
}

export function complexSin(z: Complex): Complex {
  return {
    re: Math.sin(z.re) * Math.cosh(z.im),
    im: Math.cos(z.re) * Math.sinh(z.im)
  };
}

export function complexCos(z: Complex): Complex {
  return {
    re: Math.cos(z.re) * Math.cosh(z.im),
    im: -Math.sin(z.re) * Math.sinh(z.im)
  };
}

export function complexTan(z: Complex): Complex {
  const sin = complexSin(z);
  const cos = complexCos(z);
  return complexDiv(sin, cos);
}

export function complexSinh(z: Complex): Complex {
  return {
    re: Math.sinh(z.re) * Math.cos(z.im),
    im: Math.cosh(z.re) * Math.sin(z.im)
  };
}

export function complexCosh(z: Complex): Complex {
  return {
    re: Math.cosh(z.re) * Math.cos(z.im),
    im: Math.sinh(z.re) * Math.sin(z.im)
  };
}

export function complexTanh(z: Complex): Complex {
  const sinh = complexSinh(z);
  const cosh = complexCosh(z);
  return complexDiv(sinh, cosh);
}

export function rectToPolar(z: Complex): { r: number; theta: number } {
  return {
    r: complexMagnitude(z),
    theta: complexPhase(z)
  };
}

export function polarToRect(r: number, theta: number): Complex {
  return {
    re: r * Math.cos(theta),
    im: r * Math.sin(theta)
  };
}

export function complexFromPolar(r: number, theta: number): Complex {
  return polarToRect(r, theta);
}

export function complexToPolar(z: Complex): { r: number; theta: number } {
  return rectToPolar(z);
}

export function complexNeg(z: Complex): Complex {
  return { re: -z.re, im: -z.im };
}

export function complexInverse(z: Complex): Complex {
  const denom = z.re * z.re + z.im * z.im;
  return { re: z.re / denom, im: -z.im / denom };
}

export function complexEquals(a: Complex, b: Complex): boolean {
  return Math.abs(a.re - b.re) < 1e-15 && Math.abs(a.im - b.im) < 1e-15;
}

export function complexReal(z: Complex): number {
  return z.re;
}

export function complexImag(z: Complex): number {
  return z.im;
}

export function complexIm(z: Complex): number {
  return z.im;
}

export function complexRe(z: Complex): number {
  return z.re;
}

export function complexAbs(z: Complex): number {
  return complexMagnitude(z);
}

export function complexArg(z: Complex): number {
  return complexPhase(z);
}

export function complexNorm(z: Complex): number {
  return z.re * z.re + z.im * z.im;
}

export function complexDistance(a: Complex, b: Complex): number {
  return complexMagnitude(complexSub(a, b));
}

export function complexDot(a: Complex, b: Complex): number {
  return a.re * b.re + a.im * b.im;
}

export function complexCross(a: Complex, b: Complex): number {
  return a.re * b.im - a.im * b.re;
}

export function complexRotate(z: Complex, angle: number): Complex {
  return {
    re: z.re * Math.cos(angle) - z.im * Math.sin(angle),
    im: z.re * Math.sin(angle) + z.im * Math.cos(angle)
  };
}

export function complexScale(z: Complex, s: number): Complex {
  return { re: z.re * s, im: z.im * s };
}

export function complexConj(z: Complex): Complex {
  return complexConjugate(z);
}

export function complexString(z: Complex, precision: number = 6): string {
  const re = z.re.toFixed(precision);
  const im = Math.abs(z.im).toFixed(precision);
  if (z.im === 0) return re;
  if (z.re === 0) return z.im > 0 ? `${im}i` : `-${im}i`;
  return z.im > 0 ? `${re} + ${im}i` : `${re} - ${im}i`;
}

export function complexFromString(s: string): Complex | null {
  const match = s.match(/^([-+]?\d*\.?\d+)?\s*([-+]?\s*\d*\.?\d*)?i$/);
  if (!match) return null;
  
  const reStr = match[1] || '0';
  const imStr = match[2] ? match[2].replace(/\s/g, '') : '1';
  
  const re = parseFloat(reStr) || 0;
  const im = parseFloat(imStr.replace(/i$/, '')) || 0;
  
  return { re, im };
}

export function i(): Complex {
  return { re: 0, im: 1 };
}

export function one(): Complex {
  return { re: 1, im: 0 };
}

export function zero(): Complex {
  return { re: 0, im: 0 };
}

export interface Complex {
  re: number;
  im: number;
}
