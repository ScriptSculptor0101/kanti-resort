import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, Send, Phone, Loader2 } from 'lucide-react';
import { ROOMS, RESORT_INFO } from '../data/resortData';
import { submitRoomBooking } from '../lib/supabaseClient';

export default function BookingModal({ isOpen, onClose, initialData = {} }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [roomType, setRoomType] = useState(initialData.selectedRoom || ROOMS[0].id);
  const [checkIn, setCheckIn] = useState(initialData.checkIn || '2025-05-15');
  const [checkOut, setCheckOut] = useState(initialData.checkOut || '2025-05-17');
  const [guests, setGuests] = useState(initialData.guests || 2);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedRefId, setSavedRefId] = useState('');

  const selectedRoomObj = ROOMS.find(r => r.id === roomType) || ROOMS[0];
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) || 1);
  const totalAmount = selectedRoomObj.price * nights;

  const persistToSupabase = async (sourceTag = 'booking_modal') => {
    setIsSubmitting(true);
    const refId = `KR-PHATA-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;
    setSavedRefId(refId);

    await submitRoomBooking({
      referenceId: refId,
      name: name || 'Pilgrim Devotee',
      phone,
      email,
      roomType,
      roomName: selectedRoomObj.name,
      checkIn,
      checkOut,
      nights,
      guests,
      totalAmount,
      notes,
      source: sourceTag
    });

    setIsSubmitting(false);
    return refId;
  };

  const handleWhatsAppSend = async () => {
    if (!phone) {
      alert('Please enter your WhatsApp / Mobile number so we can confirm your reservation.');
      return;
    }

    const refId = await persistToSupabase('booking_modal_whatsapp');

    const text = `*New Kedarnath Stay Booking Request - Kanti Resort, Phata*\n\n` +
      `• *Reference ID:* ${refId}\n` +
      `• *Guest Name:* ${name || 'Pilgrim Devotee'}\n` +
      `• *Contact Phone:* ${phone}\n` +
      `• *Email:* ${email || 'N/A'}\n` +
      `• *Room Chosen:* ${selectedRoomObj.name}\n` +
      `• *Dates:* ${checkIn} to ${checkOut} (${nights} Night${nights > 1 ? 's' : ''})\n` +
      `• *Guests Count:* ${guests}\n` +
      `• *Location:* Phata (2 mins to helipads)\n` +
      `• *Total Estimated Amount:* ₹${totalAmount.toLocaleString('en-IN')}\n` +
      (notes ? `• *Special Notes:* ${notes}\n\n` : `\n`) +
      `Kindly confirm room availability and payment instructions. Har Har Mahadev!`;

    const url = `https://wa.me/${RESORT_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsSubmitted(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await persistToSupabase('booking_modal_form');
    setIsSubmitted(true);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-[#D4A373]/30 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl"
      >
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#F4EFEA] text-[#718096] hover:text-[#2D3748] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#0891B2] font-bold">
                Online Reservation
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2D3748] mt-1">
                Book Kedarnath Pilgrimage Stay
              </h3>
              <p className="text-xs text-[#718096] mt-1">
                Located 2 minutes from all Phata helipads with scenic mountain and river views.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">WhatsApp / Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] shadow-sm"
                  />
                </div>
              </div>

              {/* Room Type */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Select Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] shadow-sm"
                >
                  {ROOMS.map(r => (
                    <option key={r.id} value={r.id} className="bg-white text-[#2D3748]">
                      {r.name} — ₹{r.price.toLocaleString('en-IN')}/night ({r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Check-In Date</label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Check-Out Date</label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] shadow-sm"
                  />
                </div>
              </div>

              {/* Guests Count */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Total Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] shadow-sm"
                >
                  <option value={1} className="bg-white text-[#2D3748]">1 Guest</option>
                  <option value={2} className="bg-white text-[#2D3748]">2 Guests</option>
                  <option value={3} className="bg-white text-[#2D3748]">3 Guests</option>
                  <option value={4} className="bg-white text-[#2D3748]">4 Guests</option>
                  <option value={5} className="bg-white text-[#2D3748]">5+ Guests</option>
                </select>
              </div>

              {/* Special Requests */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Special Requests (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 5:00 AM breakfast box, senior citizen ground floor room..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] resize-none shadow-sm"
                />
              </div>

              {/* Summary Box */}
              <div className="bg-[#F4EFEA] p-4 rounded-xl border border-[#D4A373]/20 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#718096] block">{nights} Night(s) Stay</span>
                  <strong className="text-[#2D3748] text-sm">{selectedRoomObj.name}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[#718096] block text-[10px] uppercase font-medium">Estimated Total</span>
                  <span className="font-serif text-lg font-bold text-[#0891B2]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleWhatsAppSend}
                  className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#14532D] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Instant WhatsApp Booking Request</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#D4A373] hover:bg-[#B88555] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Confirm Reservation Inquiry</span>
                </motion.button>
              </div>

            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#166534]/15 text-[#166534] flex items-center justify-center mx-auto border border-[#166534]/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl text-[#2D3748]">Reservation Request Saved & Received!</h3>
            <p className="text-xs text-[#718096] max-w-sm mx-auto leading-relaxed">
              Jai Baba Kedar! Your pilgrimage inquiry has been logged in our secure resort system. Our manager at Phata is reviewing your dates and will contact you via WhatsApp / Call within 15 minutes.
            </p>

            <div className="bg-[#FFFDF7] p-4 rounded-xl border border-[#D4A373]/25 text-xs text-[#2D3748] max-w-sm mx-auto space-y-1 shadow-sm">
              <span className="text-[#718096] block text-[11px]">System Reference ID:</span>
              <strong className="text-[#0891B2] font-mono text-base block">{savedRefId}</strong>
              <span className="text-[10px] text-[#166534] block pt-1 font-semibold">✓ Securely saved in Kanti Resort database</span>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <a
                href={`tel:${RESORT_INFO.phonePrimary}`}
                className="px-5 py-2.5 rounded-xl bg-[#F4EFEA] hover:bg-[#EAE4DC] border border-[#D4A373]/30 text-[#2D3748] text-xs font-semibold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#0891B2]" /> Call Desk
              </a>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#D4A373] hover:bg-[#B88555] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
