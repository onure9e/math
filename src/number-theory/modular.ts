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
  if (b === 0) return { gcd: Math.abs(a), x: a > 0 ? 1 : -1, y: 0 };
  
  const result = extendedGCD(b, a % b);
  
  return {
    gcd: result.gcd,
    x: result.y,
    y: result.x - Math.floor(a / b) * result.y
  };
}

export function modularInverse(a: number, modulus: number): number | null {
  if (modulus <= 0) throw new Error('Modulus must be positive');
  if (a === 0 && modulus === 1) return 0;
  
  const { gcd: d, x } = extendedGCD(a, modulus);
  
  if (d !== 1) return null;
  
  return ((x % modulus) + modulus) % modulus;
}

export function modularExponentiation(base: number, exponent: number, modulus: number): number {
  if (modulus <= 0) throw new Error('Modulus must be positive');
  if (modulus === 1) return 0;
  
  base = ((base % modulus) + modulus) % modulus;
  
  if (exponent < 0) {
    const inv = modularInverse(base, modulus);
    if (inv === null) throw new Error('Modular inverse does not exist');
    return modularExponentiation(inv, -exponent, modulus);
  }
  
  let result = 1;
  
  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }
  
  return result;
}

export function modularSqrt(a: number, p: number): number | null {
  if (p <= 2 || !isPrime(p)) throw new Error('p must be an odd prime');
  a = ((a % p) + p) % p;
  
  if (a === 0) return 0;
  
  if (legendreSymbol(a, p) !== 1) return null;
  
  if (p % 4 === 3) {
    return modularExponentiation(a, (p + 1) / 4, p);
  }
  
  if (p % 8 === 5) {
    const v = modularExponentiation(a, (p - 1) / 4, p);
    if (v === 1) {
      return modularExponentiation(a, (p + 3) / 8, p);
    }
    const w = modularExponentiation(2, (p - 1) / 4, p);
    return (v * w) % p;
  }
  
  return tonelliShanks(a, p);
}

function tonelliShanks(a: number, p: number): number | null {
  if (legendreSymbol(a, p) !== 1) return null;
  
  if (p % 4 === 3) {
    return modularExponentiation(a, (p + 1) / 4, p);
  }
  
  let q = p - 1;
  let s = 0;
  while (q % 2 === 0) {
    q /= 2;
    s++;
  }
  
  let z = 2;
  while (legendreSymbol(z, p) !== -1) {
    z++;
  }
  
  let c = modularExponentiation(z, q, p);
  let x = modularExponentiation(a, (q + 1) / 2, p);
  let t = modularExponentiation(a, q, p);
  let m = s;
  
  while (t !== 1) {
    let i = 1;
    let t2i = (t * t) % p;
    while (t2i !== 1) {
      t2i = (t2i * t2i) % p;
      i++;
    }
    
    const b = modularExponentiation(c, Math.pow(2, m - i - 1), p);
    x = (x * b) % p;
    c = (b * b) % p;
    t = (t * c) % p;
    m = i;
  }
  
  return x;
}

export function chineseRemainderTheorem(
  remainders: number[],
  moduli: number[]
): number | null {
  if (remainders.length !== moduli.length) return null;
  
  let x = 0;
  let M = 1;
  
  for (const m of moduli) {
    M *= m;
  }
  
  for (let i = 0; i < remainders.length; i++) {
    const mi = moduli[i];
    const ai = remainders[i];
    if (mi === undefined || ai === undefined) return null;
    const Mi = M / mi;
    const inv = modularInverse(Mi % mi, mi);

    if (inv === null) return null;

    x = (x + ai * Mi * inv) % M;
  }
  
  return ((x % M) + M) % M;
}

export function crt(remainders: number[], moduli: number[]): number | null {
  return chineseRemainderTheorem(remainders, moduli);
}

export function crtPair(r1: number, m1: number, r2: number, m2: number): { r: number; m: number } | null {
  const { gcd: d, x } = extendedGCD(m1, m2);

  if ((r2 - r1) % d !== 0) return null;

  const lcm = m1 / d * m2;
  let r = r1 + m1 * ((r2 - r1) / d * x % (m2 / d));
  r = ((r % lcm) + lcm) % lcm;

  return { r, m: lcm };
}

export function modularLinearEquation(
  a: number,
  b: number,
  n: number
): number[] {
  a = ((a % n) + n) % n;
  b = ((b % n) + n) % n;
  
  const { gcd: d, x } = extendedGCD(a, n);
  
  if (b % d !== 0) return [];
  
  const n0 = n / d;
  const x0 = (x * (b / d)) % n0;
  
  const solutions: number[] = [];
  for (let i = 0; i < d; i++) {
    solutions.push(((x0 + i * n0) % n + n) % n);
  }
  
  return solutions;
}

export function discreteLog(g: number, h: number, p: number): number | null {
  if (p <= 2) return null;
  if (h === 1) return 0;
  
  const n = Math.ceil(Math.sqrt(p));
  const babySteps = new Map<number, number>();
  let e = 1;
  
  for (let j = 0; j < n; j++) {
    babySteps.set(e, j);
    e = (e * g) % p;
  }
  
  const factor = modularExponentiation(g, (p - 1 - n), p);
  
  let cur = h;
  for (let i = 0; i <= n; i++) {
    const j = babySteps.get(cur);
    if (j !== undefined) {
      const ans = i * n + j;
      if (modularExponentiation(g, ans, p) === h) {
        return ans;
      }
    }
    cur = (cur * factor) % p;
  }
  
  return null;
}

export function primitiveRoot(p: number): number | null {
  if (p <= 2) return null;
  
  const phi = p - 1;
  const factors = primeFactorization(phi);
  
  for (let g = 2; g < p; g++) {
    let isPrimitive = true;
    for (const factor of factors.keys()) {
      if (modularExponentiation(g, phi / factor, p) === 1) {
        isPrimitive = false;
        break;
      }
    }
    if (isPrimitive) return g;
  }
  
  return null;
}

export function primitiveRoots(p: number): number[] {
  if (p <= 2) return [];
  
  const root = primitiveRoot(p);
  if (root === null) return [];
  
  const roots: number[] = [];
  const phi = p - 1;
  
  for (let i = 1; i <= phi; i++) {
    if (gcd(i, phi) === 1) {
      roots.push(modularExponentiation(root, i, p));
    }
  }
  
  return roots;
}

export function orderOfElement(g: number, p: number): number {
  if (g === 0 || p <= 2) return 0;
  
  const phi = p - 1;
  const factors = primeFactorization(phi);
  
  let order = phi;
  for (const factor of factors.keys()) {
    while (order % factor === 0) {
      if (modularExponentiation(g, order / factor, p) === 1) {
        order /= factor;
      } else {
        break;
      }
    }
  }
  
  return order;
}

export function index(g: number, h: number, p: number): number | null {
  const root = primitiveRoot(p);
  if (root === null) return null;
  
  const idxG = discreteLog(root, g, p);
  const idxH = discreteLog(root, h, p);
  
  if (idxG === null || idxH === null) return null;
  
  const inv = modularInverse(idxG, p - 1);
  if (inv === null) return null;
  
  return (idxH * inv) % (p - 1);
}

export function isQuadraticResidue(a: number, p: number): boolean {
  if (p <= 2) return false;
  return legendreSymbol(a, p) === 1;
}

export function isQuadraticNonResidue(a: number, p: number): boolean {
  if (p <= 2) return false;
  return legendreSymbol(a, p) === -1;
}

export function quadraticResidues(p: number): number[] {
  if (p <= 2) return [];
  const residues: Set<number> = new Set();
  
  for (let i = 1; i < p; i++) {
    residues.add(modularExponentiation(i, 2, p));
  }
  
  return Array.from(residues).sort((a, b) => a - b);
}

export function legendreSymbol(a: number, p: number): number {
  if (p <= 2 || !isPrime(p)) throw new Error('p must be an odd prime');
  a = ((a % p) + p) % p;
  if (a === 0) return 0;
  
  const ls = modularExponentiation(a, (p - 1) / 2, p);
  return ls === 1 ? 1 : ls === p - 1 ? -1 : 0;
}

export function jacobiSymbol(a: number, n: number): number {
  if (n <= 0 || n % 2 === 0) throw new Error('n must be an odd positive integer');
  a = ((a % n) + n) % n;
  
  if (a === 0) return 0;
  if (a === 1) return 1;
  
  let result = 1;
  while (a > 1) {
    while (a % 2 === 0) {
      a /= 2;
      const nMod8 = n % 8;
      if (nMod8 === 3 || nMod8 === 5) {
        result = -result;
      }
    }
    
    [a, n] = [n, a];
    
    if (a % 4 === 3 && n % 4 === 3) {
      result = -result;
    }
    
    a %= n;
    if (a > n / 2) {
      a = n - a;
      if (n % 4 === 3) {
        result = -result;
      }
    }
  }
  
  if (n === 1) return result;
  return 0;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  const limit = Math.sqrt(n);
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function primeFactorization(n: number): Map<number, number> {
  if (n === 0 || n === 1) return new Map();
  
  const factors = new Map<number, number>();
  let temp = n;
  
  while (temp % 2 === 0) {
    factors.set(2, (factors.get(2) || 0) + 1);
    temp /= 2;
  }
  
  for (let i = 3; i <= Math.sqrt(temp); i += 2) {
    while (temp % i === 0) {
      factors.set(i, (factors.get(i) || 0) + 1);
      temp /= i;
    }
  }
  
  if (temp > 2) {
    factors.set(temp, (factors.get(temp) || 0) + 1);
  }
  
  return factors;
}
