import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'whyus', label: 'Why Us' },
  { id: 'contact', label: 'Contact' }
];

const Header: React.FC<HeaderProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  activeSection,
  scrollToSection
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent cursor-pointer tracking-tight"
          onClick={() => scrollToSection('home')}
        >
          VN Tour & Travels
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {NAV_ITEMS.map(({ id, label }) => (
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
          ))}
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
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
