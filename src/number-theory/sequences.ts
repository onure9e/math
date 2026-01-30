import { mobius, primeFactorization as pf } from './core';

export function fibonacci(n: number): number {
  if (n < 0) throw new Error('n must be non-negative');
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

export function fibonacciSequence(n: number): number[] {
  if (n < 0) throw new Error('n must be non-negative');
  const sequence: number[] = [0, 1];
  while (sequence.length < n) {
    const len = sequence.length;
    const a = sequence[len - 1];
    const b = sequence[len - 2];
    if (a === undefined || b === undefined) break;
    sequence.push(a + b);
  }
  return sequence.slice(0, n);
}

export function fibonacciIndex(n: number): number | null {
  if (n < 0) return null;
  
  let a = 0, b = 1, index = 1;
  while (b < n) {
    const temp = a + b;
    a = b;
    b = temp;
    index++;
    if (index > 10000) return null;
  }
  return b === n ? index : null;
}

export function isFibonacci(n: number): boolean {
  return fibonacciIndex(n) !== null;
}

export function fibonacciMod(n: number, m: number): number {
  if (n < 0 || m <= 0) throw new Error('Invalid arguments');
  
  if (n === 0) return 0;
  
  const period = fibonacciPisanoPeriod(m);
  const n_mod = n % period;
  
  if (n_mod === 0) return 0;
  if (n_mod === 1) return 1;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n_mod; i++) {
    const temp = (a + b) % m;
    a = b;
    b = temp;
  }
  
  return b;
}

export function fibonacciPisanoPeriod(m: number): number {
  if (m <= 0) throw new Error('m must be positive');
  if (m === 1) return 1;
  
  let a = 0, b = 1, period = 0;
  
  do {
    const temp = (a + b) % m;
    a = b;
    b = temp;
    period++;
  } while (!(a === 0 && b === 1));
  
  return period;
}

export function lucas(n: number): number {
  if (n === 0) return 2;
  if (n === 1) return 1;
  
  let a = 2, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

export function lucasSequence(n: number): number[] {
  if (n < 0) throw new Error('n must be non-negative');
  const sequence: number[] = [2, 1];
  while (sequence.length < n) {
    const len = sequence.length;
    const a = sequence[len - 1];
    const b = sequence[len - 2];
    if (a === undefined || b === undefined) break;
    sequence.push(a + b);
  }
  return sequence.slice(0, n);
}

export function pell(n: number): number {
  if (n < 0) throw new Error('n must be non-negative');
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = 2 * b + a;
    a = b;
    b = temp;
  }
  return b;
}

export function pellSequence(n: number): number[] {
  if (n < 0) throw new Error('n must be non-negative');
  const sequence: number[] = [0, 1];
  while (sequence.length < n) {
    const len = sequence.length;
    const a = sequence[len - 1];
    const b = sequence[len - 2];
    if (a === undefined || b === undefined) break;
    sequence.push(2 * a + b);
  }
  return sequence.slice(0, n);
}

export function jacobsthal(n: number): number {
  if (n < 0) throw new Error('n must be non-negative');
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + 2 * b;
    a = b;
    b = temp;
  }
  return b;
}

export function jacobsthalSequence(n: number): number[] {
  if (n < 0) throw new Error('n must be non-negative');
  const sequence: number[] = [0, 1];
  while (sequence.length < n) {
    const len = sequence.length;
    const a = sequence[len - 2];
    const b = sequence[len - 1];
    if (a === undefined || b === undefined) break;
    sequence.push(a + 2 * b);
  }
  return sequence.slice(0, n);
}

export function triangular(n: number): number {
  if (n < 0) throw new Error('n must be non-negative');
  return (n * (n + 1)) / 2;
}

export function triangularSequence(n: number): number[] {
  return Array.from({ length: n }, (_, i) => triangular(i));
}

export function square(n: number): number {
  if (n < 0) throw new Error('n must be non-negative');
  return n * n;
}

export function squareSequence(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i * i);
}

export function pentagonal(n: number): number {
  if (n < 0) throw new Error('n must be non-negative');
  return (n * (3 * n - 1)) / 2;
}

export function pentagonalSequence(n: number): number[] {
  return Array.from({ length: n }, (_, i) => pentagonal(i + 1));
}

export function hexagonal(n: number): number {
  if (n < 0) throw new Error('n must be non-negative');
  return n * (2 * n - 1);
}

export function hexagonalSequence(n: number): number[] {
  return Array.from({ length: n }, (_, i) => hexagonal(i + 1));
}

export function heptagonal(n: number): number {
  if (n < 0) throw new Error('n must be non-negative');
  return (n * (5 * n - 3)) / 2;
}

export function octagonal(n: number): number {
  if (n < 0) throw new Error('n must be non-negative');
  return n * (3 * n - 2);
}

export function polygonal(sides: number, n: number): number {
  if (sides < 3) throw new Error('sides must be at least 3');
  if (n < 1) throw new Error('n must be positive');
  return ((sides - 2) * n * n - (sides - 4) * n) / 2;
}

export function arithmeticSequence(
  first: number,
  difference: number,
  n: number
): number[] {
  return Array.from({ length: n }, (_, i) => first + i * difference);
}

export function geometricSequence(
  first: number,
  ratio: number,
  n: number
): number[] {
  return Array.from({ length: n }, (_, i) => first * Math.pow(ratio, i));
}

export function harmonicSequence(n: number): number[] {
  return Array.from({ length: n }, (_, i) => 1 / (i + 1));
}

export function fibonacciWord(n: number): string {
  if (n < 0) throw new Error('n must be non-negative');
  if (n === 0) return '0';
  if (n === 1) return '01';
  
  let a = '0';
  let b = '01';
  for (let i = 2; i <= n; i++) {
    const temp = b + a;
    a = b;
    b = temp;
  }
  return b;
}

export function lookAndSay(n: number): string {
  if (n < 1) throw new Error('n must be positive');
  if (n === 1) return '1';
  
  let current = '1';
  for (let i = 2; i <= n; i++) {
    let next = '';
    let count = 1;
    
    for (let j = 1; j < current.length; j++) {
      if (current[j] === current[j - 1]) {
        count++;
      } else {
        next += count.toString() + current[j - 1];
        count = 1;
      }
    }
    next += count.toString() + current[current.length - 1];
    current = next;
  }
  
  return current;
}

export function collatzSequence(n: number): number[] {
  if (n <= 0) throw new Error('n must be positive');
  
  const sequence: number[] = [n];
  
  while (n !== 1) {
    if (n % 2 === 0) {
      n = n / 2;
    } else {
      n = 3 * n + 1;
    }
    sequence.push(n);
  }
  
  return sequence;
}

export function collatzLength(n: number): number {
  if (n <= 0) throw new Error('n must be positive');
  
  let count = 1;
  let current = n;
  
  while (current !== 1) {
    if (current % 2 === 0) {
      current = current / 2;
    } else {
      current = 3 * current + 1;
    }
    count++;
  }
  
  return count;
}

export function syracuse(n: number): number[] {
  return collatzSequence(n);
}

export function syracuseHeight(n: number): number {
  return collatzLength(n);
}

export function syracusePeak(n: number): number {
  const sequence = collatzSequence(n);
  return Math.max(...sequence);
}

export function partitions(n: number): number {
  if (n < 0) return 0;
  if (n === 0) return 1;
  
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  
  for (let k = 1; k <= n; k++) {
    for (let i = k; i <= n; i++) {
      dp[i] += dp[i - k];
    }
  }
  
  return dp[n];
}

export function partitionSequence(n: number): number[] {
  return Array.from({ length: n }, (_, i) => partitions(i));
}

export function mobiusSequence(n: number): number[] {
  return Array.from({ length: n }, (_, i) => mobius(i + 1));
}

// mobius function is in core.ts - using that version
export function mobiusFromCore(n: number): number {
  if (n <= 0) throw new Error('n must be positive');
  if (n === 1) return 1;
  
  const factors = pf(n);
  for (const exp of factors.values()) {
    if (exp > 1) return 0;
  }
  return factors.size % 2 === 0 ? 1 : -1;
}


