import { Router } from "express";
import {
  listStations,
  createStation,
  updateStation,
  deleteStation,
} from "../controllers/stations.controller.js";

const router = Router();

router.get("/", listStations);
router.post("/", createStation);
router.put("/:id", updateStation);
router.delete("/:id", deleteStation);

export default router;