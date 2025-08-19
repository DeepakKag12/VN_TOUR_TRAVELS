import React, { useEffect, useRef, useState } from 'react';
import { fetchMyBookings, fetchModels, cancelBooking, fetchMyNotifications } from '../api';
import { useAuth } from '../context';

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const prevStatuses = useRef<Record<number,string>>({});
  const [changedIds, setChangedIds] = useState<Set<number>>(new Set());
  const [notifications, setNotifications] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch data function
  const loadData = async () => {
    if(!user) return;
    try {
      const [b,m,notifs] = await Promise.all([fetchMyBookings(), fetchModels(), fetchMyNotifications().catch(()=>[]) ]);
      // detect status changes
      const changed = new Set<number>();
  (b as any[]).forEach((x:any)=> { const prev = prevStatuses.current[x.id]; if(prev && prev!==x.status) changed.add(x.id); });
      // update ref
  prevStatuses.current = Object.fromEntries((b as any[]).map((x:any)=> [x.id, x.status]));
      setChangedIds(changed);
      setBookings(b);
      setModels(m);
      setNotifications(notifs||[]);
    } finally { setLoading(false); }
  };

  useEffect(()=> { if(user){ loadData(); } else { setLoading(false); } }, [user]);
  // polling for status updates
  useEffect(()=> {
    if(!user || !autoRefresh) return; const t = setInterval(()=> { loadData(); }, 10000); return ()=> clearInterval(t);
  }, [user, autoRefresh]);
  useEffect(()=> { if(user){ Promise.all([fetchMyBookings(), fetchModels()]).then(([b,m])=>{ setBookings(b); setModels(m); }).finally(()=>setLoading(false)); } else { setLoading(false); } }, [user]);

  if(!user) return <div className='max-w-4xl mx-auto p-8 text-sm'>Login to view your bookings.</div>;
  if(loading) return <div className='max-w-4xl mx-auto p-8'>Loading...</div>;

  const filtered = statusFilter==='all'? bookings : bookings.filter(b=> b.status===statusFilter);
  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>
      <div className='flex items-start justify-between flex-wrap gap-4 mb-6'>
        <h1 className='text-2xl font-bold'>My Bookings</h1>
        <div className='flex items-center gap-3 text-xs'>
          <select value={statusFilter} onChange={e=> setStatusFilter(e.target.value)} className='border rounded px-2 py-1'>
            <option value='all'>All Statuses</option>
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
            <option value='cancelled'>Cancelled</option>
          </select>
          <label className='inline-flex items-center gap-1 cursor-pointer'>
            <input type='checkbox' checked={autoRefresh} onChange={e=> setAutoRefresh(e.target.checked)} />
            <span>Auto-refresh</span>
          </label>
          <button onClick={()=> loadData()} className='px-2 py-1 border rounded hover:bg-slate-50'>Refresh</button>
          <div className='relative'>
            <span className='px-2 py-1 rounded bg-indigo-100 text-indigo-700'>Notifications</span>
            {notifications.length>0 && <span className='absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center'>{notifications.length}</span>}
          </div>
        </div>
      </div>
      <div className='space-y-4'>
  {filtered.map(b=> {
          const model = b.modelId ? models.find(m=>m.id===b.modelId) : null;
          const serviceType = b.extras?.serviceType || model?.type || (b.hotelId? 'hotel':'service');
          const nights = b.extras?.nights;
          const guests = b.extras?.guests;
          const checkOut = b.extras?.checkOut;
          return (
            <div key={b.id} className={`border rounded-lg p-4 bg-white shadow-sm relative ${changedIds.has(b.id)? 'ring-2 ring-indigo-400 animate-pulse':''}`}>
              {changedIds.has(b.id) && <span className='absolute top-2 right-2 text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded'>Updated</span>}
              <div className='flex items-start justify-between gap-4'>
                <div className='text-sm'>
                  <p className='font-medium'>#{b.id} • {(model && model.name) || (serviceType==='hotel' ? 'Hotel Stay' : b.name)} <span className='text-[10px] text-slate-500'>({serviceType})</span></p>
                  <p className='text-slate-500 text-xs'>Date: {b.date}{checkOut? ' → '+checkOut:''}</p>
                  {nights && <p className='text-slate-500 text-[11px]'>{nights} night{nights>1 && 's'}{guests? ` • ${guests} guest${guests>1?'s':''}`:''}</p>}
                  {b.startTime && serviceType!=='hotel' && <p className='text-slate-500 text-xs'>Time: {b.startTime}{b.endTime? ' - '+b.endTime:''}</p>}
                  {model && (model.origin || model.destination) && <p className='text-[11px] text-slate-400'>{model.origin||'—'} → {model.destination||'—'}</p>}
                  {b.promoCode && <p className='text-[11px] text-emerald-600'>Promo: {b.promoCode} (−₹{b.discount})</p>}
                  {b.finalPrice!=null && <p className='text-[11px] font-medium text-indigo-600'>Total: ₹{b.finalPrice}</p>}
                  <p className={`mt-1 inline-block px-2 py-0.5 rounded text-[11px] ${b.status==='pending'?'bg-amber-100 text-amber-700':b.status==='approved'?'bg-emerald-100 text-emerald-700':b.status==='cancelled'?'bg-slate-200 text-slate-600':'bg-rose-100 text-rose-700'}`}>{b.status}</p>
                  {b.status==='pending' && <button onClick={async()=>{ if(!window.confirm('Cancel this booking?')) return; try { await cancelBooking(b.id); const fresh = await fetchMyBookings(); setBookings(fresh); } catch { alert('Cancel failed'); } }} className='mt-2 text-[10px] px-2 py-1 rounded bg-slate-200 hover:bg-slate-300'>Cancel</button>}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <p className='text-sm text-slate-500'>No bookings for selected filter.</p>}
      </div>
      <p className='mt-8 text-[10px] text-slate-400'>Status legend: Pending = awaiting approval, Approved = confirmed, Rejected = declined.</p>
    </div>
  );
};

export default MyBookingsPage;
