export const RESORT_INFO = {
  name: "Kanti Resort",
  tagline: "Sanctuary of the Sacred Kedar Valley",
  subtitle: "Kedarnath Pilgrimage Stays & Triyuginarayan Destination Weddings",
  location: "Maikhanda, Phata, Kedarnath Highway, Rudraprayag, Uttarakhand 246471",
  elevation: "1,550 Meters (5,085 ft)",
  phonePrimary: "+91 97204 00800",
  whatsapp: "919720400800",
  email: "reservations@kantiresortphata.com",
  googleMapsUrl: "https://maps.app.goo.gl/gmdUWMLvsQAqm5GC7",
  googleRating: 4.6,
  googleReviewCount: "30+",
  helipadDistance: "2 to 5 minutes to all Phata Helipads",
  triyuginarayanDistance: "14 km (Scenic 35 mins drive)",
  kedarnathBaseDistance: "Gaurikund Base Camp 18 km",
  checkInTime: "12:00 PM",
  checkOutTime: "10:00 AM (Early 5:00 AM checkout available for morning Kedarnath flights)"
};

export const HELIPADS = [
  {
    name: "Pinnacle Helipad",
    distance: "450 meters",
    time: "2 mins walk (450m)",
    status: "Active",
    badge: "Closest to Resort",
    copters: "Bell 407 / Airbus H125",
    description: "Located right below the resort ridge with direct private walkway access."
  },
  {
    name: "Pawan Hans Phata Helipad",
    distance: "750 meters",
    time: "3 mins walk (750m)",
    status: "Active",
    badge: "Official Govt Carrier",
    copters: "Mi-172 / Bell 407",
    description: "Primary government approved helipad with spacious waiting lounge along the highway."
  },
  {
    name: "Himalayan Heli Helipad",
    distance: "1.1 km",
    time: "3-4 mins drive / 12 mins walk",
    status: "Active",
    badge: "Premium Operator",
    copters: "Airbus AS350 B3",
    description: "Equipped with dedicated pilgrim lounge and baggage dispatch center."
  },
  {
    name: "UTair India Helipad",
    distance: "1.4 km",
    time: "4 mins drive (1.4 km)",
    status: "Active",
    badge: "High Frequency",
    copters: "MI-172 & Eurocopter",
    description: "High flight frequency during peak May-June and Sept-Oct yatra windows."
  },
  {
    name: "TransBharat Aviation",
    distance: "1.8 km",
    time: "5 mins drive (1.8 km)",
    status: "Active",
    badge: "Highway Access",
    copters: "Bell 407",
    description: "Conveniently situated along the main highway with seamless road connect."
  }
];

export const PILGRIM_SERVICES = [
  {
    title: "5:00 AM Early Yatra Breakfast",
    desc: "Fresh, hot sattvic breakfast served before early morning helicopter departures, plus packed energy breakfast boxes for the flight.",
    icon: "UtensilsCrossed"
  },
  {
    title: "Prime Proximity to Helipads",
    desc: "Located just 450 meters to 1.5 km from all Phata helipads, making early morning boarding effortless without long mountain commutes.",
    icon: "MapPin"
  },
  {
    title: "Secure Luggage Cloakroom",
    desc: "Leave your heavy suitcases safely in our 24/7 guarded locker room while carrying only mandatory 5kg hand baggage to Kedarnath Dham.",
    icon: "ShieldCheck"
  },
  {
    title: "24/7 Hot Geysers & Heating",
    desc: "Continuous instant hot running water and heavy-duty blowers/heaters in every room to recharge after the high-altitude pilgrimage.",
    icon: "Flame"
  },
  {
    title: "Medical & Oxygen Support",
    desc: "Emergency medical oxygen cylinders, pulse oximeters, and doctor-on-call for altitude acclimatization support.",
    icon: "HeartPulse"
  },
  {
    title: "Yatra Pass & Weather Guidance",
    desc: "Daily morning briefing on Kedarnath temple weather, helicopter flight visibility status, and biometric registration checks.",
    icon: "Compass"
  }
];

export const ROOMS = [
  {
    id: "double-bed-room",
    name: "Double Bed Room",
    category: "Double Bed",
    tagline: "Comfortable alpine room with double bed, attached geyser bath, and scenic mountain views",
    price: 4000,
    capacity: "2 Guests",
    bed: "1 Double Bed",
    size: "350 sq.ft",
    image: "/resort-photos/balcony-mountain-view.jpg",
    gallery: [
      "/resort-photos/balcony-mountain-view.jpg",
      "/resort-photos/standard-mountain-room.jpg",
      "/resort-photos/deluxe-kettle-amenities.jpg",
      "/resort-photos/geyser-bathroom.jpg"
    ],
    features: [
      "Comfortable double bed with warm winter quilts & blankets",
      "Private balcony with serene Kedarnath valley mountain views",
      "Attached private bathroom with 24/7 hot water geyser",
      "Electric room heater & tea kettle station",
      "2 minutes walk to Pinnacle Helipad"
    ],
    recommendedFor: "Couples, solo pilgrims, 2 guests"
  },
  {
    id: "triple-bed-room",
    name: "Triple Bed Room",
    category: "Triple Bed",
    tagline: "Spacious pine-finish room with one double bed and one single bed, LED TV, and heating",
    price: 5000,
    capacity: "3 Guests",
    bed: "1 Double Bed + 1 Single Bed",
    size: "420 sq.ft",
    image: "/resort-photos/deluxe-triple-room.jpg",
    gallery: [
      "/resort-photos/deluxe-triple-room.jpg",
      "/resort-photos/deluxe-room-tv.jpg",
      "/resort-photos/deluxe-bed-angle.jpg",
      "/resort-photos/geyser-bathroom.jpg"
    ],
    features: [
      "1 Double bed plus 1 dedicated single bed",
      "Wall-mounted LED TV on illuminated marble panel",
      "Pine-insulated acoustic walls and warm timber ceiling",
      "Attached private bathroom with 24/7 hot water geyser",
      "Electric room heating & heavy thermal blankets",
      "2 minutes walk to Pinnacle Helipad"
    ],
    recommendedFor: "Families of 3, pilgrim trios, small groups"
  },
  {
    id: "four-bed-room",
    name: "Four Bed Room",
    category: "Four Bed",
    tagline: "Expansive family room with multiple beds, valley window, and attached modern bathroom",
    price: 6000,
    capacity: "4 Guests",
    bed: "2 Double Beds (or 4 Beds)",
    size: "520 sq.ft",
    image: "/resort-photos/executive-family-suite.jpg",
    gallery: [
      "/resort-photos/executive-family-suite.jpg",
      "/resort-photos/grand-family-suite.jpg",
      "/resort-photos/quad-pilgrim-family-room.jpg",
      "/resort-photos/modern-bathroom-vanity.jpg",
      "/resort-photos/suite-wide-view.jpg"
    ],
    features: [
      "Twin double beds with velvet tufted headboards (or 4 single beds)",
      "Large room ideal for families and pilgrimage groups",
      "Modern attached bathroom with 24/7 hot water geyser & marble vanity",
      "Insulated timber walls & heavy-duty room heating",
      "Free locked cloakroom for extra luggage during Kedarnath flight",
      "Just 450m from Pinnacle Helipad"
    ],
    recommendedFor: "Families, yatra groups of 4, pilgrim families"
  }
];

export const RESORT_PHOTO_TOUR = [
  { url: "/resort-photos/balcony-mountain-view.jpg", title: "Direct Himalayan Mountain Balcony View", tag: "Balcony View" },
  { url: "/resort-photos/executive-family-suite.jpg", title: "Four Bed Room with Twin Beds", tag: "Four Bed Room" },
  { url: "/resort-photos/modern-bathroom-vanity.jpg", title: "Modern Marble Vanity & Shower", tag: "Attached Bathroom" },
  { url: "/resort-photos/deluxe-triple-room.jpg", title: "Triple Bed Room (Double + Single Bed)", tag: "Triple Bed Room" },
  { url: "/resort-photos/grand-family-suite.jpg", title: "Wood-Paneled Room with Velvet Headboards", tag: "Four Bed Room" },
  { url: "/resort-photos/geyser-bathroom.jpg", title: "24/7 Hot Water Geyser Bathroom", tag: "Attached Bathroom" },
  { url: "/resort-photos/deluxe-room-tv.jpg", title: "Room with LED TV & Marble Wall Panel", tag: "Triple Bed Room" },
  { url: "/resort-photos/quad-pilgrim-family-room.jpg", title: "4-Bed Dedicated Family Yatra Room", tag: "Four Bed Room" },
  { url: "/resort-photos/deluxe-kettle-amenities.jpg", title: "Electric Tea Kettle & Amenity Station", tag: "In-Room Amenities" },
  { url: "/resort-photos/standard-mountain-room.jpg", title: "Double Bed Mountain Room", tag: "Double Bed Room" },
  { url: "/resort-photos/panoramic-suite.jpg", title: "Panoramic Room with Mountain Light", tag: "Four Bed Room" },
  { url: "/resort-photos/deluxe-bed-angle.jpg", title: "Warm Room with Thick Winter Comforters", tag: "Double Bed Room" },
  { url: "/resort-photos/suite-wide-view.jpg", title: "Spacious Room with Valley Mountain Lighting", tag: "Four Bed Room" }
];

export const WEDDING_PACKAGES = [
  {
    id: "celestial-shiv-parvati",
    title: "The Celestial Vows (Full 3-Day Wedding)",
    tier: "Signature Royal Experience",
    idealFor: "Families desiring an unforgettable sacred destination wedding with complete resort takeover",
    guests: "80 - 180 Guests",
    duration: "3 Days / 2 Nights",
    highlights: [
      "Exclusive entire resort buyout & private valley access",
      "Full transportation fleet from Phata to Triyuginarayan Temple for all guests",
      "Traditional Pahadi Dhol-Damau, Ransingha & Shehnai wedding procession",
      "Akhand Dhuni sacred wood samagri arrangement & revered senior temple priests",
      "Custom Mandap setup with exotic Himalayan marigolds, roses, and mountain backdrop",
      "5 Lavish meals including Royal Garhwali Dham, Sattvic feast & Sangeet gala dinner",
      "Bridal suite + grooming salon station & pre-wedding photography coordinator"
    ],
    estStartingPrice: "₹ 11,50,000"
  },
  {
    id: "akhand-dhuni-intimate",
    title: "Akhand Dhuni Vedic Pheres (Intimate Wedding)",
    tier: "Sacred Spiritual Union",
    idealFor: "Couples looking for a pure, deeply spiritual Vedic wedding at Triyuginarayan Temple",
    guests: "25 - 60 Guests",
    duration: "2 Days / 1 Night",
    highlights: [
      "Priest & temple pooja coordination at Triyuginarayan Akhand Dhuni",
      "Brahma Shila ceremony & Vishnu Kund water collection ritual",
      "Decorated Himalayan open-air sit-out dinner under starlit Kedar valley",
      "Deluxe cottages accommodation with mountain views",
      "Pure vegetarian Sattvic wedding feast cooked in pure Desi Ghee",
      "Professional drone and temple photography coverage arrangement",
      "Prime location for arriving wedding guests"
    ],
    estStartingPrice: "₹ 5,80,000"
  },
  {
    id: "custom-kanti-wedding",
    title: "Bespoke Kedar Valley Celebration",
    tier: "Customized Tailored Plan",
    idealFor: "Tailored to your specific dates, traditions, guest numbers, and ceremony requirements",
    guests: "Flexible (30 to 250 Guests)",
    duration: "Flexible (1 to 4 Days)",
    highlights: [
      "Tailor-made catering (Rajasthani, Gujarati, Garhwali, South Indian & North Indian)",
      "Helicopter entry / joyrides for bride and groom",
      "Pre-wedding Mehendi, Haldi & Sangeet staging on riverside lawn",
      "Bonfire musical evenings with folk singers",
      "Guest arrival logistics from Dehradun Jolly Grant Airport & Rishikesh"
    ],
    estStartingPrice: "Custom Quote"
  }
];

export const WEDDING_RITUALS = [
  {
    title: "The Akhand Dhuni Vows",
    desc: "Tying your knot around the exact celestial fire that has burned continuously since the divine wedding of Lord Shiva and Goddess Parvati in Treta Yuga.",
    icon: "Flame"
  },
  {
    title: "Brahma Shila & Vishnu Stambh",
    desc: "Seek the blessings of Lord Vishnu (who acted as Parvati's brother) and Lord Brahma (who was the head priest at the divine wedding).",
    icon: "Sparkles"
  },
  {
    title: "Pahadi Folk Music & Welcome",
    desc: "Enthralling traditional Garhwali Mangal Geet sung by local women, accompanied by reverberating Dhol-Damau echoing through the holy valley.",
    icon: "Music"
  },
  {
    title: "Sacred Kund Snan & Pooja",
    desc: "Ritual offerings at Rudra Kund, Vishnu Kund, and Brahma Kund fed by perennial Saraswati water springs inside temple premises.",
    icon: "Droplets"
  }
];

export const MENU_ITEMS = [
  {
    category: "Pahadi Garhwali Specialties",
    desc: "Authentic, time-honored dishes prepared with organic Himalayan grains and herbs",
    dishes: [
      { name: "Chainsoo", desc: "Slow-roasted black gram curry simmered with coriander and local Jakhiya tempering", tag: "Must Try" },
      { name: "Kafuli", desc: "Velvety puréed spinach and fenugreek leaves infused with mountain spices & rice paste", tag: "Signature" },
      { name: "Gahat ke Paranthe", desc: "Crispy whole wheat bread stuffed with seasoned horse-gram dal served with Pahadi churned butter", tag: "Breakfast Hit" },
      { name: "Jhangore ki Kheer", desc: "Himalayan barnyard millet simmered in sweetened cardamom condensed milk with almonds & dry fruits", tag: "Dessert" },
      { name: "Mandua ki Roti & Pahadi Ghee", desc: "Organic finger millet flatbread topped with fragrant local cow's ghee and hemp seed chutney", tag: "Healthy" }
    ]
  },
  {
    category: "Sattvic Yatra Special",
    desc: "No onion, no garlic pure vegetarian meals prepared specially for fasting pilgrims and spiritual sanctity",
    dishes: [
      { name: "Kuttu ke Poori with Aloo Tamatar", desc: "Buckwheat pooris with cumin-tempered rock-salt potato curry", tag: "Fasting" },
      { name: "Sabudana & Makhana Khichdi", desc: "Slow cooked tapioca pearls and lotus seeds roasted in Desi Ghee", tag: "Fasting" },
      { name: "Panchamrit & Kadha", desc: "Sacred nectar drink and hot mountain herb immunity infusion with ginger, tulsi & honey", tag: "Immunity Booster" },
      { name: "Kesar Badam Milk", desc: "Hot simmered rich milk infused with Kashmiri saffron strands and crushed almonds", tag: "Warming" }
    ]
  },
  {
    category: "Indian & Comfort Classics",
    desc: "Hearty wholesome delights to replenish your energy after the Kedarnath trek or flight",
    dishes: [
      { name: "Dal Makhani & Shahi Paneer", desc: "Rich slow-cooked black lentils and cottage cheese in luscious cashew-tomato gravy", tag: "Popular" },
      { name: "Garhwali Thali Royale", desc: "Complete feast with 2 seasonal vegetables, dal, rice, pahadi roti, raita, salad & dessert", tag: "Complete Meal" },
      { name: "Hot Himalayan Ginger Tea & Pakoras", desc: "Crispy mountain potato and onion fritters paired with steaming fresh ginger tea", tag: "Evening Snack" }
    ]
  }
];

export const GALLERY_IMAGES = [
  {
    id: 1,
    category: "Helipad & Yatra",
    title: "Divine Kedarnath Temple & Snow Peaks",
    location: "Kedarnath Dham (8 Mins Flight from Phata)",
    url: "/kedarnath-cover.jpg"
  },
  {
    id: 2,
    category: "Scenic Valley & River",
    title: "Morning Mist over Mandakini River",
    location: "Phata Valley",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    category: "Rooms & Cottages",
    title: "Presidential Valley Suite Balcony",
    location: "Kanti Resort",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    category: "Triyuginarayan Weddings",
    title: "Celestial Mandap with Snow Peak Backdrop",
    location: "Triyuginarayan Valley",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    category: "Helipad & Yatra",
    title: "Kedarnath Helicopter Service at Phata",
    location: "Phata Helipads (2 Mins from Resort)",
    url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    category: "Triyuginarayan Weddings",
    title: "Sacred Akhand Dhuni Temple Courtyard",
    location: "Triyuginarayan Mandir",
    url: "https://images.unsplash.com/photo-1609137144822-4a009d7df9d9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    category: "Scenic Valley & River",
    title: "Sunset Glow over Kedar Peaks",
    location: "Resort Lawn View",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 7,
    category: "Rooms & Cottages",
    title: "Cozy Alpine Pinewood Cottage",
    location: "Kanti Resort Grounds",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 8,
    category: "Triyuginarayan Weddings",
    title: "Traditional Pahadi Dhol-Damau Welcome",
    location: "Wedding Lawns",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80"
  }
];

export const TESTIMONIALS = [
  {
    name: "Amarjeet Sharma",
    location: "Google Maps Reviewer",
    tripType: "Google Verified Review",
    rating: 5,
    date: "Verified Google Stay",
    source: "Google Maps",
    isGoogleReview: true,
    text: "Rana ji is a very nice person, very humble, best service. Great hospitality and very peaceful stay near the Phata helipads for Kedarnath yatra.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Dr. Rajeshwar Sharma & Family",
    location: "New Delhi",
    tripType: "Kedarnath Dham Yatra",
    rating: 5,
    date: "October 2024",
    source: "Verified Guest",
    text: "Staying at Kanti Resort made our Kedarnath yatra so effortless. It is literally 2 minutes from Pinnacle Helipad! The staff woke up at 4:30 AM to prepare hot tea and packed breakfast for our 6:15 AM helicopter flight. The 24-hour hot water and room heater were a blessing after returning tired from the shrine.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Aakash & Sneha Rawat",
    location: "Dehradun",
    tripType: "Triyuginarayan Yatra & Stay",
    rating: 5,
    date: "November 2024",
    source: "Verified Guest",
    text: "Visiting Triyuginarayan Temple and Kedarnath valley was a dream. Kanti Resort hosted our entire group with unmatched Garhwali warmth! Clean rooms, delicious home-style food, hot geysers, and serene mountain views right from the room.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  }
];

export const FAQS = [
  {
    q: "How close is Kanti Resort to the Kedarnath helipads in Phata?",
    a: "We are ideally situated within 2 to 5 minutes (450 meters to 1.5 km) from all major helipads in Phata (including Pinnacle, Pawan Hans, Himalayan Heli, and UTair). Being within walking and short driving distance along the highway, guests can reach their helicopter gates smoothly on foot or via local cabs without morning traffic delays."
  },
  {
    q: "Can you assist with organizing a destination wedding at Triyuginarayan Temple?",
    a: "Yes! Kanti Resort is one of the premier destination wedding hosts in the Kedar valley. Triyuginarayan Temple is only 14 km (35 minutes) from our resort. We handle end-to-end wedding logistics: guest lodging, wedding feasts, temple priest coordination for Akhand Dhuni rituals, Pahadi cultural music, floral decor, and private transit."
  },
  {
    q: "Do you have 24-hour hot water and room heaters?",
    a: "Absolutely. High-altitude mountain weather can get very chilly, especially in early mornings and evenings. Every single room at Kanti Resort is fitted with 24/7 instant hot water geysers, electric room heaters, and thermal blankets."
  },
  {
    q: "What is your policy for early morning Kedarnath flight departures?",
    a: "Many pilgrims have helicopter departures as early as 6:00 AM. Our kitchen opens by 5:00 AM to provide hot breakfast, fresh tea, and packed travel breakfast boxes to take with you."
  },
  {
    q: "How do we reach Kanti Resort in Phata?",
    a: "Phata is located on the main Kedarnath Highway (NH-107). You can arrive from Dehradun Jolly Grant Airport (approx. 210 km / 6-7 hours drive) or Rishikesh / Haridwar Railway Stations (approx. 195 km / 6 hours). We can also arrange private luxury cab pickups."
  },
  {
    q: "Is pure vegetarian and Sattvic food available?",
    a: "Yes, our in-house restaurant 'Mandakini Rasoi' strictly prepares pure vegetarian food. We also offer special Sattvic (no onion, no garlic) meals and Navratri/Vrat fasting options for devotees."
  }
];

export const TRAVEL_ROUTES = [
  {
    from: "Dehradun (Jolly Grant Airport)",
    distance: "215 km",
    duration: "6.5 - 7 Hours",
    route: "Dehradun -> Rishikesh -> Devprayag -> Srinagar -> Rudraprayag -> Agastyamuni -> Kund -> Guptkashi -> Phata",
    tips: "Scenic mountain drive along the holy Alaknanda and Mandakini river confluences."
  },
  {
    from: "Rishikesh Railway Station",
    distance: "195 km",
    duration: "6 Hours",
    route: "Rishikesh -> Devprayag -> Rudraprayag -> Guptkashi -> Phata",
    tips: "Best early morning departure around 5:00 AM to reach Kanti Resort in time for lunch."
  },
  {
    from: "Haridwar Junction",
    distance: "220 km",
    duration: "7 Hours",
    route: "Haridwar -> Rishikesh -> Devprayag -> Srinagar -> Rudraprayag -> Phata",
    tips: "Direct private cabs, luxury tempo travelers, and state buses run regularly to Phata."
  }
];
