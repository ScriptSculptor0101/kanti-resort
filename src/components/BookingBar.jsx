import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Home, Send, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { ROOMS, RESORT_INFO } from '../data/resortData';
import { submitRoomBooking } from '../lib/supabaseClient';

export default function BookingBar({ onOpenBooking }) {
  // Form State
  const [checkIn, setCheckIn] = useState('2025-05-15');
  const [checkOut, setCheckOut] = useState('2025-05-17');
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0].id);
  const [guests, setGuests] = useState(2);

  const selectedRoomObj = ROOMS.find(r => r.id === selectedRoom) || ROOMS[0];

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) || 1);
  const totalEstimate = selectedRoomObj.price * nights;

  // Handle WhatsApp direct inquiry
  const handleWhatsAppBooking = async () => {
    const refId = `KR-BAR-${Date.now().toString().slice(-4)}`;
    submitRoomBooking({
      referenceId: refId,
      name: 'Pilgrim Visitor',
      phone: 'Pending WhatsApp',
      roomType: selectedRoom,
      roomName: selectedRoomObj.name,
      checkIn,
      checkOut,
      nights,
      guests,
      totalAmount: totalEstimate,
      source: 'booking_bar_whatsapp'
    }).catch(err => console.error('Supabase bar log err:', err));

    const message = `*Kedarnath Yatra Booking Inquiry - Kanti Resort, Phata*\n\n` +
      `• Ref: ${refId}\n` +
      `• Check-in: ${checkIn}\n` +
      `• Check-out: ${checkOut} (${nights} Night${nights > 1 ? 's' : ''})\n` +
      `• Room: ${selectedRoomObj.name}\n` +
      `• Guests: ${guests}\n` +
      `• Location: Phata (2 mins to helipads)\n` +
      `• Estimated Amount: ₹${totalEstimate.toLocaleString('en-IN')}\n\n` +
      `Please confirm room availability and payment instructions.`;

    const url = `https://wa.me/${RESORT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div 
      id="booking-bar" 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 max-w-6xl mx-auto -mt-8 sm:-mt-12 px-4 sm:px-6"
    >
      <div className="bg-white/95 backdrop-blur-xl border border-[#D4A373]/30 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl framed-card-shadow">
        
        {/* Header indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D4A373]/20 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4A373] animate-pulse" />
            <h3 className="text-sm font-semibold text-[#2D3748] uppercase tracking-wider flex items-center gap-2">
              <Home className="w-4 h-4 text-[#D4A373]" />
              Kedarnath Yatra Stay Reservation
            </h3>
          </div>

          <div className="flex items-center text-xs text-[#718096] gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#166534]" />
            <span className="text-[#2D3748]">Best Rate Guaranteed • <strong className="text-[#0891B2]">2 to 5 Mins Walking to Phata Helipads</strong></span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          {/* Check-in */}
          <div className="space-y-1.5 group">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#718096] flex items-center gap-1 group-focus-within:text-[#D4A373] transition-colors">
              <Calendar className="w-3 h-3 text-[#D4A373]" /> Check-In Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#2D3748] focus:outline-none focus:border-[#D4A373] transition-all duration-200 hover:border-[#D4A373]/60 shadow-sm"
            />
          </div>

          {/* Check-out */}
          <div className="space-y-1.5 group">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#718096] flex items-center gap-1 group-focus-within:text-[#D4A373] transition-colors">
              <Calendar className="w-3 h-3 text-[#D4A373]" /> Check-Out Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#2D3748] focus:outline-none focus:border-[#D4A373] transition-all duration-200 hover:border-[#D4A373]/60 shadow-sm"
            />
          </div>

          {/* Room Choice */}
          <div className="space-y-1.5 group">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#718096] flex items-center gap-1 group-focus-within:text-[#D4A373] transition-colors">
              <Home className="w-3 h-3 text-[#D4A373]" /> Room Type
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#2D3748] focus:outline-none focus:border-[#D4A373] transition-all duration-200 hover:border-[#D4A373]/60 shadow-sm"
            >
              {ROOMS.map(r => (
                <option key={r.id} value={r.id} className="bg-white text-[#2D3748]">
                  {r.name} (₹{r.price.toLocaleString('en-IN')}/night)
                </option>
              ))}
            </select>
          </div>

          {/* Guests Count */}
          <div className="space-y-1.5 group">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#718096] flex items-center gap-1 group-focus-within:text-[#D4A373] transition-colors">
              <Users className="w-3 h-3 text-[#D4A373]" /> Pilgrims / Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#2D3748] focus:outline-none focus:border-[#D4A373] transition-all duration-200 hover:border-[#D4A373]/60 shadow-sm"
            >
              <option value={1} className="bg-white text-[#2D3748]">1 Guest</option>
              <option value={2} className="bg-white text-[#2D3748]">2 Guests</option>
              <option value={3} className="bg-white text-[#2D3748]">3 Guests</option>
              <option value={4} className="bg-white text-[#2D3748]">4 Guests (Family)</option>
              <option value={5} className="bg-white text-[#2D3748]">5+ Guests (Group)</option>
            </select>
          </div>
        </div>

        {/* Bottom summary and action */}
        <div className="mt-5 pt-4 border-t border-[#D4A373]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#718096]">
            <div className="flex items-center gap-1.5 text-[#0891B2] font-medium">
              <MapPin className="w-4 h-4 text-[#0891B2]" />
              <span>Located 2 to 5 mins from all Phata Helipads</span>
            </div>
            <span className="text-[#D4A373]/40">|</span>
            <span className="text-[#2D3748] font-medium">
              {nights} Night{nights > 1 ? 's' : ''} • Est: <strong className="text-[#0891B2] text-sm font-serif">₹{totalEstimate.toLocaleString('en-IN')}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsAppBooking}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Instant WhatsApp Booking
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenBooking({ selectedRoom, checkIn, checkOut, guests })}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#D4A373] hover:bg-[#B88555] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Reserve Online</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
