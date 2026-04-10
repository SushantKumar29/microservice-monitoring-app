import express from 'express';
import workerRoutes from './routes/workerRoutes';
import { connectRedis, disconnectRedis } from './config/redis';
import { startWorkerLoop, stopWorkerLoop } from './controllers/workerController';
import dotenv from 'dotenv';
import { PRIME_LIMIT } from './constants';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use('/', workerRoutes);

const startServer = async () => {
  try {
    await connectRedis();

    app.listen(PORT, () => {
      logger.info(`✅ Worker service running on port ${PORT}`);
      logger.info(`Prime limit: ${PRIME_LIMIT}`);
    });

    await startWorkerLoop();
  } catch (error) {
    logger.error('Failed to start:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  stopWorkerLoop();
  await disconnectRedis();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down...');
  stopWorkerLoop();
  await disconnectRedis();
  process.exit(0);
});

startServer();
