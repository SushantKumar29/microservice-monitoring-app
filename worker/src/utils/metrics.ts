import client from 'prom-client';
import { JOB_METRICS } from '../constants';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const totalJobsSubmitted = new client.Counter({
  name: JOB_METRICS.totalJobsSubmitted.name,
  help: JOB_METRICS.totalJobsSubmitted.help,
  registers: [register],
});
export const totalJobsCompleted = new client.Counter({
  name: JOB_METRICS.totalJobsCompleted.name,
  help: JOB_METRICS.totalJobsCompleted.help,
  registers: [register],
});

export const totalJobErrors = new client.Counter({
  name: JOB_METRICS.jobErrors.name,
  help: JOB_METRICS.jobErrors.help,
  registers: [register],
});

export const jobProcessingDuration = new client.Histogram({
  name: JOB_METRICS.jobProcessingTimeSeconds.name,
  help: JOB_METRICS.jobProcessingTimeSeconds.help,
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60, 90, 120],
  registers: [register],
});

export const activeJobs = new client.Gauge({
  name: JOB_METRICS.activeJobs.name,
  help: JOB_METRICS.activeJobs.help,
  registers: [register],
});

export const queueLength = new client.Gauge({
  name: JOB_METRICS.queueLength.name,
  help: JOB_METRICS.queueLength.help,
  registers: [register],
});
