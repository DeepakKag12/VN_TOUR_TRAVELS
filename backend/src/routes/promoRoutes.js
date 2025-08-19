import { Router } from 'express';
import { listPromos, createPromo, togglePromo } from '../controllers/promoController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.get('/', listPromos);
router.post('/', requireAuth, requireRole('admin'), createPromo);
router.post('/:code/toggle', requireAuth, requireRole('admin'), togglePromo);
export default router;
