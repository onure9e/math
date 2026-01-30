import { 
  map, 
  inverseLerp,
  lerp,
  lerpAngle,
  smoothStep,
  smootherStep,
  smoothDamp
} from '../src/core/mapping';

describe('Core Mapping Module', () => {
  describe('map', () => {
    test('maps value from one range to another', () => {
      expect(map(5, 0, 10, 0, 100)).toBe(50);
      expect(map(0, 0, 10, 0, 100)).toBe(0);
      expect(map(10, 0, 10, 0, 100)).toBe(100);
    });
    
    test('throws error when inMin equals inMax', () => {
      expect(() => map(5, 3, 3, 0, 100)).toThrow('Invalid input range');
    });
    
    test('handles negative ranges', () => {
      expect(map(0, -10, 10, 0, 100)).toBe(50);
      expect(map(-5, -10, 10, 0, 100)).toBe(25);
    });
  });
  
  describe('inverseLerp', () => {
    test('calculates inverse lerp correctly', () => {
      expect(inverseLerp(0, 10, 5)).toBe(0.5);
      expect(inverseLerp(0, 10, 0)).toBe(0);
      expect(inverseLerp(0, 10, 10)).toBe(1);
    });
    
    test('throws error when start equals end', () => {
      expect(() => inverseLerp(5, 5, 3)).toThrow('Invalid range');
    });
    
    test('handles values outside range', () => {
      expect(inverseLerp(0, 10, 15)).toBe(1.5);
      expect(inverseLerp(0, 10, -5)).toBe(-0.5);
    });
  });
  
  describe('lerp', () => {
    test('interpolates between two values', () => {
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 1)).toBe(10);
    });
    
    test('handles values outside 0-1 range', () => {
      expect(lerp(0, 10, -0.5)).toBe(-5);
      expect(lerp(0, 10, 1.5)).toBe(15);
    });
  });
  
  describe('smoothStep', () => {
    test('returns 0 at edge0', () => {
      expect(smoothStep(0, 1, 0)).toBe(0);
    });
    
    test('returns 1 at edge1', () => {
      expect(smoothStep(0, 1, 1)).toBe(1);
    });
    
    test('returns 0.5 at midpoint', () => {
      expect(smoothStep(0, 1, 0.5)).toBe(0.5);
    });
    
    test('clamps values outside range', () => {
      expect(smoothStep(0, 1, -0.5)).toBe(0);
      expect(smoothStep(0, 1, 1.5)).toBe(1);
    });
  });
  
  describe('smootherStep', () => {
    test('returns 0 at edge0', () => {
      expect(smootherStep(0, 1, 0)).toBe(0);
    });
    
    test('returns 1 at edge1', () => {
      expect(smootherStep(0, 1, 1)).toBe(1);
    });
    
    test('returns 0.5 at midpoint', () => {
      expect(smootherStep(0, 1, 0.5)).toBe(0.5);
    });
  });
});
