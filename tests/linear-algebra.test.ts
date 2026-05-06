import { Vector, Matrix } from '../src/linear-algebra';

describe('Linear Algebra Module', () => {
  describe('Vector', () => {
    test('creates vector from array', () => {
      const v = new Vector([1, 2, 3]);
      expect(v.dimension).toBe(3);
      expect(v.get(0)).toBe(1);
      expect(v.get(2)).toBe(3);
    });

    test('creates copy of vector', () => {
      const v1 = new Vector([1, 2, 3]);
      const v2 = new Vector(v1);
      expect(v2.toArray()).toEqual([1, 2, 3]);
    });

    test('adds two vectors', () => {
      const v1 = new Vector([1, 2, 3]);
      const v2 = new Vector([4, 5, 6]);
      const result = v1.add(v2);
      expect(result.toArray()).toEqual([5, 7, 9]);
    });

    test('subtracts two vectors', () => {
      const v1 = new Vector([4, 5, 6]);
      const v2 = new Vector([1, 2, 3]);
      const result = v1.subtract(v2);
      expect(result.toArray()).toEqual([3, 3, 3]);
    });

    test('multiplies vector by scalar', () => {
      const v = new Vector([1, 2, 3]);
      const result = v.multiply(2);
      expect(result.toArray()).toEqual([2, 4, 6]);
    });

    test('computes dot product', () => {
      const v1 = new Vector([1, 2, 3]);
      const v2 = new Vector([4, 5, 6]);
      expect(v1.dot(v2)).toBe(32); // 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
    });

    test('computes magnitude', () => {
      const v = new Vector([3, 4]);
      expect(v.magnitude()).toBe(5);
    });

    test('normalizes vector', () => {
      const v = new Vector([3, 4]);
      const normalized = v.normalize();
      expect(normalized.magnitude()).toBeCloseTo(1);
      expect(normalized.toArray()).toEqual([0.6, 0.8]);
    });

    test('converts to array', () => {
      const v = new Vector([1, 2, 3]);
      expect(v.toArray()).toEqual([1, 2, 3]);
    });

    test('computes cross product', () => {
      const v1 = new Vector([1, 0, 0]);
      const v2 = new Vector([0, 1, 0]);
      const result = v1.cross(v2);
      expect(result.toArray()).toEqual([0, 0, 1]);
    });

    test('computes angle between vectors', () => {
      const v1 = new Vector([1, 0, 0]);
      const v2 = new Vector([0, 1, 0]);
      expect(v1.angle(v2)).toBeCloseTo(Math.PI / 2);
    });

    test('checks orthogonality', () => {
      const v1 = new Vector([1, 0]);
      const v2 = new Vector([0, 1]);
      expect(v1.isOrthogonal(v2)).toBe(true);
    });

    test('checks parallelism', () => {
      const v1 = new Vector([1, 2]);
      const v2 = new Vector([2, 4]);
      expect(v1.isParallel(v2)).toBe(true);
    });

    test('computes projection', () => {
      const v1 = new Vector([3, 4]);
      const v2 = new Vector([1, 0]);
      const proj = v1.projectionOnto(v2);
      expect(proj.toArray()).toEqual([3, 0]);
    });

    test('creates zero vector', () => {
      const v = Vector.zero(3);
      expect(v.toArray()).toEqual([0, 0, 0]);
    });

    test('creates basis vector', () => {
      const v = Vector.basis(3, 1);
      expect(v.toArray()).toEqual([0, 1, 0]);
    });

    test('throws error for empty vector', () => {
      expect(() => new Vector([])).toThrow();
    });

    test('throws error for dimension mismatch', () => {
      const v1 = new Vector([1, 2]);
      const v2 = new Vector([1, 2, 3]);
      expect(() => v1.add(v2)).toThrow();
    });

    test('throws error for zero vector normalization', () => {
      const v = new Vector([0, 0, 0]);
      expect(() => v.normalize()).toThrow();
    });
  });

  describe('Matrix', () => {
    test('creates matrix from 2D array', () => {
      const m = new Matrix([[1, 2], [3, 4]]);
      expect(m.rows).toBe(2);
      expect(m.cols).toBe(2);
      expect(m.get(0, 0)).toBe(1);
      expect(m.get(1, 1)).toBe(4);
    });

    test('creates copy of matrix', () => {
      const m1 = new Matrix([[1, 2], [3, 4]]);
      const m2 = new Matrix(m1);
      expect(m2.toArray()).toEqual([[1, 2], [3, 4]]);
    });

    test('adds two matrices', () => {
      const m1 = new Matrix([[1, 2], [3, 4]]);
      const m2 = new Matrix([[5, 6], [7, 8]]);
      const result = m1.add(m2);
      expect(result.toArray()).toEqual([[6, 8], [10, 12]]);
    });

    test('subtracts two matrices', () => {
      const m1 = new Matrix([[5, 6], [7, 8]]);
      const m2 = new Matrix([[1, 2], [3, 4]]);
      const result = m1.subtract(m2);
      expect(result.toArray()).toEqual([[4, 4], [4, 4]]);
    });

    test('multiplies matrix by scalar', () => {
      const m = new Matrix([[1, 2], [3, 4]]);
      const result = m.multiply(2);
      expect(result.toArray()).toEqual([[2, 4], [6, 8]]);
    });

    test('multiplies two matrices', () => {
      const m1 = new Matrix([[1, 2], [3, 4]]);
      const m2 = new Matrix([[5, 6], [7, 8]]);
      const result = m1.multiply(m2);
      expect(result.toArray()).toEqual([[19, 22], [43, 50]]);
    });

    test('computes transpose', () => {
      const m = new Matrix([[1, 2, 3], [4, 5, 6]]);
      const result = m.transpose();
      expect(result.toArray()).toEqual([[1, 4], [2, 5], [3, 6]]);
    });

    test('computes determinant of 2x2', () => {
      const m = new Matrix([[1, 2], [3, 4]]);
      expect(m.determinant()).toBe(-2); // 1*4 - 2*3 = 4 - 6 = -2
    });

    test('computes determinant of 3x3', () => {
      const m = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      expect(m.determinant()).toBe(0); // Singular matrix
    });

    test('computes inverse', () => {
      const m = new Matrix([[1, 2], [3, 4]]);
      const inv = m.inverse();
      expect(inv).not.toBeNull();
      if (inv) {
        expect(inv.multiply(m).get(0, 0)).toBeCloseTo(1);
        expect(inv.multiply(m).get(0, 1)).toBeCloseTo(0);
        expect(inv.multiply(m).get(1, 0)).toBeCloseTo(0);
        expect(inv.multiply(m).get(1, 1)).toBeCloseTo(1);
      }
    });

    test('returns null for non-invertible matrix', () => {
      const m = new Matrix([[1, 2], [2, 4]]); // Singular
      expect(m.inverse()).toBeNull();
    });

    test('computes trace', () => {
      const m = new Matrix([[1, 2], [3, 4]]);
      expect(m.trace()).toBe(5); // 1 + 4
    });

    test('checks if square', () => {
      expect(new Matrix([[1, 2], [3, 4]]).isSquare()).toBe(true);
      expect(new Matrix([[1, 2, 3], [4, 5, 6]]).isSquare()).toBe(false);
    });

    test('checks if symmetric', () => {
      expect(new Matrix([[1, 2], [2, 3]]).isSymmetric()).toBe(true);
      expect(new Matrix([[1, 2], [3, 4]]).isSymmetric()).toBe(false);
    });

    test('checks if diagonal', () => {
      expect(new Matrix([[1, 0], [0, 2]]).isDiagonal()).toBe(true);
      expect(new Matrix([[1, 2], [0, 2]]).isDiagonal()).toBe(false);
    });

    test('multiplies matrix by vector', () => {
      const m = new Matrix([[1, 2], [3, 4]]);
      const v = new Vector([5, 6]);
      const result = m.multiplyVector(v);
      expect(result.toArray()).toEqual([17, 39]); // [1*5+2*6, 3*5+4*6]
    });

    test('creates identity matrix', () => {
      const m = Matrix.identity(3);
      expect(m.toArray()).toEqual([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    });

    test('creates zero matrix', () => {
      const m = Matrix.zero(2, 3);
      expect(m.toArray()).toEqual([[0, 0, 0], [0, 0, 0]]);
    });

    test('gets row vector', () => {
      const m = new Matrix([[1, 2, 3], [4, 5, 6]]);
      const row = m.rowVector(0);
      expect(row.toArray()).toEqual([1, 2, 3]);
    });

    test('gets column vector', () => {
      const m = new Matrix([[1, 2, 3], [4, 5, 6]]);
      const col = m.columnVector(1);
      expect(col.toArray()).toEqual([2, 5]);
    });

    test('throws error for non-square determinant', () => {
      const m = new Matrix([[1, 2, 3], [4, 5, 6]]);
      expect(() => m.determinant()).toThrow();
    });

    test('throws error for shape mismatch in addition', () => {
      const m1 = new Matrix([[1, 2], [3, 4]]);
      const m2 = new Matrix([[1, 2, 3], [4, 5, 6]]);
      expect(() => m1.add(m2)).toThrow();
    });
  });
});
