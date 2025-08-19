import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[DB] No MONGO_URI provided. Running in in-memory fallback mode.');
    return false;
  }
  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log('[DB] MongoDB connected');
    return true;
  } catch (e) {
    console.error('[DB] Mongo connection failed:', e.message);
    return false;
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}
