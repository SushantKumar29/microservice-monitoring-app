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
    metrics: jest.fn().mockResolvedValue('# HELP test metric'),
  },
  totalJobsSubmitted: { inc: jest.fn() },
  totalJobsCompleted: { inc: jest.fn() },
  totalJobErrors: { inc: jest.fn() },
  jobProcessingDuration: { observe: jest.fn() },
  activeJobs: { inc: jest.fn(), dec: jest.fn() },
  queueLength: { set: jest.fn() },
}));

jest.mock('../src/config/redis', () => ({
  connectRedis: jest.fn().mockResolvedValue(true),
  disconnectRedis: jest.fn().mockResolvedValue(true),
  popFromQueue: jest.fn(),
  getQueueLength: jest.fn(),
  storeJobResult: jest.fn().mockResolvedValue(true),
  incrementCounter: jest.fn().mockResolvedValue(1),
}));
