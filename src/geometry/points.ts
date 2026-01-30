export function distance2D(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function distance3D(p1: Point3D, p2: Point3D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function midpoint2D(p1: Point2D, p2: Point2D): Point2D {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

export function midpoint3D(p1: Point3D, p2: Point3D): Point3D {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
    z: (p1.z + p2.z) / 2
  };
}

export function centroid2D(points: Point2D[]): Point2D {
  if (points.length === 0) return { x: 0, y: 0 };
  
  let sumX = 0, sumY = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
  }
  
  return { x: sumX / points.length, y: sumY / points.length };
}

export function centroid3D(points: Point3D[]): Point3D {
  if (points.length === 0) return { x: 0, y: 0, z: 0 };
  
  let sumX = 0, sumY = 0, sumZ = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumZ += p.z;
  }
  
  return { x: sumX / points.length, y: sumY / points.length, z: sumZ / points.length };
}

export function slope(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  if (Math.abs(dx) < 1e-15) return Infinity;
  return (p2.y - p1.y) / dx;
}

export function angle(p1: Point2D, p2: Point2D, p3: Point2D): number {
  const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
  
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  const cosAngle = dot / (mag1 * mag2);
  return Math.acos(Math.max(-1, Math.min(1, cosAngle)));
}

export function pointOnLine(p: Point2D, line: Line2D, tolerance: number = 1e-10): boolean {
  const cross = (line.p2.x - line.p1.x) * (p.y - line.p1.y) - (line.p2.y - line.p1.y) * (p.x - line.p1.x);
  return Math.abs(cross) < tolerance;
}

export function rotatePoint(p: Point2D, center: Point2D, angle: number): Point2D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos
  };
}

export function reflectPoint(p: Point2D, line: Line2D): Point2D {
  const dx = line.p2.x - line.p1.x;
  const dy = line.p2.y - line.p1.y;
  const len2 = dx * dx + dy * dy;
  
  const t = ((p.x - line.p1.x) * dx + (p.y - line.p1.y) * dy) / len2;
  
  const projX = line.p1.x + t * dx;
  const projY = line.p1.y + t * dy;
  
  return {
    x: 2 * projX - p.x,
    y: 2 * projY - p.y
  };
}

export function scalePoint(p: Point2D, center: Point2D, scaleX: number, scaleY: number): Point2D {
  return {
    x: center.x + (p.x - center.x) * scaleX,
    y: center.y + (p.y - center.y) * scaleY
  };
}

export function translatePoint(p: Point2D, dx: number, dy: number): Point2D {
  return { x: p.x + dx, y: p.y + dy };
}

export function projectPoint(p: Point2D, line: Line2D): Point2D {
  const dx = line.p2.x - line.p1.x;
  const dy = line.p2.y - line.p1.y;
  const len2 = dx * dx + dy * dy;
  
  if (len2 === 0) return { ...line.p1 };
  
  const t = ((p.x - line.p1.x) * dx + (p.y - line.p1.y) * dy) / len2;
  
  return {
    x: line.p1.x + t * dx,
    y: line.p1.y + t * dy
  };
}

export function closestPointOnSegment(p: Point2D, a: Point2D, b: Point2D): Point2D {
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const ap = { x: p.x - a.x, y: p.y - a.y };
  
  const abLen2 = ab.x * ab.x + ab.y * ab.y;
  
  if (abLen2 === 0) return { ...a };
  
  const t = (ap.x * ab.x + ap.y * ab.y) / abLen2;
  
  if (t < 0) return { ...a };
  if (t > 1) return { ...b };
  
  return {
    x: a.x + t * ab.x,
    y: a.y + t * ab.y
  };
}

export function pointToLineDistance(p: Point2D, line: Line2D): number {
  const { x: x1, y: y1 } = line.p1;
  const { x: x2, y: y2 } = line.p2;
  
  const A = p.x - x1;
  const B = p.y - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const len2 = C * C + D * D;
  
  const param = len2 !== 0 ? dot / len2 : -1;
  
  let xx, yy;
  
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  
  const dx = p.x - xx;
  const dy = p.y - yy;
  
  return Math.sqrt(dx * dx + dy * dy);
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Line2D {
  p1: Point2D;
  p2: Point2D;
}

export interface Line3D {
  p1: Point3D;
  p2: Point3D;
}

export interface Plane {
  point: Point3D;
  normal: Vector3D;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}
