import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white max-w-7xl mx-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">About Me</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 animate-fadeInLeft">
            <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80" 
              alt="Deepak Kag" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
          
          <div className="md:w-1/2 md:pl-12 animate-fadeInRight">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Who am I?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              I'm Deepak Kag, a passionate front-end and full-stack web developer from Indore. I enjoy crafting clean, responsive interfaces and building complete web applications from scratch using modern technologies like React, Node.js, and MongoDB.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              My interests include Web Development, Data Structures & Algorithms, and system design. I'm experienced with version control tools like Git and GitHub, and I also work with MATLAB for simulations and engineering tasks.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              One of my featured projects is a full-stack house renting platform where users can list and browse rental properties:
              <br />
              <a 
                href="https://houses-renting.onrender.com" 
                className="text-indigo-600 hover:underline" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View House Renting Project
              </a>
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Apart from coding, I enjoy playing cricket, listening to music, and continuously learning new tools and frameworks.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800">Name:</h4>
                <p className="text-gray-600">Deepak Kag</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Email:</h4>
                <p className="text-gray-600">kagdeepak45gmail.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Location:</h4>
                <p className="text-gray-600">Indore, MP, India</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Availability:</h4>
                <p className="text-gray-600">Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
