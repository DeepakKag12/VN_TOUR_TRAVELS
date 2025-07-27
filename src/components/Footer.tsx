import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">Deepak Kag</h2>
            <p className="text-gray-400 mt-2">Full Stack Web Developer</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-400 mb-2">© 2025 Deepak Kag. All Rights Reserved.</p>
            <p className="text-gray-400">Proudly built by <span className="text-indigo-400 font-medium">Deepak Kag</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
