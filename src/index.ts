// @onurege3467/math - Comprehensive Mathematics Library
// Main entry point - exports all modules with organized namespaces

// Core mathematical utilities
export * as Core from './core';

// Arithmetic operations
export * as Arithmetic from './arithmetic';

// Statistical analysis
export * as Statistics from './statistics';

// Probability theory
export * as Probability from './probability';

// Linear algebra (vectors, matrices)
export * as LinearAlgebra from './linear-algebra';

// Trigonometric functions
export * as Trigonometry from './trigonometry';

// Complex number operations
export * as ComplexNumbers from './complex-numbers';

// Polynomial operations
export * as Polynomials from './polynomials';

// Geometric calculations
export * as Geometry from './geometry';

// Number theory
export * as NumberTheory from './number-theory';

// Combinatorics
export * as Combinatorics from './combinatorics';

// Calculus (derivatives, integrals)
export * as Calculus from './calculus';

// Optimization algorithms
export * as Optimization from './optimization';

// Numerical methods
export * as NumericalMethods from './numerical-methods';

// Re-export commonly used functions directly for convenience
// These are the "recommended" versions when multiple implementations exist
export { 
  factorial,
  combination,
  permutation
} from './combinatorics/combinatorics';

export {
  gcd,
  lcm,
  isPrime
} from './arithmetic/operations';

export {
  mean,
  median,
  variance,
  stdDev,
  sum
} from './statistics/descriptive';

// Export product from arithmetic
export { product } from './arithmetic/operations';

// Type exports
export type { 
  Vector,
  Matrix,
  Complex,
  Polynomial,
  Fraction,
  LinearRegressionResult,
  PolynomialRegressionResult,
  DescriptiveStats,
  HistogramBin,
  FrequencyTable,
  DistributionResult,
  IntegrationResult,
  DifferentiationResult,
  OptimizationResult,
  Point2D,
  Point3D,
  Line,
  Circle,
  Sphere,
  PrimeFactorization,
  GCDResult,
  MathError,
  DomainError,
  RangeError,
  ConvergenceError
} from './types';
