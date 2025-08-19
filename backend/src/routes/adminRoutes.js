import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { dashboardStats, listUsers, toggleUserBlock } from '../controllers/adminController.js';

const router = Router();
router.get('/stats', requireAuth, requireRole('admin'), dashboardStats);
router.get('/users', requireAuth, requireRole('admin'), listUsers);
router.post('/users/:id/toggle-block', requireAuth, requireRole('admin'), toggleUserBlock);
export default router;
