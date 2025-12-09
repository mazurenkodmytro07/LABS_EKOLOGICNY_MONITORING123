import { Router } from "express";
import {
  listMeasurements,
  createMeasurement,
} from "../controllers/means.controller.js";

const router = Router();

router.get("/", listMeasurements);
router.post("/", createMeasurement);

export default router;