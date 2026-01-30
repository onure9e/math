import { DomainError } from '../types';
import { EPSILON } from '../constants';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

export function clampNeg1To1(value: number): number {
  return clamp(value, -1, 1);
}

export function wrap(value: number, min: number, max: number): number {
  const range = max - min;
  if (Math.abs(range) < EPSILON) {
    throw new DomainError(`Invalid range: min (${min}) equals max (${max})`);
  }
  return ((value - min) % range + range) % range + min;
}

export function wrap01(value: number): number {
  return wrap(value, 0, 1);
}

export function mirror(value: number, min: number, max: number): number {
  const range = max - min;
  if (Math.abs(range) < EPSILON) {
    throw new DomainError(`Invalid range: min (${min}) equals max (${max})`);
  }
  const doubled = (value - min) % (range * 2);
  if (doubled < 0) return max - (-doubled % range);
  return doubled > range ? max - (doubled - range) : min + doubled;
}

export function mirror01(value: number): number {
  return mirror(value, 0, 1);
}

export function pingPong(value: number, min: number, max: number): number {
  const range = max - min;
  if (Math.abs(range) < EPSILON) {
    throw new DomainError(`Invalid range: min (${min}) equals max (${max})`);
  }
  const doubled = (value - min) % (range * 2);
  if (doubled < 0) return min;
  return doubled > range ? max - (doubled - range) : min + doubled;
}

export function pingPong01(value: number): number {
  return pingPong(value, 0, 1);
}
