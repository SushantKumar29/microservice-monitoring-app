import express from "express";
import jobRoutes from "./routes/jobRoutes";
import { connectRedis } from "./config/redis";
import dotenv from "dotenv";
import logger from "./utils/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", jobRoutes);

const startServer = async () => {
	try {
		await connectRedis();

		app.listen(PORT, () => {
			logger.info(`✅ Submitter service running on port ${PORT}`);
		});
	} catch (error) {
		logger.error("Failed to start:", error);
		process.exit(1);
	}
};

// Graceful shutdown
process.on("SIGTERM", async () => {
	logger.info("SIGTERM received, shutting down...");
	process.exit(0);
});

process.on("SIGINT", async () => {
	logger.info("SIGINT received, shutting down...");
	process.exit(0);
});

startServer();
