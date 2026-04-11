import express from 'express';
import jobRoutes from './routes/jobRoutes.js';
import { connectRedis, createLogger } from '@microservices/shared';
import dotenv from 'dotenv';

dotenv.config();

const logger = createLogger('submitter');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', jobRoutes);

const startServer = async () => {
  try {
    await connectRedis();
    app.listen(PORT, () => {
      logger.info(`✅ Submitter service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down...');
  process.exit(0);
});

startServer();
