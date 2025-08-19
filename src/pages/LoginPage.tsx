import React, { useState } from 'react';
import { login } from '../api';
import { useAuth } from '../context';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('return');

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
  const res = await login(form.email, form.password);
      setUser(res.user);
      if (returnTo) {
        navigate(returnTo);
      } else {
        navigate(res.user.role === 'admin' ? '/admin' : '/listings');
      }
    } catch { setError('Invalid credentials'); } finally { setLoading(false); }
  };

  return (
    <div className='min-h-[70vh] flex items-start md:items-center justify-center pt-16 md:pt-0 px-4'>
      <div className='w-full max-w-lg'>
        <h1 className='text-3xl font-bold mb-8 text-center text-slate-800'>Login to <span className='text-indigo-600'>VN Travels</span></h1>
        {error && <div className='mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>{error}</div>}
        <form onSubmit={submit} noValidate className='bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5'>
          <div>
            <label htmlFor='email' className='block text-sm font-semibold text-slate-700 mb-1'>Email</label>
            <input id='email' autoFocus required name='email' type='email' className='w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-semibold text-slate-700 mb-1'>Password</label>
            <input id='password' required name='password' type='password' className='w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
          </div>
          <button disabled={loading} className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-md py-2.5 text-sm font-semibold shadow-sm transition'>{loading? 'Signing in...':'Login'}</button>
          <p className='text-[11px] text-slate-400 text-center'>Forgot password? (Coming soon)</p>
        </form>
        <p className='mt-4 text-center text-xs text-slate-500'>Admin demo: admin / admin123</p>
      </div>
    </div>
  );
};

export default LoginPage;
