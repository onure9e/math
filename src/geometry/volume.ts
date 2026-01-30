export function volumeSphere(radius: number): number {
  return (4 / 3) * Math.PI * Math.pow(radius, 3);
}

export function volumeCube(side: number): number {
  return Math.pow(side, 3);
}

export function volumeCuboid(length: number, width: number, height: number): number {
  return length * width * height;
}

export function volumeCylinder(radius: number, height: number): number {
  return Math.PI * radius * radius * height;
}

export function volumeCone(radius: number, height: number): number {
  return (1 / 3) * Math.PI * radius * radius * height;
}

export function volumePyramid(baseArea: number, height: number): number {
  return (1 / 3) * baseArea * height;
}

export function volumeTetrahedron(side: number): number {
  return Math.pow(side, 3) / (6 * Math.sqrt(2));
}

export function volumeOctahedron(side: number): number {
  return Math.sqrt(2) * Math.pow(side, 3) / 3;
}

export function volumeDodecahedron(side: number): number {
  return (15 + 7 * Math.sqrt(5)) * Math.pow(side, 3) / 4;
}

export function volumeIcosahedron(side: number): number {
  return (5 * (3 + Math.sqrt(5)) * Math.pow(side, 3)) / 12;
}

export function volumeEllipsoid(radiusX: number, radiusY: number, radiusZ: number): number {
  return (4 / 3) * Math.PI * radiusX * radiusY * radiusZ;
}

export function volumeTorus(majorRadius: number, minorRadius: number): number {
  return 2 * Math.PI * Math.PI * majorRadius * minorRadius * minorRadius;
}

export function volumeCapsule(radius: number, cylinderHeight: number): number {
  const sphereVol = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const cylinderVol = Math.PI * radius * radius * cylinderHeight;
  return sphereVol / 2 + cylinderVol;
}

export function volumeSphericalCap(radius: number, height: number): number {
  return Math.PI * height * height * (radius - height / 3);
}

export function volumeSphericalSegment(
  radius: number,
  height1: number,
  height2: number
): number {
  return Math.PI * ((height2 - height1) / 6) *
         (3 * radius * radius + (height1 + height2) * (height1 + height2));
}

export function volumePrism(baseArea: number, height: number): number {
  return baseArea * height;
}

export function volumeFrustumOfCone(
  radius1: number,
  radius2: number,
  height: number
): number {
  return (1 / 3) * Math.PI * height * (radius1 * radius1 + radius1 * radius2 + radius2 * radius2);
}

export function volumeFrustumOfPyramid(
  area1: number,
  area2: number,
  height: number
): number {
  return (height / 3) * (area1 + area2 + Math.sqrt(area1 * area2));
}

export function volumeEllipticCylinder(radiusX: number, radiusY: number, height: number): number {
  return Math.PI * radiusX * radiusY * height;
}

export function volumeParaboloid(radius: number, height: number): number {
  return (1 / 2) * Math.PI * radius * radius * height;
}

export function volumeHyperboloid(radius: number, height: number): number {
  return (2 / 3) * Math.PI * radius * radius * height;
}

export function volumeTorusSector(majorRadius: number, minorRadius: number, angle: number): number {
  return angle * majorRadius * minorRadius * minorRadius;
}

export function volumeWedge(length: number, width: number, height: number): number {
  return (1 / 6) * length * width * height;
}

export function volumeRegularTetrahedron(side: number): number {
  return Math.pow(side, 3) / (6 * Math.sqrt(2));
}

export function volumeRectangularBox(length: number, width: number, height: number): number {
  return length * width * height;
}

export function volumeConeFrustum(
  radiusBottom: number,
  radiusTop: number,
  height: number
): number {
  return (1 / 3) * Math.PI * height * (radiusBottom * radiusBottom + radiusBottom * radiusTop + radiusTop * radiusTop);
}

export function volumeCylindricalShell(innerRadius: number, outerRadius: number, height: number): number {
  return Math.PI * height * (outerRadius * outerRadius - innerRadius * innerRadius);
}

export function volumeHollowSphere(innerRadius: number, outerRadius: number): number {
  return (4 / 3) * Math.PI * (Math.pow(outerRadius, 3) - Math.pow(innerRadius, 3));
}

export function volumeHollowCylinder(
  innerRadius: number,
  outerRadius: number,
  height: number
): number {
  return Math.PI * height * (outerRadius * outerRadius - innerRadius * innerRadius);
}

export function volumePentagonalPrism(area: number, height: number): number {
  return area * height;
}

export function volumeHexagonalPrism(area: number, height: number): number {
  return area * height;
}

export function volumeOctagonalPrism(area: number, height: number): number {
  return area * height;
}
