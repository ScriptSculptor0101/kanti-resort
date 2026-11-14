import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone, MessageCircle, MapPin, Home, Sparkles } from 'lucide-react';
import { RESORT_INFO } from '../data/resortData';

export default function Hero({ onOpenBooking }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const floatingVariants = (delay = 0, yOffset = 8) => ({
    animate: {
      y: [-yOffset / 2, yOffset / 2, -yOffset / 2],
      transition: {
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }
    }
  });

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-28 sm:pt-36 pb-10 overflow-hidden">
      
      {/* NomadKit Ambient Background */}
      <div className="absolute inset-0 z-0 bg-[#FFFDF7] overflow-hidden">
        {/* Warm Sand & Ocean Ambient Luminous Spheres */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[#D4A373]/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#0891B2]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[#D4A373]/12 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#166534]/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Subtle decorative dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#D4A373_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Floating Badges */}
      <motion.div 
        variants={floatingVariants(0, 10)}
        animate="animate"
        className="hidden xl:flex absolute top-40 left-10 z-10 bg-white/95 backdrop-blur-md border border-[#D4A373]/30 px-4 py-3 rounded-2xl shadow-xl items-center gap-3 text-left max-w-xs"
      >
        <div className="p-2.5 rounded-xl bg-[#0891B2]/10 text-[#0891B2]">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#718096] block font-semibold">Proximity</span>
          <span className="text-xs font-serif font-bold text-[#2D3748]">450m to Pinnacle Helipad</span>
          <p className="text-[10px] text-[#0891B2] font-medium">2 Mins Walk along Highway</p>
        </div>
      </motion.div>

      <motion.div 
        variants={floatingVariants(1.2, 10)}
        animate="animate"
        className="hidden xl:flex absolute top-44 right-10 z-10 bg-white/95 backdrop-blur-md border border-[#D4A373]/30 px-4 py-3 rounded-2xl shadow-xl items-center gap-3 text-left max-w-xs"
      >
        <div className="p-2.5 rounded-xl bg-[#D4A373]/15 text-[#D4A373]">
          <Home className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#718096] block font-semibold">Scenic Stay</span>
          <span className="text-xs font-serif font-bold text-[#2D3748]">Mandakini Riverfront</span>
          <p className="text-[10px] text-[#D4A373] font-medium">Private Mountain Balconies</p>
        </div>
      </motion.div>

      {/* Hero Animated Content Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto space-y-5 my-auto"
      >
        {/* Eyebrow Pill */}
        <motion.div variants={itemVariants} className="inline-block">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#D4A373]/40 text-[#B88555] text-xs sm:text-sm font-serif tracking-[0.25em] uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373] animate-pulse" />
            <span>Sanctuary of the Kedar Valley</span>
          </div>
        </motion.div>

        {/* Eyebrow Label */}
        <motion.h2 variants={itemVariants} className="font-sans text-xs sm:text-sm tracking-[0.35em] text-[#0891B2] uppercase font-bold">
          DISCOVER
        </motion.h2>
        
        {/* Main Headline */}
        <motion.h1 variants={itemVariants} className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.08] relative">
          <span className="glow-kanti block sm:inline">
            Kanti Resort
          </span>{' '}
          <br className="hidden sm:inline" />
          <span className="italic font-light glow-phata block sm:inline">
            Phata, Kedarnath
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-sm sm:text-lg text-[#4A5568] font-normal leading-relaxed px-2 pt-1">
          Your sacred mountain haven overlooking the Mandakini river. Located just{' '}
          <span className="text-[#0891B2] font-semibold">2 minutes from Phata helipads</span>{' '}
          with comfortable alpine rooms, instant hot water geysers, and serene valley views.
        </motion.p>

        {/* Interactive Feature Pills */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 pt-2 text-xs text-[#4A5568]">
          <span className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#D4A373]/30 flex items-center gap-1.5 transition-colors shadow-sm font-medium">
            🚁 2 Mins to All Phata Helipads
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#D4A373]/30 flex items-center gap-1.5 transition-colors shadow-sm font-medium">
            🏔️ Mandakini River & Peak Balconies
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#D4A373]/30 flex items-center gap-1.5 transition-colors shadow-sm font-medium">
            🔥 24/7 Geyser & Room Heating
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#D4A373]/30 flex items-center gap-1.5 transition-colors shadow-sm font-medium">
            🛡️ Free Luggage Cloaking Facility
          </span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3">
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 12px 28px rgba(212, 163, 115, 0.35)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenBooking()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#D4A373] hover:bg-[#B88555] text-white font-semibold text-sm tracking-wider uppercase shadow-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book Kedarnath Yatra Stay
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, borderColor: "#0891B2" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection('rooms')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#0891B2] hover:bg-[#0891B2]/5 font-semibold text-sm tracking-wider uppercase backdrop-blur-md border border-[#0891B2] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4 text-[#0891B2]" />
            Explore Rooms
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[#D4A373]/20 text-xs text-[#718096]"
      >
        
        {/* Left: Elevation & Weather indicator */}
        <div className="flex items-center gap-3 order-2 md:order-1">
          <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full border border-[#D4A373]/30 text-[#2D3748] shadow-sm font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0891B2]" />
            <span>Phata • 1,550m Elevation</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full border border-[#166534]/30 text-[#166534] shadow-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
            <span>Kedarnath Yatra Open</span>
          </div>
        </div>

        {/* Center: SCROLL indicator */}
        <button
          onClick={() => scrollToSection('booking-bar')}
          className="flex flex-col items-center gap-2 group order-1 md:order-2 cursor-pointer transition-transform duration-300 hover:translate-y-1"
        >
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#718096] group-hover:text-[#D4A373] transition-colors font-bold">
            SCROLL
          </span>
          <motion.div 
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1.5px] h-8 bg-gradient-to-b from-[#D4A373] to-transparent group-hover:from-[#0891B2] transition-all" 
          />
        </button>

        {/* Right: Quick Direct Social / Helpline Links */}
        <div className="flex items-center gap-3 order-3">
          <a
            href={`https://wa.me/${RESORT_INFO.whatsapp}?text=Namaste!%20I%20would%20like%20to%20inquire%20about%20booking%20at%20Kanti%20Resort,%20Phata.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#166534] hover:bg-[#14532D] text-white px-3.5 py-1.5 rounded-full shadow-sm transition-all font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Us</span>
          </a>

          <a
            href={`tel:${RESORT_INFO.phonePrimary}`}
            className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-[#2D3748] hover:text-[#0891B2] border border-[#D4A373]/30 px-3.5 py-1.5 rounded-full shadow-sm transition-all font-medium"
          >
            <Phone className="w-3.5 h-3.5 text-[#0891B2]" />
            <span>{RESORT_INFO.phonePrimary}</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
