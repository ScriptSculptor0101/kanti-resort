import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Maximize2 } from 'lucide-react';
import { GALLERY_IMAGES } from '../data/resortData';

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const categories = ['All', 'Scenic Valley & River', 'Rooms & Cottages', 'Triyuginarayan Weddings', 'Helipad & Yatra'];

  const filteredPhotos = activeCategory === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#FFFDF7] relative overflow-hidden">
      
      {/* Decorative subtle ambient light */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[300px] bg-[#D4A373]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[#0891B2] font-bold">
            Visual Memories
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2D3748] font-normal">
            Moments at Kanti Resort
          </h2>
          <p className="text-sm sm:text-base text-[#718096] font-normal leading-relaxed">
            Glance through the ethereal landscapes of Phata, our comfortable rooms, helicopter vistas, and magical wedding celebrations.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors ${
                  activeCategory === cat
                    ? 'text-white'
                    : 'text-[#718096] hover:text-[#2D3748] bg-white border border-[#D4A373]/30 shadow-sm'
                }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeGalleryTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#D4A373] rounded-full shadow-md -z-10"
                  />
                )}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid with layout animations */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <AnimatePresence>
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => setSelectedPhoto(photo)}
                whileHover={{ y: -6 }}
                className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer border border-[#D4A373]/25 hover:border-[#D4A373] transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-[10px] uppercase tracking-wider text-[#0891B2] font-semibold rounded-md border border-[#D4A373]/30 shadow-sm">
                      {photo.category}
                    </span>
                    <div className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg text-white font-medium group-hover:text-[#D4A373] transition-colors">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-white/90 flex items-center gap-1 mt-1 font-light">
                      <MapPin className="w-3 h-3 text-[#D4A373]" />
                      <span>{photo.location}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden border border-[#D4A373]/30 shadow-2xl"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-[#2D3748] hover:bg-white transition-colors border border-[#D4A373]/30 shadow-md"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full max-h-[75vh] object-cover"
              />

              <div className="p-5 sm:p-6 bg-[#FFFDF7] flex items-center justify-between border-t border-[#D4A373]/20">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#0891B2] font-semibold">
                    {selectedPhoto.category}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#2D3748] mt-0.5">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-xs text-[#718096] mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D4A373]" /> {selectedPhoto.location}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
