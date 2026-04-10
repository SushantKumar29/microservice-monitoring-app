import { config } from 'dotenv';
config({ path: '.env.test', quiet: true });

process.env.NODE_ENV = 'test';

jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
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

jest.mock('../src/config/redis', () => ({
  connectRedis: jest.fn().mockResolvedValue(true),
  disconnectRedis: jest.fn().mockResolvedValue(true),
  getCounter: jest.fn(),
  getQueueLength: jest.fn(),
}));
