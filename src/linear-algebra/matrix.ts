import { Matrix as MatrixInterface, DomainError, RangeError } from '../types';
import { Vector } from './vector';
import { EPSILON, TOLERANCE } from '../constants';

export class Matrix implements MatrixInterface {
  private data: number[][];

  constructor(values: number[][] | Matrix) {
    if (values instanceof Matrix) {
      this.data = values.data.map(row => [...row]);
    } else {
      if (values.length === 0) throw new DomainError('Matrix cannot have zero rows');
      const firstRow = values[0];
      if (!firstRow) throw new DomainError('Matrix cannot have zero rows');
      const cols = firstRow.length;
      if (cols === 0) throw new DomainError('Matrix cannot have zero columns');
      for (const row of values) {
        if (row.length !== cols) throw new DomainError('All rows must have the same number of columns');
      }
      this.data = values.map(row => [...row]);
    }
  }

  get rows(): number {
    return this.data.length;
  }

  get cols(): number {
    const firstRow = this.data[0];
    if (!firstRow) throw new RangeError('Matrix has no columns');
    return firstRow.length;
  }

  get(row: number, col: number): number {
    this.validateRowIndex(row);
    this.validateColIndex(col);
    const val = this.data[row]?.[col];
    if (val === undefined) throw new RangeError(`Invalid matrix access at [${row}][${col}]`);
    return val;
  }

  set(row: number, col: number, value: number): void {
    this.validateRowIndex(row);
    this.validateColIndex(col);
    const rowData = this.data[row];
    if (rowData === undefined) throw new RangeError(`Invalid row: ${row}`);
    rowData[col] = value;
  }

  private validateRowIndex(row: number): void {
    if (!Number.isInteger(row) || row < 0 || row >= this.rows) {
      throw new RangeError(`Row index ${row} out of bounds for ${this.rows} rows`);
    }
  }

  private validateColIndex(col: number): void {
    if (!Number.isInteger(col) || col < 0 || col >= this.cols) {
      throw new RangeError(`Column index ${col} out of bounds for ${this.cols} columns`);
    }
  }

  private validateSameShape(other: Matrix): void {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new RangeError(`Matrix shape mismatch: ${this.rows}x${this.cols} vs ${other.rows}x${other.cols}`);
    }
  }

  add(other: Matrix): Matrix {
    this.validateSameShape(other);
    const rows = this.rows;
    const cols = this.cols;
    const result: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      const thisRow = this.data[i];
      const otherRow = other.data[i];
      if (thisRow === undefined || otherRow === undefined) {
        throw new RangeError(`Row ${i} is undefined`);
      }
      for (let j = 0; j < cols; j++) {
        const a = thisRow[j];
        const b = otherRow[j];
        if (a === undefined || b === undefined) {
          throw new RangeError(`Column ${j} is undefined`);
        }
        row.push(a + b);
      }
      result.push(row);
    }
    return new Matrix(result);
  }

  subtract(other: Matrix): Matrix {
    this.validateSameShape(other);
    const rows = this.rows;
    const cols = this.cols;
    const result: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      const thisRow = this.data[i];
      const otherRow = other.data[i];
      if (thisRow === undefined || otherRow === undefined) {
        throw new RangeError(`Row ${i} is undefined`);
      }
      for (let j = 0; j < cols; j++) {
        const a = thisRow[j];
        const b = otherRow[j];
        if (a === undefined || b === undefined) {
          throw new RangeError(`Column ${j} is undefined`);
        }
        row.push(a - b);
      }
      result.push(row);
    }
    return new Matrix(result);
  }

  multiply(other: Matrix | number): Matrix {
    if (typeof other === 'number') {
      return new Matrix(this.data.map(row => row.map(v => v * other)));
    }
    if (this.cols !== other.rows) {
      throw new RangeError(`Matrix multiplication mismatch: ${this.rows}x${this.cols} * ${other.rows}x${other.cols}`);
    }
    const result: number[][] = [];
    for (let i = 0; i < this.rows; i++) {
      const row: number[] = [];
      const thisRow = this.data[i];
      if (thisRow === undefined) throw new RangeError(`Row ${i} is undefined`);
      for (let j = 0; j < other.cols; j++) {
        let sum = 0;
        for (let k = 0; k < this.cols; k++) {
          const a = thisRow[k];
          const otherRow = other.data[k];
          if (a === undefined || otherRow === undefined) {
            throw new RangeError(`Invalid matrix access`);
          }
          const b = otherRow[j];
          if (b === undefined) throw new RangeError(`Column ${j} is undefined`);
          sum += a * b;
        }
        row.push(sum);
      }
      result.push(row);
    }
    return new Matrix(result);
  }

  transpose(): Matrix {
    const result: number[][] = [];
    for (let j = 0; j < this.cols; j++) {
      const col: number[] = [];
      for (let i = 0; i < this.rows; i++) {
        const val = this.data[i]?.[j];
        if (val === undefined) throw new RangeError(`Invalid matrix access at [${i}][${j}]`);
        col.push(val);
      }
      result.push(col);
    }
    return new Matrix(result);
  }

  determinant(): number {
    if (this.rows !== this.cols) {
      throw new DomainError('Determinant only defined for square matrices');
    }
    const n = this.rows;
    if (n === 1) {
      const val = this.data[0]?.[0];
      if (val === undefined) throw new RangeError('Invalid matrix data');
      return val;
    }
    if (n === 2) {
      const a = this.data[0]?.[0];
      const b = this.data[0]?.[1];
      const c = this.data[1]?.[0];
      const d = this.data[1]?.[1];
      if ([a, b, c, d].some(v => v === undefined)) throw new RangeError('Invalid matrix data');
      return a! * d! - b! * c!;
    }

    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = this.minor(0, j);
      const cofactor = (j % 2 === 0 ? 1 : -1) * this.data[0]![j]! * minor.determinant();
      det += cofactor;
    }
    return det;
  }

  private minor(row: number, col: number): Matrix {
    const result: number[][] = [];
    for (let i = 0; i < this.rows; i++) {
      if (i === row) continue;
      const newRow: number[] = [];
      for (let j = 0; j < this.cols; j++) {
        if (j === col) continue;
        const val = this.data[i]?.[j];
        if (val === undefined) throw new RangeError('Invalid matrix data');
        newRow.push(val);
      }
      result.push(newRow);
    }
    return new Matrix(result);
  }

  inverse(): Matrix | null {
    if (this.rows !== this.cols) {
      throw new DomainError('Inverse only defined for square matrices');
    }
    const n = this.rows;
    const det = this.determinant();
    if (Math.abs(det) < EPSILON) return null;

    if (n === 1) {
      const val = this.data[0]?.[0];
      if (val === undefined) throw new RangeError('Invalid matrix data');
      return new Matrix([[1 / val]]);
    }

    const result: number[][] = [];
    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      for (let j = 0; j < n; j++) {
        const minor = this.minor(i, j);
        const cofactor = ((i + j) % 2 === 0 ? 1 : -1) * minor.determinant();
        row.push(cofactor / det);
      }
      result.push(row);
    }
    return new Matrix(result).transpose();
  }

  toArray(): number[][] {
    return this.data.map(row => [...row]);
  }

  scale(scalar: number): Matrix {
    return this.multiply(scalar);
  }

  trace(): number {
    if (this.rows !== this.cols) {
      throw new DomainError('Trace only defined for square matrices');
    }
    let sum = 0;
    for (let i = 0; i < this.rows; i++) {
      const val = this.data[i]?.[i];
      if (val === undefined) throw new RangeError(`Invalid diagonal access at ${i}`);
      sum += val;
    }
    return sum;
  }

  isSquare(): boolean {
    return this.rows === this.cols;
  }

  isSymmetric(): boolean {
    if (!this.isSquare()) return false;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < i; j++) {
        const a = this.data[i]?.[j];
        const b = this.data[j]?.[i];
        if (a === undefined || b === undefined) return false;
        if (Math.abs(a - b) > TOLERANCE) return false;
      }
    }
    return true;
  }

  isDiagonal(): boolean {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (i !== j) {
          const val = this.data[i]?.[j];
          if (val === undefined) return false;
          if (Math.abs(val) > TOLERANCE) return false;
        }
      }
    }
    return true;
  }

  multiplyVector(v: Vector): Vector {
    if (this.cols !== v.dimension) {
      throw new RangeError(`Matrix-vector multiplication mismatch: ${this.cols} columns vs ${v.dimension} vector dimension`);
    }
    const result: number[] = [];
    for (let i = 0; i < this.rows; i++) {
      let sum = 0;
      for (let j = 0; j < this.cols; j++) {
        const val = this.data[i]?.[j];
        if (val === undefined) throw new RangeError('Invalid matrix data');
        sum += val * v.get(j);
      }
      result.push(sum);
    }
    return new Vector(result);
  }

  rowVector(row: number): Vector {
    this.validateRowIndex(row);
    const rowData = this.data[row];
    if (rowData === undefined) throw new RangeError(`Invalid row: ${row}`);
    return new Vector([...rowData]);
  }

  columnVector(col: number): Vector {
    this.validateColIndex(col);
    const values: number[] = [];
    for (let i = 0; i < this.rows; i++) {
      const val = this.data[i]?.[col];
      if (val === undefined) throw new RangeError(`Invalid column access at [${i}][${col}]`);
      values.push(val);
    }
    return new Vector(values);
  }

  static identity(n: number): Matrix {
    if (n <= 0) throw new DomainError('Identity matrix size must be positive');
    const data: number[][] = [];
    for (let i = 0; i < n; i++) {
      const row: number[] = new Array(n).fill(0);
      row[i] = 1;
      data.push(row);
    }
    return new Matrix(data);
  }

  static zero(rows: number, cols: number): Matrix {
    if (rows <= 0 || cols <= 0) throw new DomainError('Matrix dimensions must be positive');
    const data: number[][] = [];
    for (let i = 0; i < rows; i++) {
      data.push(new Array(cols).fill(0));
    }
    return new Matrix(data);
  }

  static fromRows(rows: Vector[]): Matrix {
    if (rows.length === 0) throw new DomainError('Cannot create matrix from empty vector array');
    const data = rows.map(v => v.toArray());
    return new Matrix(data);
  }

  static fromColumns(cols: Vector[]): Matrix {
    if (cols.length === 0) throw new DomainError('Cannot create matrix from empty vector array');
    return Matrix.fromRows(cols).transpose();
  }
}
