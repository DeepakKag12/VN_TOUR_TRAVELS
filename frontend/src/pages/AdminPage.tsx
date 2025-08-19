import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import { useAuth } from '../context';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to='/login' replace />;
  if (user.role !== 'admin') return <Navigate to='/' replace />;
  return <AdminDashboard />;
};

export default AdminPage;
