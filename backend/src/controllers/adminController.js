import { store } from '../models/store.js';
import { saveStoreDebounced } from '../services/persistence.js';

export const dashboardStats = (_req,res) => {
  res.json({
    bookings: store.analytics.bookingCount,
    users: store.users.length,
    models: store.models.length,
    revenue: store.analytics.revenue,
    pendingBookings: store.bookings.filter(b=>b.status==='pending').length
  });
};

export const listUsers = (_req,res) => {
  res.json(store.users.map(u=>({ id:u.id, username:u.username, role:u.role, blocked:!!u.blocked }))); }

export const toggleUserBlock = (req,res) => {
  const id = parseInt(req.params.id);
  const u = store.users.find(x=>x.id===id); if(!u) return res.status(404).json({ error:'Not found'});
  u.blocked = !u.blocked; saveStoreDebounced(); res.json({ success:true, user:{ id:u.id, username:u.username, blocked:u.blocked } });
};
