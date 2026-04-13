import { config } from 'dotenv';
config({ path: '.env.test', quiet: true });

process.env.NODE_ENV = 'test';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'fixed-uuid-123'),
}));

jest.mock('@microservices/shared', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  })),
  redisClient: {
    lPush: jest.fn().mockResolvedValue(1),
    setEx: jest.fn().mockResolvedValue('OK'),
    incr: jest.fn().mockResolvedValue(1),
    get: jest.fn(),
  },
  connectRedis: jest.fn().mockResolvedValue(true),
  QUEUE_NAME: 'job_queue',
  JOB_TYPES: {
    prime: 'prime',
  },
  JOB_STATUS: {
    pending: 'pending',
    processing: 'processing',
    completed: 'completed',
    failed: 'failed',
  },
  METRIC_CONFIGS: {
    totalJobsSubmitted: {
      name: 'total_jobs_submitted',
      help: 'Total number of jobs submitted',
    },
    totalJobsCompleted: {
      name: 'total_jobs_completed',
      help: 'Total number of jobs completed',
    },
    totalJobsFailed: {
      name: 'total_jobs_failed',
      help: 'Total number of jobs failed',
    },
  },
}));
