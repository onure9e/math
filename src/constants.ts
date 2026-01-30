/**
 * Mathematical constants and precision values used throughout the library.
 * Centralizing these values ensures consistency and maintainability.
 */

/** Machine epsilon for floating point comparisons */
export const EPSILON = 1e-15;

/** Default tolerance for numerical algorithms */
export const TOLERANCE = 1e-10;

/** Maximum safe integer for factorial calculations (170! is the largest factorial that fits in a JavaScript number) */
export const MAX_FACTORIAL_INPUT = 170;

/** Default maximum iterations for iterative algorithms */
export const DEFAULT_MAX_ITERATIONS = 200;

/** Golden ratio φ = (1 + √5) / 2 */
export const PHI = 1.618033988749895;

/** Natural logarithm of 2 */
export const LN2 = 0.6931471805599453;

/** Natural logarithm of 10 */
export const LN10 = 2.302585092994046;

/** Base-10 logarithm of e */
export const LOG10E = 0.4342944819032518;

/** Base-2 logarithm of e */
export const LOG2E = 1.4426950408889634;

/** Square root of 2 */
export const SQRT2 = 1.4142135623730951;

/** Square root of 1/2 */
export const SQRT1_2 = 0.7071067811865476;

/** Pi constant */
export const PI = Math.PI;

/** Euler's number e */
export const E = Math.E;

/** Maximum safe integer in JavaScript (2^53 - 1) */
export const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

/** Minimum safe integer in JavaScript (-(2^53 - 1)) */
export const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

/** Positive infinity */
export const POSITIVE_INFINITY = Infinity;

/** Negative infinity */
export const NEGATIVE_INFINITY = -Infinity;

/** Not a Number */
export const NaN = Number.NaN;
