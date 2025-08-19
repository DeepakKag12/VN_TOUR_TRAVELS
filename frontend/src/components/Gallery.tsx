// ================= Gallery.tsx =================
import React from 'react';
import { motion } from 'framer-motion';

const images = [
  { src: '/images/gallery1.jpg', alt: 'Gallery 1' },
  { src: '/images/gallery2.jpg', alt: 'Gallery 2' },
  { src: '/images/gallery3.jpg', alt: 'Gallery 3' },
];

const Gallery: React.FC = () => {
  return (
    <section id="gallery" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-3xl font-bold text-indigo-800 mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Photo Gallery
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A glimpse into the beauty of Indian landscapes and culture.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="overflow-hidden rounded shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transform transition-transform duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
