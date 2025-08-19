import mongoose from 'mongoose';

const modelItemSchema = new mongoose.Schema({
  // Auto-increment style numeric id we manage manually ("nid" = numeric id)
  nid: { type: Number, index: true, unique: true, sparse: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  type: { type: String, required: true },
  image: String,
  details: String,
  origin: String,
  destination: String,
  stops: [String],
  itinerary: String,
  departureTime: String, // optional schedule/departure time (HH:mm or text)
  arrivalTime: String    // optional arrival/return time
},{ timestamps: true });

export const ModelItem = mongoose.models.ModelItem || mongoose.model('ModelItem', modelItemSchema);
