import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Phone, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  FileText,
  Clock
} from 'lucide-react';
import { checkRoomDateOverlap, createResortBooking } from '../lib/supabaseClient';
import { sanitizeInput } from '../lib/staffAuthService';
import { TRANSLATIONS } from '../data/translations';

export default function NewBookingModal({ 
  isOpen, 
  onClose, 
  rooms = [], 
  initialData = {}, 
  lang = 'hi',
  onBookingCreated 
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  // Form State
  const [bookingType, setBookingType] = useState('walk_in');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [idProofType, setIdProofType] = useState('Aadhaar Card');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [guestGstin, setGuestGstin] = useState('');

  const [roomId, setRoomId] = useState(rooms[0]?.id || '101');
  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Financials
  const [baseRate, setBaseRate] = useState(4000);
  const [extraCharges, setExtraCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [gstRate, setGstRate] = useState(12);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('upi');
  const [notes, setNotes] = useState('');

  // Overlap and validation state
  const [overlapChecking, setOverlapChecking] = useState(false);
  const [overlapConflict, setOverlapConflict] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData.room_id) setRoomId(initialData.room_id);
      if (initialData.check_in) setCheckIn(initialData.check_in);
      if (initialData.check_out) setCheckOut(initialData.check_out);
      if (initialData.base_rate) setBaseRate(Number(initialData.base_rate));
      if (initialData.booking_type) setBookingType(initialData.booking_type);
      setErrorMsg('');
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const selected = rooms.find(r => r.id === roomId);
    if (selected) {
      setBaseRate(Number(selected.base_price) || 4000);
    }
  }, [roomId, rooms]);

  const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) || 1);
  const roomTariff = baseRate * nights;
  const taxableAmount = Math.max(0, roomTariff + Number(extraCharges || 0) - Number(discount || 0));
  const gstAmount = Math.round((taxableAmount * gstRate) / 100);
  const totalAmount = taxableAmount + gstAmount;
  const balanceDue = Math.max(0, totalAmount - Number(advanceAmount || 0));

  // Overlap checker
  useEffect(() => {
    let isCancelled = false;

    async function verifyOverlap() {
      if (!roomId || !checkIn || !checkOut) return;
      if (checkIn >= checkOut) {
        setOverlapConflict({ 
          message: lang === 'hi' 
            ? 'चेक-आउट तारीख चेक-इन से बाद की होनी चाहिए।' 
            : 'Check-out date must be after check-in date.' 
        });
        return;
      }

      setOverlapChecking(true);
      const res = await checkRoomDateOverlap(roomId, checkIn, checkOut);
      if (!isCancelled) {
        setOverlapChecking(false);
        if (res.hasOverlap && res.overlappingBookings.length > 0) {
          const overlap = res.overlappingBookings[0];
          setOverlapConflict({
            guestName: overlap.guest_name,
            checkIn: overlap.check_in,
            checkOut: overlap.check_out,
            message: lang === 'hi'
              ? `ओवरलैप चेतावनी! कमरा ${roomId} पहले से "${overlap.guest_name}" के लिए ${overlap.check_in} से ${overlap.check_out} तक बुक है।`
              : `Overlap Conflict: Room ${roomId} is already booked for "${overlap.guest_name}" from ${overlap.check_in} to ${overlap.check_out}.`
          });
        } else {
          setOverlapConflict(null);
        }
      }
    }

    verifyOverlap();
    return () => { isCancelled = true; };
  }, [roomId, checkIn, checkOut, lang]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (checkIn >= checkOut) {
      setErrorMsg(lang === 'hi' ? 'चेक-आउट तारीख चेक-इन के बाद की होनी चाहिए।' : 'Check-out date must be after check-in date.');
      return;
    }

    if (overlapConflict) {
      setErrorMsg(t.overlapConflictMsg);
      return;
    }

    setSubmitting(true);

    const selectedRoom = rooms.find(r => r.id === roomId);

    // Sanitize guest inputs against XSS attacks
    const payload = {
      booking_type: bookingType,
      guest_name: sanitizeInput(guestName.trim()),
      phone: sanitizeInput(phone.trim()),
      email: email.trim() ? sanitizeInput(email.trim()) : null,
      guest_address: guestAddress.trim() ? sanitizeInput(guestAddress.trim()) : null,
      id_proof_type: idProofType,
      id_proof_number: idProofNumber.trim() ? sanitizeInput(idProofNumber.trim()) : null,
      guest_gstin: guestGstin.trim() ? sanitizeInput(guestGstin.trim().toUpperCase()) : null,
      room_id: roomId,
      room_type: selectedRoom?.category || 'Double Bed Room',
      room_name: selectedRoom?.name || `Room ${roomId}`,
      check_in: checkIn,
      check_out: checkOut,
      nights,
      guests: Number(adults) + Number(children),
      adults: Number(adults),
      children: Number(children),
      base_rate: baseRate,
      extra_charges: Number(extraCharges || 0),
      discount: Number(discount || 0),
      gst_rate: gstRate,
      advance_amount: Number(advanceAmount || 0),
      payment_mode: paymentMode,
      notes: notes.trim() ? sanitizeInput(notes.trim()) : null
    };

    const res = await createResortBooking(payload);

    setSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || (lang === 'hi' ? 'बुकिंग दर्ज करने में त्रुटि।' : 'Failed to create reservation.'));
    } else {
      onBookingCreated(res.booking);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      <div className="relative w-full max-w-3xl bg-[#FFFDF7] rounded-3xl shadow-2xl border-2 border-[#D4A373]/40 overflow-hidden my-auto">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#1E252B] via-[#2A343D] to-[#1E252B] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#D4A373]/20 border border-[#D4A373]/40 flex items-center justify-center text-[#D4A373]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#F3E5AB]">
                {t.modalTitle}
              </h3>
              <p className="text-xs text-stone-300">
                {t.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs text-stone-800">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-800 font-bold flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Booking Channel Selector */}
          <div className="flex items-center gap-4 p-3 bg-stone-100 rounded-2xl border border-stone-200">
            <span className="font-black text-stone-800">{lang === 'hi' ? 'बुकिंग माध्यम:' : 'Channel:'}</span>
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input
                type="radio"
                name="bookingType"
                value="walk_in"
                checked={bookingType === 'walk_in'}
                onChange={() => setBookingType('walk_in')}
                className="w-4 h-4 text-[#0891B2] focus:ring-[#0891B2]"
              />
              <span>{t.channelWalkIn}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input
                type="radio"
                name="bookingType"
                value="phone"
                checked={bookingType === 'phone'}
                onChange={() => setBookingType('phone')}
                className="w-4 h-4 text-[#0891B2] focus:ring-[#0891B2]"
              />
              <span>{t.channelPhone}</span>
            </label>
          </div>

          {/* Section 1: Guest Personal & Identification Details */}
          <div className="space-y-3">
            <h4 className="font-serif font-black text-stone-900 text-sm border-b-2 border-stone-200 pb-1 flex items-center gap-2">
              <User className="w-4 h-4 text-[#0891B2]" />
              {t.secGuestInfo}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.guestNameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.guestPhoneLabel}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.guestEmailLabel}
                </label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.idTypeLabel}
                </label>
                <select
                  value={idProofType}
                  onChange={(e) => setIdProofType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-stone-200 rounded-xl font-bold focus:outline-none"
                >
                  <option value="Aadhaar Card">Aadhaar Card (आधार कार्ड)</option>
                  <option value="Passport">Passport (पासपोर्ट)</option>
                  <option value="Voter ID">Voter ID (मतदाता पहचान पत्र)</option>
                  <option value="Driving License">Driving License (ड्राइविंग लाइसेंस)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.idNumberLabel}
                </label>
                <input
                  type="text"
                  placeholder="4589 1234 9876"
                  value={idProofNumber}
                  onChange={(e) => setIdProofNumber(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-stone-200 rounded-xl font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.guestGstinLabel}
                </label>
                <input
                  type="text"
                  placeholder="05AAAAA0000A1Z5"
                  value={guestGstin}
                  onChange={(e) => setGuestGstin(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-stone-200 rounded-xl uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                {t.guestAddressLabel}
              </label>
              <input
                type="text"
                placeholder="e.g. New Delhi / Haridwar / Ahmedabad"
                value={guestAddress}
                onChange={(e) => setGuestAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-stone-200 rounded-xl"
              />
            </div>
          </div>

          {/* Section 2: Room Selection & Overlap Prevention */}
          <div className="space-y-3">
            <h4 className="font-serif font-black text-stone-900 text-sm border-b-2 border-stone-200 pb-1 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0891B2]" />
                {t.secRoomStay}
              </span>
              <span className="text-xs text-stone-600 font-bold">
                {nights} {lang === 'hi' ? 'रात का ठहराव' : 'Nights Stay'}
              </span>
            </h4>

            {/* Overlap Status Banner */}
            {overlapChecking ? (
              <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-2xl text-blue-700 font-bold flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>{lang === 'hi' ? 'कमरे की उपलब्धता जांची जा रही है...' : 'Checking availability...'}</span>
              </div>
            ) : overlapConflict ? (
              <div className="p-3.5 bg-rose-50 border-2 border-rose-400 rounded-2xl text-rose-900 font-bold flex items-start gap-2 shadow-sm">
                <AlertTriangle className="w-5 h-5 mt-0.5 text-rose-600 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm">{overlapConflict.message}</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    {lang === 'hi' ? 'कृपया तारीख बदलें अथवा दूसरा उपलब्ध कमरा चुनें।' : 'Please choose another room or non-conflicting dates.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t.overlapClear}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.roomSelectLabel}
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-stone-200 rounded-xl font-black text-stone-900 focus:outline-none"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      {t.room} {r.room_number} — {r.name} ({r.category}) • ₹{Number(r.base_price).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.checkInLabel}
                </label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-stone-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.checkOutLabel}
                </label>
                <input
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-stone-200 rounded-xl font-bold"
                />
              </div>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.adultsLabel}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-stone-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.childrenLabel}
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-stone-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.roomRateLabel}
                </label>
                <input
                  type="number"
                  value={baseRate}
                  onChange={(e) => setBaseRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border-2 border-stone-200 rounded-xl font-black text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.gstSlabLabel}
                </label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border-2 border-stone-200 rounded-xl font-bold"
                >
                  <option value="12">12% (Standard Hotel GST)</option>
                  <option value="18">18% (Luxury Suite)</option>
                  <option value="5">5% (Exempt / Low)</option>
                  <option value="0">0% (Nil)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Section 3: Billing & Advance */}
          <div className="bg-stone-50 p-4 rounded-2xl border-2 border-stone-200 space-y-3">
            <h4 className="font-serif font-black text-stone-900 text-sm flex items-center justify-between pb-1 border-b-2 border-stone-200">
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0891B2]" />
                {t.secBilling}
              </span>
              <span className="text-xs font-mono font-bold text-stone-600">
                SAC: 996311
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.extraChargesLabel}
                </label>
                <input
                  type="number"
                  min="0"
                  value={extraCharges}
                  onChange={(e) => setExtraCharges(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white border-2 border-stone-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.discountLabel}
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white border-2 border-stone-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-emerald-900 uppercase mb-1">
                  {t.advanceAmountLabel}
                </label>
                <input
                  type="number"
                  min="0"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white border-2 border-emerald-400 rounded-xl font-black text-emerald-900 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.paymentModeLabel}
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-stone-200 rounded-xl font-bold"
                >
                  <option value="upi">{t.paymentUpi}</option>
                  <option value="cash">{t.paymentCash}</option>
                  <option value="card">{t.paymentCard}</option>
                  <option value="bank_transfer">{t.paymentBank}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  {t.specialNotesLabel}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  className="w-full px-3 py-2 bg-white border-2 border-stone-200 rounded-xl"
                />
              </div>
            </div>

            {/* Computed Ledger Strip */}
            <div className="mt-2 p-3 bg-white rounded-2xl border-2 border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase block">{t.taxableTariff}</span>
                <span className="text-xs font-black text-stone-900">₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase block">GST ({gstRate}%)</span>
                <span className="text-xs font-black text-stone-900">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-stone-50 py-1 rounded-xl">
                <span className="text-[10px] text-stone-700 font-black uppercase block">{t.grossTotal}</span>
                <span className="text-base font-black text-stone-950">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className={`py-1 rounded-xl border-2 ${balanceDue <= 0 ? 'bg-emerald-50 border-emerald-400' : 'bg-rose-50 border-rose-400'}`}>
                <span className="text-[10px] font-black uppercase block text-stone-700">{t.balanceDueCalculated}</span>
                <span className={`text-base font-black ${balanceDue <= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  ₹{balanceDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </div>

          {/* Footer Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t-2 border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border-2 border-stone-200 text-stone-700 hover:bg-stone-50 font-bold text-xs"
            >
              {t.btnCancel}
            </button>

            <button
              type="submit"
              disabled={submitting || Boolean(overlapConflict) || overlapChecking}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#D4A373] to-[#B88758] hover:from-[#c49363] hover:to-[#A77647] text-stone-950 font-black text-xs sm:text-sm shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-stone-950" />
                  <span>{t.btnConfirmBooking}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
