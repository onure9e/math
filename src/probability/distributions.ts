export interface Distribution {
  pmf?: (k: number) => number;
  pdf?: (x: number) => number;
  cdf: (x: number) => number;
  mean: number;
  variance: number | undefined;
  stdDev: number | undefined;
  sample: () => number;
}

export function bernoulli(p: number): Distribution {
  return {
    pmf: (k: number) => (k === 0 ? 1 - p : k === 1 ? p : 0),
    cdf: (x: number) => (x < 0 ? 0 : x < 1 ? 1 - p : 1),
    mean: p,
    variance: p * (1 - p),
    stdDev: Math.sqrt(p * (1 - p)),
    sample: () => (Math.random() < p ? 1 : 0)
  };
}

export function binomialDistribution(n: number, p: number): Distribution {
  return {
    pmf: (k: number) => {
      if (k < 0 || k > n || !Number.isInteger(k)) return 0;
      return factorial(n) / (factorial(k) * factorial(n - k)) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    },
    cdf: (x: number) => {
      const k = Math.floor(x);
      let sum = 0;
      for (let i = 0; i <= k; i++) {
        sum += factorial(n) / (factorial(i) * factorial(n - i)) * Math.pow(p, i) * Math.pow(1 - p, n - i);
      }
      return sum;
    },
    mean: n * p,
    variance: n * p * (1 - p),
    stdDev: Math.sqrt(n * p * (1 - p)),
    sample: () => {
      let successes = 0;
      for (let i = 0; i < n; i++) {
        if (Math.random() < p) successes++;
      }
      return successes;
    }
  };
}

export function poisson(lambda: number): Distribution {
  return {
    pmf: (k: number) => {
      if (k < 0 || !Number.isInteger(k)) return 0;
      return Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k);
    },
    cdf: (x: number) => {
      const k = Math.floor(x);
      let sum = 0;
      for (let i = 0; i <= k; i++) {
        sum += Math.pow(lambda, i) * Math.exp(-lambda) / factorial(i);
      }
      return sum;
    },
    mean: lambda,
    variance: lambda,
    stdDev: Math.sqrt(lambda),
    sample: () => {
      const L = Math.exp(-lambda);
      let k = 0;
      let p = 1;
      do {
        k++;
        p *= Math.random();
      } while (p > L);
      return k - 1;
    }
  };
}

export function geometric(p: number): Distribution {
  return {
    pmf: (k: number) => {
      if (k < 1 || !Number.isInteger(k)) return 0;
      return Math.pow(1 - p, k - 1) * p;
    },
    cdf: (x: number) => {
      if (x < 1) return 0;
      const k = Math.floor(x);
      return 1 - Math.pow(1 - p, k);
    },
    mean: 1 / p,
    variance: (1 - p) / (p * p),
    stdDev: Math.sqrt(1 - p) / p,
    sample: () => Math.ceil(Math.log(Math.random()) / Math.log(1 - p))
  };
}

export function negativeBinomial(r: number, p: number): Distribution {
  return {
    pmf: (k: number) => {
      if (k < r || !Number.isInteger(k)) return 0;
      return factorial(k - 1) / (factorial(r - 1) * factorial(k - r)) * Math.pow(p, r) * Math.pow(1 - p, k - r);
    },
    cdf: (x: number) => {
      const k = Math.floor(x);
      let sum = 0;
      for (let i = r; i <= k; i++) {
        sum += factorial(i - 1) / (factorial(r - 1) * factorial(i - r)) * Math.pow(p, r) * Math.pow(1 - p, i - r);
      }
      return sum;
    },
    mean: r / p,
    variance: r * (1 - p) / (p * p),
    stdDev: Math.sqrt(r * (1 - p)) / p,
    sample: () => {
      let successes = 0;
      let trials = 0;
      while (successes < r) {
        trials++;
        if (Math.random() < p) successes++;
      }
      return trials;
    }
  };
}

export function hypergeometric(N: number, K: number, n: number): Distribution {
  return {
    pmf: (k: number) => {
      if (k < Math.max(0, n + K - N) || k > Math.min(n, K)) return 0;
      return (comb(K, k) * comb(N - K, n - k)) / comb(N, n);
    },
    cdf: (x: number) => {
      const k = Math.floor(x);
      let sum = 0;
      for (let i = Math.max(0, n + K - N); i <= Math.min(k, n, K); i++) {
        sum += (comb(K, i) * comb(N - K, n - i)) / comb(N, n);
      }
      return sum;
    },
    mean: n * K / N,
    variance: n * K / N * (N - K) / N * (N - n) / (N - 1),
    stdDev: Math.sqrt(n * K * (N - K) * (N - n) / (N * N * (N - 1))),
    sample: () => {
      const population = Array(N).fill(0).map((_, i) => (i < K ? 1 : 0));
      shuffle(population);
      return population.slice(0, n).reduce((a: number, b: number) => a + b, 0);
    }
  };
}

export function uniformContinuous(a: number, b: number): Distribution {
  return {
    pdf: (x: number) => (x >= a && x <= b ? 1 / (b - a) : 0),
    cdf: (x: number) => (x < a ? 0 : x > b ? 1 : (x - a) / (b - a)),
    mean: (a + b) / 2,
    variance: Math.pow(b - a, 2) / 12,
    stdDev: (b - a) / Math.sqrt(12),
    sample: () => a + Math.random() * (b - a)
  };
}

export function uniformDiscrete(values: number[]): Distribution {
  const n = values.length;
  const meanVal = values.reduce((a, b) => a + b, 0) / n;
  const varianceVal = values.reduce((a, b) => a + Math.pow(b - meanVal, 2), 0) / n;
  
  const valueSet = new Set(values);
  const uniqueValues = Array.from(valueSet);

  
  const freq = new Map<number, number>();
  values.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
  
  return {
    pmf: (k: number) => freq.get(k) || 0,
    cdf: (x: number) => {
      const sorted = uniqueValues.sort((a, b) => a - b);
      let probSum = 0;
      for (const v of sorted) {
        if (v <= x) probSum += freq.get(v)! / values.length;
        else break;
      }
      return probSum;
    },
    mean: meanVal,
    variance: varianceVal,
    stdDev: Math.sqrt(varianceVal),
    sample: () => {
      const val = values[Math.floor(Math.random() * values.length)];
      if (val === undefined) throw new Error('Empty values array');
      return val;
    }
  };
}

export function exponential(lambda: number): Distribution {
  return {
    pdf: (x: number) => (x < 0 ? 0 : lambda * Math.exp(-lambda * x)),
    cdf: (x: number) => (x < 0 ? 0 : 1 - Math.exp(-lambda * x)),
    mean: 1 / lambda,
    variance: 1 / (lambda * lambda),
    stdDev: 1 / lambda,
    sample: () => -Math.log(Math.random()) / lambda
  };
}

export function normal(mean: number, stdDev: number): Distribution {
  return {
    pdf: (x: number) => {
      const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
      const exponent = -Math.pow(x - mean, 2) / (2 * stdDev * stdDev);
      return coefficient * Math.exp(exponent);
    },
    cdf: (x: number) => {
      return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
    },
    mean,
    variance: stdDev * stdDev,
    stdDev,
    sample: () => {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return mean + stdDev * z;
    }
  };
}

export function logNormal(mean: number, stdDev: number): Distribution {
  const mu = mean;
  const sigma = stdDev;
  const expMean = Math.exp(mu + sigma * sigma / 2);
  
  return {
    pdf: (x: number) => {
      if (x <= 0) return 0;
      return 1 / (x * sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-Math.pow(Math.log(x) - mu, 2) / (2 * sigma * sigma));
    },
    cdf: (x: number) => {
      if (x <= 0) return 0;
      return 0.5 * (1 + erf((Math.log(x) - mu) / (sigma * Math.sqrt(2))));
    },
    mean: expMean,
    variance: (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma),
    stdDev: Math.sqrt((Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma)),
    sample: () => {
      const z = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
      return Math.exp(mu + sigma * z);
    }
  };
}

export function gamma(shape: number, scale: number): Distribution {
  return {
    pdf: (x: number) => {
      if (x <= 0) return 0;
      return Math.pow(x, shape - 1) * Math.exp(-x / scale) / (gammaFunc(shape) * Math.pow(scale, shape));
    },
    cdf: (x: number) => {
      if (x <= 0) return 0;
      return gammainc(shape, x / scale) / gammaFunc(shape);
    },
    mean: shape * scale,
    variance: shape * scale * scale,
    stdDev: Math.sqrt(shape) * scale,
    sample: () => gammaSample(shape, scale)
  };
}

export function beta(alpha: number, beta: number): Distribution {
  return {
    pdf: (x: number) => {
      if (x < 0 || x > 1) return 0;
      return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) / betaFunc(alpha, beta);
    },
    cdf: (x: number) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      return regularizedBeta(x, alpha, beta);
    },
    mean: alpha / (alpha + beta),
    variance: (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1)),
    stdDev: Math.sqrt((alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1))),
    sample: () => {
      const x = gammaSample(alpha, 1);
      const y = gammaSample(beta, 1);
      return x / (x + y);
    }
  };
}

export function weibull(shape: number, scale: number): Distribution {
  return {
    pdf: (x: number) => {
      if (x < 0) return 0;
      return (shape / scale) * Math.pow(x / scale, shape - 1) * Math.exp(-Math.pow(x / scale, shape));
    },
    cdf: (x: number) => {
      if (x < 0) return 0;
      return 1 - Math.exp(-Math.pow(x / scale, shape));
    },
    mean: scale * gammaFunc(1 + 1 / shape),
    variance: scale * scale * (gammaFunc(1 + 2 / shape) - Math.pow(gammaFunc(1 + 1 / shape), 2)),
    stdDev: undefined,
    sample: () => scale * Math.pow(-Math.log(Math.random()), 1 / shape)
  };
}

export function chiSquare(df: number): Distribution {
  return {
    pdf: (x: number) => {
      if (x <= 0) return 0;
      return Math.pow(x, df / 2 - 1) * Math.exp(-x / 2) / (Math.pow(2, df / 2) * gammaFunc(df / 2));
    },
    cdf: (x: number) => {
      if (x <= 0) return 0;
      return gammainc(df / 2, x / 2) / gammaFunc(df / 2);
    },
    mean: df,
    variance: 2 * df,
    stdDev: Math.sqrt(2 * df),
    sample: () => {
      let sum = 0;
      for (let i = 0; i < df; i++) {
        const z = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
        sum += z * z;
      }
      return sum;
    }
  };
}

export function studentT(df: number): Distribution {
  return {
    pdf: (x: number) => {
      return gammaFunc((df + 1) / 2) / (Math.sqrt(df * Math.PI) * gammaFunc(df / 2)) * Math.pow(1 + x * x / df, -(df + 1) / 2);
    },
    cdf: (x: number) => {
      const z = df / (df + x * x);
      return 0.5 * regularizedBeta(z / 2, df / 2, 0.5);
    },
    mean: df > 1 ? 0 : Number.NaN,
    variance: df > 2 ? df / (df - 2) : Number.NaN,
    stdDev: df > 2 ? Math.sqrt(df / (df - 2)) : Number.NaN,
    sample: () => {
      const z = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
      const v = 2 * gammaSample(df / 2, 2);
      return z / Math.sqrt(v / df);
    }
  };
}

export function fDistribution(d1: number, d2: number): Distribution {
  return {
    pdf: (x: number) => {
      if (x <= 0) return 0;
      return Math.sqrt(Math.pow(d1 * x, d1) * Math.pow(d2, d2) / Math.pow(d1 * x + d2, d1 + d2)) / (x * betaFunc(d1 / 2, d2 / 2));
    },
    cdf: (x: number) => {
      if (x <= 0) return 0;
      const z = (d1 * x) / (d1 * x + d2);
      return regularizedBeta(z / 2, d1 / 2, d2 / 2);
    },
    mean: d2 > 2 ? d2 / (d2 - 2) : Number.NaN,
    variance: Number.NaN,
    stdDev: Number.NaN,
    sample: () => {
      const chi1 = chiSquareSample(d1);
      const chi2 = chiSquareSample(d2);
      return (chi1 / d1) / (chi2 / d2);
    }
  };
}

function chiSquareSample(df: number): number {
  let sum = 0;
  for (let i = 0; i < df; i++) {
    const z = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    sum += z * z;
  }
  return sum;
}

function gammaSample(shape: number, scale: number): number {
  if (shape < 1) {
    return gammaSample(1 + shape, scale) * Math.pow(Math.random(), 1 / shape);
  }
  
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  
  while (true) {
    let x, v;
    do {
      x = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
      v = 1 + c * x;
    } while (v <= 0);
    
    v = v * v * v;
    const u = Math.random();
    
    if (u < 1 - 0.0331 * x * x * x * x) return d * v * scale;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * scale;
  }
}

function gammaFunc(z: number): number {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gammaFunc(1 - z));
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

function betaFunc(a: number, b: number): number {
  return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
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
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(z + g + 0.5) - (z + g + 0.5) + Math.log(x);
}

function gammainc(a: number, xVal: number): number {
  if (xVal < 0 || a <= 0) return 0;
  if (xVal < a + 1) {
    let sum = 0;
    let term = 1 / a;
    sum = term;
    for (let n = 1; n < 200; n++) {
      term *= xVal / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-10) break;
    }
    return sum * Math.exp(-xVal + a * Math.log(xVal) - logGamma(a));
  } else {
    let sum = 0;
    let term = Math.exp(-xVal + a * Math.log(xVal) - logGamma(a)) / xVal;
    sum = term;
    for (let n = 1; n < 200; n++) {
      term *= (a + n - 1) / xVal;
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-10) break;
    }
    return 1 - sum;
  }
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
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
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

function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
}

import { factorial, combination as comb } from '../combinatorics';

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const itemI = array[i];
    const itemJ = array[j];
    if (itemI === undefined || itemJ === undefined) continue;
    array[i] = itemJ;
    array[j] = itemI;
  }
  return array;
}
