import { config } from 'dotenv';
config({ path: '.env.test', quiet: true });

process.env.NODE_ENV = 'test';

jest.mock('@microservices/shared', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  })),
  redisClient: {},
  connectRedis: jest.fn().mockResolvedValue(true),
  disconnectRedis: jest.fn().mockResolvedValue(true),
  popFromQueue: jest.fn(),
  getQueueLength: jest.fn(),
  storeJobResult: jest.fn().mockResolvedValue(true),
  incrementCounter: jest.fn().mockResolvedValue(1),
  QUEUE_NAME: 'job_queue',
  JOB_STATUS: {
    pending: 'pending',
    processing: 'processing',
    completed: 'completed',
    failed: 'failed',
  },
  METRIC_CONFIGS: {
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

jest.mock('../src/utils/metrics', () => ({
  register: {
    contentType: 'text/plain',
    metrics: jest.fn().mockResolvedValue('# HELP test metric'),
  },
  totalJobsCompleted: { inc: jest.fn() },
  totalJobErrors: { inc: jest.fn() },
  jobProcessingDuration: { observe: jest.fn() },
  activeJobs: { inc: jest.fn(), dec: jest.fn() },
  queueLength: { set: jest.fn() },
}));
