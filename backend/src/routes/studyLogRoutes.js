import { Router } from "express";
import { getLogs, addLog, getStreak } from "../controllers/studyLogController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", getLogs);
router.post("/", addLog);
router.get("/streak", getStreak);

export default router;
