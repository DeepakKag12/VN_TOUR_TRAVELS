import mongoose from 'mongoose';

const promoSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  type: { type: String, enum: ['percent','flat'], required: true },
  value: { type: Number, required: true },
  active: { type: Boolean, default: true }
},{ timestamps: true });

export const Promo = mongoose.models.Promo || mongoose.model('Promo', promoSchema);
