import React from 'react';
import { Github as GitHub, Mail, Linkedin, MapPin, Download } from 'lucide-react';
import deepakImage from './deepak.png';






interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 bg-gradient-to-br from-indigo-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4">
              Hi, I'm <span className="text-indigo-600">Deepak Kag</span>
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-600 mb-6">
              CS Student
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Just learning from here and there.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 flex items-center"
              >
                Contact Me
                <Mail className="ml-2" size={18} />
              </button>
              <a
                href="https://drive.google.com/file/d/1kSGz_oXh5cK7hCgm4G8pRNAjhjJXCTX-/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                download="Deepak_Kag_Resume.pdf"
                className="px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors duration-300 flex items-center"
              >
                Resume
                <Download className="ml-2" size={18} />
              </a>
            </div>
            <div className="flex mt-8 space-x-4">
              <a href="https://github.com/DeepakKag12" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors">
                <GitHub size={24} />
              </a>
              <a href="https://www.linkedin.com/in/deepak-kag-50241328a/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:kagdeepak45@gmail.com" className="text-gray-600 hover:text-indigo-600 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center animate-fadeInRight">
            <div className="relative">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                
                   src='https://drive.google.com/file/d/1jak4jlfws2alZS_KGUIHp_mJuj8GVZ6A/view?usp=sharing'
                    alt="Deepak Kag"
                  
                   className="w-full h-full object-cover"
                    />

              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-sm font-medium flex items-center">
                  <MapPin size={16} className="text-indigo-600 mr-1" />
                  Sri City, AP, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
