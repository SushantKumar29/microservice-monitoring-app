import { PRIME_LIMIT } from "../constants";
import { PrimeResult } from "../types";

// Helper: Check if a number is prime
const isPrimeNumber = (num: number): boolean => {
	if (num < 2) return false;

	for (let i = 2; i < num; i++) {
		if (num % i === 0) return false;
	}
	return true;
};

// Main function
export const calculatePrimes = (limit: number = PRIME_LIMIT): PrimeResult => {
	const startTime = Date.now();

	// Find all primes up to limit
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
