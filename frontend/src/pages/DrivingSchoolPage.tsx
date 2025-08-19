import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../siteSettingsContext';
import { getContactInfo } from '../api';

const DrivingSchoolPage: React.FC = () => {
  const { settings } = useSiteSettings();
  const [contactInfo, setContactInfo] = useState<any>(null);
  useEffect(()=> { getContactInfo().then(setContactInfo).catch(()=>{}); }, []);
  const [form, setForm] = useState({ name:'', phone:'', course:'Learner', preferredSlot:'Morning', startWeek:'', notes:'' });
  const primaryRaw = contactInfo?.whatsapp || contactInfo?.phonePrimary || settings?.whatsapp || settings?.phone || '+91 91098 79836';
  const primary = (/(00000)/.test(primaryRaw)? '+91 91098 79836': primaryRaw).replace(/\D/g,'') || '919109879836';
  const handleChange = (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => { setForm(f=> ({ ...f, [e.target.name]: e.target.value })); };
  const sendWhatsApp = (msg:string) => window.open(`https://wa.me/${primary}?text=${encodeURIComponent(msg)}`,'_blank');
  const handleSubmit = (e:React.FormEvent) => { e.preventDefault(); const msg = `Driving School Enquiry:%0AName: ${form.name}%0APhone: ${form.phone}%0ACourse: ${form.course}%0APref Slot: ${form.preferredSlot}%0AStart Week: ${form.startWeek || 'Flexible'}%0ANotes: ${form.notes || '—'}`; sendWhatsApp(msg); setForm({ name:'', phone:'', course:'Learner', preferredSlot:'Morning', startWeek:'', notes:'' }); };
  return (
    <div className='py-20 bg-gradient-to-b from-white via-slate-50 to-white'>
      <div className='max-w-5xl mx-auto px-6'>
        <h1 className='text-3xl font-bold text-indigo-700 mb-3'>Driving School</h1>
        <p className='text-slate-600 text-sm mb-8 max-w-2xl'>Enroll in structured driving lessons: basic learner training, refresher, highway confidence, or advanced defensive modules. Quick WhatsApp enrollment – instant response.</p>
        <div className='grid md:grid-cols-2 gap-10 items-start'>
          <div className='space-y-6'>
            <div className='p-5 rounded-xl border bg-white shadow-sm'>
              <h2 className='font-semibold text-slate-800 mb-2'>Courses</h2>
              <ul className='text-xs leading-5 text-slate-600'>
                <li>• Learner (10 - 15 sessions)</li>
                <li>• Refresher (5 - 7 sessions)</li>
                <li>• Defensive & Highway</li>
                <li>• Automatic Car Module</li>
                <li>• Test Preparation & RTO Assist</li>
              </ul>
            </div>
            <div className='p-5 rounded-xl border bg-white shadow-sm'>
              <h2 className='font-semibold text-slate-800 mb-2'>Why Us</h2>
              <ul className='text-xs leading-5 text-slate-600'>
                <li>• Certified instructors</li>
                <li>• Dual-control cars</li>
                <li>• Female trainer option</li>
                <li>• Pick-up & drop (select areas)</li>
                <li>• Progress tracking sheet</li>
              </ul>
              <button onClick={()=> sendWhatsApp('Hi, I want info about driving courses.')} className='mt-4 text-[12px] px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600'>Chat on WhatsApp</button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className='p-6 rounded-2xl border bg-white shadow-sm space-y-4'>
            <h2 className='text-lg font-semibold text-slate-800'>Quick Enquiry</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-[11px] font-medium text-slate-600 mb-1'>Name</label>
                <input name='name' value={form.name} onChange={handleChange} required className='w-full border rounded px-3 py-2 text-sm'/>
              </div>
              <div>
                <label className='block text-[11px] font-medium text-slate-600 mb-1'>Phone</label>
                <input name='phone' value={form.phone} onChange={handleChange} required className='w-full border rounded px-3 py-2 text-sm'/>
              </div>
              <div>
                <label className='block text-[11px] font-medium text-slate-600 mb-1'>Course</label>
                <select name='course' value={form.course} onChange={handleChange} className='w-full border rounded px-3 py-2 text-sm'>
                  <option>Learner</option>
                  <option>Refresher</option>
                  <option>Defensive</option>
                  <option>Highway</option>
                  <option>Automatic</option>
                </select>
              </div>
              <div>
                <label className='block text-[11px] font-medium text-slate-600 mb-1'>Preferred Slot</label>
                <select name='preferredSlot' value={form.preferredSlot} onChange={handleChange} className='w-full border rounded px-3 py-2 text-sm'>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>
              <div>
                <label className='block text-[11px] font-medium text-slate-600 mb-1'>Start Week</label>
                <input type='week' name='startWeek' value={form.startWeek} onChange={handleChange} className='w-full border rounded px-3 py-2 text-sm'/>
              </div>
            </div>
            <div>
              <label className='block text-[11px] font-medium text-slate-600 mb-1'>Notes</label>
              <textarea name='notes' value={form.notes} onChange={handleChange} rows={3} className='w-full border rounded px-3 py-2 text-sm resize-none' placeholder='Experience level, goals, pickup location...' />
            </div>
            <div className='flex items-center gap-3 pt-2'>
              <button type='submit' className='px-5 py-2 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700'>Send on WhatsApp</button>
              <button type='button' onClick={()=> sendWhatsApp('Hi, I want to enroll for driving classes.')} className='px-4 py-2 rounded bg-green-500 text-white text-xs hover:bg-green-600'>Quick Chat</button>
            </div>
            <p className='text-[10px] text-slate-400 pt-1'>We only open WhatsApp – no form data stored yet.</p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default DrivingSchoolPage;
