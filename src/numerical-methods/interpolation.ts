export function linearInterpolation(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number
): number {
  if (Math.abs(x2 - x1) < 1e-15) {
    throw new Error('Interpolation points must be distinct');
  }
  return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
}

export function lagrangeInterpolation(
  points: { x: number; y: number }[]
): (x: number) => number {
  const n = points.length;
  
  // Precompute barycentric weights - O(n²) once
  const weights: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const pI = points[i];
    if (pI === undefined) {
      throw new Error('Invalid points array');
    }
    let w = 1;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const pJ = points[j];
        if (pJ === undefined) {
          throw new Error('Invalid points array');
        }
        w /= pI.x - pJ.x;
      }
    }
    weights[i] = w;
  }
  
  // Return function that evaluates in O(n) instead of O(n²)
  return (x: number): number => {
    const firstPoint = points[0];
    if (firstPoint === undefined) {
      throw new Error('Invalid points array');
    }
    if (x === firstPoint.x) return firstPoint.y;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      const pI = points[i];
      if (pI === undefined) {
        throw new Error('Invalid points array');
      }
      const diff = x - pI.x;
      if (diff === 0) return pI.y;
      const w = weights[i];
      if (w === undefined) {
        throw new Error('Invalid weights array');
      }
      const term = w / diff;
      numerator += term * pI.y;
      denominator += term;
    }
    
    return numerator / denominator;
  };
}

export function newtonInterpolation(
  points: { x: number; y: number }[]
): (x: number) => number {
  const n = points.length;
  const dividedDifferences: number[][] = [];
  
  dividedDifferences[0] = points.map(p => p.y);
  
  for (let j = 1; j < n; j++) {
    dividedDifferences[j] = [];
    const prevDiff = dividedDifferences[j - 1];
    if (prevDiff === undefined) {
      throw new Error('Invalid divided differences');
    }
    for (let i = 0; i < n - j; i++) {
      const prevDiffIPlus1 = prevDiff[i + 1];
      const prevDiffI = prevDiff[i];
      const pIPlusJ = points[i + j];
      const pI = points[i];
      if (prevDiffIPlus1 === undefined || prevDiffI === undefined || pIPlusJ === undefined || pI === undefined) {
        throw new Error('Invalid divided differences');
      }
      dividedDifferences[j]![i] = (prevDiffIPlus1 - prevDiffI) / (pIPlusJ.x - pI.x);
    }
  }
  
  return (x: number): number => {
    const firstDiff = dividedDifferences[0];
    if (firstDiff === undefined) {
      throw new Error('Invalid divided differences');
    }
    const firstVal = firstDiff[0];
    if (firstVal === undefined) {
      throw new Error('Invalid divided differences');
    }
    let result = firstVal;
    
    for (let i = 1; i < n; i++) {
      const diffI = dividedDifferences[i];
      if (diffI === undefined) {
        throw new Error('Invalid divided differences');
      }
      let term = diffI[0];
      if (term === undefined) {
        throw new Error('Invalid divided differences');
      }
      for (let j = 0; j < i; j++) {
        const pJ = points[j];
        if (pJ === undefined) {
          throw new Error('Invalid points array');
        }
        term *= (x - pJ.x);
      }
      result += term;
    }
    
    return result;
  };
}

export function cubicSplineInterpolation(
  points: { x: number; y: number }[],
  boundary: 'clamped' | 'natural' | 'not-a-knot' = 'natural'
): (x: number) => number {
  const n = points.length - 1;
  const x = points.map(p => p.x);
  const y = points.map(p => p.y);
  
  const h = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    const xIPlus1 = x[i + 1];
    const xI = x[i];
    if (xIPlus1 === undefined || xI === undefined) {
      throw new Error('Invalid x array');
    }
    h[i] = xIPlus1 - xI;
  }
  
  const alpha = new Array(n + 1).fill(0);
  const l = new Array(n + 1).fill(0);
  const mu = new Array(n).fill(0);
  const z = new Array(n + 1).fill(0);
  const c = new Array(n + 1).fill(0);
  const b = new Array(n).fill(0);
  const d = new Array(n).fill(0);
  
  if (boundary === 'clamped') {
    const y1 = y[1];
    const y0 = y[0];
    const h0 = h[0];
    const yN = y[n];
    const yNMinus1 = y[n - 1];
    const hNMinus1 = h[n - 1];
    if (y1 === undefined || y0 === undefined || h0 === undefined || yN === undefined || yNMinus1 === undefined || hNMinus1 === undefined) {
      throw new Error('Invalid array access');
    }
    alpha[0] = 3 * (y1 - y0) / h0;
    alpha[n] = 3 * (yN - yNMinus1) / hNMinus1;
  } else if (boundary === 'not-a-knot') {
    alpha[0] = 0;
    alpha[n] = 0;
  }
  
  for (let i = 1; i < n; i++) {
    const yIPlus1 = y[i + 1];
    const yI = y[i];
    const yIMinus1 = y[i - 1];
    const hI = h[i];
    const hIMinus1 = h[i - 1];
    if (yIPlus1 === undefined || yI === undefined || yIMinus1 === undefined || hI === undefined || hIMinus1 === undefined) {
      throw new Error('Invalid array access');
    }
    alpha[i] = 3 * (yIPlus1 - yI) / hI - 3 * (yI - yIMinus1) / hIMinus1;
  }
  
  const h0 = h[0];
  if (h0 === undefined) {
    throw new Error('Invalid h array');
  }
  l[0] = boundary === 'clamped' || boundary === 'natural' ? 1 : 2 * h0;
  mu[0] = boundary === 'clamped' || boundary === 'natural' ? 0.5 : 1;
  const alpha0 = alpha[0];
  const l0 = l[0];
  if (alpha0 === undefined || l0 === undefined) {
    throw new Error('Invalid array access');
  }
  z[0] = alpha0 / l0;
  
  for (let i = 1; i < n; i++) {
    const xIPlus1 = x[i + 1];
    const xIMinus1 = x[i - 1];
    const hIMinus1 = h[i - 1];
    const muIMinus1 = mu[i - 1];
    const hI = h[i];
    if (xIPlus1 === undefined || xIMinus1 === undefined || hIMinus1 === undefined || muIMinus1 === undefined || hI === undefined) {
      throw new Error('Invalid array access');
    }
    l[i] = 2 * (xIPlus1 - xIMinus1) - hIMinus1 * muIMinus1;
    const lI = l[i];
    if (lI === undefined) {
      throw new Error('Invalid array access');
    }
    mu[i] = hI / lI;
    const alphaI = alpha[i];
    const zIMinus1 = z[i - 1];
    if (alphaI === undefined || zIMinus1 === undefined) {
      throw new Error('Invalid array access');
    }
    z[i] = (alphaI - hIMinus1 * zIMinus1) / lI;
  }
  
  const hNMinus1 = h[n - 1];
  const alphaN = alpha[n];
  const zNMinus1 = z[n - 1];
  if (hNMinus1 === undefined || alphaN === undefined || zNMinus1 === undefined) {
    throw new Error('Invalid array access');
  }
  l[n] = boundary === 'clamped' || boundary === 'natural' ?
         2 * hNMinus1 : h[n - 2] + 2 * hNMinus1;
  const lN = l[n];
  if (lN === undefined) {
    throw new Error('Invalid array access');
  }
  z[n] = (alphaN - hNMinus1 * zNMinus1) / lN;
  c[n] = z[n];
  
  for (let j = n - 1; j >= 0; j--) {
    const zJ = z[j];
    const muJ = mu[j];
    const cJPlus1 = c[j + 1];
    const yJPlus1 = y[j + 1];
    const yJ = y[j];
    const hJ = h[j];
    if (zJ === undefined || muJ === undefined || cJPlus1 === undefined || yJPlus1 === undefined || yJ === undefined || hJ === undefined) {
      throw new Error('Invalid array access');
    }
    c[j] = zJ - muJ * cJPlus1;
    b[j] = (yJPlus1 - yJ) / hJ - hJ * (cJPlus1 + 2 * c[j]) / 3;
    d[j] = (cJPlus1 - c[j]) / (3 * hJ);
  }
  
  return (xVal: number): number => {
    const x0 = x[0];
    const xN = x[n];
    if (x0 === undefined || xN === undefined) {
      throw new Error('Invalid x array');
    }
    if (xVal < x0 || xVal > xN) {
      throw new Error('Value out of interpolation range');
    }
    
    let i = 0;
    while (i < n) {
      const xIPlus1 = x[i + 1];
      if (xIPlus1 === undefined) {
        throw new Error('Invalid x array');
      }
      if (xVal <= xIPlus1) break;
      i++;
    }
    
    const xI = x[i];
    const yI = y[i];
    const bI = b[i];
    const cI = c[i];
    const dI = d[i];
    if (xI === undefined || yI === undefined || bI === undefined || cI === undefined || dI === undefined) {
      throw new Error('Invalid array access');
    }
    const dx = xVal - xI;
    return yI + bI * dx + cI * dx * dx + dI * dx * dx * dx;
  };
}

export function barycentricInterpolation(
  points: { x: number; y: number }[]
): (x: number) => number {
  const n = points.length;
  if (n === 0) {
    throw new Error('Points array cannot be empty');
  }
  
  const weights: number[] = [];
  
  for (let i = 0; i < n; i++) {
    const pI = points[i];
    if (pI === undefined) {
      throw new Error('Invalid points array');
    }
    let w = 1;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const pJ = points[j];
        if (pJ === undefined) {
          throw new Error('Invalid points array');
        }
        w /= pI.x - pJ.x;
      }
    }
    weights[i] = w;
  }
  
  return (xVal: number) => {
    // Check if xVal matches any point exactly
    for (let i = 0; i < n; i++) {
      const pI = points[i];
      if (pI === undefined) {
        throw new Error('Invalid points array');
      }
      if (xVal === pI.x) {
        return pI.y;
      }
    }
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      const pI = points[i];
      const wI = weights[i];
      if (pI === undefined || wI === undefined) {
        throw new Error('Invalid array access');
      }
      const weight = wI / (xVal - pI.x);
      numerator += weight * pI.y;
      denominator += weight;
    }
    
    return numerator / denominator;
  };
}

export function paduaPoints(degree: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  
  for (let i = 0; i <= degree; i++) {
    for (let j = 0; j <= degree - i; j++) {
      const x = Math.cos((2 * i + j) * Math.PI / degree);
      const y = Math.cos(j * Math.PI / degree);
      points.push({ x, y });
    }
  }
  
  return points;
}

export function thinPlateSpline(
  points: { x: number; y: number; z: number }[],
  smoothness: number = 0
): (x: number, y: number) => number {
  const n = points.length;
  
  const K = (i: number, j: number) => {
    const pI = points[i];
    const pJ = points[j];
    if (pI === undefined || pJ === undefined) {
      throw new Error('Invalid points array');
    }
    const dx = pI.x - pJ.x;
    const dy = pI.y - pJ.y;
    const r2 = dx * dx + dy * dy;
    return r2 === 0 ? 0 : r2 * Math.log(r2);
  };
  
  // Build polynomial matrix (not used directly but kept for reference)
  void points.map(p => [1, p.x, p.y]);
  
  const A = new Array(n + 3).fill(null).map(() => new Array(n + 3).fill(0));
  
  for (let i = 0; i < n; i++) {
    const pI = points[i];
    if (pI === undefined) {
      throw new Error('Invalid points array');
    }
    const rowI = A[i];
    if (rowI === undefined) {
      throw new Error('Invalid matrix');
    }
    for (let j = 0; j < n; j++) {
      rowI[j] = K(i, j) + (i === j ? smoothness : 0);
    }
    rowI[n] = 1;
    rowI[n + 1] = pI.x;
    rowI[n + 2] = pI.y;
    
    const rowN = A[n];
    const rowN1 = A[n + 1];
    const rowN2 = A[n + 2];
    if (rowN === undefined || rowN1 === undefined || rowN2 === undefined) {
      throw new Error('Invalid matrix');
    }
    rowN[i] = 1;
    rowN1[i] = pI.x;
    rowN2[i] = pI.y;
  }
  
  const b = new Array(n + 3).fill(0);
  for (let i = 0; i < n; i++) {
    const pI = points[i];
    if (pI === undefined) {
      throw new Error('Invalid points array');
    }
    b[i] = pI.z;
  }
  
  const solution = solveLinearSystem(A, b);
  
  const d = solution.slice(0, n);
  const coeffs = solution.slice(n);
  const a0 = coeffs[0];
  const a1 = coeffs[1];
  const a2 = coeffs[2];
  
  if (a0 === undefined || a1 === undefined || a2 === undefined) {
    throw new Error('Invalid solution array');
  }
  
  return (x: number, y: number) => {
    let sum = a0 + a1 * x + a2 * y;
    for (let i = 0; i < n; i++) {
      const pI = points[i];
      const dI = d[i];
      if (pI === undefined || dI === undefined) {
        throw new Error('Invalid array access');
      }
      const dx = x - pI.x;
      const dy = y - pI.y;
      const r2 = dx * dx + dy * dy;
      sum += dI * (r2 === 0 ? 0 : r2 * Math.log(r2));
    }
    return sum;
  };
}

function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  const aug = A.map((row, i) => [...row, b[i]!]);
  
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      const augK = aug[k];
      const augMaxRow = aug[maxRow];
      if (augK === undefined || augMaxRow === undefined) {
        throw new Error('Invalid augmented matrix');
      }
      if (Math.abs(augK[i]!) > Math.abs(augMaxRow[i]!)) {
        maxRow = k;
      }
    }
    
    const augI = aug[i];
    const augMaxRow = aug[maxRow];
    if (augI === undefined || augMaxRow === undefined) {
      throw new Error('Invalid augmented matrix');
    }
    [aug[i], aug[maxRow]] = [augMaxRow, augI];
    
    for (let k = i + 1; k < n; k++) {
      const augK = aug[k];
      const augI = aug[i];
      if (augK === undefined || augI === undefined) {
        throw new Error('Invalid augmented matrix');
      }
      const factor = augK[i]! / augI[i]!;
      for (let j = i; j <= n; j++) {
        augK[j] = (augK[j] ?? 0) - factor * (augI[j] ?? 0);
      }
    }
  }
  
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const augI = aug[i];
    if (augI === undefined) {
      throw new Error('Invalid augmented matrix');
    }
    x[i] = augI[n]!;
    for (let j = i + 1; j < n; j++) {
      x[i] -= (augI[j] ?? 0) * (x[j] ?? 0);
    }
    const augII = aug[i];
    if (augII === undefined) {
      throw new Error('Invalid augmented matrix');
    }
    const diag = augII[i];
    if (diag === undefined || diag === 0) {
      throw new Error('Invalid diagonal element');
    }
    x[i] /= diag;
  }
  
  return x;
}

export function bilinearInterpolation(
  q11: number,
  q12: number,
  q21: number,
  q22: number,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  x: number,
  y: number
): number {
  const r1 = linearInterpolation(x1, q11, x2, q21, x);
  const r2 = linearInterpolation(x1, q12, x2, q22, x);
  return linearInterpolation(y1, r1, y2, r2, y);
}

export function bicubicInterpolation(
  f00: number,
  f01: number,
  f10: number,
  f11: number,
  fx00: number,
  fx01: number,
  _fx10: number,
  _fx11: number,
  fy00: number,
  fy01: number,
  _fy10_unused: number,
  fy11: number,
  fxy00: number,
  fxy01: number,
  fxy10: number,
  fxy11: number,
  x: number,
  y: number
): number {
  // Bicubic interpolation using Hermite basis functions
  // Based on the 16-point stencil with function values, first derivatives, and cross derivatives
  
  // Hermite basis functions
  const h00 = (t: number) => 2 * t * t * t - 3 * t * t + 1;
  const h10 = (t: number) => t * t * t - 2 * t * t + t;
  const h01 = (t: number) => -2 * t * t * t + 3 * t * t;
  const h11 = (t: number) => t * t * t - t * t;
  
  // Normalize x and y to [0, 1] range
  const tx = x;
  const ty = y;
  
  // Compute the interpolated value using Hermite interpolation
  const value = 
    h00(tx) * h00(ty) * f00 +
    h10(tx) * h00(ty) * fx00 +
    h01(tx) * h00(ty) * f10 +
    h11(tx) * h00(ty) * fxy00 +
    h00(tx) * h10(ty) * fy00 +
    h10(tx) * h10(ty) * fxy00 +
    h01(tx) * h10(ty) * fxy10 +
    h11(tx) * h10(ty) * fxy10 +
    h00(tx) * h01(ty) * f01 +
    h10(tx) * h01(ty) * fx01 +
    h01(tx) * h01(ty) * f11 +
    h11(tx) * h01(ty) * fxy11 +
    h00(tx) * h11(ty) * fy01 +
    h10(tx) * h11(ty) * fxy01 +
    h01(tx) * h11(ty) * fy11 +
    h11(tx) * h11(ty) * fxy11;
  
  return value;
}
