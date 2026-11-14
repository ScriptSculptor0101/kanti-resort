import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://spetahewwerjdthwdpfk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZXRhaGV3d2VyamR0aHdkcGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NTY1MzYsImV4cCI6MjEwOTQzMjUzNn0.A4dusotd94FI5W6ipmYLBpSIr11e8HTWbHCmhP9p8L4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
