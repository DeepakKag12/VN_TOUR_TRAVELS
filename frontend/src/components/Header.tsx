import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSiteSettings } from '../siteSettingsContext';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'models', label: 'Listings' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'whyus', label: 'Why Us' },
  { id: 'contact', label: 'Contact' },
  { id: 'admin', label: 'Admin' }
];

const Header: React.FC<HeaderProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  activeSection,
  scrollToSection
}) => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const company = settings?.companyName || 'VN Tour & Travels';
  const primaryPhone = settings?.phone || '+91 91098 79836';
  const secondaryPhones = settings?.phones && settings.phones.length? settings.phones : ['+91 99938 83995'];
  const whatsappNumber = (settings?.whatsapp || primaryPhone).replace(/\D/g,'');
  const phoneDigitsPrimary = primaryPhone.replace(/\D/g,'');
  return (
  <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent cursor-pointer tracking-tight"
          onClick={() => scrollToSection('home')}
        >
          {company}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {NAV_ITEMS.map(({ id, label }) => (
            id === 'hotels' ? (
              <button
                key={id}
                onClick={() => navigate('/hotel-bookings')}
                className={`text-sm font-semibold capitalize transition duration-200 ease-in-out ${
                  activeSection === id
                    ? 'text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {label}
              </button>
            ) : (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`text-sm font-semibold capitalize transition duration-200 ease-in-out ${
                  activeSection === id
                    ? 'text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {label}
              </button>
            )
          ))}
          {/* Quick contact */}
          <a href={`https://wa.me/${whatsappNumber || phoneDigitsPrimary}`} target="_blank" rel="noopener" className="hidden lg:flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-1 rounded">WhatsApp</span>
          </a>
          <div className="hidden xl:flex flex-col text-[11px] leading-tight text-slate-600 ml-2">
            <span className="font-semibold text-slate-700">{primaryPhone}</span>
            {secondaryPhones.slice(0,2).map(p=> <span key={p}>{p}</span>)}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-blue-600 focus:outline-none"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200">
          <nav className="flex flex-col px-4 py-3 space-y-3">
            {NAV_ITEMS.map(({ id, label }) => (
              id === 'hotels' ? (
                <button
                  key={id}
                  onClick={() => { setIsMenuOpen(false); navigate('/hotel-bookings'); }}
                  className={`text-base font-medium capitalize transition duration-200 ${
                    activeSection === id
                      ? 'text-blue-700'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {label}
                </button>
              ) : (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`text-base font-medium capitalize transition duration-200 ${
                    activeSection === id
                      ? 'text-blue-700'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {label}
                </button>
              )
            ))}
            <a href={`https://wa.me/${whatsappNumber || phoneDigitsPrimary}`} target="_blank" rel="noopener" className="mt-2 inline-block text-sm font-semibold text-emerald-600">Chat on WhatsApp</a>
            <p className="text-[11px] text-slate-500">Call: {primaryPhone}{secondaryPhones[0]? ' / '+secondaryPhones[0]:''}</p>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
