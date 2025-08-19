import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context';
import ConnectionTest from '../components/ConnectionTest';

const NavLinkStyled: React.FC<{to:string; children:React.ReactNode}> = ({to, children}) => (
  <NavLink to={to} className={({isActive})=>`px-3 py-2 rounded-md text-sm font-medium transition ${isActive? 'bg-indigo-600 text-white':'text-slate-600 hover:bg-slate-100'}`}>{children}</NavLink>
);

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <NavLink to='/' className='font-bold text-lg bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent'>VN Tour & Travels</NavLink>
          <nav className='hidden md:flex gap-1'>
            <NavLinkStyled to='/'>Home</NavLinkStyled>
            <NavLinkStyled to='/listings'>All Listings</NavLinkStyled>
            <NavLinkStyled to='/tours'>Tours</NavLinkStyled>
            <NavLinkStyled to='/buses'>Buses</NavLinkStyled>
            <NavLinkStyled to='/rentals'>Rentals</NavLinkStyled>
            <NavLinkStyled to='/contact'>Contact</NavLinkStyled>
            {user && <NavLinkStyled to='/status'>Status</NavLinkStyled>}
            {user?.role==='admin' && <NavLinkStyled to='/admin'>Admin</NavLinkStyled>}
          </nav>
          <div className='flex items-center gap-3'>
            {!user && <NavLink to='/login' className='text-sm text-indigo-600 hover:underline'>Login</NavLink>}
            {!user && <NavLink to='/signup' className='text-sm text-slate-600 hover:underline'>Sign Up</NavLink>}
            {user && <>
              <span className='text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded'>{user.username} ({user.role})</span>
              <button onClick={logout} className='text-xs text-slate-500 hover:text-rose-600'>Logout</button>
            </>}
          </div>
        </div>
      </header>
      <main className='flex-1'>
        <Outlet />
      </main>
      <ConnectionTest />
      <footer className='mt-16 bg-slate-900 text-slate-300 py-8 text-center text-sm'>© {new Date().getFullYear()} VN Tour & Travels</footer>
    </div>
  );
};

export default MainLayout;
