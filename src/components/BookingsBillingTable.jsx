import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  CreditCard, 
  PlusCircle, 
  CheckCircle2, 
  User, 
  Phone, 
  Trash2, 
  RefreshCw,
  Building2
} from 'lucide-react';
import { updateResortBooking, deleteResortBooking, updateResortRoomStatus } from '../lib/supabaseClient';
import { TRANSLATIONS } from '../data/translations';

export default function BookingsBillingTable({
  bookings = [],
  rooms = [],
  lang = 'hi',
  onOpenNewBooking,
  onViewInvoice,
  onOpenCollectPayment,
  onRefresh,
  loading = false,
  onBookingUpdated
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Financial aggregates
  const financialMetrics = useMemo(() => {
    let totalGross = 0;
    let totalAdvance = 0;
    let totalBalance = 0;
    let paidCount = 0;
    let pendingCount = 0;

    bookings.forEach(b => {
      if (b.status !== 'cancelled') {
        const gross = Number(b.total_amount) || 0;
        const adv = Number(b.advance_amount) || 0;
        const bal = Number(b.balance_amount ?? Math.max(0, gross - adv));
        totalGross += gross;
        totalAdvance += adv;
        totalBalance += bal;
        if (bal <= 0) paidCount++;
        else pendingCount++;
      }
    });

    return { totalGross, totalAdvance, totalBalance, paidCount, pendingCount };
  }, [bookings]);

  // Handle stay status change
  const handleStatusChange = async (booking, newStatus) => {
    setActionLoadingId(booking.id);
    try {
      const res = await updateResortBooking(booking.id, { status: newStatus });
      if (res.success) {
        if (newStatus === 'checked_in' && booking.room_id) {
          await updateResortRoomStatus(booking.room_id, 'booked');
        } else if (newStatus === 'checked_out' && booking.room_id) {
          await updateResortRoomStatus(booking.room_id, 'cleaning');
        }
        onBookingUpdated(res.booking);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm(lang === 'hi' ? 'क्या आप इस बुकिंग रिकॉर्ड को हटाना चाहते हैं?' : 'Are you sure you want to delete this booking?')) return;
    setActionLoadingId(bookingId);
    try {
      const res = await deleteResortBooking(bookingId);
      if (res.success) {
        onRefresh();
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = 
        (b.guest_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.phone || '').includes(searchQuery) ||
        (b.reference_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.invoice_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.room_id || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPayment = 
        paymentFilter === 'all' || 
        b.payment_status === paymentFilter ||
        (paymentFilter === 'partial' && Number(b.balance_amount) > 0 && Number(b.advance_amount) > 0);

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

      const matchesChannel = 
        channelFilter === 'all' || 
        b.booking_type === channelFilter ||
        (channelFilter === 'online' && (b.source?.includes('modal') || b.booking_type === 'online'));

      return matchesSearch && matchesPayment && matchesStatus && matchesChannel;
    });
  }, [bookings, searchQuery, paymentFilter, statusFilter, channelFilter]);

  return (
    <div className="space-y-5">
      
      {/* Financial Overview KPI Cards (in INR ₹) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Bookings Value */}
        <div className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-stone-500 uppercase tracking-wider">{t.grossValue}</p>
            <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              ₹{financialMetrics.totalGross.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-stone-500 font-bold mt-0.5">{bookings.length} {lang === 'hi' ? 'कुल आरक्षण' : 'Reservations'}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Advance Received */}
        <div className="bg-emerald-50 p-4 rounded-3xl border-2 border-emerald-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-emerald-900 uppercase tracking-wider">{t.advanceCollected}</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">
              ₹{financialMetrics.totalAdvance.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5">{lang === 'hi' ? 'कैश / UPI में प्राप्त' : 'Collected via Cash/UPI'}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Outstanding Balance Due */}
        <div className="bg-rose-50 p-4 rounded-3xl border-2 border-rose-300 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-rose-900 uppercase tracking-wider">{t.balanceOutstanding}</p>
            <p className="text-2xl sm:text-3xl font-black text-rose-900 mt-1">
              ₹{financialMetrics.totalBalance.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-rose-700 font-bold mt-0.5">{financialMetrics.pendingCount} {lang === 'hi' ? 'बुकिंग में बकाया बाकी' : 'Dues Pending'}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-200 text-rose-900 flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Big Action Button */}
        <div className="bg-gradient-to-br from-[#1E252B] to-[#2E3842] text-white p-4 rounded-3xl shadow-md flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-black text-[#F3E5AB] uppercase tracking-wider">{lang === 'hi' ? 'काउंटर एक्शन' : 'Front Desk'}</p>
            <h4 className="text-sm font-black text-white mt-0.5">{lang === 'hi' ? 'नया मेहमान दर्ज करें' : 'Quick Booking'}</h4>
          </div>
          <button
            onClick={() => onOpenNewBooking()}
            className="w-full mt-2 py-2.5 px-3 bg-[#D4A373] hover:bg-[#c49363] text-stone-950 rounded-2xl text-xs sm:text-sm font-black shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.actionNewBooking}</span>
          </button>
        </div>

      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={t.tableSearchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 border-2 border-stone-200 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="text-xs bg-stone-50 border-2 border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-800 focus:outline-none"
            >
              <option value="all">{t.allPayments} ({bookings.length})</option>
              <option value="paid">✅ {t.paidInFull} ({financialMetrics.paidCount})</option>
              <option value="partial">⏳ {t.legendPartial}</option>
              <option value="pending">⚠️ {t.legendUnpaid}</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-stone-50 border-2 border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-800 focus:outline-none"
            >
              <option value="all">{t.allStatuses}</option>
              <option value="confirmed">Confirmed (पक्का)</option>
              <option value="checked_in">Checked In (कमरा ले लिया)</option>
              <option value="checked_out">Checked Out (चेकआउट हो गया)</option>
              <option value="cancelled">Cancelled (रद्द)</option>
            </select>

            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="text-xs bg-stone-50 border-2 border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-800 focus:outline-none"
            >
              <option value="all">{t.allChannels}</option>
              <option value="walk_in">{t.channelWalkIn}</option>
              <option value="phone">{t.channelPhone}</option>
              <option value="online">🌐 Online</option>
            </select>

            <button
              onClick={onRefresh}
              title={t.syncData}
              className="p-2.5 rounded-xl border-2 border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0891B2]' : ''}`} />
            </button>
          </div>

        </div>
      </div>

      {/* Register Table */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            
            <thead className="bg-stone-100 border-b-2 border-stone-200 text-stone-700 uppercase text-[11px] tracking-wider font-black">
              <tr>
                <th className="py-3.5 px-4">{t.colInvoiceRef}</th>
                <th className="py-3.5 px-4">{t.colGuest}</th>
                <th className="py-3.5 px-3">{t.colRoom}</th>
                <th className="py-3.5 px-3">{t.colDates}</th>
                <th className="py-3.5 px-3 text-right">{t.colTotal}</th>
                <th className="py-3.5 px-3 text-right">{t.colAdvance}</th>
                <th className="py-3.5 px-3 text-right">{t.colBalance}</th>
                <th className="py-3.5 px-3 text-center">{t.colPaymentStatus}</th>
                <th className="py-3.5 px-3 text-center">{t.colStayStatus}</th>
                <th className="py-3.5 px-4 text-right">{t.colActions}</th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-stone-100 text-stone-800">
              {filteredBookings.map((b) => {
                const total = Number(b.total_amount) || 0;
                const advance = Number(b.advance_amount) || 0;
                const balance = Number(b.balance_amount ?? Math.max(0, total - advance));
                const isPaid = balance <= 0;
                const isLoading = actionLoadingId === b.id;

                return (
                  <tr key={b.id} className="hover:bg-stone-50 transition-colors font-medium">
                    
                    {/* Invoice & Channel */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-black text-stone-950 text-xs">
                        {b.invoice_number || `KR-INV-${b.reference_id?.slice(-4) || '101'}`}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>{b.reference_id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 rounded-md text-stone-700 font-bold">
                          {b.booking_type === 'phone' ? '📞 Phone' : b.booking_type === 'walk_in' ? '🏨 Walk-in' : '🌐 Online'}
                        </span>
                      </div>
                    </td>

                    {/* Guest */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-stone-950 text-xs flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{b.guest_name}</span>
                      </div>
                      <div className="text-[11px] text-stone-600 flex items-center gap-1.5 mt-0.5 font-bold">
                        <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{b.phone}</span>
                      </div>
                    </td>

                    {/* Room */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#0891B2]/10 text-[#0891B2] flex items-center justify-center font-black text-xs">
                          {b.room_id || '—'}
                        </span>
                        <div>
                          <div className="font-extrabold text-stone-900 text-xs">
                            {b.room_name || `Room ${b.room_id}`}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {b.room_type}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-bold text-stone-900 text-xs">
                        {b.check_in} → {b.check_out}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {b.nights} {lang === 'hi' ? 'रात' : 'Nights'} • {b.guests || 2} {lang === 'hi' ? 'यात्री' : 'Guests'}
                      </div>
                    </td>

                    {/* Total (₹) */}
                    <td className="py-3.5 px-3 text-right font-black text-stone-950 whitespace-nowrap text-sm">
                      ₹{total.toLocaleString('en-IN')}
                    </td>

                    {/* Advance (₹) */}
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-800 whitespace-nowrap text-xs">
                      ₹{advance.toLocaleString('en-IN')}
                    </td>

                    {/* Balance Due (₹) */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-lg font-black font-mono text-xs ${
                        isPaid 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-rose-100 text-rose-950 border-2 border-rose-300'
                      }`}>
                        ₹{balance.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-900'
                          : advance > 0
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}>
                        {isPaid ? t.paidInFull : advance > 0 ? (lang === 'hi' ? 'अग्रिम जमा' : 'Partial') : (lang === 'hi' ? 'लंबित' : 'Pending')}
                      </span>
                    </td>

                    {/* Stay Status Dropdown */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <select
                        disabled={isLoading}
                        value={b.status || 'confirmed'}
                        onChange={(e) => handleStatusChange(b, e.target.value)}
                        className="text-[11px] font-bold rounded-xl px-2.5 py-1.5 border-2 border-stone-200 cursor-pointer bg-white"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="checked_in">Checked In</option>
                        <option value="checked_out">Checked Out</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {!isPaid && (
                          <button
                            onClick={() => onOpenCollectPayment(b)}
                            title={t.collectTitle}
                            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1 active:scale-95"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{t.btnCollect}</span>
                          </button>
                        )}

                        <button
                          onClick={() => onViewInvoice(b)}
                          title={t.actionPrintInvoice}
                          className="px-3 py-1.5 bg-[#0891B2] hover:bg-[#0e7490] text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1 active:scale-95"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t.btnGstInvoice}</span>
                        </button>

                        <button
                          onClick={() => handleDelete(b.id)}
                          title={t.btnDelete}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-stone-300 mx-auto mb-2" />
            <h4 className="text-stone-800 font-bold text-sm">{t.noBookingsFound}</h4>
            <button
              onClick={() => onOpenNewBooking()}
              className="mt-4 px-4 py-2 bg-[#0891B2] text-white rounded-xl text-xs font-bold shadow"
            >
              {t.actionNewBooking}
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
