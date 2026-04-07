import { Request, Response } from "express";
import { register } from "../utils/metrics";
import { getAllStats, updateMetrics } from "../services/statsService";
import { QUEUE_NAME, WORKER_REPLICAS } from "../constants";
import logger from "../utils/logger";

// Check stats health
export const health = (req: Request, res: Response) => {
	res.json({ status: "healthy", service: "stats" });
};

// Get stats
export const getStats = async (req: Request, res: Response) => {
	try {
		const stats = await getAllStats();

		res.json({
			...stats,
			timestamp: Date.now(),
			services: {
				worker_replicas: WORKER_REPLICAS,
				queue_name: QUEUE_NAME,
			},
		});
	} catch (error) {
		logger.error("Error getting stats:", error);
		res.status(500).json({ error: "Failed to get stats" });
	}
};

// Metrics for Prometheus
export const getMetrics = async (req: Request, res: Response) => {
	try {
		await updateMetrics();
		res.set("Content-Type", register.contentType);
		res.end(await register.metrics());
	} catch (error) {
		logger.error("Error getting metrics:", error);
		res.status(500).send("# Error collecting metrics");
	}
};
