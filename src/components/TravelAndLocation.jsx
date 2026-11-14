import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, ExternalLink } from 'lucide-react';
import { TRAVEL_ROUTES, RESORT_INFO } from '../data/resortData';

export default function TravelAndLocation() {
  const [selectedRoute, setSelectedRoute] = useState(0);

  const landmarks = [
    { name: "Phata Helipads (All Operators)", distance: "450m - 1.5 km", time: "2 - 4 mins", highlight: true },
    { name: "Triyuginarayan Temple", distance: "14 km", time: "35 mins", highlight: true },
    { name: "Sonprayag (Yatra Checkpost)", distance: "15 km", time: "25 mins", highlight: false },
    { name: "Gaurikund (Kedarnath Trek Base)", distance: "18 km", time: "40 mins", highlight: false },
    { name: "Guptkashi (Vishwanath Temple)", distance: "14 km", time: "25 mins", highlight: false },
    { name: "Rishikesh Railway Station", distance: "195 km", time: "6 hours", highlight: false }
  ];

  return (
    <section id="location" className="py-20 sm:py-28 bg-[#F4EFEA] relative overflow-hidden">
      
      {/* Decorative ambient glow */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[350px] bg-[#D4A373]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[#0891B2] font-bold">
            Location & Route Guide
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2D3748] font-normal">
            Reaching Kanti Resort, Phata
          </h2>
          <p className="text-sm sm:text-base text-[#718096] font-normal leading-relaxed">
            Situated centrally along the Rudraprayag-Kedarnath National Highway (NH-107) in the picturesque village of Phata, surrounded by green cedar forests and the rushing Mandakini river.
          </p>
        </motion.div>

        {/* Proximity & Distance Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Key Distances */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-white border border-[#D4A373]/25 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl"
          >
            <h3 className="font-serif text-xl sm:text-2xl text-[#2D3748] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#D4A373]" />
              Strategic Distances
            </h3>
            <p className="text-xs text-[#718096]">
              Kanti Resort is the central hub for both Kedarnath Dham helicopter flights and Triyuginarayan weddings.
            </p>

            <div className="space-y-3 pt-2">
              {landmarks.map((l, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    l.highlight 
                      ? 'bg-[#FFFDF7] border-[#0891B2]/40 text-[#2D3748] shadow-sm' 
                      : 'bg-[#FFFDF7] border-[#D4A373]/20 text-[#718096]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${l.highlight ? 'text-[#0891B2]' : 'text-[#718096]'}`} />
                    <span className="font-medium">{l.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#0891B2]">{l.distance}</span>
                    <span className="text-[10px] text-[#718096] block">{l.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-2">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={RESORT_INFO.googleMapsUrl || "https://maps.app.goo.gl/gmdUWMLvsQAqm5GC7"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-white hover:bg-[#D4A373] text-[#2D3748] hover:text-white border border-[#D4A373]/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md group"
              >
                <ExternalLink className="w-4 h-4 text-[#0891B2] group-hover:text-white" />
                <span>Open Official Location on Google Maps</span>
              </motion.a>
              <div className="text-center mt-2">
                <span className="text-[11px] text-[#718096]">
                  ⭐ Rated {RESORT_INFO.googleRating}/5 on Google Maps ({RESORT_INFO.googleReviewCount} Reviews)
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Route Selector & Driving Instructions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            
            <div className="bg-white border border-[#D4A373]/25 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0891B2] mb-4">
                Select Your Starting Point:
              </h3>

              {/* Route Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
                {TRAVEL_ROUTES.map((route, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedRoute(idx)}
                    className={`relative p-3 rounded-xl border text-left transition-all ${
                      selectedRoute === idx
                        ? 'border-[#D4A373] font-bold shadow-sm text-white'
                        : 'bg-[#FFFDF7] text-[#718096] border-[#D4A373]/20 hover:text-[#2D3748]'
                    }`}
                  >
                    {selectedRoute === idx && (
                      <motion.div
                        layoutId="activeRouteTab"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 bg-[#D4A373] rounded-xl -z-10 shadow-sm"
                      />
                    )}
                    <div className="text-xs font-semibold">{route.from.split('(')[0]}</div>
                    <div className="text-[11px] opacity-90 mt-0.5">{route.distance}</div>
                  </button>
                ))}
              </div>

              {/* Selected Route Details */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedRoute}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 bg-[#FFFDF7] p-5 rounded-2xl border border-[#D4A373]/25"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4A373]/20 pb-3">
                    <div>
                      <span className="text-xs text-[#718096]">Route Origin</span>
                      <h4 className="text-base font-serif text-[#2D3748] font-bold">{TRAVEL_ROUTES[selectedRoute].from}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#718096]">Drive Duration</span>
                      <div className="text-sm font-semibold text-[#0891B2]">{TRAVEL_ROUTES[selectedRoute].duration}</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-[#718096] block mb-1 font-medium">Recommended Highway Path:</span>
                    <p className="text-xs text-[#2D3748] leading-relaxed font-mono bg-white p-3 rounded-lg border border-[#D4A373]/20 shadow-sm">
                      {TRAVEL_ROUTES[selectedRoute].route}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-[#718096] block mb-1 font-medium">Travel Advice:</span>
                    <p className="text-xs text-[#CA8A04] bg-[#CA8A04]/10 p-2.5 rounded-lg border border-[#CA8A04]/20 font-medium">
                      💡 {TRAVEL_ROUTES[selectedRoute].tips}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
