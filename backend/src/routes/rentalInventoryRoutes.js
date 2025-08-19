import { Router } from 'express';
import { listRentalItems, getRentalItem, createRentalItem, updateRentalItem, deleteRentalItem } from '../controllers/rentalInventoryController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadSingleImage } from '../middleware/upload.js';

const router = Router();
router.get('/', listRentalItems);
router.get('/:id', getRentalItem);
router.post('/', requireAuth, requireRole('admin'), uploadSingleImage, createRentalItem);
router.put('/:id', requireAuth, requireRole('admin'), uploadSingleImage, updateRentalItem);
router.delete('/:id', requireAuth, requireRole('admin'), deleteRentalItem);
export default router;
