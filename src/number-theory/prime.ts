import { isPrime as isPrimeBasic } from '../core/basic';
import { modularExponentiation, legendreSymbol } from './modular';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sieveOfEratosthenes(limit: number): boolean[] {
  if (limit < 2) return [];
  
  const isPrimeArr = new Array(limit + 1).fill(true);
  isPrimeArr[0] = isPrimeArr[1] = false;
  
  for (let i = 2; i * i <= limit; i++) {
    if (isPrimeArr[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrimeArr[j] = false;
      }
    }
  }
  
  return isPrimeArr;
}

export function sieveOfAtkin(limit: number): boolean[] {
  if (limit < 2) return [];
  
  const isPrimeArr = new Array(limit + 1).fill(false);
  const sqrtLimit = Math.sqrt(limit);
  const n = limit;
  
  for (let x = 1; x <= sqrtLimit; x++) {
    for (let y = 1; y <= sqrtLimit; y++) {
      let n1 = 4 * x * x + y * y;
      if (n1 <= n && (n1 % 12 === 1 || n1 % 12 === 5)) {
        isPrimeArr[n1] = !isPrimeArr[n1];
      }
      
      n1 = 3 * x * x + y * y;
      if (n1 <= n && n1 % 12 === 7) {
        isPrimeArr[n1] = !isPrimeArr[n1];
      }
      
      n1 = 3 * x * x - y * y;
      if (x > y && n1 <= n && n1 % 12 === 11) {
        isPrimeArr[n1] = !isPrimeArr[n1];
      }
    }
  }
  
  for (let i = 5; i <= sqrtLimit; i++) {
    if (isPrimeArr[i]) {
      for (let j = i * i; j <= n; j += i * i) {
        isPrimeArr[j] = false;
      }
    }
  }
  
  isPrimeArr[2] = isPrimeArr[3] = true;
  return isPrimeArr;
}

export function primeList(limit: number): number[] {
  if (limit < 2) return [];
  const isPrimeArr = sieveOfEratosthenes(limit);
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrimeArr[i]) primes.push(i);
  }
  return primes;
}

export function primeCount(limit: number): number {
  if (limit < 2) return 0;
  const isPrimeArr = sieveOfEratosthenes(limit);
  let count = 0;
  for (let i = 2; i <= limit; i++) {
    if (isPrimeArr[i]) count++;
  }
  return count;
}

export function nthPrime(n: number): number | null {
  if (n < 1) return null;
  
  let limit = n < 6 ? 15 : n * (Math.log(n) + Math.log(Math.log(n)));
  limit = Math.ceil(limit);
  
  const primes = primeList(limit);
  return primes[n - 1] || null;
}

export function twinPrimes(limit: number): [number, number][] {
  if (limit < 3) return [];
  
  const isPrimeArr = sieveOfEratosthenes(limit);
  const twins: [number, number][] = [];
  
  for (let i = 3; i + 2 <= limit; i++) {
    if (isPrimeArr[i] && isPrimeArr[i + 2]) {
      twins.push([i, i + 2]);
    }
  }
  
  return twins;
}

export function cousinPrimes(limit: number): [number, number][] {
  if (limit < 3) return [];
  
  const isPrimeArr = sieveOfEratosthenes(limit);
  const cousins: [number, number][] = [];
  
  for (let i = 3; i + 4 <= limit; i++) {
    if (isPrimeArr[i] && isPrimeArr[i + 4]) {
      cousins.push([i, i + 4]);
    }
  }
  
  return cousins;
}

export function sexyPrimes(limit: number): [number, number][] {
  if (limit < 3) return [];
  
  const isPrimeArr = sieveOfEratosthenes(limit);
  const sexies: [number, number][] = [];
  
  for (let i = 3; i + 6 <= limit; i++) {
    if (isPrimeArr[i] && isPrimeArr[i + 6]) {
      sexies.push([i, i + 6]);
    }
  }
  
  return sexies;
}

export function primeGaps(limit: number): number[] {
  if (limit < 3) return [];
  
  const isPrimeArr = sieveOfEratosthenes(limit);
  let lastPrime = 2;
  const gaps: number[] = [];
  
  for (let i = 3; i <= limit; i++) {
    if (isPrimeArr[i]) {
      gaps.push(i - lastPrime);
      lastPrime = i;
    }
  }
  
  return gaps;
}

export function segmentedSieve(low: number, high: number): boolean[] {
  if (high < low) return [];
  
  const size = high - low + 1;
  const isPrimeSegment = new Array(size).fill(true);
  
  const basePrimes = primeList(Math.floor(Math.sqrt(high)));
  
  for (const p of basePrimes) {
    const start = Math.max(p * p, Math.ceil(low / p) * p);
    for (let j = start; j <= high; j += p) {
      isPrimeSegment[j - low] = false;
    }
  }
  
  if (low === 0) isPrimeSegment[0] = false;
  if (low === 1) isPrimeSegment[0] = false;
  if (low <= 2 && high >= 2) isPrimeSegment[2 - low] = true;
  
  return isPrimeSegment;
}

export function isPrimeMillerRabin(n: number, iterations: number = 10): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0) return false;
  
  let s = n - 1;
  let r = 0;
  while (s % 2 === 0) {
    s /= 2;
    r++;
  }
  
  const witnesses = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
  const witnessesToUse = witnesses.slice(0, Math.min(iterations, witnesses.length));
  
  for (const a of witnessesToUse) {
    if (a >= n) break;
    
    let x = modularExponentiation(a, s, n);
    if (x === 1 || x === n - 1) continue;
    
    let continueLoop = false;
    for (let i = 1; i < r; i++) {
      x = (x * x) % n;
      if (x === n - 1) {
        continueLoop = true;
        break;
      }
    }
    
    if (continueLoop) continue;
    return false;
  }
  
  return true;
}

export function isPrimeFermat(n: number, iterations: number = 10): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0) return false;
  
  for (let i = 0; i < iterations; i++) {
    const a = randomInt(2, n - 2);
    if (modularExponentiation(a, n - 1, n) !== 1) {
      return false;
    }
  }
  
  return true;
}

export function isPrimeSolovayStrassen(n: number, iterations: number = 10): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0) return false;
  
  for (let i = 0; i < iterations; i++) {
    const a = randomInt(2, n - 2);
    const x = legendreSymbol(a, n);
    
    if (x === 0) return false;
    
    const y = modularExponentiation(a, (n - 1) / 2, n);
    if (y !== x && y !== n - x) {
      return false;
    }
  }
  
  return true;
}

export function nextPrime(n: number): number {
  let candidate = n;
  if (candidate < 2) return 2;
  candidate++;
  if (candidate % 2 === 0 && candidate !== 2) candidate++;
  
  while (!isPrimeBasic(candidate)) {
    candidate += 2;
  }
  
  return candidate;
}

export function previousPrime(n: number): number | null {
  if (n <= 2) return null;
  
  let candidate = n - 1;
  if (candidate === 2) return 2;
  if (candidate % 2 === 0) candidate--;
  
  while (candidate >= 2) {
    if (isPrimeBasic(candidate)) return candidate;
    candidate -= 2;
    if (candidate === 2 && isPrimeBasic(2)) return 2;
  }
  
  return null;
}

export function isSafePrime(n: number): boolean {
  if (n < 5 || n % 2 === 0) return false;
  if (!isPrimeBasic(n)) return false;
  
  const p = (n - 1) / 2;
  return isPrimeBasic(p);
}

export function isSophieGermainPrime(n: number): boolean {
  if (n < 2) return false;
  if (!isPrimeBasic(n)) return false;
  return isPrimeBasic(2 * n + 1);
}

export function primeTwinsCount(limit: number): number {
  return twinPrimes(limit).length;
}

export function goldbachConjecture(n: number): [number, number][] | null {
  if (n < 4 || n % 2 !== 0) return null;
  
  const pairs: [number, number][] = [];
  
  for (let i = 2; i <= n / 2; i++) {
    if (isPrimeBasic(i) && isPrimeBasic(n - i)) {
      pairs.push([i, n - i]);
    }
  }
  
  return pairs.length > 0 ? pairs : null;
}

export function goldbachWeakConjecture(n: number): [number, number, number][] | null {
  if (n < 5) return null;
  
  for (let i = 2; i <= n; i++) {
    for (let j = i; j <= n; j++) {
      if (isPrimeBasic(i) && isPrimeBasic(j) && isPrimeBasic(n - i - j)) {
        return [[i, j, n - i - j]];
      }
    }
  }
  
  return null;
}
