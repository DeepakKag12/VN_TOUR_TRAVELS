import { store } from '../models/store.js';

export const getProfile = (req,res)=>{
  const u = req.user;
  res.json({ id:u.id, username:u.username, role:u.role, email:u.email||'', phone:u.phone||'', preferences:u.preferences||{} });
};

export const updateProfile = (req,res)=>{
  const u = req.user;
  const { email, phone, preferences } = req.body;
  if (email!==undefined) u.email = email;
  if (phone!==undefined) u.phone = phone;
  if (preferences!==undefined) u.preferences = preferences;
  res.json({ success:true, profile: { id:u.id, username:u.username, role:u.role, email:u.email, phone:u.phone, preferences:u.preferences } });
};
