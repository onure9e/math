import { factorial, combination } from '../combinatorics';

export interface DistributionResult {
  pdf: (x: number) => number;
  cdf: (x: number) => number;
  mean: number;
  variance: number | undefined;
  stdDev: number | undefined;
  median?: number;
  mode?: number;
  sample: (rng: () => number) => number;
}

export function normalPDF(x: number, mean: number = 0, stdDev: number = 1): number {
  if (stdDev <= 0) throw new Error('Standard deviation must be positive');
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * stdDev * stdDev);
  return coefficient * Math.exp(exponent);
}

export function normalCDF(x: number, mean: number = 0, stdDev: number = 1): number {
  if (stdDev <= 0) throw new Error('Standard deviation must be positive');
  return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
}

export function normalPPF(p: number, mean: number = 0, stdDev: number = 1): number {
  if (stdDev <= 0) throw new Error('Standard deviation must be positive');
  if (p <= 0 || p >= 1) throw new Error('Probability must be between 0 and 1');
  return mean + stdDev * Math.sqrt(2) * inverseErf(2 * p - 1);
}

function erf(x: number): number {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
}

function inverseErf(x: number): number {
  const a = 0.147;
  const ln1x2 = Math.log(1 - x * x);
  const part1 = 2 / (Math.PI * a) + ln1x2 / 2;
  const part2 = ln1x2 / a;
  
  const term = Math.sqrt(Math.sqrt(part1 * part1 - part2) - part1);
  return x >= 0 ? term : -term;
}

export function normalDistribution(mean: number = 0, stdDev: number = 1): DistributionResult {
  if (stdDev <= 0) throw new Error('Standard deviation must be positive');
  
  return {
    pdf: (x: number) => normalPDF(x, mean, stdDev),
    cdf: (x: number) => normalCDF(x, mean, stdDev),
    mean,
    variance: stdDev * stdDev,
    stdDev,
    median: mean,
    mode: mean,
    sample: (rng: () => number) => {
      const u1 = rng();
      const u2 = rng();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return mean + stdDev * z;
    }
  };
}

export function standardNormalDistribution(): DistributionResult {
  return normalDistribution(0, 1);
}

export function logNormalPDF(x: number, mean: number = 0, stdDev: number = 1): number {
  if (x <= 0) return 0;
  if (stdDev <= 0) throw new Error('Standard deviation must be positive');
  const coefficient = 1 / (x * stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(Math.log(x) - mean, 2) / (2 * stdDev * stdDev);
  return coefficient * Math.exp(exponent);
}

export function logNormalCDF(x: number, mean: number = 0, stdDev: number = 1): number {
  if (x <= 0) return 0;
  if (stdDev <= 0) throw new Error('Standard deviation must be positive');
  return normalCDF(Math.log(x), mean, stdDev);
}

export function logNormalDistribution(mean: number = 0, stdDev: number = 1): DistributionResult {
  if (stdDev <= 0) throw new Error('Standard deviation must be positive');
  const expMean = Math.exp(mean + stdDev * stdDev / 2);
  
  return {
    pdf: (x: number) => logNormalPDF(x, mean, stdDev),
    cdf: (x: number) => logNormalCDF(x, mean, stdDev),
    mean: expMean,
    variance: (Math.exp(stdDev * stdDev) - 1) * Math.exp(2 * mean + stdDev * stdDev),
    stdDev: Math.sqrt((Math.exp(stdDev * stdDev) - 1) * Math.exp(2 * mean + stdDev * stdDev)),
    median: Math.exp(mean),
    sample: (rng: () => number) => {
      const z = Math.sqrt(-2 * Math.log(rng())) * Math.cos(2 * Math.PI * rng());
      return Math.exp(mean + stdDev * z);
    }
  };
}

export function exponentialPDF(x: number, lambda: number = 1): number {
  if (lambda <= 0) throw new Error('Rate parameter must be positive');
  if (x < 0) return 0;
  return lambda * Math.exp(-lambda * x);
}

export function exponentialCDF(x: number, lambda: number = 1): number {
  if (lambda <= 0) throw new Error('Rate parameter must be positive');
  if (x < 0) return 0;
  return 1 - Math.exp(-lambda * x);
}

export function exponentialDistribution(lambda: number = 1): DistributionResult {
  if (lambda <= 0) throw new Error('Rate parameter must be positive');
  
  return {
    pdf: (x: number) => exponentialPDF(x, lambda),
    cdf: (x: number) => exponentialCDF(x, lambda),
    mean: 1 / lambda,
    variance: 1 / (lambda * lambda),
    stdDev: 1 / lambda,
    median: Math.log(2) / lambda,
    mode: 0,
    sample: (rng: () => number) => -Math.log(rng()) / lambda
  };
}

export function poissonPMF(k: number, lambda: number): number {
  if (lambda <= 0) throw new Error('Rate parameter must be positive');
  if (k < 0 || !Number.isInteger(k)) return 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

export function poissonCDF(k: number, lambda: number): number {
  if (lambda <= 0) throw new Error('Rate parameter must be positive');
  if (k < 0) return 0;
  let sum = 0;
  for (let i = 0; i <= Math.floor(k); i++) {
    sum += poissonPMF(i, lambda);
  }
  return sum;
}

export function poissonDistribution(lambda: number): DistributionResult {
  if (lambda <= 0) throw new Error('Rate parameter must be positive');
  
  return {
    pdf: (k: number) => poissonPMF(k, lambda),
    cdf: (k: number) => poissonCDF(k, lambda),
    mean: lambda,
    variance: lambda,
    stdDev: Math.sqrt(lambda),
    mode: Math.floor(lambda),
    sample: (rng: () => number) => {
      const L = Math.exp(-lambda);
      let k = 0;
      let p = 1;
      do {
        k++;
        p *= rng();
      } while (p > L);
      return k - 1;
    }
  };
}

export function combinationPMF(k: number, n: number, p: number): number {
  if (p < 0 || p > 1) throw new Error('Probability must be between 0 and 1');
  if (k < 0 || k > n || !Number.isInteger(n)) return 0;
  return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

export function combinationCDF(k: number, n: number, p: number): number {
  if (p < 0 || p > 1) throw new Error('Probability must be between 0 and 1');
  if (k < 0) return 0;
  if (k >= n) return 1;
  let sum = 0;
  for (let i = 0; i <= Math.floor(k); i++) {
    sum += combinationPMF(i, n, p);
  }
  return sum;
}

export function combinationDistribution(n: number, p: number): DistributionResult {
  if (p < 0 || p > 1) throw new Error('Probability must be between 0 and 1');
  if (n <= 0 || !Number.isInteger(n)) throw new Error('n must be a positive integer');
  
  const mean = n * p;
  const variance = n * p * (1 - p);
  
  return {
    pdf: (k: number) => combinationPMF(k, n, p),
    cdf: (k: number) => combinationCDF(k, n, p),
    mean,
    variance,
    stdDev: Math.sqrt(variance),
    mode: Math.floor((n + 1) * p),
    sample: (rng: () => number) => {
      let successes = 0;
      for (let i = 0; i < n; i++) {
        if (rng() < p) successes++;
      }
      return successes;
    }
  };
}

export function geometricPMF(k: number, p: number): number {
  if (p <= 0 || p > 1) throw new Error('Probability must be between 0 and 1');
  if (k < 1 || !Number.isInteger(k)) return 0;
  return Math.pow(1 - p, k - 1) * p;
}

export function geometricCDF(k: number, p: number): number {
  if (p <= 0 || p > 1) throw new Error('Probability must be between 0 and 1');
  if (k < 1) return 0;
  return 1 - Math.pow(1 - p, k);
}

export function geometricDistribution(p: number): DistributionResult {
  if (p <= 0 || p > 1) throw new Error('Probability must be between 0 and 1');
  
  return {
    pdf: (k: number) => geometricPMF(k, p),
    cdf: (k: number) => geometricCDF(k, p),
    mean: 1 / p,
    variance: (1 - p) / (p * p),
    stdDev: Math.sqrt(1 - p) / p,
    mode: 1,
    sample: (rng: () => number) => Math.ceil(Math.log(rng()) / Math.log(1 - p))
  };
}

export function gammaPDF(x: number, shape: number, scale: number = 1): number {
  if (shape <= 0 || scale <= 0) throw new Error('Shape and scale must be positive');
  if (x <= 0) return 0;
  return (Math.pow(x, shape - 1) * Math.exp(-x / scale)) / (gamma(shape) * Math.pow(scale, shape));
}

export function gammaCDF(x: number, shape: number, scale: number = 1): number {
  if (shape <= 0 || scale <= 0) throw new Error('Shape and scale must be positive');
  if (x <= 0) return 0;
  return gammainc(shape, x / scale) / gamma(shape);
}

function gamma(z: number): number {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  z -= 1;
  const g = 7;
  const c = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  let x = c[0];
  if (x === undefined) return Number.NaN;
  for (let i = 1; i < g + 2; i++) {
    const ci = c[i];
    if (ci === undefined) continue;
    x += ci / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function gammainc(a: number, xVal: number): number {
  if (xVal < 0 || a <= 0) return 0;
  if (xVal < a + 1) {
    let sum = 1 / a;
    let term = 1 / a;
    for (let n = 1; n < 200; n++) {
      term *= xVal / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-10) break;
    }
    return sum * Math.exp(-xVal + a * Math.log(xVal) - logGamma(a));
  } else {
    let sum = 0;
    let term = 1 / xVal;
    for (let n = 0; n < 200; n++) {
      if (n === 0) {
        term = Math.exp(-xVal + a * Math.log(xVal) - logGamma(a)) / xVal;
      } else {
        term *= (a + n - 1) / xVal;
      }
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-10) break;
    }
    return 1 - sum;
  }
}

function logGamma(z: number): number {
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  z -= 1;
  const g = 7;
  const c = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  let x = c[0];
  if (x === undefined) return Number.NaN;
  for (let i = 1; i < g + 2; i++) {
    const ci = c[i];
    if (ci === undefined) continue;
    x += ci / (z + i);
  }
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

export function gammaDistribution(shape: number, scale: number = 1): DistributionResult {
  if (shape <= 0 || scale <= 0) throw new Error('Shape and scale must be positive');
  
  return {
    pdf: (x: number) => gammaPDF(x, shape, scale),
    cdf: (x: number) => gammaCDF(x, shape, scale),
    mean: shape * scale,
    variance: shape * scale * scale,
    stdDev: Math.sqrt(shape) * scale,
    mode: (shape > 1) ? (shape - 1) * scale : 0,
    sample: (rng: () => number) => {
      if (shape < 1) {
        return gammaSample(shape + 1, scale) * Math.pow(rng(), 1 / shape);
      }
      return gammaSample(shape, scale);
    }
  };
}

function gammaSample(shape: number, scale: number): number {
  if (shape < 1) return gammaSample(1 + shape, scale) * Math.pow(Math.random(), 1 / shape);
  
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  
  while (true) {
    let x, v;
    do {
      x = randn();
      v = 1 + c * x;
    } while (v <= 0);
    
    v = v * v * v;
    const u = Math.random();
    
    if (u < 1 - 0.0331 * x * x * x * x) return d * v * scale;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * scale;
  }
}

function randn(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function betaPDF(x: number, alpha: number, beta: number): number {
  if (alpha <= 0 || beta <= 0) throw new Error('Alpha and beta must be positive');
  if (x < 0 || x > 1) return 0;
  return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) / betaFunction(alpha, beta);
}

export function betaCDF(x: number, alpha: number, beta: number): number {
  if (alpha <= 0 || beta <= 0) throw new Error('Alpha and beta must be positive');
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return regularizedBeta(x, alpha, beta);
}

function betaFunction(a: number, b: number): number {
  return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
}

function regularizedBeta(x: number, a: number, b: number): number {
  if (x === 0) return 0;
  if (x === 1) return 1;
  
  const bt = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) +
    a * Math.log(x) + b * Math.log(1 - x)
  );
  
  if (x < (a + 1) / (a + b + 2)) {
    return bt * betacf(x, a, b) / a;
  } else {
    return 1 - bt * betacf(1 - x, b, a) / b;
  }
}

function betacf(x: number, a: number, b: number): number {
  const maxIterations = 200;

  let qab = a + b;
  let qap = a + 1;
  let qam = a - 1;
  let c = 1;
  let d = 1 - qab * x / qap;
  
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;
  
  for (let m = 1; m <= maxIterations; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;
    
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;
  }
  
  return h;
}

export function betaDistribution(alpha: number, beta: number): DistributionResult {
  if (alpha <= 0 || beta <= 0) throw new Error('Alpha and beta must be positive');
  
  const mean = alpha / (alpha + beta);
  const mode = (alpha > 1 && beta > 1) ? (alpha - 1) / (alpha + beta - 2) : Number.NaN;

  return {
    pdf: (x: number) => betaPDF(x, alpha, beta),
    cdf: (x: number) => betaCDF(x, alpha, beta),
    mean,
    variance: (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1)),
    stdDev: Math.sqrt((alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1))),
    mode,
    sample: (_rng: () => number) => {
      const x = gammaSample(alpha, 1);
      const y = gammaSample(beta, 1);
      return x / (x + y);
    }
  };
}

export function uniformPDF(x: number, a: number = 0, b: number = 1): number {
  if (b <= a) throw new Error('b must be greater than a');
  return (x >= a && x <= b) ? 1 / (b - a) : 0;
}

export function uniformCDF(x: number, a: number = 0, b: number = 1): number {
  if (b <= a) throw new Error('b must be greater than a');
  if (x < a) return 0;
  if (x > b) return 1;
  return (x - a) / (b - a);
}

export function uniformDistribution(a: number = 0, b: number = 1): DistributionResult {
  if (b <= a) throw new Error('b must be greater than a');
  
  return {
    pdf: (x: number) => uniformPDF(x, a, b),
    cdf: (x: number) => uniformCDF(x, a, b),
    mean: (a + b) / 2,
    variance: Math.pow(b - a, 2) / 12,
    stdDev: (b - a) / Math.sqrt(12),
    median: (a + b) / 2,
    sample: (_rng: () => number) => a + Math.random() * (b - a)
  };
}

export function weibullPDF(x: number, shape: number, scale: number = 1): number {
  if (shape <= 0 || scale <= 0) throw new Error('Shape and scale must be positive');
  if (x < 0) return 0;
  const z = x / scale;
  return (shape / scale) * Math.pow(z, shape - 1) * Math.exp(-Math.pow(z, shape));
}

export function weibullCDF(x: number, shape: number, scale: number = 1): number {
  if (shape <= 0 || scale <= 0) throw new Error('Shape and scale must be positive');
  if (x < 0) return 0;
  return 1 - Math.exp(-Math.pow(x / scale, shape));
}

export function weibullDistribution(shape: number, scale: number = 1): DistributionResult {
  if (shape <= 0 || scale <= 0) throw new Error('Shape and scale must be positive');
  
  return {
    pdf: (x: number) => weibullPDF(x, shape, scale),
    cdf: (x: number) => weibullCDF(x, shape, scale),
    mean: scale * gamma(1 + 1 / shape),
    variance: scale * scale * (gamma(1 + 2 / shape) - Math.pow(gamma(1 + 1 / shape), 2)),
    stdDev: scale * Math.sqrt(gamma(1 + 2 / shape) - Math.pow(gamma(1 + 1 / shape), 2)),
    mode: (shape > 1) ? scale * Math.pow((shape - 1) / shape, 1 / shape) : 0,
    sample: (rng: () => number) => scale * Math.pow(-Math.log(rng()), 1 / shape)
  };
}

export function chiSquarePDF(x: number, k: number): number {
  if (k <= 0 || !Number.isInteger(k)) throw new Error('Degrees of freedom must be positive integer');
  if (x <= 0) return 0;
  return Math.pow(x, k / 2 - 1) * Math.exp(-x / 2) / (Math.pow(2, k / 2) * gamma(k / 2));
}

export function chiSquareCDF(x: number, k: number): number {
  if (k <= 0 || !Number.isInteger(k)) throw new Error('Degrees of freedom must be positive integer');
  if (x <= 0) return 0;
  return gammainc(k / 2, x / 2) / gamma(k / 2);
}

export function chiSquareDistribution(k: number): DistributionResult {
  if (k <= 0 || !Number.isInteger(k)) throw new Error('Degrees of freedom must be positive integer');
  
  return {
    pdf: (x: number) => chiSquarePDF(x, k),
    cdf: (x: number) => chiSquareCDF(x, k),
    mean: k,
    variance: 2 * k,
    stdDev: Math.sqrt(2 * k),
    mode: Math.max(k - 2, 0),
    sample: (_rng: () => number) => {
      let sum = 0;
      for (let i = 0; i < k; i++) {
        const z = randn();
        sum += z * z;
      }
      return sum;
    }
  };
}

export function studentTPDF(x: number, k: number): number {
  if (k <= 0 || !Number.isInteger(k)) throw new Error('Degrees of freedom must be positive integer');
  return gamma((k + 1) / 2) / (Math.sqrt(k * Math.PI) * gamma(k / 2)) *
         Math.pow(1 + x * x / k, -(k + 1) / 2);
}

export function studentTCDF(x: number, k: number): number {
  if (k <= 0 || !Number.isInteger(k)) throw new Error('Degrees of freedom must be positive integer');
  const z = k / (k + x * x);
  return 0.5 * regularizedBeta(z / 2, k / 2, 0.5);
}

export function studentTDistribution(k: number): DistributionResult {
  if (k <= 0 || !Number.isInteger(k)) throw new Error('Degrees of freedom must be positive integer');
  
  return {
    pdf: (x: number) => studentTPDF(x, k),
    cdf: (x: number) => studentTCDF(x, k),
    mean: k > 1 ? 0 : Number.NaN,
    variance: k > 2 ? k / (k - 2) : Number.NaN,
    stdDev: k > 2 ? Math.sqrt(k / (k - 2)) : Number.NaN,
    mode: 0,
    sample: (_rng: () => number) => {
      const z = randn();
      const v = 2 * gammaSample(k / 2, 2);
      return z / Math.sqrt(v / k);
    }
  };
}

export function fPDF(x: number, d1: number, d2: number): number {
  if (d1 <= 0 || d2 <= 0 || !Number.isInteger(d1) || !Number.isInteger(d2)) {
    throw new Error('Degrees of freedom must be positive integers');
  }
  if (x <= 0) return 0;
  const num = Math.pow(d1 * x, d1) * Math.pow(d2, d2);
  const den = Math.pow(d1 * x + d2, d1 + d2);
  const betaVal = betaFunction(d1 / 2, d2 / 2);
  return Math.sqrt(num / den) / (x * betaVal);
}

export function fCDF(x: number, d1: number, d2: number): number {
  if (d1 <= 0 || d2 <= 0) throw new Error('Degrees of freedom must be positive');
  if (x <= 0) return 0;
  const z = (d1 * x) / (d1 * x + d2);
  return regularizedBeta(z / 2, d1 / 2, d2 / 2);
}

export function fDistribution(d1: number, d2: number): DistributionResult {
  if (d1 <= 0 || d2 <= 0) throw new Error('Degrees of freedom must be positive');
  
  return {
    pdf: (x: number) => fPDF(x, d1, d2),
    cdf: (x: number) => fCDF(x, d1, d2),
    mean: d2 > 2 ? d2 / (d2 - 2) : Number.NaN,
    variance: d2 > 4 ? 2 * d2 * d2 * (d1 + d2 - 2) / (d1 * (d2 - 2) ** 2 * (d2 - 4)) : Number.NaN,
    stdDev: Number.NaN,
    mode: d1 > 2 ? (d1 * (d2 - 2)) / (d2 * (d1 + 2)) : Number.NaN,
    sample: (_rng: () => number) => {
      const chi1 = chiSquareSample(d1);
      const chi2 = chiSquareSample(d2);
      return (chi1 / d1) / (chi2 / d2);
    }
  };
}

function chiSquareSample(k: number): number {
  let sum = 0;
  for (let i = 0; i < k; i++) {
    const z = randn();
    sum += z * z;
  }
  return sum;
}
