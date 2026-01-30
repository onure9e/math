# @onurege3467/math

<p align="center">
  <img src="https://img.shields.io/npm/v/@onurege3467/math.svg?style=for-the-badge&color=blue" alt="NPM Version">
  <img src="https://img.shields.io/npm/l/@onurege3467/math.svg?style=for-the-badge&color=green" alt="License">
  <img src="https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/tests-342%20passing-brightgreen?style=for-the-badge&logo=jest" alt="Tests">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ESM%2FCJS-Dual%20Support-orange?style=for-the-badge" alt="Module Support">
  <img src="https://img.shields.io/badge/coverage-100%25-brightgreen?style=for-the-badge" alt="Coverage">
  <img src="https://img.shields.io/github/actions/workflow/status/onure9e/math/ci.yml?style=for-the-badge&logo=github&label=CI" alt="CI Status">
</p>

<p align="center">
  <b>A comprehensive, enterprise-grade advanced mathematics library for TypeScript/JavaScript</b>
</p>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Module Documentation](#-module-documentation)
- [API Reference](#-api-reference)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**@onurege3467/math** is a comprehensive advanced mathematics library designed for enterprise-level applications. With **17 mathematical modules**, **342 comprehensive tests**, and **enterprise-grade code quality**, this library provides everything you need for mathematical computations in TypeScript and JavaScript projects.

Whether you're building statistical analysis tools, scientific simulations, financial calculators, or educational applications, this library offers a robust, well-tested, and type-safe solution.

### Key Highlights

- ✅ **17 Mathematical Modules** - From basic arithmetic to advanced calculus
- ✅ **342 Comprehensive Tests** - 100% passing with full coverage
- ✅ **Enterprise Code Quality** - ESLint, Prettier, TypeScript strict mode
- ✅ **Dual Module Support** - ESM and CommonJS compatibility
- ✅ **Full TypeScript Support** - Complete type definitions included
- ✅ **Custom Error Handling** - Domain, Range, and Convergence errors
- ✅ **Performance Optimized** - LRU caching for combinatorics
- ✅ **Well Documented** - Comprehensive JSDoc comments throughout

---

## ✨ Features

### Mathematical Modules

| Module | Functions | Description |
|--------|-----------|-------------|
| **Core** | 85+ | Basic operations, clamping, mapping, rounding |
| **Arithmetic** | 40+ | Operations, fractions, GCD, LCM, modular arithmetic |
| **Statistics** | 50+ | Descriptive stats, regression, correlation, distributions, hypothesis testing |
| **Probability** | 35+ | Basic probability, distributions, theorems, random generators |
| **Linear Algebra** | 20+ | Vectors, matrices, and linear transformations |
| **Trigonometry** | 30+ | Basic and inverse trigonometric functions |
| **Complex Numbers** | 25+ | Complex number arithmetic and operations |
| **Polynomials** | 20+ | Polynomial arithmetic and operations |
| **Geometry** | 70+ | Points, areas, volumes, 2D/3D calculations |
| **Number Theory** | 30+ | Primes, modular arithmetic, sequences |
| **Combinatorics** | 15+ | Factorials, permutations, combinations |
| **Calculus** | 15+ | Integration and differentiation |
| **Optimization** | 10+ | Optimization algorithms |
| **Numerical Methods** | 20+ | Interpolation, root finding, numerical integration |

### Core Capabilities

- **59 functions** in core/basic (abs, sign, isPrime, isPerfectSquare, etc.)
- **26 functions** in core/rounding (roundTo, formatNumber, formatCurrency, etc.)
- **35 geometry point operations** (distance, midpoint, centroid, rotation, reflection)
- **35 volume calculations** for 3D shapes
- **Advanced statistics**: linear regression, polynomial regression, Theil-Sen, exponential, power regression
- **Probability**: Bayesian theorem, Markov chains, probability distributions
- **Number theory**: Miller-Rabin primality test, Sieve of Eratosthenes

---

## 📦 Installation

### NPM

```bash
npm install @onurege3467/math
```

### Yarn

```bash
yarn add @onurege3467/math
```

### PNPM

```bash
pnpm add @onurege3467/math
```

### Requirements

- Node.js 18.x or higher
- TypeScript 5.0+ (for TypeScript projects)

---

## 🚀 Quick Start

### ES Modules (ESM)

```typescript
import { Core, Arithmetic, Statistics, Geometry } from '@onurege3467/math';

// Basic operations
Core.Basic.abs(-5); // 5
Core.Basic.isPrime(17); // true
Core.Basic.round(3.14159, 2); // 3.14

// Arithmetic
Arithmetic.divide(10, 2); // 5
Arithmetic.gcd(48, 18); // 6
Arithmetic.lcm(4, 6); // 12

// Statistics
Statistics.mean([1, 2, 3, 4, 5]); // 3
Statistics.median([1, 2, 3, 4, 5]); // 3
Statistics.stdDev([1, 2, 3, 4, 5]); // 1.414...

// Geometry
Geometry.distance2D({x: 0, y: 0}, {x: 3, y: 4}); // 5
Geometry.volumeSphere(3); // 113.097...
```

### CommonJS (CJS)

```javascript
const { Core, Arithmetic, Statistics, Geometry } = require('@onurege3467/math');

// Same usage as ESM
const result = Core.Basic.abs(-10); // 10
```

### Individual Module Imports

```typescript
// Import specific modules for tree-shaking
import { mean, stdDev, linearRegression } from '@onurege3467/math/statistics';
import { gcd, lcm, isPrime } from '@onurege3467/math/arithmetic';
import { factorial, combination } from '@onurege3467/math/combinatorics';
```

---

## 📖 Module Documentation

### Core Module

Basic mathematical operations and utilities.

```typescript
import { Core } from '@onurege3467/math';

// Basic operations
Core.Basic.abs(-42);           // 42
Core.Basic.sign(-5);           // -1
Core.Basic.floor(3.7);         // 3
Core.Basic.ceil(3.2);          // 4
Core.Basic.round(3.14159, 2);  // 3.14

// Number utilities
Core.Basic.isPrime(17);        // true
Core.Basic.isPerfectSquare(16); // true
Core.Basic.isPerfectCube(27);  // true
Core.Basic.digits(1234);       // [1, 2, 3, 4]

// Clamping and mapping
Core.Clamping.clamp(150, 0, 100);     // 100
Core.Mapping.mapRange(5, 0, 10, 0, 100); // 50
Core.Mapping.lerp(0, 100, 0.5);       // 50

// Rounding and formatting
Core.Rounding.roundTo(3.14159, 2);    // 3.14
Core.Rounding.roundToNearest(17, 5);  // 15
Core.Rounding.formatNumber(1234567.89); // "1,234,567.89"
Core.Rounding.formatCurrency(1234.5, 'USD'); // "$1,234.50"
```

### Arithmetic Module

Arithmetic operations, fractions, and number theory utilities.

```typescript
import { Arithmetic } from '@onurege3467/math';

// Basic operations with error handling
Arithmetic.add(2, 3);          // 5
Arithmetic.subtract(5, 3);     // 2
Arithmetic.multiply(4, 5);     // 20
Arithmetic.divide(10, 2);      // 5
Arithmetic.power(2, 10);       // 1024
Arithmetic.root(27, 3);        // 3

// GCD and LCM
Arithmetic.gcd(48, 18);        // 6
Arithmetic.lcm(4, 6);          // 12
Arithmetic.gcdExtended(48, 18); // { gcd: 6, x: -1, y: 3 }

// Fractions
const f1 = Arithmetic.createFraction(1, 2);
const f2 = Arithmetic.createFraction(1, 3);
f1.add(f2).toString();         // "5/6"
f1.toNumber();                 // 0.5

// Modular arithmetic
Arithmetic.mod(17, 5);         // 2
Arithmetic.modInverse(3, 11);  // 4 (because 3*4 = 12 ≡ 1 mod 11)
Arithmetic.modPower(2, 10, 1000); // 24 (2^10 mod 1000)

// Primality testing
Arithmetic.isPrime(17);        // true
Arithmetic.isPrime(18);        // false
Arithmetic.nthPrime(10);       // 29
Arithmetic.primeFactors(100);  // [{ prime: 2, exponent: 2 }, { prime: 5, exponent: 2 }]
```

### Statistics Module

Comprehensive statistical analysis functions.

```typescript
import { Statistics } from '@onurege3467/math';

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Descriptive statistics
Statistics.mean(data);         // 5.5
Statistics.median(data);       // 5.5
Statistics.mode([1, 2, 2, 3, 3, 3]); // 3
Statistics.variance(data);     // 8.25
Statistics.stdDev(data);       // 2.872...
Statistics.range(data);        // 9

// Comprehensive stats
const stats = Statistics.descriptiveStats(data);
// Returns: { count, sum, mean, median, variance, stdDev, min, max, range, q1, q3, iqr, skewness, kurtosis }

// Regression analysis
const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];

const linear = Statistics.linearRegression(x, y);
// Returns: { slope, intercept, r2, r, equation, predict, residuals, mse, rmse, mae }
console.log(linear.equation);  // "y = 2.00x + 0.00"
console.log(linear.predict(6)); // 12

// Polynomial regression
const poly = Statistics.polynomialRegression(x, y, 2);

// Correlation
Statistics.correlation(x, y);  // 1 (perfect correlation)
Statistics.pearsonCorrelation(x, y);
Statistics.spearmanCorrelation(x, y);

// Distributions
const normal = Statistics.normalDistribution(0, 1);
normal.pdf(0);                 // 0.3989... (probability density)
normal.cdf(0);                 // 0.5 (cumulative)
normal.sample();               // Random sample from N(0,1)

// Hypothesis testing
const test = Statistics.tTestOneSample(data, 5);
// Returns: { tStatistic, pValue, degreesOfFreedom, significant }
```

### Probability Module

Probability theory and distributions.

```typescript
import { Probability } from '@onurege3467/math';

// Basic probability
Probability.factorial(5);      // 120
Probability.permutation(5, 2); // 20
Probability.combination(5, 2); // 10

// Probability distributions
const binomial = Probability.binomialDistribution(10, 0.5);
binomial.mean;                 // 5
binomial.variance;             // 2.5
binomial.pmf(5);               // P(X = 5)
binomial.cdf(5);               // P(X ≤ 5)

const poisson = Probability.poissonDistribution(3);
const normal = Probability.normalDistribution(0, 1);
const exponential = Probability.exponentialDistribution(1);

// Random number generators
Probability.randomUniform(0, 1);     // Uniform [0, 1]
Probability.randomNormal(0, 1);      // Normal distribution
Probability.randomPoisson(3);        // Poisson distribution
Probability.randomChoice([1, 2, 3]); // Random selection

// Bayesian theorem
Probability.bayesianTheorem(0.01, 0.95, 0.05);
// P(A|B) = P(B|A) * P(A) / P(B)

// Markov chains
const transitionMatrix = [[0.7, 0.3], [0.4, 0.6]];
const initialState = [1, 0];
const markov = Probability.markovChain(transitionMatrix, initialState);
markov.step();                 // Advance one step
markov.steadyState();          // Calculate steady state probabilities
```

### Geometry Module

2D and 3D geometric calculations.

```typescript
import { Geometry } from '@onurege3467/math';

// Point operations
const p1 = { x: 0, y: 0 };
const p2 = { x: 3, y: 4 };

Geometry.distance2D(p1, p2);   // 5
Geometry.midpoint2D(p1, p2);   // { x: 1.5, y: 2 }
Geometry.centroid2D([p1, p2, { x: 0, y: 4 }]); // { x: 1, y: 2.67 }

// Point transformations
Geometry.rotatePoint2D(p2, p1, Math.PI / 2);   // Rotate 90° around origin
Geometry.reflectPoint2D(p2, { x: 0, y: 0 }, { x: 1, y: 1 }); // Reflect across line
Geometry.translatePoint2D(p2, 1, 2);           // { x: 4, y: 6 }
Geometry.scalePoint2D(p2, 2, 2);               // { x: 6, y: 8 }

// Area calculations
Geometry.areaCircle(5);        // 78.54...
Geometry.areaRectangle(4, 5);  // 20
Geometry.areaTriangle(3, 4);   // 6
Geometry.areaPolygon([{x: 0, y: 0}, {x: 4, y: 0}, {x: 4, y: 3}]); // 6

// Volume calculations
Geometry.volumeSphere(3);      // 113.097...
Geometry.volumeCube(4);        // 64
Geometry.volumeCylinder(3, 5); // 141.371...
Geometry.volumeCone(3, 5);     // 47.123...

// 3D operations
const p3d1 = { x: 0, y: 0, z: 0 };
const p3d2 = { x: 1, y: 1, z: 1 };
Geometry.distance3D(p3d1, p3d2); // 1.732...
Geometry.midpoint3D(p3d1, p3d2); // { x: 0.5, y: 0.5, z: 0.5 }
```

### Number Theory Module

Number theory and prime number operations.

```typescript
import { NumberTheory } from '@onurege3467/math';

// Prime numbers
NumberTheory.isPrime(17);      // true
NumberTheory.nthPrime(10);     // 29
NumberTheory.primeFactors(100); // [{ prime: 2, exponent: 2 }, { prime: 5, exponent: 2 }]
NumberTheory.sieveOfEratosthenes(50); // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

// Miller-Rabin primality test (deterministic for n < 2^64)
NumberTheory.millerRabinTest(17, 5); // true

// Modular arithmetic
NumberTheory.modularExponentiation(2, 10, 1000); // 24
NumberTheory.modularInverse(3, 11); // 4

// Sequences
NumberTheory.fibonacci(10);    // 55
NumberTheory.fibonacciSequence(10); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
NumberTheory.factorial(5);     // 120
NumberTheory.triangularNumber(5); // 15
```

### Combinatorics Module

Combinatorial mathematics with LRU caching for performance.

```typescript
import { Combinatorics } from '@onurege3467/math';

// Factorial with caching
Combinatorics.factorial(5);    // 120
Combinatorics.factorial(20);   // 2432902008176640000

// Permutations and combinations
Combinatorics.permutation(5, 2);  // 20 (5! / 3!)
Combinatorics.combination(5, 2);  // 10 (5! / (2! * 3!))
Combinatorics.multinomial(5, [2, 2, 1]); // 30

// Catalan numbers
Combinatorics.catalanNumber(5);   // 42

// Binomial coefficient
Combinatorics.binomialCoefficient(10, 5); // 252

// Note: Uses LRU cache to prevent memory leaks on repeated calculations
```

### Trigonometry Module

Trigonometric functions and utilities.

```typescript
import { Trigonometry } from '@onurege3467/math';

// Basic trig functions (accept both radians and degrees)
Trigonometry.sin(Math.PI / 2);     // 1
Trigonometry.cos(0);               // 1
Trigonometry.tan(Math.PI / 4);     // 1

// Inverse trig functions
Trigonometry.asin(1);              // 1.570... (π/2)
Trigonometry.acos(0);              // 1.570... (π/2)
Trigonometry.atan(1);              // 0.785... (π/4)
Trigonometry.atan2(1, 1);          // 0.785... (π/4)

// Hyperbolic functions
Trigonometry.sinh(1);              // 1.175...
Trigonometry.cosh(1);              // 1.543...
Trigonometry.tanh(1);              // 0.761...

// Utility functions
Trigonometry.degreesToRadians(180); // 3.141... (π)
Trigonometry.radiansToDegrees(Math.PI); // 180
Trigonometry.normalizeAngle(450);   // 90 (normalized to 0-360)
```

### Complex Numbers Module

Complex number arithmetic.

```typescript
import { ComplexNumbers } from '@onurege3467/math';

// Create complex numbers
const c1 = ComplexNumbers.createComplex(3, 4);  // 3 + 4i
const c2 = ComplexNumbers.createComplex(1, 2);  // 1 + 2i

// Arithmetic operations
c1.add(c2);                    // 4 + 6i
c1.subtract(c2);               // 2 + 2i
c1.multiply(c2);               // -5 + 10i
c1.divide(c2);                 // 2.2 + 0.4i

// Properties
c1.magnitude();                // 5 (|3 + 4i| = √(9+16))
c1.phase();                    // 0.927... (arctan(4/3))
c1.conjugate();                // 3 - 4i

// Utility functions
ComplexNumbers.parseComplex("3+4i");
ComplexNumbers.fromPolar(5, Math.atan2(4, 3));
```

### Polynomials Module

Polynomial arithmetic and operations.

```typescript
import { Polynomials } from '@onurege3467/math';

// Create polynomials
const p1 = Polynomials.createPolynomial([1, -3, 2]);  // x² - 3x + 2
const p2 = Polynomials.createPolynomial([1, 1]);      // x + 1

// Evaluate
p1.evaluate(2);                // 0 (2² - 3*2 + 2 = 0)

// Arithmetic
p1.add(p2);                    // x² - 2x + 3
p1.subtract(p2);               // x² - 4x + 1
p1.multiply(p2);               // x³ - 2x² - x + 2

// Calculus operations
p1.derivative();               // 2x - 3
p1.integral();                 // (1/3)x³ - (3/2)x² + 2x

// Roots
p1.roots();                    // [1, 2] (roots of x² - 3x + 2)
```

### Calculus Module

Numerical calculus operations.

```typescript
import { Calculus } from '@onurege3467/math';

// Numerical integration
Calculus.integrate(x => x * x, 0, 1);  // ≈ 0.333... (1/3)
Calculus.integrate(x => Math.sin(x), 0, Math.PI); // ≈ 2

// Numerical differentiation
Calculus.differentiate(x => x * x, 2);  // ≈ 4 (derivative of x² at x=2)
Calculus.differentiate(x => Math.sin(x), 0); // ≈ 1 (cos(0))

// Methods available:
// - Simpson's rule for integration
// - Central difference for differentiation
```

### Optimization Module

Mathematical optimization algorithms.

```typescript
import { Optimization } from '@onurege3467/math';

// Gradient descent
const result = Optimization.gradientDescent(
  x => (x[0] - 2) ** 2 + (x[1] - 3) ** 2,  // f(x,y) = (x-2)² + (y-3)²
  [0, 0],                                    // Initial guess
  0.01,                                      // Learning rate
  1000                                       // Max iterations
);
// result: { minimum: 0, argmin: [2, 3], iterations: ..., converged: true }

// Golden section search (1D optimization)
const min = Optimization.goldenSectionSearch(
  x => (x - 2) ** 2,
  0,
  5
);
// Finds minimum at x = 2
```

### Numerical Methods Module

Numerical analysis methods.

```typescript
import { NumericalMethods } from '@onurege3467/math';

// Root finding
NumericalMethods.bisection(x => x * x - 4, 0, 3);   // Finds root at x = 2
NumericalMethods.newtonRaphson(x => x * x - 4, 3);  // Finds root at x = 2

// Interpolation
const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 4 }];
NumericalMethods.lagrangeInterpolation(points, 1.5); // ≈ 2.25
NumericalMethods.linearInterpolation(0, 0, 1, 1, 0.5); // 0.5
```

### Linear Algebra Module

Vector and matrix operations.

```typescript
import { LinearAlgebra } from '@onurege3467/math';

// Vector operations
const v1 = LinearAlgebra.createVector([1, 2, 3]);
const v2 = LinearAlgebra.createVector([4, 5, 6]);

v1.add(v2);                    // [5, 7, 9]
v1.dot(v2);                    // 32 (1*4 + 2*5 + 3*6)
v1.magnitude();                // √14 ≈ 3.742
v1.normalize();                // Unit vector

// Matrix operations
const m1 = LinearAlgebra.createMatrix([[1, 2], [3, 4]]);
const m2 = LinearAlgebra.createMatrix([[5, 6], [7, 8]]);

m1.add(m2);                    // [[6, 8], [10, 12]]
m1.multiply(m2);               // Matrix multiplication
m1.transpose();                // [[1, 3], [2, 4]]
m1.determinant();              // -2
m1.inverse();                  // [[-2, 1], [1.5, -0.5]]
```

---

## 📘 API Reference

### Type Definitions

The library exports comprehensive TypeScript types:

```typescript
import type {
  Vector,                    // Vector interface with operations
  Matrix,                    // Matrix interface with operations
  Complex,                   // Complex number interface
  Polynomial,                // Polynomial interface
  Fraction,                  // Fraction interface
  LinearRegressionResult,    // Regression results
  PolynomialRegressionResult,
  DescriptiveStats,          // Complete descriptive statistics
  HistogramBin,              // Histogram bin type
  FrequencyTable,            // Frequency table entry
  DistributionResult,        // Probability distribution
  IntegrationResult,         // Integration results
  DifferentiationResult,     // Differentiation results
  OptimizationResult,        // Optimization results
  Point2D,                   // 2D point { x, y }
  Point3D,                   // 3D point { x, y, z }
  Line,                      // Line definition
  Circle,                    // Circle definition
  Sphere,                    // Sphere definition
  PrimeFactorization,        // Prime factorization result
  GCDResult,                 // Extended GCD result
  MathError,                 // Base math error
  DomainError,               // Domain error
  RangeError,                // Range error
  ConvergenceError           // Convergence error
} from '@onurege3467/math';
```

---

## ⚠️ Error Handling

The library provides custom error classes for better error handling:

```typescript
import { DomainError, RangeError, ConvergenceError, MathError } from '@onurege3467/math';

try {
  // Some mathematical operation
  const result = Arithmetic.divide(10, 0);
} catch (error) {
  if (error instanceof DomainError) {
    console.error('Domain error:', error.message);
  } else if (error instanceof RangeError) {
    console.error('Range error:', error.message);
  } else if (error instanceof ConvergenceError) {
    console.error('Convergence error:', error.message);
  } else if (error instanceof MathError) {
    console.error('Math error:', error.message, 'Code:', error.code);
  }
}
```

### Error Types

| Error | Description | Example |
|-------|-------------|---------|
| `DomainError` | Input outside valid domain | `sqrt(-1)` |
| `RangeError` | Result outside representable range | `factorial(10000)` |
| `ConvergenceError` | Numerical method failed to converge | Root finding divergence |
| `MathError` | Base class for all math errors | General errors |

---

## 🧪 Testing

The library includes **342 comprehensive tests** covering all modules with 100% pass rate.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

```
Test Suites: 17 passed, 17 total
Tests:       342 passed, 342 total
Snapshots:   0 total
Time:        ~3s
```

### Coverage Report

| Module | Coverage |
|--------|----------|
| Core | 100% |
| Arithmetic | 100% |
| Statistics | 100% |
| Probability | 100% |
| Geometry | 100% |
| Number Theory | 100% |
| Combinatorics | 100% |
| Trigonometry | 100% |
| Complex Numbers | 100% |
| Polynomials | 100% |
| Calculus | 100% |
| Optimization | 100% |
| Numerical Methods | 100% |
| Linear Algebra | 100% |

---

## 🛠️ Development

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Setup

```bash
# Clone the repository
git clone https://github.com/onure9e/math.git
cd math

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run clean` | Clean build and coverage directories |
| `npm run prepublishOnly` | Pre-publish build and test |

### Project Structure

```
src/
├── index.ts              # Main entry point
├── types.ts              # Type definitions
├── core/                 # Core utilities
│   ├── basic.ts          # Basic operations
│   ├── clamping.ts       # Clamping functions
│   ├── mapping.ts        # Mapping/lerp functions
│   └── rounding.ts       # Rounding utilities
├── arithmetic/           # Arithmetic operations
│   ├── operations.ts     # Basic operations
│   ├── fractions.ts      # Fraction arithmetic
│   └── index.ts
├── statistics/           # Statistical analysis
│   ├── descriptive.ts    # Descriptive statistics
│   ├── regression.ts     # Regression analysis
│   ├── correlation.ts    # Correlation functions
│   ├── distributions.ts  # Statistical distributions
│   └── hypothesis.ts     # Hypothesis testing
├── probability/          # Probability theory
│   ├── basic.ts          # Basic probability
│   ├── distributions.ts  # Probability distributions
│   ├── theorems.ts       # Probability theorems
│   └── random.ts         # Random generators
├── geometry/             # Geometric calculations
│   ├── area.ts           # Area calculations
│   ├── volume.ts         # Volume calculations
│   └── points.ts         # Point operations
├── number-theory/        # Number theory
│   ├── core.ts           # Core number theory
│   ├── prime.ts          # Prime numbers
│   ├── modular.ts        # Modular arithmetic
│   └── sequences.ts      # Number sequences
├── combinatorics/        # Combinatorial math
│   └── combinatorics.ts  # Factorials, permutations, combinations
├── trigonometry/         # Trigonometric functions
│   ├── basic.ts          # Basic trig functions
│   └── inverse.ts        # Inverse trig functions
├── complex-numbers/      # Complex numbers
│   └── index.ts
├── polynomials/          # Polynomial operations
│   └── index.ts
├── calculus/             # Calculus operations
│   └── index.ts
├── optimization/         # Optimization algorithms
│   └── index.ts
├── numerical-methods/    # Numerical methods
│   ├── bisection.ts      # Bisection method
│   ├── newton.ts         # Newton-Raphson
│   └── interpolation.ts  # Interpolation methods
└── linear-algebra/       # Linear algebra
    └── index.ts
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure they pass (`npm test`)
5. Run linting (`npm run lint`)
6. Format code (`npm run format`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Contribution Guidelines

- **Code Style**: Follow the existing code style (enforced by ESLint and Prettier)
- **Testing**: Add tests for new functionality
- **Documentation**: Update JSDoc comments for new functions
- **Types**: Ensure all functions have proper TypeScript types
- **Error Handling**: Use appropriate custom error classes

### Code Quality Standards

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting
- 100% test coverage for new code
- JSDoc documentation for all public APIs

### Reporting Issues

Please use the GitHub issue tracker to report bugs or request features:

- **Bug Reports**: Include steps to reproduce, expected behavior, and actual behavior
- **Feature Requests**: Describe the feature and its use case
- **Questions**: Use discussions for questions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 onurege3467

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped improve this library
- Inspired by mathematical libraries like NumPy, Math.js, and others
- Special thanks to the TypeScript and Jest communities for excellent tooling

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/onure9e/math/issues)
- **Discussions**: [Ask questions or share ideas](https://github.com/onure9e/math/discussions)
- **NPM Package**: [@onurege3467/math](https://www.npmjs.com/package/@onurege3467/math)

---

<p align="center">
  <b>Made with ❤️ by onurege3467</b>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@onurege3467/math">NPM</a> •
  <a href="https://github.com/onure9e/math">GitHub</a> •
  <a href="https://github.com/onure9e/math/issues">Issues</a> •
  <a href="https://github.com/onure9e/math/discussions">Discussions</a>
</p>
