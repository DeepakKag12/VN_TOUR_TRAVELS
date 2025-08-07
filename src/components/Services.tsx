// ========== Services.tsx ==========
import React from 'react';
import { motion } from 'framer-motion';
import {
  FaBusAlt,
  FaHotel,
  FaCar,
  FaMotorcycle,
  FaChalkboardTeacher,
  FaGlobeAmericas
} from 'react-icons/fa';

interface ServiceCard {
  title: string;
  description: string;
  icon: JSX.Element;
}

const services: ServiceCard[] = [
  {
    title: 'Taxi / Buses',
    description: 'Reliable, affordable transport options across all cities to make your travel seamless.',
    icon: <FaBusAlt className="text-4xl text-blue-500" />,
  },
  {
    title: 'Tour Packages',
    description: 'Explore the world with our curated domestic and international travel packages.',
    icon: <FaGlobeAmericas className="text-4xl text-green-500" />,
  },
  {
    title: 'Drivers for Personal Vehicles',
    description: 'Professional drivers available for short-term and long-term durations for your vehicle.',
    icon: <FaCar className="text-4xl text-rose-500" />,
  },
  {
    title: 'Hotel Bookings',
    description: 'Book premium and budget stays anywhere in India at exclusive prices.',
    icon: <FaHotel className="text-4xl text-purple-500" />,
  },
  {
    title: 'Rental (Car/Bike)',
    description: 'Choose from a fleet of cars and bikes for rent, delivered right to your doorstep.',
    icon: <FaMotorcycle className="text-4xl text-orange-500" />,
  },
  {
    title: 'Driving School',
    description: 'Certified instructors and courses to make you a confident, safe driver.',
    icon: <FaChalkboardTeacher className="text-4xl text-yellow-500" />,
  }
];

const Services: React.FC = () => {
  return (
    <section
      id="services"
      className="bg-gradient-to-br from-white via-slate-50 to-white text-slate-800 py-24 px-6"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-14 text-indigo-700 tracking-tight">
          Our Premium Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl p-6 transform hover:-translate-y-1 transition duration-300 ease-in-out"
            >
              <div className="flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">{service.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
