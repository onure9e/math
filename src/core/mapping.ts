import { wrap, clamp } from './clamping';

export function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const range = inMax - inMin;
  if (Math.abs(range) < 1e-15) {
    throw new Error(`Invalid input range: inMin (${inMin}) equals inMax (${inMax})`);
  }
  return ((value - inMin) * (outMax - outMin)) / range + outMin;
}

export function map01(value: number, min: number, max: number): number {
  return map(value, min, max, 0, 1);
}

export function mapFrom01(value: number, min: number, max: number): number {
  return map(value, 0, 1, min, max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function lerpAngle(start: number, end: number, t: number, useRadians: boolean = true): number {
  const delta = end - start;
  const wrapped = wrap(delta, useRadians ? -Math.PI : -180, useRadians ? Math.PI : 180);
  return start + wrapped * t;
}

export function inverseLerp(start: number, end: number, value: number): number {
  const range = end - start;
  if (Math.abs(range) < 1e-15) {
    throw new Error(`Invalid range: start (${start}) equals end (${end})`);
  }
  return (value - start) / range;
}

export function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function smootherStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function smoothDamp(
  current: number,
  target: number,
  currentVelocity: { value: number },
  smoothTime: number,
  maxSpeed: number = Infinity,
  deltaTime: number = 1 / 60
): number {
  const omega = 2 / smoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  
  let change = current - target;
  const originalTo = target;
  
  const maxChange = maxSpeed * smoothTime;
  change = clamp(change, -maxChange, maxChange);
  target = current - change;
  
  const temp = (currentVelocity.value + omega * change) * deltaTime;
  currentVelocity.value = (currentVelocity.value - omega * temp) * exp;
  const output = target + (change + temp) * exp;
  
  if (originalTo - current > 0 === output > originalTo) {
    currentVelocity.value = 0;
    return originalTo;
  }
  
  return output;
}
