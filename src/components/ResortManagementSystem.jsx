import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  Calendar as CalendarIcon, 
  FileText, 
  PlusCircle, 
  RefreshCw, 
  LogOut, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles,
  BedDouble,
  UserCheck,
  Globe,
  CreditCard,
  Printer
} from 'lucide-react';
import { 
  fetchResortRooms, 
  fetchAllBookings, 
  updateResortRoomStatus 
} from '../lib/supabaseClient';
import { getActiveStaffSession, terminateStaffSession } from '../lib/staffAuthService';
import { TRANSLATIONS } from '../data/translations';
import RoomStatusGrid from './RoomStatusGrid';
import HorizontalBookingCalendar from './HorizontalBookingCalendar';
import BookingsBillingTable from './BookingsBillingTable';
import NewBookingModal from './NewBookingModal';
import GstInvoiceModal from './GstInvoiceModal';
import CollectPaymentModal from './CollectPaymentModal';
import StaffAuth from './StaffAuth';
import InstallAppModal from './InstallAppModal';

export default function ResortManagementSystem({ onExitToWebsite }) {
  // Language State: 'hi' (Hindi default for Indian staff ease) or 'en'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('kanti_staff_lang') || 'hi';
  });

  const toggleLanguage = () => {
    const next = lang === 'hi' ? 'en' : 'hi';
    setLang(next);
    localStorage.setItem('kanti_staff_lang', next);
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  // Staff Authentication State
  const [staffUser, setStaffUser] = useState(() => getActiveStaffSession());
  const [authModalOpen, setAuthModalOpen] = useState(!staffUser);

  // Active View Tab: 'grid' | 'calendar' | 'billing'
  const [activeTab, setActiveTab] = useState('grid');

  // Supabase Data State
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [newBookingInitialData, setNewBookingInitialData] = useState({});

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  const [collectPaymentModalOpen, setCollectPaymentModalOpen] = useState(false);
  const [selectedCollectBooking, setSelectedCollectBooking] = useState(null);

  const [installModalOpen, setInstallModalOpen] = useState(false);

  // Toast feedback helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch all data from Supabase
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        fetchResortRooms(),
        fetchAllBookings()
      ]);

      if (roomsRes.success) {
        setRooms(roomsRes.rooms);
      }
      if (bookingsRes.success) {
        setBookings(bookingsRes.bookings);
      }
    } catch (err) {
      console.error('Data load error:', err);
      showToast(lang === 'hi' ? 'डेटा लोड करने में त्रुटि: ' + err.message : 'Error syncing: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    if (staffUser) {
      loadData();
    }
  }, [staffUser, loadData]);

  // Handle Room Status Quick Toggle
  const handleUpdateRoomStatus = async (roomId, newStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    
    const res = await updateResortRoomStatus(roomId, newStatus);
    if (res.success) {
      const statusLabel = t[`status${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`] || newStatus;
      showToast(
        lang === 'hi' 
          ? `कमरा ${roomId} अब "${statusLabel}" मार्क कर दिया गया है` 
          : `Room ${roomId} marked as "${statusLabel}"`, 
        'success'
      );
    } else {
      showToast(res.error, 'error');
      loadData();
    }
  };

  // Open New Booking Modal
  const handleOpenNewBooking = (initialData = {}) => {
    setNewBookingInitialData(initialData);
    setNewBookingModalOpen(true);
  };

  // When a new booking is created
  const handleBookingCreated = (newBooking) => {
    showToast(
      lang === 'hi'
        ? `बुकिंग ${newBooking.reference_id} सफलतापूर्वक दर्ज हो गई!`
        : `Reservation ${newBooking.reference_id} created successfully!`,
      'success'
    );
    loadData();
  };

  // When a booking/payment is updated
  const handleBookingUpdated = (updatedBooking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    showToast(
      lang === 'hi'
        ? `बुकिंग ${updatedBooking.reference_id} अपडेट हो गई`
        : `Updated reservation ${updatedBooking.reference_id}`,
      'success'
    );
    loadData();
  };

  // Open GST Invoice
  const handleViewInvoice = (booking) => {
    setSelectedInvoiceBooking(booking);
    setInvoiceModalOpen(true);
  };

  // Open Collect Payment Modal
  const handleOpenCollectPayment = (booking) => {
    setSelectedCollectBooking(booking);
    setCollectPaymentModalOpen(true);
  };

  // Logout
  const handleLogout = () => {
    terminateStaffSession();
    setStaffUser(null);
    setAuthModalOpen(true);
  };

  // If not logged in, show Auth Gate
  if (!staffUser) {
    return (
      <div className="min-h-screen bg-[#F4EFEA] flex flex-col items-center justify-center p-4 select-none">
        <div className="text-center space-y-4 max-w-md">
          <img 
            src="/kanti-logo-circle.png" 
            alt="Kanti Resort" 
            className="w-20 h-20 rounded-full mx-auto shadow-lg ring-4 ring-[#D4A373]/50 object-cover" 
          />
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
              {lang === 'hi' ? 'कांति रिसॉर्ट स्टाफ ऐप' : 'Kanti Resort Staff App'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
              {lang === 'hi' 
                ? 'केदारनाथ मार्ग, फाटा • कमरा प्रबंधन एवं GST बिलिंग ऐप' 
                : 'Kedarnath Valley Stays • Front Desk & GST Invoicing App'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="py-3 px-8 rounded-2xl bg-[#0891B2] hover:bg-[#0e7490] text-white text-sm font-bold shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-5 h-5 text-cyan-200" />
              <span>{lang === 'hi' ? '🔒 स्टाफ लॉगिन करें' : '🔒 Staff Sign In'}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="py-3 px-4 rounded-2xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Globe className="w-4 h-4 text-[#D4A373]" />
              <span>{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>
          </div>

          <div>
            <button
              onClick={onExitToWebsite}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 mx-auto pt-3 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.returnToWebsite}</span>
            </button>
          </div>
        </div>

        <StaffAuth
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          lang={lang}
          onToggleLang={toggleLanguage}
          onAuthSuccess={(user) => {
            setStaffUser(user);
            setAuthModalOpen(false);
            loadData();
          }}
        />
      </div>
    );
  }

  const staffDisplayName = lang === 'hi' ? (staffUser.name_hi || staffUser.name_en) : (staffUser.name_en || staffUser.name_hi);
  const staffDisplayRole = lang === 'hi' ? (staffUser.role_hi || staffUser.role_en) : (staffUser.role_en || staffUser.role_hi);

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-stone-800 flex flex-col font-sans select-none">
      
      {/* Top App Bar - Large, High Contrast, Touch Friendly */}
      <header className="sticky top-0 z-30 bg-[#1E252B] text-white border-b-2 border-[#D4A373]/40 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Branding & Return to site */}
            <div className="flex items-center gap-3">
              <button 
                onClick={onExitToWebsite}
                title={t.returnToWebsite}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <img 
                  src="/kanti-logo-circle.png" 
                  alt="Kanti Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-[#D4A373]/60 shadow"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif tracking-wide text-base sm:text-xl font-black text-[#F3E5AB]">
                      {t.appName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] text-emerald-300 font-bold uppercase hidden sm:inline-block">
                      ● Live
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300 hidden sm:block">
                    {t.tagline} • {t.roomsTotal}
                  </p>
                </div>
              </div>
            </div>

            {/* Middle: 3 Main App View Tabs (Large Pills) */}
            <div className="hidden lg:flex items-center bg-stone-900/90 rounded-2xl p-1.5 border border-stone-700 shadow-inner">
              <button
                onClick={() => setActiveTab('grid')}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm transition-all font-bold ${
                  activeTab === 'grid'
                    ? 'bg-gradient-to-r from-[#D4A373] to-[#B88758] text-stone-950 shadow-md scale-[1.02]'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{t.tabGrid}</span>
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm transition-all font-bold ${
                  activeTab === 'calendar'
                    ? 'bg-gradient-to-r from-[#D4A373] to-[#B88758] text-stone-950 shadow-md scale-[1.02]'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>{t.tabCalendar}</span>
              </button>

              <button
                onClick={() => setActiveTab('billing')}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm transition-all font-bold ${
                  activeTab === 'billing'
                    ? 'bg-gradient-to-r from-[#D4A373] to-[#B88758] text-stone-950 shadow-md scale-[1.02]'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t.tabBilling}</span>
              </button>
            </div>

            {/* Right: Language Switcher, Staff Profile & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Install App on Phone Button */}
              <button
                onClick={() => setInstallModalOpen(true)}
                className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                title="Install / Share on Mobile Phone"
              >
                <span>📱</span>
                <span className="hidden sm:inline">{lang === 'hi' ? 'फोन में ऐप' : 'Phone App'}</span>
              </button>

              {/* Language Switcher Pill */}
              <button
                onClick={toggleLanguage}
                className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-[#F3E5AB] flex items-center gap-1.5 transition-all shadow-sm"
                title="Change Language / भाषा बदलें"
              >
                <Globe className="w-4 h-4 text-[#D4A373]" />
                <span className="font-extrabold">{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
              </button>

              {/* Refresh button */}
              <button
                onClick={loadData}
                title={t.syncData}
                className="p-2 sm:p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>

              {/* Staff Pill */}
              <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-stone-700">
                <div className="w-9 h-9 rounded-xl bg-[#D4A373]/20 border border-[#D4A373]/40 flex items-center justify-center text-[#D4A373] font-bold text-sm">
                  {staffDisplayName?.charAt(0) || 'S'}
                </div>
                <div className="text-left text-xs leading-tight">
                  <span className="block font-bold text-white truncate max-w-[130px]">
                    {staffDisplayName}
                  </span>
                  <span className="block text-stone-400 text-[10px] truncate max-w-[130px]">
                    {staffDisplayRole}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title={t.logout}
                className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

            </div>

          </div>

          {/* Mobile Tab Bar */}
          <div className="flex lg:hidden items-center justify-around py-2.5 border-t border-stone-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('grid')}
              className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 ${
                activeTab === 'grid' ? 'bg-[#D4A373] text-stone-950 font-black shadow' : 'text-stone-300'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t.tabGrid}</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 ${
                activeTab === 'calendar' ? 'bg-[#D4A373] text-stone-950 font-black shadow' : 'text-stone-300'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>{t.tabCalendar}</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 ${
                activeTab === 'billing' ? 'bg-[#D4A373] text-stone-950 font-black shadow' : 'text-stone-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.tabBilling}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border-2 text-xs sm:text-sm font-bold flex items-center gap-3 ${
            toastMessage.type === 'error'
              ? 'bg-rose-600 text-white border-rose-700'
              : 'bg-stone-900 text-[#F3E5AB] border-[#D4A373]'
          }`}>
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-5 h-5 shrink-0 text-white" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        
        {loading && rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-stone-600 font-bold tracking-wider">
              {lang === 'hi' ? 'कांति रिसॉर्ट डेटा लोड हो रहा है...' : 'Loading Resort Data...'}
            </p>
          </div>
        ) : (
          <>
            {/* View 1: Room Status Grid */}
            {activeTab === 'grid' && (
              <RoomStatusGrid
                rooms={rooms}
                bookings={bookings}
                lang={lang}
                onUpdateStatus={handleUpdateRoomStatus}
                onOpenNewBooking={handleOpenNewBooking}
                onViewBooking={handleViewInvoice}
                onRefresh={loadData}
                loading={loading}
              />
            )}

            {/* View 2: Horizontal Booking Calendar */}
            {activeTab === 'calendar' && (
              <HorizontalBookingCalendar
                rooms={rooms}
                bookings={bookings}
                lang={lang}
                onOpenNewBooking={handleOpenNewBooking}
                onViewBooking={handleViewInvoice}
              />
            )}

            {/* View 3: Bookings & Billing Table */}
            {activeTab === 'billing' && (
              <BookingsBillingTable
                bookings={bookings}
                rooms={rooms}
                lang={lang}
                onOpenNewBooking={handleOpenNewBooking}
                onViewInvoice={handleViewInvoice}
                onOpenCollectPayment={handleOpenCollectPayment}
                onRefresh={loadData}
                loading={loading}
                onBookingUpdated={handleBookingUpdated}
              />
            )}
          </>
        )}

      </main>

      {/* Modals */}
      <NewBookingModal
        isOpen={newBookingModalOpen}
        onClose={() => setNewBookingModalOpen(false)}
        rooms={rooms}
        initialData={newBookingInitialData}
        lang={lang}
        onBookingCreated={handleBookingCreated}
      />

      <GstInvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        booking={selectedInvoiceBooking}
        lang={lang}
      />

      <CollectPaymentModal
        isOpen={collectPaymentModalOpen}
        onClose={() => setCollectPaymentModalOpen(false)}
        booking={selectedCollectBooking}
        lang={lang}
        onPaymentUpdated={handleBookingUpdated}
      />

      <StaffAuth
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        lang={lang}
        onToggleLang={toggleLanguage}
        onAuthSuccess={(user) => {
          setStaffUser(user);
          setAuthModalOpen(false);
          loadData();
        }}
      />

      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        lang={lang}
      />

    </div>
  );
}
