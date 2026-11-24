import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://spetahewwerjdthwdpfk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZXRhaGV3d2VyamR0aHdkcGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NTY1MzYsImV4cCI6MjEwOTQzMjUzNn0.A4dusotd94FI5W6ipmYLBpSIr11e8HTWbHCmhP9p8L4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Submits a Kedarnath Pilgrimage Room Booking inquiry to Supabase
 */
export async function submitRoomBooking(bookingData) {
  try {
    const referenceId = bookingData.referenceId || `KR-PHATA-${Date.now().toString().slice(-6)}`;
    
    const payload = {
      reference_id: referenceId,
      guest_name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email || null,
      room_type: bookingData.roomType,
      room_name: bookingData.roomName || null,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      nights: Number(bookingData.nights) || 1,
      guests: Number(bookingData.guests) || 2,
      total_amount: Number(bookingData.totalAmount) || null,
      notes: bookingData.notes || null,
      source: bookingData.source || 'website_booking_modal',
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('room_bookings')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase booking submission error:', error);
      return { success: false, error: error.message, referenceId };
    }

    return { success: true, data, referenceId };
  } catch (err) {
    console.error('Unexpected booking error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Submits a Triyuginarayan Destination Wedding Inquiry to Supabase
 */
export async function submitWeddingInquiry(inquiryData) {
  try {
    const referenceId = inquiryData.referenceId || `KR-WED-${Date.now().toString().slice(-6)}`;

    const payload = {
      reference_id: referenceId,
      bride_groom: inquiryData.brideGroom,
      phone: inquiryData.phone,
      city: inquiryData.city || null,
      wedding_date: inquiryData.date || null,
      guests_count: Number(inquiryData.guests) || 100,
      package_type: inquiryData.packageType,
      special_wishes: inquiryData.specialWishes || null,
      source: inquiryData.source || 'website_wedding_modal',
      status: 'new'
    };

    const { data, error } = await supabase
      .from('wedding_inquiries')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase wedding inquiry submission error:', error);
      return { success: false, error: error.message, referenceId };
    }

    return { success: true, data, referenceId };
  } catch (err) {
    console.error('Unexpected wedding inquiry error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * ============================================================================
 * RESORT ROOM MANAGEMENT SYSTEM (RMS) API METHODS
 * ============================================================================
 */

/**
 * Fetch all resort rooms sorted by room number
 */
export async function fetchResortRooms() {
  try {
    const { data, error } = await supabase
      .from('resort_rooms')
      .select('*')
      .order('room_number', { ascending: true });

    if (error) throw error;
    return { success: true, rooms: data || [] };
  } catch (err) {
    console.error('Error fetching resort rooms:', err);
    return { success: false, error: err.message, rooms: [] };
  }
}

/**
 * Quick toggle or update room status (available, booked, cleaning, maintenance)
 */
export async function updateResortRoomStatus(roomId, newStatus) {
  try {
    const { data, error } = await supabase
      .from('resort_rooms')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', roomId)
      .select();

    if (error) throw error;
    return { success: true, room: data?.[0] };
  } catch (err) {
    console.error('Error updating room status:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all bookings with billing details
 */
export async function fetchAllBookings() {
  try {
    const { data, error } = await supabase
      .from('room_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, bookings: data || [] };
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return { success: false, error: err.message, bookings: [] };
  }
}

/**
 * Checks for overlapping bookings for a given room within date range.
 * Two ranges [A, B] and [C, D] overlap if A < D and B > C.
 */
export async function checkRoomDateOverlap(roomId, checkIn, checkOut, excludeBookingId = null) {
  try {
    let query = supabase
      .from('room_bookings')
      .select('id, reference_id, guest_name, check_in, check_out, room_id, status')
      .eq('room_id', roomId)
      .neq('status', 'cancelled')
      .lt('check_in', checkOut)
      .gt('check_out', checkIn);

    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const hasOverlap = data && data.length > 0;
    return { 
      hasOverlap, 
      overlappingBookings: data || [] 
    };
  } catch (err) {
    console.error('Error checking room overlap:', err);
    return { hasOverlap: false, error: err.message, overlappingBookings: [] };
  }
}

/**
 * Create a new Walk-in or Phone Reservation with full billing
 */
export async function createResortBooking(bookingData) {
  try {
    // 1. Prevent Overlapping dates
    if (bookingData.room_id) {
      const overlapCheck = await checkRoomDateOverlap(
        bookingData.room_id, 
        bookingData.check_in, 
        bookingData.check_out
      );

      if (overlapCheck.hasOverlap) {
        const overlap = overlapCheck.overlappingBookings[0];
        return {
          success: false,
          error: `Overlap collision: Room ${bookingData.room_id} is already reserved for ${overlap.guest_name} from ${overlap.check_in} to ${overlap.check_out}. Please choose another room or non-conflicting dates.`,
          overlap: overlapCheck.overlappingBookings
        };
      }
    }

    // 2. Generate reference and invoice IDs
    const timestampStr = Date.now().toString().slice(-5);
    const referenceId = bookingData.reference_id || `KR-BK-${new Date().getFullYear()}-${timestampStr}`;
    const invoiceNumber = bookingData.invoice_number || `KR-INV-${new Date().getFullYear()}-${timestampStr}`;

    // 3. Compute billing numbers safely
    const baseRate = Number(bookingData.base_rate) || 4000;
    const nights = Math.max(1, Number(bookingData.nights) || 1);
    const extraCharges = Number(bookingData.extra_charges) || 0;
    const discount = Number(bookingData.discount) || 0;
    const gstRate = Number(bookingData.gst_rate) || 12;

    const taxableAmount = Math.max(0, (baseRate * nights) + extraCharges - discount);
    const gstAmount = Math.round((taxableAmount * gstRate) / 100);
    const totalAmount = taxableAmount + gstAmount;
    const advanceAmount = Number(bookingData.advance_amount) || 0;
    const balanceAmount = Math.max(0, totalAmount - advanceAmount);

    let paymentStatus = 'pending';
    if (balanceAmount <= 0) {
      paymentStatus = 'paid';
    } else if (advanceAmount > 0) {
      paymentStatus = 'partial';
    }

    const payload = {
      reference_id: referenceId,
      guest_name: bookingData.guest_name,
      phone: bookingData.phone,
      email: bookingData.email || null,
      guest_address: bookingData.guest_address || null,
      guest_gstin: bookingData.guest_gstin || null,
      id_proof_type: bookingData.id_proof_type || 'Aadhaar Card',
      id_proof_number: bookingData.id_proof_number || null,
      room_id: bookingData.room_id || null,
      room_type: bookingData.room_type || 'Double Bed Room',
      room_name: bookingData.room_name || `Room ${bookingData.room_id}`,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      nights,
      guests: Number(bookingData.guests) || 2,
      adults: Number(bookingData.adults) || 2,
      children: Number(bookingData.children) || 0,
      base_rate: baseRate,
      extra_charges: extraCharges,
      discount,
      gst_rate: gstRate,
      gst_amount: gstAmount,
      total_amount: totalAmount,
      advance_amount: advanceAmount,
      balance_amount: balanceAmount,
      payment_status: paymentStatus,
      payment_mode: bookingData.payment_mode || 'cash',
      booking_type: bookingData.booking_type || 'walk_in',
      invoice_number: invoiceNumber,
      status: bookingData.status || 'confirmed',
      source: bookingData.source || 'staff_dashboard',
      notes: bookingData.notes || null
    };

    const { data, error } = await supabase
      .from('room_bookings')
      .insert([payload])
      .select();

    if (error) throw error;

    // 4. If booking is active today, update the room's status to 'booked'
    const todayStr = new Date().toISOString().split('T')[0];
    if (bookingData.room_id && bookingData.check_in <= todayStr && bookingData.check_out > todayStr) {
      await updateResortRoomStatus(bookingData.room_id, 'booked');
    }

    return { success: true, booking: data?.[0] };
  } catch (err) {
    console.error('Error creating booking:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Update an existing booking (status, dates, or payments)
 */
export async function updateResortBooking(bookingId, updates) {
  try {
    // If dates or room changed, verify overlap
    if (updates.room_id && updates.check_in && updates.check_out) {
      const overlapCheck = await checkRoomDateOverlap(
        updates.room_id,
        updates.check_in,
        updates.check_out,
        bookingId
      );

      if (overlapCheck.hasOverlap) {
        const overlap = overlapCheck.overlappingBookings[0];
        return {
          success: false,
          error: `Overlap collision: Room ${updates.room_id} is already reserved for ${overlap.guest_name} from ${overlap.check_in} to ${overlap.check_out}.`,
          overlap: overlapCheck.overlappingBookings
        };
      }
    }

    // Recalculate balance and payment status if financial fields changed
    const cleanUpdates = { ...updates };
    if ('total_amount' in updates || 'advance_amount' in updates) {
      const total = Number(updates.total_amount ?? 0);
      const advance = Number(updates.advance_amount ?? 0);
      cleanUpdates.balance_amount = Math.max(0, total - advance);
      if (cleanUpdates.balance_amount <= 0) {
        cleanUpdates.payment_status = 'paid';
      } else if (advance > 0) {
        cleanUpdates.payment_status = 'partial';
      } else {
        cleanUpdates.payment_status = 'pending';
      }
    }

    const { data, error } = await supabase
      .from('room_bookings')
      .update(cleanUpdates)
      .eq('id', bookingId)
      .select();

    if (error) throw error;
    return { success: true, booking: data?.[0] };
  } catch (err) {
    console.error('Error updating booking:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a booking
 */
export async function deleteResortBooking(bookingId) {
  try {
    const { error } = await supabase
      .from('room_bookings')
      .delete()
      .eq('id', bookingId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error deleting booking:', err);
    return { success: false, error: err.message };
  }
}
