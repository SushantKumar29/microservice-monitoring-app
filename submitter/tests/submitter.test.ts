import request from 'supertest';
import express from 'express';
import jobRoutes from '../src/routes/jobRoutes';
import { redisClient } from '@microservices/shared';

jest.mock('@microservices/shared');

const app = express();
app.use(express.json());
app.use('/', jobRoutes);

describe('Submitter Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toEqual({
        status: 'healthy',
        service: 'submitter',
      });
    });
  });

  describe('POST /submit', () => {
    it('should submit a job successfully', async () => {
      const response = await request(app).post('/submit').expect(202);

      expect(response.body).toHaveProperty('jobId', 'fixed-uuid-123');
      expect(response.body.status).toBe('pending');
      expect(response.body.message).toBe('Job submitted successfully');
      expect(redisClient.lPush).toHaveBeenCalledTimes(1);
      expect(redisClient.setEx).toHaveBeenCalledTimes(1);
      expect(redisClient.incr).toHaveBeenCalledTimes(1);
    });

    it('should handle Redis errors', async () => {
      (redisClient.lPush as jest.Mock).mockRejectedValueOnce(new Error('Redis error'));

      const response = await request(app).post('/submit').expect(500);

      expect(response.body).toEqual({ error: 'Failed to submit job' });
    });
  });

  describe('GET /status/:id', () => {
    it('should return job status for existing job', async () => {
      const mockJob = JSON.stringify({
        status: 'completed',
        jobId: '123',
        type: 'prime',
        submittedAt: Date.now(),
      });
      (redisClient.get as jest.Mock).mockResolvedValue(mockJob);

      const response = await request(app).get('/status/123').expect(200);

      expect(response.body.status).toBe('completed');
      expect(response.body.jobId).toBe('123');
    });

    it('should return 404 for non-existent job', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/status/999').expect(404);

      expect(response.body).toEqual({ error: 'Job not found' });
    });

    it('should handle Redis errors', async () => {
      (redisClient.get as jest.Mock).mockRejectedValue(new Error('Redis error'));

      const response = await request(app).get('/status/123').expect(500);

      expect(response.body).toEqual({ error: 'Failed to get job status' });
    });
  });
});
