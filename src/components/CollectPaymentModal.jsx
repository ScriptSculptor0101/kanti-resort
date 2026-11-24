import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { updateResortBooking } from '../lib/supabaseClient';
import { sanitizeInput } from '../lib/staffAuthService';
import { TRANSLATIONS } from '../data/translations';

export default function CollectPaymentModal({ 
  isOpen, 
  onClose, 
  booking, 
  lang = 'hi',
  onPaymentUpdated 
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  if (!isOpen || !booking) return null;

  const totalAmount = Number(booking.total_amount) || 0;
  const currentAdvance = Number(booking.advance_amount) || 0;
  const balanceDue = Number(booking.balance_amount ?? Math.max(0, totalAmount - currentAdvance));

  const [collectAmount, setCollectAmount] = useState(balanceDue);
  const [paymentMode, setPaymentMode] = useState('upi');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCollect = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const amountToAdd = Number(collectAmount) || 0;
      if (amountToAdd <= 0) {
        setErrorMsg(lang === 'hi' ? 'कृपया शून्य से अधिक वैध राशि दर्ज करें।' : 'Please enter a valid amount greater than zero.');
        setLoading(false);
        return;
      }

      const newAdvance = currentAdvance + amountToAdd;
      const newBalance = Math.max(0, totalAmount - newAdvance);
      const newStatus = newBalance <= 0 ? 'paid' : 'partial';

      const cleanNote = notes.trim() ? sanitizeInput(notes.trim()) : '';

      const res = await updateResortBooking(booking.id, {
        advance_amount: newAdvance,
        balance_amount: newBalance,
        payment_status: newStatus,
        payment_mode: paymentMode,
        notes: cleanNote 
          ? (booking.notes ? `${booking.notes} | ${cleanNote}` : cleanNote)
          : booking.notes
      });

      if (!res.success) {
        throw new Error(res.error || (lang === 'hi' ? 'पेमेंट अपडेट विफल।' : 'Failed to update payment.'));
      }

      onPaymentUpdated(res.booking);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || (lang === 'hi' ? 'पेमेंट अपडेट में त्रुटि।' : 'Payment update failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E252B] to-[#2E3842] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4A373]/20 border border-[#D4A373]/40 flex items-center justify-center text-[#D4A373]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base text-[#F3E5AB]">
                {t.collectTitle}
              </h3>
              <p className="text-[11px] text-stone-300">
                {t.collectSubtitle}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleCollect} className="p-5 space-y-4 text-xs text-stone-800">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-800 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Guest Summary Card */}
          <div className="p-4 bg-stone-50 rounded-2xl border-2 border-stone-200 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-black text-stone-950 text-sm sm:text-base">{booking.guest_name}</span>
              <span className="font-mono text-[11px] font-bold text-stone-500">{booking.reference_id}</span>
            </div>
            <p className="text-stone-600 font-bold text-xs">
              {t.room} {booking.room_name || booking.room_id} • {booking.check_in} to {booking.check_out} ({booking.nights}N)
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-stone-200 text-center">
              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase block">{t.totalBill}</span>
                <span className="font-black text-stone-900 text-sm">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-700 font-bold uppercase block">{t.paidSoFar}</span>
                <span className="font-black text-emerald-700 text-sm">₹{currentAdvance.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-rose-100 rounded-xl p-1 border border-rose-300">
                <span className="text-[10px] font-black text-rose-900 uppercase block">{t.balanceRemaining}</span>
                <span className="font-black text-rose-950 text-sm">₹{balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Payment input */}
          <div>
            <label className="block text-xs font-black text-stone-800 uppercase mb-1">
              {t.amountToCollect}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-black text-base text-stone-500">₹</span>
              <input
                type="number"
                min="1"
                max={balanceDue}
                required
                value={collectAmount}
                onChange={(e) => setCollectAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-stone-300 rounded-xl text-lg font-black text-stone-950 focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setCollectAmount(balanceDue)}
                className="text-xs px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold border border-stone-300"
              >
                {t.payFullBalance} (₹{balanceDue.toLocaleString('en-IN')})
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
              {t.paymentModeLabel}
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border-2 border-stone-300 rounded-xl font-bold focus:outline-none"
            >
              <option value="upi">{t.paymentUpi}</option>
              <option value="cash">{t.paymentCash}</option>
              <option value="card">{t.paymentCard}</option>
              <option value="bank_transfer">{t.paymentBank}</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
              {t.txRefLabel}
            </label>
            <input
              type="text"
              placeholder="e.g. UPI Ref / Cash Receipt #42"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-stone-300 rounded-xl font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border-2 border-stone-200 hover:bg-stone-50 font-bold"
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>{t.btnRecordPayment}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
