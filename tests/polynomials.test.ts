import {
  polyAdd,
  polySub,
  polyMult,
  polyEval,
  polyDerivative,
  polyIntegral,
  polyRoots,
  polyDivide
} from '../src/polynomials';

describe('Polynomials Module', () => {
  describe('Basic operations', () => {
    test('adds two polynomials', () => {
      // (1 + 2x) + (3 + 4x) = 4 + 6x
      const result = polyAdd([1, 2], [3, 4]);
      expect(result).toEqual([4, 6]);
    });
    
    test('subtracts two polynomials', () => {
      // (3 + 4x) - (1 + 2x) = 2 + 2x
      const result = polySub([3, 4], [1, 2]);
      expect(result).toEqual([2, 2]);
    });
    
    test('multiplies two polynomials', () => {
      // (1 + x) * (1 + x) = 1 + 2x + x^2
      const result = polyMult([1, 1], [1, 1]);
      expect(result).toEqual([1, 2, 1]);
    });
    
    test('evaluates polynomial', () => {
      // p(x) = 1 + 2x + 3x^2, p(2) = 1 + 4 + 12 = 17
      expect(polyEval([1, 2, 3], 2)).toBe(17);
    });
    
    test('calculates derivative', () => {
      // d/dx(1 + 2x + 3x^2) = 2 + 6x
      const result = polyDerivative([1, 2, 3]);
      expect(result).toEqual([2, 6]);
    });
    
    test('calculates integral', () => {
      // ∫(1 + 2x)dx = x + x^2 (with C=0)
      const result = polyIntegral([1, 2], 0);
      expect(result).toEqual([0, 1, 1]);
    });
    
    test('divides polynomials', () => {
      // (x^2 + 2x + 1) / (x + 1) = (x + 1) remainder 0
      const result = polyDivide([1, 2, 1], [1, 1]);
      expect(result.quotient).toEqual([1, 1]);
      expect(result.remainder).toEqual([]); // Empty array represents zero polynomial
    });
    
    test('finds roots of quadratic', () => {
      // x^2 - 5x + 6 = 0, roots at x = 2 and x = 3
      const roots = polyRoots([6, -5, 1]);
      expect(roots).toContainEqual(2);
      expect(roots).toContainEqual(3);
    });
    
    test('finds root of linear polynomial', () => {
      // 2x + 4 = 0, root at x = -2
      const roots = polyRoots([4, 2]);
      expect(roots).toEqual([-2]);
    });
  });
});
