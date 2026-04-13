import client from 'prom-client';
import { METRIC_CONFIGS } from '@microservices/shared';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const totalJobsSubmitted = new client.Gauge({
  name: METRIC_CONFIGS.totalJobsSubmitted.name,
  help: METRIC_CONFIGS.totalJobsSubmitted.help,
  registers: [register],
});

export const totalJobsCompleted = new client.Gauge({
  name: METRIC_CONFIGS.totalJobsCompleted.name,
  help: METRIC_CONFIGS.totalJobsCompleted.help,
  registers: [register],
});

export const totalJobsFailed = new client.Gauge({
  name: METRIC_CONFIGS.totalJobsFailed.name,
  help: METRIC_CONFIGS.totalJobsFailed.help,
  registers: [register],
});

export const queueLength = new client.Gauge({
  name: METRIC_CONFIGS.queueLength.name,
  help: METRIC_CONFIGS.queueLength.help,
  registers: [register],
});

export const pendingJobs = new client.Gauge({
  name: METRIC_CONFIGS.pendingJobs.name,
  help: METRIC_CONFIGS.pendingJobs.help,
  registers: [register],
});
