import React, { useEffect, useState } from 'react';
import { fetchModels, bookModel, Model } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';

interface Props { defaultType?: string }
const ModelsList: React.FC<Props> = ({ defaultType }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [bookingModel, setBookingModel] = useState<Model | null>(null);
  const [form, setForm] = useState({ name: '', email: '', date: '', startTime:'', endTime:'' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { user } = useAuth();

  const [query, setQuery] = useState('');
  const [type, setType] = useState(defaultType || '');
  const navigate = useNavigate();

  useEffect(() => {
    fetchModels({ q: query || undefined, type: type || undefined }).then(setModels).catch(console.error);
  }, [query, type]);

  const openBooking = (m: Model) => {
    if(!user){
      setMessage('Please login to book.');
      return;
    }
    setBookingModel(m);
    setMessage(null);
  };
  const closeBooking = () => { setBookingModel(null); setForm({ name:'', email:'', date:'', startTime:'', endTime:'' }); };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModel) return;
    setLoading(true);
    try {
  await bookModel({ modelId: bookingModel.id, ...form });
      setMessage('Booking submitted! We will contact you.');
      setTimeout(closeBooking, 1500);
    } catch (err) {
      setMessage('Failed to book.');
    } finally { setLoading(false); }
  };

  return (
    <section id="models" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-indigo-700 flex items-center gap-3">Available Tours & Buses {user?.role === 'admin' && <span className='text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded'>Admin View</span>}</h2>
        <div className='mb-6 flex flex-col md:flex-row gap-3 md:items-center'>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder='Search by name, origin, destination...' className='flex-1 border rounded-md px-3 py-2 text-sm' />
          <select value={type} onChange={e=>setType(e.target.value)} className='border rounded-md px-3 py-2 text-sm w-40'>
            <option value=''>All Types</option>
            <option value='tour'>Tour</option>
            <option value='bus'>Bus</option>
          </select>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {models.map(m => (
            <div key={m.id} className="group p-5 rounded-xl border border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50 flex flex-col cursor-pointer hover:shadow-md transition" onClick={()=>navigate(`/listings/${m.id}`)}>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-800 mb-1">{m.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-3 mb-2">{m.description}</p>
                <p className="text-sm text-indigo-600 font-medium mb-1">Type: {m.type}</p>
                <p className='text-xs text-slate-500 mb-1'>{m.origin} → {m.destination}</p>
                {m.stops && m.stops.length>0 && <p className='text-[10px] text-slate-400 mb-1'>Stops: {m.stops.slice(0,3).join(', ')}{m.stops.length>3?'...':''}</p>}
                <p className="text-lg font-bold text-emerald-600 mb-4">₹ {m.price}</p>
              </div>
              {user && user.role !== 'admin' && (
                <button onClick={() => openBooking(m)} className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 text-sm font-medium transition">Book Now</button>
              )}
              {!user && (
                <a href={`/login?return=/listings/${m.id}`} className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 text-sm font-medium transition text-center">Login to Book</a>
              )}
            </div>
          ))}
          {models.length === 0 && <p className='text-slate-500 col-span-full text-center text-sm bg-slate-50 border border-dashed rounded-lg py-10'>Services coming soon. Stay tuned!</p>}
        </div>
      </div>

      {bookingModel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative">
            <button onClick={closeBooking} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">✕</button>
            <h3 className="text-xl font-semibold mb-2">Book: {bookingModel.name}</h3>
            <form onSubmit={submitBooking} className="space-y-4">
              <input required placeholder='Your Name' className='w-full border rounded-md px-3 py-2 text-sm' value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              <input required type='email' placeholder='Your Email' className='w-full border rounded-md px-3 py-2 text-sm' value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
              <input required type='date' className='w-full border rounded-md px-3 py-2 text-sm' value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
              <div className='grid grid-cols-2 gap-3'>
                <input required type='time' className='border rounded-md px-3 py-2 text-sm' value={form.startTime} onChange={e=>setForm(f=>({...f,startTime:e.target.value}))} />
                <input type='time' className='border rounded-md px-3 py-2 text-sm' value={form.endTime} onChange={e=>setForm(f=>({...f,endTime:e.target.value}))} />
              </div>
              <button disabled={loading} className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-md py-2 text-sm font-medium'>{loading ? 'Submitting...' : 'Confirm Booking'}</button>
              {message && <p className='text-center text-sm text-emerald-600'>{message}</p>}
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ModelsList;
