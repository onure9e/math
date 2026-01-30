import {
  sin,
  cos,
  tan,
  degreesToRadians,
  radiansToDegrees
} from '../src/trigonometry/basic';

describe('Trigonometry Module', () => {
  describe('Basic trigonometric functions', () => {
    test('sin calculates sine', () => {
      expect(sin(0)).toBeCloseTo(0, 10);
      expect(sin(Math.PI / 2)).toBeCloseTo(1, 10);
      expect(sin(Math.PI)).toBeCloseTo(0, 10);
    });
    
    test('cos calculates cosine', () => {
      expect(cos(0)).toBeCloseTo(1, 10);
      expect(cos(Math.PI / 2)).toBeCloseTo(0, 10);
      expect(cos(Math.PI)).toBeCloseTo(-1, 10);
    });
    
    test('tan calculates tangent', () => {
      expect(tan(0)).toBeCloseTo(0, 10);
      expect(tan(Math.PI / 4)).toBeCloseTo(1, 10);
    });
    
    test('degreesToRadians converts degrees to radians', () => {
      expect(degreesToRadians(0)).toBeCloseTo(0, 10);
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 10);
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 10);
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI, 10);
    });
    
    test('radiansToDegrees converts radians to degrees', () => {
      expect(radiansToDegrees(0)).toBeCloseTo(0, 10);
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90, 10);
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180, 10);
      expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360, 10);
    });
  });
});
