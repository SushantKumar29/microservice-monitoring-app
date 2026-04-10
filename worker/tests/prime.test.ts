import { calculatePrimes } from '../src/services/primeCalculator';

describe('Prime Calculator', () => {
  describe('calculatePrimes', () => {
    test('calculates primes correctly up to 10', () => {
      const result = calculatePrimes(10);
      expect(result.count).toBe(4);
      expect(result.largestPrime).toBe(7);
      expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
    });

    test('calculates primes up to 100', () => {
      const result = calculatePrimes(100);
      expect(result.count).toBe(25);
      expect(result.largestPrime).toBe(97);
    });

    test('handles limit of 1 (no primes)', () => {
      const result = calculatePrimes(1);
      expect(result.count).toBe(0);
      expect(result.largestPrime).toBe(0);
    });

    test('handles limit of 2', () => {
      const result = calculatePrimes(2);
      expect(result.count).toBe(1);
      expect(result.largestPrime).toBe(2);
    });

    test('returns execution time', () => {
      const result = calculatePrimes(10000);
      expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
    });
  });
});
