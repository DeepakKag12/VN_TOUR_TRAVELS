import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import modelRoutes from './routes/modelRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import contactInfoRoutes from './routes/contactInfoRoutes.js';
import session from 'express-session';
import passport from './config/passport.js';
import rentalRoutes from './routes/rentalRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import promoRoutes from './routes/promoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import rentalInventoryRoutes from './routes/rentalInventoryRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import { loadStoreIfExists } from './services/persistence.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { ModelItem } from './models/ModelItem.js';
import { getNextSeq } from './services/sequence.js';
import bcrypt from 'bcrypt';
import { requireAuth } from './middleware/auth.js';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Basic rate limiting (adjust as needed)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false });
app.use(limiter);
// Attempt DB connection; if missing MONGO_URI fallback to JSON persistence
let dbMode = 'memory';
const boot = async () => {
  const connected = await connectDB();
  if (!connected) {
    loadStoreIfExists();
    console.log('[BOOT] Using in-memory + file persistence (Mongo not connected)');
  } else {
    dbMode = 'mongo';
    console.log('[BOOT] Running with MongoDB storage');
    // Seed or update admin user from .env on every boot
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vntravels.local';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@123';
    let existingAdmin = await User.findOne({ role: 'admin' });
    const passwordHash = await bcrypt.hash(adminPass, 10);
    if(!existingAdmin){
      const count = await User.countDocuments();
      await User.create({ id: count+1, username: adminUsername, email: adminEmail.toLowerCase(), passwordHash, role: 'admin', emailVerified: true });
      console.log(`[SEED] Admin user created -> email: ${adminEmail} password: ${adminPass}`);
    } else {
      existingAdmin.email = adminEmail.toLowerCase();
      existingAdmin.username = adminUsername;
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.emailVerified = true;
      await existingAdmin.save();
      console.log(`[SEED] Admin user updated -> email: ${adminEmail} password: ${adminPass}`);
    }

    // Lightweight migration: ensure all ModelItem docs have a numeric nid for compatibility
    const withoutNid = await ModelItem.find({ $or: [ { nid: { $exists: false } }, { nid: null } ] }).limit(500);
    if(withoutNid.length){
      console.log(`[MIGRATE] Assigning nid to ${withoutNid.length} existing model items`);
      for(const doc of withoutNid){
        try {
          doc.nid = await getNextSeq('models');
          await doc.save();
        } catch(e){
          console.warn('[MIGRATE] Failed to set nid on model', doc._id.toString(), e.message);
        }
      }
    }
  }
};
await boot();
const PORT = process.env.PORT || 5000;

// CORS - tighten if frontend origin known via env FRONTEND_ORIGIN
const allowedOrigin = process.env.FRONTEND_ORIGIN || true; // true => reflect request origin
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET || 'dev_session_secret', resave:false, saveUninitialized:false }));
app.use(passport.initialize());
app.use(passport.session());

// Public routes
app.get('/', (_req, res) => res.json({ status: 'OK', service: 'VN Tour Travels API', mode: dbMode }));
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes); // submissions
app.use('/api/contact-info', contactInfoRoutes); // public GET / admin PUT
// Public read-only access for listings, reviews, promos, settings
// (mutations still protected inside individual route files via requireAuth/requireRole)
app.use('/api/models', modelRoutes); // create/update/delete guarded in router
app.use('/api/reviews', reviewRoutes); // POST guarded inside router
app.use('/api/promos', promoRoutes);   // POSTs guarded
app.use('/api/settings', settingsRoutes); // PUT guarded
app.use('/api/rental-items', rentalInventoryRoutes); // admin mutations guarded inside
app.use('/api/hotels', hotelRoutes); // admin mutations guarded inside

// Protected routes (attach auth explicitly)
app.use('/api/bookings', bookingRoutes); // internal routes guard POSTs
app.use('/api/rentals', rentalRoutes);   // list (admin) protected inside router
app.use('/api/profile', requireAuth, profileRoutes);
app.use('/api/admin', requireAuth, adminRoutes);
app.use('/api/notifications', requireAuth, notificationRoutes);

// Health & route summary (diagnostics)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    server: 'modern',
    mode: dbMode,
    time: new Date().toISOString(),
    sampleRoutes: [
      'GET /api/health',
      'POST /api/auth/login',
      'GET /api/models',
      'POST /api/bookings',
      'POST /api/bookings/:id/cancel',
      'GET /api/hotels/:id/availability'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server Error' });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
