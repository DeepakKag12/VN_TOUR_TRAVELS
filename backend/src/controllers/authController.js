// In-memory store removed: MongoDB only
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { isDbConnected } from '../config/db.js'; // still used to guard but fallback removed
import { User } from '../models/User.js';

function publicUser(u){ return { id: u.id, username: u.username, email: u.email, role: u.role, emailVerified: u.emailVerified }; }

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change';

// Login now uses email (case-insensitive) + password
export const login = async (req, res) => {
  // Accept either 'email' or 'username' field (or both). Also allow a single input used in either field.
  const { email, username, password } = req.body;
  if(process.env.NODE_ENV !== 'production') {
    console.log('[LOGIN] Attempt', { email, username, hasPassword: !!password });
  }
  if(!password || (!email && !username)) return res.status(400).json({ error:'Email/username & password required' });
  const credential = (email || username || '').trim();
  let user = null;
  const useDb = isDbConnected();
  if(useDb){
    const lowered = credential.toLowerCase();
    // If it looks like an email (has @) try email first, else username first, then fallback to the other.
    if(credential.includes('@')){
      user = await User.findOne({ email: lowered });
      if(!user) user = await User.findOne({ username: credential });
    } else {
      user = await User.findOne({ username: credential });
      if(!user) user = await User.findOne({ email: lowered });
    }
    if(!user) return res.status(401).json({ error:'Invalid credentials' });
    let ok = await bcrypt.compare(password, user.passwordHash || '');
    if(!ok && user.role === 'admin') {
      // Optional legacy fallback for demo convenience (env LEGACY_ADMIN_PASSWORD or default 'admin123')
      const legacy = process.env.LEGACY_ADMIN_PASSWORD || 'admin123';
      if(password === legacy) {
        // Upgrade stored hash to legacy password for future logins
        user.passwordHash = await bcrypt.hash(password, 10);
        await user.save();
        ok = true;
        console.log('[AUTH] Admin logged in with legacy password; hash upgraded.');
      }
    }
    if(!ok) return res.status(401).json({ error:'Invalid credentials' });
  } else {
    return res.status(503).json({ error:'Database not connected' });
  }
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn:'2d' });
  res.cookie('sessionToken', token, { httpOnly:true, sameSite:'lax', maxAge: 1000*60*60*24*2 });
  res.json({ success:true, user: publicUser(user.toObject ? user.toObject() : user), token });
};

// Signup enforces unique email (case-insensitive). Username still accepted (optional) for display.
export const signup = async (req, res) => {
  let { username, password, email } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email & password required' });
  email = String(email).toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if(!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });
  const useDb = isDbConnected();
  if(useDb){
    const emailExists = await User.findOne({ email });
    if(emailExists) return res.status(409).json({ error:'Email already registered' });
    if(!username || !username.trim()){
      const base = email.split('@')[0].replace(/[^a-zA-Z0-9_]+/g,'').slice(0,20) || 'user';
      let candidate = base; let i=1;
      while(await User.findOne({ username: candidate })) { candidate = base + i; i++; }
      username = candidate;
    } else {
      if(await User.findOne({ username })) return res.status(409).json({ error:'Username already exists' });
    }
    const passwordHash = await bcrypt.hash(password,10);
    const nextId = await User.countDocuments() + 1; // simple incremental (not perfect for concurrency but acceptable here)
    const userDoc = await User.create({ id: nextId, username, email, passwordHash, role:'native', blocked:false, notifications:[] });
    const token = jwt.sign({ sub: userDoc.id, role: userDoc.role }, JWT_SECRET, { expiresIn: '2d' });
    res.cookie('sessionToken', token, { httpOnly:true, sameSite:'lax', maxAge: 1000*60*60*24*2 });
    return res.status(201).json({ success:true, user: publicUser(userDoc.toObject()), token });
  } else {
    return res.status(503).json({ error:'Database not connected' });
  }
};

export const me = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ user: publicUser(req.user) });
};

// Password reset request: generate token & expiry (in-memory store only for now)
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if(!email) return res.status(400).json({ error: 'Email required' });
  const useDb = isDbConnected();
  if(useDb){
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if(!user) return res.json({ success:true });
    user.passwordResetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetExpires = Date.now() + 1000*60*30;
    await user.save();
    return res.json({ success:true, resetToken: user.passwordResetToken });
  } else { return res.status(503).json({ error:'Database not connected' }); }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if(!token || !password) return res.status(400).json({ error: 'Token & password required' });
  const useDb = isDbConnected();
  if(useDb){
    const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
    if(!user) return res.status(400).json({ error:'Invalid or expired token' });
    user.passwordHash = await bcrypt.hash(password,10);
    user.passwordResetToken = undefined; user.passwordResetExpires = undefined;
    await user.save();
    return res.json({ success:true });
  } else { return res.status(503).json({ error:'Database not connected' }); }
};

// Email verification (dev-mode: immediate token issuance, pretend email sent)
export const sendEmailVerification = async (req, res) => {
  const { email } = req.body;
  if(!email) return res.status(400).json({ error: 'Email required' });
  const useDb = isDbConnected();
  if(useDb){
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if(!user) return res.status(404).json({ error:'User not found' });
    if(user.emailVerified) return res.json({ success:true, alreadyVerified:true });
    user.emailVerifyToken = crypto.randomBytes(16).toString('hex');
    await user.save();
    return res.json({ success:true, verifyToken:user.emailVerifyToken });
  } else { return res.status(503).json({ error:'Database not connected' }); }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;
  if(!token) return res.status(400).json({ error: 'Token required' });
  const useDb = isDbConnected();
  if(useDb){
    const user = await User.findOne({ emailVerifyToken: token });
    if(!user) return res.status(400).json({ error:'Invalid token' });
    user.emailVerified = true; user.emailVerifyToken = undefined;
    await user.save();
    return res.json({ success:true });
  } else { return res.status(503).json({ error:'Database not connected' }); }
};
