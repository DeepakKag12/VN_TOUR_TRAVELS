import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import { ModelItem } from '../models/ModelItem.js';
import { isDbConnected } from '../config/db.js';

export const dashboardStats = async (_req,res) => {
  if(!isDbConnected()) return res.status(503).json({ error:'DB not connected' });
  const [bookingsCount, usersCount, modelsCount, pendingCount] = await Promise.all([
    Booking.countDocuments(),
    User.countDocuments(),
    ModelItem.countDocuments(),
    Booking.countDocuments({ status:'pending' })
  ]);
  // Revenue field: if you track revenue in bookings, sum finalPrice where approved
  const agg = await Booking.aggregate([
    { $match: { status:'approved' } },
    { $group: { _id:null, total: { $sum: '$finalPrice' } } }
  ]).catch(()=>[]);
  const revenue = agg[0]?.total || 0;
  res.json({ bookings: bookingsCount, users: usersCount, models: modelsCount, revenue, pendingBookings: pendingCount });
};

export const listUsers = async (_req,res) => {
  if(!isDbConnected()) return res.status(503).json({ error:'DB not connected' });
  const users = await User.find({}, { id:1, username:1, role:1, blocked:1 }).sort({ id:1 });
  res.json(users.map(u=>({ id:u.id, username:u.username, role:u.role, blocked: !!u.blocked })));
};

export const toggleUserBlock = async (req,res) => {
  if(!isDbConnected()) return res.status(503).json({ error:'DB not connected' });
  const id = parseInt(req.params.id);
  const u = await User.findOne({ id });
  if(!u) return res.status(404).json({ error:'Not found'});
  u.blocked = !u.blocked;
  await u.save();
  res.json({ success:true, user:{ id:u.id, username:u.username, blocked:u.blocked } });
};
