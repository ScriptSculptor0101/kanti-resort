import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { RESORT_INFO } from '../data/resortData';

export default function Footer({ onOpenBooking, onOpenRms }) {
  return (
    <footer className="bg-[#1E252B] border-t border-[#D4A373]/25 text-[#A0AEC0] text-xs pt-16 pb-12 relative overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4A373]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#D4A373]/20">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <a href="#" className="flex items-center gap-3 group">
              <img 
                src="/kanti-logo-circle.png" 
                alt="Kanti Resort Logo" 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#D4A373]/30 shadow-md group-hover:scale-105 transition-transform" 
              />
              <div className="flex flex-col">
                <span className="font-serif tracking-widest text-2xl font-normal text-[#D4A373]">
                  KANTI RESORT
                </span>
                <span className="font-sans text-[10px] tracking-[0.25em] text-[#0891B2] uppercase font-semibold">
                  Phata • Kedar Valley • Kedarnath
                </span>
              </div>
            </a>
            
            <p className="text-[#E2E8F0]/85 font-normal leading-relaxed pr-4">
              Sanctuary for Kedarnath Dham pilgrims and travelers. Nestled along the scenic mountain banks of the Mandakini River in Phata, Uttarakhand.
            </p>

            <div className="flex items-center gap-3 pt-1 text-[#E2E8F0]">
              <span className="px-3 py-1 rounded-full bg-[#28323A] border border-[#D4A373]/25 text-[11px]">
                🚁 2 Mins to Helipads
              </span>
              <span className="px-3 py-1 rounded-full bg-[#28323A] border border-[#D4A373]/25 text-[11px]">
                🏔️ Mandakini Valley View
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
              Explore Resort
            </h4>
            <ul className="space-y-2">
              <li><a href="#helipads" className="hover:text-[#D4A373] transition-colors">Helipads & Yatra</a></li>
              <li><a href="#rooms" className="hover:text-[#D4A373] transition-colors">Rooms</a></li>
              <li><a href="#location" className="hover:text-[#D4A373] transition-colors">Route & Travel Guide</a></li>
              <li><a href="#faqs" className="hover:text-[#D4A373] transition-colors">FAQs</a></li>
              <li>
                <button 
                  onClick={onOpenRms} 
                  className="text-stone-300 hover:text-[#D4A373] transition-colors flex items-center gap-1 font-semibold text-left pt-1"
                >
                  🔒 Staff Portal (RMS)
                </button>
              </li>
            </ul>
          </div>

          {/* Pilgrimage Support */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
              Pilgrim Hospitality
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-[#E2E8F0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />
                <span>5:00 AM Kedarnath Flight Breakfast</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#E2E8F0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />
                <span>Luggage Cloaking Facility (Free)</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#E2E8F0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />
                <span>24/7 Hot Geysers & Room Blowers</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#E2E8F0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0891B2]" />
                <span>Helipad Transfer Guidance</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#E2E8F0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#166534]" />
                <span>Emergency Medical & Oxygen Cylinders</span>
              </li>
            </ul>
          </div>

          {/* Contact & Helipad Helpline */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
              Direct Contact
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2 text-[#E2E8F0]">
                <MapPin className="w-4 h-4 text-[#0891B2] shrink-0 mt-0.5" />
                <a 
                  href={RESORT_INFO.googleMapsUrl || "https://maps.app.goo.gl/gmdUWMLvsQAqm5GC7"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4A373] transition-colors underline decoration-[#0891B2]/50 underline-offset-2"
                >
                  {RESORT_INFO.location}
                </a>
              </div>

              <div className="flex items-center gap-2 text-[#E2E8F0]">
                <Phone className="w-4 h-4 text-[#0891B2] shrink-0" />
                <a href={`tel:${RESORT_INFO.phonePrimary}`} className="hover:text-white font-mono">
                  {RESORT_INFO.phonePrimary}
                </a>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  Call & WhatsApp
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#E2E8F0]">
                <Mail className="w-4 h-4 text-[#0891B2] shrink-0" />
                <a href={`mailto:${RESORT_INFO.email}`} className="hover:text-white">
                  {RESORT_INFO.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="w-full py-2.5 rounded-xl bg-[#D4A373] hover:bg-[#B88555] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Instant Reservation
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#718096]">
          <div>
            © {new Date().getFullYear()} Kanti Resort, Phata. All rights reserved.
          </div>

          <div className="flex items-center gap-1.5 text-[#A0AEC0]">
            <span>Crafted with reverence in the divine Kedar Valley</span>
            <span className="text-[#D4A373] font-serif font-medium">ॐ नमः शिवाय</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#helipads" className="hover:text-white transition-colors">Helipads</a>
            <a href="#faqs" className="hover:text-white transition-colors">Yatra Guidelines</a>
            <a href="#location" className="hover:text-white transition-colors">Location</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
