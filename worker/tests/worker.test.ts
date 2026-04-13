import request from 'supertest';
import express from 'express';
import { processJob } from '../src/controllers/workerController';
import { storeJobResult, incrementCounter } from '@microservices/shared';
import { calculatePrimes } from '../src/services/primeCalculator';

jest.mock('@microservices/shared');
jest.mock('../src/services/primeCalculator');

import workerRoutes from '../src/routes/workerRoutes';

const app = express();
app.use('/', workerRoutes);

describe('Worker Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);
      expect(response.body).toHaveProperty('status', 'healthy');
    });
  });

  describe('GET /metrics', () => {
    it('should return Prometheus metrics', async () => {
      const response = await request(app).get('/metrics').expect(200);
      expect(response.headers['content-type']).toContain('text/plain');
    });
  });

  describe('processJob (internal)', () => {
    it('should process a job successfully', async () => {
      const mockResult = { count: 100, largestPrime: 541, executionTimeMs: 50 };
      (calculatePrimes as jest.Mock).mockReturnValue(mockResult);
      (storeJobResult as jest.Mock).mockResolvedValue(true);
      (incrementCounter as jest.Mock).mockResolvedValue(1);

      await processJob('test-job-123');

      expect(calculatePrimes).toHaveBeenCalled();
      expect(storeJobResult).toHaveBeenCalledWith(
        'test-job-123',
        expect.objectContaining({
          status: 'completed',
        })
      );
    });

    it('should handle job failure', async () => {
      (calculatePrimes as jest.Mock).mockImplementation(() => {
        throw new Error('Prime calculation failed');
      });

      await processJob('test-job-fail');

      expect(storeJobResult).toHaveBeenCalledWith(
        'test-job-fail',
        expect.objectContaining({
          status: 'failed',
          error: 'Prime calculation failed',
        })
      );
    });
  });
});
