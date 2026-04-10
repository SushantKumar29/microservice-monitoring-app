import request from 'supertest';
import express from 'express';
import statsRoutes from '../src/routes/statsRoutes';
import { getAllStats } from '../src/services/statsService';
import { register } from '../src/utils/metrics';

// Mock the service
jest.mock('../src/services/statsService');
jest.mock('../src/utils/metrics');

const app = express();
app.use('/', statsRoutes);

describe('Stats API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toEqual({
        status: 'healthy',
        service: 'stats',
      });
    });
  });

  describe('GET /stats', () => {
    it('should return all stats', async () => {
      const mockStats = {
        total_jobs_submitted: 100,
        total_jobs_completed: 95,
        total_jobs_failed: 3,
        queue_length: 2,
        pending_jobs: 2,
      };

      (getAllStats as jest.Mock).mockResolvedValue(mockStats);

      const response = await request(app).get('/stats').expect(200);

      expect(response.body).toMatchObject({
        total_jobs_submitted: 100,
        total_jobs_completed: 95,
        total_jobs_failed: 3,
        queue_length: 2,
        pending_jobs: 2,
      });
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('services');
      expect(response.body.services).toHaveProperty('worker_replicas');
      expect(response.body.services).toHaveProperty('queue_name');
    });

    it('should handle errors gracefully', async () => {
      (getAllStats as jest.Mock).mockRejectedValue(new Error('Redis error'));

      const response = await request(app).get('/stats').expect(500);

      expect(response.body).toEqual({ error: 'Failed to get stats' });
    });
  });

  describe('GET /metrics', () => {
    it('should return Prometheus metrics', async () => {
      const response = await request(app).get('/metrics').expect(200);

      expect(response.headers['content-type']).toContain('text/plain');
      expect(response.text).toContain('# HELP');
    });

    it('should handle errors when collecting metrics', async () => {
      (register.metrics as jest.Mock).mockRejectedValue(new Error('Metrics error'));

      const response = await request(app).get('/metrics').expect(500);

      expect(response.text).toBe('# Error collecting metrics');
    });
  });
});
