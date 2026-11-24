import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  FileText, 
  CreditCard,
  Building2
} from 'lucide-react';
import { RESORT_INFO } from '../data/resortData';
import { TRANSLATIONS } from '../data/translations';

// Indian currency words converter
function numberToWords(num) {
  if (!num || isNaN(num)) return 'Zero Rupees Only';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  };

  return inWords(Math.round(num)) + ' Rupees Only';
}

export default function GstInvoiceModal({ isOpen, onClose, booking, lang = 'hi' }) {
  const invoiceRef = useRef(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  if (!isOpen || !booking) return null;

  const baseRate = Number(booking.base_rate) || 4000;
  const nights = Number(booking.nights) || 1;
  const roomTariff = baseRate * nights;
  const extraCharges = Number(booking.extra_charges) || 0;
  const discount = Number(booking.discount) || 0;
  const taxableAmount = Math.max(0, roomTariff + extraCharges - discount);
  
  const gstRate = Number(booking.gst_rate) || 12;
  const cgstRate = gstRate / 2;
  const sgstRate = gstRate / 2;
  const cgstAmount = Math.round((taxableAmount * cgstRate) / 100);
  const sgstAmount = Math.round((taxableAmount * sgstRate) / 100);
  const totalGst = cgstAmount + sgstAmount;
  
  const grossTotal = Number(booking.total_amount) || (taxableAmount + totalGst);
  const advancePaid = Number(booking.advance_amount) || 0;
  const balanceDue = Number(booking.balance_amount ?? Math.max(0, grossTotal - advancePaid));

  const invoiceNumber = booking.invoice_number || `KR-INV-2026-${booking.id?.slice(0, 5) || '101'}`;
  const invoiceDate = booking.created_at ? new Date(booking.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN');

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `*KANTI RESORT PHATA - GST TAX INVOICE*\n` +
      `Invoice No: ${invoiceNumber}\n` +
      `Guest: ${booking.guest_name}\n` +
      `Room: ${booking.room_name || booking.room_id}\n` +
      `Dates: ${booking.check_in} to ${booking.check_out} (${nights} Nights)\n` +
      `Total Bill: ₹${grossTotal.toLocaleString('en-IN')}\n` +
      `Advance Paid: ₹${advancePaid.toLocaleString('en-IN')}\n` +
      `Balance Due: ₹${balanceDue.toLocaleString('en-IN')}\n` +
      `Status: ${balanceDue <= 0 ? 'PAID IN FULL' : 'BALANCE DUE'}\n` +
      `Resort Contact: +91 97204 00800`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white animate-fadeIn select-none">
      
      {/* Container Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-stone-200 overflow-hidden my-auto print:border-none print:shadow-none print:rounded-none">
        
        {/* Top Control Bar (Hidden when Printing) */}
        <div className="bg-gradient-to-r from-[#1E252B] to-[#2E3842] text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#D4A373]" />
            <div>
              <span className="font-serif font-black text-sm tracking-wide text-[#F3E5AB]">
                {t.invoicePreview}
              </span>
              <span className="text-xs text-stone-300 ml-2 font-mono">
                {invoiceNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.btnShare}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-[#D4A373] hover:bg-[#c49363] text-stone-950 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-lg transition-all active:scale-95"
            >
              <Printer className="w-4 h-4 text-stone-950" />
              <span>{t.btnPrintPdf}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div 
          ref={invoiceRef}
          className="p-6 sm:p-10 font-sans text-stone-900 space-y-6 print:p-6 bg-white"
          id="gst-printable-area"
        >
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-stone-900">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-wider text-2xl sm:text-3xl font-black text-stone-950">
                  KANTI RESORT
                </span>
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 bg-[#0891B2]/10 text-[#0891B2] rounded">
                  Phata, Kedarnath
                </span>
              </div>
              <p className="text-xs text-stone-600 font-bold">
                Sanctuary of the Sacred Kedar Valley
              </p>
              <p className="text-xs text-stone-600">
                Maikhanda, Phata, Kedarnath Highway, Rudraprayag, Uttarakhand — 246471
              </p>
              <div className="text-xs text-stone-600 pt-0.5 space-x-3">
                <span><strong>Phone:</strong> {RESORT_INFO.phonePrimary}</span>
                <span><strong>Email:</strong> {RESORT_INFO.email}</span>
              </div>
              <div className="text-xs font-mono font-black text-stone-900 pt-0.5">
                GSTIN: <span className="text-[#0891B2]">05AAACK9872Q1Z4</span> • State Code: 05 (Uttarakhand)
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none w-full sm:w-auto border sm:border-none border-stone-200">
              <div className="inline-block px-3.5 py-1.5 bg-stone-950 text-[#F3E5AB] font-serif text-xs font-black uppercase tracking-widest rounded-lg">
                {t.taxInvoiceBadge}
              </div>
              <p className="text-[11px] text-stone-500 italic font-medium">{t.originalRecipient}</p>
              
              <div className="pt-2 text-xs space-y-0.5 font-medium">
                <p><strong>{t.invoiceNo}</strong> <span className="font-mono font-black text-stone-950">{invoiceNumber}</span></p>
                <p><strong>{t.invoiceDate}</strong> {invoiceDate}</p>
                <p><strong>{t.bookingRef}</strong> <span className="font-mono">{booking.reference_id}</span></p>
                <p><strong>{t.placeOfSupply}</strong> Uttarakhand (05)</p>
              </div>
            </div>

          </div>

          {/* Guest & Stay Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 text-xs">
            
            <div className="space-y-1.5">
              <h4 className="font-serif font-black text-stone-900 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
                {t.billedTo}
              </h4>
              <p className="text-sm font-black text-stone-950">{booking.guest_name}</p>
              <p><strong>Mobile:</strong> {booking.phone}</p>
              {booking.email && <p><strong>Email:</strong> {booking.email}</p>}
              {booking.guest_address && <p><strong>Address:</strong> {booking.guest_address}</p>}
              <p>
                <strong>ID Proof:</strong> {booking.id_proof_type || 'Aadhaar Card'}: {booking.id_proof_number || 'Verified'}
              </p>
              {booking.guest_gstin && (
                <p className="font-mono font-black text-[#0891B2]">
                  <strong>Guest GSTIN:</strong> {booking.guest_gstin}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif font-black text-stone-900 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
                {t.stayDetails}
              </h4>
              <p><strong>{t.assignedRoom}</strong> <span className="font-black text-stone-950">{booking.room_name || `Room ${booking.room_id}`}</span></p>
              <p><strong>{t.category}</strong> {booking.room_type || 'Double Bed Room'}</p>
              <p><strong>{t.checkInTime}</strong> {booking.check_in} (12:00 PM)</p>
              <p><strong>{t.checkOutTime}</strong> {booking.check_out} (10:00 AM)</p>
              <p><strong>{t.duration}</strong> {nights} {lang === 'hi' ? 'रात (Nights)' : 'Night(s)'}</p>
              <p><strong>{t.occupants}</strong> {booking.guests || 2} ({booking.adults || 2} Adults, {booking.children || 0} Kids)</p>
            </div>

          </div>

          {/* GST Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-2 border-stone-200">
              <thead className="bg-stone-950 text-white uppercase text-[10px] tracking-wider font-black">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">{t.sacCodeCol}</th>
                  <th className="py-2.5 px-3 text-right">{t.rateNightCol}</th>
                  <th className="py-2.5 px-3 text-center">{t.nightsCol}</th>
                  <th className="py-2.5 px-3 text-right">{t.taxableCol}</th>
                  <th className="py-2.5 px-3 text-center">CGST ({cgstRate}%)</th>
                  <th className="py-2.5 px-3 text-center">SGST ({sgstRate}%)</th>
                  <th className="py-2.5 px-3 text-right">{t.totalCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y border-t border-stone-200 text-stone-800">
                
                <tr className="hover:bg-stone-50/50">
                  <td className="py-3 px-3 text-center font-black">1</td>
                  <td className="py-3 px-3">
                    <div className="font-black text-stone-950">{booking.room_name || `Room ${booking.room_id}`} Accommodation</div>
                    <div className="text-[10px] text-stone-500 font-mono">SAC: 996311 (Hotel & Guest House Services)</div>
                  </td>
                  <td className="py-3 px-3 text-right font-medium">₹{baseRate.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-center font-black">{nights}</td>
                  <td className="py-3 px-3 text-right font-bold">₹{roomTariff.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-center">₹{Math.round((roomTariff * cgstRate) / 100).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-center">₹{Math.round((roomTariff * sgstRate) / 100).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right font-black text-stone-950">
                    ₹{Math.round(roomTariff * (1 + gstRate / 100)).toLocaleString('en-IN')}
                  </td>
                </tr>

                {extraCharges > 0 && (
                  <tr className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 text-center font-black">2</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-stone-950">Additional Services / Extra Bed & Meals</div>
                      <div className="text-[10px] text-stone-500 font-mono">SAC: 996331</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">₹{extraCharges.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-center font-black">1</td>
                    <td className="py-2.5 px-3 text-right font-bold">₹{extraCharges.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-center">₹{Math.round((extraCharges * cgstRate) / 100).toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-center">₹{Math.round((extraCharges * sgstRate) / 100).toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-black text-stone-950">
                      ₹{Math.round(extraCharges * (1 + gstRate / 100)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {discount > 0 && (
                  <tr className="text-emerald-800 bg-emerald-50">
                    <td className="py-2 px-3 text-center font-bold">—</td>
                    <td className="py-2 px-3 italic font-bold" colSpan={3}>Less: Special Pilgrim / Yatra Discount</td>
                    <td className="py-2 px-3 text-right font-black">-₹{discount.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-center" colSpan={2}>-</td>
                    <td className="py-2 px-3 text-right font-black">-₹{discount.toLocaleString('en-IN')}</td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>

          {/* Totals & Payments */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            
            <div className="md:col-span-7 space-y-4 text-xs">
              
              <div className="p-3.5 bg-stone-50 rounded-2xl border-2 border-stone-200">
                <span className="text-[10px] uppercase font-black text-stone-500 block mb-0.5">{t.amountInWords}</span>
                <span className="font-serif font-black text-stone-900 italic text-sm">
                  {numberToWords(grossTotal)}
                </span>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border-2 border-stone-200 space-y-1 text-[11px] text-stone-700">
                <p className="font-black text-stone-900 uppercase tracking-wider text-[10px]">
                  {t.bankDetails}
                </p>
                <p><strong>{t.accountName}</strong> Kanti Resort Phata</p>
                <p><strong>{t.bankName}</strong> State Bank of India (SBI Guptkashi Branch)</p>
                <p><strong>{t.accountNumber}</strong> 38947291048 • <strong>{t.ifscCode}</strong> SBIN0007890</p>
                <p><strong>{t.upiVpa}</strong> <span className="font-mono font-black text-[#0891B2]">kantiresort@sbi</span></p>
              </div>

              {booking.notes && (
                <div className="text-[11px] text-stone-600 font-medium">
                  <strong>Notes:</strong> {booking.notes}
                </div>
              )}
            </div>

            <div className="md:col-span-5 bg-stone-50 p-4 rounded-2xl border-2 border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-200 font-medium">
                <span className="text-stone-600">Total Taxable Value:</span>
                <span className="font-bold text-stone-900">₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-1 text-stone-600 font-medium">
                <span>Central GST (CGST {cgstRate}%):</span>
                <span>₹{cgstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-1 text-stone-600 font-medium border-b border-stone-200">
                <span>State GST (SGST {sgstRate}%):</span>
                <span>₹{sgstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-1.5 text-sm font-black text-stone-950 border-b-2 border-stone-900 pt-2">
                <span>{t.grandTotal}</span>
                <span className="text-base text-stone-950 font-black">₹{grossTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-1 text-emerald-800 font-bold">
                <span>Advance Paid ({booking.payment_mode?.toUpperCase() || 'UPI'}):</span>
                <span>₹{advancePaid.toLocaleString('en-IN')}</span>
              </div>

              <div className={`p-3.5 rounded-xl border-2 mt-2 flex items-center justify-between ${
                balanceDue <= 0
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                  : 'bg-rose-50 border-rose-500 text-rose-950'
              }`}>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block">
                    {balanceDue <= 0 ? t.statusPaidFull : t.statusBalanceDue}
                  </span>
                  <span className="text-xs font-medium">
                    {balanceDue <= 0 ? 'Settled' : 'Payable upon Check-out'}
                  </span>
                </div>
                <div className="text-xl font-black font-mono">
                  ₹{balanceDue.toLocaleString('en-IN')}
                </div>
              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="pt-8 border-t-2 border-stone-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-[10px] text-stone-600">
            <div className="space-y-1 max-w-md">
              <p className="font-black text-stone-800 uppercase">{t.termsConditions}</p>
              <p>1. Check-out time is strictly 10:00 AM. Early departure at 5:00 AM available for morning helicopter flights from Phata.</p>
              <p>2. Valid Govt photo ID mandatory for all pilgrims as per Uttarakhand Police regulations.</p>
              <p>3. Rudraprayag, Uttarakhand jurisdiction only.</p>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="h-12 flex items-end justify-center sm:justify-end">
                <span className="font-serif italic text-stone-500 text-sm border-b border-dashed border-stone-400 pb-0.5 px-6">
                  {t.authSignatory}
                </span>
              </div>
              <p className="font-black text-stone-900">For KANTI RESORT, PHATA</p>
              <p className="text-[9px]">Computer Generated GST Invoice</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
