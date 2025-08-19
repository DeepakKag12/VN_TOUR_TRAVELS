import { Router } from 'express';
import { listHotels, getHotel, createHotel, updateHotel, deleteHotel, getHotelAvailability } from '../controllers/hotelController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadSingleImage } from '../middleware/upload.js';

const router = Router();
router.get('/', listHotels);
router.get('/:id', getHotel);
router.get('/:id/availability', getHotelAvailability);
router.post('/', requireAuth, requireRole('admin'), uploadSingleImage, createHotel);
router.put('/:id', requireAuth, requireRole('admin'), uploadSingleImage, updateHotel);
router.delete('/:id', requireAuth, requireRole('admin'), deleteHotel);
export default router;
