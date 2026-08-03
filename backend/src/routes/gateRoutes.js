import { Router } from "express";
import { getGateProgress, updateGateProgress, toggleGateItem } from "../controllers/gateController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", getGateProgress);
router.put("/", updateGateProgress);
router.put("/toggle", toggleGateItem);

export default router;