import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter,
  CreditCard,
  Building,
  Info
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function HorizontalBookingCalendar({
  rooms = [],
  bookings = [],
  lang = 'hi',
  onOpenNewBooking,
  onViewBooking
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  const [startDateStr, setStartDateStr] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d.toISOString().split('T')[0];
  });
  
  const [daysCount, setDaysCount] = useState(14);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredBooking, setHoveredBooking] = useState(null);

  // Generate date columns array
  const dateColumns = useMemo(() => {
    const list = [];
    const base = new Date(startDateStr);
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'short' });
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const isToday = isoStr === new Date().toISOString().split('T')[0];
      list.push({
        date: d,
        isoStr,
        dayName,
        dayNumber,
        monthName,
        isWeekend,
        isToday
      });
    }
    return list;
  }, [startDateStr, daysCount, lang]);

  const handleShiftDays = (offset) => {
    const d = new Date(startDateStr);
    d.setDate(d.getDate() + offset);
    setStartDateStr(d.toISOString().split('T')[0]);
  };

  const handleJumpToToday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    setStartDateStr(d.toISOString().split('T')[0]);
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchFloor = selectedFloor === 'all' || r.floor === selectedFloor;
      const matchCat = selectedCategory === 'all' || 
        r.category === selectedCategory || 
        r.category.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchFloor && matchCat;
    });
  }, [rooms, selectedFloor, selectedCategory]);

  const bookingsByRoom = useMemo(() => {
    const map = {};
    rooms.forEach(r => { map[r.id] = []; });
    bookings.forEach(b => {
      if (b.room_id && map[b.room_id] && b.status !== 'cancelled') {
        map[b.room_id].push(b);
      }
    });
    return map;
  }, [rooms, bookings]);

  const getBookingForCell = (roomId, dateStr) => {
    const list = bookingsByRoom[roomId] || [];
    return list.find(b => dateStr >= b.check_in && dateStr < b.check_out);
  };

  const isCheckInDay = (booking, dateStr) => booking?.check_in === dateStr;

  return (
    <div className="space-y-4">
      
      {/* Calendar Controls Bar */}
      <div className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Navigation & Range */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => handleShiftDays(-7)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border-2 border-stone-200 hover:bg-stone-50 text-stone-800 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.calPrev7}</span>
          </button>

          <button
            onClick={handleJumpToToday}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#F3E5AB] text-xs font-black transition-colors shadow-sm"
          >
            {t.calToday}
          </button>

          <button
            onClick={() => handleShiftDays(7)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border-2 border-stone-200 hover:bg-stone-50 text-stone-800 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <span>{t.calNext7}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Jump to Date */}
          <div className="flex items-center gap-1.5 pl-2 border-l-2 border-stone-200">
            <CalendarIcon className="w-4 h-4 text-stone-400" />
            <input
              type="date"
              value={startDateStr}
              onChange={(e) => setStartDateStr(e.target.value)}
              className="text-xs bg-stone-50 border-2 border-stone-200 rounded-xl px-2.5 py-1.5 font-bold text-stone-800 focus:outline-none"
            />
          </div>
        </div>

        {/* View Width & Floor Filter */}
        <div className="flex items-center gap-2">
          
          <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-bold text-stone-600">
            <button
              onClick={() => setDaysCount(14)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                daysCount === 14 ? 'bg-white shadow text-stone-900 font-black' : 'hover:text-stone-900'
              }`}
            >
              {t.cal14Days}
            </button>
            <button
              onClick={() => setDaysCount(21)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                daysCount === 21 ? 'bg-white shadow text-stone-900 font-black' : 'hover:text-stone-900'
              }`}
            >
              {t.cal21Days}
            </button>
          </div>

          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="text-xs bg-stone-50 border-2 border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-800 focus:outline-none"
          >
            <option value="all">{t.calAllFloors}</option>
            <option value="Ground Floor">{t.calGroundFloor}</option>
            <option value="First Floor">{t.calFirstFloor}</option>
            <option value="Second Floor">{t.calSecondFloor}</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-stone-50 border-2 border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-800 focus:outline-none"
          >
            <option value="all">{lang === 'hi' ? 'सभी कमरे (25)' : 'All Rooms (25)'}</option>
            <option value="Double Bed">{lang === 'hi' ? 'डबल बेड (12)' : 'Double Bed (12)'}</option>
            <option value="Triple Bed">{lang === 'hi' ? 'ट्रिपल बेड (8)' : 'Triple Bed (8)'}</option>
            <option value="Four Bed">{lang === 'hi' ? 'फोर बेड (5)' : 'Four Bed (5)'}</option>
          </select>

        </div>
      </div>

      {/* Legend & Instructions */}
      <div className="bg-stone-50 px-4 py-3 rounded-2xl border-2 border-stone-200/80 flex flex-wrap items-center justify-between text-xs text-stone-700 gap-3">
        <div className="flex flex-wrap items-center gap-4 font-bold">
          <span className="text-stone-900">{t.legendTitle}</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600 shadow-sm" />
            <span>{t.legendPaid}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-500 shadow-sm" />
            <span>{t.legendPartial}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-600 shadow-sm" />
            <span>{t.legendUnpaid}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded border-2 border-dashed border-stone-400 bg-white" />
            <span>{t.legendAvailable}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#0891B2] font-black">
          <Info className="w-4 h-4 shrink-0" />
          <span>{t.calTip}</span>
        </div>
      </div>

      {/* Horizontal Matrix */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-sm overflow-x-auto">
        <table className="w-full border-collapse select-none min-w-[950px]">
          
          <thead>
            <tr className="bg-stone-100 border-b-2 border-stone-200">
              <th className="sticky left-0 z-20 bg-stone-200 text-left px-3 py-3 w-52 min-w-[200px] border-r-2 border-stone-300 font-serif font-black text-xs text-stone-900 shadow-[2px_0_6px_rgba(0,0,0,0.04)]">
                {t.roomTariffCol}
              </th>

              {dateColumns.map((col) => (
                <th
                  key={col.isoStr}
                  className={`text-center px-1.5 py-3 min-w-[62px] border-r border-stone-200/80 font-sans transition-colors ${
                    col.isToday 
                      ? 'bg-amber-100 text-amber-950 font-black ring-2 ring-amber-400' 
                      : col.isWeekend 
                      ? 'bg-stone-50 text-stone-700' 
                      : 'text-stone-800'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-stone-500">
                    {col.dayName}
                  </div>
                  <div className={`text-base font-black ${col.isToday ? 'text-amber-950 underline decoration-amber-600 decoration-2' : ''}`}>
                    {col.dayNumber}
                  </div>
                  <div className="text-[9px] text-stone-400 font-bold">
                    {col.monthName}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y-2 divide-stone-100 text-stone-800">
            {filteredRooms.map((room) => {
              return (
                <tr key={room.id} className="hover:bg-stone-50/50 transition-colors">
                  
                  {/* Sticky Room Label */}
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-stone-50 px-3 py-3 border-r-2 border-stone-200 shadow-[2px_0_6px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-stone-100 border-2 border-stone-200 flex items-center justify-center font-black text-sm text-[#0891B2]">
                          {room.room_number}
                        </span>
                        <div>
                          <div className="font-extrabold text-xs text-stone-900 leading-tight">
                            {room.name.split(' ')[0]} {room.room_number}
                          </div>
                          <div className="text-[10px] text-stone-500 font-medium">
                            {room.category}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-stone-800">
                        ₹{Number(room.base_price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </td>

                  {/* Day cells */}
                  {dateColumns.map((col) => {
                    const booking = getBookingForCell(room.id, col.isoStr);
                    const isStart = isCheckInDay(booking, col.isoStr);

                    if (booking) {
                      let bgStyle = 'bg-amber-500 text-white hover:bg-amber-600';
                      if (booking.payment_status === 'paid') {
                        bgStyle = 'bg-emerald-600 text-white hover:bg-emerald-700';
                      } else if (booking.payment_status === 'pending') {
                        bgStyle = 'bg-rose-600 text-white hover:bg-rose-700';
                      }

                      return (
                        <td
                          key={col.isoStr}
                          className={`p-1 border-r border-stone-200/50 relative ${
                            col.isToday ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <div
                            onClick={() => onViewBooking(booking)}
                            onMouseEnter={() => setHoveredBooking({ ...booking, colDate: col.isoStr })}
                            onMouseLeave={() => setHoveredBooking(null)}
                            className={`h-12 rounded-xl px-1.5 py-1 text-[11px] font-bold cursor-pointer shadow-md transition-all flex flex-col justify-between overflow-hidden active:scale-95 ${bgStyle}`}
                            title={`${booking.guest_name} (${booking.check_in} - ${booking.check_out})`}
                          >
                            {isStart ? (
                              <div className="leading-tight">
                                <span className="block truncate font-black text-xs text-white">
                                  {booking.guest_name.split(' ')[0]}
                                </span>
                                <span className="block text-[9px] opacity-95 truncate">
                                  {booking.nights}N • ₹{Number(booking.balance_amount || 0) > 0 ? `₹${booking.balance_amount}` : (lang === 'hi' ? 'जमा' : 'Paid')}
                                </span>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-white/80" />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={col.isoStr}
                        onClick={() => onOpenNewBooking({
                          room_id: room.id,
                          room_type: room.category,
                          room_name: room.name,
                          base_rate: room.base_price,
                          check_in: col.isoStr,
                          check_out: (() => {
                            const d = new Date(col.isoStr);
                            d.setDate(d.getDate() + 1);
                            return d.toISOString().split('T')[0];
                          })()
                        })}
                        className={`p-1 border-r border-stone-200/50 text-center cursor-pointer hover:bg-emerald-50 transition-colors group/cell ${
                          col.isToday ? 'bg-amber-50/30' : col.isWeekend ? 'bg-stone-50/60' : ''
                        }`}
                        title={lang === 'hi' ? `कमरा ${room.room_number} बुक करने के लिए क्लिक करें` : `Click to book Room ${room.room_number}`}
                      >
                        <div className="h-11 rounded-xl border-2 border-dashed border-stone-200 group-hover/cell:border-emerald-500 group-hover/cell:bg-emerald-100/70 flex items-center justify-center transition-all">
                          <Plus className="w-4 h-4 text-emerald-700 opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                        </div>
                      </td>
                    );
                  })}

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
