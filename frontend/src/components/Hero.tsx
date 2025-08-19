// ================= Hero.tsx =================
import React from 'react';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white overflow-hidden"
    >
      {/* Decorative cloud-like floating effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent animate-pulse opacity-30 pointer-events-none"></div>

      {/* Glassy dark overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg animate-pulse">
          Welcome to{' '}
          <span className="text-yellow-400 drop-shadow-md">VN Tour & Travels</span>
        </h1>

        <p className="text-lg md:text-xl text-indigo-100 font-medium mb-6 tracking-wide italic animate-fade-in-down">
          Experience The Journey With Us
        </p>

        <p className="text-base md:text-lg text-gray-200 mb-10 tracking-wide leading-relaxed animate-fade-in-up delay-300">
          Discover amazing destinations across India with our trusted taxi, bus, hotel, and rental services.
          Affordable, reliable, and tailored just for you.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => scrollToSection('services')}
            className="px-8 py-3 bg-yellow-400 text-indigo-900 text-lg font-semibold rounded-full shadow-lg hover:bg-yellow-300 hover:scale-105 hover:shadow-2xl transform transition duration-300 ease-in-out"
          >
            View Our Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
