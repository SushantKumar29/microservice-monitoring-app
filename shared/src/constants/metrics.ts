export const METRICS = {
  totalJobsSubmitted: 'total_jobs_submitted',
  totalJobsCompleted: 'total_jobs_completed',
  totalJobsFailed: 'total_jobs_failed',
  jobProcessingTimeSeconds: 'job_processing_time_seconds',
  jobErrors: 'total_job_errors',
  queueLength: 'queue_length',
  pendingJobs: 'pending_jobs',
  activeJobs: 'active_jobs',
} as const;

export const METRIC_CONFIGS = {
  totalJobsSubmitted: {
    name: METRICS.totalJobsSubmitted,
    help: 'Total number of jobs submitted',
  },
  totalJobsCompleted: {
    name: METRICS.totalJobsCompleted,
    help: 'Total number of jobs completed',
  },
  totalJobsFailed: {
    name: METRICS.totalJobsFailed,
    help: 'Total number of jobs failed',
  },
  jobProcessingTimeSeconds: {
    name: METRICS.jobProcessingTimeSeconds,
    help: 'Job processing time in seconds',
  },
  jobErrors: {
    name: METRICS.jobErrors,
    help: 'Total number of job errors',
  },
  queueLength: {
    name: METRICS.queueLength,
    help: 'Current length of the job queue',
  },
  pendingJobs: {
    name: METRICS.pendingJobs,
    help: 'Number of pending jobs in queue',
  },
  activeJobs: {
    name: METRICS.activeJobs,
    help: 'Number of jobs currently being processed',
  },
} as const;
