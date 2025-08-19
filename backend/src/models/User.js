import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: Number, index: true, unique: true }, // incremental numeric id for legacy compatibility
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  emailVerified: { type: Boolean, default: false },
  passwordHash: { type: String },
  role: { type: String, default: 'native' },
  blocked: { type: Boolean, default: false },
  phone: { type: String },
  preferences: { type: Object, default: {} },
  notifications: { type: Array, default: [] },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  emailVerifyToken: { type: String }
},{ timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
