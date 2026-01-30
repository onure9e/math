import {
  abs,
  sign,
  floor,
  ceil,
  round,
  trunc,
  fract,
  isFinite,
  isNaN,
  isInteger,
  isFloat,
  isPositive,
  isNegative,
  isNonNegative,
  isNonPositive,
  isEven,
  isOdd,
  isWhole,
  isPerfectSquare,
  isPowerOfTwo,
  isPrime,
  isBetween,
  isDivisible
} from '../src/core/basic';

describe('Core Basic Module', () => {
  describe('abs', () => {
    test('returns absolute value of positive number', () => {
      expect(abs(5)).toBe(5);
    });
    
    test('returns absolute value of negative number', () => {
      expect(abs(-5)).toBe(5);
    });
    
    test('returns 0 for zero', () => {
      expect(abs(0)).toBe(0);
    });
    
    test('handles floating point numbers', () => {
      expect(abs(-3.14)).toBe(3.14);
    });
  });

  describe('sign', () => {
    test('returns 1 for positive numbers', () => {
      expect(sign(5)).toBe(1);
      expect(sign(0.1)).toBe(1);
    });
    
    test('returns -1 for negative numbers', () => {
      expect(sign(-5)).toBe(-1);
      expect(sign(-0.1)).toBe(-1);
    });
    
    test('returns 0 for zero', () => {
      expect(sign(0)).toBe(0);
    });
  });

  describe('floor', () => {
    test('rounds down to nearest integer', () => {
      expect(floor(3.7)).toBe(3);
      expect(floor(3.1)).toBe(3);
    });
    
    test('handles negative numbers', () => {
      expect(floor(-3.7)).toBe(-4);
      expect(floor(-3.1)).toBe(-4);
    });
    
    test('returns same value for integers', () => {
      expect(floor(5)).toBe(5);
    });
  });

  describe('ceil', () => {
    test('rounds up to nearest integer', () => {
      expect(ceil(3.1)).toBe(4);
      expect(ceil(3.9)).toBe(4);
    });
    
    test('handles negative numbers', () => {
      expect(ceil(-3.1)).toBe(-3);
      expect(ceil(-3.9)).toBe(-3);
    });
    
    test('returns same value for integers', () => {
      expect(ceil(5)).toBe(5);
    });
  });

  describe('round', () => {
    test('rounds to nearest integer by default', () => {
      expect(round(3.4)).toBe(3);
      expect(round(3.5)).toBe(4);
      expect(round(3.6)).toBe(4);
    });
    
    test('rounds to specified decimal places', () => {
      expect(round(3.14159, 2)).toBe(3.14);
      expect(round(3.14159, 3)).toBe(3.142);
    });
    
    test('handles negative numbers', () => {
      // Math.round uses "round half up" away from zero
      expect(round(-3.5)).toBe(-3);
      expect(round(-3.6)).toBe(-4);
    });
  });

  describe('trunc', () => {
    test('removes fractional part', () => {
      expect(trunc(3.7)).toBe(3);
      expect(trunc(-3.7)).toBe(-3);
    });
    
    test('returns same value for integers', () => {
      expect(trunc(5)).toBe(5);
    });
  });

  describe('fract', () => {
    test('returns fractional part', () => {
      expect(fract(3.7)).toBeCloseTo(0.7);
      expect(fract(-3.7)).toBeCloseTo(-0.7);
    });
    
    test('returns 0 for integers', () => {
      expect(fract(5)).toBe(0);
    });
  });

  describe('isFinite', () => {
    test('returns true for finite numbers', () => {
      expect(isFinite(5)).toBe(true);
      expect(isFinite(-1000)).toBe(true);
      expect(isFinite(0.0001)).toBe(true);
    });
    
    test('returns false for Infinity', () => {
      expect(isFinite(Infinity)).toBe(false);
      expect(isFinite(-Infinity)).toBe(false);
    });
    
    test('returns false for NaN', () => {
      expect(isFinite(NaN)).toBe(false);
    });
  });

  describe('isNaN', () => {
    test('returns true for NaN', () => {
      expect(isNaN(NaN)).toBe(true);
    });
    
    test('returns false for numbers', () => {
      expect(isNaN(5)).toBe(false);
      expect(isNaN(Infinity)).toBe(false);
    });
  });

  describe('isInteger', () => {
    test('returns true for integers', () => {
      expect(isInteger(5)).toBe(true);
      expect(isInteger(-5)).toBe(true);
      expect(isInteger(0)).toBe(true);
    });
    
    test('returns false for floats', () => {
      expect(isInteger(5.5)).toBe(false);
      expect(isInteger(5.0)).toBe(true); // 5.0 is integer
    });
  });

  describe('isFloat', () => {
    test('returns true for floating point numbers', () => {
      expect(isFloat(5.5)).toBe(true);
    });
    
    test('returns false for integers', () => {
      expect(isFloat(5)).toBe(false);
    });
    
    test('returns false for Infinity and NaN', () => {
      expect(isFloat(Infinity)).toBe(false);
      expect(isFloat(NaN)).toBe(false);
    });
  });

  describe('isPositive', () => {
    test('returns true for positive numbers', () => {
      expect(isPositive(5)).toBe(true);
      expect(isPositive(0.1)).toBe(true);
    });
    
    test('returns false for zero and negative', () => {
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-5)).toBe(false);
    });
  });

  describe('isNegative', () => {
    test('returns true for negative numbers', () => {
      expect(isNegative(-5)).toBe(true);
      expect(isNegative(-0.1)).toBe(true);
    });
    
    test('returns false for zero and positive', () => {
      expect(isNegative(0)).toBe(false);
      expect(isNegative(5)).toBe(false);
    });
  });

  describe('isNonNegative', () => {
    test('returns true for positive numbers and zero', () => {
      expect(isNonNegative(5)).toBe(true);
      expect(isNonNegative(0)).toBe(true);
    });
    
    test('returns false for negative numbers', () => {
      expect(isNonNegative(-5)).toBe(false);
    });
  });

  describe('isNonPositive', () => {
    test('returns true for negative numbers and zero', () => {
      expect(isNonPositive(-5)).toBe(true);
      expect(isNonPositive(0)).toBe(true);
    });
    
    test('returns false for positive numbers', () => {
      expect(isNonPositive(5)).toBe(false);
    });
  });

  describe('isEven', () => {
    test('returns true for even numbers', () => {
      expect(isEven(4)).toBe(true);
      expect(isEven(0)).toBe(true);
      expect(isEven(-4)).toBe(true);
    });
    
    test('returns false for odd numbers', () => {
      expect(isEven(5)).toBe(false);
      expect(isEven(-5)).toBe(false);
    });
  });

  describe('isOdd', () => {
    test('returns true for odd numbers', () => {
      expect(isOdd(5)).toBe(true);
      expect(isOdd(-5)).toBe(true);
    });
    
    test('returns false for even numbers', () => {
      expect(isOdd(4)).toBe(false);
      expect(isOdd(0)).toBe(false);
    });
  });

  describe('isWhole', () => {
    test('returns true for non-negative integers', () => {
      expect(isWhole(5)).toBe(true);
      expect(isWhole(0)).toBe(true);
    });
    
    test('returns false for negative integers', () => {
      expect(isWhole(-5)).toBe(false);
    });
    
    test('returns false for floats', () => {
      expect(isWhole(5.5)).toBe(false);
    });
  });

  describe('isPerfectSquare', () => {
    test('returns true for perfect squares', () => {
      expect(isPerfectSquare(0)).toBe(true);
      expect(isPerfectSquare(1)).toBe(true);
      expect(isPerfectSquare(4)).toBe(true);
      expect(isPerfectSquare(9)).toBe(true);
      expect(isPerfectSquare(16)).toBe(true);
    });
    
    test('returns false for non-perfect squares', () => {
      expect(isPerfectSquare(2)).toBe(false);
      expect(isPerfectSquare(3)).toBe(false);
      expect(isPerfectSquare(15)).toBe(false);
    });
    
    test('returns false for negative numbers', () => {
      expect(isPerfectSquare(-4)).toBe(false);
    });
  });

  describe('isPowerOfTwo', () => {
    test('returns true for powers of two', () => {
      expect(isPowerOfTwo(1)).toBe(true);
      expect(isPowerOfTwo(2)).toBe(true);
      expect(isPowerOfTwo(4)).toBe(true);
      expect(isPowerOfTwo(8)).toBe(true);
      expect(isPowerOfTwo(1024)).toBe(true);
    });
    
    test('returns false for non-powers of two', () => {
      expect(isPowerOfTwo(0)).toBe(false);
      expect(isPowerOfTwo(3)).toBe(false);
      expect(isPowerOfTwo(5)).toBe(false);
      expect(isPowerOfTwo(6)).toBe(false);
    });
  });

  describe('isPrime', () => {
    test('returns false for numbers less than 2', () => {
      expect(isPrime(0)).toBe(false);
      expect(isPrime(1)).toBe(false);
      expect(isPrime(-5)).toBe(false);
    });
    
    test('returns true for prime numbers', () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(3)).toBe(true);
      expect(isPrime(5)).toBe(true);
      expect(isPrime(7)).toBe(true);
      expect(isPrime(11)).toBe(true);
      expect(isPrime(97)).toBe(true);
    });
    
    test('returns false for composite numbers', () => {
      expect(isPrime(4)).toBe(false);
      expect(isPrime(6)).toBe(false);
      expect(isPrime(9)).toBe(false);
      expect(isPrime(15)).toBe(false);
    });
  });

  describe('isBetween', () => {
    test('returns true for values within range (inclusive)', () => {
      expect(isBetween(5, 1, 10)).toBe(true);
      expect(isBetween(1, 1, 10)).toBe(true);
      expect(isBetween(10, 1, 10)).toBe(true);
    });
    
    test('returns false for values outside range (inclusive)', () => {
      expect(isBetween(0, 1, 10)).toBe(false);
      expect(isBetween(11, 1, 10)).toBe(false);
    });
    
    test('handles exclusive range', () => {
      expect(isBetween(5, 1, 10, false)).toBe(true);
      expect(isBetween(1, 1, 10, false)).toBe(false);
      expect(isBetween(10, 1, 10, false)).toBe(false);
    });
  });

  describe('isDivisible', () => {
    test('returns true when divisible', () => {
      expect(isDivisible(10, 2)).toBe(true);
      expect(isDivisible(10, 5)).toBe(true);
      expect(isDivisible(0, 5)).toBe(true);
    });
    
    test('returns false when not divisible', () => {
      expect(isDivisible(10, 3)).toBe(false);
    });
    
    test('returns false when divisor is zero', () => {
      expect(isDivisible(10, 0)).toBe(false);
    });
  });
});
