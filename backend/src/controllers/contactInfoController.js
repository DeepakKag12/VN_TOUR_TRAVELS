import { ContactInfo } from '../models/ContactInfo.js';
import { isDbConnected } from '../config/db.js';
import { store } from '../models/store.js';

function cleanPhone(p){ return String(p||'').replace(/[^+\d\s-]/g,'').trim(); }

export const getContactInfo = async (_req,res) => {
  if(isDbConnected()){
    let doc = await ContactInfo.findById('primary');
    if(!doc) doc = await ContactInfo.create({ _id:'primary' });
    // Auto-heal placeholder values if they still exist
    let changed = false;
    const desiredPrimary = '+91 91098 79836';
    const desiredSecondary = '+91 99938 83995';
    const desiredAddress = 'Scheme No 71, Gumasta Nagar, Indore (M.P.)';
    if(!doc.phonePrimary || /00000/.test(doc.phonePrimary)) { doc.phonePrimary = desiredPrimary; changed = true; }
    if((!doc.phoneSecondary || doc.phoneSecondary.trim()==='') && (!doc.phones || doc.phones.length===0)) { doc.phoneSecondary = desiredSecondary; changed = true; }
    if(doc.address === 'Your Address Here' || !doc.address) { doc.address = desiredAddress; changed = true; }
    if(changed) {
      if(!doc.phones || doc.phones.length===0) doc.phones = [desiredSecondary];
      await doc.save();
    }
    return res.json(doc);
  }
  return res.json(store.siteSettings); // reuse in-memory settings
};

export const updateContactInfo = async (req,res) => {
  const allowed = ['companyName','email','phonePrimary','phoneSecondary','phones','whatsapp','instagram','address','supportHours'];
  const body = req.body || {};
  const updates = {};
  for(const k of allowed){
    if(body[k] !== undefined){
      let val = body[k];
      if(['phonePrimary','phoneSecondary','whatsapp'].includes(k)) val = cleanPhone(val);
      if(k==='phones'){
        if(Array.isArray(val)) val = val.map(cleanPhone).filter(Boolean);
        else if(typeof val==='string') val = val.split(/[\n,]+/).map(cleanPhone).filter(Boolean);
        else val = [];
      }
      if(k==='instagram'){
        val = String(val||'').trim();
        if(val.startsWith('@')) val = val.slice(1);
        val = val.replace(/[^A-Za-z0-9._]/g,'');
      }
      if(k==='email'){
        val = String(val||'').trim().toLowerCase();
        const re=/^[^\s@]+@[^\s@]+\.[^\s@]+$/; if(val && !re.test(val)) return res.status(400).json({ error:'Invalid email' });
      }
      updates[k] = typeof val==='string'? val.trim(): val;
    }
  }
  if(isDbConnected()){
    const doc = await ContactInfo.findByIdAndUpdate('primary',{ $set: { ...updates, updatedBy: req.user?.id } }, { new:true, upsert:true, setDefaultsOnInsert:true });
    return res.json({ success:true, contactInfo: doc });
  }
  Object.assign(store.siteSettings, updates);
  return res.json({ success:true, contactInfo: store.siteSettings });
};
