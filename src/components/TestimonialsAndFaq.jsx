import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { FAQS, RESORT_INFO } from '../data/resortData';

export default function TestimonialsAndFaq() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faqs" className="py-20 sm:py-28 bg-[#FFFDF7] relative overflow-hidden">
      
      {/* Decorative ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4A373]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* FAQ Block */}
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-14 space-y-3"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#0891B2] font-bold">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2D3748] font-normal">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-[#718096] font-normal">
              Everything you need to know about helipad proximity, Triyuginarayan temple yatra, room heating, and food.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-white border border-[#D4A373]/25 rounded-2xl overflow-hidden transition-colors hover:border-[#D4A373] shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FFFDF7] transition-colors"
                >
                  <span className="text-sm sm:text-base font-medium text-[#2D3748]">
                    {faq.q}
                  </span>
                  <div className="p-1.5 rounded-full bg-[#F4EFEA] text-[#0891B2] shrink-0 border border-[#D4A373]/20">
                    {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#4A5568] font-normal leading-relaxed border-t border-[#D4A373]/20 bg-[#FFFDF7]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Quick Helpline Callout */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-white border border-[#D4A373]/30 px-6 py-4 rounded-2xl shadow-lg">
              <span className="text-xs text-[#4A5568] font-medium">
                Have a specific question regarding Kedarnath yatra dates or room availability?
              </span>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/${RESORT_INFO.whatsapp}?text=Hello%20Kanti%20Resort,%20I%20have%20a%20question%20about...`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0 shadow-md"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Chat with Manager
              </motion.a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
