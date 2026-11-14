const supabaseUrl = 'https://spetahewwerjdthwdpfk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZXRhaGV3d2VyamR0aHdkcGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NTY1MzYsImV4cCI6MjEwOTQzMjUzNn0.A4dusotd94FI5W6ipmYLBpSIr11e8HTWbHCmhP9p8L4';

async function runDirectRestTest() {
  console.log('Testing Supabase REST endpoint with native fetch...');

  // 1. Insert room booking
  const res1 = await fetch(`${supabaseUrl}/rest/v1/room_bookings`, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      reference_id: 'KR-TEST-001',
      guest_name: 'Harish Rawat (Test Pilgrim)',
      phone: '+91 98765 00000',
      email: 'pilgrim.test@example.com',
      room_type: 'himalayan-river-suite',
      room_name: 'Himalayan River & Valley Suite',
      check_in: '2025-05-20',
      check_out: '2025-05-22',
      nights: 2,
      guests: 2,
      total_amount: 15000,
      notes: 'Testing end-to-end Supabase backend integration from Kanti Resort web app',
      source: 'backend_verification_test'
    })
  });

  const body1 = await res1.json();
  console.log('Room booking response status:', res1.status, body1);

  // 2. Insert wedding inquiry
  const res2 = await fetch(`${supabaseUrl}/rest/v1/wedding_inquiries`, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      reference_id: 'KR-WED-TEST-001',
      bride_groom: 'Ananya & Vikram (Test)',
      phone: '+91 98765 11111',
      city: 'Delhi NCR',
      wedding_date: '2025-11-25',
      guests_count: 80,
      package_type: 'akhand-dhuni-intimate',
      special_wishes: 'Akhand Dhuni sacred pheres coordination verification',
      source: 'backend_verification_test'
    })
  });

  const body2 = await res2.json();
  console.log('Wedding inquiry response status:', res2.status, body2);
}

runDirectRestTest();
