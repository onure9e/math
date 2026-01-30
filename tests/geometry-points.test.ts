import {
  distance2D,
  distance3D,
  midpoint2D,
  midpoint3D,
  centroid2D,
  centroid3D,
  slope,
  angle,
  pointOnLine,
  rotatePoint,
  reflectPoint,
  scalePoint,
  translatePoint,
  projectPoint,
  closestPointOnSegment,
  pointToLineDistance,
  Point2D,
  Point3D,
  Line2D
} from '../src/geometry/points';

describe('Geometry Points Module', () => {
  describe('distance2D', () => {
    test('calculates distance between two 2D points', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 3, y: 4 };
      expect(distance2D(p1, p2)).toBe(5);
    });
    
    test('calculates distance for negative coordinates', () => {
      const p1: Point2D = { x: -1, y: -1 };
      const p2: Point2D = { x: 2, y: 3 };
      expect(distance2D(p1, p2)).toBe(5);
    });
    
    test('returns 0 for same point', () => {
      const p: Point2D = { x: 5, y: 5 };
      expect(distance2D(p, p)).toBe(0);
    });
  });

  describe('distance3D', () => {
    test('calculates distance between two 3D points', () => {
      const p1: Point3D = { x: 0, y: 0, z: 0 };
      const p2: Point3D = { x: 1, y: 2, z: 2 };
      expect(distance3D(p1, p2)).toBe(3);
    });
    
    test('returns 0 for same point', () => {
      const p: Point3D = { x: 5, y: 5, z: 5 };
      expect(distance3D(p, p)).toBe(0);
    });
  });

  describe('midpoint2D', () => {
    test('calculates midpoint of two 2D points', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 4, y: 6 };
      expect(midpoint2D(p1, p2)).toEqual({ x: 2, y: 3 });
    });
    
    test('handles negative coordinates', () => {
      const p1: Point2D = { x: -4, y: -6 };
      const p2: Point2D = { x: 0, y: 0 };
      expect(midpoint2D(p1, p2)).toEqual({ x: -2, y: -3 });
    });
  });

  describe('midpoint3D', () => {
    test('calculates midpoint of two 3D points', () => {
      const p1: Point3D = { x: 0, y: 0, z: 0 };
      const p2: Point3D = { x: 2, y: 4, z: 6 };
      expect(midpoint3D(p1, p2)).toEqual({ x: 1, y: 2, z: 3 });
    });
  });

  describe('centroid2D', () => {
    test('calculates centroid of multiple points', () => {
      const points: Point2D[] = [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
        { x: 2, y: 4 }
      ];
      expect(centroid2D(points)).toEqual({ x: 2, y: 4 / 3 });
    });
    
    test('returns origin for empty array', () => {
      expect(centroid2D([])).toEqual({ x: 0, y: 0 });
    });
    
    test('handles single point', () => {
      const points: Point2D[] = [{ x: 5, y: 5 }];
      expect(centroid2D(points)).toEqual({ x: 5, y: 5 });
    });
  });

  describe('centroid3D', () => {
    test('calculates centroid of multiple 3D points', () => {
      const points: Point3D[] = [
        { x: 0, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 1, y: 2, z: 0 },
        { x: 1, y: 1, z: 2 }
      ];
      expect(centroid3D(points)).toEqual({ x: 1, y: 0.75, z: 0.5 });
    });
    
    test('returns origin for empty array', () => {
      expect(centroid3D([])).toEqual({ x: 0, y: 0, z: 0 });
    });
  });

  describe('slope', () => {
    test('calculates slope between two points', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 2, y: 4 };
      expect(slope(p1, p2)).toBe(2);
    });
    
    test('returns Infinity for vertical line', () => {
      const p1: Point2D = { x: 5, y: 0 };
      const p2: Point2D = { x: 5, y: 5 };
      expect(slope(p1, p2)).toBe(Infinity);
    });
    
    test('returns 0 for horizontal line', () => {
      const p1: Point2D = { x: 0, y: 5 };
      const p2: Point2D = { x: 5, y: 5 };
      expect(slope(p1, p2)).toBe(0);
    });
  });

  describe('angle', () => {
    test('calculates angle at middle point', () => {
      const p1: Point2D = { x: 1, y: 0 };
      const p2: Point2D = { x: 0, y: 0 };
      const p3: Point2D = { x: 0, y: 1 };
      expect(angle(p1, p2, p3)).toBeCloseTo(Math.PI / 2);
    });
    
    test('returns 0 for degenerate case', () => {
      const p: Point2D = { x: 0, y: 0 };
      expect(angle(p, p, p)).toBe(0);
    });
  });

  describe('pointOnLine', () => {
    test('returns true for point on line', () => {
      const line: Line2D = { p1: { x: 0, y: 0 }, p2: { x: 10, y: 10 } };
      expect(pointOnLine({ x: 5, y: 5 }, line)).toBe(true);
    });
    
    test('returns false for point off line', () => {
      const line: Line2D = { p1: { x: 0, y: 0 }, p2: { x: 10, y: 0 } };
      expect(pointOnLine({ x: 5, y: 1 }, line)).toBe(false);
    });
    
    test('respects tolerance', () => {
      const line: Line2D = { p1: { x: 0, y: 0 }, p2: { x: 10, y: 0 } };
      expect(pointOnLine({ x: 5, y: 0.0001 }, line, 0.002)).toBe(true);
      expect(pointOnLine({ x: 5, y: 0.0001 }, line, 0.00005)).toBe(false);
    });
  });

  describe('rotatePoint', () => {
    test('rotates point around center', () => {
      const p: Point2D = { x: 1, y: 0 };
      const center: Point2D = { x: 0, y: 0 };
      const rotated = rotatePoint(p, center, Math.PI / 2);
      expect(rotated.x).toBeCloseTo(0);
      expect(rotated.y).toBeCloseTo(1);
    });
    
    test('360 degree rotation returns original point', () => {
      const p: Point2D = { x: 3, y: 4 };
      const center: Point2D = { x: 0, y: 0 };
      const rotated = rotatePoint(p, center, 2 * Math.PI);
      expect(rotated.x).toBeCloseTo(3);
      expect(rotated.y).toBeCloseTo(4);
    });
  });

  describe('reflectPoint', () => {
    test('reflects point across line', () => {
      const p: Point2D = { x: 1, y: 1 };
      const line: Line2D = { p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } };
      const reflected = reflectPoint(p, line);
      expect(reflected.x).toBeCloseTo(1);
      expect(reflected.y).toBeCloseTo(-1);
    });
  });

  describe('scalePoint', () => {
    test('scales point from center', () => {
      const p: Point2D = { x: 4, y: 4 };
      const center: Point2D = { x: 0, y: 0 };
      const scaled = scalePoint(p, center, 0.5, 0.5);
      expect(scaled).toEqual({ x: 2, y: 2 });
    });
    
    test('handles non-uniform scaling', () => {
      const p: Point2D = { x: 4, y: 4 };
      const center: Point2D = { x: 0, y: 0 };
      const scaled = scalePoint(p, center, 2, 0.5);
      expect(scaled).toEqual({ x: 8, y: 2 });
    });
  });

  describe('translatePoint', () => {
    test('translates point by offset', () => {
      const p: Point2D = { x: 1, y: 2 };
      const translated = translatePoint(p, 3, 4);
      expect(translated).toEqual({ x: 4, y: 6 });
    });
    
    test('handles negative translation', () => {
      const p: Point2D = { x: 5, y: 5 };
      const translated = translatePoint(p, -2, -3);
      expect(translated).toEqual({ x: 3, y: 2 });
    });
  });

  describe('projectPoint', () => {
    test('projects point onto line', () => {
      const p: Point2D = { x: 1, y: 1 };
      const line: Line2D = { p1: { x: 0, y: 0 }, p2: { x: 2, y: 0 } };
      const projected = projectPoint(p, line);
      expect(projected.x).toBeCloseTo(1);
      expect(projected.y).toBeCloseTo(0);
    });
    
    test('handles projection beyond line segment', () => {
      const p: Point2D = { x: 5, y: 5 };
      const line: Line2D = { p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } };
      const projected = projectPoint(p, line);
      expect(projected.x).toBeCloseTo(5);
      expect(projected.y).toBeCloseTo(0);
    });
  });

  describe('closestPointOnSegment', () => {
    test('returns closest point on segment', () => {
      const p: Point2D = { x: 5, y: 5 };
      const a: Point2D = { x: 0, y: 0 };
      const b: Point2D = { x: 10, y: 0 };
      const closest = closestPointOnSegment(p, a, b);
      expect(closest).toEqual({ x: 5, y: 0 });
    });
    
    test('returns endpoint when projection is beyond segment', () => {
      const p: Point2D = { x: -5, y: 5 };
      const a: Point2D = { x: 0, y: 0 };
      const b: Point2D = { x: 10, y: 0 };
      const closest = closestPointOnSegment(p, a, b);
      expect(closest).toEqual({ x: 0, y: 0 });
    });
    
    test('handles degenerate segment', () => {
      const p: Point2D = { x: 5, y: 5 };
      const a: Point2D = { x: 3, y: 3 };
      const closest = closestPointOnSegment(p, a, a);
      expect(closest).toEqual({ x: 3, y: 3 });
    });
  });

  describe('pointToLineDistance', () => {
    test('calculates perpendicular distance', () => {
      const p: Point2D = { x: 0, y: 3 };
      const line: Line2D = { p1: { x: -5, y: 0 }, p2: { x: 5, y: 0 } };
      expect(pointToLineDistance(p, line)).toBe(3);
    });
    
    test('returns distance to endpoint when projection is beyond segment', () => {
      const p: Point2D = { x: 15, y: 0 };
      const line: Line2D = { p1: { x: 0, y: 0 }, p2: { x: 10, y: 0 } };
      expect(pointToLineDistance(p, line)).toBe(5);
    });
  });
});
