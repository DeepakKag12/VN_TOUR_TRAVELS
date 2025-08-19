import { Router } from 'express';
import { listRentals, createRental } from '../controllers/rentalController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireRole('admin'), listRentals);
router.post('/', createRental);

export default router;
