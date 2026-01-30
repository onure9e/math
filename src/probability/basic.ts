import { factorial, combination } from '../combinatorics';

export function probability(event: () => boolean): number {
  const trials = 10000;
  let successes = 0;
  for (let i = 0; i < trials; i++) {
    if (event()) successes++;
  }
  return successes / trials;
}

export function jointProbability(...events: (() => boolean)[]): number {
  const trials = 10000;
  let successes = 0;
  for (let i = 0; i < trials; i++) {
    if (events.every(e => e())) successes++;
  }
  return successes / trials;
}

export function conditionalProbability(
  eventA: () => boolean,
  eventB: () => boolean
): number {
  const trials = 10000;
  let both = 0;
  let bOccurrences = 0;
  for (let i = 0; i < trials; i++) {
    const a = eventA();
    const b = eventB();
    if (b) {
      bOccurrences++;
      if (a) both++;
    }
  }
  if (bOccurrences === 0) {
    throw new Error('Event B never occurred in trials');
  }
  return both / bOccurrences;
}

export function bayesTheorem(
  pA: number,
  pBGivenA: number,
  _pBGivenNotA: number,
  pB: number
): number {
  return (pBGivenA * pA) / pB;
}

export function totalProbability(
  pAGivenB1: number,
  pB1: number,
  pAGivenB2: number,
  pB2: number
): number {
  return pAGivenB1 * pB1 + pAGivenB2 * pB2;
}

export function expectedValue(values: number[], probabilities: number[]): number {
  if (values.length !== probabilities.length) {
    throw new Error('Values and probabilities must have same length');
  }
  return values.reduce((acc, v, i) => {
    const p = probabilities[i];
    if (p === undefined) {
      throw new Error('Invalid probabilities array');
    }
    return acc + v * p;
  }, 0);
}

export function variance(values: number[], probabilities: number[]): number {
  const mean = expectedValue(values, probabilities);
  const squaredValues = values.map(v => Math.pow(v - mean, 2));
  return expectedValue(squaredValues, probabilities);
}

export function entropy(probabilities: number[]): number {
  return probabilities.reduce((acc, p) => {
    if (p <= 0) return acc;
    return acc - p * Math.log2(p);
  }, 0);
}

export function crossEntropy(p: number[], q: number[]): number {
  if (p.length !== q.length) throw new Error('Arrays must have same length');
  let h = 0;
  for (let i = 0; i < p.length; i++) {
    const pI = p[i];
    const qI = q[i];
    if (pI === undefined || qI === undefined) {
      throw new Error('Invalid array access');
    }
    if (pI > 0) {
      h -= pI * Math.log2(qI);
    }
  }
  return h;
}

export function klDivergence(p: number[], q: number[]): number {
  if (p.length !== q.length) throw new Error('Arrays must have same length');
  let kl = 0;
  for (let i = 0; i < p.length; i++) {
    const pI = p[i];
    const qI = q[i];
    if (pI === undefined || qI === undefined) {
      throw new Error('Invalid array access');
    }
    if (pI > 0 && qI > 0) {
      kl += pI * Math.log2(pI / qI);
    }
  }
  return kl;
}

export function mutualInformation(
  pXY: number[][],
  pX: number[],
  pY: number[]
): number {
  let mi = 0;
  for (let i = 0; i < pXY.length; i++) {
    const pXYI = pXY[i];
    const pXI = pX[i];
    if (pXYI === undefined || pXI === undefined) {
      throw new Error('Invalid array access');
    }
    for (let j = 0; j < pXYI.length; j++) {
      const pXYIJ = pXYI[j];
      const pYJ = pY[j];
      if (pXYIJ === undefined || pYJ === undefined) {
        throw new Error('Invalid array access');
      }
      if (pXYIJ > 0 && pXI > 0 && pYJ > 0) {
        mi += pXYIJ * Math.log2(pXYIJ / (pXI * pYJ));
      }
    }
  }
  return mi;
}

export function odds(p: number): number {
  if (p <= 0 || p >= 1) throw new Error('Probability must be between 0 and 1');
  return p / (1 - p);
}

export function oddsToProbability(odds: number): number {
  if (odds < 0) throw new Error('Odds cannot be negative');
  return odds / (1 + odds);
}

export function probabilityToLogOdds(p: number): number {
  if (p <= 0 || p >= 1) throw new Error('Probability must be between 0 and 1');
  return Math.log(p / (1 - p));
}

export function logOddsToProbability(logOdds: number): number {
  return 1 / (1 + Math.exp(-logOdds));
}

export function addProbabilities(p: number, q: number): number {
  return p + q - p * q;
}

export function subtractProbabilities(p: number, q: number): number {
  return p * (1 - q);
}

export function multiplyProbabilities(p: number, q: number): number {
  return p * q;
}

export function divideProbabilities(p: number, q: number): number {
  if (q <= 0) throw new Error('Denominator probability must be positive');
  return p / q;
}

export function complement(p: number): number {
  return 1 - p;
}

export function combinationProbability(k: number, n: number, p: number): number {
  if (k < 0 || k > n) return 0;
  if (p < 0 || p > 1) throw new Error('Probability must be between 0 and 1');
  return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

export function poissonProbability(k: number, lambda: number): number {
  if (k < 0 || !Number.isInteger(k)) return 0;
  if (lambda <= 0) throw new Error('Lambda must be positive');
  return Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k);
}

export function geometricProbability(k: number, p: number): number {
  if (k < 1 || !Number.isInteger(k)) return 0;
  if (p <= 0 || p > 1) throw new Error('Probability must be between 0 and 1');
  return Math.pow(1 - p, k - 1) * p;
}

export function hypergeometricProbability(
  k: number,
  N: number,
  K: number,
  n: number
): number {
  if (k < Math.max(0, n + K - N) || k > Math.min(n, K)) return 0;
  return (combination(K, k) * combination(N - K, n - k)) / combination(N, n);
}

export function negativeBinomialProbability(k: number, r: number, p: number): number {
  if (k < r || !Number.isInteger(k)) return 0;
  if (p <= 0 || p > 1) throw new Error('Probability must be between 0 and 1');
  return combination(k - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, k - r);
}

export function multinomialProbability(
  outcomes: number[],
  probabilities: number[]
): number {
  const n = outcomes.reduce((a, b) => a + b, 0);
  let prob = factorial(n);
  for (const count of outcomes) {
    prob /= factorial(count);
  }
  for (let i = 0; i < outcomes.length; i++) {
    const p = probabilities[i];
    const o = outcomes[i];
    if (p === undefined || o === undefined) {
      throw new Error('Invalid array access');
    }
    prob *= Math.pow(p, o);
  }
  return prob;
}

export function lawOfLargeNumbers(
  trials: number,
  generator: () => number
): { mean: number; variance: number } {
  const samples: number[] = [];
  for (let i = 0; i < trials; i++) {
    samples.push(generator());
  }
  const meanVal = samples.reduce((a, b) => a + b, 0) / trials;
  const varianceVal = samples.reduce((a, b) => a + Math.pow(b - meanVal, 2), 0) / (trials - 1);
  return { mean: meanVal, variance: varianceVal };
}

export function centralLimitTheorem(
  samples: number[][],
  sampleSize: number
): { mean: number; variance: number; distribution: number[] } {
  const means: number[] = [];
  for (const sample of samples) {
    if (sample.length >= sampleSize) {
      const subset = sample.slice(0, sampleSize);
      means.push(subset.reduce((a, b) => a + b, 0) / sampleSize);
    }
  }
  const meanVal = means.reduce((a, b) => a + b, 0) / means.length;
  const varianceVal = means.reduce((a, b) => a + Math.pow(b - meanVal, 2), 0) / (means.length - 1);
  return { mean: meanVal, variance: varianceVal, distribution: means };
}

export function monteCarlo(
  func: () => boolean,
  trials: number
): { estimate: number; error: number } {
  let successes = 0;
  for (let i = 0; i < trials; i++) {
    if (func()) successes++;
  }
  const estimate = successes / trials;
  const error = 1.96 * Math.sqrt(estimate * (1 - estimate) / trials);
  return { estimate, error };
}

export function importanceSampling(
  targetDensity: (x: number) => number,
  _proposalDensity: (x: number) => number,
  proposalSample: () => number,
  importanceWeight: (x: number) => number,
  trials: number
): number {
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < trials; i++) {
    const x = proposalSample();
    const weight = importanceWeight(x);
    numerator += weight * targetDensity(x);
    denominator += weight;
  }
  
  return denominator > 0 ? numerator / denominator : 0;
}

export function rejectionSampling(
  targetDensity: (x: number) => number,
  proposalDensity: (x: number) => number,
  proposalSample: () => number,
  maxRatio: number,
  trials: number,
  options?: { maxIterations?: number; timeoutMs?: number }
): { samples: number[]; completed: boolean; iterations: number } {
  const maxIterations = options?.maxIterations ?? trials * 1000;
  const startTime = Date.now();
  const timeoutMs = options?.timeoutMs ?? 30000;
  
  const samples: number[] = [];
  let iterations = 0;
  
  while (samples.length < trials && iterations < maxIterations) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Rejection sampling timeout after ${timeoutMs}ms`);
    }
    
    iterations++;
    const x = proposalSample();
    const u = Math.random() * maxRatio * proposalDensity(x);
    if (u <= targetDensity(x)) {
      samples.push(x);
    }
  }
  
  if (samples.length < trials) {
    console.warn(`Rejection sampling only collected ${samples.length}/${trials} samples after ${iterations} iterations`);
  }
  
  return { samples, completed: samples.length === trials, iterations };
}

export function markovChain(
  transitionMatrix: number[][],
  initialState: number[],
  steps: number
): number[] {
  let state = [...initialState];
  for (let i = 0; i < steps; i++) {
    const newState = new Array(state.length).fill(0);
    for (let j = 0; j < state.length; j++) {
      const transJ = transitionMatrix[j];
      const stateJ = state[j];
      if (transJ === undefined || stateJ === undefined) {
        throw new Error('Invalid array access');
      }
      for (let k = 0; k < transJ.length; k++) {
        const transJK = transJ[k];
        if (transJK === undefined) {
          throw new Error('Invalid array access');
        }
        newState[k] += stateJ * transJK;
      }
    }
    state = newState;
  }
  return state;
}

export function stationaryDistribution(
  transitionMatrix: number[][]
): number[] | null {
  const n = transitionMatrix.length;
  const P = transitionMatrix;
  
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      const pJ = P[j];
      if (pJ === undefined) {
        throw new Error('Invalid transition matrix');
      }
      const pJI = pJ[i];
      if (pJI === undefined) {
        throw new Error('Invalid transition matrix');
      }
      sum += pJI;
    }
    if (Math.abs(sum - 1) > 1e-10) return null;
  }
  
  const A: number[][] = [];
  for (let i = 0; i < n - 1; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      const pJ = P[j];
      if (pJ === undefined) {
        throw new Error('Invalid transition matrix');
      }
      const pJIPlus1 = pJ[i + 1];
      if (pJIPlus1 === undefined) {
        throw new Error('Invalid transition matrix');
      }
      row.push(pJIPlus1 - (j === i + 1 ? 1 : 0));
    }
    A.push(row);
  }
  
  const lastCol = new Array(n - 1).fill(1);
  A.push(lastCol);
  
  const b = new Array(n - 1).fill(0);
  b.push(1);
  
  const x = gaussianElimination(A, b);
  
  return x;
}

function gaussianElimination(a: number[][], b: number[]): number[] {
  const n = b.length;
  const aug = a.map((row, i) => [...row, b[i]]);
  
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      const augK = aug[k];
      const augMaxRow = aug[maxRow];
      if (augK === undefined || augMaxRow === undefined) {
        throw new Error('Invalid matrix');
      }
      const augKI = augK[i];
      const augMaxRowI = augMaxRow[i];
      if (augKI === undefined || augMaxRowI === undefined) {
        throw new Error('Invalid matrix');
      }
      if (Math.abs(augKI) > Math.abs(augMaxRowI)) {
        maxRow = k;
      }
    }
    const augRowI = aug[i];
    const augRowMaxRow = aug[maxRow];
    if (augRowI === undefined || augRowMaxRow === undefined) {
      throw new Error('Invalid matrix');
    }
    [aug[i], aug[maxRow]] = [augRowMaxRow, augRowI];
    
    const augI = aug[i];
    if (augI === undefined) {
      throw new Error('Invalid matrix');
    }
    const augII = augI[i];
    if (augII === undefined) {
      throw new Error('Invalid matrix');
    }
    
    for (let k = i + 1; k < n; k++) {
      const augK = aug[k];
      if (augK === undefined) {
        throw new Error('Invalid matrix');
      }
      const augKI = augK[i];
      if (augKI === undefined) {
        throw new Error('Invalid matrix');
      }
      const factor = augKI / augII;
      for (let j = i; j <= n; j++) {
        const augKJ = augK[j];
        const augIJ = augI[j];
        if (augKJ === undefined || augIJ === undefined) {
          throw new Error('Invalid matrix');
        }
        augK[j] = augKJ - factor * augIJ;
      }
    }
  }
  
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const augI = aug[i];
    if (augI === undefined) {
      throw new Error('Invalid matrix');
    }
    let sum = augI[n];
    if (sum === undefined) {
      throw new Error('Invalid matrix');
    }
    for (let j = i + 1; j < n; j++) {
      const xJ = x[j];
      const augIJ = augI[j];
      if (augIJ === undefined) {
        throw new Error('Invalid matrix');
      }
      sum -= augIJ * xJ;
    }
    const augII = augI[i];
    if (augII === undefined) {
      throw new Error('Invalid matrix');
    }
    x[i] = sum / augII;
  }
  
  return x;
}
