import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import { store } from '../models/store.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = store.users.find(u => u.id === id);
  done(null, user || false);
});

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = store.users.find(u => u.username === username);
    if (!user) return done(null, false, { message: 'Incorrect username' });
    if (!user.passwordHash) {
      // legacy plain password fallback
      if (user.password !== password) return done(null, false, { message: 'Incorrect password' });
      return done(null, user);
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return done(null, false, { message: 'Incorrect password' });
    return done(null, user);
  } catch (e) { return done(e); }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
  callbackURL: '/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  try {
    let user = store.users.find(u => u.googleId === profile.id);
    if (!user) {
      user = { id: store.users.length + 1, username: profile.displayName || profile.emails?.[0]?.value || 'user'+Date.now(), role: 'native', googleId: profile.id };
      store.users.push(user);
    }
    done(null, user);
  } catch (e) { done(e); }
}));

export default passport;
