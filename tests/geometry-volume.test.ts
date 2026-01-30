import {
  volumeSphere,
  volumeCube,
  volumeCuboid,
  volumeCylinder,
  volumeCone,
  volumePyramid,
  volumeTetrahedron,
  volumeOctahedron,
  volumeDodecahedron,
  volumeIcosahedron,
  volumeEllipsoid,
  volumeTorus,
  volumeCapsule,
  volumeSphericalCap,
  volumeSphericalSegment,
  volumePrism,
  volumeFrustumOfCone,
  volumeFrustumOfPyramid,
  volumeEllipticCylinder,
  volumeParaboloid,
  volumeHyperboloid,
  volumeTorusSector,
  volumeWedge,
  volumeRegularTetrahedron,
  volumeRectangularBox,
  volumeConeFrustum,
  volumeCylindricalShell,
  volumeHollowSphere,
  volumeHollowCylinder,
  volumePentagonalPrism,
  volumeHexagonalPrism,
  volumeOctagonalPrism
} from '../src/geometry/volume';

describe('Geometry Volume Module', () => {
  describe('volumeSphere', () => {
    test('calculates volume of sphere', () => {
      expect(volumeSphere(1)).toBeCloseTo(4.18879, 5);
      expect(volumeSphere(2)).toBeCloseTo(33.5103, 4);
    });
    
    test('returns 0 for radius 0', () => {
      expect(volumeSphere(0)).toBe(0);
    });
  });

  describe('volumeCube', () => {
    test('calculates volume of cube', () => {
      expect(volumeCube(2)).toBe(8);
      expect(volumeCube(3)).toBe(27);
    });
    
    test('returns 0 for side 0', () => {
      expect(volumeCube(0)).toBe(0);
    });
  });

  describe('volumeCuboid', () => {
    test('calculates volume of cuboid', () => {
      expect(volumeCuboid(2, 3, 4)).toBe(24);
    });
    
    test('returns 0 when any dimension is 0', () => {
      expect(volumeCuboid(2, 0, 4)).toBe(0);
    });
  });

  describe('volumeCylinder', () => {
    test('calculates volume of cylinder', () => {
      expect(volumeCylinder(1, 1)).toBeCloseTo(3.14159, 5);
      expect(volumeCylinder(2, 3)).toBeCloseTo(37.699, 3);
    });
  });

  describe('volumeCone', () => {
    test('calculates volume of cone', () => {
      expect(volumeCone(3, 4)).toBeCloseTo(37.699, 3);
    });
  });

  describe('volumePyramid', () => {
    test('calculates volume of pyramid', () => {
      expect(volumePyramid(9, 4)).toBe(12);
    });
  });

  describe('volumeTetrahedron', () => {
    test('calculates volume of tetrahedron', () => {
      expect(volumeTetrahedron(1)).toBeCloseTo(0.11785, 5);
    });
  });

  describe('volumeOctahedron', () => {
    test('calculates volume of octahedron', () => {
      expect(volumeOctahedron(1)).toBeCloseTo(0.4714, 4);
    });
  });

  describe('volumeDodecahedron', () => {
    test('calculates volume of dodecahedron', () => {
      expect(volumeDodecahedron(1)).toBeCloseTo(7.663, 3);
    });
  });

  describe('volumeIcosahedron', () => {
    test('calculates volume of icosahedron', () => {
      expect(volumeIcosahedron(1)).toBeCloseTo(2.1817, 4);
    });
  });

  describe('volumeEllipsoid', () => {
    test('calculates volume of ellipsoid', () => {
      expect(volumeEllipsoid(1, 2, 3)).toBeCloseTo(25.1327, 4);
    });
  });

  describe('volumeTorus', () => {
    test('calculates volume of torus', () => {
      expect(volumeTorus(5, 1)).toBeCloseTo(98.696, 3);
    });
  });

  describe('volumeCapsule', () => {
    test('calculates volume of capsule', () => {
      expect(volumeCapsule(1, 2)).toBeCloseTo(8.3776, 4);
    });
  });

  describe('volumeSphericalCap', () => {
    test('calculates volume of spherical cap', () => {
      expect(volumeSphericalCap(5, 2)).toBeCloseTo(54.454, 3);
    });
  });

  describe('volumeSphericalSegment', () => {
    test('calculates volume of spherical segment', () => {
      expect(volumeSphericalSegment(5, 1, 3)).toBeCloseTo(95.295, 3);
    });
  });

  describe('volumePrism', () => {
    test('calculates volume of prism', () => {
      expect(volumePrism(10, 5)).toBe(50);
    });
  });

  describe('volumeFrustumOfCone', () => {
    test('calculates volume of frustum of cone', () => {
      expect(volumeFrustumOfCone(3, 2, 4)).toBeCloseTo(79.587, 3);
    });
  });

  describe('volumeFrustumOfPyramid', () => {
    test('calculates volume of frustum of pyramid', () => {
      expect(volumeFrustumOfPyramid(9, 4, 3)).toBe(19);
    });
  });

  describe('volumeEllipticCylinder', () => {
    test('calculates volume of elliptic cylinder', () => {
      expect(volumeEllipticCylinder(2, 3, 5)).toBeCloseTo(94.248, 3);
    });
  });

  describe('volumeParaboloid', () => {
    test('calculates volume of paraboloid', () => {
      expect(volumeParaboloid(3, 4)).toBeCloseTo(56.549, 3);
    });
  });

  describe('volumeHyperboloid', () => {
    test('calculates volume of hyperboloid', () => {
      expect(volumeHyperboloid(3, 4)).toBeCloseTo(75.398, 3);
    });
  });

  describe('volumeTorusSector', () => {
    test('calculates volume of torus sector', () => {
      expect(volumeTorusSector(5, 1, Math.PI)).toBeCloseTo(15.708, 3);
    });
  });

  describe('volumeWedge', () => {
    test('calculates volume of wedge', () => {
      expect(volumeWedge(6, 4, 3)).toBe(12);
    });
  });

  describe('volumeRegularTetrahedron', () => {
    test('calculates volume of regular tetrahedron', () => {
      expect(volumeRegularTetrahedron(1)).toBeCloseTo(0.11785, 5);
    });
  });

  describe('volumeRectangularBox', () => {
    test('calculates volume of rectangular box', () => {
      expect(volumeRectangularBox(2, 3, 4)).toBe(24);
    });
  });

  describe('volumeConeFrustum', () => {
    test('calculates volume of cone frustum', () => {
      expect(volumeConeFrustum(3, 2, 4)).toBeCloseTo(79.587, 3);
    });
  });

  describe('volumeCylindricalShell', () => {
    test('calculates volume of cylindrical shell', () => {
      expect(volumeCylindricalShell(2, 3, 5)).toBeCloseTo(78.54, 2);
    });
  });

  describe('volumeHollowSphere', () => {
    test('calculates volume of hollow sphere', () => {
      expect(volumeHollowSphere(2, 3)).toBeCloseTo(79.587, 3);
    });
  });

  describe('volumeHollowCylinder', () => {
    test('calculates volume of hollow cylinder', () => {
      expect(volumeHollowCylinder(2, 3, 5)).toBeCloseTo(78.54, 2);
    });
  });

  describe('volumePentagonalPrism', () => {
    test('calculates volume of pentagonal prism', () => {
      expect(volumePentagonalPrism(10, 5)).toBe(50);
    });
  });

  describe('volumeHexagonalPrism', () => {
    test('calculates volume of hexagonal prism', () => {
      expect(volumeHexagonalPrism(10, 5)).toBe(50);
    });
  });

  describe('volumeOctagonalPrism', () => {
    test('calculates volume of octagonal prism', () => {
      expect(volumeOctagonalPrism(10, 5)).toBe(50);
    });
  });
});
