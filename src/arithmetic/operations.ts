import { DomainError, RangeError } from '../types';
import { MAX_FACTORIAL_INPUT } from '../constants';

export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new DomainError('Division by zero');
  return a / b;
}

export function modulo(a: number, b: number): number {
  if (b === 0) throw new DomainError('Modulo by zero');
  return a % b;
}

export function power(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

export function sqrt(value: number): number {
  if (value < 0) throw new DomainError('Square root of negative number');
  return Math.sqrt(value);
}

export function cbrt(value: number): number {
  return Math.cbrt(value);
}

export function nthRoot(value: number, n: number): number {
  if (n === 0) throw new DomainError('Root degree cannot be zero');
  if (value < 0 && n % 2 === 0) throw new DomainError('Even root of negative number');
  return Math.pow(Math.abs(value), 1 / n) * (value < 0 ? -1 : 1);
}

export function log(value: number, base: number = Math.E): number {
  if (value <= 0) throw new DomainError('Logarithm of non-positive number');
  if (base <= 0 || base === 1) throw new DomainError('Invalid logarithm base');
  return Math.log(value) / Math.log(base);
}

export function log10(value: number): number {
  if (value <= 0) throw new DomainError('Logarithm of non-positive number');
  return Math.log10(value);
}

export function log2(value: number): number {
  if (value <= 0) throw new DomainError('Logarithm of non-positive number');
  return Math.log2(value);
}

export function ln(value: number): number {
  if (value <= 0) throw new DomainError('Natural log of non-positive number');
  return Math.log(value);
}

export function exp(value: number): number {
  return Math.exp(value);
}

export function exp2(value: number): number {
  return Math.pow(2, value);
}

export function hypotenuse(a: number, b: number): number {
  return Math.hypot(a, b);
}

export function hypot(...values: number[]): number {
  return Math.hypot(...values);
}

export function factorial(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new DomainError('Factorial requires non-negative integer');
  }
  if (value > MAX_FACTORIAL_INPUT) return Infinity;
  let result = 1;
  for (let i = 2; i <= value; i++) result *= i;
  return result;
}

export function factorialAsync(value: number): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(factorial(value));
    } catch (e) {
      reject(e);
    }
  });
}

export function doubleFactorial(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new DomainError('Double factorial requires non-negative integer');
  }
  if (value <= 1) return 1;
  let result = 1;
  for (let i = value; i > 0; i -= 2) result *= i;
  return result;
}

export function subFactorial(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new DomainError('Subfactorial requires non-negative integer');
  }
  return Math.round(factorial(value) / Math.E);
}

export function primorial(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new DomainError('Primorial requires non-negative integer');
  }
  let result = 1;
  let n = 2;
  while (n <= value) {
    if (isPrime(n)) result *= n;
    n++;
  }
  return result;
}

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  const limit = Math.sqrt(n);
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

export function gcdMultiple(...numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((acc, n) => gcd(acc, n));
}

export function lcmMultiple(...numbers: number[]): number {
  if (numbers.length === 0) return 1;
  return numbers.reduce((acc, n) => lcm(acc, n));
}

export function extendedGCD(a: number, b: number): { gcd: number; x: number; y: number } {
  a = Math.abs(a);
  b = Math.abs(b);

  let old_r = a, r = b;
  let old_s = 1, s = 0;
  let old_t = 0, t = 1;

  while (r !== 0) {
    const quotient = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
    [old_t, t] = [t, old_t - quotient * t];
  }

  return { gcd: old_r, x: old_s, y: old_t };
}

export function coprime(a: number, b: number): boolean {
  return gcd(a, b) === 1;
}

export function legendreSymbol(a: number, p: number): number {
  if (p <= 2 || !isPrime(p)) throw new DomainError('p must be an odd prime');
  a = ((a % p) + p) % p;
  if (a === 0) return 0;
  if (modularExponentiation(a, (p - 1) / 2, p) === 1) return 1;
  return -1;
}

export function modularExponentiation(base: number, exponent: number, modulus: number): number {
  if (modulus <= 0) throw new DomainError('Modulus must be positive');
  base = ((base % modulus) + modulus) % modulus;
  if (exponent < 0) {
    const inv = modularInverse(base, modulus);
    return modularExponentiation(inv, -exponent, modulus);
  }
  let result = 1;
  base %= modulus;
  while (exponent > 0) {
    if (exponent % 2 === 1) result = (result * base) % modulus;
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }
  return result;
}

export function modularInverse(a: number, modulus: number): number {
  if (modulus <= 0) throw new DomainError('Modulus must be positive');
  const { gcd: d, x } = extendedGCD(a, modulus);
  if (d !== 1) throw new DomainError('Modular inverse does not exist');
  return ((x % modulus) + modulus) % modulus;
}

export function modularSqrt(a: number, p: number): number | null {
  if (p <= 2 || !isPrime(p)) throw new DomainError('p must be an odd prime');
  a = ((a % p) + p) % p;
  if (a === 0) return 0;
  if (legendreSymbol(a, p) !== 1) return null;
  if (p % 4 === 3) return modularExponentiation(a, (p + 1) / 4, p);
  if (p % 8 === 5) {
    const v = modularExponentiation(a, (p - 1) / 4, p);
    if (v === 1) return modularExponentiation(a, (p + 3) / 8, p);
    const w = modularExponentiation(2, (p - 1) / 4, p);
    return (v * w) % p;
  }
  throw new DomainError('Tonelli-Shanks: p ≡ 1 mod 8 not yet implemented');
}

export function crt(remainders: number[], moduli: number[]): number | null {
  if (remainders.length !== moduli.length) return null;
  let x = 0;
  let M = 1;
  for (const m of moduli) M *= m;
  for (let i = 0; i < remainders.length; i++) {
    const mi = moduli[i];
    const ai = remainders[i];
    if (mi === undefined || ai === undefined) {
      throw new RangeError('Invalid input: remainders and moduli must have defined values at all indices');
    }
    const Mi = M / mi;
    const inv = modularInverse(Mi % mi, mi);
    x = (x + ai * Mi * inv) % M;
  }
  return ((x % M) + M) % M;
}

export function sum(...values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

export function product(...values: number[]): number {
  return values.reduce((acc, v) => acc * v, 1);
}

export function average(...values: number[]): number {
  if (values.length === 0) return 0;
  return sum(...values) / values.length;
}

export function median(...values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    const left = sorted[mid - 1];
    const right = sorted[mid];
    if (left === undefined || right === undefined) {
      throw new RangeError('Invalid median calculation: sorted array has undefined values');
    }
    return (left + right) / 2;
  }
  const midValue = sorted[mid];
  if (midValue === undefined) {
    throw new RangeError('Invalid median calculation: sorted array has undefined value');
  }
  return midValue;
}

export function weightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length || values.length === 0) {
    throw new RangeError('Values and weights must have same non-zero length');
  }
  let sum = 0;
  let weightSum = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const w = weights[i];
    if (v === undefined || w === undefined) {
      throw new RangeError('Invalid input: values and weights must have defined values at all indices');
    }
    sum += v * w;
    weightSum += w;
  }
  return sum / weightSum;
}

export function harmonicMean(...values: number[]): number {
  if (values.some(v => v <= 0)) throw new DomainError('Harmonic mean requires positive values');
  if (values.length === 0) return 0;
  return values.length / values.reduce((acc, v) => acc + 1 / v, 0);
}

export function quadraticMean(...values: number[]): number {
  if (values.length === 0) return 0;
  return Math.sqrt(values.reduce((acc, v) => acc + v * v, 0) / values.length);
}

export function geometricMean(...values: number[]): number {
  if (values.some(v => v <= 0)) throw new DomainError('Geometric mean requires positive values');
  if (values.length === 0) return 0;
  return Math.pow(values.reduce((acc, v) => acc * v, 1), 1 / values.length);
}
