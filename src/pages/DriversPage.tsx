import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../siteSettingsContext';
import { getContactInfo } from '../api';

const DriversPage: React.FC = () => {
  const { settings } = useSiteSettings();
  const [contactInfo, setContactInfo] = useState<any>(null);
  useEffect(()=> { getContactInfo().then(setContactInfo).catch(()=>{}); }, []);

  const [form, setForm] = useState({
    name:'',
    phone:'',
    pickupLocation:'',
    date:'',
    requirement:'Hourly',
    hours:'4',
    message:''
  });

  const primaryRaw = contactInfo?.whatsapp || contactInfo?.phonePrimary || settings?.whatsapp || settings?.phone || '+91 91098 79836';
  const primary = (/(00000)/.test(primaryRaw)? '+91 91098 79836': primaryRaw).replace(/\D/g,'') || '919109879836';

  const handleChange = (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    setForm(f=> ({ ...f, [e.target.name]: e.target.value }));
  };

  const openChat = (prefill?:string) => {
    const msg = prefill || 'Hi, I need a driver.';
    window.open(`https://wa.me/${primary}?text=${encodeURIComponent(msg)}`,'_blank');
  };

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    const msg = `Driver Request:%0AName: ${form.name}%0APhone: ${form.phone}%0ADate: ${form.date || 'N/A'}%0ALocation: ${form.pickupLocation || 'N/A'}%0ARequirement: ${form.requirement}${form.requirement==='Hourly'? ' ('+form.hours+' hrs)':''}%0AMessage: ${form.message || '—'}`;
    window.open(`https://wa.me/${primary}?text=${msg}`,'_blank');
    setForm({ name:'', phone:'', pickupLocation:'', date:'', requirement:'Hourly', hours:'4', message:'' });
  };

  return (
    <div className='py-20 bg-gradient-to-b from-white via-slate-50 to-white'>
      <div className='max-w-5xl mx-auto px-6'>
        <h1 className='text-3xl font-bold text-indigo-700 mb-3'>Drivers for Personal Vehicles</h1>
        <p className='text-slate-600 text-sm mb-8 max-w-2xl'>Hire a professional, verified driver for your own car: hourly errands, daily office commute, outstation trips, late-night pickups or multi-day tours. Fast WhatsApp confirmation – no separate app required.</p>

        <div className='grid md:grid-cols-2 gap-10 items-start'>
          <div className='space-y-6'>
            <div className='p-5 rounded-xl border bg-white shadow-sm'>
              <h2 className='font-semibold text-slate-800 mb-2'>How it works</h2>
              <ol className='list-decimal list-inside text-xs leading-5 text-slate-600'>
                <li>Fill quick request form or tap Chat</li>
                <li>We respond with availability & estimate</li>
                <li>Confirm timing and driver is assigned</li>
              </ol>
            </div>
            <div className='p-5 rounded-xl border bg-white shadow-sm'>
              <h2 className='font-semibold text-slate-800 mb-2'>Popular Options</h2>
              <ul className='text-xs leading-5 text-slate-600'>
                <li>• Hourly (4 / 8 / 12 hours)</li>
                <li>• Outstation per-day basis</li>
                <li>• Airport pick & drop</li>
                <li>• Late night emergency driver</li>
                <li>• Corporate / Monthly engagement</li>
              </ul>
              <button onClick={()=> openChat()} className='mt-4 text-[12px] px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600'>Chat on WhatsApp</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='p-6 rounded-2xl border bg-white shadow-sm space-y-4'>
            <h2 className='text-lg font-semibold text-slate-800'>Request a Driver</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-[11px] font-medium text-slate-600 mb-1'>Name</label>
                <input name='name' value={form.name} onChange={handleChange} required className='w-full border rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500'/>
              </div>
              <div>
                <label className='block text-[11px] font-medium text-slate-600 mb-1'>Phone</label>
                <input name='phone' value={form.phone} onChange={handleChange} required className='w-full border rounded px-3 py-2 text-sm'/>
              </div>
              <div>
                <label className='block text-[11px] font-medium text-slate-600 mb-1'>Pickup Date</label>
                <input type='date' name='date' value={form.date} onChange={handleChange} className='w-full border rounded px-3 py-2 text-sm'/>
              </div>
              <div>
                <label className='block text-[11px] font-medium text-slate-600 mb-1'>Pickup Location</label>
                <input name='pickupLocation' value={form.pickupLocation} onChange={handleChange} placeholder='Area / Landmark' className='w-full border rounded px-3 py-2 text-sm'/>
              </div>
              <div>
                <label className='block text-[11px] font-medium text-slate-600 mb-1'>Requirement Type</label>
                <select name='requirement' value={form.requirement} onChange={handleChange} className='w-full border rounded px-3 py-2 text-sm'>
                  <option>Hourly</option>
                  <option>Daily</option>
                  <option>Outstation</option>
                  <option>Airport Pickup</option>
                  <option>Monthly</option>
                </select>
              </div>
              {form.requirement==='Hourly' && <div>
                <label className='block text-[11px] font-medium text-slate-600 mb-1'>Hours</label>
                <select name='hours' value={form.hours} onChange={handleChange} className='w-full border rounded px-3 py-2 text-sm'>
                  <option value='4'>4</option>
                  <option value='6'>6</option>
                  <option value='8'>8</option>
                  <option value='10'>10</option>
                  <option value='12'>12</option>
                </select>
              </div>}
            </div>
            <div>
              <label className='block text-[11px] font-medium text-slate-600 mb-1'>Additional Details</label>
              <textarea name='message' value={form.message} onChange={handleChange} rows={3} className='w-full border rounded px-3 py-2 text-sm resize-none' placeholder='Car type, timing, special notes...' />
            </div>
            <div className='flex items-center gap-3 pt-2'>
              <button type='submit' className='px-5 py-2 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700'>Send on WhatsApp</button>
              <button type='button' onClick={()=> openChat('Hi, I want to discuss driver availability.')} className='px-4 py-2 rounded bg-green-500 text-white text-xs hover:bg-green-600'>Quick Chat</button>
            </div>
            <p className='text-[10px] text-slate-400 pt-1'>We open WhatsApp with your details – no data stored on server yet.</p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default DriversPage;
