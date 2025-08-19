import React, { useEffect, useState } from 'react';
import { createModelMultipart, deleteModel, fetchModels, updateModelMultipart, Model, fetchBookings, approveBooking, rejectBooking, fetchAdminStats, fetchAdminUsers, toggleUserBlock, fetchPromos, createPromo, togglePromo, fetchNotifications, clearNotifications, AdminStats, AdminUser, Promo, Notification, getSettings, updateSettings, SiteSettings } from '../api';
import { useAuth } from '../context';

const empty = { name:'', description:'', price:'', type:'tour', image:'', details:'', origin:'', destination:'', stops:'', itinerary:'' } as any;

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [models, setModels] = useState<Model[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tab, setTab] = useState<'listings'|'bookings'|'stats'|'users'|'promos'|'notifications'|'settings'|'contactinfo'>('listings');
  interface FormState { name:string; description:string; price:any; type:string; image?:string; origin?:string; destination?:string; stops?:string; itinerary?:string; departureTime?:string; arrivalTime?:string; id?:number }
  const [form, setForm] = useState<FormState>(empty);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [promoForm, setPromoForm] = useState({ code:'', type:'percent', value:'' });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsBusy, setSettingsBusy] = useState(false);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [contactInfoMsg, setContactInfoMsg] = useState<string|null>(null);
  const [contactInfoBusy, setContactInfoBusy] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);
  const [viewModel, setViewModel] = useState<Model | null>(null);

  // JWT handled via interceptor, no explicit auth headers needed

  const load = () => fetchModels().then(setModels);
  const loadBookings = () => fetchBookings().then(setBookings).catch(()=>{});
  const loadStats = () => fetchAdminStats().then(setStats).catch(()=>{});
  const loadUsers = () => fetchAdminUsers().then(setUsers).catch(()=>{});
  const loadPromos = () => fetchPromos().then(setPromos).catch(()=>{});
  const loadNotifications = () => fetchNotifications().then(setNotifications).catch(()=>{});
  const loadSettings = () => getSettings().then(setSettings).catch(()=>{});
  const loadContactInfo = () => (fetch('/api/contact-info').then(r=>r.json()).then(setContactInfo).catch(()=>{}));
  useEffect(() => { if (user?.role==='admin') { load(); loadBookings(); loadStats(); loadUsers(); loadPromos(); loadNotifications(); loadSettings(); loadContactInfo(); } }, [user]);

  if (!user || user.role !== 'admin') return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const normTime = (t:string)=>{
        if(!t) return '';
        const raw = t.trim();
        const re24 = /^(\d{2}):(\d{2})$/;
        const re12 = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
        if(re24.test(raw)) return raw;
  const m = raw.match(re12); if(m){ let [_,h,mm,ap]=m; let hh = parseInt(h,10); if(hh===12) hh = ap.toUpperCase()==='AM'?0:12; else if(ap.toUpperCase()==='PM') hh+=12; return `${hh.toString().padStart(2,'0')}:${mm}`; }
        throw new Error('Invalid time format (use HH:mm or h:mm AM/PM)');
      };
      let departureTime = form.departureTime||''; let arrivalTime = form.arrivalTime||'';
      if(departureTime) departureTime = normTime(departureTime);
      if(arrivalTime) arrivalTime = normTime(arrivalTime);
      const { id: _drop, image: _imgIgnore, ...restForm } = form as any;
      // Build minimal payload: required + conditional type fields
      const base:any = { name: restForm.name, description: restForm.description, price: Number(restForm.price), type: restForm.type };
      if(form.type==='bus') {
        if(restForm.origin) base.origin = restForm.origin;
        if(restForm.destination) base.destination = restForm.destination;
        if(restForm.stops) base.stops = restForm.stops;
        if(departureTime) base.departureTime = departureTime;
        if(arrivalTime) base.arrivalTime = arrivalTime;
      } else if(form.type==='tour') {
        if(restForm.itinerary) base.itinerary = restForm.itinerary;
      }
      const payload = base;
      if(!payload.name || !payload.description || isNaN(payload.price)) throw new Error('Fill required fields');
      let resp;
      if (editingId) {
        resp = await updateModelMultipart(editingId, payload, file);
        setMessage('Updated');
      } else {
        resp = await createModelMultipart(payload, file);
        setMessage('Created');
      }
      if(!resp?.success) setMessage('Server rejected');
      setForm(empty); setEditingId(null); setFile(null); load();
  } catch (err:any) { setMessage(err?.response?.data?.error || err.message || 'Failed'); } finally { setLoading(false); }
  };

  const edit = (m: Model) => { setEditingId(m.id); setForm({ ...m, image: m.image || '', origin: m.origin||'', destination: m.destination||'', stops: (m.stops||[]).join(', '), itinerary: (m as any).itinerary||'', departureTime:(m as any).departureTime||'', arrivalTime:(m as any).arrivalTime||'' }); setFile(null); };
  const remove = async (id: number) => { if (!confirm('Delete?')) return; await deleteModel(id); load(); };

  return (
    <section id='admin' className='py-20 bg-slate-50 border-t'>
      <div className='max-w-7xl mx-auto px-6'>
        <h2 className='text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-3'>Admin Dashboard</h2>
        <div className='flex gap-3 mb-8'>
          <button onClick={()=>setTab('listings')} className={`px-4 py-2 text-sm rounded-md border ${tab==='listings'? 'bg-indigo-600 text-white border-indigo-600':'bg-white hover:bg-slate-50'}`}>Listings</button>
          <button onClick={()=>setTab('bookings')} className={`px-4 py-2 text-sm rounded-md border ${tab==='bookings'? 'bg-indigo-600 text-white border-indigo-600':'bg-white hover:bg-slate-50'}`}>Bookings</button>
          <button onClick={()=>setTab('stats')} className={`px-4 py-2 text-sm rounded-md border ${tab==='stats'? 'bg-indigo-600 text-white border-indigo-600':'bg-white hover:bg-slate-50'}`}>Stats</button>
          <button onClick={()=>setTab('users')} className={`px-4 py-2 text-sm rounded-md border ${tab==='users'? 'bg-indigo-600 text-white border-indigo-600':'bg-white hover:bg-slate-50'}`}>Users</button>
          <button onClick={()=>setTab('promos')} className={`px-4 py-2 text-sm rounded-md border ${tab==='promos'? 'bg-indigo-600 text-white border-indigo-600':'bg-white hover:bg-slate-50'}`}>Promos</button>
          <button onClick={()=>setTab('notifications')} className={`relative px-4 py-2 text-sm rounded-md border ${tab==='notifications'? 'bg-indigo-600 text-white border-indigo-600':'bg-white hover:bg-slate-50'}`}>Notifications {notifications.length>0 && <span className='ml-1 text-[10px] bg-rose-600 text-white rounded-full px-1.5'>{notifications.length}</span>}</button>
          <button onClick={()=>setTab('settings')} className={`px-4 py-2 text-sm rounded-md border ${tab==='settings'? 'bg-indigo-600 text-white border-indigo-600':'bg-white hover:bg-slate-50'}`}>Site Settings</button>
          <button onClick={()=>setTab('contactinfo')} className={`px-4 py-2 text-sm rounded-md border ${tab==='contactinfo'? 'bg-indigo-600 text-white border-indigo-600':'bg-white hover:bg-slate-50'}`}>Contact Info</button>
        </div>
        {tab==='listings' && (
        <div className='grid md:grid-cols-2 gap-10'>
          <div>
            <h3 className='font-semibold mb-4'>{editingId ? 'Edit Listing' : 'New Listing'}</h3>
            <form onSubmit={submit} className='space-y-3 bg-white p-5 rounded-xl shadow-sm border'>
              <input required placeholder='Name' className='w-full border rounded-md px-3 py-2 text-sm' value={form.name} onChange={e=>setForm((f:FormState)=>({...f,name:e.target.value}))} />
              <textarea required placeholder='Description' className='w-full border rounded-md px-3 py-2 text-sm' value={form.description} onChange={e=>setForm((f:FormState)=>({...f,description:e.target.value}))} />
              <input required type='number' placeholder='Price' className='w-full border rounded-md px-3 py-2 text-sm' value={form.price} onChange={e=>setForm((f:FormState)=>({...f,price:e.target.value}))} />
              <select className='w-full border rounded-md px-3 py-2 text-sm' value={form.type} onChange={e=>setForm((f:FormState)=>({...f,type:e.target.value}))}>
                <option value='tour'>Tour Package</option>
                <option value='bus'>Bus / Transfer</option>
              </select>
              <button type='button' onClick={()=>setShowAdvanced(s=>!s)} className='text-[11px] underline text-slate-600'>{showAdvanced? 'Hide optional fields':'Show optional fields'}</button>
              {showAdvanced && (
                <div className='space-y-3 border rounded-md p-3 bg-slate-50'>
                  {form.type==='bus' && <>
                    <div className='grid grid-cols-2 gap-3'>
                      <input placeholder='Origin (optional)' className='border rounded-md px-3 py-2 text-sm' value={form.origin||''} onChange={e=>setForm((f:FormState)=>({...f,origin:e.target.value}))} />
                      <input placeholder='Destination (optional)' className='border rounded-md px-3 py-2 text-sm' value={form.destination||''} onChange={e=>setForm((f:FormState)=>({...f,destination:e.target.value}))} />
                    </div>
                    <input placeholder='Stops (comma separated)' className='w-full border rounded-md px-3 py-2 text-sm' value={form.stops||''} onChange={e=>setForm((f:FormState)=>({...f,stops:e.target.value}))} />
                    <div className='grid grid-cols-2 gap-3'>
                      <input placeholder='Departure Time (e.g. 08:00 AM)' className='border rounded-md px-3 py-2 text-sm' value={form.departureTime||''} onChange={e=>setForm((f:FormState)=>({...f,departureTime:e.target.value}))} />
                      <input placeholder='Arrival Time (e.g. 06:00 PM)' className='border rounded-md px-3 py-2 text-sm' value={form.arrivalTime||''} onChange={e=>setForm((f:FormState)=>({...f,arrivalTime:e.target.value}))} />
                    </div>
                  </>}
                  {form.type==='tour' && <textarea placeholder='Itinerary (optional)' className='w-full border rounded-md px-3 py-2 text-sm' value={form.itinerary||''} onChange={e=>setForm((f:FormState)=>({...f,itinerary:e.target.value}))} />}
                </div>
              )}
              <div className='flex items-center gap-3'>
                <input type='file' accept='image/*' onChange={e=>setFile(e.target.files?.[0]||null)} className='text-xs' />
                {file && <span className='text-xs text-slate-600'>{file.name}</span>}
              </div>
              <div className='flex gap-3'>
                <button disabled={loading} className='bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-md px-4 py-2 text-sm font-medium'>{editingId? 'Update':'Create'}</button>
                {editingId && <button type='button' onClick={()=>{setEditingId(null); setForm(empty);}} className='bg-slate-200 hover:bg-slate-300 rounded-md px-4 py-2 text-sm'>Cancel</button>}
              </div>
              {message && <p className='text-sm text-emerald-600'>{message}</p>}
            </form>
          </div>
          <div>
            <h3 className='font-semibold mb-4'>Listings</h3>
            <div className='space-y-3'>
              {models.map(m => (
                <div key={m.id} className='bg-white border rounded-lg p-4 flex items-start justify-between gap-4 shadow-sm'>
                  <div className='min-w-0'>
                    <p className='font-medium text-slate-800 truncate'>{m.name} <span className='text-xs text-slate-500'>({m.type})</span></p>
                    <p className='text-xs text-slate-500 line-clamp-2'>{m.description}</p>
                    <p className='text-sm font-semibold text-indigo-600 mt-1'>₹ {m.price}</p>
                    {(m.origin || m.destination) && <p className='text-[11px] text-slate-500 mt-1'>{m.origin || '—'} → {m.destination || '—'}</p>}
                    {m.type==='bus' && m.stops && m.stops.length>0 && <p className='text-[10px] text-slate-400 truncate'>Stops: {m.stops.join(', ')}</p>}
                    {(m as any).departureTime && <p className='text-[10px] text-slate-500'>Dep: {(m as any).departureTime}</p>}
                    {(m as any).arrivalTime && <p className='text-[10px] text-slate-500'>Arr: {(m as any).arrivalTime}</p>}
                  </div>
                  <div className='flex flex-col gap-2 shrink-0'>
                    <button onClick={()=>setViewModel(m)} className='text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded'>View</button>
                    <button onClick={()=>edit(m)} className='text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded'>Edit</button>
                    <button onClick={()=>remove(m.id)} className='text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded'>Delete</button>
                  </div>
                </div>
              ))}
              {models.length===0 && <p className='text-slate-500 text-sm'>No listings.</p>}
            </div>
          </div>
        </div>) }
        {tab==='bookings' && (
          <div className='bg-white border rounded-xl p-6 shadow-sm'>
            <h3 className='font-semibold mb-4'>Booking Requests</h3>
            <div className='space-y-3'>
              {bookings.map(b => {
                const serviceType = b.extras?.serviceType;
                return (
                  <div key={b.id} className='border rounded-lg p-3 flex items-center justify-between gap-4'>
                    <div className='text-xs'>
                      <p className='font-medium text-slate-800'>#{b.id} • {b.name} {serviceType && <span className='text-[10px] px-1 py-0.5 bg-slate-200 rounded ml-1 uppercase'>{serviceType}</span>}</p>
                      <p className='text-slate-500'>Model ID: {b.modelId}</p>
                      <p className='text-slate-500'>Date: {b.date}</p>
                      {b.promoCode && <p className='text-emerald-600'>Promo: {b.promoCode} −₹{b.discount}</p>}
                      {b.finalPrice!=null && <p className='font-semibold text-indigo-600'>Final: ₹{b.finalPrice}</p>}
                      <p className={`mt-1 inline-block px-2 py-0.5 rounded ${b.status==='pending'?'bg-amber-100 text-amber-700':b.status==='approved'?'bg-emerald-100 text-emerald-700':'bg-rose-100 text-rose-700'}`}>{b.status}</p>
                    </div>
                    {b.status==='pending' && <div className='flex gap-2'>
                      <button onClick={async()=>{ await approveBooking(b.id); loadBookings(); loadStats(); }} className='text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded'>Approve</button>
                      <button onClick={async()=>{ await rejectBooking(b.id); loadBookings(); loadStats(); }} className='text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded'>Reject</button>
                    </div>}
                  </div>
                );
              })}
              {bookings.length===0 && <p className='text-slate-500 text-sm'>No bookings yet.</p>}
            </div>
          </div>
        )}
        {tab==='stats' && (
          <div className='grid md:grid-cols-5 gap-4'>
            {stats ? (<>
              <div className='bg-white border rounded-lg p-4 shadow-sm'><p className='text-xs text-slate-500'>Bookings</p><p className='text-2xl font-bold text-indigo-600'>{stats.bookings}</p></div>
              <div className='bg-white border rounded-lg p-4 shadow-sm'><p className='text-xs text-slate-500'>Pending</p><p className='text-2xl font-bold text-amber-600'>{stats.pendingBookings}</p></div>
              <div className='bg-white border rounded-lg p-4 shadow-sm'><p className='text-xs text-slate-500'>Users</p><p className='text-2xl font-bold text-indigo-600'>{stats.users}</p></div>
              <div className='bg-white border rounded-lg p-4 shadow-sm'><p className='text-xs text-slate-500'>Listings</p><p className='text-2xl font-bold text-indigo-600'>{stats.models}</p></div>
              <div className='bg-white border rounded-lg p-4 shadow-sm'><p className='text-xs text-slate-500'>Revenue</p><p className='text-2xl font-bold text-emerald-600'>₹ {stats.revenue}</p></div>
            </>) : <p>Loading...</p>}
          </div>
        )}
        {tab==='users' && (
          <div className='bg-white border rounded-xl p-6 shadow-sm'>
            <h3 className='font-semibold mb-4'>Users</h3>
            <div className='space-y-2'>
              {users.map(u=> (
                <div key={u.id} className='flex items-center justify-between text-sm border rounded p-2'>
                  <div>
                    <p className='font-medium'>{u.username} <span className='text-xs text-slate-500'>({u.role})</span></p>
                    {u.blocked && <span className='text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-700'>Blocked</span>}
                  </div>
                  <button onClick={async()=>{ await toggleUserBlock(u.id); loadUsers(); }} className={`text-xs px-3 py-1 rounded ${u.blocked? 'bg-emerald-600 hover:bg-emerald-700':'bg-rose-600 hover:bg-rose-700'} text-white`}>{u.blocked? 'Unblock':'Block'}</button>
                </div>
              ))}
              {users.length===0 && <p className='text-slate-500 text-sm'>No users.</p>}
            </div>
          </div>
        )}
        {tab==='promos' && (
          <div className='grid md:grid-cols-2 gap-10'>
            <div>
              <h3 className='font-semibold mb-4'>New Promo</h3>
              <form onSubmit={async e=>{ e.preventDefault(); await createPromo({ code:promoForm.code.trim(), type:promoForm.type as any, value:Number(promoForm.value) }); setPromoForm({ code:'', type:'percent', value:'' }); loadPromos(); }} className='space-y-3 bg-white p-5 rounded-xl shadow-sm border'>
                <input required placeholder='Code' className='w-full border rounded-md px-3 py-2 text-sm uppercase' value={promoForm.code} onChange={e=>setPromoForm(f=>({...f,code:e.target.value}))} />
                <div className='grid grid-cols-2 gap-3'>
                  <select className='border rounded-md px-3 py-2 text-sm' value={promoForm.type} onChange={e=>setPromoForm(f=>({...f,type:e.target.value}))}>
                    <option value='percent'>Percent</option>
                    <option value='flat'>Flat</option>
                  </select>
                  <input required type='number' placeholder='Value' className='border rounded-md px-3 py-2 text-sm' value={promoForm.value} onChange={e=>setPromoForm(f=>({...f,value:e.target.value}))} />
                </div>
                <button className='bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm font-medium'>Create</button>
              </form>
            </div>
            <div>
              <h3 className='font-semibold mb-4'>Promos</h3>
              <div className='space-y-3'>
                {promos.map(p=> (
                  <div key={p.code} className='bg-white border rounded-lg p-4 flex items-center justify-between shadow-sm'>
                    <div className='text-sm'>
                      <p className='font-medium'>{p.code}</p>
                      <p className='text-xs text-slate-500'>{p.type} • {p.value}{p.type==='percent'? '%':'₹'} {p.active? '':'(inactive)'}</p>
                    </div>
                    <button onClick={async()=>{ await togglePromo(p.code); loadPromos(); }} className='text-xs bg-slate-200 hover:bg-slate-300 rounded px-3 py-1'>{p.active? 'Disable':'Enable'}</button>
                  </div>
                ))}
                {promos.length===0 && <p className='text-slate-500 text-sm'>No promos.</p>}
              </div>
            </div>
          </div>
        )}
        {tab==='notifications' && (
          <div className='bg-white border rounded-xl p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold'>Notifications (WhatsApp simulated)</h3>
              <button onClick={async()=>{ await clearNotifications(); loadNotifications(); }} className='text-xs px-3 py-1 rounded bg-slate-200 hover:bg-slate-300'>Clear</button>
            </div>
            <div className='space-y-3'>
              {notifications.map(n=> (
                <div key={n.id} className='border rounded-lg p-3 text-sm'>
                  <p className='font-medium text-slate-700'>{n.message}</p>
                  <p className='text-[10px] text-slate-400 mt-1'>{new Date(n.createdAt).toLocaleString()} • {n.channel}</p>
                </div>
              ))}
              {notifications.length===0 && <p className='text-sm text-slate-500'>No notifications.</p>}
            </div>
          </div>
        )}
        {tab==='settings' && (
          <div className='bg-white border rounded-xl p-6 shadow-sm max-w-3xl'>
            <h3 className='font-semibold mb-4'>Site Contact Details</h3>
            {!settings && <p className='text-sm text-slate-500'>Loading...</p>}
            {settings && (
              <form onSubmit={async e=>{ e.preventDefault(); setSettingsBusy(true); setSettingsMsg(null); try { const payload = { ...settings, phones: (settings.phones||[]).filter(Boolean) }; await updateSettings(payload); setSettingsMsg('Saved'); } catch { setSettingsMsg('Failed to save'); } finally { setSettingsBusy(false); } }} className='space-y-4'>
                <div className='grid md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-[11px] font-medium text-slate-500 mb-1'>Company Name</label>
                    <input className='w-full border rounded-md px-3 py-2 text-sm' value={settings.companyName} onChange={e=>setSettings(s=>s?{...s,companyName:e.target.value}:s)} />
                  </div>
                  <div>
                    <label className='block text-[11px] font-medium text-slate-500 mb-1'>Primary Phone</label>
                    <input className='w-full border rounded-md px-3 py-2 text-sm' value={settings.phone} onChange={e=>setSettings(s=>s?{...s,phone:e.target.value}:s)} />
                  </div>
                  <div>
                    <label className='block text-[11px] font-medium text-slate-500 mb-1'>WhatsApp Number</label>
                    <input className='w-full border rounded-md px-3 py-2 text-sm' value={settings.whatsapp||''} onChange={e=>setSettings(s=>s?{...s,whatsapp:e.target.value}:s)} />
                  </div>
                </div>
                <div className='grid md:grid-cols-3 gap-4'>
                  <div className='md:col-span-2'>
                    <label className='block text-[11px] font-medium text-slate-500 mb-1'>Secondary Phones (one per line)</label>
                    <textarea className='w-full border rounded-md px-3 py-2 text-sm h-24' value={(settings.phones||[]).join('\n')} onChange={e=>setSettings(s=>s?{...s,phones:e.target.value.split(/\n+/).map(v=>v.trim()).filter(Boolean)}:s)} />
                  </div>
                  <div>
                    <label className='block text-[11px] font-medium text-slate-500 mb-1'>Instagram Handle</label>
                    <input className='w-full border rounded-md px-3 py-2 text-sm' placeholder='without @' value={settings.instagram||''} onChange={e=>setSettings(s=>s?{...s,instagram:e.target.value}:s)} />
                    <p className='mt-1 text-[10px] text-slate-400'>Public footer shows @ automatically.</p>
                  </div>
                </div>
                <div className='grid md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-[11px] font-medium text-slate-500 mb-1'>Support Email</label>
                    <input type='email' className='w-full border rounded-md px-3 py-2 text-sm' value={settings.email} onChange={e=>setSettings(s=>s?{...s,email:e.target.value}:s)} />
                  </div>
                  <div>
                    <label className='block text-[11px] font-medium text-slate-500 mb-1'>Support Hours</label>
                    <input className='w-full border rounded-md px-3 py-2 text-sm' value={settings.supportHours} onChange={e=>setSettings(s=>s?{...s,supportHours:e.target.value}:s)} />
                  </div>
                  <div>
                    <label className='block text-[11px] font-medium text-slate-500 mb-1'>Address (short)</label>
                    <input className='w-full border rounded-md px-3 py-2 text-sm' value={settings.address} onChange={e=>setSettings(s=>s?{...s,address:e.target.value}:s)} />
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <button disabled={settingsBusy} className='bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-md px-5 py-2 text-sm font-medium'>{settingsBusy? 'Saving...':'Save Changes'}</button>
                  {settingsMsg && <span className='text-xs text-slate-500'>{settingsMsg}</span>}
                </div>
              </form>
            )}
            <p className='mt-6 text-[11px] text-slate-400'>These details show on the public site (footer / contact page) and are used in admin notifications.</p>
          </div>
        )}
        {tab==='contactinfo' && (
          <div className='bg-white border rounded-xl p-6 shadow-sm max-w-3xl'>
            <h3 className='font-semibold mb-4'>Public Contact Info (Contact Page)</h3>
            {!contactInfo && <p className='text-sm text-slate-500'>Loading...</p>}
            {contactInfo && (
              <form onSubmit={async e=>{ e.preventDefault(); setContactInfoBusy(true); setContactInfoMsg(null); try { const res = await fetch('/api/contact-info',{ method:'PUT', headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify(contactInfo)}); if(!res.ok) throw new Error('Failed'); const data= await res.json(); setContactInfo(data.contactInfo); setContactInfoMsg('Saved'); } catch { setContactInfoMsg('Failed to save'); } finally { setContactInfoBusy(false); } }} className='space-y-4'>
                <div className='grid md:grid-cols-3 gap-4'>
                  <div><label className='block text-[11px] font-medium text-slate-500 mb-1'>Company</label><input className='w-full border rounded-md px-3 py-2 text-sm' value={contactInfo.companyName||''} onChange={e=>setContactInfo((c:any)=>({...c,companyName:e.target.value}))} /></div>
                  <div><label className='block text-[11px] font-medium text-slate-500 mb-1'>Primary Phone</label><input className='w-full border rounded-md px-3 py-2 text-sm' value={contactInfo.phonePrimary||''} onChange={e=>setContactInfo((c:any)=>({...c,phonePrimary:e.target.value}))} /></div>
                  <div><label className='block text-[11px] font-medium text-slate-500 mb-1'>Secondary Phone</label><input className='w-full border rounded-md px-3 py-2 text-sm' value={contactInfo.phoneSecondary||''} onChange={e=>setContactInfo((c:any)=>({...c,phoneSecondary:e.target.value}))} /></div>
                </div>
                <div className='grid md:grid-cols-3 gap-4'>
                  <div className='md:col-span-2'><label className='block text-[11px] font-medium text-slate-500 mb-1'>Extra Phones (one per line)</label><textarea className='w-full border rounded-md px-3 py-2 text-sm h-24' value={(contactInfo.phones||[]).join('\n')} onChange={e=>setContactInfo((c:any)=>({...c,phones:e.target.value.split(/\n+/).map((v:string)=>v.trim()).filter(Boolean)}))} /></div>
                  <div><label className='block text-[11px] font-medium text-slate-500 mb-1'>WhatsApp</label><input className='w-full border rounded-md px-3 py-2 text-sm' value={contactInfo.whatsapp||''} onChange={e=>setContactInfo((c:any)=>({...c,whatsapp:e.target.value}))} /></div>
                </div>
                <div className='grid md:grid-cols-3 gap-4'>
                  <div><label className='block text-[11px] font-medium text-slate-500 mb-1'>Instagram</label><input className='w-full border rounded-md px-3 py-2 text-sm' placeholder='without @' value={contactInfo.instagram||''} onChange={e=>setContactInfo((c:any)=>({...c,instagram:e.target.value}))} /></div>
                  <div><label className='block text-[11px] font-medium text-slate-500 mb-1'>Email</label><input type='email' className='w-full border rounded-md px-3 py-2 text-sm' value={contactInfo.email||''} onChange={e=>setContactInfo((c:any)=>({...c,email:e.target.value}))} /></div>
                  <div><label className='block text-[11px] font-medium text-slate-500 mb-1'>Support Hours</label><input className='w-full border rounded-md px-3 py-2 text-sm' value={contactInfo.supportHours||''} onChange={e=>setContactInfo((c:any)=>({...c,supportHours:e.target.value}))} /></div>
                </div>
                <div>
                  <label className='block text-[11px] font-medium text-slate-500 mb-1'>Address</label>
                  <textarea className='w-full border rounded-md px-3 py-2 text-sm' rows={3} value={contactInfo.address||''} onChange={e=>setContactInfo((c:any)=>({...c,address:e.target.value}))} />
                </div>
                <div className='flex items-center gap-3'>
                  <button disabled={contactInfoBusy} className='bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-md px-5 py-2 text-sm font-medium'>{contactInfoBusy? 'Saving...':'Save Contact Info'}</button>
                  {contactInfoMsg && <span className='text-xs text-slate-500'>{contactInfoMsg}</span>}
                </div>
              </form>
            )}
            <p className='mt-6 text-[11px] text-slate-400'>Displayed on the Contact page and header/footer WhatsApp links.</p>
          </div>
        )}
      </div>
      {viewModel && (
        <div className='fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 p-4' onClick={()=>setViewModel(null)}>
          <div className='bg-white w-full max-w-lg rounded-xl shadow-lg border relative overflow-hidden' onClick={e=>e.stopPropagation()}>
            <div className='flex items-center justify-between px-5 py-3 border-b bg-slate-50'>
              <h4 className='font-semibold text-slate-700 text-sm'>Listing Details</h4>
              <button onClick={()=>setViewModel(null)} className='text-xs px-2 py-1 rounded bg-slate-200 hover:bg-slate-300'>Close</button>
            </div>
            <div className='p-5 space-y-3 text-sm'>
              <p className='text-slate-800 font-medium text-base'>{viewModel.name} <span className='text-xs text-slate-500 align-middle'>({viewModel.type})</span></p>
              <p className='text-slate-600 whitespace-pre-wrap'>{viewModel.description}</p>
              <p className='text-indigo-600 font-semibold'>₹ {viewModel.price}</p>
              {(viewModel.origin || viewModel.destination) && <p className='text-[12px] text-slate-500'>{viewModel.origin || '—'} → {viewModel.destination || '—'}</p>}
              {(viewModel as any).departureTime && <p className='text-[11px] text-slate-500'>Departure: {(viewModel as any).departureTime}</p>}
              {(viewModel as any).arrivalTime && <p className='text-[11px] text-slate-500'>Arrival: {(viewModel as any).arrivalTime}</p>}
              {viewModel.type==='bus' && viewModel.stops && viewModel.stops.length>0 && <div>
                <p className='text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1'>Stops</p>
                <p className='text-slate-600 text-xs'>{viewModel.stops.join(', ')}</p>
              </div>}
              {viewModel.type==='tour' && viewModel.itinerary && <div>
                <p className='text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1'>Itinerary</p>
                <p className='text-slate-600 whitespace-pre-wrap text-xs'>{viewModel.itinerary}</p>
              </div>}
              {viewModel.details && <div>
                <p className='text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1'>Details</p>
                <p className='text-slate-600 whitespace-pre-wrap text-xs'>{viewModel.details}</p>
              </div>}
              {viewModel.image && <div className='pt-2'>
                <img src={viewModel.image} alt='' className='max-h-56 rounded-md object-cover w-full border' />
              </div>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
