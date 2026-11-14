import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Users, Maximize, Flame, Calendar, Eye, X, Camera, ChevronLeft, ChevronRight, ShieldCheck, MapPin
} from 'lucide-react';
import { ROOMS, RESORT_PHOTO_TOUR } from '../data/resortData';

export default function RoomsSection({ onOpenBooking }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeModalRoom, setActiveModalRoom] = useState(null);
  const [modalActiveImageIndex, setModalActiveImageIndex] = useState(0);
  
  // Full Photo Tour Lightbox
  const [activeTourPhoto, setActiveTourPhoto] = useState(null);

  const filterCategories = ['All', 'Double Bed', 'Triple Bed', 'Four Bed'];

  const filteredRooms = activeFilter === 'All'
    ? ROOMS
    : ROOMS.filter(r => r.category === activeFilter);

  const handleOpenRoomModal = (room) => {
    setActiveModalRoom(room);
    setModalActiveImageIndex(0);
  };

  return (
    <section id="rooms" className="py-20 sm:py-28 bg-[#F4EFEA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D4A373]/30 text-[#0891B2] text-xs font-semibold tracking-wider uppercase shadow-sm">
            <Camera className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>Actual Resort & Room Photos</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2D3748] font-normal">
            Our Rooms
          </h2>
          <p className="text-sm sm:text-base text-[#718096] font-normal leading-relaxed">
            Every room at Kanti Resort features pine-finished insulated interiors, attached bathrooms with 24/7 hot water geysers, room heaters, and private sit-out balconies overlooking the holy Mandakini river and Himalayan peaks.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors ${
                  activeFilter === cat
                    ? 'text-white'
                    : 'text-[#718096] hover:text-[#2D3748] bg-white/90 border border-[#D4A373]/30 shadow-sm'
                }`}
              >
                {activeFilter === cat && (
                  <motion.div
                    layoutId="activeRoomFilter"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#D4A373] rounded-full shadow-md -z-10"
                  />
                )}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Room Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredRooms.map((room) => (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl overflow-hidden border border-[#D4A373]/25 hover:border-[#D4A373] transition-all duration-300 flex flex-col group shadow-lg hover:shadow-2xl"
              >
                {/* Image & Price Overlay */}
                <div className="relative h-64 sm:h-72 overflow-hidden cursor-pointer" onClick={() => handleOpenRoomModal(room)}>
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-md border border-[#0891B2]/30 rounded-full text-xs text-[#0891B2] font-semibold tracking-wider uppercase shadow-sm">
                    {room.category}
                  </span>

                  {/* Photo count indicator */}
                  {room.gallery && room.gallery.length > 1 && (
                    <span className="absolute top-4 right-4 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-[11px] font-medium flex items-center gap-1 border border-white/20">
                      <Camera className="w-3 h-3" />
                      <span>{room.gallery.length} Photos</span>
                    </span>
                  )}

                  {/* Price Badge */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-[#D4A373]/30 px-4 py-1.5 rounded-xl text-right shadow-md">
                    <span className="text-[10px] text-[#718096] uppercase tracking-widest block font-medium">Starting from</span>
                    <div className="text-[#2D3748] font-serif text-lg sm:text-xl font-bold">
                      ₹{room.price.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-sans text-[#718096] font-normal">/ night</span>
                    </div>
                  </div>
                </div>

                {/* Room Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#2D3748] group-hover:text-[#D4A373] transition-colors font-medium">
                      {room.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#718096] mt-1.5 font-normal">
                      {room.tagline}
                    </p>

                    {/* Specs row */}
                    <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-[#D4A373]/20 text-xs text-[#718096]">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#0891B2]" />
                        <span>{room.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize className="w-3.5 h-3.5 text-[#0891B2]" />
                        <span>{room.size}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-[#D4A373]" />
                        <span>24/7 Hot Geyser</span>
                      </div>
                    </div>

                    {/* Bullet features */}
                    <div className="space-y-2">
                      {room.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#4A5568]">
                          <Check className="w-3.5 h-3.5 text-[#166534] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card CTA Buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleOpenRoomModal(room)}
                      className="flex-1 py-2.5 rounded-xl border border-[#D4A373]/40 hover:border-[#0891B2] text-[#2D3748] hover:text-[#0891B2] text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Photos & Specs</span>
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onOpenBooking({ selectedRoom: room.id })}
                      className="flex-1 py-2.5 rounded-xl bg-[#D4A373] hover:bg-[#B88555] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Reserve</span>
                    </motion.button>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Authentic Resort Photo Tour & Facilities Showcase */}
        <div className="mt-24 pt-16 border-t border-[#D4A373]/25">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-12 space-y-2"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#0891B2] font-bold">
              Complete Visual Tour
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-[#2D3748] font-normal">
              Real Resort Tour & Facilities
            </h3>
            <p className="text-xs sm:text-sm text-[#718096]">
              Browse 100% authentic photographs of Kanti Resort: bedrooms, modern washrooms with geysers, wood paneling, and valley balcony views.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {RESORT_PHOTO_TOUR.map((photo, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                onClick={() => setActiveTourPhoto(photo)}
                className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden cursor-pointer border border-[#D4A373]/25 hover:border-[#D4A373] shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                <div className="absolute inset-0 p-3.5 flex flex-col justify-between">
                  <span className="self-start px-2 py-0.5 bg-white/90 backdrop-blur-md text-[10px] uppercase tracking-wider text-[#0891B2] font-semibold rounded-md shadow-sm">
                    {photo.tag}
                  </span>

                  <div>
                    <h4 className="font-serif text-xs sm:text-sm text-white font-medium group-hover:text-[#D4A373] transition-colors leading-snug">
                      {photo.title}
                    </h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Room Details Modal with Photo Switcher */}
      <AnimatePresence>
        {activeModalRoom && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalRoom(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-[#D4A373]/30 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl"
            >
              
              <button
                onClick={() => setActiveModalRoom(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#F4EFEA] text-[#718096] hover:text-[#2D3748] transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Active Image */}
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-3 shadow-md bg-gray-100">
                <img
                  src={
                    activeModalRoom.gallery && activeModalRoom.gallery[modalActiveImageIndex] 
                      ? activeModalRoom.gallery[modalActiveImageIndex]
                      : activeModalRoom.image
                  }
                  alt={activeModalRoom.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Left/Right Arrows if gallery > 1 */}
                {activeModalRoom.gallery && activeModalRoom.gallery.length > 1 && (
                  <>
                    <button
                      onClick={() => setModalActiveImageIndex((prev) => (prev > 0 ? prev - 1 : activeModalRoom.gallery.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setModalActiveImageIndex((prev) => (prev < activeModalRoom.gallery.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Bar */}
              {activeModalRoom.gallery && activeModalRoom.gallery.length > 1 && (
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                  {activeModalRoom.gallery.map((thumb, i) => (
                    <button
                      key={i}
                      onClick={() => setModalActiveImageIndex(i)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        modalActiveImageIndex === i ? 'border-[#D4A373] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={thumb} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <span className="text-xs uppercase tracking-widest text-[#0891B2] font-semibold">
                {activeModalRoom.category}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2D3748] mt-1">
                {activeModalRoom.name}
              </h3>
              <p className="text-sm text-[#718096] mt-2 font-normal">
                {activeModalRoom.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 py-4 my-4 border-y border-[#D4A373]/20 text-xs text-[#718096]">
                <span><strong>Bed:</strong> {activeModalRoom.bed}</span>
                <span><strong>Capacity:</strong> {activeModalRoom.capacity}</span>
                <span><strong>Area:</strong> {activeModalRoom.size}</span>
                <span><strong>Helipad:</strong> 2 Mins to Pinnacle</span>
              </div>

              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#2D3748] mb-3">
                Included In This Room
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                {activeModalRoom.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#4A5568]">
                    <Check className="w-4 h-4 text-[#166534] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#FFFDF7] p-4 rounded-xl border border-[#D4A373]/25 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#718096]">Nightly Rate</span>
                  <div className="text-xl font-serif text-[#2D3748] font-bold">
                    ₹{activeModalRoom.price.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-sans text-[#718096] font-normal">+ Taxes</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const rId = activeModalRoom.id;
                    setActiveModalRoom(null);
                    onOpenBooking({ selectedRoom: rId });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#D4A373] hover:bg-[#B88555] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  Proceed to Reserve
                </motion.button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Tour Lightbox */}
      <AnimatePresence>
        {activeTourPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveTourPhoto(null)}
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
                onClick={() => setActiveTourPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-[#2D3748] hover:bg-white transition-colors border border-[#D4A373]/30 shadow-md"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={activeTourPhoto.url}
                alt={activeTourPhoto.title}
                className="w-full max-h-[75vh] object-cover"
              />

              <div className="p-5 bg-[#FFFDF7] flex items-center justify-between border-t border-[#D4A373]/20">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#0891B2] font-semibold">
                    {activeTourPhoto.tag}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-[#2D3748] mt-0.5">
                    {activeTourPhoto.title}
                  </h3>
                  <p className="text-xs text-[#718096] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D4A373]" /> Kanti Resort, Phata (Kedarnath Highway)
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
