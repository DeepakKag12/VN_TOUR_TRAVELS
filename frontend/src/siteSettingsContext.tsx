import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSettings, SiteSettings } from './api';

interface SiteSettingsContextType { settings: SiteSettings | null; refresh: () => void; }
const SiteSettingsContext = createContext<SiteSettingsContextType>({ settings: null, refresh: () => {} });

export const SiteSettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const load = () => { getSettings().then(setSettings).catch(()=>{}); };
  useEffect(load, []);
  return <SiteSettingsContext.Provider value={{ settings, refresh: load }}>{children}</SiteSettingsContext.Provider>;
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
