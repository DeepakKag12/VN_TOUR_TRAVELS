import { store } from '../models/store.js';
import { saveStoreDebounced } from '../services/persistence.js';
import { isDbConnected } from '../config/db.js';
import { Booking } from '../models/Booking.js';
import { ModelItem } from '../models/ModelItem.js';
import { Hotel } from '../models/Hotel.js';
import { getNextSeq } from '../services/sequence.js';
import { User } from '../models/User.js';
import { sendWhatsApp } from '../services/whatsapp.js';

// Book endpoint now supports multiple product types:
// 1. Tours / bus listings (ModelItem) => require modelId, date, optionally start/end time.
// 2. Hotels => require hotelId, checkIn (date), checkOut (extras.checkOut), guests.
// Validation & pricing differ per type.
export const book = async (req, res) => {
  const { modelId, hotelId, name, email, date, startTime, endTime, extras, promoCode } = req.body;
  const useDb = isDbConnected();
  let serviceType = 'listing';
  let basePrice = 0;
  let contextItem = null;
  const extrasObj = { ...(extras||{}) };

  try {
    if(!modelId && !hotelId) return res.status(400).json({ error:'Provide modelId (tour/bus) or hotelId' });
    if(modelId && hotelId) return res.status(400).json({ error:'Provide only one of modelId or hotelId' });

    if(hotelId){
      // Hotel booking branch
      let hotel;
      if(useDb) hotel = await Hotel.findOne({ nid: hotelId }); else hotel = (store.hotels||[]).find(h=>h.id===hotelId);
      if(!hotel) return res.status(404).json({ error:'Hotel not found' });
      serviceType = 'hotel';
      // Expect date as checkIn
      if(!date) return res.status(400).json({ error:'Missing check-in date' });
      const checkOut = extrasObj.checkOut;
      if(!checkOut) return res.status(400).json({ error:'Missing check-out date' });
      const inDate = new Date(date);
      const outDate = new Date(checkOut);
      if(isNaN(inDate.getTime()) || isNaN(outDate.getTime()) || outDate<=inDate) return res.status(400).json({ error:'Invalid date range' });
      const msPerDay = 1000*60*60*24;
      const nights = Math.round((outDate.getTime()-inDate.getTime())/msPerDay);
      extrasObj.nights = nights;
      extrasObj.guests = extrasObj.guests ? Number(extrasObj.guests): 1;
      // Overlap validation (DB only for now)
      if(useDb){
        const overlaps = await Booking.find({ hotelId, status:{ $ne:'rejected' } });
        const overlapFound = overlaps.some(b=> {
          if(!b.date) return false;
            const bStart = new Date(b.date);
            const bEnd = b.extras?.checkOut ? new Date(b.extras.checkOut) : bStart;
            return (inDate <= bEnd) && (outDate >= bStart);
        });
        if(overlapFound) return res.status(409).json({ error:'Dates overlap existing booking' });
      }
      basePrice = hotel.pricePerNight * nights;
      contextItem = hotel;
    } else if(modelId){
      // Listing booking branch (tour / bus)
      let model;
      if(useDb) model = await ModelItem.findOne({ nid: modelId }); else model = store.models.find(m=>m.id===modelId);
      if(!model) return res.status(404).json({ error:'Listing not found' });
      serviceType = model.type;
      if(!date) return res.status(400).json({ error:'Missing date' });
      // For bus we ignore checkOut & guests if provided; for tours we may allow startTime optionally.
      basePrice = model.price;
      contextItem = model;
    }

    // Promo application (flat or % of basePrice)
    let discount = 0; let appliedPromo = null;
    if(promoCode){
      const code = String(promoCode).toUpperCase();
      const promo = store.promos.find(p=>p.code.toUpperCase()===code && p.active);
      if(!promo) return res.status(400).json({ error:'Invalid promo code' });
      appliedPromo = promo.code;
      discount = promo.type==='percent' ? (basePrice * promo.value)/100 : promo.value;
      if(discount > basePrice) discount = basePrice;
    }
    const finalPrice = basePrice - discount;
    extrasObj.serviceType = serviceType;

    if(useDb){
      const nextId = await getNextSeq('bookingId');
      const bookingDoc = await Booking.create({ id: nextId, modelId: modelId||undefined, hotelId: hotelId||undefined, userId: req.user.id, name: name || req.user.username, email: email || req.user.email || '', date, startTime: startTime||'', endTime: endTime||'', extras: extrasObj, status: 'pending', promoCode: appliedPromo, discount, finalPrice });
      await notifyAdmin(bookingDoc, serviceType, finalPrice, date, startTime);
      return res.json({ success:true, booking: bookingDoc });
    } else {
  const nowIso = new Date().toISOString();
  const booking = { id: store.bookings.length + 1, modelId: modelId||null, hotelId: hotelId||null, userId: req.user.id, name: name || req.user.username, email: email || req.user.email || '', date, startTime: startTime||'', endTime: endTime||'', extras: extrasObj, status: 'pending', promoCode: appliedPromo, discount, finalPrice, revenueCounted:false, createdAt: nowIso, updatedAt: nowIso };
      store.bookings.push(booking);
      store.analytics.bookingCount += 1;
      saveStoreDebounced();
      await notifyAdmin(booking, serviceType, finalPrice, date, startTime);
      return res.json({ success:true, booking });
    }
  } catch(e){
    console.error('[book] failed', e);
    return res.status(500).json({ error:'Failed to create booking' });
  }
};

async function notifyAdmin(bookingRecord, serviceType, finalPrice, date, startTime){
  try {
    const adminUser = await User.findOne({ role:'admin' });
    if(adminUser){
      const msg = `New ${serviceType} booking #${bookingRecord.id}\nName: ${bookingRecord.name}\nEmail: ${bookingRecord.email}\nDate: ${date}${startTime? ' '+startTime:''}\nAmount: ₹${finalPrice}`;
      const toNumber = store.siteSettings.whatsapp || store.siteSettings.phone;
      sendWhatsApp(toNumber, msg);
      adminUser.notifications = adminUser.notifications || [];
      adminUser.notifications.push({ id:'notif_'+Date.now(), channel:'whatsapp', to: toNumber, message: msg, createdAt:new Date().toISOString() });
      await adminUser.save();
    }
  } catch {}
}

export const cancelBooking = async (req,res)=> {
  const id = parseInt(req.params.id); if(Number.isNaN(id)) return res.status(400).json({ error:'Invalid id'});
  const useDb = isDbConnected();
  if(useDb){
    const b = await Booking.findOne({ id });
    if(!b) return res.status(404).json({ error:'Not found'});
    if(b.userId !== req.user.id && req.user.role!=='admin') return res.status(403).json({ error:'Forbidden'});
    if(b.status==='approved') return res.status(400).json({ error:'Approved booking cannot be cancelled'});
    b.status = 'cancelled';
    await b.save();
    return res.json({ success:true, booking:b });
  }
  const b = store.bookings.find(x=>x.id===id);
  if(!b) return res.status(404).json({ error:'Not found'});
  if(b.userId !== req.user.id && req.user.role!=='admin') return res.status(403).json({ error:'Forbidden'});
  if(b.status==='approved') return res.status(400).json({ error:'Approved booking cannot be cancelled'});
  b.status = 'cancelled';
  b.updatedAt = new Date().toISOString();
  saveStoreDebounced();
  res.json({ success:true, booking:b });
};

export const listBookings = async (_req,res) => {
  if(isDbConnected()){
    const docs = await Booking.find().sort({ id:-1 });
    return res.json(docs);
  }
  res.json(store.bookings);
};

export const listMyBookings = async (req,res) => {
  if(isDbConnected()){
    const docs = await Booking.find({ userId: req.user.id }).sort({ id:-1 });
    return res.json(docs);
  }
  const my = store.bookings.filter(b=> b.userId === req.user.id);
  res.json(my);
};

export const approveBooking = async (req,res) => {
  const id = parseInt(req.params.id);
  if(isDbConnected()){
    const b = await Booking.findOne({ id });
    if(!b) return res.status(404).json({ error:'Not found' });
    b.status = 'approved';
    if(!b.revenueCounted){ store.analytics.revenue += (b.finalPrice||0); b.revenueCounted = true; }
    await b.save();
    const user = await User.findOne({ id: b.userId });
    if(user){
      user.notifications = user.notifications || [];
      user.notifications.push({ id:'u_notif_'+Date.now(), channel:'inapp', to:user.username, message:`Your booking #${b.id} has been approved. Amount: ₹${b.finalPrice}.`, createdAt:new Date().toISOString() });
      await user.save();
    }
    return res.json({ success:true, booking: b });
  }
  const b = store.bookings.find(x=>x.id===id);
  if(!b) return res.status(404).json({ error: 'Not found' });
  b.status = 'approved';
  b.updatedAt = new Date().toISOString();
  if(!b.revenueCounted){ store.analytics.revenue += (b.finalPrice||0); b.revenueCounted = true; }
  const user = store.users.find(u=>u.id===b.userId);
  if(user){
    user.notifications = user.notifications || [];
    user.notifications.push({ id:'u_notif_'+Date.now(), channel:'inapp', to:user.username, message:`Your booking #${b.id} has been approved. Amount: ₹${b.finalPrice}.`, createdAt:new Date().toISOString() });
  }
  saveStoreDebounced();
  res.json({ success:true, booking: b });
};

export const rejectBooking = async (req,res) => {
  const id = parseInt(req.params.id);
  if(isDbConnected()){
    const b = await Booking.findOne({ id });
    if(!b) return res.status(404).json({ error:'Not found' });
    b.status = 'rejected';
    await b.save();
    try {
      const user = await User.findOne({ id: b.userId });
      if(user){
        user.notifications = user.notifications || [];
        user.notifications.push({ id:'u_notif_'+Date.now(), channel:'inapp', to:user.username, message:`Your booking #${b.id} has been rejected.`, createdAt:new Date().toISOString() });
        await user.save();
      }
    } catch {}
    return res.json({ success:true, booking: b });
  }
  const b = store.bookings.find(x=>x.id===id);
  if(!b) return res.status(404).json({ error: 'Not found' });
  b.status = 'rejected';
  b.updatedAt = new Date().toISOString();
  const user = store.users.find(u=>u.id===b.userId);
  if(user){
    user.notifications = user.notifications || [];
    user.notifications.push({ id:'u_notif_'+Date.now(), channel:'inapp', to:user.username, message:`Your booking #${b.id} has been rejected.`, createdAt:new Date().toISOString() });
  }
  saveStoreDebounced();
  res.json({ success:true, booking: b });
};
