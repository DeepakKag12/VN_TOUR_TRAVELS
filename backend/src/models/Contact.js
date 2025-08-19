import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
},{ versionKey: false });

export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
