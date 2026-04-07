import { getCounter, getQueueLength } from "../config/redis";
import { JOB_METRICS, QUEUE_NAME } from "../constants";
import { StatsResponse } from "../types";
import logger from "../utils/logger";
import {
	totalJobsSubmitted,
	totalJobsCompleted,
	totalJobsFailed,
	queueLength,
	pendingJobs,
} from "../utils/metrics";

export const getAllStats = async (): Promise<
	Omit<StatsResponse, "timestamp" | "services">
> => {
	const [submitted, completed, failed, queueLength] = await Promise.all([
		getCounter(JOB_METRICS.totalJobsSubmitted.name),
		getCounter(JOB_METRICS.totalJobsCompleted.name),
		getCounter(JOB_METRICS.totalJobsFailed.name),
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
		logger.error("Error updating metrics:", error);
	}
};
