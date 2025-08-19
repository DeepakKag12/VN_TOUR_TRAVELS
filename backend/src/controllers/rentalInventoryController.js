import mongoose from 'mongoose';
import sharp from 'sharp';
import { RentalItem } from '../models/RentalItem.js';
import { getNextSeq } from '../services/sequence.js';
import { uploadBuffer } from '../services/cloudinary.js';

export const listRentalItems = async (req,res) => {
  try {
    if(mongoose.connection.readyState!==1) return res.json([]);
    const { category, q } = req.query;
    const filter = {};
    if(category) filter.category = category;
    if(q){ const term = String(q); filter.$or = [ { name:{ $regex:term,$options:'i'} }, { description:{ $regex:term,$options:'i'} } ]; }
    const docs = await RentalItem.find(filter).sort({ createdAt:-1 });
    res.json(docs.map(d=>({ ...d.toObject(), id: d.nid })));
  } catch(e){
    console.error('[listRentalItems] failed', e);
    res.status(500).json({ error:'Failed to load rental items', details:e.message });
  }
};

export const getRentalItem = async (req,res) => {
  const id = parseInt(req.params.id); if(Number.isNaN(id)) return res.status(400).json({ error:'Invalid id'});
  if(mongoose.connection.readyState!==1) return res.status(404).json({ error:'Not found'});
  const doc = await RentalItem.findOne({ nid:id }); if(!doc) return res.status(404).json({ error:'Not found'});
  res.json({ ...doc.toObject(), id: doc.nid });
};

export const createRentalItem = async (req,res) => {
  if(mongoose.connection.readyState!==1) return res.status(503).json({ error:'DB not ready'});
  const { name, category, description, pricePerDay, amenities } = req.body;
  if(!name || !category || pricePerDay===undefined) return res.status(400).json({ error:'Missing required fields' });
  const num = Number(pricePerDay); if(isNaN(num)||num<0) return res.status(400).json({ error:'Invalid price'});
  let imageUrl = req.body.image || '';
  if(req.file){ const meta = await sharp(req.file.buffer).metadata(); if(meta.width>4000||meta.height>4000) return res.status(400).json({ error:'Image too large'}); const up = await uploadBuffer(req.file.buffer,'vn_travel_rentals'); imageUrl = up.secure_url; }
  const nid = await getNextSeq('rentalItems');
  const item = await RentalItem.create({ nid, name, category, description, pricePerDay:num, image:imageUrl, amenities: parseList(amenities) });
  res.json({ success:true, item: { ...item.toObject(), id: nid } });
};

export const updateRentalItem = async (req,res) => {
  const id = parseInt(req.params.id); if(Number.isNaN(id)) return res.status(400).json({ error:'Invalid id'});
  const doc = await RentalItem.findOne({ nid:id }); if(!doc) return res.status(404).json({ error:'Not found'});
  const { name, category, description, pricePerDay, amenities, available } = req.body;
  if(name!==undefined) doc.name = name;
  if(category!==undefined) doc.category = category;
  if(description!==undefined) doc.description = description;
  if(pricePerDay!==undefined){ const num=Number(pricePerDay); if(isNaN(num)||num<0) return res.status(400).json({ error:'Invalid price'}); doc.pricePerDay = num; }
  if(amenities!==undefined) doc.amenities = parseList(amenities);
  if(available!==undefined) doc.available = !!available;
  if(req.file){ const up = await uploadBuffer(req.file.buffer,'vn_travel_rentals'); doc.image = up.secure_url; }
  await doc.save();
  res.json({ success:true, item:{ ...doc.toObject(), id: doc.nid } });
};

export const deleteRentalItem = async (req,res) => {
  const id = parseInt(req.params.id); if(Number.isNaN(id)) return res.status(400).json({ error:'Invalid id'});
  const doc = await RentalItem.findOneAndDelete({ nid:id }); if(!doc) return res.status(404).json({ error:'Not found'});
  res.json({ success:true });
};

function parseList(v){ if(!v) return []; if(Array.isArray(v)) return v; if(typeof v==='string') return v.split(',').map(s=>s.trim()).filter(Boolean); return []; }
