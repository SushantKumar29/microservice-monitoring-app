import { Router } from "express";
import { getStats, getMetrics, health } from "../controllers/statsController";

const router = Router();

router.get("/health", health);
router.get("/stats", getStats);
router.get("/metrics", getMetrics);

export default router;
