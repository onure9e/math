import {
  divide,
  sqrt,
  log,
  factorial,
  gcd,
  lcm,
  extendedGCD,
  modularInverse
} from '../src/arithmetic/operations';

describe('Arithmetic Module', () => {
  describe('divide', () => {
    test('divides two numbers', () => {
      expect(divide(10, 2)).toBe(5);
      expect(divide(7, 2)).toBe(3.5);
    });
    
    test('throws error for division by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });
  
  describe('sqrt', () => {
    test('calculates square root', () => {
      expect(sqrt(4)).toBe(2);
      expect(sqrt(9)).toBe(3);
      expect(sqrt(2)).toBeCloseTo(1.414, 3);
    });
    
    test('throws error for negative input', () => {
      expect(() => sqrt(-4)).toThrow('Square root of negative number');
    });
  });
  
  describe('log', () => {
    test('calculates logarithm', () => {
      expect(log(100, 10)).toBe(2);
      expect(log(Math.E, Math.E)).toBe(1);
    });
    
    test('throws error for non-positive input', () => {
      expect(() => log(0, 10)).toThrow('Logarithm of non-positive number');
      expect(() => log(-5, 10)).toThrow('Logarithm of non-positive number');
    });
    
    test('throws error for invalid base', () => {
      expect(() => log(10, 0)).toThrow('Invalid logarithm base');
      expect(() => log(10, 1)).toThrow('Invalid logarithm base');
      expect(() => log(10, -2)).toThrow('Invalid logarithm base');
    });
  });
  
  describe('factorial', () => {
    test('calculates factorial', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(5)).toBe(120);
    });
    
    test('throws error for negative input', () => {
      expect(() => factorial(-1)).toThrow('Factorial requires non-negative integer');
    });
    
    test('throws error for non-integer input', () => {
      expect(() => factorial(3.5)).toThrow('Factorial requires non-negative integer');
    });
    
    test('returns Infinity for large values', () => {
      expect(factorial(171)).toBe(Infinity);
    });
  });
  
  describe('gcd', () => {
    test('calculates GCD correctly', () => {
      expect(gcd(48, 18)).toBe(6);
      expect(gcd(100, 25)).toBe(25);
      expect(gcd(17, 19)).toBe(1);
    });
    
    test('handles negative numbers', () => {
      expect(gcd(-48, 18)).toBe(6);
      expect(gcd(48, -18)).toBe(6);
    });
    
    test('handles zero', () => {
      expect(gcd(0, 5)).toBe(5);
      expect(gcd(5, 0)).toBe(5);
    });
  });
  
  describe('lcm', () => {
    test('calculates LCM correctly', () => {
      expect(lcm(4, 6)).toBe(12);
      expect(lcm(5, 7)).toBe(35);
    });
    
    test('returns 0 when either number is 0', () => {
      expect(lcm(0, 5)).toBe(0);
      expect(lcm(5, 0)).toBe(0);
    });
  });
  
  describe('extendedGCD', () => {
    test('calculates extended GCD correctly', () => {
      const result = extendedGCD(48, 18);
      expect(result.gcd).toBe(6);
      expect(result.x * 48 + result.y * 18).toBe(6);
    });
    
    test('is iterative (no stack overflow)', () => {
      // This would cause stack overflow with recursive version
      const result = extendedGCD(1000000, 123456);
      expect(result.gcd).toBeGreaterThan(0);
      expect(result.x * 1000000 + result.y * 123456).toBe(result.gcd);
    });
  });
  
  describe('modularInverse', () => {
    test('calculates modular inverse correctly', () => {
      expect(modularInverse(3, 11)).toBe(4); // 3 * 4 ≡ 1 (mod 11)
      expect(modularInverse(7, 13)).toBe(2); // 7 * 2 ≡ 1 (mod 13)
    });
    
    test('throws error when inverse does not exist', () => {
      expect(() => modularInverse(6, 9)).toThrow('Modular inverse does not exist');
    });
  });
});
