import client from 'prom-client';
import { JOB_METRICS } from '../constants';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const totalJobsSubmitted = new client.Gauge({
  name: JOB_METRICS.totalJobsSubmitted.name,
  help: JOB_METRICS.totalJobsSubmitted.help,
  registers: [register],
});

export const totalJobsCompleted = new client.Gauge({
  name: JOB_METRICS.totalJobsCompleted.name,
  help: JOB_METRICS.totalJobsCompleted.help,
  registers: [register],
});

export const totalJobsFailed = new client.Gauge({
  name: JOB_METRICS.totalJobsFailed.name,
  help: JOB_METRICS.totalJobsFailed.help,
  registers: [register],
});

export const queueLength = new client.Gauge({
  name: JOB_METRICS.queueLength.name,
  help: JOB_METRICS.queueLength.help,
  registers: [register],
});

export const pendingJobs = new client.Gauge({
  name: JOB_METRICS.pendingJobs.name,
  help: JOB_METRICS.pendingJobs.help,
  registers: [register],
});
