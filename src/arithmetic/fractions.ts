import { gcd } from './operations';
import { Fraction, FractionResult } from './types';

export function fraction(numerator: number, denominator: number = 1): FractionResult {
  if (denominator === 0) throw new Error('Denominator cannot be zero');
  
  let num = numerator;
  let den = denominator;
  
  if (den < 0) {
    num = -num;
    den = -den;
  }
  
  if (num === 0) {
    return { value: 0, fraction: { numerator: 0, denominator: 1 } };
  }
  
  const sign = (num < 0) ? -1 : 1;
  num = Math.abs(num);
  
  const common = gcd(num, den);
  num /= common;
  den /= common;
  
  const value = (sign * num) / den;
  
  if (num >= den) {
    const whole = Math.floor(num / den);
    const remainder = num % den;
    return {
      value,
      fraction: { numerator: num, denominator: den },
      mixedNumber: { whole, numerator: remainder, denominator: den }
    };
  }
  
  return { value, fraction: { numerator: num, denominator: den } };
}

export function addFractions(
  n1: number, d1: number,
  n2: number, d2: number
): FractionResult {
  const num = n1 * d2 + n2 * d1;
  const den = d1 * d2;
  return fraction(num, den);
}

export function subtractFractions(
  n1: number, d1: number,
  n2: number, d2: number
): FractionResult {
  const num = n1 * d2 - n2 * d1;
  const den = d1 * d2;
  return fraction(num, den);
}

export function multiplyFractions(
  n1: number, d1: number,
  n2: number, d2: number
): FractionResult {
  const num = n1 * n2;
  const den = d1 * d2;
  return fraction(num, den);
}

export function divideFractions(
  n1: number, d1: number,
  n2: number, d2: number
): FractionResult {
  if (n2 === 0) throw new Error('Cannot divide by zero fraction');
  const num = n1 * d2;
  const den = d1 * n2;
  return fraction(num, den);
}

export function fractionToDecimal(frac: Fraction): number {
  return frac.numerator / frac.denominator;
}

export function decimalToFraction(
  value: number,
  maxDenominator: number = 1000
): Fraction {
  if (!Number.isFinite(value)) throw new Error('Cannot convert non-finite number');
  
  const sign = value < 0 ? -1 : 1;
  value = Math.abs(value);
  
  const intPart = Math.floor(value);
  const fracPart = value - intPart;
  
  if (fracPart === 0) {
    return { numerator: intPart * sign, denominator: 1 };
  }
  
  let bestNum = 1;
  let bestDen = 0;
  let bestError = fracPart;
  
  for (let d = 1; d <= maxDenominator; d++) {
    const n = Math.round(fracPart * d);
    const error = Math.abs(fracPart - n / d);
    if (error < bestError) {
      bestError = error;
      bestNum = n;
      bestDen = d;
      if (error < 1e-10) break;
    }
  }
  
  const num = intPart * bestDen + bestNum;
  return { numerator: num * sign, denominator: bestDen };
}

export function continuedFraction(
  value: number,
  maxTerms: number = 10
): number[] {
  if (!Number.isFinite(value)) throw new Error('Cannot convert non-finite number');
  
  const result: number[] = [];
  let current = value;
  
  for (let i = 0; i < maxTerms; i++) {
    const intPart = Math.floor(current);
    result.push(intPart);
    const fracPart = current - intPart;
    if (fracPart < 1e-10) break;
    current = 1 / fracPart;
  }
  
  return result;
}

export function continuedFractionToDecimal(coeffs: number[]): number {
  if (coeffs.length === 0) return 0;
  
  let result = coeffs[coeffs.length - 1];
  if (result === undefined) {
    throw new Error('Invalid continued fraction: coefficient is undefined');
  }
  for (let i = coeffs.length - 2; i >= 0; i--) {
    const coeff = coeffs[i];
    if (coeff === undefined) {
      throw new Error('Invalid continued fraction: coefficient is undefined');
    }
    result = coeff + 1 / result;
  }
  return result;
}

export function simplifyFraction(frac: Fraction): Fraction {
  return fraction(frac.numerator, frac.denominator).fraction;
}

export function fractionToMixedNumber(frac: Fraction): { whole: number; numerator: number; denominator: number } {
  return fraction(frac.numerator, frac.denominator).mixedNumber!;
}

export function mixedNumberToFraction(mixed: { whole: number; numerator: number; denominator: number }): Fraction {
  const num = mixed.whole * mixed.denominator + mixed.numerator;
  return { numerator: num, denominator: mixed.denominator };
}

export function compareFractions(
  n1: number, d1: number,
  n2: number, d2: number
): number {
  const lhs = n1 * d2;
  const rhs = n2 * d1;
  if (lhs < rhs) return -1;
  if (lhs > rhs) return 1;
  return 0;
}

export function isProperFraction(frac: Fraction): boolean {
  return Math.abs(frac.numerator) < frac.denominator;
}

export function isUnitFraction(frac: Fraction): boolean {
  return frac.numerator === 1 && frac.denominator > 1;
}

export function egyptianFraction(frac: Fraction, maxTerms: number = 10): Fraction[] {
  if (frac.numerator === 0) return [];
  
  const result: Fraction[] = [];
  let remaining: Fraction = frac;
  
  for (let i = 0; i < maxTerms; i++) {
    if (remaining.numerator === 0) break;
    if (remaining.numerator < 0) throw new Error('Negative fractions not supported');
    
    const ceilDen = Math.ceil(remaining.denominator / remaining.numerator);
    const unitFrac = { numerator: 1, denominator: ceilDen };
    result.push(unitFrac);
    
    const newNum = remaining.numerator * ceilDen - remaining.denominator;
    const newDen = remaining.denominator * ceilDen;
    remaining = { numerator: newNum, denominator: newDen };
    
    if (newNum === 0) break;
  }
  
  return result;
}

export function partialFractions(
  numerator: number[],
  denominator: number[]
): { constants: number[]; factors: number[] } {
  if (denominator.length === 0) throw new Error('Denominator cannot be empty');
  if (numerator.length >= denominator.length) {
    const quotient = polynomialDivision(numerator, denominator);
    numerator = quotient.remainder;
  }
  
  const constants: number[] = [];
  const factors: number[] = [];
  
  let currentDen = [...denominator];
  
  while (currentDen.length > 1) {
    const root = findRealRoot(currentDen);
    if (root === null) break;
    
    const factor = [-root, 1];
    const division = polynomialDivision(numerator, factor);
    const firstQuotient = division.quotient[0];
    const firstDen = currentDen[0];
    if (firstQuotient === undefined || firstDen === undefined) {
      throw new Error('Invalid polynomial division result');
    }
    const residue = firstQuotient / firstDen;
    constants.push(residue);
    factors.push(root);
    
    numerator = division.remainder;
    currentDen = polynomialDivision(currentDen, factor).remainder;
    
    if (currentDen.length === 1) break;
  }
  
  return { constants, factors };
}

function polynomialDivision(
  a: number[],
  b: number[]
): { quotient: number[]; remainder: number[] } {
  const aCopy = [...a];
  const result: number[] = new Array(Math.max(0, a.length - b.length + 1)).fill(0);
  
  const leadB = b[0];
  if (leadB === undefined) {
    throw new Error('Invalid polynomial: divisor cannot be empty');
  }
  const factorIdx = result.length - 1;
  
  for (let i = a.length - 1; i >= b.length - 1; i--) {
    const aVal = aCopy[i];
    if (aVal === undefined) {
      throw new Error('Invalid polynomial: coefficient is undefined');
    }
    const factor = aVal / leadB;
    result[factorIdx - (i - (b.length - 1))] = factor;
    
    for (let j = 0; j < b.length; j++) {
      const bVal = b[j];
      const aIdx = i - b.length + 1 + j;
      const aTarget = aCopy[aIdx];
      if (bVal === undefined || aTarget === undefined) {
        throw new Error('Invalid polynomial: coefficient is undefined');
      }
      aCopy[aIdx] = aTarget - factor * bVal;
    }
  }
  
  const remainder = aCopy.slice(0, b.length - 1);
  
  return {
    quotient: result.length > 0 ? result : [0],
    remainder: remainder.length > 0 ? remainder : [0]
  };
}

function findRealRoot(poly: number[]): number | null {
  if (poly.length < 2) return null;
  const firstCoeff = poly[0];
  const secondCoeff = poly[1];
  if (firstCoeff === undefined || secondCoeff === undefined) {
    throw new Error('Invalid polynomial: coefficient is undefined');
  }
  if (poly.length === 2) return -secondCoeff / firstCoeff;
  
  for (let i = 1; i <= 100; i++) {
    const x = i;
    let value = 0;
    for (let j = 0; j < poly.length; j++) {
      const coeff = poly[j];
      if (coeff === undefined) {
        throw new Error('Invalid polynomial: coefficient is undefined');
      }
      value += coeff * Math.pow(x, poly.length - 1 - j);
    }
    if (Math.abs(value) < 1e-10) return x;
  }
  
  return null;
}
