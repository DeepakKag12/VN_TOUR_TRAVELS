import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listNotifications, clearNotifications, listMyNotifications } from '../controllers/notificationController.js';

const router = Router();
router.get('/', requireAuth, requireRole('admin'), listNotifications);
router.get('/mine', requireAuth, listMyNotifications);
router.post('/clear', requireAuth, requireRole('admin'), clearNotifications);
export default router;
