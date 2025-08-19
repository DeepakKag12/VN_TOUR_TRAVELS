import React, { useEffect, useState } from 'react';
import { createRental } from '../api';
import { fetchRentalItems, RentalInventoryItem, createRentalItem, updateRentalItem, deleteRentalItem } from '../api';
import { useAuth } from '../context';

const RentalsPage: React.FC = () => {
  const [form, setForm] = useState({ vehicleType: 'bus', startDate: '', endDate: '', pickupLocation: '', dropLocation: '', name: '', email: '', passengers: '', notes: '', pickupTime:'', returnTime:'' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [items, setItems] = useState<RentalInventoryItem[]>([]);
  const [invLoading,setInvLoading] = useState(false);
  const [modal,setModal] = useState<{mode:'create'|'edit'; item?:RentalInventoryItem}|null>(null);
  const [invForm,setInvForm] = useState<any>({ name:'', category:'car', pricePerDay:'', description:'', amenities:'' });
  const [invFile,setInvFile] = useState<File|null>(null);
  const { user } = useAuth();

  const loadInventory = ()=> { setInvLoading(true); fetchRentalItems().then(setItems).finally(()=>setInvLoading(false)); };
  useEffect(()=> { loadInventory(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createRental({
        vehicleType: form.vehicleType,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        pickupLocation: form.pickupLocation || undefined,
        dropLocation: form.dropLocation || undefined,
        pickupTime: form.pickupTime || undefined,
        returnTime: form.returnTime || undefined,
        name: form.name,
        email: form.email,
        passengers: form.passengers ? Number(form.passengers) : undefined,
        notes: form.notes || undefined,
        type: 'rental'
      } as any);
      setMessage('Request submitted! We will reach out.');
      setForm({ vehicleType: 'bus', startDate: '', endDate: '', pickupLocation: '', dropLocation: '', name: '', email: '', passengers: '', notes: '', pickupTime:'', returnTime:'' });
    } catch {
      setMessage('Failed to submit');
    } finally { setLoading(false); }
  };

  const openCreate = ()=> { setModal({ mode:'create' }); setInvForm({ name:'', category:'car', pricePerDay:'', description:'', amenities:'' }); setInvFile(null); };
  const openEdit = (it:RentalInventoryItem)=> { setModal({ mode:'edit', item:it }); setInvForm({ name:it.name, category:it.category, pricePerDay:it.pricePerDay, description:it.description||'', amenities:(it.amenities||[]).join(',') }); setInvFile(null); };
  const saveInventory = async (e:React.FormEvent)=> { e.preventDefault(); try { if(modal?.mode==='create') await createRentalItem(invForm, invFile); else if(modal?.item) await updateRentalItem(modal.item.id, invForm, invFile); setModal(null); loadInventory(); } catch { alert('Save failed'); } };
  const removeItem = async (it:RentalInventoryItem)=> { if(!window.confirm('Delete item?')) return; try { await deleteRentalItem(it.id); loadInventory(); } catch { alert('Delete failed'); } };

  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-6'>
        <h1 className='text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-4'>Rental Services {user?.role==='admin' && <button onClick={openCreate} className='text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded'>Add Item</button>}</h1>
        <p className='text-slate-600 mb-8 text-sm leading-relaxed'>Browse available rental vehicles. Submit a request below and we'll confirm pricing & availability.</p>
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-14'>
          {invLoading && <p className='text-sm text-slate-500'>Loading inventory...</p>}
          {!invLoading && items.map(it=> (
            <div key={it.id} className='border rounded-xl p-5 bg-gradient-to-br from-white to-slate-50 shadow-sm flex flex-col'>
              {it.image && <img src={it.image} alt={it.name} className='w-full h-40 object-cover rounded-md mb-3' />}
              <h3 className='text-lg font-semibold text-slate-800'>{it.name}</h3>
              <p className='text-xs text-slate-500 mb-1 capitalize'>{it.category}</p>
              <p className='text-sm text-slate-600 line-clamp-3 mb-2'>{it.description}</p>
              <p className='text-emerald-600 font-medium text-sm mb-2'>₹ {it.pricePerDay} / day</p>
              {user?.role==='admin' && (
                <div className='mt-auto flex gap-2 pt-2'>
                  <button onClick={()=>openEdit(it)} className='text-[11px] px-2 py-1 rounded bg-slate-200 hover:bg-slate-300'>Edit</button>
                  <button onClick={()=>removeItem(it)} className='text-[11px] px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700'>Delete</button>
                </div>
              )}
            </div>
          ))}
          {!invLoading && items.length===0 && <p className='text-sm text-slate-500 col-span-full text-center bg-slate-50 border border-dashed rounded-lg py-10'>No rental items yet.</p>}
        </div>
        {/* Rental Request Form */}
        <h2 className='text-xl font-semibold mb-4'>Request a Rental</h2>
        <form onSubmit={submit} className='space-y-4 bg-slate-50 p-6 rounded-xl border shadow-sm max-w-3xl'>
          <div className='grid md:grid-cols-3 gap-4'>
            <select className='border rounded-md px-3 py-2 text-sm' value={form.vehicleType} onChange={e=>setForm(f=>({...f, vehicleType:e.target.value}))}>
              <option value='bus'>Bus</option><option value='cab'>Cab</option><option value='bike'>Bike</option>
            </select>
            <input type='date' className='border rounded-md px-3 py-2 text-sm' value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} required />
            <input type='date' className='border rounded-md px-3 py-2 text-sm' value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} />
          </div>
          <div className='grid md:grid-cols-2 gap-4'>
            <input placeholder='Pickup Location' className='border rounded-md px-3 py-2 text-sm' value={form.pickupLocation} onChange={e=>setForm(f=>({...f,pickupLocation:e.target.value}))} />
            <input placeholder='Drop Location' className='border rounded-md px-3 py-2 text-sm' value={form.dropLocation} onChange={e=>setForm(f=>({...f,dropLocation:e.target.value}))} />
          </div>
          <div className='grid md:grid-cols-2 gap-4'>
            <input placeholder='Your Name' className='border rounded-md px-3 py-2 text-sm' value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
            <input type='email' placeholder='Your Email' className='border rounded-md px-3 py-2 text-sm' value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required />
          </div>
          <div className='grid md:grid-cols-3 gap-4'>
            <input placeholder='Passengers (optional)' className='border rounded-md px-3 py-2 text-sm' value={form.passengers} onChange={e=>setForm(f=>({...f,passengers:e.target.value}))} />
            <input type='time' className='border rounded-md px-3 py-2 text-sm' value={form.pickupTime} onChange={e=>setForm(f=>({...f,pickupTime:e.target.value}))} />
            <input type='time' className='border rounded-md px-3 py-2 text-sm' value={form.returnTime} onChange={e=>setForm(f=>({...f,returnTime:e.target.value}))} />
          </div>
          <textarea placeholder='Notes / Requirements (optional)' className='w-full border rounded-md px-3 py-2 text-sm' value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
          <button disabled={loading} className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-md py-3 text-sm font-medium'>{loading? 'Submitting...':'Submit Rental Request'}</button>
          {message && <p className='text-sm text-center text-emerald-600'>{message}</p>}
        </form>
      </div>

      {modal && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <form onSubmit={saveInventory} className='bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-3 relative'>
            <button type='button' onClick={()=>setModal(null)} className='absolute top-3 right-3 text-slate-400 hover:text-slate-600'>✕</button>
            <h3 className='text-lg font-semibold'>{modal.mode==='create'? 'Add Rental Item':'Edit Rental Item'}</h3>
            <input required placeholder='Name' className='w-full border rounded-md px-3 py-2 text-sm' value={invForm.name} onChange={e=>setInvForm((f:any)=>({...f,name:e.target.value}))} />
            <select className='w-full border rounded-md px-3 py-2 text-sm' value={invForm.category} onChange={e=>setInvForm((f:any)=>({...f,category:e.target.value}))}>
              <option value='car'>Car</option><option value='bike'>Bike</option><option value='other'>Other</option>
            </select>
            <input required placeholder='Price Per Day' className='w-full border rounded-md px-3 py-2 text-sm' value={invForm.pricePerDay} onChange={e=>setInvForm((f:any)=>({...f,pricePerDay:e.target.value}))} />
            <textarea placeholder='Description' className='w-full border rounded-md px-3 py-2 text-sm' value={invForm.description} onChange={e=>setInvForm((f:any)=>({...f,description:e.target.value}))} />
            <input placeholder='Amenities (comma separated)' className='w-full border rounded-md px-3 py-2 text-sm' value={invForm.amenities} onChange={e=>setInvForm((f:any)=>({...f,amenities:e.target.value}))} />
            <input type='file' onChange={e=>setInvFile(e.target.files?.[0]||null)} />
            <div className='flex gap-3 pt-2'>
              <button className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 text-sm'>{modal.mode==='create'? 'Create':'Save'}</button>
              <button type='button' onClick={()=>setModal(null)} className='px-4 py-2 text-sm rounded-md border'>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default RentalsPage;
