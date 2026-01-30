import { abs, round } from '../src/core/basic';
import { clamp } from '../src/core/clamping';
import { gcd, lcm, factorial } from '../src/arithmetic/operations';
import { mean, variance, stdDev, median } from '../src/statistics/descriptive';
import { combination, permutation } from '../src/combinatorics/combinatorics';
import { isPrime, primeFactors } from '../src/number-theory/core';
import { sin, degreesToRadians } from '../src/trigonometry/basic';

describe('Core Module', () => {
  describe('abs', () => {
    test('returns positive value for positive input', () => {
      expect(abs(5)).toBe(5);
    });
    
    test('returns positive value for negative input', () => {
      expect(abs(-5)).toBe(5);
    });
    
    test('returns zero for zero input', () => {
      expect(abs(0)).toBe(0);
    });
  });
  
  describe('clamp', () => {
    test('clamps value within range', () => {
      expect(clamp(5, 1, 10)).toBe(5);
      expect(clamp(0, 1, 10)).toBe(1);
      expect(clamp(15, 1, 10)).toBe(10);
    });
  });
  
  describe('round', () => {
    test('rounds to nearest integer', () => {
      expect(round(3.5)).toBe(4);
      expect(round(3.4)).toBe(3);
      expect(round(-3.5)).toBe(-3); // JavaScript uses banker's rounding
    });
    
    test('rounds to specified decimal places', () => {
      expect(round(3.14159, 2)).toBe(3.14);
      expect(round(3.14159, 4)).toBe(3.1416);
    });
  });
});

describe('Arithmetic Module', () => {
  describe('gcd', () => {
    test('returns GCD of two numbers', () => {
      expect(gcd(48, 18)).toBe(6);
      expect(gcd(100, 25)).toBe(25);
      expect(gcd(17, 19)).toBe(1);
    });
  });
  
  describe('lcm', () => {
    test('returns LCM of two numbers', () => {
      expect(lcm(4, 6)).toBe(12);
      expect(lcm(5, 7)).toBe(35);
    });
  });
  
  describe('factorial', () => {
    test('returns factorial of non-negative integer', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(5)).toBe(120);
      expect(factorial(10)).toBe(3628800);
    });
    
    test('throws error for negative input', () => {
      expect(() => factorial(-1)).toThrow();
    });
  });
});

describe('Statistics Module', () => {
  describe('mean', () => {
    test('returns arithmetic mean', () => {
      expect(mean([1, 2, 3, 4, 5])).toBe(3);
      expect(mean([10, 20, 30])).toBe(20);
    });
    
    test('returns 0 for empty array', () => {
      expect(mean([])).toBe(0);
    });
  });
  
  describe('variance', () => {
    test('returns sample variance', () => {
      expect(variance([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(4.571, 2);
    });
  });
  
  describe('stdDev', () => {
    test('returns standard deviation', () => {
      const arr = [2, 4, 4, 4, 5, 5, 7, 9];
      expect(stdDev(arr)).toBeCloseTo(2.138, 2);
    });
  });
  
  describe('median', () => {
    test('returns median for odd-length array', () => {
      expect(median([1, 3, 5])).toBe(3);
    });
    
    test('returns median for even-length array', () => {
      expect(median([1, 2, 3, 4])).toBe(2.5);
    });
  });
});

describe('Probability Module', () => {
  describe('combination', () => {
    test('returns binomial coefficient', () => {
      expect(combination(5, 2)).toBe(10);
      expect(combination(10, 0)).toBe(1);
      expect(combination(10, 10)).toBe(1);
    });
  });
  
  describe('permutation', () => {
    test('returns number of permutations', () => {
      expect(permutation(5, 3)).toBe(60);
      expect(permutation(4, 4)).toBe(24);
    });
  });
});

describe('Number Theory Module', () => {
  describe('isPrime', () => {
    test('correctly identifies prime numbers', () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(7)).toBe(true);
      expect(isPrime(15)).toBe(false);
      expect(isPrime(1)).toBe(false);
    });
  });
  
  describe('primeFactors', () => {
    test('returns prime factorization', () => {
      expect(primeFactors(60)).toEqual([2, 2, 3, 5]);
      expect(primeFactors(17)).toEqual([17]);
    });
  });
});

describe('Trigonometry Module', () => {
  describe('sin', () => {
    test('returns sine in radians', () => {
      expect(sin(Math.PI / 2)).toBeCloseTo(1, 10);
      expect(sin(0)).toBeCloseTo(0, 10);
    });
  });
  
  describe('degreesToRadians', () => {
    test('converts degrees to radians', () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 10);
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI, 10);
    });
  });
});
