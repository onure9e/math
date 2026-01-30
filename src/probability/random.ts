export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomNormal(mean: number = 0, stdDev: number = 1): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + stdDev * z;
}

export function randomUniform(min: number = 0, max: number = 1): number {
  return Math.random() * (max - min) + min;
}

export function randomExponential(lambda: number = 1): number {
  return -Math.log(Math.random()) / lambda;
}

export function randomPoisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

export function randomBernoulli(p: number): number {
  return Math.random() < p ? 1 : 0;
}

export function randomBinomial(n: number, p: number): number {
  let successes = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < p) successes++;
  }
  return successes;
}

export function randomGeometric(p: number): number {
  return Math.ceil(Math.log(Math.random()) / Math.log(1 - p));
}

export function randomLogNormal(mean: number = 0, stdDev: number = 1): number {
  const z = randomNormal(0, 1);
  return Math.exp(mean + stdDev * z);
}

export function randomChiSquare(df: number): number {
  let sum = 0;
  for (let i = 0; i < df; i++) {
    const z = randomNormal(0, 1);
    sum += z * z;
  }
  return sum;
}

export function randomStudentT(df: number): number {
  const z = randomNormal(0, 1);
  const v = randomChiSquare(df);
  return z / Math.sqrt(v / df);
}

export function randomBeta(alpha: number, beta: number): number {
  const x = randomGamma(alpha, 1);
  const y = randomGamma(beta, 1);
  return x / (x + y);
}

export function randomGamma(shape: number, scale: number = 1): number {
  if (shape < 1) {
    return randomGamma(1 + shape, scale) * Math.pow(Math.random(), 1 / shape);
  }
  
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  
  while (true) {
    let x, v;
    do {
      x = randomNormal(0, 1);
      v = 1 + c * x;
    } while (v <= 0);
    
    v = v * v * v;
    const u = Math.random();
    
    if (u < 1 - 0.0331 * x * x * x * x) return d * v * scale;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * scale;
  }
}

export function randomWeibull(shape: number, scale: number = 1): number {
  return scale * Math.pow(-Math.log(Math.random()), 1 / shape);
}

export function randomTriangular(a: number, b: number, c: number): number {
  const u = Math.random();
  const f = (c - a) / (b - a);
  
  if (u < f) {
    return a + Math.sqrt(u * (b - a) * (c - a));
  } else {
    return b - Math.sqrt((1 - u) * (b - a) * (b - c));
  }
}

export function randomPareto(alpha: number, scale: number = 1): number {
  return scale / Math.pow(Math.random(), 1 / alpha);
}

export function randomCauchy(location: number = 0, scale: number = 1): number {
  const u = Math.random();
  return location + scale * Math.tan(Math.PI * (u - 0.5));
}

export function randomVonMises(mu: number = 0, kappa: number = 1): number {
  if (kappa < 1e-10) {
    return 2 * Math.PI * Math.random();
  }
  
  let a, b, c, f;
  do {
    a = (Math.random() + Math.random()) / 2 - 0.5;
    b = (Math.random() + Math.random()) / 2 - 0.5;
    c = Math.sqrt(a * a + b * b);
  } while (c > 0.5 || c === 0);
  
  f = (1 + Math.random()) * kappa * c / a;
  
  if (Math.log(f / Math.sqrt(a * a + b * b)) + kappa - kappa * Math.cos(a / c) < 0) {
    return mu + 2 * Math.PI * Math.random();
  }
  
  return mu + Math.atan2(b, a);
}

export function randomDiscrete(values: number[], probabilities: number[]): number {
  const r = Math.random();
  let cumulative = 0;

  for (let i = 0; i < values.length; i++) {
    const prob = probabilities[i];
    const val = values[i];
    if (prob === undefined || val === undefined) continue;
    cumulative += prob;
    if (r < cumulative) return val;
  }

  const lastVal = values[values.length - 1];
  if (lastVal === undefined) throw new Error('Invalid values array');
  return lastVal;
}

export function randomChoice<T>(array: T[]): T {
  const item = array[Math.floor(Math.random() * array.length)];
  if (item === undefined) throw new Error('Array is empty');
  return item;
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const itemI = result[i];
    const itemJ = result[j];
    if (itemI === undefined || itemJ === undefined) continue;
    result[i] = itemJ;
    result[j] = itemI;
  }
  return result;
}

export function sample<T>(population: T[], size: number, replace: boolean = false): T[] {
  if (replace) {
    const result: T[] = [];
    for (let i = 0; i < size; i++) {
      const item = population[Math.floor(Math.random() * population.length)];
      if (item !== undefined) result.push(item);
    }
    return result;
  } else {
    return shuffle(population).slice(0, size);
  }
}

export function randomPermutation(n: number): number[] {
  const permutation = Array.from({ length: n }, (_, i) => i);
  return shuffle(permutation);
}

export function randomMatrix(rows: number, cols: number, min: number = 0, max: number = 1): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(randomFloat(min, max));
    }
    matrix.push(row);
  }
  return matrix;
}

export function randomVector(size: number, min: number = 0, max: number = 1): number[] {
  const vector: number[] = [];
  for (let i = 0; i < size; i++) {
    vector.push(randomFloat(min, max));
  }
  return vector;
}

export function seededRandom(seed: number): () => number {
  let s = seed;
  return function() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function randomWithSeed(seed: number, min: number, max: number): number {
  const rng = seededRandom(seed);
  return rng() * (max - min) + min;
}

export function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function randomColor(): { r: number; g: number; b: number; hex: string } {
  const r = randomInt(0, 255);
  const g = randomInt(0, 255);
  const b = randomInt(0, 255);
  const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  return { r, g, b, hex };
}

export function randomGaussianMixture(
  means: number[],
  stdDevs: number[],
  weights: number[]
): number {
  const r = Math.random();
  let cumulative = 0;
  let selected = 0;

  for (let i = 0; i < weights.length; i++) {
    const weight = weights[i];
    if (weight === undefined) continue;
    cumulative += weight;
    if (r < cumulative) {
      selected = i;
      break;
    }
  }

  const mean = means[selected];
  const stdDev = stdDevs[selected];
  if (mean === undefined || stdDev === undefined) throw new Error('Invalid parameters');
  return randomNormal(mean, stdDev);
}

export function lcg(seed: number): () => number {
  let state = seed;
  const a = 1103515245;
  const c = 12345;
  const m = Math.pow(2, 31);
  
  return function() {
    state = (a * state + c) % m;
    return state / m;
  };
}

export function mersenneTwister(seed: number): () => number {
  const N = 624;
  const M = 397;
  const MATRIX_A = 0x9908b0df;
  const UPPER_MASK = 0x80000000;
  const LOWER_MASK = 0x7fffffff;
  
  let mt: number[] = new Array(N).fill(0);
  let index = N + 1;
  
  mt[0] = seed >>> 0;
  for (let i = 1; i < N; i++) {
    const prev = mt[i - 1];
    if (prev !== undefined) {
      mt[i] = (1812433253 * (prev ^ (prev >>> 30)) + i) >>> 0;
    }
  }

  function twist(): void {
    for (let i = 0; i < N; i++) {
      const mtI = mt[i];
      const mtIPlus1 = mt[(i + 1) % N];
      const mtIM = mt[(i + M) % N];
      if (mtI === undefined || mtIPlus1 === undefined || mtIM === undefined) continue;
      const x = (mtI & UPPER_MASK) | (mtIPlus1 & LOWER_MASK);
      let xA = x >>> 1;
      if (x % 2 !== 0) xA ^= MATRIX_A;
      mt[i] = mtIM ^ xA;
    }
    index = 0;
  }

  return function() {
    if (index >= N) twist();

    let y = mt[index++];
    if (y === undefined) return 0;
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);

    return y / 0x80000000;
  };
}

export function xorshift(seed: number): () => number {
  let x = seed >>> 0;
  
  return function() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 0x80000000) * 0.5 + 0.5;
  };
}
