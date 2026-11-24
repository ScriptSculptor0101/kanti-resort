import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Wrench, 
  User, 
  Calendar, 
  PlusCircle, 
  FileText, 
  Search,
  Check,
  BedDouble,
  TrendingUp,
  RefreshCw,
  CreditCard
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function RoomStatusGrid({ 
  rooms = [], 
  bookings = [], 
  lang = 'hi',
  onUpdateStatus, 
  onOpenNewBooking, 
  onViewBooking,
  onRefresh,
  loading = false
}) {
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  // Status styling configuration
  const STATUS_CONFIG = {
    available: {
      label: t.statusAvailable,
      shortLabel: t.btnAvail,
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-2 ring-emerald-400/20',
      dotClass: 'bg-emerald-600 animate-pulse',
      cardBorder: 'border-emerald-300 hover:border-emerald-500 shadow-emerald-100/50',
      accentBg: 'bg-emerald-50/70',
      icon: CheckCircle2,
      btnActive: 'bg-emerald-700 text-white shadow-md font-black scale-105'
    },
    booked: {
      label: t.statusBooked,
      shortLabel: t.btnBooked,
      badgeClass: 'bg-rose-100 text-rose-900 border-rose-300 ring-2 ring-rose-400/20',
      dotClass: 'bg-rose-600',
      cardBorder: 'border-rose-300 hover:border-rose-500 shadow-rose-100/50',
      accentBg: 'bg-rose-50/70',
      icon: XCircle,
      btnActive: 'bg-rose-700 text-white shadow-md font-black scale-105'
    },
    cleaning: {
      label: t.statusCleaning,
      shortLabel: t.btnClean,
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/20',
      dotClass: 'bg-amber-600',
      cardBorder: 'border-amber-300 hover:border-amber-500 shadow-amber-100/50',
      accentBg: 'bg-amber-50/70',
      icon: Sparkles,
      btnActive: 'bg-amber-700 text-white shadow-md font-black scale-105'
    },
    maintenance: {
      label: t.statusMaintenance,
      shortLabel: t.btnMaint,
      badgeClass: 'bg-stone-200 text-stone-800 border-stone-300 ring-2 ring-stone-400/20',
      dotClass: 'bg-stone-600',
      cardBorder: 'border-stone-300 hover:border-stone-500',
      accentBg: 'bg-stone-100/80',
      icon: Wrench,
      btnActive: 'bg-stone-800 text-white shadow-md font-black scale-105'
    }
  };

  // Find active booking for a room
  const getActiveBookingForRoom = (roomId) => {
    const today = new Date().toISOString().split('T')[0];
    const roomBookings = bookings.filter(b => b.room_id === roomId && b.status !== 'cancelled');
    
    const current = roomBookings.find(b => b.check_in <= today && b.check_out >= today);
    if (current) return current;

    const upcoming = roomBookings
      .filter(b => b.check_in > today)
      .sort((a, b) => a.check_in.localeCompare(b.check_in))[0];
    if (upcoming) return upcoming;

    return roomBookings[0] || null;
  };

  const handleStatusChange = async (roomId, newStatus) => {
    setUpdatingId(roomId);
    await onUpdateStatus(roomId, newStatus);
    setUpdatingId(null);
  };

  // Live counts
  const totalCount = rooms.length;
  const availableCount = rooms.filter(r => r.status === 'available').length;
  const bookedCount = rooms.filter(r => r.status === 'booked').length;
  const cleaningCount = rooms.filter(r => r.status === 'cleaning').length;
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length;
  const occupancyPercent = totalCount > 0 ? Math.round((bookedCount / totalCount) * 100) : 0;

  // Filtered rooms
  const filteredRooms = rooms.filter(room => {
    const matchesFloor = selectedFloor === 'all' || room.floor === selectedFloor;
    const matchesCategory = selectedCategory === 'all' || room.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesSearch = 
      room.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFloor && matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5">
      
      {/* Live Occupancy Big KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Rooms */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">{t.counterTotal}</p>
            <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
            <BedDouble className="w-5 h-5" />
          </div>
        </div>

        {/* Available Rooms (Big Green) */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'available' ? 'all' : 'available')}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            statusFilter === 'available' 
              ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-500/20 shadow-md' 
              : 'bg-emerald-50/80 border-emerald-300 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black text-emerald-900 uppercase tracking-wider">{t.counterAvailable}</p>
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-800 mt-0.5">{availableCount}</p>
          <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
            {totalCount ? Math.round((availableCount/totalCount)*100) : 0}% {t.inventoryPercent}
          </p>
        </div>

        {/* Booked / Occupied (Big Red) */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'booked' ? 'all' : 'booked')}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            statusFilter === 'booked' 
              ? 'bg-rose-100 border-rose-500 ring-4 ring-rose-500/20 shadow-md' 
              : 'bg-rose-50/80 border-rose-300 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black text-rose-900 uppercase tracking-wider">{t.counterBooked}</p>
            <span className="w-3 h-3 rounded-full bg-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-800 mt-0.5">{bookedCount}</p>
          <p className="text-[10px] text-rose-700 font-bold mt-0.5">
            {occupancyPercent}% {t.counterOccupancy}
          </p>
        </div>

        {/* Cleaning */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'cleaning' ? 'all' : 'cleaning')}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            statusFilter === 'cleaning' 
              ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-500/20 shadow-md' 
              : 'bg-amber-50/80 border-amber-300 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black text-amber-900 uppercase tracking-wider">{t.counterCleaning}</p>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-800 mt-0.5">{cleaningCount}</p>
          <p className="text-[10px] text-amber-700 font-bold mt-0.5">{lang === 'hi' ? 'सफाई कार्य जारी' : 'In Progress'}</p>
        </div>

        {/* Maintenance */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'maintenance' ? 'all' : 'maintenance')}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            statusFilter === 'maintenance' 
              ? 'bg-stone-200 border-stone-500 ring-4 ring-stone-400/20 shadow-md' 
              : 'bg-stone-100 border-stone-300 hover:border-stone-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black text-stone-800 uppercase tracking-wider">{t.counterMaintenance}</p>
            <Wrench className="w-4 h-4 text-stone-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">{maintenanceCount}</p>
          <p className="text-[10px] text-stone-600 font-bold mt-0.5">{lang === 'hi' ? 'मरम्मत कार्य' : 'Out of order'}</p>
        </div>

        {/* Live Occupancy Gauge */}
        <div className="bg-gradient-to-br from-[#1E252B] to-[#2E3842] text-white p-3.5 sm:p-4 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black text-[#F3E5AB] uppercase tracking-wider">{t.counterOccupancy}</p>
            <TrendingUp className="w-4 h-4 text-[#D4A373]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-[#F3E5AB]">{occupancyPercent}%</span>
              <span className="text-[10px] text-stone-400">({bookedCount}/{totalCount})</span>
            </div>
            <div className="w-full bg-stone-700 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#D4A373] to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border-2 border-stone-200/90 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder={lang === 'hi' ? "कमरा संख्या (101, 201), नाम खोजें..." : "Search room number (101, 201), name..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 border-2 border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-stone-50 border-2 border-stone-200 rounded-xl px-3 py-2.5 font-bold text-stone-800 focus:outline-none"
          >
            <option value="all">{lang === 'hi' ? `सभी स्थितियां (${totalCount})` : `All Statuses (${totalCount})`}</option>
            <option value="available">🟢 {t.statusAvailable} ({availableCount})</option>
            <option value="booked">🔴 {t.statusBooked} ({bookedCount})</option>
            <option value="cleaning">🟡 {t.statusCleaning} ({cleaningCount})</option>
            <option value="maintenance">⚪ {t.statusMaintenance} ({maintenanceCount})</option>
          </select>

          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="text-xs bg-stone-50 border-2 border-stone-200 rounded-xl px-3 py-2.5 font-bold text-stone-800 focus:outline-none"
          >
            <option value="all">{lang === 'hi' ? 'सभी मंजिलें (All Floors)' : 'All Floors'}</option>
            <option value="Ground Floor">{t.calGroundFloor} (101-104)</option>
            <option value="First Floor">{t.calFirstFloor} (201-204)</option>
            <option value="Second Floor">{t.calSecondFloor} (301-304)</option>
          </select>

          <button
            onClick={onRefresh}
            title={t.syncData}
            className="p-2.5 rounded-xl border-2 border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0891B2]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredRooms.map((room) => {
          const cfg = STATUS_CONFIG[room.status] || STATUS_CONFIG.available;
          const activeBooking = getActiveBookingForRoom(room.id);
          const isUpdating = updatingId === room.id;

          return (
            <div
              key={room.id}
              className={`bg-white rounded-3xl border-2 ${cfg.cardBorder} shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden relative group`}
            >
              
              {/* Card Top Banner */}
              <div className={`p-4 border-b-2 border-stone-100 ${cfg.accentBg} flex items-center justify-between`}>
                
                {/* Room No & Category */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md border-2 border-stone-200 flex flex-col items-center justify-center font-bold text-stone-900">
                    <span className="text-[9px] text-stone-400 font-bold uppercase leading-none">{t.room}</span>
                    <span className="text-lg text-[#0891B2] font-black">{room.room_number}</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-stone-900 text-base leading-tight">
                      {room.name}
                    </h3>
                    <p className="text-xs text-stone-600 font-bold mt-0.5">
                      {room.category}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`px-3 py-1.5 rounded-full border text-xs font-black flex items-center gap-1.5 shadow-sm ${cfg.badgeClass}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotClass}`} />
                  <span>{cfg.shortLabel}</span>
                </div>
              </div>

              {/* Card Middle: Price, Specs & Active Guest Info */}
              <div className="p-4 space-y-3 flex-1">
                
                {/* Tariff */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-stone-900">₹{Number(room.base_price).toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-stone-500 font-medium">{t.perNight}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg font-bold">
                    {room.capacity} {t.maxGuests}
                  </span>
                </div>

                {/* If Booked: Display current Guest info */}
                {room.status === 'booked' && activeBooking ? (
                  <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3.5 text-xs space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-rose-900 uppercase tracking-wider flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {t.currentGuest}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-lg font-black ${
                        activeBooking.payment_status === 'paid' 
                          ? 'bg-emerald-100 text-emerald-900' 
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}>
                        {activeBooking.payment_status === 'paid' ? t.paidInFull : `₹${Number(activeBooking.balance_amount || 0).toLocaleString('en-IN')} ${t.balanceDueText}`}
                      </span>
                    </div>

                    <div className="font-extrabold text-stone-900 text-sm truncate">
                      {activeBooking.guest_name}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-stone-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{activeBooking.check_in} → {activeBooking.check_out} ({activeBooking.nights} {lang === 'hi' ? 'रात' : 'Nights'})</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-rose-200/60">
                      <span className="text-[10px] text-stone-500 font-mono">
                        {activeBooking.reference_id}
                      </span>
                      <button
                        onClick={() => onViewBooking(activeBooking)}
                        className="text-xs font-bold text-[#0891B2] hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{t.actionPrintInvoice}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50 rounded-2xl p-3 text-xs space-y-1.5">
                    <p className="text-stone-700 font-medium flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{t.geyserFeature}</span>
                    </p>
                    <p className="text-stone-700 font-medium flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{t.balconyFeature}</span>
                    </p>
                    <p className="text-[10px] text-stone-500 pt-1 font-medium">
                      {t.readyNote}
                    </p>
                  </div>
                )}

              </div>

              {/* Big Touch Status Control Buttons */}
              <div className="px-3.5 py-3 bg-stone-50 border-t-2 border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-black text-stone-600 uppercase tracking-wider">
                  <span>{t.quickToggle}</span>
                  {isUpdating && <span className="text-[#0891B2] animate-pulse">Updating...</span>}
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                  
                  {/* Available */}
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(room.id, 'available')}
                    className={`py-2 rounded-xl text-center transition-all ${
                      room.status === 'available'
                        ? STATUS_CONFIG.available.btnActive
                        : 'bg-white hover:bg-emerald-50 text-stone-700 border-2 border-stone-200'
                    }`}
                  >
                    {t.btnAvail}
                  </button>

                  {/* Booked */}
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(room.id, 'booked')}
                    className={`py-2 rounded-xl text-center transition-all ${
                      room.status === 'booked'
                        ? STATUS_CONFIG.booked.btnActive
                        : 'bg-white hover:bg-rose-50 text-stone-700 border-2 border-stone-200'
                    }`}
                  >
                    {t.btnBooked}
                  </button>

                  {/* Cleaning */}
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(room.id, 'cleaning')}
                    className={`py-2 rounded-xl text-center transition-all ${
                      room.status === 'cleaning'
                        ? STATUS_CONFIG.cleaning.btnActive
                        : 'bg-white hover:bg-amber-50 text-stone-700 border-2 border-stone-200'
                    }`}
                  >
                    {t.btnClean}
                  </button>

                  {/* Maintenance */}
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(room.id, 'maintenance')}
                    className={`py-2 rounded-xl text-center transition-all ${
                      room.status === 'maintenance'
                        ? STATUS_CONFIG.maintenance.btnActive
                        : 'bg-white hover:bg-stone-200 text-stone-700 border-2 border-stone-200'
                    }`}
                  >
                    {t.btnMaint}
                  </button>
                </div>
              </div>

              {/* Bottom Big CTA */}
              <div className="p-3 bg-white border-t border-stone-100">
                {room.status === 'available' ? (
                  <button
                    onClick={() => onOpenNewBooking({ room_id: room.id, base_rate: room.base_price, room_type: room.category, room_name: room.name })}
                    className="w-full py-2.5 px-3 bg-[#0891B2] hover:bg-[#0e7490] text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t.actionNewBooking}</span>
                  </button>
                ) : room.status === 'booked' && activeBooking ? (
                  <button
                    onClick={() => onViewBooking(activeBooking)}
                    className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-[#F3E5AB] rounded-xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <FileText className="w-4 h-4 text-[#D4A373]" />
                    <span>{t.manageBill}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(room.id, 'available')}
                    className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t.markReady}</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
