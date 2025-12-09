import { Router } from "express";
import {
  calcAirIndex,
  historyByStation,
  getLimitsApi,
  updateLimitsApi,
} from "../controllers/airindex.controller.js";

const router = Router();

router.post("/calc", calcAirIndex);
router.get("/history", historyByStation);
router.get("/limits", getLimitsApi);
router.put("/limits", updateLimitsApi);

export default router;