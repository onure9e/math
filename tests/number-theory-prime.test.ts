import {
  isPrimeMillerRabin,
  sieveOfEratosthenes,
  primeList,
  nthPrime,
  nextPrime,
  previousPrime,
  goldbachConjecture
} from '../src/number-theory/prime';

describe('Number Theory - Prime Module', () => {
  describe('isPrimeMillerRabin', () => {
    test('correctly identifies small primes', () => {
      expect(isPrimeMillerRabin(2)).toBe(true);
      expect(isPrimeMillerRabin(3)).toBe(true);
      expect(isPrimeMillerRabin(5)).toBe(true);
      expect(isPrimeMillerRabin(7)).toBe(true);
    });
    
    test('correctly identifies small composites', () => {
      expect(isPrimeMillerRabin(1)).toBe(false);
      expect(isPrimeMillerRabin(4)).toBe(false);
      expect(isPrimeMillerRabin(6)).toBe(false);
      expect(isPrimeMillerRabin(9)).toBe(false);
    });
    
    test('correctly identifies large primes', () => {
      expect(isPrimeMillerRabin(97)).toBe(true);
      expect(isPrimeMillerRabin(101)).toBe(true);
      expect(isPrimeMillerRabin(1009)).toBe(true);
    });
    
    test('correctly identifies large composites', () => {
      expect(isPrimeMillerRabin(100)).toBe(false);
      expect(isPrimeMillerRabin(1000)).toBe(false);
    });
    
    test('handles even numbers', () => {
      expect(isPrimeMillerRabin(2)).toBe(true);
      expect(isPrimeMillerRabin(4)).toBe(false);
      expect(isPrimeMillerRabin(100)).toBe(false);
    });
  });
  
  describe('sieveOfEratosthenes', () => {
    test('returns correct sieve for small limits', () => {
      const sieve = sieveOfEratosthenes(10);
      expect(sieve[2]).toBe(true);
      expect(sieve[3]).toBe(true);
      expect(sieve[4]).toBe(false);
      expect(sieve[5]).toBe(true);
      expect(sieve[9]).toBe(false);
    });
    
    test('returns empty array for limit < 2', () => {
      expect(sieveOfEratosthenes(1)).toEqual([]);
      expect(sieveOfEratosthenes(0)).toEqual([]);
    });
  });
  
  describe('primeList', () => {
    test('returns list of primes up to limit', () => {
      expect(primeList(10)).toEqual([2, 3, 5, 7]);
      expect(primeList(20)).toEqual([2, 3, 5, 7, 11, 13, 17, 19]);
    });
    
    test('returns empty array for limit < 2', () => {
      expect(primeList(1)).toEqual([]);
    });
  });
  
  describe('nthPrime', () => {
    test('returns correct nth prime', () => {
      expect(nthPrime(1)).toBe(2);
      expect(nthPrime(2)).toBe(3);
      expect(nthPrime(5)).toBe(11);
      expect(nthPrime(10)).toBe(29);
    });
    
    test('returns null for n < 1', () => {
      expect(nthPrime(0)).toBe(null);
      expect(nthPrime(-1)).toBe(null);
    });
  });
  
  describe('nextPrime', () => {
    test('returns next prime after number', () => {
      expect(nextPrime(1)).toBe(2);
      expect(nextPrime(2)).toBe(3);
      expect(nextPrime(10)).toBe(11);
      expect(nextPrime(14)).toBe(17);
    });
  });
  
  describe('previousPrime', () => {
    test('returns previous prime before number', () => {
      expect(previousPrime(3)).toBe(2);
      expect(previousPrime(10)).toBe(7);
      expect(previousPrime(15)).toBe(13);
    });
    
    test('returns null for n <= 2', () => {
      expect(previousPrime(2)).toBe(null);
      expect(previousPrime(1)).toBe(null);
    });
  });
  
  describe('goldbachConjecture', () => {
    test('finds Goldbach pairs for even numbers', () => {
      const pairs4 = goldbachConjecture(4);
      expect(pairs4).toContainEqual([2, 2]);
      
      const pairs10 = goldbachConjecture(10);
      expect(pairs10?.length).toBeGreaterThan(0);
    });
    
    test('returns null for odd numbers', () => {
      expect(goldbachConjecture(5)).toBe(null);
      expect(goldbachConjecture(7)).toBe(null);
    });
    
    test('returns null for numbers < 4', () => {
      expect(goldbachConjecture(2)).toBe(null);
    });
  });
});
