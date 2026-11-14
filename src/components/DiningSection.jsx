import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Heart, Coffee, ShieldCheck } from 'lucide-react';
import { MENU_ITEMS } from '../data/resortData';

export default function DiningSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="dining" className="py-20 sm:py-28 bg-[#F4EFEA] relative overflow-hidden">
      
      {/* Subtle Sand glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D4A373]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D4A373]/30 text-[#0891B2] text-xs font-serif tracking-widest uppercase shadow-sm font-semibold">
            <Utensils className="w-3.5 h-3.5 text-[#0891B2]" />
            <span>Pure Vegetarian & Sattvic Kitchen</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-[#2D3748] font-normal">
            Mandakini Rasoi
          </h2>
          
          <p className="text-sm sm:text-base text-[#718096] font-normal leading-relaxed">
            Nourishing body and spirit with pure Himalayan mountain recipes. From authentic Garhwali delicacies prepared in pure Desi Ghee to soothing Sattvic fasting meals for pilgrims.
          </p>

          {/* Menu Category Switcher */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {MENU_ITEMS.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors ${
                  activeTab === idx
                    ? 'text-white'
                    : 'text-[#718096] hover:text-[#2D3748] bg-white border border-[#D4A373]/30 shadow-sm'
                }`}
              >
                {activeTab === idx && (
                  <motion.div
                    layoutId="activeDiningTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#D4A373] rounded-full shadow-md -z-10"
                  />
                )}
                <span>{cat.category}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Highlight Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-[#D4A373]/25 rounded-3xl p-6 sm:p-10 mb-12 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#0891B2] font-bold">
                Category Spotlight
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2D3748]">
                {MENU_ITEMS[activeTab].category}
              </h3>
              <p className="text-sm text-[#718096] font-normal leading-relaxed">
                {MENU_ITEMS[activeTab].desc}
              </p>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                >
                  {MENU_ITEMS[activeTab].dishes.map((dish, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02 }}
                      className="bg-[#FFFDF7] p-4 rounded-xl border border-[#D4A373]/20 space-y-1 transition-colors hover:border-[#D4A373] shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#2D3748]">{dish.name}</h4>
                        <span className="text-[10px] text-[#0891B2] bg-[#0891B2]/10 px-2 py-0.5 rounded-full border border-[#0891B2]/20 font-medium">
                          {dish.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#718096] font-normal leading-relaxed">
                        {dish.desc}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-5 relative">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden border border-[#D4A373]/30 shadow-xl relative"
              >
                <img
                  src={
                    activeTab === 0
                      ? "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
                      : activeTab === 1
                      ? "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80"
                      : "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80"
                  }
                  alt="Authentic Himalayan dining"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white text-xs">
                    <span className="text-[#D4A373] uppercase tracking-wider block font-semibold">Kitchen Opens 5:00 AM</span>
                    <strong className="text-sm font-serif text-white">Early breakfast boxes for Kedarnath helicopter flights</strong>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>

        {/* 3 Value Pillars for Dining */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl border border-[#D4A373]/25 shadow-md"
          >
            <ShieldCheck className="w-6 h-6 text-[#166534] mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-[#2D3748]">Strict 100% Pure Veg</h4>
            <p className="text-xs text-[#718096] mt-1">Hygienic kitchen maintained according to sacred temple traditions.</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl border border-[#D4A373]/25 shadow-md"
          >
            <Heart className="w-6 h-6 text-[#D4A373] mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-[#2D3748]">Sattvic Vrat & Jain Options</h4>
            <p className="text-xs text-[#718096] mt-1">Rock salt, buckwheat poori, and no-onion no-garlic fasting meals.</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl border border-[#D4A373]/25 shadow-md"
          >
            <Coffee className="w-6 h-6 text-[#0891B2] mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-[#2D3748]">Mountain Herbs & Kadha</h4>
            <p className="text-xs text-[#718096] mt-1">Warm ginger-tulsi immunity teas to protect against mountain cold.</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
