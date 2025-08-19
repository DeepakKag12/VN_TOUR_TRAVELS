import React, { useEffect, useState } from 'react';
import { fetchMyBookings, fetchModels, fetchHotels, cancelBooking } from '../api';
import { useAuth } from '../context';

interface TimelineEntry { id:number; service:string; created:string; updated:string; status:string; range?:string; amount?:number; name?:string; }

const statusColor = (s:string) => s==='approved'? 'text-emerald-600 border-emerald-200 bg-emerald-50': s==='pending'? 'text-amber-600 border-amber-200 bg-amber-50': s==='rejected'? 'text-rose-600 border-rose-200 bg-rose-50':'text-slate-600 border-slate-200 bg-slate-50';

const StatusPage: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>();
  const [lastRefresh, setLastRefresh] = useState<Date|null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const load = async () => {
    if(!user) return;
    try {
      const [data, models, hotels] = await Promise.all([
        fetchMyBookings(),
        fetchModels().catch(()=>[]),
        fetchHotels().catch(()=>[])
      ]);
      const mapped:TimelineEntry[] = data.map((b:any)=> {
        const service = b.extras?.serviceType || (b.hotelId? 'hotel':'service');
        let name:string|undefined;
        if(b.modelId){
          const m = (models as any[]).find(mm=> mm.id===b.modelId);
          name = m?.name;
        } else if(b.hotelId){
          const h = (hotels as any[]).find(hh=> hh.id===b.hotelId);
          name = h?.name;
        }
        return {
          id: b.id,
          service,
          name,
          created: b.createdAt ? new Date(b.createdAt).toISOString(): '',
          updated: b.updatedAt || b.createdAt || '',
          status: b.status,
          range: b.extras?.checkOut ? `${b.date} → ${b.extras.checkOut}` : b.date,
          amount: b.finalPrice
        };
      }).sort((a:TimelineEntry,b:TimelineEntry)=> b.id - a.id);
      setEntries(mapped);
      setLastRefresh(new Date());
    } catch(e:any){ setError('Failed to load'); } finally { setLoading(false); }
  };
  useEffect(()=> { if(user){ load(); } else { setLoading(false); } }, [user]);
  useEffect(()=> { if(!user || !autoRefresh) return; const t = setInterval(()=> load(), 15000); return ()=> clearInterval(t); }, [user, autoRefresh]);

  if(!user) return <div className='max-w-4xl mx-auto p-8 text-sm'>Login to view status.</div>;
  if(loading) return <div className='max-w-4xl mx-auto p-8 text-sm'>Loading...</div>;
  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>
      <div className='flex flex-wrap items-center justify-between gap-4 mb-8'>
        <h1 className='text-2xl font-bold'>Booking Status Timeline</h1>
        <div className='flex items-center gap-3 text-xs'>
          <label className='inline-flex items-center gap-1 cursor-pointer'>
            <input type='checkbox' checked={autoRefresh} onChange={e=> setAutoRefresh(e.target.checked)} /> Auto-refresh
          </label>
          <button onClick={()=> load()} className='px-3 py-1 border rounded hover:bg-slate-50'>Refresh</button>
          {lastRefresh && <span className='text-[10px] text-slate-500'>Updated {lastRefresh.toLocaleTimeString()}</span>}
        </div>
      </div>
      {error && <div className='mb-4 text-sm text-rose-600'>{error}</div>}
      <div className='relative pl-4 border-l border-slate-200'>
        {entries.map(e=> (
          <div key={e.id} className='mb-8 ml-2 relative'>
            <span className={`absolute -left-[17px] top-1 w-3.5 h-3.5 rounded-full border-2 ${e.status==='approved'? 'border-emerald-500 bg-emerald-500': e.status==='rejected'? 'border-rose-500 bg-rose-500': e.status==='pending'? 'border-amber-400 bg-amber-400':'border-slate-400 bg-slate-400'}`}></span>
            <div className={`rounded-lg border p-4 shadow-sm ${statusColor(e.status)}`}> 
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <p className='text-sm font-semibold'>Booking #{e.id} {e.name && <span className='font-normal'>• {e.name}</span>} <span className='text-[10px] font-normal text-slate-500'>({e.service})</span></p>
                <div className='flex items-center gap-2'>
                  <span className='text-[10px] uppercase tracking-wide font-medium'>{e.status}</span>
                  {e.status==='pending' && <button onClick={async()=>{ if(!window.confirm('Cancel this booking?')) return; try { await cancelBooking(e.id); load(); } catch { alert('Cancel failed'); } }} className='text-[10px] px-2 py-1 rounded bg-slate-200 hover:bg-slate-300'>Cancel</button>}
                </div>
              </div>
              <p className='text-xs mt-1'>{e.range}</p>
              {e.amount!=null && <p className='text-[11px] mt-1 font-medium'>Amount: ₹{e.amount}</p>}
              <p className='text-[10px] mt-2 text-slate-500'>Created: {e.created? new Date(e.created).toLocaleString(): '—'}{e.updated && e.updated!==e.created && <> • Updated: {new Date(e.updated).toLocaleString()}</>}</p>
            </div>
          </div>
        ))}
        {entries.length===0 && <p className='text-sm text-slate-500'>No bookings yet.</p>}
      </div>
      <p className='mt-10 text-[10px] text-slate-400'>Track each booking's lifecycle from pending to approved or rejected. Refresh or enable auto-refresh for near real-time updates.</p>
    </div>
  );
};

export default StatusPage;
