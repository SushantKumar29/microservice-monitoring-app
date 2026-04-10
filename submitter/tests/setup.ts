import { config } from 'dotenv';
config({ path: '.env.test', quiet: true });

process.env.NODE_ENV = 'test';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'fixed-uuid-123'),
}));

jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

jest.mock('../src/config/redis', () => ({
  redisClient: {
    lPush: jest.fn().mockResolvedValue(1),
    setEx: jest.fn().mockResolvedValue('OK'),
    incr: jest.fn().mockResolvedValue(1),
    get: jest.fn(),
  },
  connectRedis: jest.fn().mockResolvedValue(true),
}));
