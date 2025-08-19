import React from 'react';
import { Briefcase, Globe, Hotel, Users } from 'lucide-react';

const About = () => {
  return (
    <section className="py-16 px-4 bg-gray-50" id="services">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-indigo-700 mb-6">Our Services</h2>
        <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
          VN Tour & Travels offers a wide range of travel solutions tailored for your comfort and convenience.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
            <Globe className="text-indigo-600 mb-4 w-10 h-10 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Domestic & International Tours</h3>
            <p className="text-sm text-gray-600">
              Explore destinations across India and the world with our expert planning and guidance.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
            <Briefcase className="text-indigo-600 mb-4 w-10 h-10 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Corporate Travel</h3>
            <p className="text-sm text-gray-600">
              We handle corporate travel arrangements with professionalism and precision.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
            <Hotel className="text-indigo-600 mb-4 w-10 h-10 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Hotel Booking</h3>
            <p className="text-sm text-gray-600">
              Partnered with top hotels to ensure comfort and quality stays during your trips.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
            <Users className="text-indigo-600 mb-4 w-10 h-10 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Group Travel</h3>
            <p className="text-sm text-gray-600">
              Enjoy fun-filled group tours and packages for families, students, and corporate teams.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
            <Globe className="text-indigo-600 mb-4 w-10 h-10 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Visa & Passport Assistance</h3>
            <p className="text-sm text-gray-600">
              Hassle-free support for applying and obtaining your passport and visa.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
            <Hotel className="text-indigo-600 mb-4 w-10 h-10 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Customized Packages</h3>
            <p className="text-sm text-gray-600">
              Tailored holiday experiences based on your preferences and budget.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
