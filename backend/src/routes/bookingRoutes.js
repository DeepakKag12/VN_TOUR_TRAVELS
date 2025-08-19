import { Router } from 'express';
import { book, listBookings, approveBooking, rejectBooking, listMyBookings, cancelBooking } from '../controllers/bookingController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, book); // booking requires login
router.get('/', requireAuth, requireRole('admin'), listBookings); // admin can view all bookings
router.get('/mine', requireAuth, listMyBookings);
router.post('/:id/approve', requireAuth, requireRole('admin'), approveBooking);
router.post('/:id/reject', requireAuth, requireRole('admin'), rejectBooking);
router.post('/:id/cancel', requireAuth, cancelBooking);

export default router;
