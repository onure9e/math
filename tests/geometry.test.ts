import {
  areaCircle,
  areaRectangle,
  areaTriangle,
  volumeSphere,
  volumeCube,
  volumeCylinder,
  volumeCone
} from '../src/geometry';

describe('Geometry Module', () => {
  describe('Area calculations', () => {
    test('calculates circle area', () => {
      expect(areaCircle(1)).toBeCloseTo(Math.PI, 10);
      expect(areaCircle(2)).toBeCloseTo(4 * Math.PI, 10);
    });
    
    test('calculates rectangle area', () => {
      expect(areaRectangle(3, 4)).toBe(12);
      expect(areaRectangle(5, 5)).toBe(25);
    });
    
    test('calculates triangle area', () => {
      expect(areaTriangle(3, 4)).toBe(6);
      expect(areaTriangle(5, 10)).toBe(25);
    });
  });
  
  describe('Volume calculations', () => {
    test('calculates sphere volume', () => {
      expect(volumeSphere(1)).toBeCloseTo(4/3 * Math.PI, 10);
      expect(volumeSphere(3)).toBeCloseTo(36 * Math.PI, 10);
    });
    
    test('calculates cube volume', () => {
      expect(volumeCube(2)).toBe(8);
      expect(volumeCube(3)).toBe(27);
    });
    
    test('calculates cylinder volume', () => {
      expect(volumeCylinder(1, 1)).toBeCloseTo(Math.PI, 10);
      expect(volumeCylinder(2, 5)).toBeCloseTo(20 * Math.PI, 10);
    });
    
    test('calculates cone volume', () => {
      expect(volumeCone(1, 3)).toBeCloseTo(Math.PI, 10);
      expect(volumeCone(3, 4)).toBeCloseTo(12 * Math.PI, 10);
    });
  });
});
