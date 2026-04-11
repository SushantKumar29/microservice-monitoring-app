import { METRIC_CONFIGS } from '@microservices/shared';
import client from 'prom-client';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const totalJobsSubmitted = new client.Counter({
  name: METRIC_CONFIGS.totalJobsSubmitted.name,
  help: METRIC_CONFIGS.totalJobsSubmitted.help,
  registers: [register],
});
export const totalJobsCompleted = new client.Counter({
  name: METRIC_CONFIGS.totalJobsCompleted.name,
  help: METRIC_CONFIGS.totalJobsCompleted.help,
  registers: [register],
});

export const totalJobErrors = new client.Counter({
  name: METRIC_CONFIGS.jobErrors.name,
  help: METRIC_CONFIGS.jobErrors.help,
  registers: [register],
});

export const jobProcessingDuration = new client.Histogram({
  name: METRIC_CONFIGS.jobProcessingTimeSeconds.name,
  help: METRIC_CONFIGS.jobProcessingTimeSeconds.help,
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60, 90, 120],
  registers: [register],
});

export const activeJobs = new client.Gauge({
  name: METRIC_CONFIGS.activeJobs.name,
  help: METRIC_CONFIGS.activeJobs.help,
  registers: [register],
});

export const queueLength = new client.Gauge({
  name: METRIC_CONFIGS.queueLength.name,
  help: METRIC_CONFIGS.queueLength.help,
  registers: [register],
});
