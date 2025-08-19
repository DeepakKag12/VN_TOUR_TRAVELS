import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ id });
    done(null, user || false);
  } catch(e){ done(e); }
});

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if(!user) return done(null, false, { message:'Incorrect username' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if(!ok) return done(null, false, { message:'Incorrect password' });
    return done(null, user);
  } catch(e){ return done(e); }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
  callbackURL: '/api/auth/google/callback'
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if(!user){
      const count = await User.countDocuments();
      user = await User.create({ id: count+1, username: profile.displayName || profile.emails?.[0]?.value || ('user'+Date.now()), role:'native', googleId: profile.id });
    }
    done(null, user);
  } catch(e){ done(e); }
}));

export default passport;
