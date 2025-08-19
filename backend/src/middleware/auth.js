import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change';

export const requireAuth = (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.substring(7);
  else if (req.cookies && req.cookies.sessionToken) token = req.cookies.sessionToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Fetch from Mongo
    User.findOne({ id: payload.sub }).then(user => {
      if(!user) return res.status(401).json({ error:'Unauthorized' });
      if(user.blocked) return res.status(403).json({ error:'User blocked' });
      req.user = user;
      next();
    }).catch(()=> res.status(401).json({ error:'Unauthorized' }));
    return;
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = role => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
  next();
};
