import { Router } from 'express';
import {
  createStation, listStations, getStation, updateStation, deleteStation
} from '../controllers/stations.controller.js';

const router = Router();

router.get('/', listStations);
router.post('/', createStation);
router.get('/:id', getStation);
router.put('/:id', updateStation);
router.delete('/:id', deleteStation);

export default router;