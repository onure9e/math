// import { pearson } from './correlation';

export interface DescriptiveStats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode?: number;
  variance: number;
  stdDev: number;
  stdErr: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
}

export interface HistogramBin {
  binStart: number;
  binEnd: number;
  frequency: number;
  relativeFrequency: number;
  cumulativeFrequency: number;
}

export interface FrequencyTable {
  value: number;
  frequency: number;
  relativeFrequency: number;
  cumulativeFrequency: number;
}

export interface PercentileResult {
  value: number;
  method: 'linear' | 'nearest' | 'lower' | 'higher' | 'midpoint';
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    const left = sorted[mid - 1];
    const right = sorted[mid];
    if (left === undefined || right === undefined) {
      throw new Error('Invalid median calculation: sorted array has undefined values');
    }
    return (left + right) / 2;
  }
  const midValue = sorted[mid];
  if (midValue === undefined) {
    throw new Error('Invalid median calculation: sorted array has undefined value');
  }
  return midValue;
}

export function mode(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  const freq = new Map<number, number>();
  let maxFreq = 0;
  values.forEach(v => {
    const f = (freq.get(v) || 0) + 1;
    freq.set(v, f);
    if (f > maxFreq) maxFreq = f;
  });
  if (maxFreq === 1) return undefined;
  let modes: number[] = [];
  freq.forEach((f, v) => {
    if (f === maxFreq) modes.push(v);
  });
  return modes.length === 1 ? modes[0] : modes[0];
}

export function modeAll(values: number[]): number[] {
  if (values.length === 0) return [];
  const freq = new Map<number, number>();
  let maxFreq = 0;
  values.forEach(v => {
    const f = (freq.get(v) || 0) + 1;
    freq.set(v, f);
    if (f > maxFreq) maxFreq = f;
  });
  if (maxFreq === 1) return [];
  let modes: number[] = [];
  freq.forEach((f, v) => {
    if (f === maxFreq) modes.push(v);
  });
  return modes.sort((a, b) => a - b);
}

export function variance(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const squaredDiffs = values.map(v => Math.pow(v - m, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / (values.length - 1);
}

export function populationVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const m = mean(values);
  const squaredDiffs = values.map(v => Math.pow(v - m, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

export function stdDev(values: number[]): number {
  return Math.sqrt(variance(values));
}

export function populationStdDev(values: number[]): number {
  return Math.sqrt(populationVariance(values));
}

export function stdErr(values: number[]): number {
  if (values.length < 2) return 0;
  return stdDev(values) / Math.sqrt(values.length);
}

export function min(values: number[]): number {
  return Math.min(...values);
}

export function max(values: number[]): number {
  return Math.max(...values);
}

export function range(values: number[]): number {
  return max(values) - min(values);
}

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export function sumSquares(values: number[]): number {
  return values.reduce((a, b) => a + b * b, 0);
}

export function sumOfProducts(x: number[], y: number[]): number {
  if (x.length !== y.length) throw new Error('Arrays must have same length');
  return x.reduce((acc, xi, i) => {
    const yVal = y[i];
    if (yVal === undefined) {
      throw new Error('Invalid input: y array has undefined values');
    }
    return acc + xi * yVal;
  }, 0);
}

export function quartile(values: number[], q: number): number {
  if (values.length === 0) return 0;
  if (q < 0 || q > 4) throw new Error('Quartile must be between 0 and 4');
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q / 4;
  const lower = Math.floor(pos);
  const upper = Math.ceil(pos);
  if (lower === upper) {
    const val = sorted[lower];
    if (val === undefined) {
      throw new Error('Invalid quartile calculation: sorted array has undefined values');
    }
    return val;
  }
  const lowerVal = sorted[lower];
  const upperVal = sorted[upper];
  if (lowerVal === undefined || upperVal === undefined) {
    throw new Error('Invalid quartile calculation: sorted array has undefined values');
  }
  return lowerVal * (upper - pos) + upperVal * (pos - lower);
}

export function q1(values: number[]): number {
  return quartile(values, 1);
}

export function q3(values: number[]): number {
  return quartile(values, 3);
}

export function iqr(values: number[]): number {
  return q3(values) - q1(values);
}

export function percentile(values: number[], p: number, method: 'linear' | 'nearest' | 'lower' | 'higher' | 'midpoint' = 'linear'): number {
  if (values.length === 0) return 0;
  if (p < 0 || p > 100) throw new Error('Percentile must be between 0 and 100');
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lowerIdx = Math.floor(idx);
  const upperIdx = Math.ceil(idx);
  if (lowerIdx === upperIdx) {
    const val = sorted[lowerIdx];
    if (val === undefined) {
      throw new Error('Invalid percentile calculation: sorted array has undefined values');
    }
    return val;
  }
  const lowerVal = sorted[lowerIdx];
  const upperVal = sorted[upperIdx];
  if (lowerVal === undefined || upperVal === undefined) {
    throw new Error('Invalid percentile calculation: sorted array has undefined values');
  }
  switch (method) {
    case 'linear':
      return lowerVal + (idx - lowerIdx) * (upperVal - lowerVal);
    case 'nearest':
      return idx - lowerIdx < 0.5 ? lowerVal : upperVal;
    case 'lower':
      return lowerVal;
    case 'higher':
      return upperVal;
    case 'midpoint':
      return (lowerVal + upperVal) / 2;
    default:
      return lowerVal + (idx - lowerIdx) * (upperVal - lowerVal);
  }
}

export function percentileRank(values: number[], value: number, method: 'linear' | 'nearest' = 'linear'): number {
  const sorted = [...values].sort((a, b) => a - b);
  const lessThan = sorted.filter(v => v < value).length;
  const equalTo = sorted.filter(v => v === value).length;
  if (equalTo === 0) {
    return (lessThan / sorted.length) * 100;
  }
  const idx = lessThan / (sorted.length - 1);
  return method === 'linear'
    ? (idx + (equalTo - 1) / (2 * equalTo)) * 100
    : ((lessThan + equalTo / 2) / sorted.length) * 100;
}

export function fiveNumberSummary(values: number[]): { min: number; q1: number; median: number; q3: number; max: number } {
  return {
    min: min(values),
    q1: q1(values),
    median: median(values),
    q3: q3(values),
    max: max(values)
  };
}

export function describe(values: number[]): DescriptiveStats {
  const m = mean(values);
  const sorted = [...values].sort((a, b) => a - b);
  const n = values.length;
  
  const squaredDiffs = values.map(v => Math.pow(v - m, 2));
  const cubedDiffs = values.map(v => Math.pow(v - m, 3));
  const fourthDiffs = values.map(v => Math.pow(v - m, 4));
  
  const varianceVal = squaredDiffs.reduce((a, b) => a + b, 0) / (n - 1);
  const stdDevVal = Math.sqrt(varianceVal);
  
  let skewness = 0;
  let kurtosis = 0;
  if (stdDevVal > 0) {
    skewness = (cubedDiffs.reduce((a, b) => a + b, 0) / n) / Math.pow(stdDevVal, 3);
    kurtosis = (fourthDiffs.reduce((a, b) => a + b, 0) / n) / Math.pow(stdDevVal, 4) - 3;
  }
  
  const minVal = sorted[0];
  const maxVal = sorted[n - 1];
  if (minVal === undefined || maxVal === undefined) {
    throw new Error('Invalid describe calculation: sorted array has undefined values');
  }
  
  const modeVal = mode(values);
  
  return {
    count: n,
    sum: sum(values),
    mean: m,
    median: median(values),
    variance: varianceVal,
    stdDev: stdDevVal,
    stdErr: stdDevVal / Math.sqrt(n),
    min: minVal,
    max: maxVal,
    range: maxVal - minVal,
    q1: quartile(values, 1),
    q3: quartile(values, 3),
    iqr: quartile(values, 3) - quartile(values, 1),
    skewness,
    kurtosis,
    ...(modeVal !== undefined && { mode: modeVal })
  };
}

export function frequencyTable(values: number[]): FrequencyTable[] {
  const freq = new Map<number, number>();
  values.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
  
  const entries = Array.from(freq.entries())
    .map(([value, frequency]) => ({
      value,
      frequency,
      relativeFrequency: frequency / values.length,
      cumulativeFrequency: 0
    }))
    .sort((a, b) => a.value - b.value);
  
  let cumulative = 0;
  entries.forEach(entry => {
    cumulative += entry.frequency;
    entry.cumulativeFrequency = cumulative / values.length;
  });
  
  return entries;
}

export function histogram(values: number[], bins: number | number[] = 10, binWidth?: number): HistogramBin[] {
  if (values.length === 0) return [];
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  let binEdges: number[];
  if (Array.isArray(bins)) {
    binEdges = bins;
  } else {
    const binCount = bins;
    const range = max - min;
    const width = binWidth || range / binCount;
    binEdges = [];
    for (let i = 0; i <= binCount; i++) {
      binEdges.push(min + i * width);
    }
  }
  
  const binCount = binEdges.length - 1;
  const counts = new Array(binCount).fill(0);
  
  // Single pass O(n) - much faster than O(n×m) filter approach
  for (const v of values) {
    const idx = Math.min(Math.floor((v - min) / (max - min) * binCount), binCount - 1);
    counts[idx]++;
  }
  
  const histogram: HistogramBin[] = [];
  let cumulative = 0;
  
  for (let i = 0; i < binCount; i++) {
    const frequency = counts[i];
    cumulative += frequency;
    const start = binEdges[i];
    const end = binEdges[i + 1];
    if (start === undefined || end === undefined) {
      throw new Error('Invalid histogram: bin edges contain undefined values');
    }
    
    histogram.push({
      binStart: start,
      binEnd: end,
      frequency,
      relativeFrequency: frequency / values.length,
      cumulativeFrequency: cumulative / values.length
    });
  }
  
  return histogram;
}

export function boxplotValues(values: number[]): {
  whiskerMin: number; q1: number; median: number; q3: number; whiskerMax: number; outliers: number[];
} {
  const summary = fiveNumberSummary(values);
  const sorted = [...values].sort((a, b) => a - b);
  const iqrVal = summary.q3 - summary.q1;
  const lowerFence = summary.q1 - 1.5 * iqrVal;
  const upperFence = summary.q3 + 1.5 * iqrVal;
  
  const nonOutliers = sorted.filter(v => v >= lowerFence && v <= upperFence);
  const outliers = sorted.filter(v => v < lowerFence || v > upperFence);
  
  const whiskerMin = nonOutliers[0];
  const whiskerMax = nonOutliers[nonOutliers.length - 1];
  if (whiskerMin === undefined || whiskerMax === undefined) {
    throw new Error('Invalid boxplot calculation: nonOutliers array has undefined values');
  }
  
  return {
    whiskerMin,
    q1: summary.q1,
    median: summary.median,
    q3: summary.q3,
    whiskerMax,
    outliers
  };
}

export function zScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) throw new Error('Standard deviation cannot be zero');
  return (value - mean) / stdDev;
}

export function zScores(values: number[]): number[] {
  const stats = describe(values);
  return values.map(v => zScore(v, stats.mean, stats.stdDev));
}

export function standardize(values: number[]): number[] {
  return zScores(values);
}

export function covariance(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);
  return x.reduce((acc, xi, i) => {
    const yVal = y[i];
    if (yVal === undefined) {
      throw new Error('Invalid input: y array has undefined values');
    }
    return acc + (xi - meanX) * (yVal - meanY);
  }, 0) / (n - 1);
}

export function covarianceMatrix(data: number[][]): number[][] {
  const n = data.length;
  const m = data[0]?.length || 0;
  if (n === 0 || m === 0) return [];
  
  // Single transpose - O(m × n) - much more efficient
  const columns: number[][] = Array(m).fill(null).map(() => []);
  for (let i = 0; i < n; i++) {
    const row = data[i];
    if (row === undefined) {
      throw new Error('Invalid data: undefined row in data array');
    }
    for (let j = 0; j < m; j++) {
      const val = row[j];
      if (val === undefined) {
        throw new Error('Invalid data: undefined value in data array');
      }
      const col = columns[j];
      if (col === undefined) {
        throw new Error('Invalid data: column is undefined');
      }
      col.push(val);
    }
  }
  
  // Precompute means - O(m × n)
  const means = columns.map(col => 
    col.reduce((a, b) => a + b, 0) / n
  );
  
  // Compute covariance - O(m² × n) but with cache-friendly access
  const matrix: number[][] = Array(m).fill(null).map(() => Array(m).fill(0));
  
  for (let i = 0; i < m; i++) {
    const matrixRow = matrix[i];
    if (matrixRow === undefined) {
      throw new Error('Invalid covariance calculation: matrix row is undefined');
    }
    const colI = columns[i];
    const meanI = means[i];
    if (colI === undefined || meanI === undefined) {
      throw new Error('Invalid covariance calculation: column or mean is undefined');
    }
    for (let j = i; j < m; j++) {  // Only compute upper triangle
      const colJ = columns[j];
      const meanJ = means[j];
      if (colJ === undefined || meanJ === undefined) {
        throw new Error('Invalid covariance calculation: column or mean is undefined');
      }
      let sum = 0;
      for (let k = 0; k < n; k++) {
        const colIVal = colI[k];
        const colJVal = colJ[k];
        if (colIVal === undefined || colJVal === undefined) {
          throw new Error('Invalid covariance calculation: undefined value encountered');
        }
        sum += (colIVal - meanI) * (colJVal - meanJ);
      }
      const cov = sum / (n - 1);
      matrixRow[j] = cov;
      const matrixJRow = matrix[j];
      if (matrixJRow === undefined) {
        throw new Error('Invalid covariance calculation: matrix row is undefined');
      }
      matrixJRow[i] = cov;  // Symmetric
    }
  }
  
  return matrix;
}

export function correlationMatrix(data: number[][]): number[][] {
  const n = data.length;
  const m = data[0]?.length || 0;
  if (n === 0 || m === 0) return [];
  
  // Single transpose - O(m × n)
  const columns: number[][] = Array(m).fill(null).map(() => []);
  for (let i = 0; i < n; i++) {
    const row = data[i];
    if (row === undefined) {
      throw new Error('Invalid data: undefined row in data array');
    }
    for (let j = 0; j < m; j++) {
      const val = row[j];
      if (val === undefined) {
        throw new Error('Invalid data: undefined value in data array');
      }
      const col = columns[j];
      if (col === undefined) {
        throw new Error('Invalid data: column is undefined');
      }
      col.push(val);
    }
  }
  
  // Precompute means and standard deviations
  const means = columns.map(col => 
    col.reduce((a, b) => a + b, 0) / n
  );
  const stdDevs = columns.map((col, idx) => {
    const colMean = means[idx];
    if (colMean === undefined) {
      throw new Error('Invalid correlation calculation: mean is undefined');
    }
    const variance = col.reduce((acc, v) => acc + Math.pow(v - colMean, 2), 0) / (n - 1);
    return Math.sqrt(variance);
  });
  
  // Compute correlations
  const matrix: number[][] = Array(m).fill(null).map(() => Array(m).fill(0));
  
  for (let i = 0; i < m; i++) {
    const matrixRow = matrix[i];
    const colI = columns[i];
    const meanI = means[i];
    if (matrixRow === undefined || colI === undefined || meanI === undefined) {
      throw new Error('Invalid correlation calculation: matrix row, column or mean is undefined');
    }
    matrixRow[i] = 1;  // Diagonal is always 1
    for (let j = i + 1; j < m; j++) {
      const stdDevI = stdDevs[i];
      const stdDevJ = stdDevs[j];
      const colJ = columns[j];
      const meanJ = means[j];
      if (stdDevI === undefined || stdDevJ === undefined || colJ === undefined || meanJ === undefined) {
        throw new Error('Invalid correlation calculation: standard deviation, column or mean is undefined');
      }
      const matrixJRow = matrix[j];
      if (matrixJRow === undefined) {
        throw new Error('Invalid correlation calculation: matrix row is undefined');
      }
      if (stdDevI === 0 || stdDevJ === 0) {
        matrixRow[j] = matrixJRow[i] = 0;
      } else {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          const colIVal = colI[k];
          const colJVal = colJ[k];
          if (colIVal === undefined || colJVal === undefined) {
            throw new Error('Invalid correlation calculation: undefined value encountered');
          }
          sum += (colIVal - meanI) * (colJVal - meanJ);
        }
        const correlation = sum / ((n - 1) * stdDevI * stdDevJ);
        matrixRow[j] = matrixJRow[i] = correlation;
      }
    }
  }
  
  return matrix;
}

export function outliers(values: number[], method: 'iqr' | 'zscore' | 'modifiedzscore' = 'iqr'): number[] {
  switch (method) {
    case 'iqr': {
      const stats = fiveNumberSummary(values);
      const iqrVal = stats.q3 - stats.q1;
      const lowerFence = stats.q1 - 1.5 * iqrVal;
      const upperFence = stats.q3 + 1.5 * iqrVal;
      return values.filter(v => v < lowerFence || v > upperFence);
    }
    case 'zscore': {
      const stats = describe(values);
      return values.filter(v => Math.abs(zScore(v, stats.mean, stats.stdDev)) > 3);
    }
    case 'modifiedzscore': {
      const medianVal = median(values);
      const mad = median(values.map(v => Math.abs(v - medianVal)));
      if (mad === 0) return [];
      return values.filter(v => {
        const mzscore = 0.6745 * (v - medianVal) / mad;
        return Math.abs(mzscore) > 3.5;
      });
    }
    default:
      return [];
  }
}

export function trimMean(values: number[], proportion: number = 0.1): number {
  if (proportion < 0 || proportion >= 0.5) {
    throw new Error('Proportion must be between 0 and 0.5');
  }
  const sorted = [...values].sort((a, b) => a - b);
  const trimCount = Math.floor(sorted.length * proportion);
  const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
  return mean(trimmed);
}

export function winsorize(values: number[], proportion: number = 0.1): number[] {
  if (proportion < 0 || proportion >= 0.5) {
    throw new Error('Proportion must be between 0 and 0.5');
  }
  const sorted = [...values].sort((a, b) => a - b);
  const trimCount = Math.floor(sorted.length * proportion);
  const lowerBound = sorted[trimCount];
  const upperBound = sorted[sorted.length - 1 - trimCount];
  if (lowerBound === undefined || upperBound === undefined) {
    throw new Error('Invalid winsorize calculation: bounds are undefined');
  }
  return values.map(v => Math.max(lowerBound, Math.min(upperBound, v)));
}

export function coefficientOfVariation(values: number[]): number {
  const stats = describe(values);
  if (stats.mean === 0) return Infinity;
  return stats.stdDev / Math.abs(stats.mean);
}

export function geometricMean(values: number[]): number {
  if (values.some(v => v <= 0)) throw new Error('Geometric mean requires positive values');
  return Math.exp(mean(values.map(v => Math.log(v))));
}

export function harmonicMean(values: number[]): number {
  if (values.some(v => v <= 0)) throw new Error('Harmonic mean requires positive values');
  return values.length / values.reduce((acc, v) => acc + 1 / v, 0);
}

export function rootMeanSquare(values: number[]): number {
  return Math.sqrt(mean(values.map(v => v * v)));
}

export function interquartileMean(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const q1Idx = Math.floor(sorted.length * 0.25);
  const q3Idx = Math.floor(sorted.length * 0.75);
  const trimmed = sorted.slice(q1Idx, q3Idx + 1);
  return mean(trimmed);
}
