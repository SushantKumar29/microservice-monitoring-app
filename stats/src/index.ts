import express from 'express';
import statsRoutes from './routes/statsRoutes';
import { connectRedis, disconnectRedis } from './config/redis';
import { updateMetrics } from './services/statsService';

import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use('/', statsRoutes);

// Update metrics periodically
let metricsInterval: NodeJS.Timeout;

const startServer = async () => {
  try {
    await connectRedis();

    // Update metrics every 5 seconds
    metricsInterval = setInterval(updateMetrics, 5000);

    app.listen(PORT, () => {
      logger.info(`✅ Stats service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start:', error);
    process.exit(1);
  }
};

// Graceful shutdown
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
