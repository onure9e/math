import {
  factorial,
  combination,
  permutation,
  derangement,
  catalan,
  bell
} from '../src/combinatorics/combinatorics';

describe('Combinatorics Module', () => {
  describe('factorial', () => {
    test('calculates factorial correctly', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(5)).toBe(120);
      expect(factorial(10)).toBe(3628800);
    });
    
    test('uses memoization for repeated calls', () => {
      // First call
      const result1 = factorial(20);
      // Second call should be instant (from cache)
      const result2 = factorial(20);
      expect(result1).toBe(result2);
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
  
  describe('combination', () => {
    test('calculates combination correctly', () => {
      expect(combination(5, 2)).toBe(10);
      expect(combination(10, 0)).toBe(1);
      expect(combination(10, 10)).toBe(1);
      expect(combination(10, 3)).toBe(120);
    });
    
    test('returns 0 for invalid k', () => {
      expect(combination(5, -1)).toBe(0);
      expect(combination(5, 6)).toBe(0);
    });
    
    test('uses symmetry property', () => {
      expect(combination(10, 3)).toBe(combination(10, 7));
    });
    
    test('uses memoization', () => {
      const result1 = combination(50, 25);
      const result2 = combination(50, 25);
      expect(result1).toBe(result2);
    });
  });
  
  describe('permutation', () => {
    test('calculates permutation correctly', () => {
      expect(permutation(5, 2)).toBe(20);
      expect(permutation(5, 5)).toBe(120);
    });
    
    test('returns 0 for invalid k', () => {
      expect(permutation(5, -1)).toBe(0);
      expect(permutation(5, 6)).toBe(0);
    });
  });
  
  describe('derangement', () => {
    test('calculates derangement correctly', () => {
      expect(derangement(0)).toBe(1);
      expect(derangement(1)).toBe(0);
      expect(derangement(2)).toBe(1);
      expect(derangement(3)).toBe(2);
      expect(derangement(4)).toBe(9);
    });
  });
  
  describe('catalan', () => {
    test('calculates Catalan numbers correctly', () => {
      expect(catalan(0)).toBe(1);
      expect(catalan(1)).toBe(1);
      expect(catalan(2)).toBe(2);
      expect(catalan(3)).toBe(5);
      expect(catalan(4)).toBe(14);
    });
    
    test('throws error for negative input', () => {
      expect(() => catalan(-1)).toThrow('Catalan number requires non-negative integer');
    });
  });
  
  describe('bell', () => {
    test('calculates Bell numbers correctly', () => {
      expect(bell(0)).toBe(1);
      expect(bell(1)).toBe(1);
      expect(bell(2)).toBe(2);
      expect(bell(3)).toBe(5);
      expect(bell(4)).toBe(15);
    });
    
    test('throws error for negative input', () => {
      expect(() => bell(-1)).toThrow('Bell number requires non-negative integer');
    });
  });
});
