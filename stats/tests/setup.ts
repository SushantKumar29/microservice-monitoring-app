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
  getCounter: jest.fn(),
  getQueueLength: jest.fn(),
  QUEUE_NAME: 'job_queue',
  WORKER_REPLICAS: '1',
  METRIC_CONFIGS: {
    totalJobsSubmitted: { name: 'total_jobs_submitted' },
    totalJobsCompleted: { name: 'total_jobs_completed' },
    totalJobsFailed: { name: 'total_jobs_failed' },
  },
}));

jest.mock('../src/utils/metrics', () => ({
  register: {
    contentType: 'text/plain',
    metrics: jest.fn().mockResolvedValue('# HELP test metric\n# TYPE test counter\ntest 123'),
  },
  totalJobsSubmitted: { set: jest.fn() },
  totalJobsCompleted: { set: jest.fn() },
  totalJobsFailed: { set: jest.fn() },
  queueLength: { set: jest.fn() },
  pendingJobs: { set: jest.fn() },
}));
