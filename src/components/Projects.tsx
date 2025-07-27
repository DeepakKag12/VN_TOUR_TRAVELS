import React from 'react';
import { Github } from 'lucide-react';

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-indigo-600">Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* House Renting Project */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">House Renting Website</h3>
            <p className="text-gray-600 mb-4">
              A full-stack web application that allows users to list and rent houses or rooms. Built using modern frontend and backend technologies to manage listings, bookings, and user authentication.
            </p>
            <a
              href="https://houses-renting.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-indigo-600 font-medium hover:underline"
            >
              <Github className="w-5 h-5 mr-1" />
              click here for view
            </a>
          </div>

          {/* Add more projects here if needed */}
        </div>
      </div>
    </section>
  );
};

export default Projects;
