import { store } from '../models/store.js';
import { saveStoreDebounced } from '../services/persistence.js';
import { isDbConnected } from '../config/db.js';
import { Settings } from '../models/Settings.js';

function sanitizePhone(p){ return String(p||'').replace(/[^+\d\s-]/g,'').trim(); }

export const getSettings = async (_req,res) => {
  try {
    if(isDbConnected()){
      let doc = await Settings.findById('site');
      if(!doc){ doc = await Settings.create({ _id:'site' }); }
      else {
        let changed = false;
        if(!doc.phone || /00000/.test(doc.phone)) { doc.phone = '+91 91098 79836'; changed = true; }
        if((!doc.phones || doc.phones.length===0)) { doc.phones = ['+91 99938 83995']; changed = true; }
        if(doc.address === 'Your Address Here' || !doc.address) { doc.address = 'Scheme No 71, Gumasta Nagar, Indore (M.P.)'; changed = true; }
        if(changed) await doc.save();
      }
      return res.json(doc);
    }
    res.json(store.siteSettings);
  } catch(e){
    console.error('[getSettings] failed', e);
    res.status(500).json({ error:'Failed to load settings', details: e.message });
  }
};

export const updateSettings = async (req,res) => {
  const allowed = ['companyName','phone','phones','whatsapp','instagram','email','address','supportHours'];
  const body = req.body || {};
  const updates = {};
  for(const k of allowed){
    if(body[k] !== undefined){
      let val = body[k];
      if(k === 'email'){
        val = String(val).trim().toLowerCase();
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(val && !emailRe.test(val)) return res.status(400).json({ error:'Invalid email' });
      }
      if(k === 'phone') val = sanitizePhone(val);
      if(k === 'phones'){
        if(Array.isArray(val)) val = val.map(sanitizePhone).filter(Boolean);
        else if(typeof val === 'string') val = val.split(',').map(sanitizePhone).filter(Boolean);
        else val = [];
      }
      if(k === 'whatsapp') val = sanitizePhone(val);
      if(k === 'instagram'){
        val = String(val).trim();
        if(val.startsWith('@')) val = val.slice(1);
        val = val.replace(/[^A-Za-z0-9._]/g,'');
      }
      if(typeof val === 'string') val = val.trim();
      updates[k] = val;
    }
  }
  if(isDbConnected()){
    const doc = await Settings.findByIdAndUpdate('site', { $set: { ...updates, updatedBy: req.user?.id } }, { new:true, upsert:true, setDefaultsOnInsert:true });
    return res.json({ success:true, settings: doc });
  }
  Object.assign(store.siteSettings, updates);
  saveStoreDebounced();
  res.json({ success:true, settings: store.siteSettings });
};
