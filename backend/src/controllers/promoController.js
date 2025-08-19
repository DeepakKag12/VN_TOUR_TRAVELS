import { store } from '../models/store.js';
import { saveStoreDebounced } from '../services/persistence.js';
import { isDbConnected } from '../config/db.js';
import { Promo } from '../models/Promo.js';

export const listPromos = async (_req,res) => {
  if(isDbConnected()){
    const promos = await Promo.find().sort({ code:1 });
    return res.json(promos);
  }
  res.json(store.promos);
};

export const createPromo = async (req,res) => {
  const { code, type, value } = req.body;
  if(!code||!type||value==null) return res.status(400).json({ error:'code,type,value required'});
  if(!['percent','flat'].includes(type)) return res.status(400).json({ error:'type must be percent|flat' });
  const valNum = Number(value);
  if(isNaN(valNum) || valNum <= 0) return res.status(400).json({ error:'value must be positive number' });
  if(isDbConnected()){
    const exists = await Promo.findOne({ code });
    if(exists) return res.status(409).json({ error:'Code exists'});
    const promo = await Promo.create({ code, type, value: valNum, active:true });
    return res.json({ success:true, promo });
  }
  if(store.promos.some(p=>p.code===code)) return res.status(409).json({ error:'Code exists'});
  const promo = { code, type, value: valNum, active:true };
  store.promos.push(promo);
  saveStoreDebounced();
  res.json({ success:true, promo });
};

export const togglePromo = async (req,res) => {
  const { code } = req.params;
  if(isDbConnected()){
    const promo = await Promo.findOne({ code });
    if(!promo) return res.status(404).json({ error:'Not found'});
    promo.active = !promo.active;
    await promo.save();
    return res.json({ success:true, promo });
  }
  const p = store.promos.find(x=>x.code===code);
  if(!p) return res.status(404).json({ error:'Not found'});
  p.active = !p.active;
  saveStoreDebounced();
  res.json({ success:true, promo:p });
};
