import express from 'express';
import statsRoutes from './routes/statsRoutes.js';
import { connectRedis, disconnectRedis, createLogger } from '@microservices/shared';
import { updateMetrics } from './services/statsService.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = createLogger('stats');
const app = express();
const PORT = process.env.PORT || 3002;

app.use('/', statsRoutes);

let metricsInterval: NodeJS.Timeout;

const startServer = async () => {
  try {
    await connectRedis();
    metricsInterval = setInterval(updateMetrics, 5000);
    app.listen(PORT, () => {
      logger.info(`✅ Stats service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  clearInterval(metricsInterval);
  await disconnectRedis();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down...');
  clearInterval(metricsInterval);
  await disconnectRedis();
  process.exit(0);
});

startServer();
