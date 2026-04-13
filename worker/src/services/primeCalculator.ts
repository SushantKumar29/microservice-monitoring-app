import { PRIME_LIMIT } from '@microservices/shared';
import { PrimeResult } from '../types';

const isPrimeNumber = (num: number): boolean => {
  if (num < 2) return false;

  for (let i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }
  return true;
};

export const calculatePrimes = (limit: number = PRIME_LIMIT): PrimeResult => {
  const startTime = Date.now();

  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrimeNumber(i)) {
      primes.push(i);
    }
  }

  return {
    count: primes.length,
    largestPrime: primes[primes.length - 1] || 0,
    executionTimeMs: Date.now() - startTime,
  };
};
