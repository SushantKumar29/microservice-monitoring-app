export interface StatsResponse {
  total_jobs_submitted: number;
  total_jobs_completed: number;
  total_jobs_failed: number;
  queue_length: number;
  pending_jobs: number;
  timestamp: number;
  services: {
    worker_replicas: string;
    queue_name: string;
  };
}
