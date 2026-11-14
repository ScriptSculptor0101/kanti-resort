import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plane, Compass, MapPin, CheckCircle2, UtensilsCrossed, 
  ShieldCheck, Flame, HeartPulse 
} from 'lucide-react';
import { HELIPADS, PILGRIM_SERVICES } from '../data/resortData';

export default function HelipadHub() {
  const [activeStep, setActiveStep] = useState(0);

  const yatraSteps = [
    {
      title: "1. Mandatory Registration",
      desc: "All pilgrims must register on the Uttarakhand Tourism portal (registrationandtouristcare.uk.gov.in) to receive their Yatra QR pass before boarding.",
    },
    {
      title: "2. Helipad Reporting Time",
      desc: "Reach your allotted Phata helipad 45 minutes prior to your flight slot. All Phata helipads are located conveniently within 2 to 5 minutes walking or driving distance from Kanti Resort.",
    },
    {
      title: "3. Baggage Restrictions (Strict 5 KG)",
      desc: "Helicopter operators strictly limit baggage to 5 kg per passenger. Leave your main heavy luggage safely in Kanti Resort's locked cloakroom for free.",
    },
    {
      title: "4. Acclimatization & Warmth",
      desc: "Kedarnath Temple is at 3,584m (11,758 ft). Dress in heavy thermal layers. Kanti Resort provides warm herbal kadha and oxygen canisters on request.",
    }
  ];

  return (
    <section id="helipads" className="py-20 sm:py-28 bg-[#FFFDF7] relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#D4A373]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[#0891B2] font-bold">
            Phata Helipads Location Guide
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2D3748] font-normal">
            Nearby Helipads in Phata
          </h2>
          <p className="text-sm sm:text-base text-[#718096] font-normal leading-relaxed">
            Phata is the central base for helicopter flights to Kedarnath Dham. Kanti Resort is located right along the main highway, situated within short walking and driving distance from all authorized helipads.
          </p>
        </motion.div>

        {/* Helipads Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {HELIPADS.map((heli, idx) => (
            <motion.div
              key={heli.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-2xl border border-[#D4A373]/25 hover:border-[#D4A373] transition-all flex flex-col justify-between group shadow-md hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-[#F4EFEA] text-[#0891B2] group-hover:bg-[#D4A373] group-hover:text-white transition-colors">
                    <Plane className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#0891B2] bg-[#0891B2]/10 px-2.5 py-1 rounded-full border border-[#0891B2]/20">
                    {heli.distance}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-[#2D3748] mb-1.5 group-hover:text-[#D4A373] transition-colors">
                  {heli.name}
                </h4>
                <p className="text-xs text-[#718096] leading-relaxed font-normal mb-4">
                  {heli.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#D4A373]/20 flex items-center justify-between text-xs text-[#718096]">
                <span className="flex items-center gap-1.5 text-[#2D3748] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#0891B2]" />
                  <span>Phata Highway</span>
                </span>
                <span className="text-[#D4A373] font-semibold">
                  {heli.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Kedarnath Yatra Guidance Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-[#D4A373]/30 rounded-2xl p-6 sm:p-8 mb-16 shadow-lg"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0891B2] animate-ping" />
              <h4 className="text-sm sm:text-base font-semibold text-[#2D3748] uppercase tracking-wider">
                Kedarnath Dham Yatra Guidelines
              </h4>
            </div>
            <span className="text-xs text-[#166534] bg-[#166534]/10 px-3 py-1 rounded-full border border-[#166534]/30 font-semibold">
              Essential Yatra Information
            </span>
          </div>

          {/* Steps Tab Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {yatraSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeStep === idx 
                    ? 'bg-[#D4A373] text-white shadow' 
                    : 'bg-[#F4EFEA] text-[#718096] hover:bg-[#EAE4DC]'
                }`}
              >
                Step {idx + 1}
              </button>
            ))}
          </div>

          <div className="bg-[#FFFDF7] p-4 rounded-xl border border-[#D4A373]/25">
            <h5 className="text-sm font-semibold text-[#0891B2] mb-1">
              {yatraSteps[activeStep].title}
            </h5>
            <p className="text-xs text-[#4A5568] leading-relaxed">
              {yatraSteps[activeStep].desc}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
