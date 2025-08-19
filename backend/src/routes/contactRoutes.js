import { Router } from 'express';
import { submitContact, listContacts } from '../controllers/contactController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', submitContact); // public submit
router.get('/', requireAuth, requireRole('admin'), listContacts); // admin view

export default router;
