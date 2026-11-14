import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';
import { RESORT_INFO } from '../data/resortData';

export default function FloatingActions({ onOpenBooking }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end space-y-3">
      
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="p-3 rounded-full bg-white/95 hover:bg-[#D4A373] text-[#718096] hover:text-white border border-[#D4A373]/30 shadow-lg transition-all duration-200"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Direct Call Floating Button */}
      <a
        href={`tel:${RESORT_INFO.phonePrimary}`}
        aria-label="Call Kanti Resort Desk"
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white/95 hover:bg-white text-[#2D3748] border border-[#D4A373]/30 shadow-xl backdrop-blur-md group transition-all"
      >
        <div className="p-1 rounded-full bg-[#0891B2]/15 text-[#0891B2]">
          <Phone className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-semibold tracking-wide pr-1 hidden sm:inline text-[#2D3748]">
          Front Desk
        </span>
      </a>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${RESORT_INFO.whatsapp}?text=Namaste!%20I%20would%20like%20to%20inquire%20about%20staying%20at%20Kanti%20Resort,%20Phata.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Kanti Resort on WhatsApp"
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#166534] hover:bg-[#14532D] text-white shadow-xl hover:scale-105 transition-all duration-200 group relative"
      >
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#0891B2] rounded-full animate-ping" />
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline">
          WhatsApp Us
        </span>
      </a>

    </div>
  );
}
