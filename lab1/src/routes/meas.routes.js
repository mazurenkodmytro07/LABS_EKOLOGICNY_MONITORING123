import { Router } from 'express';
import {
  createMeasurement, listMeasurements, getMeasurement, updateMeasurement, deleteMeasurement
} from '../controllers/meas.controller.js';

const router = Router();

router.get('/', listMeasurements);
router.post('/', createMeasurement);
router.get('/:id', getMeasurement);
router.put('/:id', updateMeasurement);
router.delete('/:id', deleteMeasurement);

export default router;