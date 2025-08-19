import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchModel, bookModel, Model, fetchReviews, createReview, Review, fetchModelAvailability } from '../api';
import { useAuth } from '../context';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [booking, setBooking] = useState({ name:'', email:'', checkIn:'', checkOut:'', guests:1, startTime:'', endTime:'', promoCode:'' });
  const [bookingMsg, setBookingMsg] = useState<string|null>(null);
  const [bookingBusy, setBookingBusy] = useState(false);
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating:'', comment:'' });
  const [reviewMsg, setReviewMsg] = useState<string|null>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  useEffect(()=> {
    if(!id) return;
  fetchModel(Number(id)).then(setModel).catch(()=>setError('Not found')).finally(()=>setLoading(false));
    fetchReviews(Number(id)).then(setReviews).catch(()=>{});
  fetchModelAvailability(Number(id)).then(d=>setBookedDates(d.bookedDates)).catch(()=>{});
  }, [id]);

  const submit = async (e:React.FormEvent) => {
    e.preventDefault(); if(!model) return; if(!user){ setBookingMsg('Please login first.'); return; } setBookingBusy(true);
  try {
    // For bus listings we ignore checkOut & guests; for tour maybe guests optional; for hotel (future separate page) we would send both.
    const extras:any = {};
    if(model.type !== 'bus') extras.guests = booking.guests;
    if(model.type !== 'bus' && booking.checkOut) extras.checkOut = booking.checkOut; // treat as multi-day only if provided
    await bookModel({ modelId: model.id, date: booking.checkIn, startTime: booking.startTime, endTime: booking.endTime, name: booking.name, email: booking.email, promoCode: booking.promoCode, extras });
    setBookingMsg('Request submitted! Pending admin approval.'); setBooking(b=>({...b,promoCode:''})); }
    catch { setBookingMsg('Failed'); }
    finally { setBookingBusy(false); }
  };

  const submitReview = async (e:React.FormEvent) => {
    e.preventDefault(); if(!user){ setReviewMsg('Login first'); return; }
    try { await createReview({ modelId:Number(id), rating:Number(reviewForm.rating), comment:reviewForm.comment }); setReviewForm({ rating:'', comment:'' }); setReviewMsg('Review added'); const list = await fetchReviews(Number(id)); setReviews(list);} catch { setReviewMsg('Failed'); }
  };
  // Moved before conditional returns to keep hook order consistent
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const toggleExpand = (rid:number) => setExpanded(e=>({...e,[rid]:!e[rid]}));

  if (loading) return <div className='max-w-4xl mx-auto p-8'>Loading...</div>;
  if (error || !model) return <div className='max-w-4xl mx-auto p-8 text-rose-600'>{error||'Not found'}</div>;

  const avgRating = reviews.length? (reviews.reduce((a,r)=>a + r.rating,0)/reviews.length).toFixed(2): null;

  return (
    <div className='max-w-6xl mx-auto px-6 py-10'>
      {/* Title + rating summary */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-slate-800'>{model.name}</h1>
        <div className='flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600'>
          {avgRating && <span className='flex items-center gap-1'><span className='text-amber-500'>★</span>{avgRating}</span>}
          <span>{reviews.length} review{reviews.length!==1 && 's'}</span>
          <span>• Route: {model.origin} → {model.destination}</span>
          {model.stops && model.stops.length>0 && <span>• {model.stops.length} stop{model.stops.length>1 && 's'}</span>}
        </div>
      </div>
      {/* Gallery: show only if an image is available (no blank space otherwise) */}
      {model.image && (
        <div className='mb-10'>
          <img
            src={model.image}
            alt={model.name}
            className='w-full max-h-[480px] object-cover rounded-xl'
          />
        </div>
      )}
      <div className='flex flex-col lg:flex-row gap-12'>
        <div className='flex-1 min-w-0'>
          <p className='text-slate-700 leading-relaxed mb-6'>{model.description}</p>
          <div className='space-y-2 text-sm text-slate-700'>
            {model.itinerary && <p><span className='font-semibold'>Itinerary:</span> {model.itinerary}</p>}
            {model.details && <p><span className='font-semibold'>Details:</span> {model.details}</p>}
            {(model as any).departureTime && <p><span className='font-semibold'>Departure:</span> {(model as any).departureTime}</p>}
            {(model as any).arrivalTime && <p><span className='font-semibold'>Arrival:</span> {(model as any).arrivalTime}</p>}
          </div>
          {/* Reviews Summary */}
          <div id='reviews' className='mt-14'>
            <h2 className='text-2xl font-semibold mb-4 flex items-center gap-3'>{avgRating && <><span className='flex items-center gap-1 text-amber-500'>★ {avgRating}</span> <span className='text-slate-400'>·</span></>} {reviews.length} review{reviews.length!==1 && 's'}</h2>
            {reviews.length>0 ? (
              <div className='grid md:grid-cols-2 gap-6'>
                {reviews.map(r=> {
                  const full = expanded[r.id];
                  const text = r.comment || '';
                  const truncated = text.length>140 && !full ? text.slice(0,140)+'…' : text;
                  return (
                    <div key={r.id} className='border rounded-xl p-4 bg-white shadow-sm'>
                      <div className='flex items-center gap-2 text-xs text-slate-500 mb-2'>
                        <span className='text-amber-500'>★ {r.rating}</span>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      {text && <p className='text-sm text-slate-700 whitespace-pre-line'>{truncated}</p>}
                      {text.length>140 && <button type='button' onClick={()=>toggleExpand(r.id)} className='mt-2 text-xs font-medium underline'>{full? 'Show less':'Show more'}</button>}
                    </div>
                  );
                })}
              </div>
            ) : <p className='text-sm text-slate-500'>No reviews yet.</p>}
            {/* Add Review */}
            <div className='mt-10 max-w-md'>
              <h3 className='text-lg font-semibold mb-3'>Add a Review</h3>
              <form onSubmit={submitReview} className='space-y-3 bg-white border rounded-xl p-5 shadow-sm'>
                <select required className='w-full border rounded-md px-3 py-2 text-sm' value={reviewForm.rating} onChange={e=>setReviewForm(f=>({...f,rating:e.target.value}))}>
                  <option value=''>Rating</option>
                  {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
                </select>
                <textarea placeholder='Comment (optional)' className='w-full border rounded-md px-3 py-2 text-sm' value={reviewForm.comment} onChange={e=>setReviewForm(f=>({...f,comment:e.target.value}))} />
                <button className='w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 text-sm font-medium'>Submit Review</button>
                {reviewMsg && <p className='text-xs text-center text-emerald-600'>{reviewMsg}</p>}
              </form>
            </div>
          </div>
        </div>
        {/* Booking panel: only for authenticated non-admin users */}
        {user && user.role !== 'admin' && (
          <div className='w-full lg:w-80 lg:sticky lg:top-24 h-fit bg-white border rounded-2xl shadow-md p-6'>
            <div className='flex items-baseline justify-between mb-4'>
              <p className='text-xl font-semibold'>₹ {model.price} <span className='text-sm font-normal text-slate-500'>/ night</span></p>
              {avgRating && <p className='text-sm flex items-center gap-1'><span className='text-amber-500'>★</span>{avgRating}<span className='text-slate-400'>·</span>{reviews.length}</p>}
            </div>
            <form onSubmit={submit} className='space-y-4'>
              <div className='grid grid-cols-2 border rounded-lg overflow-hidden'>
                <div className='p-3 border-r'>
                  <label className='block text-[10px] font-semibold tracking-wide'>{model.type==='bus'? 'DATE':'CHECK-IN'}</label>
                  <input required type='date' className='w-full text-sm outline-none mt-1' value={booking.checkIn} onChange={e=>{ const v=e.target.value; if(bookedDates.includes(v)){ alert('Date unavailable'); return;} setBooking(b=>({...b,checkIn:v})); }} />
                </div>
                {model.type!=='bus' && (
                  <div className='p-3'>
                    <label className='block text-[10px] font-semibold tracking-wide'>CHECK-OUT (optional)</label>
                    <input type='date' className='w-full text-sm outline-none mt-1' value={booking.checkOut} onChange={e=>{ const v=e.target.value; if(bookedDates.includes(v)){ alert('Date unavailable'); return;} setBooking(b=>({...b,checkOut:v})); }} />
                  </div>
                )}
              </div>
              {model.type!=='hotel' && (
                <div className='grid grid-cols-2 gap-3'>
                  <input required type='time' className='border rounded-md px-3 py-2 text-sm' value={booking.startTime} onChange={e=>setBooking(b=>({...b,startTime:e.target.value}))} />
                  <input type='time' className='border rounded-md px-3 py-2 text-sm' value={booking.endTime} onChange={e=>setBooking(b=>({...b,endTime:e.target.value}))} />
                </div>
              )}
              {model.type!=='bus' && (
                <div>
                  <label className='block text-[10px] font-semibold tracking-wide mb-1'>GUESTS</label>
                  <input type='number' min={1} className='w-full border rounded-md px-3 py-2 text-sm' value={booking.guests} onChange={e=>setBooking(b=>({...b,guests:Number(e.target.value)||1}))} />
                </div>
              )}
              <input placeholder='Promo Code (optional)' className='w-full border rounded-md px-3 py-2 text-sm uppercase' value={booking.promoCode} onChange={e=>setBooking(b=>({...b,promoCode:e.target.value}))} />
              <button disabled={bookingBusy} className='w-full bg-gradient-to-r from-rose-600 to-fuchsia-600 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg py-3 text-sm font-medium disabled:opacity-60'>{bookingBusy? 'Reserving...':'Reserve'}</button>
              {bookingMsg && <p className='text-xs text-center text-emerald-600'>{bookingMsg}</p>}
              <p className='text-[11px] text-center text-slate-500 -mt-1'>You won't be charged yet</p>
            </form>
          </div>
        )}
        {!user && (
          <div className='w-full lg:w-80 lg:sticky lg:top-24 h-fit bg-white border rounded-2xl shadow-md p-6 flex flex-col items-center justify-center text-center gap-4'>
            <p className='text-sm text-slate-700'>Please log in to make a booking.</p>
            <a href={`/login?return=/listings/${model.id}`} className='w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 text-sm font-medium'>Login to Book</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetailPage;
