import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'site' },
  companyName: { type: String, default: process.env.DEFAULT_COMPANY_NAME || 'VN Tour & Travels' },
  email: { type: String, default: (process.env.DEFAULT_EMAIL || 'info@vntourtravels.test').toLowerCase(), lowercase: true, trim: true },
  phone: { type: String, default: process.env.DEFAULT_PHONE || '+91 91098 79836' },
  // Comma separated list in env -> array (fallback includes secondary number)
  phones: { type: [String], default: (process.env.DEFAULT_PHONES ? process.env.DEFAULT_PHONES.split(',').map(s=>s.trim()).filter(Boolean) : ['+91 99938 83995']) },
  whatsapp: { type: String, default: process.env.DEFAULT_WHATSAPP || '' },
  instagram: { type: String, default: process.env.DEFAULT_INSTAGRAM || '' },
  address: { type: String, default: process.env.DEFAULT_ADDRESS || 'Your Address Here' },
  supportHours: { type: String, default: process.env.DEFAULT_SUPPORT_HOURS || '09:00 - 18:00' },
  updatedBy: { type: Number }
},{ timestamps: true, versionKey: false });

export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
