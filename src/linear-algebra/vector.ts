import { Vector as VectorInterface, DomainError, RangeError } from '../types';
import { EPSILON } from '../constants';

export class Vector implements VectorInterface {
  private data: number[];

  constructor(values: number[] | Vector) {
    if (values instanceof Vector) {
      this.data = [...values.data];
    } else {
      if (values.length === 0) throw new DomainError('Vector cannot be empty');
      this.data = [...values];
    }
  }

  get dimension(): number {
    return this.data.length;
  }

  get(index: number): number {
    this.validateIndex(index);
    const value = this.data[index];
    if (value === undefined) throw new RangeError(`Invalid index: ${index}`);
    return value;
  }

  private validateIndex(index: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= this.dimension) {
      throw new RangeError(`Index ${index} out of bounds for dimension ${this.dimension}`);
    }
  }

  private validateSameDimension(other: Vector): void {
    if (this.dimension !== other.dimension) {
      throw new RangeError(`Vector dimension mismatch: ${this.dimension} vs ${other.dimension}`);
    }
  }

  add(other: Vector): Vector {
    this.validateSameDimension(other);
    return new Vector(this.data.map((v, i) => {
      const otherVal = other.data[i];
      if (otherVal === undefined) throw new RangeError(`Invalid index: ${i}`);
      return v + otherVal;
    }));
  }

  subtract(other: Vector): Vector {
    this.validateSameDimension(other);
    return new Vector(this.data.map((v, i) => {
      const otherVal = other.data[i];
      if (otherVal === undefined) throw new RangeError(`Invalid index: ${i}`);
      return v - otherVal;
    }));
  }

  multiply(scalar: number): Vector {
    return new Vector(this.data.map(v => v * scalar));
  }

  dot(other: Vector): number {
    this.validateSameDimension(other);
    return this.data.reduce((sum, v, i) => {
      const otherVal = other.data[i];
      if (otherVal === undefined) throw new RangeError(`Invalid index: ${i}`);
      return sum + v * otherVal;
    }, 0);
  }

  magnitude(): number {
    return Math.sqrt(this.data.reduce((sum, v) => sum + v * v, 0));
  }

  normalize(): Vector {
    const mag = this.magnitude();
    if (mag < EPSILON) throw new DomainError('Cannot normalize zero vector');
    return new Vector(this.data.map(v => v / mag));
  }

  toArray(): number[] {
    return [...this.data];
  }

  cross(other: Vector): Vector {
    if (this.dimension !== 3 || other.dimension !== 3) {
      throw new DomainError('Cross product is only defined for 3D vectors');
    }
    const a = this.data;
    const b = other.data;
    const a1 = a[0], a2 = a[1], a3 = a[2];
    const b1 = b[0], b2 = b[1], b3 = b[2];
    if ([a1, a2, a3, b1, b2, b3].some(v => v === undefined)) {
      throw new RangeError('Invalid vector data');
    }
    return new Vector([
      a2! * b3! - a3! * b2!,
      a3! * b1! - a1! * b3!,
      a1! * b2! - a2! * b1!,
    ]);
  }

  angle(other: Vector): number {
    this.validateSameDimension(other);
    const magProduct = this.magnitude() * other.magnitude();
    if (magProduct < EPSILON) throw new DomainError('Cannot compute angle with zero vector');
    const cosTheta = this.dot(other) / magProduct;
    return Math.acos(Math.max(-1, Math.min(1, cosTheta)));
  }

  isOrthogonal(other: Vector): boolean {
    return Math.abs(this.dot(other)) < EPSILON;
  }

  isParallel(other: Vector): boolean {
    if (this.dimension !== other.dimension) return false;
    if (this.dimension === 0) return true;
    const this0 = this.data[0];
    const other0 = other.data[0];
    if (this0 === undefined || other0 === undefined) return false;
    if (Math.abs(other0) < EPSILON) return false;
    const ratio = this0 / other0;
    return this.data.every((v, i) => {
      const otherVal = other.data[i];
      return otherVal !== undefined && Math.abs(v - ratio * otherVal) < EPSILON;
    });
  }

  projectionOnto(other: Vector): Vector {
    if (other.magnitude() < EPSILON) throw new DomainError('Cannot project onto zero vector');
    const scalar = this.dot(other) / other.dot(other);
    return other.multiply(scalar);
  }

  static zero(dimension: number): Vector {
    if (dimension <= 0) throw new DomainError('Dimension must be positive');
    return new Vector(new Array(dimension).fill(0));
  }

  static basis(dimension: number, index: number): Vector {
    if (dimension <= 0) throw new DomainError('Dimension must be positive');
    if (index < 0 || index >= dimension) throw new RangeError(`Basis index ${index} out of bounds`);
    const data = new Array(dimension).fill(0);
    data[index] = 1;
    return new Vector(data);
  }
}
