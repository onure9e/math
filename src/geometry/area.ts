import type { Point2D, Point3D } from './points';

export function areaTriangle(base: number, height: number): number;
export function areaTriangle(p1: Point2D, p2: Point2D, p3: Point2D): number;

export function areaTriangle(a: number | Point2D, b: number | Point2D, c?: number | Point2D): number {
  if (typeof a === 'number' && typeof b === 'number') {
    return 0.5 * a * b;
  }

  if (typeof a === 'object' && typeof b === 'object' && typeof c === 'object') {
    const p1 = a as Point2D;
    const p2 = b as Point2D;
    const p3 = c as Point2D;

    return Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2);
  }

  throw new Error('Invalid arguments');
}

export function areaRectangle(width: number, height: number): number {
  return width * height;
}

export function areaSquare(side: number): number {
  return side * side;
}

export function areaCircle(radius: number): number {
  return Math.PI * radius * radius;
}

export function areaEllipse(radiusX: number, radiusY: number): number {
  return Math.PI * radiusX * radiusY;
}

export function areaParallelogram(base: number, height: number): number {
  return base * height;
}

export function areaTrapezoid(base1: number, base2: number, height: number): number {
  return ((base1 + base2) / 2) * height;
}

export function areaRhombus(diagonal1: number, diagonal2: number): number {
  return (diagonal1 * diagonal2) / 2;
}

export function areaKite(diagonal1: number, diagonal2: number): number {
  return (diagonal1 * diagonal2) / 2;
}

export function areaRegularPolygon(sides: number, sideLength: number): number {
  if (sides < 3) throw new Error('Polygon must have at least 3 sides');
  return (sides * sideLength * sideLength) / (4 * Math.tan(Math.PI / sides));
}

export function areaPolygon(points: Point2D[]): number {
  if (points.length < 3) return 0;

  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const pI = points[i];
    const pJ = points[j];
    if (pI === undefined || pJ === undefined) continue;
    area += pI.x * pJ.y;
    area -= pJ.x * pI.y;
  }

  return Math.abs(area / 2);
}

export function areaIrregularPolygon(sides: number, apothem: number): number {
  if (sides < 3) throw new Error('Polygon must have at least 3 sides');
  return (sides * apothem * apothem) / Math.tan(Math.PI / sides);
}

export function areaSector(radius: number, angle: number): number {
  return 0.5 * radius * radius * angle;
}

export function areaSegment(radius: number, angle: number): number {
  return 0.5 * radius * radius * (angle - Math.sin(angle));
}

export function areaAnnulus(innerRadius: number, outerRadius: number): number {
  return Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius);
}

export function areaLune(radius1: number, radius2: number, distance: number): number {
  const a = radius1;
  const b = radius2;
  const d = distance;
  
  if (d >= a + b || d <= Math.abs(a - b)) return 0;
  
  const area1 = a * a * Math.acos((d * d + a * a - b * b) / (2 * d * a));
  const area2 = b * b * Math.acos((d * d + b * b - a * a) / (2 * d * b));
  const area3 = 0.5 * Math.sqrt((-d + a + b) * (d + a - b) * (d - a + b) * (d + a + b));
  
  return area1 + area2 - area3;
}

export function areaSphericalCap(radius: number, height: number): number {
  return 2 * Math.PI * radius * height;
}

export function areaSphericalZone(radius: number, height1: number, height2: number): number {
  return 2 * Math.PI * radius * Math.abs(height2 - height1);
}

export function areaSphericalTriangle(
  radius: number,
  angleA: number,
  angleB: number,
  angleC: number
): number {
  return radius * radius * (angleA + angleB + angleC - Math.PI);
}

export function areaEllipsoid(radiusX: number, radiusY: number, radiusZ: number): number {
  const p = Math.pow(1 / radiusX, 1.6666) + Math.pow(1 / radiusY, 1.6666) + Math.pow(1 / radiusZ, 1.6666);
  return 4 * Math.PI * Math.pow(p, -0.6) * radiusX * radiusY * radiusZ;
}

export function areaSphere(radius: number): number {
  return 4 * Math.PI * radius * radius;
}

export function areaHemisphere(radius: number): number {
  return 2 * Math.PI * radius * radius;
}

export function areaCylinder(radius: number, height: number): number {
  return 2 * Math.PI * radius * (radius + height);
}

export function areaCone(radius: number, height: number): number {
  const slantHeight = Math.sqrt(radius * radius + height * height);
  return Math.PI * radius * (radius + slantHeight);
}

export function areaTorus(majorRadius: number, minorRadius: number): number {
  return 4 * Math.PI * Math.PI * majorRadius * minorRadius;
}

export function perimeterCircle(radius: number): number {
  return 2 * Math.PI * radius;
}

export function perimeterRectangle(width: number, height: number): number {
  return 2 * (width + height);
}

export function perimeterSquare(side: number): number {
  return 4 * side;
}

export function perimeterTriangle(side1: number, side2: number, side3: number): number {
  return side1 + side2 + side3;
}

export function perimeterRegularPolygon(sides: number, sideLength: number): number {
  return sides * sideLength;
}

export function perimeterEllipse(radiusX: number, radiusY: number): number {
  const h = Math.pow(radiusX - radiusY, 2) / Math.pow(radiusX + radiusY, 2);
  return Math.PI * (radiusX + radiusY) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)));
}

export function circumference(radius: number): number {
  return 2 * Math.PI * radius;
}

export function arcLength(radius: number, angle: number): number {
  return radius * angle;
}

export function chordLength(radius: number, angle: number): number {
  return 2 * radius * Math.sin(angle / 2);
}

export function areaTriangle3D(a: Point3D, b: Point3D, c: Point3D): number {
  const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
  const ac = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
  
  const cross = {
    x: ab.y * ac.z - ab.z * ac.y,
    y: ab.z * ac.x - ab.x * ac.z,
    z: ab.x * ac.y - ab.y * ac.x
  };
  
  return Math.sqrt(cross.x * cross.x + cross.y * cross.y + cross.z * cross.z) / 2;
}

export function surfaceAreaTetrahedron(side: number): number {
  return Math.sqrt(3) * side * side;
}

export function surfaceAreaOctahedron(side: number): number {
  return 2 * Math.sqrt(3) * side * side;
}

export function surfaceAreaDodecahedron(side: number): number {
  return 3 * Math.sqrt(25 + 10 * Math.sqrt(5)) * side * side;
}

export function surfaceAreaIcosahedron(side: number): number {
  return 5 * Math.sqrt(3) * side * side;
}

export function areaRegularTetrahedron(side: number): number {
  return Math.sqrt(3) * side * side;
}

export function areaCube(side: number): number {
  return 6 * side * side;
}

export function areaRectangularPrism(length: number, width: number, height: number): number {
  return 2 * (length * width + length * height + width * height);
}

// Point2D and Point3D interfaces are defined in ./points
