import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  type: { type: String, default: 'rental' },
  vehicleType: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  pickupLocation: String,
  dropLocation: String,
  pickupTime: String,
  returnTime: String,
  name: { type: String, required: true },
  email: { type: String, required: true },
  passengers: { type: Number },
  notes: String,
  createdAt: { type: Date, default: Date.now }
},{ versionKey:false });

export const Rental = mongoose.models.Rental || mongoose.model('Rental', rentalSchema);
