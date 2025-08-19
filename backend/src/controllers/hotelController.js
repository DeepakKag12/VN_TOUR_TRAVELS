import mongoose from 'mongoose';
import sharp from 'sharp';
import { Hotel } from '../models/Hotel.js';
import { getNextSeq } from '../services/sequence.js';
import { uploadBuffer } from '../services/cloudinary.js';

export const listHotels = async (req,res)=> {
  if(mongoose.connection.readyState!==1) return res.json([]);
  const { city, q } = req.query;
  const filter = {};
  if(city) filter.city = city;
  if(q){ const term = String(q); filter.$or = [ { name:{ $regex:term,$options:'i'} }, { description:{ $regex:term,$options:'i'} }, { city:{ $regex:term,$options:'i'} } ]; }
  const docs = await Hotel.find(filter).sort({ createdAt:-1 });
  res.json(docs.map(d=>({ ...d.toObject(), id: d.nid })));
};

export const getHotel = async (req,res)=> {
  const id = parseInt(req.params.id); if(Number.isNaN(id)) return res.status(400).json({ error:'Invalid id'});
  if(mongoose.connection.readyState!==1) return res.status(404).json({ error:'Not found'});
  const doc = await Hotel.findOne({ nid:id }); if(!doc) return res.status(404).json({ error:'Not found'});
  res.json({ ...doc.toObject(), id: doc.nid });
};

export const createHotel = async (req,res)=> {
  if(mongoose.connection.readyState!==1) return res.status(503).json({ error:'DB not ready'});
  const { name, city, description, pricePerNight, amenities } = req.body;
  if(!name || pricePerNight===undefined) return res.status(400).json({ error:'Missing required fields'});
  const num = Number(pricePerNight); if(isNaN(num)||num<0) return res.status(400).json({ error:'Invalid price'});
  let imageUrl = req.body.image || '';
  if(req.file){ const meta = await sharp(req.file.buffer).metadata(); if(meta.width>4000||meta.height>4000) return res.status(400).json({ error:'Image too large'}); const up = await uploadBuffer(req.file.buffer,'vn_travel_hotels'); imageUrl = up.secure_url; }
  const nid = await getNextSeq('hotels');
  const doc = await Hotel.create({ nid, name, city, description, pricePerNight:num, image:imageUrl, amenities: parseList(amenities) });
  res.json({ success:true, hotel:{ ...doc.toObject(), id: nid } });
};

export const updateHotel = async (req,res)=> {
  const id = parseInt(req.params.id); if(Number.isNaN(id)) return res.status(400).json({ error:'Invalid id'});
  const doc = await Hotel.findOne({ nid:id }); if(!doc) return res.status(404).json({ error:'Not found'});
  const { name, city, description, pricePerNight, amenities, available } = req.body;
  if(name!==undefined) doc.name = name;
  if(city!==undefined) doc.city = city;
  if(description!==undefined) doc.description = description;
  if(pricePerNight!==undefined){ const num=Number(pricePerNight); if(isNaN(num)||num<0) return res.status(400).json({ error:'Invalid price'}); doc.pricePerNight = num; }
  if(amenities!==undefined) doc.amenities = parseList(amenities);
  if(available!==undefined) doc.available = !!available;
  if(req.file){ const up = await uploadBuffer(req.file.buffer,'vn_travel_hotels'); doc.image = up.secure_url; }
  await doc.save();
  res.json({ success:true, hotel:{ ...doc.toObject(), id: doc.nid } });
};

export const deleteHotel = async (req,res)=> {
  const id = parseInt(req.params.id); if(Number.isNaN(id)) return res.status(400).json({ error:'Invalid id'});
  const doc = await Hotel.findOneAndDelete({ nid:id }); if(!doc) return res.status(404).json({ error:'Not found'});
  res.json({ success:true });
};

function parseList(v){ if(!v) return []; if(Array.isArray(v)) return v; if(typeof v==='string') return v.split(',').map(s=>s.trim()).filter(Boolean); return []; }

// Hotel availability (booked dates inclusive of stay range)
export const getHotelAvailability = async (req,res)=> {
  const id = parseInt(req.params.id); if(Number.isNaN(id)) return res.status(400).json({ error:'Invalid id'});
  if(mongoose.connection.readyState!==1) return res.json({ bookedDates: [] });
  const { Booking } = await import('../models/Booking.js');
  const bookings = await Booking.find({ hotelId:id, status:{ $ne:'rejected' } }).lean();
  const dates = new Set();
  bookings.forEach(b => {
    if(!b.date) return;
    const start = new Date(b.date);
    const endStr = b.extras?.checkOut;
    const end = endStr ? new Date(endStr) : start;
    for(let d=new Date(start); d<=end; d.setDate(d.getDate()+1)){
      dates.add(d.toISOString().split('T')[0]);
    }
  });
  res.json({ bookedDates: Array.from(dates) });
};
