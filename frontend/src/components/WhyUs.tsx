// ================= WhyUs.tsx =================
import React from 'react';
import {
  FaTaxi,
  FaBus,
  FaHotel,
  FaMapMarkedAlt,
  FaUserTie,
  FaHeadset,
} from 'react-icons/fa';

const WhyUs: React.FC = () => {
  const reasons = [
    {
      icon: <FaTaxi className="text-indigo-600 text-5xl mb-4 mx-auto animate-bounce" />,
      title: 'Reliable Taxi Service',
      description: 'Quick, safe, and comfortable taxi rides with professional drivers. Ideal for city and outstation travel.',
      color: 'indigo',
    },
    {
      icon: <FaBus className="text-yellow-500 text-5xl mb-4 mx-auto animate-pulse" />,
      title: 'Bus Rentals',
      description: 'Book luxury or budget buses for group trips, school tours, or corporate events with ease.',
      color: 'yellow',
    },
    {
      icon: <FaHotel className="text-green-500 text-5xl mb-4 mx-auto animate-spin-slow" />,
      title: 'Hotel Booking',
      description: 'Hassle-free accommodation bookings across India with best-in-class options and deals.',
      color: 'green',
    },
    {
      icon: <FaMapMarkedAlt className="text-purple-500 text-5xl mb-4 mx-auto animate-pulse" />,
      title: 'Custom Tour Packages',
      description: 'Tailored travel itineraries for solo travelers, couples, and families. Enjoy guided tours and curated experiences.',
      color: 'purple',
    },
    {
      icon: <FaUserTie className="text-pink-500 text-5xl mb-4 mx-auto animate-bounce" />,
      title: 'Professional Guides',
      description: 'Trained and experienced guides ensure safe, informative, and delightful journeys.',
      color: 'pink',
    },
    {
      icon: <FaHeadset className="text-blue-500 text-5xl mb-4 mx-auto animate-pulse" />,
      title: '24/7 Travel Support',
      description: 'Dedicated support team available anytime during your trip to assist with your needs.',
      color: 'blue',
    },
  ];

  return (
    <section id="whyus" className="py-20 bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-4 drop-shadow">
          Why Choose VN Tours?
        </h2>
        <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
          Trusted by travelers for affordable, reliable, and comprehensive travel services across India.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={`bg-white border-t-4 rounded-2xl p-6 text-center shadow transition-all duration-500 hover:scale-105 hover:shadow-xl border-${reason.color}-500`}
            >
              {reason.icon}
              <h3 className={`text-2xl font-semibold mb-2 text-${reason.color}-700`}>
                {reason.title}
              </h3>
              <p className="text-gray-600 text-sm">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
