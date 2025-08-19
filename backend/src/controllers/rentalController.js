import { store } from '../models/store.js';
import { saveStoreDebounced } from '../services/persistence.js';
import { isDbConnected } from '../config/db.js';
import { Rental } from '../models/Rental.js';
import { getNextSeq } from '../services/sequence.js';
import { User } from '../models/User.js';
import { sendWhatsApp } from '../services/whatsapp.js';

// List rental requests (admin only)
export const listRentals = async (_req, res) => {
  if(isDbConnected()){
    const rentals = await Rental.find().sort({ id:-1 });
    return res.json(rentals);
  }
  res.json(store.rentals);
};

// Create rental request
export const createRental = async (req, res) => {
  const { type, vehicleType, startDate, endDate, pickupLocation, dropLocation, name, email, passengers, notes, pickupTime, returnTime } = req.body;
  if (!vehicleType || !startDate || !name || !email) return res.status(400).json({ error: 'Missing required fields' });
  if(isDbConnected()){
    const nextId = await getNextSeq('rentalId');
    const rental = await Rental.create({ id: nextId, type: type || 'rental', vehicleType, startDate, endDate: endDate||null, pickupLocation: pickupLocation||'', dropLocation: dropLocation||'', pickupTime: pickupTime||'', returnTime: returnTime||'', name, email, passengers: passengers?Number(passengers):null, notes: notes||'' });
    const adminUser = await User.findOne({ role:'admin' });
    if(adminUser){
      const msg = `New rental request #${rental.id}\nType: ${vehicleType}\nName: ${name}\nEmail: ${email}\nStart: ${startDate}${endDate? ' -> '+endDate:''}`;
      const toNumber = store.siteSettings.whatsapp || store.siteSettings.phone;
      sendWhatsApp(toNumber, msg);
      adminUser.notifications = adminUser.notifications || [];
      adminUser.notifications.push({ id:'notif_'+Date.now(), channel:'whatsapp', to: toNumber, message: msg, createdAt:new Date().toISOString() });
      await adminUser.save();
    }
    return res.json({ success:true, rental });
  }
  const rental = {
    id: store.rentals.length + 1,
    type: type || 'rental',
    vehicleType,
    startDate,
    endDate: endDate || null,
    pickupLocation: pickupLocation || '',
    dropLocation: dropLocation || '',
    pickupTime: pickupTime || '',
    returnTime: returnTime || '',
    name,
    email,
    passengers: passengers ? Number(passengers) : null,
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  store.rentals.push(rental);
  saveStoreDebounced();
  const admin = store.users.find(u=>u.role==='admin');
  if (admin) {
    const msg = `New rental request #${rental.id}\nType: ${vehicleType}\nName: ${name}\nEmail: ${email}\nStart: ${startDate}${endDate? ' -> '+endDate:''}`;
    const toNumber = store.siteSettings.whatsapp || store.siteSettings.phone;
    sendWhatsApp(toNumber, msg);
    admin.notifications = admin.notifications || [];
    admin.notifications.push({ id:'notif_'+Date.now(), channel:'whatsapp', to: toNumber, message: msg, createdAt:new Date().toISOString() });
  }
  res.json({ success: true, rental });
};
