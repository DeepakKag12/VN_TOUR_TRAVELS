import React, { useState } from 'react';
import { signup } from '../api';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e:React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null); setSuccess(null);
    try {
  const usernameVal = form.username.trim() === '' ? undefined : form.username.trim();
  const res = await signup(usernameVal, form.password, form.email);
      setUser(res.user);
      setSuccess('Signup successful! Redirecting...');
      setTimeout(()=>navigate('/listings'), 900);
    } catch (e:any) {
      setError(e?.response?.data?.error || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className='min-h-[70vh] flex items-start md:items-center justify-center pt-16 md:pt-0 px-4'>
      <div className='w-full max-w-lg'>
        <h1 className='text-3xl font-bold mb-8 text-center text-slate-800'>Signup on <span className='text-indigo-600'>VN Travels</span></h1>
        {error && <div className='mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>{error}</div>}
        {success && <div className='mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>{success}</div>}
        <form onSubmit={submit} noValidate className='bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5'>
          <div>
            <label htmlFor='email' className='block text-sm font-semibold text-slate-700 mb-1'>Email</label>
            <input id='email' autoFocus required name='email' type='email' className='w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
          </div>
          <div>
            <label htmlFor='username' className='form-label block text-sm font-semibold text-slate-700 mb-1'>Username (optional)</label>
            <input id='username' name='username' type='text' placeholder='Auto from email if blank' className='form-control w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} />
          </div>
          
            <div>
              <label htmlFor='password' className='block text-sm font-semibold text-slate-700 mb-1'>Password</label>
              <input id='password' required name='password' type='password' className='w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
            </div>
          <button disabled={loading} className='w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-md py-2.5 text-sm font-semibold shadow-sm transition'>{loading? 'Creating...':'Signup'}</button>
          <p className='text-[11px] text-slate-400 text-center'>By signing up you agree to our terms & privacy policy.</p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
