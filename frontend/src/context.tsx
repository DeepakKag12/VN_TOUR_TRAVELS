import React, { createContext, useContext, useEffect, useState } from 'react';
import { me } from './api';

interface User { username: string; role: string; email?: string; password?: string; }
interface AuthContextType { user: User | null; setUser: (u: User | null) => void; logout: () => void; }

const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {}, logout: () => {} });

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { // try restore
    const attempt = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await me();
          if (res && res.user && typeof res.user === 'object') {
            setUser(res.user);
          } else {
            console.warn('Invalid user response:', res);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.warn('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
    };
    attempt();
    const id = setInterval(attempt, 1000*60*10); // silent refresh every 10 min
    const handler = () => setUser(null);
    window.addEventListener('auth:logout', handler);
    return () => { clearInterval(id); window.removeEventListener('auth:logout', handler); };
  }, []);
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
