import { supabase } from './supabaseClient';

/**
 * 5 Authorized Staff Members for Kanti Resort Phata
 * Strictly limited to these 5 accounts only.
 */
export const AUTHORIZED_STAFF_ACCOUNTS = [
  {
    id: "staff_1",
    email: "gm@kantiresort.com",
    username: "gm@kantiresort.com",
    name_en: "Rajesh Negi",
    name_hi: "राजेश नेगी",
    role_en: "General Manager",
    role_hi: "महाप्रबंधक",
    shift_en: "All Shifts (Admin / Auditing)",
    shift_hi: "सभी शिफ्ट (प्रबंधन एवं ऑडिटिंग)",
    salt: "salt_kanti_gm_800",
    initialPassword: "Kanti@GM#800"
  },
  {
    id: "staff_2",
    email: "desk1@kantiresort.com",
    username: "desk1@kantiresort.com",
    name_en: "Sunil Rawat",
    name_hi: "सुनील रावत",
    role_en: "Front Desk (Morning Shift)",
    role_hi: "रिसेप्शन (सुबह की शिफ्ट)",
    shift_en: "05:00 AM – 02:00 PM (Kedarnath Flight Departure)",
    shift_hi: "सुबह 05:00 से दोपहर 02:00 (हेलीकॉप्टर प्रस्थान)",
    salt: "salt_kanti_desk1_450",
    initialPassword: "Kanti@Desk1#450"
  },
  {
    id: "staff_3",
    email: "desk2@kantiresort.com",
    username: "desk2@kantiresort.com",
    name_en: "Amit Semwal",
    name_hi: "अमित सेमवाल",
    role_en: "Front Desk (Evening Shift)",
    role_hi: "रिसेप्शन (शाम की शिफ्ट)",
    shift_en: "02:00 PM – 10:00 PM (Check-in & Highway Arrival)",
    shift_hi: "दोपहर 02:00 से रात्रि 10:00 (चेक-इन एवं आगमन)",
    salt: "salt_kanti_desk2_750",
    initialPassword: "Kanti@Desk2#750"
  },
  {
    id: "staff_4",
    email: "night@kantiresort.com",
    username: "night@kantiresort.com",
    name_en: "Manoj Bhatt",
    name_hi: "मनोज भट्ट",
    role_en: "Night Auditor & Manager",
    role_hi: "रात्रि प्रबंधक एवं ऑडिटर",
    shift_en: "10:00 PM – 06:00 AM (Night Security & Cloakroom)",
    shift_hi: "रात्रि 10:00 से सुबह 06:00 (सुरक्षा एवं क्लॉक रूम)",
    salt: "salt_kanti_night_110",
    initialPassword: "Kanti@Night#110"
  },
  {
    id: "staff_5",
    email: "billing@kantiresort.com",
    username: "billing@kantiresort.com",
    name_en: "Pooja Sharma",
    name_hi: "पूजा शर्मा",
    role_en: "Billing & Yatra Desk",
    role_hi: "बिलिंग एवं यात्रा डेस्क",
    shift_en: "08:00 AM – 05:00 PM (GST Invoices & Accounts)",
    shift_hi: "सुबह 08:00 से शाम 05:00 (GST बिलिंग एवं खाते)",
    salt: "salt_kanti_bill_140",
    initialPassword: "Kanti@Bill#140"
  }
];

/**
 * SHA-256 cryptographic hashing using Web Crypto API
 */
export async function sha256Hex(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Security: Sanitize text to prevent XSS (Cross-Site Scripting)
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const LOCAL_ATTEMPTS_KEY = 'kanti_staff_login_attempts';
const SESSION_KEY = 'kanti_staff_app_session';

/**
 * Rate Limiting Tracker
 */
function getRateLimitState(email) {
  try {
    const raw = localStorage.getItem(`${LOCAL_ATTEMPTS_KEY}_${email}`);
    if (!raw) return { count: 0, lockedUntil: null };
    const state = JSON.parse(raw);
    if (state.lockedUntil && new Date(state.lockedUntil) < new Date()) {
      return { count: 0, lockedUntil: null };
    }
    return state;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function recordFailedAttempt(email) {
  const current = getRateLimitState(email);
  const newCount = current.count + 1;
  let lockedUntil = null;
  if (newCount >= 5) {
    // Lock for 15 minutes
    const d = new Date();
    d.setMinutes(d.getMinutes() + 15);
    lockedUntil = d.toISOString();
  }
  localStorage.setItem(`${LOCAL_ATTEMPTS_KEY}_${email}`, JSON.stringify({
    count: newCount,
    lockedUntil
  }));
  return { newCount, lockedUntil };
}

function clearRateLimit(email) {
  localStorage.removeItem(`${LOCAL_ATTEMPTS_KEY}_${email}`);
}

/**
 * Authenticate staff against the strict 5-user whitelist with password hashing & lockout protection
 */
export async function authenticateStaffUser(emailOrUsername, password) {
  const cleanInput = (emailOrUsername || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  // 1. Strict 5-user Whitelist Check
  const staffMember = AUTHORIZED_STAFF_ACCOUNTS.find(
    s => s.email.toLowerCase() === cleanInput || s.username.toLowerCase() === cleanInput
  );

  if (!staffMember) {
    return {
      success: false,
      errorEn: "Access Denied: Unrecognized ID. Only the 5 authorized resort staff members are permitted.",
      errorHi: "प्रवेश अस्वीकृत: अमान्य यूजरनेम। केवल 5 अधिकृत स्टाफ सदस्य ही लॉगिन कर सकते हैं।"
    };
  }

  // 2. Rate-Limiting & Lockout Check
  const rateLimit = getRateLimitState(staffMember.email);
  if (rateLimit.lockedUntil && new Date(rateLimit.lockedUntil) > new Date()) {
    const remainingMins = Math.ceil((new Date(rateLimit.lockedUntil) - new Date()) / 60000);
    return {
      success: false,
      errorEn: `Security Lockout: Too many failed attempts. Account locked for ${remainingMins} more minute(s).`,
      errorHi: `सुरक्षा लॉकडाउन: बार-बार गलत पासवर्ड डाला गया। खाता अगले ${remainingMins} मिनट तक लॉक रहेगा।`
    };
  }

  // 3. Cryptographic Hash Calculation
  const computedHash = await sha256Hex(`${cleanPassword}_${staffMember.salt}`);

  // Fetch or check against Supabase staff_users
  try {
    const { data: dbUser } = await supabase
      .from('staff_users')
      .select('*')
      .eq('id', staffMember.id)
      .single();

    if (dbUser && dbUser.password_hash) {
      if (dbUser.password_hash !== computedHash) {
        const { newCount, lockedUntil } = recordFailedAttempt(staffMember.email);
        const remaining = 5 - newCount;
        return {
          success: false,
          errorEn: remaining > 0 
            ? `Incorrect password. ${remaining} attempt(s) remaining before security lockout.` 
            : `Account locked for 15 minutes due to 5 failed attempts.`,
          errorHi: remaining > 0 
            ? `गलत पासवर्ड! सुरक्षा लॉकडाउन से पहले केवल ${remaining} प्रयास शेष हैं।`
            : `5 बार गलत पासवर्ड डालने के कारण खाता 15 मिनट के लिए लॉक कर दिया गया है।`
        };
      }
    } else {
      // Fallback check against known initial password
      if (cleanPassword !== staffMember.initialPassword) {
        recordFailedAttempt(staffMember.email);
        return {
          success: false,
          errorEn: "Incorrect password. Please verify your credentials.",
          errorHi: "गलत पासवर्ड। कृपया सही पासवर्ड दर्ज करें।"
        };
      }
    }

    // Success! Clear rate limits
    clearRateLimit(staffMember.email);

    // Update last_login in Supabase
    await supabase
      .from('staff_users')
      .update({ 
        last_login: new Date().toISOString(),
        failed_attempts: 0,
        locked_until: null
      })
      .eq('id', staffMember.id);

    // Create secure session token
    const sessionToken = {
      staffId: staffMember.id,
      email: staffMember.email,
      name_en: staffMember.name_en,
      name_hi: staffMember.name_hi,
      role_en: staffMember.role_en,
      role_hi: staffMember.role_hi,
      shift_en: staffMember.shift_en,
      shift_hi: staffMember.shift_hi,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString() // 8 hours shift validity
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionToken));

    return {
      success: true,
      user: sessionToken
    };
  } catch (err) {
    console.error("Auth verification error:", err);
    // Secure fallback if db call had network blip
    if (cleanPassword === staffMember.initialPassword) {
      clearRateLimit(staffMember.email);
      const sessionToken = {
        staffId: staffMember.id,
        email: staffMember.email,
        name_en: staffMember.name_en,
        name_hi: staffMember.name_hi,
        role_en: staffMember.role_en,
        role_hi: staffMember.role_hi,
        shift_en: staffMember.shift_en,
        shift_hi: staffMember.shift_hi,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionToken));
      return { success: true, user: sessionToken };
    }
    return {
      success: false,
      errorEn: "Authentication error. Please try again.",
      errorHi: "प्रमाणीकरण त्रुटि। कृपया पुनः प्रयास करें।"
    };
  }
}

/**
 * Retrieve current active staff session
 */
export function getActiveStaffSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * End staff session
 */
export function terminateStaffSession() {
  localStorage.removeItem(SESSION_KEY);
}
