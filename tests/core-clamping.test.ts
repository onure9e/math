import {
  wrap,
  clamp,
  clamp01,
  mirror,
  pingPong
} from '../src/core/clamping';

describe('Core Clamping Module', () => {
  describe('clamp', () => {
    test('returns value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
    
    test('clamps to min when below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });
    
    test('clamps to max when above range', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });
    
    test('handles edge cases', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });
  
  describe('clamp01', () => {
    test('clamps to 0-1 range', () => {
      expect(clamp01(0.5)).toBe(0.5);
      expect(clamp01(-0.5)).toBe(0);
      expect(clamp01(1.5)).toBe(1);
    });
  });
  
  describe('wrap', () => {
    test('wraps value within range', () => {
      expect(wrap(15, 0, 10)).toBe(5);
      expect(wrap(-5, 0, 10)).toBe(5);
    });
    
    test('returns value within range unchanged', () => {
      expect(wrap(5, 0, 10)).toBe(5);
    });
    
    test('throws error when min equals max', () => {
      expect(() => wrap(5, 3, 3)).toThrow('Invalid range');
    });
    
    test('handles negative ranges', () => {
      expect(wrap(15, -10, 10)).toBe(-5);
    });
  });
  
  describe('mirror', () => {
    test('mirrors value within range', () => {
      expect(mirror(5, 0, 10)).toBe(5);
      expect(mirror(15, 0, 10)).toBe(5);
      expect(mirror(-5, 0, 10)).toBe(5);
    });
    
    test('throws error when min equals max', () => {
      expect(() => mirror(5, 3, 3)).toThrow('Invalid range');
    });
  });
  
  describe('pingPong', () => {
    test('ping-pongs value within range', () => {
      expect(pingPong(5, 0, 10)).toBe(5);
      expect(pingPong(15, 0, 10)).toBe(5);
    });
    
    test('throws error when min equals max', () => {
      expect(() => pingPong(5, 3, 3)).toThrow('Invalid range');
    });
  });
});
