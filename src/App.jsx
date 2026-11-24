import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingBar from './components/BookingBar';
import HelipadHub from './components/HelipadHub';
import RoomsSection from './components/RoomsSection';
import TravelAndLocation from './components/TravelAndLocation';
import TestimonialsAndFaq from './components/TestimonialsAndFaq';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import FloatingActions from './components/FloatingActions';
import ResortManagementSystem from './components/ResortManagementSystem';

export default function App() {
  const [isFramedMode, setIsFramedMode] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingInitialData, setBookingInitialData] = useState({});

  // Route state: if true, shows the Resort Room Management System App
  const [isRmsMode, setIsRmsMode] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    return hash === '#app' || hash === '#rms' || hash === '#staff' || hash === '#admin' || params.get('view') === 'app' || params.get('view') === 'rms';
  });

  // Listen to hash change in URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#app' || hash === '#rms' || hash === '#staff' || hash === '#admin') {
        setIsRmsMode(true);
      } else if (hash === '#website' || hash === '') {
        setIsRmsMode(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenBooking = (data = {}) => {
    setBookingInitialData(data);
    setBookingModalOpen(true);
  };

  const toggleFramedMode = () => {
    setIsFramedMode(!isFramedMode);
  };

  const openRmsPortal = () => {
    setIsRmsMode(true);
    window.location.hash = 'rms';
  };

  const exitRmsPortal = () => {
    setIsRmsMode(false);
    window.location.hash = '';
  };

  // If Staff Portal Mode is active, render full Resort Room Management System Dashboard
  if (isRmsMode) {
    return <ResortManagementSystem onExitToWebsite={exitRmsPortal} />;
  }

  // Otherwise render the public-facing guest website
  return (
    <div className={`min-h-screen bg-[#FFFDF7] text-[#2D3748] transition-all duration-300 ${
      isFramedMode ? 'p-2 sm:p-5 md:p-8 bg-[#F4EFEA]' : ''
    }`}>
      
      {/* Outer Framed Wrapper */}
      <div className={`transition-all duration-300 ${
        isFramedMode 
          ? 'max-w-[1440px] mx-auto rounded-[24px] sm:rounded-[36px] overflow-hidden border border-[#D4A373]/30 shadow-[0_20px_60px_rgba(212,163,115,0.15)] bg-[#FFFDF7] relative' 
          : 'w-full'
      }`}>
        
        {/* Navigation */}
        <Navbar
          onOpenBooking={() => handleOpenBooking()}
          onOpenRms={openRmsPortal}
          isFramedMode={isFramedMode}
          toggleFramedMode={toggleFramedMode}
        />

        {/* Hero Section */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Interactive Booking Bar */}
        <BookingBar
          onOpenBooking={(data) => handleOpenBooking(data)}
        />

        {/* Helipad Hub & Kedarnath Yatra Convenience */}
        <HelipadHub
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Rooms */}
        <RoomsSection
          onOpenBooking={(data) => handleOpenBooking(data)}
        />

        {/* Location, Highway Routes & Distances */}
        <TravelAndLocation />

        {/* Verified Reviews & FAQs */}
        <TestimonialsAndFaq />

        {/* Footer */}
        <Footer
          onOpenBooking={() => handleOpenBooking()}
          onOpenRms={openRmsPortal}
        />

      </div>

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialData={bookingInitialData}
      />

      {/* Floating CTA (WhatsApp & Phone) on bottom-right */}
      <FloatingActions
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Floating Staff App Launcher Button - Bottom Left (Always Visible on Mobile & Desktop) */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-50">
        <button
          onClick={openRmsPortal}
          title="Open Kanti Resort Staff App / कांति रिसॉर्ट स्टाफ ऐप खोलें"
          className="group px-4 py-3 bg-stone-950/95 hover:bg-stone-900 text-[#F3E5AB] border-2 border-[#D4A373] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.35)] text-xs sm:text-sm font-black flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all backdrop-blur-md cursor-pointer ring-4 ring-[#D4A373]/20"
        >
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span className="tracking-wide">📱 स्टाफ ऐप (Staff App)</span>
        </button>
      </div>

    </div>
  );
}
