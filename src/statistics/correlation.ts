import { variance } from './descriptive';

export interface CorrelationResult {
  pearson: number;
  spearman: number;
  kendall: number;
  r2: number;
}

export function pearson(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  
  let num = 0;
  let denX = 0;
  let denY = 0;
  
  for (let i = 0; i < n; i++) {
    const xVal = x[i];
    const yVal = y[i];
    if (xVal === undefined || yVal === undefined) continue;
    const dx = xVal - meanX;
    const dy = yVal - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  
  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}

export function spearman(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  
  const rankX = getRanks(x);
  const rankY = getRanks(y);
  
  return pearson(rankX, rankY);
}

export function getRanks(arr: number[]): number[] {
  const sorted = arr.map((v, i) => ({ value: v, index: i }))
    .sort((a, b) => a.value - b.value);
  
  const ranks = new Array(arr.length);
  
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length - 1) {
      const sortedJ = sorted[j];
      const sortedJPlus1 = sorted[j + 1];
      if (sortedJ === undefined || sortedJPlus1 === undefined) break;
      if (sortedJ.value !== sortedJPlus1.value) break;
      j++;
    }
    const rank = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) {
      const sortedK = sorted[k];
      if (sortedK === undefined) continue;
      ranks[sortedK.index] = rank;
    }
    i = j + 1;
  }
  
  return ranks;
}

export function kendall(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  
  const n = x.length;
  let concordant = 0;
  let discordant = 0;
  
  for (let i = 0; i < n - 1; i++) {
    const xI = x[i];
    const yI = y[i];
    if (xI === undefined || yI === undefined) continue;
    for (let j = i + 1; j < n; j++) {
      const xJ = x[j];
      const yJ = y[j];
      if (xJ === undefined || yJ === undefined) continue;
      const dx = xI - xJ;
      const dy = yI - yJ;
      const sign = Math.sign(dx * dy);
      if (sign > 0) concordant++;
      else if (sign < 0) discordant++;
    }
  }
  
  const total = concordant + discordant;
  if (total === 0) return 0;
  return (concordant - discordant) / total;
}

export function kendallTauB(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  
  const n = x.length;
  let concordant = 0;
  let discordant = 0;
  let tiedX = 0;
  let tiedY = 0;
  
  for (let i = 0; i < n - 1; i++) {
    const xI = x[i];
    const yI = y[i];
    if (xI === undefined || yI === undefined) continue;
    for (let j = i + 1; j < n; j++) {
      const xJ = x[j];
      const yJ = y[j];
      if (xJ === undefined || yJ === undefined) continue;
      const dx = xI - xJ;
      const dy = yI - yJ;
      const sign = Math.sign(dx * dy);

      if (sign > 0) concordant++;
      else if (sign < 0) discordant++;
      else {
        if (dx === 0) tiedX++;
        if (dy === 0) tiedY++;
      }
    }
  }
  
  const total = concordant + discordant;
  const tieCorrection = Math.sqrt((total + tiedX) * (total + tiedY));
  if (tieCorrection === 0) return 0;
  return (concordant - discordant) / tieCorrection;
}

export function pointBiserial(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  
  const group0 = x.filter((_, i) => y[i] === 0);
  const group1 = x.filter((_, i) => y[i] === 1);
  
  if (group0.length === 0 || group1.length === 0) return 0;
  
  const mean0 = group0.reduce((a, b) => a + b, 0) / group0.length;
  const mean1 = group1.reduce((a, b) => a + b, 0) / group1.length;
  
  const n0 = group0.length;
  const n1 = group1.length;
  const n = n0 + n1;
  
  const pooledSD = Math.sqrt(
    ((n0 - 1) * variance(group0) + (n1 - 1) * variance(group1)) / (n - 2)
  );
  
  if (pooledSD === 0) return 0;
  
  return ((mean1 - mean0) / pooledSD) * Math.sqrt((n0 * n1) / (n * n));
}

export function biserial(x: number[], y: number[]): number {
  const rpb = pointBiserial(x, y);
  const len = x.length;
  return rpb * Math.sqrt(len * (len - 1)) / Math.sqrt(len - 2 + rpb * rpb);
}

export function phi(x: number[], y: number[]): number {
  if (x.length !== y.length) return 0;
  
  let a = 0, b = 0, c = 0, d = 0;
  
  for (let i = 0; i < x.length; i++) {
    const xVal = x[i];
    const yVal = y[i];
    if (xVal === undefined || yVal === undefined) continue;
    if (xVal === 0 && yVal === 0) a++;
    else if (xVal === 0 && yVal === 1) b++;
    else if (xVal === 1 && yVal === 0) c++;
    else if (xVal === 1 && yVal === 1) d++;
  }
  
  const denom = Math.sqrt((a + b) * (c + d) * (a + c) * (b + d));
  if (denom === 0) return 0;
  return (a * d - b * c) / denom;
}

export function cramersV(x: number[], y: number[]): number {
  if (x.length !== y.length) return 0;
  
  const contingency = new Map<string, number>();
  for (let i = 0; i < x.length; i++) {
    const xVal = x[i];
    const yVal = y[i];
    if (xVal === undefined || yVal === undefined) continue;
    const key = `${xVal},${yVal}`;
    contingency.set(key, (contingency.get(key) || 0) + 1);
  }
  
  const uniqueX = new Set(x).size;
  const uniqueY = new Set(y).size;
  const minDim = Math.min(uniqueX, uniqueY);
  
  if (minDim <= 1) return 0;
  
  let chiSquare = 0;
  const rowTotals = new Map<number, number>();
  const colTotals = new Map<number, number>();
  
  contingency.forEach((count, key) => {
    const [rx, cy] = key.split(',').map(Number);
    if (rx === undefined || cy === undefined) return;
    rowTotals.set(rx, (rowTotals.get(rx) || 0) + count);
    colTotals.set(cy, (colTotals.get(cy) || 0) + count);
  });

  contingency.forEach((count, key) => {
    const [rx, cy] = key.split(',').map(Number);
    if (rx === undefined || cy === undefined) return;
    const rowTotal = rowTotals.get(rx);
    const colTotal = colTotals.get(cy);
    if (rowTotal === undefined || colTotal === undefined) return;
    const expected = (rowTotal * colTotal) / x.length;
    chiSquare += Math.pow(count - expected, 2) / expected;
  });
  
  return Math.sqrt(chiSquare / (x.length * (minDim - 1)));
}

export function autocorrelation(values: number[], lag: number = 1): number {
  if (lag < 0 || lag >= values.length) return 0;
  
  const n = values.length;
  const meanVal = values.reduce((a, b) => a + b, 0) / n;
  
  let num = 0;
  let den = 0;
  
  for (let i = 0; i < n - lag; i++) {
    const valI = values[i];
    const valILag = values[i + lag];
    if (valI === undefined || valILag === undefined) continue;
    num += (valI - meanVal) * (valILag - meanVal);
  }

  for (let i = 0; i < n; i++) {
    const val = values[i];
    if (val === undefined) continue;
    den += Math.pow(val - meanVal, 2);
  }
  
  if (den === 0) return 0;
  return num / den;
}

export function partialAutocorrelation(values: number[], lag: number): number {
  if (lag < 1 || lag >= values.length) return 0;

  const pacf = new Array(lag + 1).fill(0);
  pacf[0] = 1;
  
  const r = new Array(lag + 1).fill(0);
  for (let i = 1; i <= lag; i++) {
    r[i] = autocorrelation(values, i);
  }
  
  for (let k = 1; k <= lag; k++) {
    let sum = r[k];
    for (let j = 1; j < k; j++) {
      sum -= pacf[j] * r[k - j];
    }
    pacf[k] = sum / (1 - r.slice(1, k).reduce((acc, v, idx) => acc + pacf[idx + 1] * v, 0));
  }
  
  return pacf[lag];
}

export function crossCorrelation(x: number[], y: number[]): number[] {
  const n = Math.max(x.length, y.length);
  const result: number[] = [];
  
  for (let lag = -n + 1; lag < n; lag++) {
    let sum = 0;
    let count = 0;
    
    for (let i = 0; i < x.length; i++) {
      const j = i + lag;
      if (j >= 0 && j < y.length) {
        const xVal = x[i];
        const yVal = y[j];
        if (xVal === undefined || yVal === undefined) continue;
        sum += xVal * yVal;
        count++;
      }
    }
    
    result.push(count > 0 ? sum / count : 0);
  }
  
  return result;
}

export function mutualInformation(x: number[], y: number[]): number {
  if (x.length !== y.length) return 0;
  
  const n = x.length;
  
  const entropy = (arr: number[]): number => {
    const freq = new Map<number, number>();
    arr.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
    let h = 0;
    freq.forEach(count => {
      const p = count / n;
      h -= p * Math.log2(p);
    });
    return h;
  };
  
  const jointEntropy = (): number => {
    const joint = new Map<string, number>();
    for (let i = 0; i < n; i++) {
      const key = `${x[i]},${y[i]}`;
      joint.set(key, (joint.get(key) || 0) + 1);
    }
    let h = 0;
    joint.forEach(count => {
      const p = count / n;
      h -= p * Math.log2(p);
    });
    return h;
  };
  
  return entropy(x) + entropy(y) - jointEntropy();
}

export function normalizedMutualInformation(x: number[], y: number[]): number {
  const mi = mutualInformation(x, y);
  const hx = entropyFromLabels(x);
  const hy = entropyFromLabels(y);
  
  if (hx === 0 || hy === 0) return 0;
  return 2 * mi / (hx + hy);
}

function entropyFromLabels(arr: number[]): number {
  const n = arr.length;
  const freq = new Map<number, number>();
  arr.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
  let h = 0;
  freq.forEach(count => {
    const p = count / n;
    h -= p * Math.log2(p);
  });
  return h;
}

export function correlation(x: number[], y: number[]): CorrelationResult {
  return {
    pearson: pearson(x, y),
    spearman: spearman(x, y),
    kendall: kendall(x, y),
    r2: Math.pow(pearson(x, y), 2)
  };
}

export function autoCorrelation(values: number[], maxLag: number = Math.floor(values.length / 2)): number[] {
  const result: number[] = [];
  for (let lag = 0; lag <= maxLag; lag++) {
    result.push(autocorrelation(values, lag));
  }
  return result;
}
