import { Router } from 'express';
import { listModels, getModel, createModel, updateModel, deleteModel, getModelAvailability } from '../controllers/modelController.js';
import { uploadSingleImage } from '../middleware/upload.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', listModels);
router.get('/:id', getModel);
router.get('/:id/availability', getModelAvailability);
router.post('/', requireAuth, requireRole('admin'), uploadSingleImage, createModel);
router.put('/:id', requireAuth, requireRole('admin'), uploadSingleImage, updateModel);
router.delete('/:id', requireAuth, requireRole('admin'), deleteModel);

export default router;
