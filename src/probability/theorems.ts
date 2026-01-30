export function combinationCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;

  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = result * (n - k + i) / i;
  }
  return result;
}

export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new Error('Factorial requires non-negative integer');
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export function permutations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result *= (n - i);
  }
  return result;
}

export function combinationCoefficients(n: number, k: number): number {
  return combinationCoefficient(n, k);
}

export function combinationCoefficientsWithRepetition(n: number, k: number): number {
  if (n < 0 || k < 0) return 0;
  return combinationCoefficient(n + k - 1, k);
}

export function permutationsWithRepetition(n: number, k: number): number {
  if (n < 0 || k < 0) return 0;
  return Math.pow(n, k);
}

export function multinomial(n: number, ...ks: number[]): number {
  const sum = ks.reduce((a, b) => a + b, 0);
  if (sum !== n) throw new Error('Sum of k values must equal n');
  let result = factorial(n);
  for (const k of ks) {
    result /= factorial(k);
  }
  return result;
}

export function multinomialCoefficient(coeffs: number[]): number {
  const n = coeffs.reduce((a, b) => a + b, 0);
  let result = factorial(n);
  for (const c of coeffs) {
    result /= factorial(c);
  }
  return result;
}

export function catalan(n: number): number {
  if (n < 0) return 0;
  return combinationCoefficient(2 * n, n) / (n + 1);
}

export function bell(n: number): number {
  if (n < 0) return 0;
  if (n === 0) return 1;
  
  const bell = new Array(n + 1).fill(0);
  bell[0] = 1;
  
  for (let i = 1; i <= n; i++) {
    bell[i] = 0;
    for (let j = 0; j < i; j++) {
      bell[i] += combinationCoefficient(i - 1, j) * bell[j];
    }
  }
  
  return bell[n];
}

export function derangement(n: number): number {
  if (n < 0) return 0;
  if (n === 0) return 1;
  if (n === 1) return 0;
  
  const der = new Array(n + 1).fill(0);
  der[0] = 1;
  der[1] = 0;
  
  for (let i = 2; i <= n; i++) {
    der[i] = (i - 1) * (der[i - 1] + der[i - 2]);
  }
  
  return der[n];
}

export function subfactorial(n: number): number {
  return derangement(n);
}

export function fibonacci(n: number): number {
  if (n < 0) throw new Error('Fibonacci requires non-negative integer');
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

export function fibonacciIndex(n: number): number | null {
  if (n < 0) return null;
  if (n === 0) return 0;
  
  let a = 0, b = 1, index = 1;
  while (b < n) {
    const temp = a + b;
    a = b;
    b = temp;
    index++;
    if (index > 1000) return null;
  }
  return b === n ? index : null;
}

export function fibonacciSequence(n: number): number[] {
  if (n < 0) throw new Error('Sequence length must be non-negative');
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

export function lucas(n: number): number {
  if (n < 0) throw new Error('Lucas requires non-negative integer');
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

export function harmonicNumber(n: number): number {
  if (n < 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += 1 / i;
  }
  return sum;
}

export function doubleFactorial(n: number): number {
  if (n < 0) throw new Error('Double factorial requires non-negative integer');
  if (n <= 1) return 1;
  
  let result = 1;
  for (let i = n; i > 0; i -= 2) {
    result *= i;
  }
  return result;
}

export function primorial(n: number): number {
  if (n < 0) throw new Error('Primorial requires non-negative integer');
  if (n < 2) return 1;
  
  let result = 1;
  let count = 0;
  let num = 2;
  
  while (count < n) {
    if (isPrime(num)) {
      result *= num;
      count++;
    }
    num++;
  }
  
  return result;
}

export function superFactorial(n: number): number {
  if (n < 0) throw new Error('Superfactorial requires non-negative integer');
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= factorial(i);
  }
  return result;
}

export function hyperFactorial(n: number): number {
  if (n < 0) throw new Error('Hyperfactorial requires non-negative integer');
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= Math.pow(i, i);
  }
  return result;
}

export function combinationCoefficientExpansion(n: number, terms: number = 10): { coefficient: number; power: number }[] {
  const expansion: { coefficient: number; power: number }[] = [];
  
  for (let k = 0; k <= terms; k++) {
    const coeff = combinationCoefficient(n, k);
    if (coeff !== 0) {
      expansion.push({ coefficient: coeff, power: n - k });
    }
  }
  
  return expansion;
}

export function multinomialExpansion(coeffs: number[], variables: string[]): {
  term: string;
  coefficient: number;
  powers: number[];
}[] {
  const total = coeffs.reduce((a, b) => a + b, 0);
  const terms: { term: string; coefficient: number; powers: number[] }[] = [];
  
  function generate(index: number, remaining: number, currentPowers: number[]) {
    if (index === coeffs.length - 1) {
      currentPowers[index] = remaining;
      let term = '';
      let coeff = multinomialCoefficient(coeffs);
      
      for (let i = 0; i < variables.length; i++) {
        const power = currentPowers[i];
        const variable = variables[i];
        if (power === undefined || variable === undefined) continue;
        if (power > 0) {
          term += power === 1 ? variable : `${variable}^${power}`;
        }
      }
      
      terms.push({ term: term || '1', coefficient: coeff, powers: [...currentPowers] });
      return;
    }
    
    for (let i = 0; i <= remaining; i++) {
      currentPowers[index] = i;
      generate(index + 1, remaining - i, currentPowers);
    }
  }
  
  generate(0, total, new Array(coeffs.length).fill(0));
  
  return terms;
}

export function partition(n: number, max?: number): number[][] {
  if (n < 0) return [];
  if (n === 0) return [[]];
  
  max = max || n;
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
  
  generate(n, max!, []);
  return result;
}

export function partitionCount(n: number, max?: number): number {
  if (n < 0) return 0;
  if (n === 0) return 1;
  
  max = max || n;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  
  for (let k = 1; k <= max; k++) {
    for (let i = k; i <= n; i++) {
      dp[i] += dp[i - k];
    }
  }
  
  return dp[n];
}

export function integerPartition(n: number): number {
  return partitionCount(n);
}

export function stirlingSecondKind(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 && n === 0) return 1;
  if (k === 0 || n === 0) return 0;
  
  const dp = new Array(k + 1).fill(0);
  dp[0] = 1;
  
  for (let i = 1; i <= n; i++) {
    const newDp = new Array(k + 1).fill(0);
    for (let j = 1; j <= Math.min(i, k); j++) {
      newDp[j] = dp[j - 1] + j * dp[j];
    }
    dp.length = 0;
    dp.push(...newDp);
  }
  
  return dp[k];
}

export function stirlingFirstKind(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 && n === 0) return 1;
  if (k === 0 || n === 0) return 0;
  
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

export function ramsey(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  const result: number[][] = [];
  
  function generate(current: number[], start: number) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    
    for (let i = start; i <= n - (k - current.length) + 1; i++) {
      current.push(i);
      generate(current, i + 1);
      current.pop();
    }
  }
  
  generate([], 1);
  return result.length;
}

export function choose(n: number, k: number): number {
  return combinationCoefficient(n, k);
}

export function arrangement(n: number, k: number): number {
  return permutations(n, k);
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
    let sum = 0;
    for (let d = 1; d <= n; d++) {
      if (n % d === 0) {
        sum += phi(d) * Math.pow(k, n / d);
      }
    }
    return (necklaces(n, k) + (n * Math.pow(k, (n + 1) / 2)) / 2) / 2;
  } else {
    let sum = 0;
    for (let d = 1; d <= n; d++) {
      if (n % d === 0) {
        sum += phi(d) * Math.pow(k, n / d);
      }
    }
    const term1 = necklaces(n, k);
    const term2 = (n / 2) * (Math.pow(k, n / 2 + 1) + Math.pow(k, n / 2));
    return (term1 + term2 / 2) / 2;
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
  for (const count of multiset) {
    result /= factorial(count);
  }
  return result;
}

export function combinationCoefficientsWithConstraints(
  n: number,
  k: number,
  constraints: { min?: number; max?: number }[]
): number {
  if (constraints.length !== n) throw new Error('Constraints must match n');
  
  const minSum = constraints.reduce((sum, c) => sum + (c.min || 0), 0);
  const maxSum = constraints.reduce((sum, c) => sum + (c.max || k), 0);
  
  if (k < minSum || k > maxSum) return 0;
  
  let count = 0;

  function generate(index: number, remaining: number) {
    if (index === n) {
      if (remaining === 0) count++;
      return;
    }

    const constraint = constraints[index];
    if (constraint === undefined) return;
    const min = constraint.min || 0;
    const max = Math.min(constraint.max || k, remaining);
    
    for (let i = min; i <= max; i++) {
      generate(index + 1, remaining - i);
    }
  }
  
  generate(0, k);
  return count;
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
