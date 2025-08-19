import { Router } from 'express';
import { getContactInfo, updateContactInfo } from '../controllers/contactInfoController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.get('/', getContactInfo);
router.put('/', requireAuth, requireRole('admin'), updateContactInfo);
export default router;
