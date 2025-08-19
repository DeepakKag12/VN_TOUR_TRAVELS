import mongoose from 'mongoose';

const rentalItemSchema = new mongoose.Schema({
  nid: { type: Number, index: true, unique: true, sparse: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['car','bike','other'], required: true },
  description: String,
  pricePerDay: { type: Number, required: true },
  image: String,
  available: { type: Boolean, default: true }
},{ timestamps: true });

export const RentalItem = mongoose.models.RentalItem || mongoose.model('RentalItem', rentalItemSchema);
