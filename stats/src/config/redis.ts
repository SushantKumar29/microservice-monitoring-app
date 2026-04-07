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

// Stats operations
export const getCounter = async (counterName: string): Promise<number> => {
	const value = await redisClient.get(counterName);
	return value ? Number(value) : 0;
};

export const getQueueLength = async (queueName: string): Promise<number> => {
	return await redisClient.lLen(queueName);
};
