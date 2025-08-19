import { store } from '../models/store.js';
import { saveStoreDebounced } from '../services/persistence.js';

export const listNotifications = (req,res) => {
  const admin = store.users.find(u=>u.role==='admin');
  res.json((admin && admin.notifications) || []);
};

export const listMyNotifications = (req,res) => {
  const user = store.users.find(u=>u.id===req.user.id);
  res.json((user && user.notifications) || []);
};

export const clearNotifications = (req,res) => {
  const admin = store.users.find(u=>u.role==='admin');
  if(admin) { admin.notifications = []; saveStoreDebounced(); }
  res.json({ success:true });
};
