import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  modelId: { type: Number, required: true },
  userId: { type: Number, required: true },
  rating: { type: Number, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
