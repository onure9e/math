export interface IntegralResult {
  value: number;
  error: number;
}

export function integral(
  f: (x: number) => number,
  a: number,
  b: number,
  method: 'trapezoid' | 'simpson' | 'romberg' | 'adaptive' = 'simpson',
  partitions: number = 1000
): IntegralResult {
  switch (method) {
    case 'trapezoid':
      return trapezoidRule(f, a, b, partitions);
    case 'simpson':
      return simpsonRule(f, a, b, partitions);
    case 'romberg':
      return rombergIntegration(f, a, b, 5);
    case 'adaptive':
      return adaptiveQuadrature(f, a, b, 1e-10);
    default:
      return simpsonRule(f, a, b, partitions);
  }
}

export function trapezoidRule(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number = 1000
): IntegralResult {
  const h = (b - a) / n;
  let sum = (f(a) + f(b)) / 2;
  
  for (let i = 1; i < n; i++) {
    sum += f(a + i * h);
  }
  
  const value = sum * h;
  
  return { value, error: 0 };
}

export function simpsonRule(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number = 1000
): IntegralResult {
  if (n % 2 === 1) n++;
  
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * f(x);
  }
  
  const value = sum * h / 3;
  
  return { value, error: 0 };
}

export function simpsonThreeEighths(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number = 3
): IntegralResult {
  if (n % 3 !== 0) n += 3 - (n % 3);
  
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    const coef = i % 3 === 0 ? 2 : 3;
    sum += coef * f(x);
  }
  
  const value = sum * 3 * h / 8;
  
  return { value, error: 0 };
}

export function boolesRule(
  f: (x: number) => number,
  a: number,
  b: number
): IntegralResult {
  const n = 4;
  const h = (b - a) / n;
  
  const x0 = f(a);
  const x1 = f(a + h);
  const x2 = f(a + 2 * h);
  const x3 = f(a + 3 * h);
  const x4 = f(b);
  
  const value = (2 * h / 45) * (
    7 * x0 + 32 * x1 + 12 * x2 + 32 * x3 + 7 * x4
  );
  
  return { value, error: 0 };
}

export function milneRule(
  f: (x: number) => number,
  a: number,
  b: number
): IntegralResult {
  const n = 4;
  const h = (b - a) / n;
  
  const points: number[] = [];
  for (let i = 0; i <= n; i++) {
    points.push(f(a + i * h));
  }
  
  if (points.length < 5) {
    throw new Error('Milne rule requires at least 5 points');
  }
  const p0 = points[0];
  const p1 = points[1];
  const p2 = points[2];
  const p3 = points[3];
  const p4 = points[4];
  if (p0 === undefined || p1 === undefined || p2 === undefined || p3 === undefined || p4 === undefined) {
    throw new Error('Invalid points array: contains undefined values');
  }
  const value = (2 * h / 90) * (
    7 * p0 + 32 * p1 + 12 * p2 + 32 * p3 + 7 * p4
  );
  
  return { value, error: 0 };
}

export function gaussianQuadrature(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number = 5
): IntegralResult {
  const nodes = [-0.9061798459, -0.5384693101, 0, 0.5384693101, 0.9061798459];
  const weights = [0.2369268851, 0.4786286705, 0.5688888889, 0.4786286705, 0.2369268851];
  
  const transformed = nodes.map(x => ((b - a) * x + a + b) / 2);
  const scaledWeights = weights.map(w => w * (b - a) / 2);
  
  let value = 0;
  for (let i = 0; i < n; i++) {
    const w = scaledWeights[i];
    const t = transformed[i];
    if (w === undefined || t === undefined) {
      throw new Error('Invalid Gaussian quadrature: weights or nodes contain undefined values');
    }
    value += w * f(t);
  }
  
  return { value, error: 0 };
}

export function rombergIntegration(
  f: (x: number) => number,
  a: number,
  b: number,
  order: number = 5
): IntegralResult {
  const R: number[][] = [];
  
  for (let k = 0; k < order; k++) {
    R[k] = [];
    const n = Math.pow(2, k);
    const h = (b - a) / n;
    
    let sum = (f(a) + f(b)) / 2;
    for (let i = 1; i < n; i++) {
      sum += f(a + i * h);
    }
    const row = R[k];
    if (row === undefined) {
      throw new Error('Invalid Romberg integration: row is undefined');
    }
    row[0] = sum * h;
    
    for (let j = 1; j <= k; j++) {
      const prevVal = row[j - 1];
      const prevRow = R[k - 1];
      if (prevRow === undefined) {
        throw new Error('Invalid Romberg integration: previous row is undefined');
      }
      const prevRowVal = prevRow[j - 1];
      if (prevVal === undefined || prevRowVal === undefined) {
        throw new Error('Invalid Romberg integration: value is undefined');
      }
      row[j] = prevVal + (prevVal - prevRowVal) / (Math.pow(4, j) - 1);
    }
  }
  
  const finalRow = R[order - 1];
  if (finalRow === undefined) {
    throw new Error('Invalid Romberg integration: final row is undefined');
  }
  const value = finalRow[order - 1];
  if (value === undefined) {
    throw new Error('Invalid Romberg integration: final value is undefined');
  }
  
  return { value, error: 0 };
}

export function adaptiveQuadrature(
  f: (x: number) => number,
  a: number,
  b: number,
  tol: number = 1e-10
): IntegralResult {
  function recursive(a: number, b: number, tol: number, whole: number): { value: number; error: number } {
    const c = (a + b) / 2;
    const left = simpsonRule(f, a, c, 2);
    const right = simpsonRule(f, c, b, 2);
    
    const delta = left.value + right.value - whole;
    
    if (Math.abs(delta) <= 15 * tol || Math.abs(b - a) < 1e-10) {
      const error = Math.abs(delta);
      return { value: left.value + right.value + delta / 15, error };
    }
    
    const leftResult = recursive(a, c, tol / 2, left.value);
    const rightResult = recursive(c, b, tol / 2, right.value);
    
    return {
      value: leftResult.value + rightResult.value,
      error: leftResult.error + rightResult.error
    };
  }
  
  const whole = simpsonRule(f, a, b, 2);
  return recursive(a, b, tol, whole.value);
}

export function doubleIntegral(
  f: (x: number, y: number) => number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  nx: number = 50,
  ny: number = 50
): number {
  const hx = (xMax - xMin) / nx;
  const hy = (yMax - yMin) / ny;
  
  let sum = 0;
  
  for (let i = 0; i <= nx; i++) {
    const x = xMin + i * hx;
    const wx = i === 0 || i === nx ? 1 : (i % 2 === 0 ? 2 : 4);
    
    for (let j = 0; j <= ny; j++) {
      const y = yMin + j * hy;
      const wy = j === 0 || j === ny ? 1 : (j % 2 === 0 ? 2 : 4);
      
      sum += wx * wy * f(x, y);
    }
  }
  
  return hx * hy * sum / 9;
}

export function tripleIntegral(
  f: (x: number, y: number, z: number) => number,
  xMin: number,
  xMax: number,
  yMin: number,
  _yMax: number,
  zMin: number,
  _zMax: number,
  n: number = 20
): number {
  const h = (xMax - xMin) / n;
  
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const x = xMin + i * h;
    const wx = i === 0 || i === n ? 1 : (i % 2 === 0 ? 2 : 4);
    
    for (let j = 0; j <= n; j++) {
      const y = yMin + j * h;
      const wy = j === 0 || j === n ? 1 : (j % 2 === 0 ? 2 : 4);
      
      for (let k = 0; k <= n; k++) {
        const z = zMin + k * h;
        const wz = k === 0 || k === n ? 1 : (k % 2 === 0 ? 2 : 4);
        
        sum += wx * wy * wz * f(x, y, z);
      }
    }
  }
  
  return Math.pow(h, 3) * sum / 27;
}

export function monteCarloIntegration(
  f: (x: number) => number,
  a: number,
  b: number,
  samples: number = 10000
): { value: number; error: number } {
  let sum = 0;
  let sumSq = 0;
  
  for (let i = 0; i < samples; i++) {
    const x = a + Math.random() * (b - a);
    const fx = f(x);
    sum += fx;
    sumSq += fx * fx;
  }
  
  const mean = sum / samples;
  const variance = (sumSq / samples - mean * mean) / samples;
  const error = Math.sqrt(Math.max(0, variance));
  
  return {
    value: mean * (b - a),
    error
  };
}

export function integratePolynomial(coeffs: number[]): number[] {
  const result: number[] = [0];
  for (let i = 0; i < coeffs.length; i++) {
    const c = coeffs[i];
    if (c === undefined) {
      throw new Error('Invalid polynomial coefficient: undefined value');
    }
    result.push(c / (i + 1));
  }
  return result;
}

export function integrateRational(
  numerator: number[],
  denominator: number[]
): { polynomial: number[]; partialFractions: { a: number; b: number }[] } {
  const polyResult = polynomialDivision(numerator, denominator);
  
  const degNum = polyResult.remainder.length - 1;
  const degDen = denominator.length - 1;
  
  if (degNum >= degDen) {
    const q = polynomialDivision(polyResult.remainder, denominator);
    return {
      polynomial: polyAdd(polyResult.quotient, q.quotient),
      partialFractions: decompose(q.remainder, denominator)
    };
  }
  
  return {
    polynomial: polyResult.quotient,
    partialFractions: decompose(polyResult.remainder, denominator)
  };
}

function polynomialDivision(a: number[], b: number[]): { quotient: number[]; remainder: number[] } {
  const result: number[] = new Array(Math.max(0, a.length - b.length + 1)).fill(0);
  let remainder = [...a];
  
  for (let i = result.length - 1; i >= 0; i--) {
    const remLast = remainder[remainder.length - 1];
    const bLast = b[b.length - 1];
    if (remLast === undefined || bLast === undefined) {
      throw new Error('Invalid polynomial division: coefficient is undefined');
    }
    result[i] = remLast / bLast;
    const resVal = result[i];
    if (resVal === undefined) {
      throw new Error('Invalid polynomial division: result is undefined');
    }
    for (let j = 0; j < b.length; j++) {
      const bVal = b[j];
      const remIdx = remainder.length - b.length + j;
      const remVal = remainder[remIdx];
      if (bVal === undefined || remVal === undefined) {
        throw new Error('Invalid polynomial division: coefficient is undefined');
      }
      remainder[remIdx] = remVal - resVal * bVal;
    }
    remainder = remainder.slice(0, -1);
  }
  
  return {
    quotient: trimPoly(result),
    remainder: trimPoly(remainder)
  };
}

function polyAdd(a: number[], b: number[]): number[] {
  const len = Math.max(a.length, b.length);
  const result: number[] = [];
  for (let i = 0; i < len; i++) {
    result.push((a[i] || 0) + (b[i] || 0));
  }
  return trimPoly(result);
}

function trimPoly(p: number[]): number[] {
  let len = p.length;
  while (len > 0) {
    const val = p[len - 1];
    if (val === undefined || Math.abs(val) >= 1e-15) break;
    len--;
  }
  return p.slice(0, len);
}

function decompose(numerator: number[], denominator: number[]): { a: number; b: number }[] {
  const fractions: { a: number; b: number }[] = [];
  
  for (let i = 0; i < denominator.length - 1; i++) {
    const dNext = denominator[i + 1];
    const dFirst = denominator[0];
    if (dNext === undefined || dFirst === undefined) {
      throw new Error('Invalid denominator: coefficient is undefined');
    }
    const root = -dNext / dFirst;
    const numVal = evalPolynomial(numerator, root);
    const denVal = evalPolynomialDerivative(denominator, root);
    
    fractions.push({
      a: numVal / denVal,
      b: root
    });
  }
  
  return fractions;
}

function evalPolynomial(coeffs: number[], x: number): number {
  let result = 0;
  for (let i = coeffs.length - 1; i >= 0; i--) {
    const c = coeffs[i];
    if (c === undefined) {
      throw new Error('Invalid polynomial: coefficient is undefined');
    }
    result = result * x + c;
  }
  return result;
}

function evalPolynomialDerivative(coeffs: number[], x: number): number {
  if (coeffs.length < 2) {
    const c = coeffs[0];
    return c === undefined ? 0 : c;
  }
  let result = 0;
  for (let i = coeffs.length - 1; i >= 1; i--) {
    const c = coeffs[i];
    if (c === undefined) {
      throw new Error('Invalid polynomial: coefficient is undefined');
    }
    result = result * x + i * c;
  }
  return result;
}
