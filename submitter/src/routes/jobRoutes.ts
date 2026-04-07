import { Router } from "express";
import { submitJob, getJobStatus, health } from "../controllers/jobController";

const router = Router();

router.get("/health", health);

router.post("/submit", submitJob);
router.get("/status/:id", getJobStatus);

export default router;
