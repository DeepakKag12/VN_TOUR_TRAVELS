import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema({
  _id: { type: String, default: 'primary' },
  companyName: { type: String, default: process.env.DEFAULT_COMPANY_NAME || 'VN Tour & Travels' },
  email: { type: String, default: (process.env.DEFAULT_EMAIL || 'vn.travel09@gmail.com').toLowerCase(), lowercase:true, trim:true },
  phonePrimary: { type: String, default: process.env.DEFAULT_PHONE || '+91 91098 79836' },
  phoneSecondary: { type: String, default: (process.env.DEFAULT_PHONES || '').split(',')[0] || '+91 99938 83995' },
  phones: { type: [String], default: (process.env.DEFAULT_PHONES? process.env.DEFAULT_PHONES.split(',').map(s=>s.trim()).filter(Boolean): ['+91 99938 83995']) },
  whatsapp: { type: String, default: process.env.DEFAULT_WHATSAPP || '' },
  instagram: { type: String, default: process.env.DEFAULT_INSTAGRAM || '' },
  address: { type: String, default: process.env.DEFAULT_ADDRESS || 'Scheme No 71, Gumasta Nagar, Indore (M.P.)' },
  supportHours: { type: String, default: process.env.DEFAULT_SUPPORT_HOURS || '08:00 - 21:00' },
  updatedBy: { type: Number }
},{ timestamps:true, versionKey:false });

export const ContactInfo = mongoose.models.ContactInfo || mongoose.model('ContactInfo', contactInfoSchema);
