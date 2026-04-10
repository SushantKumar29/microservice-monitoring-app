import { createClient } from 'redis';
import logger from '../utils/logger';
import { REDIS_URL } from '../constants';

export const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => logger.error('Redis Error:', err));
redisClient.on('connect', () => logger.info('Redis connected'));

export const connectRedis = async () => {
  await redisClient.connect();
};
