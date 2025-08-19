import mongoose from 'mongoose';

// Generic booking schema supporting listings (ModelItem) and hotels.
// One of modelId or hotelId will be present. "date" stores the primary date (for hotel = checkIn).
const bookingSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  modelId: { type: Number },          // tour / bus listing id (nid)
  hotelId: { type: Number },          // hotel numeric id (nid)
  userId: { type: Number, required: true },
  name: String,
  email: String,
  date: String,                       // single date or check-in
  startTime: String,                  // optional (mainly for tours with time slots)
  endTime: String,
  extras: { type: Object, default: {} }, // stores serviceType, guests, checkOut, nights, etc.
  status: { type: String, default: 'pending' },
  promoCode: String,
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number, default: 0 },
  revenueCounted: { type: Boolean, default: false }
},{ timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
