import React, { useEffect, useState } from 'react';
import { fetchHotels, createHotel, updateHotel, deleteHotel, Hotel, bookModel, fetchHotelAvailability, fetchPromos } from '../api';
import { useAuth } from '../context';

const HotelBookingsPage: React.FC = () => {
  const [hotels,setHotels] = useState<Hotel[]>([]);
  const [loading,setLoading] = useState(false);
  const [q,setQ] = useState('');
  const [city,setCity] = useState('');
  const [modal,setModal] = useState<{mode:'create'|'edit'; hotel?:Hotel}|null>(null);
  const [bookingHotel,setBookingHotel] = useState<Hotel|null>(null);
  const [bookingForm,setBookingForm] = useState({ checkIn:'', checkOut:'', guests:1, promoCode:'' });
  const [hotelAvailability,setHotelAvailability] = useState<string[]>([]);
  const [promos,setPromos] = useState<any[]>([]);
  const [bookingMsg,setBookingMsg] = useState<string|null>(null);
  const [bookingBusy,setBookingBusy] = useState(false);
  const [form,setForm] = useState<any>({ name:'', city:'', pricePerNight:'', description:'', amenities:'' });
  const [file,setFile] = useState<File|null>(null);
  const { user } = useAuth();

  const load = ()=> { setLoading(true); fetchHotels({ q: q||undefined, city: city||undefined }).then(setHotels).finally(()=>setLoading(false)); };
  useEffect(()=> { load(); }, [q, city]);

  const openCreate = ()=> { setModal({ mode:'create' }); setForm({ name:'', city:'', pricePerNight:'', description:'', amenities:'' }); setFile(null); };
  const openEdit = (h:Hotel)=> { setModal({ mode:'edit', hotel:h }); setForm({ name:h.name, city:h.city||'', pricePerNight:h.pricePerNight, description:h.description||'', amenities:(h.amenities||[]).join(',') }); setFile(null); };
  const save = async (e:React.FormEvent)=> { e.preventDefault(); try { if(modal?.mode==='create') await createHotel(form, file); else if(modal?.hotel) await updateHotel(modal.hotel.id, form, file); setModal(null); load(); } catch { alert('Save failed'); } };
  const removeH = async (h:Hotel)=> { if(!window.confirm('Delete hotel?')) return; try { await deleteHotel(h.id); load(); } catch { alert('Delete failed'); } };

  return (
    <div className='py-20'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex flex-col md:flex-row md:items-center gap-4 mb-6'>
          <h1 className='text-3xl font-bold text-indigo-700 flex-1'>Hotels</h1>
          <input placeholder='Search hotels' className='border rounded-md px-3 py-2 text-sm' value={q} onChange={e=>setQ(e.target.value)} />
          <input placeholder='City' className='border rounded-md px-3 py-2 text-sm w-40' value={city} onChange={e=>setCity(e.target.value)} />
          {user?.role==='admin' && <button onClick={openCreate} className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm'>Add Hotel</button>}
        </div>
        {loading && <p className='text-sm text-slate-500'>Loading...</p>}
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {!loading && hotels.map(h=> (
            <div key={h.id} className='border rounded-xl p-5 bg-gradient-to-br from-white to-slate-50 shadow-sm flex flex-col'>
              {h.image && <img src={h.image} alt={h.name} className='w-full h-40 object-cover rounded-md mb-3' />}
              <h3 className='text-lg font-semibold text-slate-800'>{h.name}</h3>
              <p className='text-xs text-slate-500 mb-1'>{h.city}</p>
              <p className='text-sm text-slate-600 line-clamp-3 mb-2'>{h.description}</p>
              <p className='text-emerald-600 font-medium text-sm mb-2'>₹ {h.pricePerNight} / night</p>
              <div className='mt-auto flex gap-2 pt-2'>
                {user?.role==='admin' && <>
                  <button onClick={()=>openEdit(h)} className='text-[11px] px-2 py-1 rounded bg-slate-200 hover:bg-slate-300'>Edit</button>
                  <button onClick={()=>removeH(h)} className='text-[11px] px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700'>Delete</button>
                </>}
                {user && user.role!=='admin' && <button onClick={()=>{ setBookingHotel(h); setBookingForm({ checkIn:'', checkOut:'', guests:1, promoCode:'' }); setBookingMsg(null); setHotelAvailability([]); fetchHotelAvailability(h.id).then(d=>setHotelAvailability(d.bookedDates)).catch(()=>{}); fetchPromos().then(setPromos).catch(()=>{}); }} className='text-[11px] px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700'>Book</button>}
                {!user && <a href='/login?return=/hotel-bookings' className='text-[11px] px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700'>Login to Book</a>}
              </div>
            </div>
          ))}
          {!loading && hotels.length===0 && <p className='text-sm text-slate-500 col-span-full text-center bg-slate-50 border border-dashed rounded-lg py-10'>No hotels found.</p>}
        </div>
      </div>
  {modal && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <form onSubmit={save} className='bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-3 relative'>
            <button type='button' onClick={()=>setModal(null)} className='absolute top-3 right-3 text-slate-400 hover:text-slate-600'>✕</button>
            <h3 className='text-lg font-semibold'>{modal.mode==='create'? 'Add Hotel':'Edit Hotel'}</h3>
            <input required placeholder='Name' className='w-full border rounded-md px-3 py-2 text-sm' value={form.name} onChange={e=>setForm((f:any)=>({...f,name:e.target.value}))} />
            <input placeholder='City' className='w-full border rounded-md px-3 py-2 text-sm' value={form.city} onChange={e=>setForm((f:any)=>({...f,city:e.target.value}))} />
            <input required placeholder='Price Per Night' className='w-full border rounded-md px-3 py-2 text-sm' value={form.pricePerNight} onChange={e=>setForm((f:any)=>({...f,pricePerNight:e.target.value}))} />
            <textarea placeholder='Description' className='w-full border rounded-md px-3 py-2 text-sm' value={form.description} onChange={e=>setForm((f:any)=>({...f,description:e.target.value}))} />
            <input placeholder='Amenities (comma separated)' className='w-full border rounded-md px-3 py-2 text-sm' value={form.amenities} onChange={e=>setForm((f:any)=>({...f,amenities:e.target.value}))} />
            <input type='file' onChange={e=>setFile(e.target.files?.[0]||null)} />
            <div className='flex gap-3 pt-2'>
              <button className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 text-sm'>{modal.mode==='create'? 'Create':'Save'}</button>
              <button type='button' onClick={()=>setModal(null)} className='px-4 py-2 text-sm rounded-md border'>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {bookingHotel && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <form onSubmit={async e=>{ e.preventDefault(); if(!user) return; if(!bookingForm.checkIn || !bookingForm.checkOut){ setBookingMsg('Select dates'); return;} if(new Date(bookingForm.checkOut)<=new Date(bookingForm.checkIn)){ setBookingMsg('Check-out must be after check-in'); return;} setBookingBusy(true); setBookingMsg(null); try { await bookModel({ hotelId: bookingHotel.id, date: bookingForm.checkIn, name: user.username, email: user.email, promoCode: bookingForm.promoCode, extras: { checkOut: bookingForm.checkOut, guests: bookingForm.guests } }); setBookingMsg('Request submitted! Pending approval.'); } catch { setBookingMsg('Failed'); } finally { setBookingBusy(false); }} } className='bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-3 relative'>
            <button type='button' onClick={()=>setBookingHotel(null)} className='absolute top-3 right-3 text-slate-400 hover:text-slate-600'>✕</button>
            <h3 className='text-lg font-semibold'>Book: {bookingHotel.name}</h3>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-[10px] font-semibold mb-1'>Check-In</label>
                <input required type='date' className='w-full border rounded-md px-3 py-2 text-sm' value={bookingForm.checkIn} onChange={e=>{ const v=e.target.value; if(hotelAvailability.includes(v)){ alert('Date unavailable'); return;} setBookingForm(f=>({...f,checkIn:v})); }} />
              </div>
              <div>
                <label className='block text-[10px] font-semibold mb-1'>Check-Out</label>
                <input required type='date' className='w-full border rounded-md px-3 py-2 text-sm' value={bookingForm.checkOut} onChange={e=>{ const v=e.target.value; if(hotelAvailability.includes(v)){ alert('Date unavailable'); return;} setBookingForm(f=>({...f,checkOut:v})); }} />
              </div>
            </div>
            <div>
              <label className='block text-[10px] font-semibold mb-1'>Guests</label>
              <input type='number' min={1} className='w-full border rounded-md px-3 py-2 text-sm' value={bookingForm.guests} onChange={e=>setBookingForm(f=>({...f,guests:Number(e.target.value)||1}))} />
            </div>
            <input placeholder='Promo Code (optional)' className='w-full border rounded-md px-3 py-2 text-sm uppercase' value={bookingForm.promoCode} onChange={e=>setBookingForm(f=>({...f,promoCode:e.target.value}))} />
            {(() => {
              if(!bookingForm.checkIn || !bookingForm.checkOut) return null;
              const start = new Date(bookingForm.checkIn); const end = new Date(bookingForm.checkOut); if(end<=start) return <p className='text-[11px] text-rose-600'>Invalid date range</p>;
              const nights = Math.round((end.getTime()-start.getTime())/(1000*60*60*24));
              let base = nights * bookingHotel.pricePerNight;
              let discount = 0;
              if(bookingForm.promoCode){
                const promo = promos.find(p=>p.code.toUpperCase()===bookingForm.promoCode.toUpperCase() && p.active);
                if(promo){ discount = promo.type==='percent'? (base * promo.value)/100 : promo.value; if(discount>base) discount=base; }
              }
              const total = base - discount;
              return <div className='text-xs bg-slate-50 border rounded-md p-2'>
                <p><span className='font-medium'>{nights}</span> night{nights>1 && 's'} × ₹{bookingHotel.pricePerNight} = ₹{base}</p>
                {discount>0 && <p className='text-emerald-600'>Discount −₹{discount}</p>}
                <p className='font-semibold text-indigo-600'>Estimated Total: ₹{total}</p>
              </div>;
            })()}
            {hotelAvailability.length>0 && <p className='text-[10px] text-slate-500'>Booked: {hotelAvailability.slice(0,6).join(', ')}{hotelAvailability.length>6?'…':''}</p>}
            <button disabled={bookingBusy} className='w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 text-sm font-medium disabled:opacity-60'>{bookingBusy? 'Submitting...':'Confirm Booking'}</button>
            {bookingMsg && <p className='text-xs text-center text-emerald-600'>{bookingMsg}</p>}
            <p className='text-[10px] text-center text-slate-500'>You will receive confirmation after admin approval.</p>
          </form>
        </div>
      )}
    </div>
  );
};
export default HotelBookingsPage;
