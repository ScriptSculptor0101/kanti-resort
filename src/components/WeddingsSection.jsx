import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Flame, Music, Droplets, CheckCircle2, MessageCircle 
} from 'lucide-react';
import { WEDDING_PACKAGES, WEDDING_RITUALS, RESORT_INFO } from '../data/resortData';

export default function WeddingsSection({ onOpenWeddingModal }) {
  return (
    <section id="weddings" className="py-20 sm:py-28 bg-[#FFFDF7] relative overflow-hidden">
      
      {/* Background Sacred Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#D4A373]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D4A373]/30 text-[#D4A373] text-xs font-serif tracking-widest uppercase font-semibold shadow-sm">
            <Flame className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>The Eternal Akhand Dhuni</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2D3748] font-normal">
            Triyuginarayan Destination Weddings
          </h2>
          
          <p className="text-sm sm:text-base text-[#718096] font-normal leading-relaxed">
            Where Lord Shiva and Goddess Parvati married in the presence of Lord Vishnu and Lord Brahma. Just 14 km from Triyuginarayan Temple, Kanti Resort orchestrates celestial destination weddings with authentic Vedic sanctity and mountain luxury.
          </p>
        </motion.div>

        {/* Legend Story Highlight Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-[#D4A373]/30 rounded-3xl p-6 sm:p-10 mb-16 shadow-xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#0891B2] font-bold">
                Treta Yuga Heritage • The Akhand Dhuni
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2D3748]">
                Bind Your Souls Before The Flame That Never Extinguishes
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-normal">
                Couples from across India and the world travel to Triyuginarayan Temple to take their sacred seven vows around the eternal fire pit (<em className="text-[#D4A373] font-semibold not-italic">Akhand Dhuni</em>) that has burned perpetually since Shiva-Parvati's cosmic wedding.
              </p>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-normal">
                Kanti Resort in Phata acts as your complete wedding hospitality base: luxury accommodation for all your wedding guests, pre-wedding rituals (Haldi, Mehendi, Sangeet) on riverside lawns, traditional Garhwali feasts, and private transport convoys up to Triyuginarayan Temple.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#FFFDF7] p-3 rounded-xl border border-[#D4A373]/25 text-center shadow-sm">
                  <span className="text-[#D4A373] font-serif text-xl font-bold">14 km</span>
                  <p className="text-[11px] text-[#718096] mt-0.5">Resort to Temple</p>
                </div>
                <div className="bg-[#FFFDF7] p-3 rounded-xl border border-[#D4A373]/25 text-center shadow-sm">
                  <span className="text-[#0891B2] font-serif text-xl font-bold">35 mins</span>
                  <p className="text-[11px] text-[#718096] mt-0.5">Scenic Drive</p>
                </div>
                <div className="bg-[#FFFDF7] p-3 rounded-xl border border-[#D4A373]/25 text-center shadow-sm">
                  <span className="text-[#166534] font-serif text-xl font-bold">100%</span>
                  <p className="text-[11px] text-[#718096] mt-0.5">Vedic Rituals</p>
                </div>
                <div className="bg-[#FFFDF7] p-3 rounded-xl border border-[#D4A373]/25 text-center shadow-sm">
                  <span className="text-[#D4A373] font-serif text-xl font-bold">200+</span>
                  <p className="text-[11px] text-[#718096] mt-0.5">Guest Capacity</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden border border-[#D4A373]/25 shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                  alt="Destination wedding mandap in the Himalayas"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <span className="text-xs text-[#D4A373] tracking-widest uppercase font-semibold">Sacred Union</span>
                    <h4 className="font-serif text-lg">Pheres around the Akhand Dhuni</h4>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>

        {/* 4 Sacred Rituals */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-[#0891B2] font-bold">Sacred Ceremonies</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2D3748] mt-1">Four Elements of a Triyugi Wedding</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WEDDING_RITUALS.map((rit, idx) => {
              const iconMap = {
                Flame: <Flame className="w-5 h-5 text-[#D4A373]" />,
                Sparkles: <Sparkles className="w-5 h-5 text-[#0891B2]" />,
                Music: <Music className="w-5 h-5 text-[#166534]" />,
                Droplets: <Droplets className="w-5 h-5 text-[#0891B2]" />
              };

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-[#D4A373]/25 hover:border-[#D4A373] transition-all group shadow-md hover:shadow-xl"
                >
                  <div className="p-3 w-fit rounded-xl bg-[#F4EFEA] mb-4 group-hover:scale-110 transition-transform">
                    {iconMap[rit.icon] || <Sparkles className="w-5 h-5 text-[#D4A373]" />}
                  </div>
                  <h4 className="text-base font-semibold text-[#2D3748] mb-2 group-hover:text-[#D4A373] transition-colors">
                    {rit.title}
                  </h4>
                  <p className="text-xs text-[#718096] leading-relaxed">
                    {rit.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Wedding Packages Showcase */}
        <div>
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2D3748]">Curated Wedding Packages</h3>
            <p className="text-xs text-[#718096] mt-1">From intimate temple vows to grand multi-day Himalayan celebrations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WEDDING_PACKAGES.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4A373]/25 hover:border-[#D4A373] transition-all flex flex-col justify-between group shadow-lg hover:shadow-2xl"
              >
                <div>
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#0891B2]">
                    {pkg.tier}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-[#2D3748] mt-1 group-hover:text-[#D4A373] transition-colors">
                    {pkg.title}
                  </h4>
                  <p className="text-xs text-[#718096] mt-2 font-normal">
                    {pkg.idealFor}
                  </p>

                  <div className="flex items-center gap-3 py-3 my-3 border-y border-[#D4A373]/20 text-xs text-[#718096]">
                    <span><strong>Guests:</strong> {pkg.guests}</span>
                    <span>•</span>
                    <span><strong>Duration:</strong> {pkg.duration}</span>
                  </div>

                  <div className="space-y-2 mt-4">
                    {pkg.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#4A5568]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#166534] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#D4A373]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#718096] uppercase tracking-widest font-medium">Inquiries & Booking</span>
                    <div className="text-sm font-serif font-bold text-[#2D3748]">
                      Customized Proposal
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOpenWeddingModal({ packageId: pkg.id, title: pkg.title })}
                    className="px-4 py-2 rounded-xl bg-[#D4A373] hover:bg-[#B88555] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                  >
                    Inquire
                  </motion.button>
                </div>

              </motion.div>
            ))}
          </div>

          {/* Direct Consultation Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="mt-12 bg-white p-6 sm:p-8 rounded-3xl border border-[#D4A373]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl"
          >
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-xl text-[#2D3748]">Plan Your Sacred Vows With Our Wedding Director</h4>
              <p className="text-xs text-[#718096] font-normal">
                We coordinate auspicious temple dates, Vedic priests for Akhand Dhuni rituals, custom Garhwali banquets, and complete resort lodging.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/${RESORT_INFO.whatsapp}?text=Namaste!%20We%20are%20planning%20a%20destination%20wedding%20at%20Triyuginarayan%20Temple.%20Please%20share%20details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenWeddingModal()}
                className="px-5 py-2.5 rounded-xl bg-[#D4A373] hover:bg-[#B88555] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Proposal</span>
              </motion.button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
