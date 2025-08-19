import { store } from '../models/store.js';
import { saveStoreDebounced } from '../services/persistence.js';
import { uploadBuffer } from '../services/cloudinary.js';
import sharp from 'sharp';
import mongoose from 'mongoose';
import { ModelItem } from '../models/ModelItem.js';
import { getNextSeq } from '../services/sequence.js';

// Acceptable formats: HH:mm (24h) or h:mm AM/PM
function normalizeTime(t){
  if(!t) return '';
  const raw = String(t).trim();
  const twentyFour = /^(\d{2}):(\d{2})$/; // 00-23:00-59
  const ampm = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
  if(twentyFour.test(raw)){
    const [,hh,mm] = raw.match(twentyFour);
    const h = parseInt(hh,10); const m = parseInt(mm,10);
    if(h>23||m>59) return null;
    return `${hh}:${mm}`;
  }
  if(ampm.test(raw)){
    let [,h,mm,ap] = raw.match(ampm); h=parseInt(h,10); const m=parseInt(mm,10); if(h<1||h>12||m>59) return null; ap=ap.toUpperCase();
    if(h===12) h= ap==='AM'?0:12; else if(ap==='PM') h+=12; const hh = h.toString().padStart(2,'0'); return `${hh}:${mm}`;
  }
  return null; // invalid
}

export const listModels = async (req, res) => {
  const { q, type } = req.query;
  const useMongo = mongoose.connection.readyState === 1;
  if(useMongo){
    const filter = {};
    if(type) filter.type = type;
    if(q){
      const term = String(q);
      filter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { origin: { $regex: term, $options: 'i' } },
        { destination: { $regex: term, $options: 'i' } },
        { itinerary: { $regex: term, $options: 'i' } }
      ];
    }
    const docs = await ModelItem.find(filter).sort({ createdAt: -1 });
    // Ensure every document has a numeric nid; if missing, assign now (migration safety)
    const updates = [];
    for(const doc of docs){
      if(doc.nid === undefined || doc.nid === null){
        doc.nid = await getNextSeq('models');
        updates.push(doc.save());
      }
    }
    if(updates.length){
      try { await Promise.all(updates); } catch(e){ console.warn('[listModels] nid assignment batch failed', e.message); }
    }
    res.json(docs.map(d=>{ const obj = d.toObject(); return { ...obj, id: obj.nid }; }));
  } else {
    let results = [...store.models];
    if (type) results = results.filter(m => m.type === type);
    if (q) {
      const term = String(q).toLowerCase();
      results = results.filter(m => [m.name, m.description, m.origin, m.destination, (m.itinerary||'')].some(v => v && v.toLowerCase().includes(term)));
    }
    res.json(results);
  }
};

export const getModel = async (req, res) => {
  const id = parseInt(req.params.id);
  const useMongo = mongoose.connection.readyState === 1;
  if(Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  if(useMongo){
    // Try nid first, then legacy id field if any
    const doc = await ModelItem.findOne({ $or: [ { nid: id }, { id } ] }).lean();
    if(!doc) return res.status(404).json({ error:'Not found' });
    return res.json({ ...doc, id: doc.nid || doc.id || id });
  } else {
    const model = store.models.find(m => m.id === id);
    if (!model){
      console.warn('[getModel] not found id', id, 'existing ids:', store.models.map(m=>m.id));
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(model);
  }
};

export const getModelAvailability = (req,res) => {
  const id = parseInt(req.params.id);
  const bookings = store.bookings.filter(b=>b.modelId===id && b.status!=='rejected');
  // Collect booked date (start date) and optional range via extras.checkOut
  const dates = [];
  bookings.forEach(b => {
    if (!b.date) return;
    const start = new Date(b.date);
    const endDate = b.extras?.checkOut ? new Date(b.extras.checkOut) : start;
    for(let d=new Date(start); d<=endDate; d.setDate(d.getDate()+1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
  });
  res.json({ bookedDates: Array.from(new Set(dates)) });
};

export const createModel = async (req, res) => {
  const { name, description, price, type, image, details, origin, destination, stops, itinerary, departureTime, arrivalTime } = req.body;
  try {
    const allowedTypes = ['tour','bus'];
  if(!name || !description || price===undefined || price==='') return res.status(400).json({ error:'Missing required fields (name, description, price, type)' });
    if(!allowedTypes.includes(type)) return res.status(400).json({ error:'Invalid type'});
    const numPrice = Number(price);
    if(isNaN(numPrice) || numPrice < 0) return res.status(400).json({ error:'Invalid price' });
  console.log('[createModel] incoming', { name, type, price:numPrice, hasFile: !!req.file });
    const depNorm = departureTime ? normalizeTime(departureTime) : '';
    const arrNorm = arrivalTime ? normalizeTime(arrivalTime) : '';
    if(departureTime && depNorm===null) return res.status(400).json({ error:'Invalid departureTime format. Use HH:mm or h:mm AM/PM'});
    if(arrivalTime && arrNorm===null) return res.status(400).json({ error:'Invalid arrivalTime format. Use HH:mm or h:mm AM/PM'});
    let imageUrl = image || '';
    if (req.file) {
      try {
        const meta = await sharp(req.file.buffer).metadata();
        if(meta.width > 4000 || meta.height > 4000){
          return res.status(400).json({ error: 'Image dimensions too large (max 4000x4000)' });
        }
        const uploaded = await uploadBuffer(req.file.buffer, 'vn_travel_listings');
        imageUrl = uploaded.secure_url;
      } catch (imgErr) {
        console.warn('[createModel] image processing/upload failed:', imgErr.message);
      }
    }
    const parsedStops = typeof stops === 'string' ? stops.split(',').map(s=>s.trim()).filter(Boolean) : Array.isArray(stops)? stops : [];
    const useMongo = mongoose.connection.readyState === 1;
    if(useMongo){
      const nid = await getNextSeq('models');
      const doc = await ModelItem.create({ name, description, price: numPrice, type, image: imageUrl, details, origin, destination, stops: parsedStops, itinerary, departureTime: depNorm, arrivalTime: arrNorm, nid });
      return res.json({ success:true, model: { ...doc.toObject(), id: nid } });
    } else {
      const nextId = store.models.reduce((max,m)=> m.id>max? m.id:max, 0) + 1;
      const newModel = { id: nextId, name, description, price: numPrice, type, image: imageUrl, details, origin, destination, stops: parsedStops, itinerary, departureTime: depNorm, arrivalTime: arrNorm };
      store.models.push(newModel);
      saveStoreDebounced();
      res.json({ success:true, model: newModel });
    }
  } catch(e){
    console.error('[createModel] failed', e);
    res.status(500).json({ error: e.message || 'Failed to create listing' });
  }
};

export const updateModel = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const useMongo = mongoose.connection.readyState === 1;
    if(useMongo){
      const doc = await ModelItem.findOne({ nid:id });
      if(!doc) return res.status(404).json({ error:'Model not found' });
      if(req.body.type){ const allowedTypes = ['tour','bus']; if(!allowedTypes.includes(req.body.type)) return res.status(400).json({ error:'Invalid type'}); }
      let imageUrl = req.body.image ?? doc.image;
      const { departureTime, arrivalTime } = req.body;
      let depNorm = doc.departureTime;
      let arrNorm = doc.arrivalTime;
      if(departureTime!==undefined){ depNorm = departureTime? normalizeTime(departureTime):''; if(departureTime && depNorm===null) return res.status(400).json({ error:'Invalid departureTime format. Use HH:mm or h:mm AM/PM'}); }
      if(arrivalTime!==undefined){ arrNorm = arrivalTime? normalizeTime(arrivalTime):''; if(arrivalTime && arrNorm===null) return res.status(400).json({ error:'Invalid arrivalTime format. Use HH:mm or h:mm AM/PM'}); }
      if (req.file) { const uploaded = await uploadBuffer(req.file.buffer, 'vn_travel_listings'); imageUrl = uploaded.secure_url; }
      const parsedStops = req.body.stops ? (typeof req.body.stops === 'string' ? req.body.stops.split(',').map(s=>s.trim()).filter(Boolean) : req.body.stops) : doc.stops;
      const { id: _ignoredId, nid: _nignored, ...rest } = req.body;
      Object.assign(doc, rest, { image: imageUrl, departureTime: depNorm, arrivalTime: arrNorm, stops: parsedStops });
      if(rest.price!==undefined) doc.price = Number(rest.price);
      await doc.save();
      return res.json({ success:true, model: { ...doc.toObject(), id: doc.nid } });
    }
    const idx = store.models.findIndex(m => m.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Model not found' });
  if(req.body.type){ const allowedTypes = ['tour','bus']; if(!allowedTypes.includes(req.body.type)) return res.status(400).json({ error:'Invalid type'}); }
  let imageUrl = req.body.image ?? store.models[idx].image;
  const { departureTime, arrivalTime } = req.body;
  let depNorm = store.models[idx].departureTime;
  let arrNorm = store.models[idx].arrivalTime;
  if(departureTime!==undefined){ depNorm = departureTime? normalizeTime(departureTime):''; if(departureTime && depNorm===null) return res.status(400).json({ error:'Invalid departureTime format. Use HH:mm or h:mm AM/PM'}); }
  if(arrivalTime!==undefined){ arrNorm = arrivalTime? normalizeTime(arrivalTime):''; if(arrivalTime && arrNorm===null) return res.status(400).json({ error:'Invalid arrivalTime format. Use HH:mm or h:mm AM/PM'}); }
    if (req.file) {
      const meta = await sharp(req.file.buffer).metadata();
      if(meta.width > 4000 || meta.height > 4000){
        return res.status(400).json({ error: 'Image dimensions too large (max 4000x4000)' });
      }
      const uploaded = await uploadBuffer(req.file.buffer, 'vn_travel_listings');
      imageUrl = uploaded.secure_url;
    }
  const parsedStops = req.body.stops ? (typeof req.body.stops === 'string' ? req.body.stops.split(',').map(s=>s.trim()).filter(Boolean) : req.body.stops) : store.models[idx].stops;
  const currentId = store.models[idx].id; // preserve numeric id
  const { id: _ignoredId, ...rest } = req.body;
  store.models[idx] = { ...store.models[idx], ...rest, id: currentId, departureTime: depNorm, arrivalTime: arrNorm, stops: parsedStops, price: Number(req.body.price ?? store.models[idx].price), image: imageUrl };
    saveStoreDebounced();
    res.json({ success: true, model: store.models[idx] });
  } catch (e) {
  console.error('[updateModel] failed', e);
  res.status(500).json({ error: e.message || 'Update failed' });
  }
};

// upload middleware now provided centrally in middleware/upload.js

export const deleteModel = async (req, res) => {
  const id = parseInt(req.params.id);
  const useMongo = mongoose.connection.readyState === 1;
  if(useMongo){
    const doc = await ModelItem.findOneAndDelete({ nid: id });
    if(!doc) return res.status(404).json({ error:'Model not found' });
    return res.json({ success:true });
  } else {
    const idx = store.models.findIndex(m => m.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Model not found' });
    store.models.splice(idx, 1);
    saveStoreDebounced();
    res.json({ success: true });
  }
};
