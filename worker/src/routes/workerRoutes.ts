import { Router } from "express";
import { health, getMetrics } from "../controllers/workerController";

const router = Router();

router.get("/health", health);
router.get("/metrics", getMetrics);

export default router;
