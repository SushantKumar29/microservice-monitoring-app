import { getCounter, getQueueLength, METRIC_CONFIGS, QUEUE_NAME } from '@microservices/shared';
import { StatsResponse } from '../types';
import {
  pendingJobs,
  queueLength,
  totalJobsCompleted,
  totalJobsFailed,
  totalJobsSubmitted,
} from '../utils/metrics';

import { createLogger } from '@microservices/shared';
const logger = createLogger('stats');

export const getAllStats = async (): Promise<Omit<StatsResponse, 'timestamp' | 'services'>> => {
  const [submitted, completed, failed, queueLength] = await Promise.all([
    getCounter(METRIC_CONFIGS.totalJobsSubmitted.name),
    getCounter(METRIC_CONFIGS.totalJobsCompleted.name),
    getCounter(METRIC_CONFIGS.totalJobsFailed.name),
    getQueueLength(QUEUE_NAME),
  ]);

  return {
    total_jobs_submitted: submitted,
    total_jobs_completed: completed,
    total_jobs_failed: failed,
    queue_length: queueLength,
    pending_jobs: submitted - completed - failed,
  };
};

export const updateMetrics = async () => {
  try {
    const stats = await getAllStats();

    totalJobsSubmitted.set(stats.total_jobs_submitted);
    totalJobsCompleted.set(stats.total_jobs_completed);
    totalJobsFailed.set(stats.total_jobs_failed);
    queueLength.set(stats.queue_length);
    pendingJobs.set(stats.pending_jobs);
  } catch (error) {
    logger.error('Error updating metrics:', error);
  }
};
