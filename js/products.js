/* ==========================================================================
   The Holy Drop — store settings and product catalogue
   --------------------------------------------------------------------------
   This is the only file you need to edit to change prices, products,
   coupons or shipping. Prices are in Indian Rupees (whole numbers).
   ========================================================================== */
window.HD = window.HD || {};

HD.config = {
  storeName: 'The Holy Drop',
  // While true, checkout says it is a demo and takes no payment.
  // Turn off only once real payments are connected.
  demoMode: true,
  // Messages that rotate in the bar at the top of every page. Empty list hides the bar.
  announcements: [
    { text: 'Navratri Special: 10% off with code', code: 'NAVRATRI10', href: 'shop.html' },
    { text: 'Free shipping on all orders over ₹999', href: 'shop.html' },
    { text: 'Festive gifting: the Pancha Tirtha gift box', href: 'product.html?id=pancha-tirtha-set' }
  ],
  // Coupon suggested in the cart. Must be one of the codes below.
  featuredCoupon: 'NAVRATRI10',
  freeShippingThreshold: 999,
  shippingFee: 79,
  // Leave empty to hide from the Contact page.
  contactEmail: '',
  contactPhone: '',
  coupons: {
    NAVRATRI10: { type: 'percent', value: 10, label: '10% off your order' },
    HOLYDROP10: { type: 'percent', value: 10, label: '10% off your order' },
    PUJA100: { type: 'flat', value: 100, min: 999, label: '₹100 off orders above ₹999' }
  }
};

HD.categories = [
  { id: 'gangajal', name: 'Gangajal' },
  { id: 'gift', name: 'Gift sets' },
  { id: 'bulk', name: 'Bulk packs' }
];

HD.sources = [
  {
    id: 'gangotri',
    name: 'Gangotri',
    place: 'Uttarakhand',
    blurb: 'High in the Garhwal Himalaya, where the Bhagirathi begins its journey from the glacier.'
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    place: 'Triveni Ghat',
    blurb: 'The yoga capital of the world, where the evening aarti lights up the river.'
  },
  {
    id: 'haridwar',
    name: 'Haridwar',
    place: 'Har Ki Pauri',
    blurb: 'The ghat where the Ganga leaves the mountains and enters the plains.'
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj',
    place: 'Triveni Sangam',
    blurb: 'The meeting point of the Ganga, the Yamuna and the unseen Saraswati.'
  },
  {
    id: 'kashi',
    name: 'Kashi',
    place: 'Dashashwamedh Ghat',
    blurb: 'Varanasi, one of the oldest living cities on earth, and its most celebrated ghat.'
  }
];

HD.products = [
  {
    id: 'haridwar-gangajal',
    name: 'Har Ki Pauri Gangajal',
    category: 'gangajal',
    sources: ['haridwar'],
    location: 'Har Ki Pauri, Haridwar',
    badge: 'Bestseller',
    tint: '#fdf0dc',
    image: 'img/products/haridwar.svg',
    short: 'Collected at Har Ki Pauri, the most sacred ghat of Haridwar, where the Ganga meets the plains.',
    description: [
      'Har Ki Pauri — "the footsteps of the Lord" — is where pilgrims have bathed for centuries and where the Ganga aarti is performed every evening.',
      'Our Haridwar Gangajal is collected at dawn, filtered to remove sediment, and sealed in a tamper-evident bottle so it reaches your home just as it left the ghat.'
    ],
    variants: [
      { size: '100 ml', price: 149, mrp: 179 },
      { size: '250 ml', price: 279, mrp: 329 },
      { size: '500 ml', price: 449, mrp: 549 },
      { size: '1 L', price: 799, mrp: 949 }
    ]
  },
  {
    id: 'kashi-gangajal',
    name: 'Kashi Gangajal',
    category: 'gangajal',
    sources: ['kashi'],
    location: 'Dashashwamedh Ghat, Varanasi',
    badge: 'Bestseller',
    tint: '#fbe9e2',
    image: 'img/products/kashi.svg',
    short: 'From Dashashwamedh Ghat in Varanasi, home of the grandest Ganga aarti.',
    description: [
      'Kashi has drawn seekers to its ghats for thousands of years. Dashashwamedh Ghat, near the Kashi Vishwanath temple, is the heart of it all.',
      'Each bottle is collected at sunrise, filtered to remove sediment, and sealed at the source.'
    ],
    variants: [
      { size: '100 ml', price: 179, mrp: 219 },
      { size: '250 ml', price: 329, mrp: 399 },
      { size: '500 ml', price: 549, mrp: 649 },
      { size: '1 L', price: 949, mrp: 1099 }
    ]
  },
  {
    id: 'gangotri-gangajal',
    name: 'Gangotri Gangajal',
    category: 'gangajal',
    sources: ['gangotri'],
    location: 'Gangotri, Uttarakhand',
    badge: 'From the origin',
    tint: '#e6f1f5',
    image: 'img/products/gangotri.svg',
    short: 'From the glacial headwaters, where the river first begins its journey.',
    description: [
      'Gangotri sits high in the Garhwal Himalaya, close to the glacier from which the Bhagirathi — the source stream of the Ganga — emerges.',
      'Because the route is open only part of the year, Gangotri Gangajal is collected in limited batches during the pilgrimage season.'
    ],
    variants: [
      { size: '100 ml', price: 249, mrp: 299 },
      { size: '250 ml', price: 449, mrp: 549 },
      { size: '500 ml', price: 749, mrp: 899 }
    ]
  },
  {
    id: 'pancha-tirtha-set',
    name: 'Pancha Tirtha Gift Set',
    category: 'gift',
    sources: ['gangotri', 'rishikesh', 'haridwar', 'prayagraj', 'kashi'],
    location: 'All five sacred sources',
    badge: 'Gift',
    tint: '#fdf2d6',
    image: 'img/products/pancha-tirtha.svg',
    short: 'Five 50 ml vials — one from each sacred source — in a velvet-lined wooden box.',
    description: [
      'A journey down the Ganga in a single gift: Gangotri, Rishikesh, Haridwar, Prayagraj and Kashi, each in its own labelled vial.',
      'Presented in a velvet-lined wooden keepsake box with a card describing each tirtha. A thoughtful gift for griha pravesh, weddings and festivals.'
    ],
    variants: [
      { size: '5 × 50 ml', price: 799, mrp: 999 }
    ]
  },
  {
    id: 'rishikesh-gangajal',
    name: 'Rishikesh Gangajal',
    category: 'gangajal',
    sources: ['rishikesh'],
    location: 'Triveni Ghat, Rishikesh',
    badge: '',
    tint: '#e7f2ec',
    image: 'img/products/rishikesh.svg',
    short: 'From Triveni Ghat in Rishikesh, where the evening aarti glows on the water.',
    description: [
      'Rishikesh sits where the Ganga flows out of the Himalayan foothills. Triveni Ghat is its busiest and most loved ghat.',
      'Collected at dawn, filtered to remove sediment, and sealed in a tamper-evident bottle.'
    ],
    variants: [
      { size: '100 ml', price: 149, mrp: 179 },
      { size: '250 ml', price: 279, mrp: 329 },
      { size: '500 ml', price: 449, mrp: 549 },
      { size: '1 L', price: 799, mrp: 949 }
    ]
  },
  {
    id: 'prayagraj-gangajal',
    name: 'Triveni Sangam Gangajal',
    category: 'gangajal',
    sources: ['prayagraj'],
    location: 'Triveni Sangam, Prayagraj',
    badge: '',
    tint: '#eeeaf6',
    image: 'img/products/prayagraj.svg',
    short: 'From the Sangam, where the Ganga, Yamuna and Saraswati meet.',
    description: [
      'The Triveni Sangam at Prayagraj is the site of the Kumbh Mela and one of the holiest places in India.',
      'Collected by boat at the confluence, filtered to remove sediment, and sealed at the source.'
    ],
    variants: [
      { size: '100 ml', price: 179, mrp: 219 },
      { size: '250 ml', price: 329, mrp: 399 },
      { size: '500 ml', price: 549, mrp: 649 }
    ]
  },
  {
    id: 'copper-kalash',
    name: 'Copper Kalash with Gangajal',
    category: 'gift',
    sources: ['haridwar'],
    location: 'Har Ki Pauri, Haridwar',
    badge: 'New',
    tint: '#f8eadf',
    image: 'img/products/copper-kalash.svg',
    short: 'A hand-beaten copper kalash, filled with 250 ml of Haridwar Gangajal and sealed.',
    description: [
      'A traditional copper kalash, hand-beaten by artisans, sealed with 250 ml of Gangajal from Har Ki Pauri.',
      'Ready to place on your altar or to give as a gift for griha pravesh, Diwali or a wedding. The kalash can be reused for puja for years.',
      'Shown dressed as a purna kalash; the mango leaves and coconut are not included.'
    ],
    variants: [
      { size: '250 ml', price: 1199, mrp: 1499 }
    ]
  },
  {
    id: 'temple-pack',
    name: 'Temple Pack',
    category: 'bulk',
    sources: ['haridwar'],
    location: 'Har Ki Pauri, Haridwar',
    badge: '',
    tint: '#e3f0f1',
    image: 'img/products/temple-pack.svg',
    short: 'Bulk packs of 100 ml bottles for temples, pujas, events and return gifts.',
    description: [
      'For temples, priests, puja organisers and families planning a big occasion. Each pack contains sealed 100 ml bottles of Haridwar Gangajal.',
      'Ideal as return gifts at weddings, griha pravesh and religious ceremonies.'
    ],
    variants: [
      { size: '12 × 100 ml', price: 1499, mrp: 2148 },
      { size: '24 × 100 ml', price: 2799, mrp: 4296 }
    ]
  }
];

/* ---------- Catalogue helpers ---------- */
HD.getProduct = function (id) {
  return HD.products.find(function (p) { return p.id === id; }) || null;
};

HD.getVariant = function (product, size) {
  if (!product) return null;
  return product.variants.find(function (v) { return v.size === size; }) || null;
};

HD.getSource = function (id) {
  return HD.sources.find(function (s) { return s.id === id; }) || null;
};

HD.minPrice = function (product) {
  return Math.min.apply(null, product.variants.map(function (v) { return v.price; }));
};

var inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
HD.formatINR = function (amount) { return inr.format(amount); };

HD.esc = function (value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
};
