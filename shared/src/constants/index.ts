import dotenv from 'dotenv';

dotenv.config();

// Environment variables with defaults
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT || 6379;
export const REDIS_URL = process.env.REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}`;

// Queue configuration
export const QUEUE_NAME = 'job_queue';
export const PRIME_LIMIT = 2000000;
export const WORKER_ID = `worker-${Math.random().toString(36).substring(7)}`;
export const WORKER_REPLICAS = '1';

// Job types and statuses
export const JOB_TYPES = {
  prime: 'prime',
  hashing: 'hashing',
  sort: 'sort',
} as const;

export const JOB_STATUS = {
  pending: 'pending',
  processing: 'processing',
  completed: 'completed',
  failed: 'failed',
} as const;

export type JobType = keyof typeof JOB_TYPES;
export type JobStatus = keyof typeof JOB_STATUS;
