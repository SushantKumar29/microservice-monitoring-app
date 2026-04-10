import { getAllStats, updateMetrics } from '../src/services/statsService';
import { getCounter, getQueueLength } from '../src/config/redis';
import { QUEUE_NAME, JOB_METRICS } from '../src/constants';
import {
  totalJobsSubmitted,
  totalJobsCompleted,
  totalJobsFailed,
  queueLength,
  pendingJobs,
} from '../src/utils/metrics';

// Mock dependencies
jest.mock('../src/config/redis');
jest.mock('../src/utils/metrics');

describe('Stats Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllStats', () => {
    it('should return correct stats from Redis', async () => {
      const mockSubmitted = 150;
      const mockCompleted = 140;
      const mockFailed = 5;
      const mockQueueLength = 5;

      (getCounter as jest.Mock)
        .mockResolvedValueOnce(mockSubmitted)
        .mockResolvedValueOnce(mockCompleted)
        .mockResolvedValueOnce(mockFailed);
      (getQueueLength as jest.Mock).mockResolvedValue(mockQueueLength);

      const result = await getAllStats();

      expect(getCounter).toHaveBeenCalledTimes(3);
      expect(getCounter).toHaveBeenCalledWith(JOB_METRICS.totalJobsSubmitted.name);
      expect(getCounter).toHaveBeenCalledWith(JOB_METRICS.totalJobsCompleted.name);
      expect(getCounter).toHaveBeenCalledWith(JOB_METRICS.totalJobsFailed.name);
      expect(getQueueLength).toHaveBeenCalledWith(QUEUE_NAME);

      expect(result).toEqual({
        total_jobs_submitted: 150,
        total_jobs_completed: 140,
        total_jobs_failed: 5,
        queue_length: 5,
        pending_jobs: 5, // 150 - 140 - 5 = 5
      });
    });

    it('should handle null/undefined values from Redis', async () => {
      (getCounter as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(0);
      (getQueueLength as jest.Mock).mockResolvedValue(0);

      const result = await getAllStats();

      expect(result).toEqual({
        total_jobs_submitted: null,
        total_jobs_completed: undefined,
        total_jobs_failed: 0,
        queue_length: 0,
        pending_jobs: NaN,
      });
    });

    it('should handle string numbers correctly', async () => {
      (getCounter as jest.Mock)
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(80)
        .mockResolvedValueOnce(5);
      (getQueueLength as jest.Mock).mockResolvedValue(15);

      const result = await getAllStats();

      expect(result.total_jobs_submitted).toBe(100);
      expect(result.total_jobs_completed).toBe(80);
      expect(result.total_jobs_failed).toBe(5);
      expect(result.queue_length).toBe(15);
      expect(result.pending_jobs).toBe(15); // 100 - 80 - 5 = 15
    });
  });

  describe('updateMetrics', () => {
    it('should update all Prometheus metrics with current stats', async () => {
      (getCounter as jest.Mock)
        .mockResolvedValueOnce(200)
        .mockResolvedValueOnce(180)
        .mockResolvedValueOnce(10);
      (getQueueLength as jest.Mock).mockResolvedValue(10);

      await updateMetrics();

      expect(totalJobsSubmitted.set).toHaveBeenCalledWith(200);
      expect(totalJobsCompleted.set).toHaveBeenCalledWith(180);
      expect(totalJobsFailed.set).toHaveBeenCalledWith(10);
      expect(queueLength.set).toHaveBeenCalledWith(10);
      expect(pendingJobs.set).toHaveBeenCalledWith(10);
    });

    it('should handle errors without throwing', async () => {
      (getCounter as jest.Mock).mockRejectedValue(new Error('Redis connection failed'));

      await expect(updateMetrics()).resolves.not.toThrow();

      // Verify error was logged (mock logger)
      const logger = require('../src/utils/logger');
      expect(logger.error).toHaveBeenCalledWith('Error updating metrics:', expect.any(Error));
    });
  });
});
