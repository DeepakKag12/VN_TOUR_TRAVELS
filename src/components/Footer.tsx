import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1b1c2a] text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">

        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-extrabold mb-4 text-indigo-400">VN Tour & Travels</h2>
          <p className="mb-2 text-gray-300">Experience The Journey With Us.</p>
          <p className="mb-2 text-gray-300">Taxi, Tours, Rentals, and More.</p>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://facebook.com/VNtourandtravels"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-300 transition duration-300"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="https://instagram.com/VN_TOUR_AND_TRAVELS"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400 transition duration-300"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://wa.me/919109879836"
              target="_blank"
              rel="noreferrer"
              className="hover:text-green-400 transition duration-300"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-indigo-300">Contact</h3>
          <p className="mb-2 text-gray-300">📞 +91 91098 79836</p>
          <p className="mb-2 text-gray-300">📞 +91 99938 83995</p>
          <p className="mb-2 text-gray-300">📧 vn.travel09@gmail.com</p>
          <p className="mb-2 text-gray-300">🏢 Scheme No 71, Gumasta Nagar, Indore (M.P.)</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-indigo-300">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#home" className="text-gray-300 hover:text-indigo-300 transition duration-300">Home</a></li>
            <li><a href="#services" className="text-gray-300 hover:text-indigo-300 transition duration-300">Services</a></li>
            <li><a href="#whyus" className="text-gray-300 hover:text-indigo-300 transition duration-300">Why Us</a></li>
            <li><a href="#contact" className="text-gray-300 hover:text-indigo-300 transition duration-300">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter / Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-indigo-300">Stay Connected</h3>
          <p className="mb-4 text-gray-300">Follow us on social media for the latest updates and offers!</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-md bg-[#2c2d3f] text-white border border-indigo-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* Footer Bottom Note */}
      <div className="text-center mt-10 text-red-400 text-sm">
        2% of the amount you provided will be donated to needy.
      </div>

      {/* Copyright */}
      <div className="text-center mt-2 text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} VN Tour & Travels. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
