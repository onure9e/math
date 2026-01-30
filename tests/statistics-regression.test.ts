import {
  linearRegression,
  polynomialRegression,
  theilSenRegression,
  exponentialRegression,
  powerRegression
} from '../src/statistics/regression';

describe('Statistics - Regression Module', () => {
  describe('linearRegression', () => {
    test('fits line to perfect linear data', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 6, 8, 10];
      const result = linearRegression(x, y);
      
      expect(result.slope).toBeCloseTo(2, 10);
      expect(result.intercept).toBeCloseTo(0, 10);
      expect(result.r2).toBeCloseTo(1, 10);
    });
    
    test('fits line to noisy data', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2.1, 3.9, 6.2, 7.8, 10.1];
      const result = linearRegression(x, y);
      
      expect(result.slope).toBeCloseTo(2, 1);
      expect(result.r2).toBeGreaterThan(0.95);
    });
    
    test('throws error for insufficient data', () => {
      expect(() => linearRegression([1], [2])).toThrow('Arrays must have same length and at least 2 points');
    });
    
    test('throws error for vertical line', () => {
      expect(() => linearRegression([1, 1, 1], [1, 2, 3])).toThrow('Vertical line');
    });
    
    test('predict function works correctly', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 6, 8, 10];
      const result = linearRegression(x, y);
      
      expect(result.predict(6)).toBeCloseTo(12, 10);
      expect(result.predict(0)).toBeCloseTo(0, 10);
    });
  });
  
  describe('polynomialRegression', () => {
    test('fits quadratic to quadratic data', () => {
      const x = [1, 2, 3, 4, 5];
      const y = x.map(xi => xi * xi);
      const result = polynomialRegression(x, y, 2);
      
      expect(result.coefficients[2]).toBeCloseTo(1, 5);
      expect(result.r2).toBeCloseTo(1, 5);
    });
    
    test('fits cubic to cubic data', () => {
      const x = [1, 2, 3, 4, 5];
      const y = x.map(xi => xi * xi * xi);
      const result = polynomialRegression(x, y, 3);
      
      expect(result.coefficients[3]).toBeCloseTo(1, 5);
      expect(result.r2).toBeCloseTo(1, 5);
    });
    
    test('throws error for insufficient data points', () => {
      expect(() => polynomialRegression([1, 2], [1, 4], 3)).toThrow('Insufficient data points');
    });
    
    test('is optimized with precomputed powers', () => {
      const x = Array.from({ length: 1000 }, (_, i) => i);
      const y = x.map(xi => xi * xi + Math.random());
      
      const start = Date.now();
      const result = polynomialRegression(x, y, 5);
      const duration = Date.now() - start;
      
      expect(result.r2).toBeGreaterThan(0.9);
      expect(duration).toBeLessThan(1000);
    });
  });
  
  describe('theilSenRegression', () => {
    test('calculates robust regression', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 6, 8, 10];
      const result = theilSenRegression(x, y);
      
      expect(result.slope).toBeCloseTo(2, 10);
      expect(result.intercept).toBeCloseTo(0, 10);
    });
    
    test('handles outliers better than linear regression', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 6, 8, 100]; // Last point is outlier
      const result = theilSenRegression(x, y);
      
      // Should still find slope close to 2 despite outlier
      expect(result.slope).toBeGreaterThan(1);
      expect(result.slope).toBeLessThan(3);
    });
    
    test('is optimized with sampling for large datasets', () => {
      const x = Array.from({ length: 10000 }, (_, i) => i);
      const y = x.map(xi => 2 * xi + 1 + Math.random());
      
      const start = Date.now();
      const result = theilSenRegression(x, y, 10000);
      const duration = Date.now() - start;
      
      expect(result.slope).toBeCloseTo(2, 1);
      expect(duration).toBeLessThan(1000);
    });
    
    test('throws error for insufficient data', () => {
      expect(() => theilSenRegression([1], [2])).toThrow('Arrays must have same length and at least 2 points');
    });
  });
  
  describe('exponentialRegression', () => {
    test('fits exponential curve', () => {
      const x = [1, 2, 3, 4, 5];
      const y = x.map(xi => 2 * Math.exp(0.5 * xi));
      const result = exponentialRegression(x, y);
      
      expect(result.a).toBeCloseTo(2, 5);
      expect(result.b).toBeCloseTo(0.5, 5);
    });
    
    test('throws error for non-positive y values', () => {
      expect(() => exponentialRegression([1, 2, 3], [-1, 0, 1])).toThrow('All y values must be positive');
    });
  });
  
  describe('powerRegression', () => {
    test('fits power curve', () => {
      const x = [1, 2, 3, 4, 5];
      const y = x.map(xi => 2 * Math.pow(xi, 1.5));
      const result = powerRegression(x, y);
      
      expect(result.a).toBeCloseTo(2, 5);
      expect(result.b).toBeCloseTo(1.5, 5);
    });
    
    test('throws error for non-positive values', () => {
      expect(() => powerRegression([-1, 2, 3], [1, 2, 3])).toThrow('All x and y values must be positive');
    });
  });
});
