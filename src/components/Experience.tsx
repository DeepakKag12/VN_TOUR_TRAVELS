import React from 'react';

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Work Experience</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Some of the key roles I've taken on during my tech journey.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-indigo-200"></div>

            {/* Experience 1 */}
            {/* <div className="relative mb-12 animate-fadeIn">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-1 md:text-right md:pr-8 order-2 md:order-1">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Frontend Developer Intern</h3>
                    <p className="text-indigo-600 font-medium mb-3">XYZ Tech Solutions</p>
                    <p className="text-gray-600 mb-4">
                      Developed and maintained responsive user interfaces using React, Tailwind, and APIs. Contributed to improving performance and UI/UX consistency.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">React</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Tailwind CSS</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">API Integration</span>
                    </div>
                  </div>
                </div>
                <div className="md:mx-auto flex items-center order-1 md:order-2 mb-4 md:mb-0">
                  <div className="w-10 h-10 rounded-full border-4 border-indigo-200 bg-indigo-600 flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                </div>
                <div className="flex-1 md:pl-8 order-3">
                  <div className="md:pt-10">
                    <span className="text-indigo-600 font-semibold">Jan 2024 – May 2024</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Experience 2 */}
            <div className="relative mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-1 md:pl-8 order-3 md:order-1">
                  <div className="md:pt-10">
                    <span className="text-indigo-600 font-semibold">June 2025 – Present</span>
                  </div>
                </div>
                <div className="md:mx-auto flex items-center order-1 md:order-2 mb-4 md:mb-0">
                  <div className="w-10 h-10 rounded-full border-4 border-indigo-200 bg-indigo-600 flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                </div>
                <div className="flex-1 md:text-left md:pl-8 order-2 md:order-3">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Personal Projects</h3>
                    <p className="text-indigo-600 font-medium mb-3">Independent</p>
                    <p className="text-gray-600 mb-4">
                      Building and deploying full-stack projects such as a house rental platform, practicing CI/CD workflows, and integrating backend services with front-end interfaces.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Full Stack</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">DevOps</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Render Hosting</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
