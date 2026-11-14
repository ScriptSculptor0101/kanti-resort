import React, { useState } from 'react';
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

export default function App() {
  const [isFramedMode, setIsFramedMode] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingInitialData, setBookingInitialData] = useState({});

  const handleOpenBooking = (data = {}) => {
    setBookingInitialData(data);
    setBookingModalOpen(true);
  };

  const toggleFramedMode = () => {
    setIsFramedMode(!isFramedMode);
  };

  return (
    <div className={`min-h-screen bg-[#FFFDF7] text-[#2D3748] transition-all duration-300 ${
      isFramedMode ? 'p-2 sm:p-5 md:p-8 bg-[#F4EFEA]' : ''
    }`}>
      
      {/* Outer Framed Wrapper - NomadKit Minimal Warm Card Frame */}
      <div className={`transition-all duration-300 ${
        isFramedMode 
          ? 'max-w-[1440px] mx-auto rounded-[24px] sm:rounded-[36px] overflow-hidden border border-[#D4A373]/30 shadow-[0_20px_60px_rgba(212,163,115,0.15)] bg-[#FFFDF7] relative' 
          : 'w-full'
      }`}>
        
        {/* Navigation */}
        <Navbar
          onOpenBooking={() => handleOpenBooking()}
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
        />

      </div>

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialData={bookingInitialData}
      />

      {/* Floating CTA (WhatsApp & Phone) */}
      <FloatingActions
        onOpenBooking={() => handleOpenBooking()}
      />

    </div>
  );
}
