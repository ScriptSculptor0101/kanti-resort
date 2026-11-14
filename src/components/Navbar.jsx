import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Maximize2, Minimize2, Menu, X } from 'lucide-react';
import { RESORT_INFO } from '../data/resortData';

export default function Navbar({ onOpenBooking, isFramedMode, toggleFramedMode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Helipads & Yatra', href: '#helipads' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'Location', href: '#location' },
    { name: 'FAQs', href: '#faqs' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#FFFDF7]/95 backdrop-blur-md border-b border-[#D4A373]/20 py-3 shadow-sm' 
          : 'bg-gradient-to-b from-[#FFFDF7]/90 via-[#FFFDF7]/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo in NomadKit Styling */}
          <a href="#" className="flex flex-col group">
            <span className="font-serif tracking-widest text-2xl sm:text-3xl font-normal text-[#2D3748] group-hover:text-[#D4A373] transition-colors flex items-center gap-2">
              KANTI RESORT
            </span>
            <span className="font-sans text-[10px] tracking-[0.25em] text-[#0891B2] uppercase font-semibold">
              Phata • Kedar Valley • Kedarnath
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-[0.2em] text-[#4A5568] hover:text-[#D4A373] transition-colors font-semibold relative group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4A373] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Toggle Framed Mode */}
            <button
              onClick={toggleFramedMode}
              title={isFramedMode ? "Switch to Full Screen View" : "Switch to Framed Reference View"}
              className="p-2 rounded-full border border-[#D4A373]/30 text-[#4A5568] hover:text-[#D4A373] hover:border-[#D4A373] transition-colors text-xs flex items-center gap-1.5 bg-white/70"
            >
              {isFramedMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="text-[11px] hidden xl:inline font-medium">{isFramedMode ? "Full View" : "Framed Mode"}</span>
            </button>

            {/* Quick Call */}
            <a
              href={`tel:${RESORT_INFO.phonePrimary}`}
              className="flex items-center space-x-1.5 text-xs text-[#2D3748] hover:text-[#0891B2] border border-[#D4A373]/35 hover:border-[#0891B2] px-3.5 py-2 rounded-full transition-all bg-white/80 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#0891B2]" />
              <span className="font-medium tracking-wide">Call Front Desk</span>
            </a>

            {/* Book Stay CTA */}
            <button
              onClick={() => onOpenBooking()}
              className="relative group overflow-hidden bg-[#D4A373] hover:bg-[#B88555] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full shadow-md hover:shadow-lg hover:shadow-[#D4A373]/30 hover:scale-105 transition-all duration-200"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Book Stay
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => onOpenBooking()}
              className="bg-[#D4A373] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2D3748] hover:text-[#D4A373] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF7]/98 border-b border-[#D4A373]/20 px-6 py-6 space-y-4 shadow-xl animate-fadeIn">
          <div className="space-y-3 border-b border-[#D4A373]/20 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-wider text-[#4A5568] hover:text-[#D4A373] py-1.5 font-semibold"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#D4A373] hover:bg-[#B88555] text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
            >
              <Calendar className="w-4 h-4" /> Book Kedarnath Stay
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-[#718096]">
            <a href={`tel:${RESORT_INFO.phonePrimary}`} className="flex items-center gap-1 text-[#2D3748] font-medium">
              <Phone className="w-3.5 h-3.5 text-[#0891B2]" /> {RESORT_INFO.phonePrimary}
            </a>
            <button onClick={toggleFramedMode} className="text-[#0891B2] underline text-[11px] font-medium">
              {isFramedMode ? "Standard Full View" : "Framed Reference Look"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
