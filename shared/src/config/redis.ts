import { createClient } from 'redis';
import { logger } from '../utils/logger.js';
import { REDIS_URL } from '../constants/index.js';

export const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => logger.error('Redis Error:', err));
redisClient.on('connect', () => logger.info('Redis connected'));

export const connectRedis = async () => {
  await redisClient.connect();
};

export const disconnectRedis = async () => {
  await redisClient.disconnect();
};

export const getCounter = async (counterName: string): Promise<number> => {
  const value = await redisClient.get(counterName);
  return value ? Number(value) : 0;
};

export const incrementCounter = async (counterName: string) => {
  await redisClient.incr(counterName);
};

export const getQueueLength = async (queueName: string): Promise<number> => {
  return await redisClient.lLen(queueName);
};

export const popFromQueue = async (queueName: string) => {
  return await redisClient.rPop(queueName);
};

export const pushToQueue = async (queueName: string, data: string) => {
  return await redisClient.lPush(queueName, data);
};

export const storeJobResult = async (jobId: string, data: unknown, ttlSeconds: number = 3600) => {
  await redisClient.setEx(`job:${jobId}`, ttlSeconds, JSON.stringify(data));
};

export const getJobResult = async (jobId: string) => {
  const data = await redisClient.get(`job:${jobId}`);
  return data ? JSON.parse(data) : null;
};
