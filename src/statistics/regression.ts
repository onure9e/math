import { mean } from './descriptive';

export interface LinearRegressionResult {
  slope: number;
  intercept: number;
  r2: number;
  r: number;
  equation: string;
  predict: (x: number) => number;
  residuals: number[];
  mse: number;
  rmse: number;
  mae: number;
}

export interface PolynomialRegressionResult {
  coefficients: number[];
  r2: number;
  equation: string;
  predict: (x: number) => number;
  residuals: number[];
}

export interface ExponentialRegressionResult {
  a: number;
  b: number;
  equation: string;
  predict: (x: number) => number;
}

export interface PowerRegressionResult {
  a: number;
  b: number;
  equation: string;
  predict: (x: number) => number;
}

export interface LogisticRegressionResult {
  a: number;
  b: number;
  c: number;
  equation: string;
  predict: (x: number) => number;
}

export function linearRegression(x: number[], y: number[]): LinearRegressionResult {
  if (x.length !== y.length || x.length < 2) {
    throw new Error('Arrays must have same length and at least 2 points');
  }
  
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => {
    const yVal = y[i];
    if (yVal === undefined) {
      throw new Error('Invalid input: y array has undefined values');
    }
    return acc + xi * yVal;
  }, 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  
  const meanX = sumX / n;
  const meanY = sumY / n;
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = n * sumX2 - sumX * sumX;
  
  if (Math.abs(denominator) < 1e-10) {
    throw new Error('Vertical line - infinite slope');
  }
  
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  
  const ssRes = y.reduce((acc, yi, i) => {
    const xVal = x[i];
    if (xVal === undefined) {
      throw new Error('Invalid input: x array has undefined values');
    }
    const predicted = slope * xVal + intercept;
    return acc + Math.pow(yi - predicted, 2);
  }, 0);
  
  const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - meanY, 2), 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  const r = Math.sqrt(r2) * (slope >= 0 ? 1 : -1);
  
  const predict = (val: number) => slope * val + intercept;
  
  const residuals = y.map((yi, i) => {
    const xVal = x[i];
    if (xVal === undefined) {
      throw new Error('Invalid input: x array has undefined values');
    }
    return yi - predict(xVal);
  });
  
  const mse = ssRes / (n - 2);
  const rmse = Math.sqrt(mse);
  const mae = residuals.reduce((acc, r) => acc + Math.abs(r), 0) / n;
  
  return {
    slope,
    intercept,
    r2,
    r,
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
    predict,
    residuals,
    mse,
    rmse,
    mae
  };
}

export function polynomialRegression(x: number[], y: number[], degree: number): PolynomialRegressionResult {
  if (x.length !== y.length || x.length <= degree) {
    throw new Error('Insufficient data points for regression');
  }
  
  const n = x.length;
  
  // Precompute all powers O(degree × n) - much more efficient
  const powers: number[][] = Array(degree * 2 + 1).fill(null).map(() => []);
  for (let i = 0; i < n; i++) {
    const xVal = x[i];
    if (xVal === undefined) {
      throw new Error('Invalid input: x array has undefined values');
    }
    const power0 = powers[0];
    if (power0 === undefined) {
      throw new Error('Invalid powers array');
    }
    power0[i] = 1;
    for (let p = 1; p <= degree * 2; p++) {
      const powerP = powers[p];
      const powerPPrev = powers[p - 1];
      if (powerP === undefined || powerPPrev === undefined) {
        throw new Error('Invalid powers array');
      }
      const powerPPrevI = powerPPrev[i];
      if (powerPPrevI === undefined) {
        throw new Error('Invalid powers array');
      }
      powerP[i] = powerPPrevI * xVal;
    }
  }
  
  // Build normal equations with better cache usage
  const matrix: number[][] = Array(degree + 1).fill(null).map(() => Array(degree + 1).fill(0));
  const vector: number[] = Array(degree + 1).fill(0);
  
  for (let i = 0; i <= degree; i++) {
    const powerI = powers[i];
    if (powerI === undefined) {
      throw new Error('Invalid powers array');
    }
    let vecI = vector[i];
    if (vecI === undefined) {
      throw new Error('Invalid vector: element is undefined');
    }
    for (let k = 0; k < n; k++) {
      const yVal = y[k];
      const powerIK = powerI[k];
      if (yVal === undefined || powerIK === undefined) {
        throw new Error('Invalid input: array has undefined values');
      }
      vecI += yVal * powerIK;
    }
    vector[i] = vecI;
    for (let j = i; j <= degree; j++) {
      const powerJ = powers[j];
      if (powerJ === undefined) {
        throw new Error('Invalid powers array');
      }
      let sum = 0;
      for (let k = 0; k < n; k++) {
        const powerIK = powerI[k];
        const powerJK = powerJ[k];
        if (powerIK === undefined || powerJK === undefined) {
          throw new Error('Invalid powers array');
        }
        sum += powerIK * powerJK;
      }
      const matrixRow = matrix[i];
      const matrixJRow = matrix[j];
      if (matrixRow === undefined || matrixJRow === undefined) {
        throw new Error('Invalid matrix');
      }
      matrixRow[j] = matrixJRow[i] = sum;
    }
  }
  
  const coeffs = gaussianElimination(matrix, vector);
  
  const predict = (val: number): number => {
    const firstCoeff = coeffs[0];
    if (firstCoeff === undefined) {
      throw new Error('Invalid coefficients');
    }
    let result = firstCoeff;
    let power = 1;
    for (let i = 1; i <= degree; i++) {
      power *= val;
      const coeff = coeffs[i];
      if (coeff === undefined) {
        throw new Error('Invalid coefficients');
      }
      result += coeff * power;
    }
    return result;
  };
  
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - meanY, 2), 0);
  const residuals = y.map((yi, i) => {
    const xVal = x[i];
    if (xVal === undefined) {
      throw new Error('Invalid input: x array has undefined values');
    }
    return yi - predict(xVal);
  });
  const ssRes = residuals.reduce((acc, r) => acc + r * r, 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  
  const equation = `y = ${coeffs.map((c, i) => 
    i === 0 ? c.toFixed(4) : 
    i === 1 ? `${c >= 0 ? '+' : ''}${c.toFixed(4)}x` : 
    `${c >= 0 ? '+' : ''}${c.toFixed(4)}x^${i}`
  ).join(' ')}`;
  
  return {
    coefficients: coeffs,
    r2,
    equation,
    predict,
    residuals
  };
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
        throw new Error('Invalid matrix: row is undefined');
      }
      const augKI = augK[i];
      const augMaxRowI = augMaxRow[i];
      if (augKI === undefined || augMaxRowI === undefined) {
        throw new Error('Invalid matrix: element is undefined');
      }
      if (Math.abs(augKI) > Math.abs(augMaxRowI)) {
        maxRow = k;
      }
    }
    const augRowI = aug[i];
    const augRowMaxRow = aug[maxRow];
    if (augRowI === undefined || augRowMaxRow === undefined) {
      throw new Error('Invalid matrix: row is undefined');
    }
    [aug[i], aug[maxRow]] = [augRowMaxRow, augRowI];
    
    const augI = aug[i];
    if (augI === undefined) {
      throw new Error('Invalid matrix: row is undefined');
    }
    const augII = augI[i];
    if (augII === undefined) {
      throw new Error('Invalid matrix: element is undefined');
    }
    if (Math.abs(augII) < 1e-10) continue;
    
    for (let k = i + 1; k < n; k++) {
      const augK = aug[k];
      if (augK === undefined) {
        throw new Error('Invalid matrix: row is undefined');
      }
      const augKI = augK[i];
      if (augKI === undefined) {
        throw new Error('Invalid matrix: element is undefined');
      }
      const factor = augKI / augII;
      for (let j = i; j <= n; j++) {
        const augKJ = augK[j];
        const augIJ = augI[j];
        if (augKJ === undefined || augIJ === undefined) {
          throw new Error('Invalid matrix: element is undefined');
        }
        augK[j] = augKJ - factor * augIJ;
      }
    }
  }
  
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const augI = aug[i];
    if (augI === undefined) {
      throw new Error('Invalid matrix: row is undefined');
    }
    let sum = augI[n];
    if (sum === undefined) {
      throw new Error('Invalid matrix: augmented value is undefined');
    }
    for (let j = i + 1; j < n; j++) {
      const xJ = x[j];
      const augIJ = augI[j];
      if (augIJ === undefined) {
        throw new Error('Invalid matrix: element is undefined');
      }
      sum -= augIJ * xJ;
    }
    const augII = augI[i];
    if (augII === undefined) {
      throw new Error('Invalid matrix: element is undefined');
    }
    x[i] = Math.abs(augII) < 1e-10 ? 0 : sum / augII;
  }
  
  return x;
}

export function exponentialRegression(x: number[], y: number[]): ExponentialRegressionResult {
  if (x.length !== y.length || y.some(v => v <= 0)) {
    throw new Error('All y values must be positive');
  }
  
  const lnY = y.map(v => Math.log(v));
  const linReg = linearRegression(x, lnY);
  
  const b = linReg.slope;
  const a = Math.exp(linReg.intercept);
  
  const predict = (val: number) => a * Math.exp(b * val);
  
  const equation = `y = ${a.toFixed(4)} * e^(${b.toFixed(4)}x)`;
  
  return { a, b, equation, predict };
}

export function powerRegression(x: number[], y: number[]): PowerRegressionResult {
  if (x.length !== y.length || x.some(v => v <= 0) || y.some(v => v <= 0)) {
    throw new Error('All x and y values must be positive');
  }
  
  const lnX = x.map(v => Math.log(v));
  const lnY = y.map(v => Math.log(v));
  const linReg = linearRegression(lnX, lnY);
  
  const b = linReg.slope;
  const a = Math.exp(linReg.intercept);
  
  const predict = (val: number) => a * Math.pow(val, b);
  
  const equation = `y = ${a.toFixed(4)} * x^${b.toFixed(4)}`;
  
  return { a, b, equation, predict };
}

export function logisticRegression(x: number[], y: number[]): LogisticRegressionResult {
  if (x.length !== y.length || y.some(v => v < 0 || v > 1)) {
    throw new Error('Y values must be binary (0 or 1)');
  }
  
  const maxY = Math.max(...y);
  const minY = Math.min(...y);
  
  const a = maxY - minY;
  const c = minY;
  
  let b = 0.1;
  let k = 0.1;
  
  for (let iter = 0; iter < 1000; iter++) {
    const prevB = b;
    const prevK = k;
    
    let sum1 = 0;
    let sum2 = 0;
    let sum3 = 0;
    let sum4 = 0;
    
    for (let i = 0; i < x.length; i++) {
      const xVal = x[i];
      const yVal = y[i];
      if (xVal === undefined || yVal === undefined) {
        throw new Error('Invalid input: arrays have undefined values');
      }
      const denom = 1 + Math.exp(-k * (xVal - b));
      const p = (a / denom) + c;
      const err = yVal - p;
      
      sum1 += err;
      sum2 += err * xVal;
      sum3 += err * (a * Math.exp(-k * (xVal - b)) / (denom * denom));
      sum4 += err * xVal * (a * Math.exp(-k * (xVal - b)) / (denom * denom));
    }
    
    const lr = 0.01;
    b += lr * sum1;
    k += lr * (sum2 - k * sum3 / a);
    
    if (Math.abs(b - prevB) < 1e-6 && Math.abs(k - prevK) < 1e-6) break;
  }
  
  const predict = (val: number) => (a / (1 + Math.exp(-k * (val - b)))) + c;
  
  const equation = `y = ${a.toFixed(4)} / (1 + e^(-${k.toFixed(4)}(x - ${b.toFixed(4)}))) + ${c.toFixed(4)}`;
  
  return { a, b: k, c, equation, predict };
}

export function theilSenRegression(x: number[], y: number[], maxSamples: number = 10000): { slope: number; intercept: number } {
  if (x.length !== y.length || x.length < 2) {
    throw new Error('Arrays must have same length and at least 2 points');
  }
  
  const n = x.length;
  const totalPairs = (n * (n - 1)) / 2;
  
  let slopes: number[];
  
  if (totalPairs <= maxSamples) {
    // Full computation for small n
    slopes = [];
    for (let i = 0; i < n; i++) {
      const xI = x[i];
      const yI = y[i];
      if (xI === undefined || yI === undefined) {
        throw new Error('Invalid input: arrays have undefined values');
      }
      for (let j = i + 1; j < n; j++) {
        const xJ = x[j];
        const yJ = y[j];
        if (xJ === undefined || yJ === undefined) {
          throw new Error('Invalid input: arrays have undefined values');
        }
        if (xJ !== xI) {
          slopes.push((yJ - yI) / (xJ - xI));
        }
      }
    }
  } else {
    // Random sampling for large n - O(maxSamples) instead of O(n²)
    slopes = [];
    for (let s = 0; s < maxSamples; s++) {
      const i = Math.floor(Math.random() * n);
      const j = Math.floor(Math.random() * n);
      const xI = x[i];
      const yI = y[i];
      const xJ = x[j];
      const yJ = y[j];
      if (xI === undefined || yI === undefined || xJ === undefined || yJ === undefined) {
        throw new Error('Invalid input: arrays have undefined values');
      }
      if (i !== j && xJ !== xI) {
        slopes.push((yJ - yI) / (xJ - xI));
      }
    }
  }
  
  if (slopes.length === 0) {
    return { slope: 0, intercept: mean(y) };
  }
  
  slopes.sort((a, b) => a - b);
  const medianSlope = slopes[Math.floor(slopes.length / 2)];
  if (medianSlope === undefined) {
    throw new Error('Invalid median slope calculation');
  }
  
  const intercepts = x.map((xi, i) => {
    const yVal = y[i];
    if (yVal === undefined) {
      throw new Error('Invalid input: y array has undefined values');
    }
    return yVal - medianSlope * xi;
  });
  intercepts.sort((a, b) => a - b);
  const medianIntercept = intercepts[Math.floor(intercepts.length / 2)];
  if (medianIntercept === undefined) {
    throw new Error('Invalid median intercept calculation');
  }
  
  return { slope: medianSlope, intercept: medianIntercept };
}

export function robustRegression(x: number[], y: number[]): LinearRegressionResult {
  const { slope, intercept } = theilSenRegression(x, y);
  
  const predict = (val: number) => slope * val + intercept;
  
  const residuals = y.map((yi, i) => {
    const xVal = x[i];
    if (xVal === undefined) {
      throw new Error('Invalid input: x array has undefined values');
    }
    return yi - predict(xVal);
  });
  const n = x.length;
  
  const ssRes = residuals.reduce((acc, r) => acc + r * r, 0);
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - meanY, 2), 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  const r = Math.sqrt(r2) * (slope >= 0 ? 1 : -1);
  
  return {
    slope,
    intercept,
    r2,
    r,
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
    predict,
    residuals,
    mse: ssRes / (n - 2),
    rmse: Math.sqrt(ssRes / (n - 2)),
    mae: residuals.reduce((acc, r) => acc + Math.abs(r), 0) / n
  };
}
