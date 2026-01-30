import {
  lagrangeInterpolation,
  linearInterpolation,
  newtonInterpolation,
  cubicSplineInterpolation,
  barycentricInterpolation
} from '../src/numerical-methods/interpolation';

describe('Numerical Methods - Interpolation Module', () => {
  describe('linearInterpolation', () => {
    test('interpolates linearly between two points', () => {
      expect(linearInterpolation(0, 0, 10, 10, 5)).toBe(5);
      expect(linearInterpolation(0, 0, 10, 10, 0)).toBe(0);
      expect(linearInterpolation(0, 0, 10, 10, 10)).toBe(10);
    });
    
    test('throws error for identical x values', () => {
      expect(() => linearInterpolation(5, 0, 5, 10, 7)).toThrow('Interpolation points must be distinct');
    });
  });
  
  describe('lagrangeInterpolation', () => {
    test('interpolates through all points', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 4 },
        { x: 3, y: 9 }
      ];
      const fn = lagrangeInterpolation(points);
      
      // Should pass through all given points
      expect(fn(0)).toBeCloseTo(0, 10);
      expect(fn(1)).toBeCloseTo(1, 10);
      expect(fn(2)).toBeCloseTo(4, 10);
      expect(fn(3)).toBeCloseTo(9, 10);
    });
    
    test('is optimized with barycentric weights', () => {
      const points = Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: i * i
      }));
      const fn = lagrangeInterpolation(points);
      
      // Multiple evaluations should be fast
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        fn(10.5);
      }
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100);
    });
  });
  
  describe('newtonInterpolation', () => {
    test('interpolates through all points', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 4 },
        { x: 3, y: 9 }
      ];
      const fn = newtonInterpolation(points);
      
      expect(fn(0)).toBeCloseTo(0, 10);
      expect(fn(1)).toBeCloseTo(1, 10);
      expect(fn(2)).toBeCloseTo(4, 10);
      expect(fn(3)).toBeCloseTo(9, 10);
    });
  });
  
  describe('cubicSplineInterpolation', () => {
    test('creates smooth spline through points', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 4 },
        { x: 3, y: 9 }
      ];
      const fn = cubicSplineInterpolation(points, 'natural');
      
      expect(fn(0)).toBeCloseTo(0, 10);
      expect(fn(1)).toBeCloseTo(1, 10);
      expect(fn(2)).toBeCloseTo(4, 10);
      expect(fn(3)).toBeCloseTo(9, 10);
    });
    
    test('throws error for out of range values', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 1, y: 1 }
      ];
      const fn = cubicSplineInterpolation(points, 'natural');
      
      expect(() => fn(-1)).toThrow('Value out of interpolation range');
      expect(() => fn(2)).toThrow('Value out of interpolation range');
    });
  });
  
  describe('barycentricInterpolation', () => {
    test('interpolates through all points', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 4 },
        { x: 3, y: 9 }
      ];
      const fn = barycentricInterpolation(points);
      
      expect(fn(0)).toBeCloseTo(0, 10);
      expect(fn(1)).toBeCloseTo(1, 10);
      expect(fn(2)).toBeCloseTo(4, 10);
      expect(fn(3)).toBeCloseTo(9, 10);
    });
  });
});
