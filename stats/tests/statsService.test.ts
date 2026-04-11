import { getAllStats, updateMetrics } from '../src/services/statsService';
import { getCounter, getQueueLength, METRIC_CONFIGS, QUEUE_NAME } from '@microservices/shared';
import {
  totalJobsSubmitted,
  totalJobsCompleted,
  totalJobsFailed,
  queueLength,
  pendingJobs,
} from '../src/utils/metrics';

// Mock dependencies
jest.mock('@microservices/shared');
jest.mock('../src/utils/metrics');

describe('Stats Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllStats', () => {
    it('should return correct stats from Redis', async () => {
      (getCounter as jest.Mock)
        .mockResolvedValueOnce(150)
        .mockResolvedValueOnce(140)
        .mockResolvedValueOnce(5);
      (getQueueLength as jest.Mock).mockResolvedValue(5);

      const result = await getAllStats();

      expect(getCounter).toHaveBeenCalledTimes(3);
      expect(getCounter).toHaveBeenCalledWith(METRIC_CONFIGS.totalJobsSubmitted.name);
      expect(getCounter).toHaveBeenCalledWith(METRIC_CONFIGS.totalJobsCompleted.name);
      expect(getCounter).toHaveBeenCalledWith(METRIC_CONFIGS.totalJobsFailed.name);
      expect(getQueueLength).toHaveBeenCalledWith(QUEUE_NAME);

      expect(result).toEqual({
        total_jobs_submitted: 150,
        total_jobs_completed: 140,
        total_jobs_failed: 5,
        queue_length: 5,
        pending_jobs: 5,
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
    });
  });
});
