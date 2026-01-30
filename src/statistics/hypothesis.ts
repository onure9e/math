import { getRanks } from './correlation';

export interface HypothesisTestResult {
  statistic: number;
  pValue: number;
  criticalValue?: number;
  rejectNull: boolean;
  confidenceInterval?: [number, number];
  effectSize?: number;
}

export interface ANOVAResult {
  fStatistic: number;
  pValue: number;
  rejectNull: boolean;
  betweenGroupVariance: number;
  withinGroupVariance: number;
  totalVariance: number;
  dfBetween: number;
  dfWithin: number;
  dfTotal: number;
  ssBetween: number;
  ssWithin: number;
  ssTotal: number;
  means: number[];
  groupLabels?: string[];
}

export interface ChiSquareResult {
  statistic: number;
  pValue: number;
  df: number;
  rejectNull: boolean;
  expected: number[][];
  residuals: number[][];
  standardizedResiduals: number[][];
}

export interface TTestResult extends HypothesisTestResult {
  df: number;
  mean: number;
  stdErr: number;
  confidenceInterval: [number, number];
}

export interface ZTestResult extends HypothesisTestResult {
  mean: number;
  stdErr: number;
  zScore: number;
}

export interface MannWhitneyResult {
  u: number;
  z: number;
  pValue: number;
  rejectNull: boolean;
  medianDifference: number;
}

export interface WilcoxonResult {
  w: number;
  z: number;
  pValue: number;
  rejectNull: boolean;
}

export interface KruskalWallisResult {
  h: number;
  pValue: number;
  df: number;
  rejectNull: boolean;
}

export function oneSampleTTest(
  sample: number[],
  mu0: number,
  alpha: number = 0.05,
  alternative: 'two-tailed' | 'greater' | 'less' = 'two-tailed'
): TTestResult {
  const n = sample.length;
  const meanVal = sample.reduce((a, b) => a + b, 0) / n;
  const varianceVal = sample.reduce((a, b) => a + Math.pow(b - meanVal, 2), 0) / (n - 1);
  const stdErr = Math.sqrt(varianceVal / n);
  const t = (meanVal - mu0) / stdErr;
  const df = n - 1;
  
  const pValue = tDistributionPValue(t, df, alternative);
  
  const tCritical = tDistributionCritical(alpha, df, alternative);
  const rejectNull = pValue < alpha;
  
  const criticalValue = tCritical;
  
  const margin = tCritical * stdErr;
  const ci: [number, number] = [meanVal - margin, meanVal + margin];
  
  const cohensD = (meanVal - mu0) / Math.sqrt(varianceVal);
  
  return {
    statistic: t,
    pValue,
    criticalValue,
    rejectNull,
    df,
    mean: meanVal,
    stdErr,
    confidenceInterval: ci,
    effectSize: cohensD
  };
}

export function twoSampleTTest(
  sample1: number[],
  sample2: number[],
  alpha: number = 0.05,
  alternative: 'two-tailed' | 'greater' | 'less' = 'two-tailed',
  equalVariance: boolean = false
): TTestResult {
  const n1 = sample1.length;
  const n2 = sample2.length;
  const mean1 = sample1.reduce((a, b) => a + b, 0) / n1;
  const mean2 = sample2.reduce((a, b) => a + b, 0) / n2;
  const var1 = sample1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0) / (n1 - 1);
  const var2 = sample2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0) / (n2 - 1);
  
  let t: number;
  let df: number;
  let pooledVar: number;
  let stdErr: number;
  
  if (equalVariance) {
    pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    stdErr = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));
    df = n1 + n2 - 2;
  } else {
    const se1 = var1 / n1;
    const se2 = var2 / n2;
    stdErr = Math.sqrt(se1 + se2);
    df = Math.pow(se1 + se2, 2) / (Math.pow(se1, 2) / (n1 - 1) + Math.pow(se2, 2) / (n2 - 1));
  }
  
  t = (mean1 - mean2) / stdErr;
  
  const pValue = tDistributionPValue(t, df, alternative);
  const tCritical = tDistributionCritical(alpha, df, alternative);
  const rejectNull = pValue < alpha;
  
  const margin = tCritical * stdErr;
  const diff = mean1 - mean2;
  const ci: [number, number] = [diff - margin, diff + margin];
  
  const pooledSD = Math.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2));
  const cohensD = (mean1 - mean2) / pooledSD;
  
  return {
    statistic: t,
    pValue,
    criticalValue: tCritical,
    rejectNull,
    df,
    mean: diff,
    stdErr,
    confidenceInterval: ci,
    effectSize: cohensD
  };
}

export function pairedTTest(
  before: number[],
  after: number[],
  alpha: number = 0.05,
  alternative: 'two-tailed' | 'greater' | 'less' = 'two-tailed'
): TTestResult {
  if (before.length !== after.length) {
    throw new Error('Sample sizes must be equal');
  }
  
  const diffs = before.map((b, i) => {
    const a = after[i];
    if (a === undefined) return 0;
    return b - a;
  });
  const n = diffs.length;
  const meanDiff = diffs.reduce((a, b) => a + b, 0) / n;
  const varDiff = diffs.reduce((a, b) => a + Math.pow(b - meanDiff, 2), 0) / (n - 1);
  const stdErr = Math.sqrt(varDiff / n);
  const t = meanDiff / stdErr;
  const df = n - 1;
  
  const pValue = tDistributionPValue(t, df, alternative);
  const tCritical = tDistributionCritical(alpha, df, alternative);
  const rejectNull = pValue < alpha;
  
  const margin = tCritical * stdErr;
  const ci: [number, number] = [meanDiff - margin, meanDiff + margin];
  
  return {
    statistic: t,
    pValue,
    criticalValue: tCritical,
    rejectNull,
    df,
    mean: meanDiff,
    stdErr,
    confidenceInterval: ci
  };
}

export function zTest(
  sample: number[],
  mu0: number,
  sigma: number,
  alpha: number = 0.05,
  alternative: 'two-tailed' | 'greater' | 'less' = 'two-tailed'
): ZTestResult {
  const n = sample.length;
  const meanVal = sample.reduce((a, b) => a + b, 0) / n;
  const stdErr = sigma / Math.sqrt(n);
  const z = (meanVal - mu0) / stdErr;
  
  const pValue = normalPValue(z, alternative);
  const zCritical = normalCritical(alpha, alternative);
  const rejectNull = pValue < alpha;
  
  const margin = zCritical * stdErr;
  const ci: [number, number] = [meanVal - margin, meanVal + margin];
  
  return {
    statistic: z,
    pValue,
    criticalValue: zCritical,
    rejectNull,
    confidenceInterval: ci,
    mean: meanVal,
    stdErr,
    zScore: z
  };
}

export function oneWayANOVA(
  groups: number[][],
  alpha: number = 0.05
): ANOVAResult {
  if (groups.length < 2) throw new Error('At least 2 groups required');
  
  const allData = groups.flat();
  const k = groups.length;
  const N = allData.length;
  const grandMean = allData.reduce((a, b) => a + b, 0) / N;
  
  const means = groups.map(g => g.reduce((a, b) => a + b, 0) / g.length);
  const sizes = groups.map(g => g.length);

  let ssBetween = 0;
  for (let i = 0; i < k; i++) {
    const size = sizes[i];
    const mean = means[i];
    if (size === undefined || mean === undefined) continue;
    ssBetween += size * Math.pow(mean - grandMean, 2);
  }

  let ssWithin = 0;
  for (let i = 0; i < k; i++) {
    const group = groups[i];
    const mean = means[i];
    if (group === undefined || mean === undefined) continue;
    for (const val of group) {
      ssWithin += Math.pow(val - mean, 2);
    }
  }
  
  const ssTotal = ssBetween + ssWithin;
  
  const dfBetween = k - 1;
  const dfWithin = N - k;
  const dfTotal = N - 1;
  
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  
  const f = msBetween / msWithin;
  const pValue = fDistributionPValue(f, dfBetween, dfWithin);
  const rejectNull = pValue < alpha;
  
  return {
    fStatistic: f,
    pValue,
    rejectNull,
    betweenGroupVariance: msBetween,
    withinGroupVariance: msWithin,
    totalVariance: ssTotal / dfTotal,
    dfBetween,
    dfWithin,
    dfTotal,
    ssBetween,
    ssWithin,
    ssTotal,
    means
  };
}

export function chiSquareTest(
  observed: number[][],
  expected?: number[][],
  alpha: number = 0.05
): ChiSquareResult {
  const rows = observed.length;
  const firstRow = observed[0];
  if (firstRow === undefined) throw new Error('Invalid observed data');
  const cols = firstRow.length;

  if (!expected) {
    expected = [];
    const rowTotals = observed.map(row => row.reduce((a, b) => a + b, 0));
    const colTotals = firstRow.map((_, j) => observed.reduce((a, row) => {
      const val = row[j];
      if (val === undefined) return a;
      return a + val;
    }, 0));
    const total = rowTotals.reduce((a, b) => a + b, 0);

    for (let i = 0; i < rows; i++) {
      expected[i] = [];
      const rowTotal = rowTotals[i];
      if (rowTotal === undefined) continue;
      const expectedRow = expected[i];
      if (expectedRow === undefined) continue;
      for (let j = 0; j < cols; j++) {
        const colTotal = colTotals[j];
        if (colTotal === undefined) continue;
        expectedRow[j] = (rowTotal * colTotal) / total;
      }
    }
  }

  let statistic = 0;
  const residuals: number[][] = [];
  const standardizedResiduals: number[][] = [];

  for (let i = 0; i < rows; i++) {
    residuals[i] = [];
    standardizedResiduals[i] = [];
    const observedRow = observed[i];
    const expectedRow = expected[i];
    if (observedRow === undefined || expectedRow === undefined) continue;
    for (let j = 0; j < cols; j++) {
        const observedVal = observedRow[j];
        const expectedVal = expectedRow[j];
        if (observedVal === undefined || expectedVal === undefined) continue;
        const diff = observedVal - expectedVal;
        const resRow = residuals[i];
        const stdRow = standardizedResiduals[i];
        if (resRow === undefined || stdRow === undefined) continue;
        resRow[j] = diff;
        stdRow[j] = diff / Math.sqrt(expectedVal);
        statistic += Math.pow(diff, 2) / expectedVal;
      }
  }

  const df = (rows - 1) * (cols - 1);
  const pValue = 1 - chiSquareCDF(statistic, df);
  const rejectNull = pValue < alpha;
  
  return {
    statistic,
    pValue,
    df,
    rejectNull,
    expected: expected!,
    residuals,
    standardizedResiduals
  };
}

export function mannWhitneyU(
  sample1: number[],
  sample2: number[],
  alpha: number = 0.05,
  alternative: 'two-tailed' | 'greater' | 'less' = 'two-tailed'
): MannWhitneyResult {
  const n1 = sample1.length;
  const n2 = sample2.length;
  const allData = [...sample1, ...sample2];
  const ranks = getRanks(allData);
  
  const r1 = ranks.slice(0, n1).reduce((a, b) => a + b, 0);
  const u1 = r1 - (n1 * (n1 + 1)) / 2;
  const u2 = n1 * n2 - u1;
  const u = alternative === 'greater' ? u2 : u1;
  
  const meanU = n1 * n2 / 2;
  const varU = n1 * n2 * (n1 + n2 + 1) / 12;
  const z = (u - meanU) / Math.sqrt(varU);
  
  let pValue: number;
  switch (alternative) {
    case 'two-tailed':
      pValue = 2 * (1 - normalCDF(Math.abs(z)));
      break;
    case 'greater':
      pValue = 1 - normalCDF(z);
      break;
    case 'less':
      pValue = normalCDF(z);
      break;
    default:
      pValue = 2 * (1 - normalCDF(Math.abs(z)));
  }
  
  const rejectNull = pValue < alpha;
  
  const sorted1 = [...sample1].sort((a, b) => a - b);
  const sorted2 = [...sample2].sort((a, b) => a - b);
  let median1: number;
  let median2: number;
  if (sorted1.length % 2 === 0) {
    const a = sorted1[sorted1.length / 2 - 1];
    const b = sorted1[sorted1.length / 2];
    median1 = (a === undefined || b === undefined) ? 0 : (a + b) / 2;
  } else {
    const m = sorted1[Math.floor(sorted1.length / 2)];
    median1 = m === undefined ? 0 : m;
  }
  if (sorted2.length % 2 === 0) {
    const a = sorted2[sorted2.length / 2 - 1];
    const b = sorted2[sorted2.length / 2];
    median2 = (a === undefined || b === undefined) ? 0 : (a + b) / 2;
  } else {
    const m = sorted2[Math.floor(sorted2.length / 2)];
    median2 = m === undefined ? 0 : m;
  }

  return {
    u,
    z,
    pValue,
    rejectNull,
    medianDifference: median2 - median1
  };
}

export function wilcoxonSignedRank(
  sample1: number[],
  sample2: number[],
  alpha: number = 0.05,
  alternative: 'two-tailed' | 'greater' | 'less' = 'two-tailed'
): WilcoxonResult {
  if (sample1.length !== sample2.length) {
    throw new Error('Sample sizes must be equal');
  }
  
  const diffs = sample1.map((v, i) => {
    const s2 = sample2[i];
    if (s2 === undefined) return v;
    return v - s2;
  });
  const nonZero = diffs.filter(d => d !== 0);
  const absDiffs = nonZero.map(d => Math.abs(d));
  const ranks = getRanks(absDiffs);
  
  let wPlus = 0;
  let wMinus = 0;
  
  for (let i = 0; i < nonZero.length; i++) {
    const nz = nonZero[i];
    const rank = ranks[i];
    if (nz === undefined || rank === undefined) continue;
    if (nz > 0) {
      wPlus += rank;
    } else {
      wMinus += rank;
    }
  }
  
  const w = alternative === 'greater' ? wPlus : wMinus;
  const n = nonZero.length;
  const meanW = n * (n + 1) / 4;
  const varW = n * (n + 1) * (2 * n + 1) / 24;
  const z = (w - meanW) / Math.sqrt(varW);
  
  let pValue: number;
  switch (alternative) {
    case 'two-tailed':
      pValue = 2 * (1 - normalCDF(Math.abs(z)));
      break;
    case 'greater':
      pValue = 1 - normalCDF(z);
      break;
    case 'less':
      pValue = normalCDF(z);
      break;
    default:
      pValue = 2 * (1 - normalCDF(Math.abs(z)));
  }
  
  const rejectNull = pValue < alpha;
  
  return { w, z, pValue, rejectNull };
}

export function kruskalWallis(
  groups: number[][],
  alpha: number = 0.05
): KruskalWallisResult {
  const k = groups.length;
  const allData = groups.flat();
  const N = allData.length;
  const ranks = getRanks(allData);
  
  let start = 0;
  const groupRanks: number[][] = [];
  for (const group of groups) {
    groupRanks.push(ranks.slice(start, start + group.length));
    start += group.length;
  }
  
  const ri = groupRanks.map(g => g.reduce((a, b) => a + b, 0));
  const ni = groups.map(g => g.length);
  
  let h = 0;
  for (let i = 0; i < k; i++) {
    const r = ri[i];
    const n = ni[i];
    if (r === undefined || n === undefined) continue;
    h += Math.pow(r, 2) / n;
  }
  
  h = (12 / (N * (N + 1))) * h - 3 * (N + 1);
  
  const df = k - 1;
  const pValue = 1 - chiSquareCDF(h, df);
  const rejectNull = pValue < alpha;
  
  return { h, pValue, df, rejectNull };
}

export function confidenceInterval(
  sample: number[],
  confidence: number = 0.95,
  sigma?: number
): [number, number] {
  const n = sample.length;
  const meanVal = sample.reduce((a, b) => a + b, 0) / n;
  
  if (sigma) {
    const z = normalCritical((1 - confidence) / 2, 'two-tailed');
    const margin = z * sigma / Math.sqrt(n);
    return [meanVal - margin, meanVal + margin];
  } else {
    const s = Math.sqrt(sample.reduce((a, b) => a + Math.pow(b - meanVal, 2), 0) / (n - 1));
    const t = tDistributionCritical((1 - confidence) / 2, n - 1, 'two-tailed');
    const margin = t * s / Math.sqrt(n);
    return [meanVal - margin, meanVal + margin];
  }
}

export function sampleSizeForMean(
  marginOfError: number,
  sigma: number,
  confidence: number = 0.95
): number {
  const z = normalCritical((1 - confidence) / 2, 'two-tailed');
  return Math.ceil(Math.pow(z * sigma / marginOfError, 2));
}

export function sampleSizeForProportion(
  marginOfError: number,
  p: number = 0.5,
  confidence: number = 0.95
): number {
  const z = normalCritical((1 - confidence) / 2, 'two-tailed');
  return Math.ceil(Math.pow(z / marginOfError, 2) * p * (1 - p));
}

function tDistributionPValue(
  t: number,
  df: number,
  alternative: 'two-tailed' | 'greater' | 'less'
): number {
  const xVal = df / (df + t * t);
  const pVal = regularizedBeta(xVal / 2, df / 2, 0.5) / 2;

  switch (alternative) {
    case 'two-tailed':
      return 2 * Math.min(pVal, 1 - pVal);
    case 'greater':
      return 1 - pVal;
    case 'less':
      return pVal;
    default:
      return 2 * Math.min(pVal, 1 - pVal);
  }
}

function tDistributionCritical(
  alpha: number,
  df: number,
  alternative: 'two-tailed' | 'greater' | 'less'
): number {
  const p = alternative === 'two-tailed' ? 1 - alpha / 2 : 1 - alpha;
  return studentTPpf(p, df);
}

function studentTPpf(_p: number, df: number): number {
  const xVal = 2 * regularizedBeta(df / (df + 1), 0.5, df / 2);
  return Math.sqrt(df) * Math.cos(Math.asin(Math.sqrt(xVal)) * 2 - Math.PI) / 2;
}

function normalPValue(
  z: number,
  alternative: 'two-tailed' | 'greater' | 'less'
): number {
  const cdf = normalCDF(z);
  switch (alternative) {
    case 'two-tailed':
      return 2 * Math.min(cdf, 1 - cdf);
    case 'greater':
      return 1 - cdf;
    case 'less':
      return cdf;
    default:
      return 2 * Math.min(cdf, 1 - cdf);
  }
}

function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function normalCritical(
  alpha: number,
  alternative: 'two-tailed' | 'greater' | 'less'
): number {
  const pVal = alternative === 'two-tailed' ? 1 - alpha / 2 : 1 - alpha;
  return Math.sqrt(2) * inverseErf(2 * pVal - 1);
}

function fDistributionPValue(f: number, d1: number, d2: number): number {
  const xVal = d2 / (d2 + d1 * f);
  return regularizedBeta(xVal / 2, d2 / 2, d1 / 2);
}

function chiSquareCDF(x: number, df: number): number {
  return gammainc(df / 2, x / 2) / gamma(df / 2);
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
  let xVal = c[0];
  if (xVal === undefined) return Number.NaN;
  for (let i = 1; i < g + 2; i++) {
    const ci = c[i];
    if (ci === undefined) continue;
    xVal += ci / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * xVal;
}

function gammainc(a: number, x: number): number {
  if (x < 0 || a <= 0) return 0;
  if (x < a + 1) {
    let sum = 0;
    let term = 1 / a;
    sum = term;
    for (let n = 1; n < 200; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-10) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  } else {
    let sum = 0;
    let term = Math.exp(-x + a * Math.log(x) - logGamma(a)) / x;
    sum = term;
    for (let n = 1; n < 200; n++) {
      term *= (a + n - 1) / x;
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
  let xVal = c[0];
  if (xVal === undefined) return Number.NaN;
  for (let i = 1; i < g + 2; i++) {
    const ci = c[i];
    if (ci === undefined) continue;
    xVal += ci / (z + i);
  }
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(z + g + 0.5) - (z + g + 0.5) + Math.log(xVal);
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

function inverseErf(x: number): number {
  const a = 0.147;
  const ln1x2 = Math.log(1 - x * x);
  const part1 = 2 / (Math.PI * a) + ln1x2 / 2;
  const part2 = ln1x2 / a;
  const term = Math.sqrt(Math.sqrt(part1 * part1 - part2) - part1);
  return x >= 0 ? term : -term;
}
