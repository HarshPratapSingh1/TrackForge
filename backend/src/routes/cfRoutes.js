import { Router } from "express";
import { getCfRating, upsertCfRating } from "../controllers/cfController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", getCfRating);
router.put("/", upsertCfRating);

export default router;
