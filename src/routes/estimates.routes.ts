import { Router } from 'express';
import { EstimatesController } from '../controllers/EstimatesController';
import { validateRequest } from '../middlewares/validateRequest';
import { estimateRequestSchema } from '../models/EstimateRequest';

const router = Router();

router.post(
  '/',
  validateRequest(estimateRequestSchema),
  EstimatesController.create
);

export default router;
