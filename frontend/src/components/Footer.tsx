import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useSiteSettings } from '../siteSettingsContext';

const Footer: React.FC = () => {
  const { settings } = useSiteSettings();
  const company = settings?.companyName || 'VN Tour & Travels';
  const phonePrimary = settings?.phone || '+91 91098 79836';
  const phoneSecondary = (settings as any)?.phones?.[0] || '+91 99938 83995';
  const email = settings?.email || 'vn.travel09@gmail.com';
  const address = settings?.address || 'Scheme No 71, Gumasta Nagar, Indore (M.P.)';
  const instaHandle = ((settings as any)?.instagram || 'VN_TOUR_AND_TRAVELS').replace('@','');
  const instaDisplay = '@'+instaHandle;
  const phoneDigits = (settings?.whatsapp || phonePrimary).replace(/\D/g,'') || '919109879836';
  return (
    <footer className="bg-[#1b1c2a] text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">

        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-extrabold mb-4 text-indigo-400">{company}</h2>
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
              href={`https://instagram.com/${instaHandle}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400 transition duration-300"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href={`https://wa.me/${phoneDigits}`}
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
          <p className="mb-1 text-gray-300 font-medium">Phone</p>
          <p className="mb-2 text-gray-300">{phonePrimary}</p>
          <p className="mb-4 text-gray-300">{phoneSecondary}</p>
          <p className="mb-1 text-gray-300 font-medium">Email</p>
          <p className="mb-4 text-gray-300">{email}</p>
          <p className="mb-1 text-gray-300 font-medium">Location</p>
          <p className="mb-4 text-gray-300">{address}</p>
          <p className="mb-1 text-gray-300 font-medium">Instagram</p>
          <p className="mb-2 text-indigo-300">{instaDisplay}</p>
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
          <h3 className="text-lg font-semibold mb-4 text-indigo-300">Follow Us</h3>
          <p className="mb-3 text-gray-300 text-sm">Stay updated with offers, new tours and rental availability.</p>
          <div className="flex gap-3">
            <a href={`https://instagram.com/${instaHandle}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md bg-pink-500/10 text-pink-400 text-xs font-semibold border border-pink-400/30 hover:bg-pink-500/20">Instagram</a>
            <a href="https://facebook.com/VNtourandtravels" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-400/30 hover:bg-blue-500/20">Facebook</a>
            <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-400/30 hover:bg-emerald-500/20">WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Note */}
      <div className="text-center mt-10 text-red-400 text-sm">
        2% of the amount you provided will be donated to needy.
      </div>

      {/* Copyright */}
      <div className="text-center mt-2 text-gray-400 text-xs">
  &copy; {new Date().getFullYear()} {company}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
