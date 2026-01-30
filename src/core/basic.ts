/**
 * Returns the absolute value of a number.
 * @param value - The number to get the absolute value of
 * @returns The absolute value
 * @example
 * abs(-5); // returns 5
 * abs(5); // returns 5
 */
export function abs(value: number): number {
  return Math.abs(value);
}

/**
 * Returns the sign of a number.
 * @param value - The number to check
 * @returns 1 if positive, -1 if negative, 0 if zero
 * @example
 * sign(5); // returns 1
 * sign(-5); // returns -1
 * sign(0); // returns 0
 */
export function sign(value: number): number {
  if (value > 0) return 1;
  if (value < 0) return -1;
  return 0;
}

/**
 * Returns the largest integer less than or equal to a number.
 * @param value - The number to floor
 * @returns The floored value
 * @example
 * floor(3.7); // returns 3
 * floor(-3.7); // returns -4
 */
export function floor(value: number): number {
  return Math.floor(value);
}

/**
 * Returns the smallest integer greater than or equal to a number.
 * @param value - The number to ceil
 * @returns The ceiled value
 * @example
 * ceil(3.2); // returns 4
 * ceil(-3.2); // returns -3
 */
export function ceil(value: number): number {
  return Math.ceil(value);
}

/**
 * Rounds a number to a specified number of decimal places.
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 0)
 * @returns The rounded value
 * @example
 * round(3.14159, 2); // returns 3.14
 * round(3.5); // returns 4
 */
export function round(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Returns the integer part of a number by removing fractional digits.
 * @param value - The number to truncate
 * @returns The truncated value
 * @example
 * trunc(3.7); // returns 3
 * trunc(-3.7); // returns -3
 */
export function trunc(value: number): number {
  return Math.trunc(value);
}

/**
 * Returns the fractional part of a number.
 * @param value - The number to get the fractional part of
 * @returns The fractional part
 * @example
 * fract(3.7); // returns 0.7
 * fract(-3.7); // returns -0.7
 */
export function fract(value: number): number {
  return value - Math.trunc(value);
}

/**
 * Checks if a value is finite.
 * @param value - The number to check
 * @returns True if the value is finite, false otherwise
 * @example
 * isFinite(5); // returns true
 * isFinite(Infinity); // returns false
 * isFinite(NaN); // returns false
 */
export function isFinite(value: number): boolean {
  return Number.isFinite(value);
}

/**
 * Checks if a value is NaN.
 * @param value - The number to check
 * @returns True if the value is NaN, false otherwise
 * @example
 * isNaN(NaN); // returns true
 * isNaN(5); // returns false
 */
export function isNaN(value: number): boolean {
  return Number.isNaN(value);
}

/**
 * Checks if a value is an integer.
 * @param value - The number to check
 * @returns True if the value is an integer, false otherwise
 * @example
 * isInteger(5); // returns true
 * isInteger(5.5); // returns false
 */
export function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

/**
 * Checks if a value is a floating point number.
 * @param value - The number to check
 * @returns True if the value is a float, false otherwise
 * @example
 * isFloat(5.5); // returns true
 * isFloat(5); // returns false
 */
export function isFloat(value: number): boolean {
  return !Number.isInteger(value) && Number.isFinite(value);
}

/**
 * Checks if a value is positive.
 * @param value - The number to check
 * @returns True if the value is positive, false otherwise
 * @example
 * isPositive(5); // returns true
 * isPositive(-5); // returns false
 * isPositive(0); // returns false
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * Checks if a value is negative.
 * @param value - The number to check
 * @returns True if the value is negative, false otherwise
 * @example
 * isNegative(-5); // returns true
 * isNegative(5); // returns false
 * isNegative(0); // returns false
 */
export function isNegative(value: number): boolean {
  return value < 0;
}

/**
 * Checks if a value is non-negative (zero or positive).
 * @param value - The number to check
 * @returns True if the value is non-negative, false otherwise
 * @example
 * isNonNegative(5); // returns true
 * isNonNegative(0); // returns true
 * isNonNegative(-5); // returns false
 */
export function isNonNegative(value: number): boolean {
  return value >= 0;
}

/**
 * Checks if a value is non-positive (zero or negative).
 * @param value - The number to check
 * @returns True if the value is non-positive, false otherwise
 * @example
 * isNonPositive(-5); // returns true
 * isNonPositive(0); // returns true
 * isNonPositive(5); // returns false
 */
export function isNonPositive(value: number): boolean {
  return value <= 0;
}

/**
 * Checks if a value is even.
 * @param value - The number to check
 * @returns True if the value is even, false otherwise
 * @example
 * isEven(4); // returns true
 * isEven(5); // returns false
 */
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

/**
 * Checks if a value is odd.
 * @param value - The number to check
 * @returns True if the value is odd, false otherwise
 * @example
 * isOdd(5); // returns true
 * isOdd(4); // returns false
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

/**
 * Checks if a value is a whole number (non-negative integer).
 * @param value - The number to check
 * @returns True if the value is a whole number, false otherwise
 * @example
 * isWhole(5); // returns true
 * isWhole(-5); // returns false
 * isWhole(5.5); // returns false
 */
export function isWhole(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

/**
 * Checks if a value is a perfect square.
 * @param value - The number to check
 * @returns True if the value is a perfect square, false otherwise
 * @example
 * isPerfectSquare(16); // returns true
 * isPerfectSquare(15); // returns false
 * isPerfectSquare(-4); // returns false
 */
export function isPerfectSquare(value: number): boolean {
  if (value < 0) return false;
  const root = Math.sqrt(value);
  return Number.isInteger(root);
}

/**
 * Checks if a value is a power of two.
 * @param value - The number to check
 * @returns True if the value is a power of two, false otherwise
 * @example
 * isPowerOfTwo(8); // returns true
 * isPowerOfTwo(6); // returns false
 * isPowerOfTwo(0); // returns false
 */
export function isPowerOfTwo(value: number): boolean {
  return value > 0 && (value & (value - 1)) === 0;
}

/**
 * Checks if a value is a prime number.
 * @param value - The number to check
 * @returns True if the value is prime, false otherwise
 * @example
 * isPrime(7); // returns true
 * isPrime(4); // returns false
 * isPrime(1); // returns false
 */
export function isPrime(value: number): boolean {
  if (value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  const limit = Math.sqrt(value);
  for (let i = 3; i <= limit; i += 2) {
    if (value % i === 0) return false;
  }
  return true;
}

/**
 * Checks if a value is between two bounds.
 * @param value - The number to check
 * @param min - The minimum bound
 * @param max - The maximum bound
 * @param inclusive - Whether to include the bounds (default: true)
 * @returns True if the value is between the bounds, false otherwise
 * @example
 * isBetween(5, 1, 10); // returns true
 * isBetween(1, 1, 10); // returns true (inclusive)
 * isBetween(1, 1, 10, false); // returns false (exclusive)
 */
export function isBetween(value: number, min: number, max: number, inclusive: boolean = true): boolean {
  return inclusive ? value >= min && value <= max : value > min && value < max;
}

/**
 * Checks if a value is divisible by another number.
 * @param value - The number to check
 * @param divisor - The divisor
 * @returns True if value is divisible by divisor, false otherwise
 * @example
 * isDivisible(10, 2); // returns true
 * isDivisible(10, 3); // returns false
 * isDivisible(10, 0); // returns false
 */
export function isDivisible(value: number, divisor: number): boolean {
  return divisor !== 0 && value % divisor === 0;
}
