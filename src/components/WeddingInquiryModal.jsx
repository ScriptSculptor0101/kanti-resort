import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Flame, Send, Phone, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RESORT_INFO } from '../data/resortData';
import { submitWeddingInquiry } from '../lib/supabaseClient';

export default function WeddingInquiryModal({ isOpen, onClose, initialData = {} }) {
  if (!isOpen) return null;

  const [brideGroom, setBrideGroom] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('2025-11-20');
  const [guests, setGuests] = useState(initialData.guestCount || 100);
  const [packageType, setPackageType] = useState(initialData.packageId || 'celestial-shiv-parvati');
  const [specialWishes, setSpecialWishes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedRefId, setSavedRefId] = useState('');

  const persistToSupabase = async (sourceTag = 'wedding_modal') => {
    setIsSubmitting(true);
    const refId = `KR-WED-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;
    setSavedRefId(refId);

    await submitWeddingInquiry({
      referenceId: refId,
      brideGroom: brideGroom || 'Wedding Couple',
      phone,
      city,
      date,
      guests,
      packageType,
      specialWishes,
      source: sourceTag
    });

    setIsSubmitting(false);
    return refId;
  };

  const handleWhatsAppInquiry = async () => {
    if (!phone) {
      alert('Please enter your WhatsApp / Mobile number so our Wedding Director can connect with you.');
      return;
    }

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    const refId = await persistToSupabase('wedding_modal_whatsapp');

    const msg = `*Triyuginarayan Destination Wedding Consultation Request*\n\n` +
      `• *Reference ID:* ${refId}\n` +
      `• *Bride & Groom:* ${brideGroom || 'Wedding Couple'}\n` +
      `• *Contact Number:* ${phone}\n` +
      `• *Current City:* ${city || 'India'}\n` +
      `• *Target Wedding Date:* ${date}\n` +
      `• *Expected Guests:* ${guests} Guests\n` +
      `• *Preferred Package:* ${packageType}\n` +
      (specialWishes ? `• *Special Notes:* ${specialWishes}\n\n` : `\n`) +
      `Please schedule a detailed video consultation with Kanti Resort's wedding director and share the Triyuginarayan date availability and decor brochure.`;

    const url = `https://wa.me/${RESORT_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setIsSubmitted(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    await persistToSupabase('wedding_modal_form');
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
              <span className="text-xs uppercase tracking-widest text-[#D4A373] font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#D4A373]" /> Akhand Dhuni Sacred Pheres
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2D3748] mt-1">
                Plan Your Triyuginarayan Wedding
              </h3>
              <p className="text-xs text-[#718096] mt-1">
                Take celestial vows where Shiva and Parvati married. End-to-end luxury hospitality at Kanti Resort, Phata.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Bride & Groom Names *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sneha & Aakash"
                    value={brideGroom}
                    onChange={(e) => setBrideGroom(e.target.value)}
                    className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Contact Phone / WhatsApp *</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Your City / State</label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi NCR / Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Tentative Wedding Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Expected Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] shadow-sm"
                  >
                    <option value={30} className="bg-white text-[#2D3748]">30 Guests (Intimate Vedic)</option>
                    <option value={60} className="bg-white text-[#2D3748]">60 Guests (Family Union)</option>
                    <option value={100} className="bg-white text-[#2D3748]">100 Guests (Grand Royal)</option>
                    <option value={150} className="bg-white text-[#2D3748]">150 Guests (Full Resort)</option>
                    <option value={200} className="bg-white text-[#2D3748]">200+ Guests (Full Takeover)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Package Format</label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] shadow-sm"
                  >
                    <option value="celestial-shiv-parvati" className="bg-white text-[#2D3748]">The Celestial Vows (Full 3-Day Wedding)</option>
                    <option value="akhand-dhuni-intimate" className="bg-white text-[#2D3748]">Akhand Dhuni Vedic Pheres (2-Day)</option>
                    <option value="custom-kanti-wedding" className="bg-white text-[#2D3748]">Bespoke Kedar Valley Celebration</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#718096] font-semibold">Ceremony & Decor Details (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Pahadi Dhol-Damau welcome, drone photography at temple, traditional mandap..."
                  value={specialWishes}
                  onChange={(e) => setSpecialWishes(e.target.value)}
                  className="w-full bg-[#FFFDF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#D4A373] resize-none shadow-sm"
                />
              </div>

              <div className="p-3.5 bg-[#FFFDF7] border border-[#D4A373]/25 rounded-xl text-xs text-[#4A5568]">
                ✨ <strong className="text-[#2D3748]">Included in all packages:</strong> Temple priest coordination, sacred wood samagri for Akhand Dhuni, Pahadi folk music, resort accommodation & round-trip temple transit.
              </div>

              <div className="pt-2 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleWhatsAppInquiry}
                  className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#14532D] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Connect With Wedding Director on WhatsApp</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#D4A373] hover:bg-[#B88555] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Submit Inquiry & Request Brochure</span>
                </motion.button>
              </div>

            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#D4A373]/15 text-[#D4A373] flex items-center justify-center mx-auto border border-[#D4A373]/30">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl text-[#2D3748]">Blessings on Your Upcoming Union!</h3>
            <p className="text-xs text-[#718096] max-w-sm mx-auto leading-relaxed">
              May Lord Shiva and Goddess Parvati bestow perpetual love and prosperity upon both of you. Your wedding consultation request has been safely saved in our system. Our Wedding Planning Director will reach out within 2 hours.
            </p>

            <div className="bg-[#FFFDF7] p-4 rounded-xl border border-[#D4A373]/25 text-xs text-[#2D3748] max-w-sm mx-auto space-y-1 shadow-sm">
              <span className="text-[#718096] block text-[11px]">Wedding Consultation ID:</span>
              <strong className="text-[#0891B2] font-mono text-base block">{savedRefId}</strong>
              <span className="text-[10px] text-[#166534] block pt-1 font-semibold">✓ Securely saved in Kanti Resort database</span>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <a
                href={`tel:${RESORT_INFO.phonePrimary}`}
                className="px-5 py-2.5 rounded-xl bg-[#F4EFEA] hover:bg-[#EAE4DC] border border-[#D4A373]/30 text-[#2D3748] text-xs font-semibold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#0891B2]" /> Call Wedding Team
              </a>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#D4A373] hover:bg-[#B88555] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
