import { Router } from "express";
import { getGoals, addGoal, updateGoal } from "../controllers/goalController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", getGoals);
router.post("/", addGoal);
router.patch("/:id", updateGoal);

export default router;
