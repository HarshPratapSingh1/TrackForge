import { Router } from "express";
import { getAchievements, setAchievements } from "../controllers/achievementController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", getAchievements);
router.put("/", setAchievements);

export default router;
