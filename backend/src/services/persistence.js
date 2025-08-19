import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from '../models/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '../../data-store.json');
let writeTimer = null;

export function saveStoreDebounced(){
  if(writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(()=>{
    try {
      fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
    } catch(e){
      console.error('Persist failed', e.message);
    }
  }, 200);
}

export function loadStoreIfExists(){
  try {
    if (fs.existsSync(DATA_PATH)) {
      const raw = JSON.parse(fs.readFileSync(DATA_PATH,'utf-8'));
      // Shallow merge arrays if they exist
      ['users','models','bookings','contacts','rentals','promos','reviews'].forEach(k=>{ if(raw[k]) store[k] = raw[k]; });
      if(raw.siteSettings) store.siteSettings = raw.siteSettings;
      if(raw.analytics) store.analytics = raw.analytics;
      // Normalize numeric IDs (some may have been stored as strings via multipart form updates)
      if (Array.isArray(store.models)) {
        store.models.forEach(m => { if(m && typeof m.id !== 'number') { const n = Number(m.id); if(!isNaN(n)) m.id = n; } });
      }
      if (Array.isArray(store.bookings)) store.bookings.forEach(b=>{ if(b && typeof b.id !== 'number'){ const n=Number(b.id); if(!isNaN(n)) b.id=n; }});
    }
  } catch(e){ console.error('Load store failed', e.message); }
}
