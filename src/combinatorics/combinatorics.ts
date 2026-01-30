import { DomainError } from '../types';
import { MAX_FACTORIAL_INPUT } from '../constants';

// LRU Cache implementation with size limit to prevent memory leaks
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Memoization cache for factorial with LRU eviction (max 1000 entries)
const factorialCache = new LRUCache<number, number>(1000);

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new DomainError('Factorial requires non-negative integer');
  }
  if (n > MAX_FACTORIAL_INPUT) return Infinity;
  
  // Check cache
  const cached = factorialCache.get(n);
  if (cached !== undefined) {
    return cached;
  }
  
  // Compute from highest cached value
  let result = 1;
  let start = 2;
  
  // Find the highest cached value less than n
  for (let i = n - 1; i >= 2; i--) {
    if (factorialCache.has(i)) {
      const cachedVal = factorialCache.get(i);
      if (cachedVal !== undefined) {
        result = cachedVal;
        start = i + 1;
        break;
      }
    }
  }
  
  // Calculate and cache intermediate values
  for (let i = start; i <= n; i++) {
    result *= i;
    factorialCache.set(i, result);
  }
  
  return result;
}

export function factorialDouble(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new DomainError('Double factorial requires non-negative integer');
  }
  if (n <= 1) return 1;
  let result = 1;
  for (let i = n; i > 0; i -= 2) result *= i;
  return result;
}

export function factorialSub(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new DomainError('Subfactorial requires non-negative integer');
  }
  return Math.round(factorial(n) / Math.E);
}

export function permutation(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i++) result *= (n - i);
  return result;
}

export function permutationWithRepetition(n: number, k: number): number {
  if (n <= 0 || k < 0) return 0;
  return Math.pow(n, k);
}

// Memoization cache for combination with LRU eviction (max 5000 entries)
const combinationCache = new LRUCache<string, number>(5000);

export function combination(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  
  const key = `${n},${k}`;
  const cached = combinationCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  
  if (k > n / 2) k = n - k;
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = result * (n - k + i) / i;
  }
  
  combinationCache.set(key, result);
  return result;
}

export function combinationWithRepetition(n: number, k: number): number {
  if (n < 0 || k < 0) return 0;
  return combination(n + k - 1, k);
}

export function multinomial(n: number, ...ks: number[]): number {
  if (ks.reduce((a, b) => a + b, 0) !== n) {
    throw new DomainError('Sum of k values must equal n');
  }
  let result = factorial(n);
  for (const k of ks) result /= factorial(k);
  return result;
}

export function derangement(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new DomainError('Derangement requires non-negative integer');
  }
  if (n === 0) return 1;
  if (n === 1) return 0;
  
  let prev = 1;
  let curr = 0;
  for (let i = 2; i <= n; i++) {
    const next = (i - 1) * (prev + curr);
    prev = curr;
    curr = next;
  }
  return curr;
}

export function catalan(n: number): number {
  if (n < 0) throw new DomainError('Catalan number requires non-negative integer');
  return combination(2 * n, n) / (n + 1);
}

export function bell(n: number): number {
  if (n < 0) throw new DomainError('Bell number requires non-negative integer');
  if (n === 0) return 1;
  
  const bell = new Array(n + 1).fill(0);
  bell[0] = 1;
  
  for (let i = 1; i <= n; i++) {
    bell[i] = 0;
    for (let j = 0; j < i; j++) {
      bell[i] += combination(i - 1, j) * bell[j];
    }
  }
  
  return bell[n];
}

export function stirlingSecondKind(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 && n === 0) return 1;
  if (k === 0 || n === 0) return 0;
  
  return (1 / factorial(k)) * sum(
    ...Array.from({ length: k }, (_, i) => {
      return combination(k, i) * Math.pow(k - i, n) * (i % 2 === 0 ? 1 : -1);
    })
  );
}

export function stirlingFirstKind(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (n === 0 && k === 0) return 1;
  if (n === 0 || k === 0) return 0;
  
  const dp = new Array(k + 1).fill(0);
  dp[0] = 1;
  
  for (let i = 1; i <= n; i++) {
    const newDp = new Array(k + 1).fill(0);
    for (let j = 1; j <= Math.min(i, k); j++) {
      newDp[j] = dp[j - 1] + (i - 1) * dp[j];
    }
    dp.length = 0;
    dp.push(...newDp);
  }
  
  return dp[k];
}

export function eulerian(n: number, k: number): number {
  if (k < 0 || k > n - 1) return 0;
  if (n === 1 && k === 0) return 1;
  
  const dp = new Array(n).fill(0);
  dp[0] = 1;
  
  for (let i = 2; i <= n; i++) {
    const newDp = new Array(n).fill(0);
    for (let j = 0; j < i; j++) {
      for (let m = 0; m < j; m++) {
        newDp[j] += dp[m];
      }
    }
    dp.length = 0;
    dp.push(...newDp);
  }
  
  return dp[k];
}

export function partition(n: number): number {
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

export function partitions(n: number, max?: number): number[][] {
  if (n < 0) return [];
  
  const result: number[][] = [];
  
  function generate(remaining: number, maxPart: number, current: number[]) {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }
    
    for (let i = Math.min(maxPart, remaining); i >= 1; i--) {
      current.push(i);
      generate(remaining - i, i, current);
      current.pop();
    }
  }
  
  generate(n, max || n, []);
  return result;
}

export function integerPartition(n: number): number {
  return partition(n);
}

export function compositions(n: number, k?: number): number[][] {
  if (n < 1) return [];
  
  const result: number[][] = [];
  const parts = k || n;
  
  function generate(remaining: number, partsLeft: number, current: number[]) {
    if (partsLeft === 1) {
      result.push([...current, remaining]);
      return;
    }
    
    for (let i = 1; i <= remaining - partsLeft + 1; i++) {
      current.push(i);
      generate(remaining - i, partsLeft - 1, current);
      current.pop();
    }
  }
  
  generate(n, parts, []);
  return result;
}

export function compositionsCount(n: number, k: number): number {
  if (k < 1 || n < k) return 0;
  return combination(n - 1, k - 1);
}

export function circularPermutations(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return factorial(n - 1);
}

export function necklaces(n: number, k: number): number {
  if (n <= 0 || k <= 0) return 0;
  let sum = 0;
  for (let d = 1; d <= n; d++) {
    if (n % d === 0) {
      sum += phi(d) * Math.pow(k, n / d);
    }
  }
  return sum / n;
}

export function bracelets(n: number, k: number): number {
  if (n <= 0 || k <= 0) return 0;
  if (n % 2 === 1) {
    return (necklaces(n, k) + n * Math.pow(k, (n + 1) / 2) / 2) / 2;
  } else {
    return (necklaces(n, k) + (n / 2) * (Math.pow(k, n / 2) + Math.pow(k, n / 2 + 1)) / 2) / 2;
  }
}

export function grayCode(n: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < 1 << n; i++) {
    const gray = i ^ (i >> 1);
    result.push(gray.toString(2).padStart(n, '0'));
  }
  return result;
}

export function permutationsOfMultiset(multiset: number[]): number {
  const total = multiset.reduce((a, b) => a + b, 0);
  let result = factorial(total);
  for (const count of multiset) result /= factorial(count);
  return result;
}

function phi(n: number): number {
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

function sum(...values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
