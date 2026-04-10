import dotenv from 'dotenv';

dotenv.config();

export const QUEUE_NAME = 'job_queue';

export const JOB_TYPES = {
  prime: 'prime',
  hashing: 'hashing',
  sort: 'sort',
};

export const JOB_STATUS = {
  pending: 'pending',
  processing: 'processing',
  completed: 'completed',
  failed: 'failed',
};

export const JOB_METRICS = {
  totalJobsSubmitted: {
    name: 'total_jobs_submitted',
    help: 'Total number of jobs submitted',
  },
  totalJobsCompleted: {
    name: 'total_jobs_completed',
    help: 'Total number of jobs completed',
  },
  totalJobsFailed: {
    name: 'total_jobs_failed',
    help: 'Total number of jobs failed',
  },
  jobProcessingTimeSeconds: {
    name: 'job_processing_time_seconds',
    help: 'Total time to process a job',
  },
  jobErrors: {
    name: 'total_job_errors',
    help: 'Total number of job errors',
  },
  queueLength: {
    name: 'queue_length',
    help: 'Current length of the job queue',
  },
};

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT || 6379;
export const REDIS_URL = process.env.REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}`;
