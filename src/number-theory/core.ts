export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  if (n === 3) return true;
  
  const limit = Math.sqrt(n);
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export function isComposite(n: number): boolean {
  return n > 1 && !isPrime(n);
}

export function isPerfect(n: number): boolean {
  if (n < 1) return false;
  if (n === 1) return true;
  
  let sum = 1;
  const limit = Math.sqrt(n);
  for (let i = 2; i <= limit; i++) {
    if (n % i === 0) {
      sum += i;
      if (i !== n / i) sum += n / i;
    }
  }
  return sum === n;
}

export function isAbundant(n: number): boolean {
  if (n < 1) return false;
  if (n === 1) return false;
  
  let sum = 1;
  const limit = Math.sqrt(n);
  for (let i = 2; i <= limit; i++) {
    if (n % i === 0) {
      sum += i;
      if (i !== n / i) sum += n / i;
    }
  }
  return sum > n;
}

export function isDeficient(n: number): boolean {
  if (n < 1) return false;
  if (n === 1) return true;
  
  let sum = 1;
  const limit = Math.sqrt(n);
  for (let i = 2; i <= limit; i++) {
    if (n % i === 0) {
      sum += i;
      if (i !== n / i) sum += n / i;
    }
  }
  return sum < n;
}

export function isSquare(n: number): boolean {
  if (n < 0) return false;
  const root = Math.sqrt(n);
  return Number.isInteger(root);
}

export function isCube(n: number): boolean {
  if (n < 0) return false;
  const root = Math.cbrt(n);
  return Number.isInteger(root);
}

export function isPower(n: number, base: number): boolean {
  if (n <= 0 || base <= 1) return false;
  let result = 1;
  while (result < n) {
    result *= base;
  }
  return result === n;
}

export function isPerfectPower(n: number): { base: number; exponent: number } | null {
  if (n <= 0) return null;
  
  for (let exp = 2; exp <= Math.log2(n); exp++) {
    const base = Math.round(Math.pow(n, 1 / exp));
    if (base > 1 && Math.pow(base, exp) === n) {
      return { base, exponent: exp };
    }
  }
  return null;
}

export function isArmstrong(n: number): boolean {
  const digits = Math.abs(n).toString().split('').map(Number);
  const power = digits.length;
  const sum = digits.reduce((acc, d) => acc + Math.pow(d, power), 0);
  return sum === Math.abs(n);
}

export function isPalindrome(n: number): boolean {
  const str = Math.abs(n).toString();
  return str === str.split('').reverse().join('');
}

export function isHarshad(n: number): boolean {
  if (n === 0) return false;
  const digits = Math.abs(n).toString().split('').map(Number).reduce((a, b) => a + b, 0);
  return n % digits === 0;
}

export function isAutomorphic(n: number): boolean {
  const square = n * n;
  const strN = n.toString();
  const strSquare = square.toString();
  return strSquare.endsWith(strN);
}

export function isKaprekar(n: number): boolean {
  if (n === 1) return true;
  const square = n * n;
  const strSquare = square.toString();
  const strN = n.toString();
  const len = strN.length;
  
  if (strSquare.length < len) return false;
  
  const right = parseInt(strSquare.slice(-len));
  const left = strSquare.length > len ? parseInt(strSquare.slice(0, -len)) : 0;
  
  return left + right === n;
}

export function primeFactors(n: number): number[] {
  if (n === 0) return [];
  if (n === 1) return [];
  
  const factors: number[] = [];
  
  while (n % 2 === 0) {
    factors.push(2);
    n /= 2;
  }
  
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    while (n % i === 0) {
      factors.push(i);
      n /= i;
    }
  }
  
  if (n > 2) factors.push(n);
  
  return factors;
}

export function primeFactorization(n: number): Map<number, number> {
  if (n === 0 || n === 1) return new Map();
  
  const factors = new Map<number, number>();
  const primeList = primeFactors(n);
  
  for (const p of primeList) {
    factors.set(p, (factors.get(p) || 0) + 1);
  }
  
  return factors;
}

export function divisorCount(n: number): number {
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  const factors = primeFactorization(n);
  let count = 1;
  for (const exp of factors.values()) {
    count *= (exp + 1);
  }
  return count;
}

export function divisorSum(n: number): number {
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  const factors = primeFactorization(n);
  let sum = 1;
  
  for (const [p, exp] of factors) {
    sum *= (Math.pow(p, exp + 1) - 1) / (p - 1);
  }
  
  return sum;
}

export function properDivisorSum(n: number): number {
  return divisorSum(n) - n;
}

export function aliquotSum(n: number): number {
  return properDivisorSum(n);
}

export function divisors(n: number): number[] {
  if (n === 0) return [];
  
  const divs: number[] = [];
  
  for (let i = 1; i <= Math.sqrt(Math.abs(n)); i++) {
    if (n % i === 0) {
      divs.push(i);
      if (i !== n / i) divs.push(n / i);
    }
  }
  
  return divs.sort((a, b) => a - b);
}

export function sigma(n: number): number {
  return divisorSum(n);
}

export function phi(n: number): number {
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  let result = n;
  let p = 2;
  let temp = n;
  
  while (p * p <= temp) {
    if (temp % p === 0) {
      while (temp % p === 0) temp /= p;
      result -= result / p;
    }
    p++;
  }
  
  if (temp > 1) result -= result / temp;
  
  return result;
}

export function totient(n: number): number {
  return phi(n);
}

export function radical(n: number): number {
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  const factors = primeFactorization(n);
  let rad = 1;
  for (const p of factors.keys()) {
    rad *= p;
  }
  return rad;
}

export function mobius(n: number): number {
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  const factors = primeFactorization(n);
  for (const exp of factors.values()) {
    if (exp > 1) return 0;
  }
  return factors.size % 2 === 0 ? 1 : -1;
}

export function liouville(n: number): number {
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  const factors = primeFactorization(n);
  let sum = 0;
  for (const exp of factors.values()) {
    sum += exp;
  }
  return Math.pow(-1, sum);
}

export function isSmooth(n: number, limit: number): boolean {
  if (n <= 1) return true;
  const factors = primeFactorization(n);
  for (const p of factors.keys()) {
    if (p > limit) return false;
  }
  return true;
}

export function isPowerful(n: number): boolean {
  if (n <= 0) return false;
  const factors = primeFactorization(n);
  for (const exp of factors.values()) {
    if (exp < 2) return false;
  }
  return true;
}

export function isSquarefree(n: number): boolean {
  if (n <= 0) return false;
  return mobius(n) !== 0;
}

export function squarefreeKernel(n: number): number {
  if (n <= 0) return 0;
  return radical(n);
}
