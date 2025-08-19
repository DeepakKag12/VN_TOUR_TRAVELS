import React, { useEffect, useState } from 'react';
import { fetchMyNotifications } from '../api';
import { useAuth } from '../context';

const MyNotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ if(user){ fetchMyNotifications().then(setItems).finally(()=>setLoading(false)); } else { setLoading(false); } }, [user]);
  if(!user) return <div className='max-w-3xl mx-auto p-8 text-sm'>Login to view notifications.</div>;
  if(loading) return <div className='max-w-3xl mx-auto p-8 text-sm'>Loading...</div>;
  return (
    <div className='max-w-3xl mx-auto px-6 py-10'>
      <h1 className='text-2xl font-bold mb-6'>Notifications</h1>
      <div className='space-y-3'>
        {items.map(n=> (
          <div key={n.id} className='border rounded-lg p-4 bg-white shadow-sm'>
            <p className='text-sm font-medium text-slate-700'>{n.message}</p>
            <p className='text-[10px] text-slate-400 mt-1'>{new Date(n.createdAt).toLocaleString()} • {n.channel}</p>
          </div>
        ))}
        {items.length===0 && <p className='text-sm text-slate-500'>No notifications.</p>}
      </div>
      <p className='mt-8 text-[10px] text-slate-400'>These are updates about your bookings and account.</p>
    </div>
  );
};

export default MyNotificationsPage;
