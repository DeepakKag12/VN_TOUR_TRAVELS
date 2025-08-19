import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  nid: { type: Number, index: true, unique: true, sparse: true },
  name: { type: String, required: true },
  city: String,
  description: String,
  pricePerNight: { type: Number, required: true },
  image: String,
  amenities: [String],
  available: { type: Boolean, default: true }
},{ timestamps: true });

export const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);
