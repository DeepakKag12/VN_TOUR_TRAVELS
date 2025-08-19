import axios from 'axios';

// Determine API base URL (supports deployed environments)
// Priority: explicit VITE_API_BASE_URL > window.__API_BASE_URL__ (if injected) > same-origin '/api' (proxy or monolith) > localhost fallback
const envBase = (import.meta as any).env?.VITE_API_BASE_URL || (window as any).__API_BASE_URL__;
let resolvedBase = envBase;
if(!resolvedBase){
  if(typeof window !== 'undefined'){
    // If running on vercel (frontend only) and no env set, we cannot reach localhost.
    // Use relative '/api' so a reverse proxy (if configured) works. Otherwise instruct user to set env.
    resolvedBase = '/api';
    if(window.location.hostname === 'localhost'){
      resolvedBase = 'http://localhost:5000/api';
    }
  } else {
    resolvedBase = 'http://localhost:5000/api';
  }
}

// Ensure no trailing slash duplication
resolvedBase = resolvedBase.replace(/\/$/, '');
const api = axios.create({ baseURL: resolvedBase });

// Attach token if present
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) {
    cfg.headers = cfg.headers || {};
    (cfg.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return cfg;
});

// Global 401 handler -> dispatch custom event for logout
api.interceptors.response.use(
  response => response,
  error => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error or server unreachable:', error.message);
      return Promise.reject(new Error('Unable to connect to server. Please check your internet connection.'));
    }
    
    // Handle 401 unauthorized
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    
    // Ensure error response has proper structure
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

export interface Model {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string; // tour | bus
  image?: string;
  details?: string;
  origin?: string;
  destination?: string;
  stops?: string[];
  itinerary?: string;
  departureTime?: string;
  arrivalTime?: string;
}

export interface Booking {
  id: number;
  modelId: number;
  name: string;
  email: string;
  date: string;
}

export async function fetchModels(params?: { q?: string; type?: string }) {
  const res = await api.get<Model[]>('/models', { params });
  return res.data;
}

export async function fetchModel(id:number) {
  const res = await api.get<Model>(`/models/${id}`);
  return res.data;
}

export async function fetchModelAvailability(id:number){ const res = await api.get<{ bookedDates:string[] }>(`/models/${id}/availability`); return res.data; }

export async function createModel(data: Partial<Model>) {
  const res = await api.post('/models', data);
  return res.data;
}

export async function updateModel(id:number, data: Partial<Model>) {
  const res = await api.put(`/models/${id}`, data);
  return res.data;
}

export async function deleteModel(id:number) {
  const res = await api.delete(`/models/${id}`);
  return res.data;
}

// Multipart versions for image upload
export async function createModelMultipart(data: Record<string, any>, file: File | null) {
  const form = new FormData();
  Object.entries(data).forEach(([k,v])=> { if(k==='id') return; if(v!==undefined && v!==null) form.append(k, Array.isArray(v)? v.join(','): String(v)); });
  if (file) form.append('image', file);
  const res = await api.post('/models', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function updateModelMultipart(id:number, data: Record<string, any>, file: File | null) {
  const form = new FormData();
  Object.entries(data).forEach(([k,v])=> { if(k==='id') return; if(v!==undefined && v!==null) form.append(k, Array.isArray(v)? v.join(','): String(v)); });
  if (file) form.append('image', file);
  const res = await api.put(`/models/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function bookModel(data: {modelId?:number; hotelId?:number; name?:string; email?:string; date:string; startTime?:string; endTime?:string; extras?:Record<string,any>; promoCode?:string;}) {
  // booking now requires auth headers handled globally via interceptor in future
  const res = await api.post('/bookings', data);
  return res.data;
}

export async function login(email:string, password:string) {
  const res = await api.post('/auth/login', { email, password });
  if (res.data.token) localStorage.setItem('token', res.data.token);
  return res.data;
}

export async function signup(username:string|undefined, password:string, email:string) {
  const res = await api.post('/auth/signup', { username, password, email });
  if (res.data.token) localStorage.setItem('token', res.data.token);
  return res.data;
}

export async function me(){
  const res = await api.get('/auth/me');
  return res.data;
}

export async function fetchBookings() {
  const res = await api.get('/bookings');
  return res.data;
}
export async function fetchMyBookings(){ const res = await api.get('/bookings/mine'); return res.data; }

// Booking admin actions
export async function approveBooking(id:number){ const res = await api.post(`/bookings/${id}/approve`,{}); return res.data; }
export async function rejectBooking(id:number){ const res = await api.post(`/bookings/${id}/reject`,{}); return res.data; }
export async function cancelBooking(id:number){ const res = await api.post(`/bookings/${id}/cancel`,{}); return res.data; }

// User specific bookings (filter client side since backend lacks endpoint for now)


export async function fetchContacts() {
  const res = await api.get('/contacts');
  return res.data;
}

// Rentals (bus / cab / bike request)
export interface RentalRequest {
  id: number;
  vehicleType: string; // bus | cab | bike
  startDate: string;
  endDate?: string | null;
  pickupLocation?: string;
  dropLocation?: string;
  name: string;
  email: string;
  passengers?: number | null;
  notes?: string;
  createdAt: string;
}

export async function createRental(data: Omit<RentalRequest,'id'|'createdAt'>) {
  const res = await api.post('/rentals', data);
  return res.data;
}

export async function fetchRentals() {
  const res = await api.get<RentalRequest[]>('/rentals');
  return res.data;
}

// Reviews
export interface Review { id:number; modelId:number; userId:number; rating:number; comment:string; createdAt:string; }
export async function fetchReviews(modelId?:number){ const res = await api.get<Review[]>('/reviews', { params: modelId? { modelId }: undefined }); return res.data; }
export async function createReview(data:{ modelId:number; rating:number; comment?:string; }){ const res = await api.post('/reviews', data); return res.data; }

// Promos
export interface Promo { code:string; type:'percent'|'flat'; value:number; active:boolean; }
export async function fetchPromos(){ const res = await api.get<Promo[]>('/promos'); return res.data; }
export async function createPromo(data:{ code:string; type:'percent'|'flat'; value:number; }){ const res = await api.post('/promos', data); return res.data; }
export async function togglePromo(code:string){ const res = await api.post(`/promos/${code}/toggle`,{}); return res.data; }

// Admin stats & users
export interface AdminStats { bookings:number; users:number; models:number; revenue:number; pendingBookings:number; }
export async function fetchAdminStats(){ const res = await api.get<AdminStats>('/admin/stats'); return res.data; }
export interface AdminUser { id:number; username:string; role:string; blocked:boolean; }
export async function fetchAdminUsers(){ const res = await api.get<AdminUser[]>('/admin/users'); return res.data; }
export async function toggleUserBlock(id:number){ const res = await api.post(`/admin/users/${id}/toggle-block`,{}); return res.data; }

// Notifications (admin)
export interface Notification { id:string; channel:string; to:string; message:string; createdAt:string; }
export async function fetchNotifications(){ const res = await api.get<Notification[]>('/notifications'); return res.data; }
export async function clearNotifications(){ const res = await api.post('/notifications/clear',{}); return res.data; }
export async function fetchMyNotifications(){ const res = await api.get<Notification[]>('/notifications/mine'); return res.data; }

// Site settings
export interface SiteSettings { companyName:string; phone:string; email:string; address:string; supportHours:string; whatsapp?:string; instagram?:string; phones?:string[]; }
export async function getSettings(){ const res = await api.get<SiteSettings>('/settings'); return res.data; }
export async function updateSettings(data:Partial<SiteSettings>){ const res = await api.put('/settings', data); return res.data; }

// Contact Info (separate model for public contact card)
export interface ContactInfo { companyName:string; email:string; phonePrimary:string; phoneSecondary?:string; phones?:string[]; whatsapp?:string; instagram?:string; address:string; supportHours:string; }
export async function getContactInfo(){ const res = await api.get<ContactInfo>('/contact-info'); return res.data; }
export async function updateContactInfo(data:Partial<ContactInfo>){ const res = await api.put('/contact-info', data); return res.data; }

export interface RentalInventoryItem { id:number; name:string; category:string; description?:string; pricePerDay:number; image?:string; amenities?:string[]; available:boolean; }
export interface Hotel { id:number; name:string; city?:string; description?:string; pricePerNight:number; image?:string; amenities?:string[]; available:boolean; }
// Rental inventory
export async function fetchRentalItems(params?:{ category?:string; q?:string }){ const res = await api.get<RentalInventoryItem[]>('/rental-items',{ params }); return res.data; }
export async function createRentalItem(data:Record<string,any>, file:File|null){ const form=new FormData(); Object.entries(data).forEach(([k,v])=>{ if(v!=null) form.append(k, Array.isArray(v)? v.join(','): String(v)); }); if(file) form.append('image', file); const res= await api.post('/rental-items', form,{ headers:{'Content-Type':'multipart/form-data'} }); return res.data; }
export async function updateRentalItem(id:number, data:Record<string,any>, file:File|null){ const form=new FormData(); Object.entries(data).forEach(([k,v])=>{ if(v!=null) form.append(k, Array.isArray(v)? v.join(','): String(v)); }); if(file) form.append('image', file); const res= await api.put(`/rental-items/${id}`, form,{ headers:{'Content-Type':'multipart/form-data'} }); return res.data; }
export async function deleteRentalItem(id:number){ const res= await api.delete(`/rental-items/${id}`); return res.data; }
// Hotels
export async function fetchHotels(params?:{ city?:string; q?:string }){ const res = await api.get<Hotel[]>('/hotels',{ params }); return res.data; }
export async function createHotel(data:Record<string,any>, file:File|null){ const form=new FormData(); Object.entries(data).forEach(([k,v])=>{ if(v!=null) form.append(k, Array.isArray(v)? v.join(','): String(v)); }); if(file) form.append('image', file); const res= await api.post('/hotels', form,{ headers:{'Content-Type':'multipart/form-data'} }); return res.data; }
export async function updateHotel(id:number, data:Record<string,any>, file:File|null){ const form=new FormData(); Object.entries(data).forEach(([k,v])=>{ if(v!=null) form.append(k, Array.isArray(v)? v.join(','): String(v)); }); if(file) form.append('image', file); const res= await api.put(`/hotels/${id}`, form,{ headers:{'Content-Type':'multipart/form-data'} }); return res.data; }
export async function deleteHotel(id:number){ const res= await api.delete(`/hotels/${id}`); return res.data; }
export async function fetchHotelAvailability(id:number){ const res = await api.get<{ bookedDates:string[] }>(`/hotels/${id}/availability`); return res.data; }

// Connection test
export async function testConnection(): Promise<{ success: boolean; error?: string }> {
  try {
  await api.get('/health');
  return { success: true };
  } catch (error: any) {
    // Build a richer diagnostic string
    let details = 'Unknown connection error';
    if (error?.response) {
      details = `HTTP ${error.response.status} - ` + (error.response.data?.error || error.response.data?.message || error.message || 'Server error');
    } else if (error?.request) {
      details = 'No response (possible CORS / network / DNS)';
    } else if (error?.message) {
      details = error.message;
    }
    console.error('Connection test failed:', { message: error?.message, details, stack: error?.stack });
    return { success: false, error: details };
  }
}

export default api;
