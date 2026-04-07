import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { redisClient } from "../config/redis";
import { JOB_METRICS, JOB_STATUS, JOB_TYPES, QUEUE_NAME } from "../constants";
import logger from "../utils/logger";

// Check submitter health
export const health = (req: Request, res: Response) => {
	res.json({ status: "healthy", service: "submitter" });
};

// Submit a new job
export const submitJob = async (req: Request, res: Response) => {
	try {
		const jobId = uuidv4();

		// Push to Redis queue
		await redisClient.lPush(QUEUE_NAME, jobId);

		// Store job status
		await redisClient.setEx(
			`job:${jobId}`,
			3600,
			JSON.stringify({
				status: JOB_STATUS.pending,
				jobId,
				type: JOB_TYPES.prime,
				submittedAt: Date.now(),
			}),
		);

		// Increment counter for stats
		await redisClient.incr(JOB_METRICS.totalJobsSubmitted.name);

		logger.info(`Job submitted: ${jobId}`);

		res.status(202).json({
			jobId,
			status: JOB_STATUS.pending,
			message: "Job submitted successfully",
		});
	} catch (error) {
		logger.error("Submit error:", error);
		res.status(500).json({ error: "Failed to submit job" });
	}
};

// Check job status
export const getJobStatus = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const data = await redisClient.get(`job:${id}`);

		if (!data) {
			return res.status(404).json({ error: "Job not found" });
		}

		const jobData = JSON.parse(data);
		res.json(jobData);
	} catch (error) {
		logger.error("Status error:", error);
		res.status(500).json({ error: "Failed to get job status" });
	}
};
