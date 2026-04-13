import { Request, Response } from 'express';
import { register } from '../utils/metrics';
import { calculatePrimes } from '../services/primeCalculator';
import {
  totalJobsCompleted,
  totalJobErrors,
  jobProcessingDuration,
  activeJobs,
  queueLength,
} from '../utils/metrics';
import {
  storeJobResult,
  incrementCounter,
  getQueueLength,
  popFromQueue,
  WORKER_ID,
  PRIME_LIMIT,
  JOB_STATUS,
  METRIC_CONFIGS,
  QUEUE_NAME,
} from '@microservices/shared';

import { createLogger } from '@microservices/shared';
const logger = createLogger('worker');

let isProcessing = true;

// Check worker health
export const health = (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    workerId: WORKER_ID,
    isProcessing,
  });
};

// Metrics for Prometheus
export const getMetrics = async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};

// Process a single job
export const processJob = async (jobId: string) => {
  activeJobs.inc();

  try {
    logger.info(`[${WORKER_ID}] Processing job: ${jobId}`);

    const result = calculatePrimes(PRIME_LIMIT);
    const processingTimeSeconds = result?.executionTimeMs / 1000;

    await storeJobResult(jobId, {
      status: JOB_STATUS.completed,
      result: {
        ...result,
        workerId: WORKER_ID,
      },
      completedAt: Date.now(),
    });

    totalJobsCompleted.inc();
    jobProcessingDuration.observe(processingTimeSeconds);
    await incrementCounter(METRIC_CONFIGS.totalJobsCompleted.name);

    logger.info(
      `[${WORKER_ID}] Completed job: ${jobId} in ${result?.executionTimeMs}ms (${result.count} primes)`
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`[${WORKER_ID}] Error:`, errorMsg);

    await storeJobResult(jobId, {
      status: JOB_STATUS.failed,
      error: errorMsg,
      failedAt: Date.now(),
      workerId: WORKER_ID,
    });

    totalJobErrors.inc();
    await incrementCounter(METRIC_CONFIGS.totalJobsFailed.name);
  } finally {
    activeJobs.dec();
  }
};

// Worker main loop
export const startWorkerLoop = async () => {
  while (isProcessing) {
    try {
      const currentQueueLength = await getQueueLength(QUEUE_NAME);
      queueLength.set(currentQueueLength);

      const jobId = await popFromQueue(QUEUE_NAME);

      if (jobId) {
        await processJob(jobId);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      logger.error(`[${WORKER_ID}] Loop error:`, error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

export const stopWorkerLoop = () => {
  isProcessing = false;
};
