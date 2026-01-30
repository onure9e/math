// Centralized type definitions for @onurege3467/math

// Core types
export interface Vector {
  dimension: number;
  get(index: number): number;
  add(other: Vector): Vector;
  subtract(other: Vector): Vector;
  multiply(scalar: number): Vector;
  dot(other: Vector): number;
  magnitude(): number;
  normalize(): Vector;
  toArray(): number[];
}

export interface Matrix {
  rows: number;
  cols: number;
  get(row: number, col: number): number;
  set(row: number, col: number, value: number): void;
  add(other: Matrix): Matrix;
  subtract(other: Matrix): Matrix;
  multiply(other: Matrix | number): Matrix;
  transpose(): Matrix;
  determinant(): number;
  inverse(): Matrix | null;
  toArray(): number[][];
}

export interface Complex {
  real: number;
  imag: number;
  add(other: Complex): Complex;
  subtract(other: Complex): Complex;
  multiply(other: Complex): Complex;
  divide(other: Complex): Complex;
  conjugate(): Complex;
  magnitude(): number;
  phase(): number;
  toString(): string;
}

export interface Polynomial {
  coefficients: number[];
  degree: number;
  evaluate(x: number): number;
  add(other: Polynomial): Polynomial;
  subtract(other: Polynomial): Polynomial;
  multiply(other: Polynomial): Polynomial;
  derivative(): Polynomial;
  integral(): Polynomial;
  roots(): number[];
  toString(): string;
}

export interface Fraction {
  numerator: number;
  denominator: number;
  simplify(): Fraction;
  add(other: Fraction): Fraction;
  subtract(other: Fraction): Fraction;
  multiply(other: Fraction): Fraction;
  divide(other: Fraction): Fraction;
  toString(): string;
  toNumber(): number;
}

// Statistics types
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

// Probability types
export interface DistributionResult {
  mean: number;
  variance: number;
  stdDev: number;
  pdf?: (x: number) => number;
  cdf?: (x: number) => number;
  sample: () => number;
}

// Calculus types
export interface IntegrationResult {
  value: number;
  error: number;
  iterations: number;
}

export interface DifferentiationResult {
  value: number;
  error: number;
  method: string;
}

// Optimization types
export interface OptimizationResult {
  minimum: number;
  argmin: number[];
  iterations: number;
  converged: boolean;
  error: number;
}

// Geometry types
export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Line {
  point: Point2D;
  direction: Point2D;
}

export interface Circle {
  center: Point2D;
  radius: number;
}

export interface Sphere {
  center: Point3D;
  radius: number;
}

// Number theory types
export interface PrimeFactorization {
  prime: number;
  exponent: number;
}

export interface GCDResult {
  gcd: number;
  x: number;
  y: number;
}

// Error types
export class MathError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'MathError';
  }
}

export class DomainError extends MathError {
  constructor(message: string) {
    super(message, 'DOMAIN_ERROR');
    this.name = 'DomainError';
  }
}

export class RangeError extends MathError {
  constructor(message: string) {
    super(message, 'RANGE_ERROR');
    this.name = 'RangeError';
  }
}

export class ConvergenceError extends MathError {
  constructor(message: string) {
    super(message, 'CONVERGENCE_ERROR');
    this.name = 'ConvergenceError';
  }
}
