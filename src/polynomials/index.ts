export function polynomial(coeffs: number[]): Polynomial {
  return [...coeffs];
}

export function polyAdd(a: Polynomial, b: Polynomial): Polynomial {
  const len = Math.max(a.length, b.length);
  const result: number[] = new Array(len).fill(0);
  
  for (let i = 0; i < len; i++) {
    result[i] = (a[i] || 0) + (b[i] || 0);
  }
  
  return trimPolynomial(result);
}

export function polySub(a: Polynomial, b: Polynomial): Polynomial {
  const len = Math.max(a.length, b.length);
  const result: number[] = new Array(len).fill(0);
  
  for (let i = 0; i < len; i++) {
    result[i] = (a[i] || 0) - (b[i] || 0);
  }
  
  return trimPolynomial(result);
}

export function polyMult(a: Polynomial, b: Polynomial): Polynomial {
  if (a.length === 0 || b.length === 0) return [0];
  
  const result: number[] = new Array(a.length + b.length - 1).fill(0);
  
  for (let i = 0; i < a.length; i++) {
    const aVal = a[i];
    if (aVal === undefined) continue;
    for (let j = 0; j < b.length; j++) {
      const bVal = b[j];
      if (bVal === undefined) continue;
      result[i + j] = (result[i + j] || 0) + aVal * bVal;
    }
  }
  
  return trimPolynomial(result);
}

export function polyScale(p: Polynomial, scalar: number): Polynomial {
  return p.map(c => c * scalar);
}

export function polyEval(p: Polynomial, x: number): number {
  let result = 0;
  let power = 1;
  
  for (let i = 0; i < p.length; i++) {
    const coeff = p[i];
    if (coeff === undefined) continue;
    result += coeff * power;
    power *= x;
  }
  
  return result;
}

export function polyDerivative(p: Polynomial): Polynomial {
  if (p.length <= 1) return [0];
  
  const result: number[] = new Array(p.length - 1);
  for (let i = 1; i < p.length; i++) {
    const coeff = p[i];
    if (coeff === undefined) continue;
    result[i - 1] = coeff * i;
  }
  
  return trimPolynomial(result);
}

export function polyIntegral(p: Polynomial, C: number = 0): Polynomial {
  const result: number[] = new Array(p.length + 1);
  result[0] = C;
  
  for (let i = 0; i < p.length; i++) {
    const coeff = p[i];
    if (coeff === undefined) continue;
    result[i + 1] = coeff / (i + 1);
  }
  
  return trimPolynomial(result);
}

export function polyDivide(dividend: Polynomial, divisor: Polynomial): { quotient: Polynomial; remainder: Polynomial } {
  if (divisor.length === 0 || (divisor.length === 1 && divisor[0] === 0)) {
    throw new Error('Division by zero polynomial');
  }
  
  const dividendCopy = [...dividend];
  const divisorCopy = [...divisor];
  
  const quotient: number[] = new Array(Math.max(0, dividendCopy.length - divisorCopy.length + 1)).fill(0);
  
  const leadDivisor = divisorCopy[divisorCopy.length - 1];
  if (leadDivisor === undefined) throw new Error('Invalid divisor');

  while (dividendCopy.length >= divisorCopy.length) {
    const leadDividend = dividendCopy[dividendCopy.length - 1];
    if (leadDividend === undefined) break;
    const degreeDiff = dividendCopy.length - divisorCopy.length;
    const factor = leadDividend / leadDivisor;

    quotient[degreeDiff] = factor;

    for (let i = 0; i < divisorCopy.length; i++) {
      const divisorCoeff = divisorCopy[i];
      const targetIdx = degreeDiff + i;
      if (divisorCoeff === undefined || targetIdx < 0 || targetIdx >= dividendCopy.length) continue;
      dividendCopy[targetIdx] = (dividendCopy[targetIdx] || 0) - factor * divisorCoeff;
    }

    while (dividendCopy.length > 0) {
      const last = dividendCopy[dividendCopy.length - 1];
      if (last === undefined || Math.abs(last) >= 1e-15) break;
      dividendCopy.pop();
    }
  }
  
  return {
    quotient: trimPolynomial(quotient),
    remainder: trimPolynomial(dividendCopy.length > 0 ? dividendCopy : [0])
  };
}

export function polyModulo(dividend: Polynomial, divisor: Polynomial): Polynomial {
  return polyDivide(dividend, divisor).remainder;
}

export function polyGCD(a: Polynomial, b: Polynomial): Polynomial {
  a = trimPolynomial(a);
  b = trimPolynomial(b);
  
  if (a.length === 0) return b;
  if (b.length === 0) return a;
  
  while (b.length > 0 && !(b.length === 1 && b[0] === 0)) {
    const { remainder } = polyDivide(a, b);
    a = b;
    b = remainder;
  }
  
  const lead = a[a.length - 1];
  if (lead !== undefined && Math.abs(lead - 1) > 1e-15) {
    a = polyScale(a, 1 / lead);
  }
  
  return a;
}

export function polyLCM(a: Polynomial, b: Polynomial): Polynomial {
  const gcd = polyGCD(a, b);
  const product = polyMult(a, b);
  return polyDivide(product, gcd).quotient;
}

export function polyRoots(p: Polynomial): number[] {
  p = trimPolynomial(p);
  
  if (p.length === 0) return [];
  if (p.length === 1) return [];
  
  if (p.length === 2) {
    const p0 = p[0];
    const p1 = p[1];
    if (p0 === undefined || p1 === undefined) {
      throw new Error('Invalid polynomial coefficients');
    }
    if (p1 === 0) throw new Error('Not a valid linear polynomial');
    return [-p0 / p1];
  }
  
  if (p.length === 3) {
    const p0 = p[0];
    const p1 = p[1];
    const p2 = p[2];
    if (p0 === undefined || p1 === undefined || p2 === undefined) {
      throw new Error('Invalid polynomial coefficients');
    }
    return quadraticRoots(p2, p1, p0);
  }
  
  return findRoots(p);
}

function quadraticRoots(a: number, b: number, c: number): number[] {
  if (a === 0) return [-c / b];
  
  const discriminant = b * b - 4 * a * c;
  
  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    return [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)];
  }
  if (discriminant === 0) {
    return [-b / (2 * a)];
  }
  return [];
}

function findRoots(p: Polynomial): number[] {
  const roots: number[] = [];
  const epsilon = 1e-10;
  const maxIterations = 100;
  
  const deriv = polyDerivative(p);
  
  for (let i = 0; i < p.length - 1; i++) {
    let x = Math.random() * 10 - 5;
    
    for (let iter = 0; iter < maxIterations; iter++) {
      const fx = polyEval(p, x);
      const fpx = polyEval(deriv, x);
      
      if (Math.abs(fpx) < epsilon) break;
      
      const xNew = x - fx / fpx;
      
      if (Math.abs(xNew - x) < epsilon) {
        x = xNew;
        break;
      }
      
      x = xNew;
    }
    
    let isNewRoot = true;
    for (const r of roots) {
      if (Math.abs(r - x) < 0.01) {
        isNewRoot = false;
        break;
      }
    }
    
    if (isNewRoot && Math.abs(polyEval(p, x)) < 1e-5) {
      roots.push(x);
    }
  }
  
  return roots;
}

export function hornerMethod(p: Polynomial, x: number): { value: number; coefficients: number[] } {
  const lastCoeff = p[p.length - 1];
  if (lastCoeff === undefined) {
    throw new Error('Invalid polynomial');
  }
  const coeffs: number[] = [lastCoeff];
  
  for (let i = p.length - 2; i >= 0; i--) {
    const coeff = p[i];
    if (coeff === undefined) {
      throw new Error('Invalid polynomial coefficients');
    }
    const last = coeffs[coeffs.length - 1];
    if (last === undefined) {
      throw new Error('Invalid coefficients array');
    }
    coeffs.push(last * x + coeff);
  }
  
  const finalValue = coeffs[coeffs.length - 1];
  if (finalValue === undefined) {
    throw new Error('Invalid coefficients array');
  }
  
  return {
    value: finalValue,
    coefficients: coeffs.reverse()
  };
}

export function syntheticDivision(p: Polynomial, root: number): { quotient: Polynomial; remainder: number } {
  const coeffs: number[] = [...p];
  const firstCoeff = coeffs[0];
  const lastCoeff = coeffs[coeffs.length - 1];
  if (firstCoeff === undefined || lastCoeff === undefined) {
    throw new Error('Invalid polynomial coefficients');
  }
  const result: number[] = [firstCoeff];
  
  for (let i = 1; i < coeffs.length - 1; i++) {
    const coeff = coeffs[i];
    const prev = result[i - 1];
    if (coeff === undefined || prev === undefined) {
      throw new Error('Invalid coefficients array');
    }
    result.push(coeff + prev * root);
  }
  
  const lastResult = result[result.length - 1];
  if (lastResult === undefined) {
    throw new Error('Invalid result array');
  }
  const remainder = lastCoeff + lastResult * root;
  const quotient = result.slice(0, -1);
  
  return {
    quotient: trimPolynomial(quotient),
    remainder
  };
}

export function polyDegree(p: Polynomial): number {
  return p.length - 1;
}

export function polyLeadingCoefficient(p: Polynomial): number {
  const coeff = p[p.length - 1];
  if (coeff === undefined) {
    throw new Error('Invalid polynomial');
  }
  return coeff;
}

export function polyLeadingTerm(p: Polynomial): number {
  const term = p[p.length - 1];
  if (term === undefined) {
    throw new Error('Invalid polynomial');
  }
  return term;
}

export function polyIsMonic(p: Polynomial): boolean {
  return Math.abs(polyLeadingCoefficient(p) - 1) < 1e-15;
}

export function polyIsConstant(p: Polynomial): boolean {
  return p.length === 1;
}

export function polyIsZero(p: Polynomial): boolean {
  if (p.length === 0) return true;
  if (p.length === 1) {
    const coeff = p[0];
    return coeff !== undefined && Math.abs(coeff) < 1e-15;
  }
  return false;
}

export function polyMakeMonic(p: Polynomial): Polynomial {
  const lead = polyLeadingCoefficient(p);
  if (Math.abs(lead) < 1e-15) return p;
  return polyScale(p, 1 / lead);
}

export function polyCompose(p: Polynomial, q: Polynomial): Polynomial {
  let result: Polynomial = [0];
  
  for (let i = p.length - 1; i >= 0; i--) {
    const coeff = p[i];
    if (coeff === undefined) {
      throw new Error('Invalid polynomial coefficients');
    }
    result = polyAdd(polyMult(result, q), [coeff]);
  }
  
  return result;
}

export function polyShift(p: Polynomial, shift: number): Polynomial {
  return p.map((_, i) => {
    const coeff = p[i];
    if (coeff === undefined) {
      throw new Error('Invalid polynomial coefficients');
    }
    return coeff * Math.pow(shift, i);
  });
}

export function polyInterpolate(points: { x: number; y: number }[]): Polynomial {
  const n = points.length;
  if (n === 0) return [0];
  
  const basis: Polynomial[] = [];
  
  for (let i = 0; i < n; i++) {
    const pI = points[i];
    if (pI === undefined) {
      throw new Error('Invalid points array');
    }
    let poly: Polynomial = [1];
    
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const pJ = points[j];
        if (pJ === undefined) {
          throw new Error('Invalid points array');
        }
        const factor = 1 / (pI.x - pJ.x);
        poly = polyMult(poly, [-pJ.x * factor, factor]);
      }
    }
    
    basis.push(polyScale(poly, pI.y));
  }
  
  return basis.reduce((acc, p) => polyAdd(acc, p), [0]);
}

export function lagrangeInterpolation(points: { x: number; y: number }[]): (x: number) => number {
  return (x: number) => {
    let result = 0;
    
    for (let i = 0; i < points.length; i++) {
      const pI = points[i];
      if (pI === undefined) {
        throw new Error('Invalid points array');
      }
      let term = pI.y;
      
      for (let j = 0; j < points.length; j++) {
        if (i !== j) {
          const pJ = points[j];
          if (pJ === undefined) {
            throw new Error('Invalid points array');
          }
          term *= (x - pJ.x) / (pI.x - pJ.x);
        }
      }
      
      result += term;
    }
    
    return result;
  };
}

export function newtonInterpolation(points: { x: number; y: number }[]): Polynomial {
  const n = points.length;
  const dividedDifferences: number[][] = [];
  
  dividedDifferences[0] = points.map(p => p.y);
  
  for (let j = 1; j < n; j++) {
    dividedDifferences[j] = [];
    for (let i = 0; i < n - j; i++) {
      const pIPlusJ = points[i + j];
      const pI = points[i];
      const prevRow = dividedDifferences[j - 1];
      if (pIPlusJ === undefined || pI === undefined || prevRow === undefined) {
        throw new Error('Invalid array access');
      }
      const prevIPlus1 = prevRow[i + 1];
      const prevI = prevRow[i];
      if (prevIPlus1 === undefined || prevI === undefined) {
        throw new Error('Invalid divided differences');
      }
      dividedDifferences[j]![i] = (prevIPlus1 - prevI) / (pIPlusJ.x - pI.x);
    }
  }
  
  const coeffs = dividedDifferences.map(row => {
    const val = row[0];
    if (val === undefined) {
      throw new Error('Invalid divided differences');
    }
    return val;
  });
  
  const firstCoeff = coeffs[0];
  if (firstCoeff === undefined) {
    throw new Error('Invalid coefficients');
  }
  let result: Polynomial = [firstCoeff];
  
  for (let i = 1; i < n; i++) {
    const coeff = coeffs[i];
    if (coeff === undefined) {
      throw new Error('Invalid coefficients');
    }
    let basis: Polynomial = [1];
    for (let j = 0; j < i; j++) {
      const pJ = points[j];
      if (pJ === undefined) {
        throw new Error('Invalid points array');
      }
      basis = polyMult(basis, [-pJ.x, 1]);
    }
    result = polyAdd(result, polyScale(basis, coeff));
  }
  
  return result;
}

export function chebyshevNodes(n: number, a: number = -1, b: number = 1): number[] {
  const nodes: number[] = [];
  for (let i = 0; i < n; i++) {
    const theta = Math.PI * (2 * i + 1) / (2 * n);
    nodes.push((a + b) / 2 + (b - a) / 2 * Math.cos(theta));
  }
  return nodes;
}

export function chebyshevPolynomials(n: number): Polynomial {
  if (n === 0) return [1];
  if (n === 1) return [0, 1];
  
  let t0: Polynomial = [1];
  let t1: Polynomial = [0, 1];
  
  for (let i = 2; i <= n; i++) {
    const t2 = polySub(polyScale(polyMult([0, 2], t1), 1), t0);
    t0 = t1;
    t1 = t2;
  }
  
  return t1;
}

export function legendrePolynomials(n: number): Polynomial[] {
  const polynomials: Polynomial[] = [];
  
  polynomials.push([1]);
  if (n === 0) return polynomials;
  
  polynomials.push([0, 1]);
  if (n === 1) return polynomials;
  
  for (let i = 2; i <= n; i++) {
    const prev = polynomials[i - 1];
    const prev2 = polynomials[i - 2];
    if (prev === undefined || prev2 === undefined) {
      throw new Error('Invalid polynomials array');
    }
    
    const term1 = polyScale(prev, 2 * i - 1);
    const term2 = polyScale(polyShift(prev2, 1), i - 1);
    
    const p = polyDivScalar(polySub(term1, term2), i);
    polynomials.push(p);
  }
  
  return polynomials;
}

function polyDivScalar(p: Polynomial, s: number): Polynomial {
  return p.map(c => c / s);
}

function trimPolynomial(p: Polynomial): Polynomial {
  let len = p.length;
  while (len > 0) {
    const coeff = p[len - 1];
    if (coeff === undefined || Math.abs(coeff) >= 1e-15) {
      break;
    }
    len--;
  }
  return p.slice(0, len);
}

export interface Polynomial extends Array<number> {}
