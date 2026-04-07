import { createClient } from "redis";
import logger from "../utils/logger";
import { REDIS_URL } from "../constants";

export const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => logger.error("Redis Error:", err));
redisClient.on("connect", () => logger.info("Redis connected"));

export const connectRedis = async () => {
	await redisClient.connect();
};

export const disconnectRedis = async () => {
	await redisClient.disconnect();
};

// Queue operations
export const popFromQueue = async (queueName: string) => {
	return await redisClient.rPop(queueName);
};

export const getQueueLength = async (queueName: string) => {
	return await redisClient.lLen(queueName);
};

// Job result operations
export const storeJobResult = async (
	jobId: string,
	data: unknown,
	ttlSeconds: number = 3600,
) => {
	await redisClient.setEx(`job:${jobId}`, ttlSeconds, JSON.stringify(data));
};

// Stats operations
export const incrementCounter = async (counterName: string) => {
	await redisClient.incr(counterName);
};
