import { Router } from 'express';
import { listReviews, createReview } from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.get('/', listReviews);
router.post('/', requireAuth, createReview);
export default router;
