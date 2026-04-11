import express from 'express';
import workerRoutes from './routes/workerRoutes.js';
import { connectRedis, disconnectRedis, createLogger } from '@microservices/shared';
import { startWorkerLoop, stopWorkerLoop } from './controllers/workerController.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = createLogger('worker');
const app = express();
const PORT = process.env.PORT || 3001;
const PRIME_LIMIT = 2000000;

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
