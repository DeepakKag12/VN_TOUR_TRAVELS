import React, { useEffect, useState } from 'react';
import api, { } from '../api';
import { useAuth } from '../context';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ email:'', phone:'' });
  const [loading,setLoading] = useState(true);
  const [msg,setMsg] = useState<string|null>(null);
  useEffect(()=> { if(user){ api.get('/profile').then(res=> { setForm({ email:res.data.email||'', phone:res.data.phone||'' }); }).finally(()=>setLoading(false)); } else { setLoading(false);} }, [user]);
  if(!user) return <div className='max-w-xl mx-auto p-8 text-sm'>Login to view profile.</div>;
  if(loading) return <div className='max-w-xl mx-auto p-8'>Loading...</div>;
  const submit = async (e:React.FormEvent) => { e.preventDefault(); try { await api.put('/profile', form); setMsg('Saved'); } catch { setMsg('Failed'); } };
  return (
    <div className='max-w-xl mx-auto px-6 py-10'>
      <h1 className='text-2xl font-bold mb-6'>My Profile</h1>
      <form onSubmit={submit} className='space-y-4 bg-white border rounded-xl p-6 shadow-sm'>
        <div>
          <label className='block text-xs font-medium text-slate-500 mb-1'>Username</label>
          <p className='text-sm font-semibold'>{user.username}</p>
        </div>
        <div>
          <label className='block text-xs font-medium text-slate-500 mb-1'>Email</label>
          <input type='email' className='w-full border rounded-md px-3 py-2 text-sm' value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
        </div>
        <div>
          <label className='block text-xs font-medium text-slate-500 mb-1'>Phone</label>
          <input className='w-full border rounded-md px-3 py-2 text-sm' value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
        </div>
        <button className='w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 text-sm font-medium'>Save</button>
        {msg && <p className='text-xs text-center text-emerald-600'>{msg}</p>}
      </form>
    </div>
  );
};

export default ProfilePage;
