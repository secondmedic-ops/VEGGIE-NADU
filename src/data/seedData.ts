import { Category, Product } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'cat-bananas',
    name_en: 'Bananas',
    name_ta: 'வாழைப்பழங்கள்',
    slug: 'bananas',
    displayOrder: 1,
    icon: 'banana',
    description_en: 'Fresh native banana varieties directly from South Indian orchards.',
    description_ta: 'தமிழ்நாட்டின் சுவைமிகு பாரம்பரிய வாழைப்பழ வகைகள்.'
  },
  {
    id: 'cat-snacks',
    name_en: 'Ready-to-Cook Snacks',
    name_ta: 'சிற்றுண்டிகள்',
    slug: 'snacks',
    displayOrder: 2,
    icon: 'cookie',
    description_en: 'Authentic coconut-oil fried banana chips, murukku, and snacks.',
    description_ta: 'பாரம்பரிய தேங்காய் எண்ணெய் வாழைக்காய் சிப்ஸ் மற்றும் நொறுக்குத்தீனிகள்.'
  },
  {
    id: 'cat-banana-leaf',
    name_en: 'Banana Leaf & Parts',
    name_ta: 'வாழை இலை & பாகங்கள்',
    slug: 'banana-leaf-parts',
    displayOrder: 3,
    icon: 'leaf',
    description_en: 'Fresh banana feast leaves, fiber-rich banana stem, and banana flower.',
    description_ta: 'விருந்து வாழை இலை, வாழைத்தண்டு மற்றும் வாழைப்பூ.'
  },
  {
    id: 'cat-papad',
    name_en: 'Papad & Appalam',
    name_ta: 'அப்பளம் & வடாம்',
    slug: 'papad',
    displayOrder: 4,
    icon: 'disc',
    description_en: 'Sun-dried traditional urad dal appalams, masala vadams and fryums.',
    description_ta: 'மரபுவழி உளுந்து அப்பளங்கள் மற்றும் சுவையான வடாம்கள்.'
  },
  {
    id: 'cat-spices',
    name_en: 'Masala & Spice Powders',
    name_ta: 'மசாலா & பொடிகள்',
    slug: 'masala-spices',
    displayOrder: 5,
    icon: 'flame',
    description_en: 'Aromatic homemade style Sambar, Rasam, and fresh spice blends.',
    description_ta: 'மணமணக்கும் சாம்பார், ரசம் மற்றும் கைவினை மசாலா பொடிகள்.'
  },
  {
    id: 'cat-aloo-kanda',
    name_en: 'Aloo & Kanda (Onion/Potato)',
    name_ta: 'உருளைக்கிழங்கு & வெங்காயம்',
    slug: 'aloo-kanda',
    displayOrder: 6,
    icon: 'gem',
    description_en: 'Traditional small sambar shallots, Nashik red onions, and fresh potatoes.',
    description_ta: 'நாட்டு சாம்பார் சின்ன வெங்காயம், பெரிய வெங்காயம் மற்றும் உருளைக்கிழங்கு.'
  },
  {
    id: 'cat-rice',
    name_en: 'Rice Varieties',
    name_ta: 'பாரம்பரிய அரிசி',
    slug: 'rice',
    displayOrder: 7,
    icon: 'wheat',
    description_en: 'Nutrient-rich traditional brown rice and premium South Indian grains.',
    description_ta: 'ஆரோக்கியமான கைக்குத்தல் பழுப்பு அரிசி மற்றும் பொன்னி அரிசி.'
  },
  {
    id: 'cat-coconut',
    name_en: 'Coconut & Copra',
    name_ta: 'தேங்காய் & இளநீர்',
    slug: 'coconut',
    displayOrder: 8,
    icon: 'circle',
    description_en: 'Pollachi grade whole coconuts, tender coconuts, and grated coconut.',
    description_ta: 'பொள்ளாச்சி தேங்காய், செவ்விளநீர் மற்றும் தேங்காய்ப்பூ.'
  },
  {
    id: 'cat-more',
    name_en: 'More Fresh Produce',
    name_ta: 'மற்றவை',
    slug: 'more',
    displayOrder: 9,
    icon: 'plus',
    description_en: 'Fresh curry leaves, drumstick, betel leaves, and daily essentials.',
    description_ta: 'கருவேப்பிலை, நாட்டு முருங்கைக்காய், வெற்றிலை மற்றும் பிற பொருட்கள்.'
  }
];

export const initialProducts: Product[] = [
  // 1. Bananas
  {
    id: 'prod-poovan',
    name_en: 'Poovan Banana (Golden Mysore)',
    name_ta: 'பூவன் வாழைப்பழம்',
    categoryId: 'cat-bananas',
    description_en: 'Slightly tangy and honey-sweet native variety, renowned for aiding digestion.',
    description_ta: 'சிறிய புளிப்பு மற்றும் அரிய இனிப்பு சுவை கொண்ட பாரம்பரிய பூவன் பழம்.',
    price: 65,
    unit: 'kg',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543218024-57a70143c369?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true,
    origin_en: 'Erode, Tamil Nadu',
    origin_ta: 'ஈரோடு, தமிழ்நாடு'
  },
  {
    id: 'prod-nendran',
    name_en: 'Kerala Nendran Raw & Ripe Banana',
    name_ta: 'நேந்திரன் வாழைப்பழம்',
    categoryId: 'cat-bananas',
    description_en: 'Dense, rich king of bananas. Ideal for steaming or making authentic banana chips.',
    description_ta: 'நேந்திரன் பழம். சுவைக்க அல்லது வறுவல் சிப்ஸ் செய்ய சிறந்தது.',
    price: 90,
    unit: 'kg',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true,
    origin_en: 'Kanyakumari, Tamil Nadu',
    origin_ta: 'கன்னியாகுமரி, தமிழ்நாடு'
  },
  {
    id: 'prod-sevvazhai',
    name_en: 'Sevvazhai (Red Banana)',
    name_ta: 'செவ்வாழைப்பழம்',
    categoryId: 'cat-bananas',
    description_en: 'High antioxidant superfood with rich creamy berry undertone and immune benefits.',
    description_ta: 'வைட்டமின் சி மற்றும் ஊட்டச்சத்துக்கள் நிறைந்த சத்தான செவ்வாழை.',
    price: 130,
    unit: 'kg',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true,
    origin_en: 'Theni, Tamil Nadu',
    origin_ta: 'தேனி, தமிழ்நாடு'
  },
  {
    id: 'prod-yelakki',
    name_en: 'Yelakki / Elakkibale Banana',
    name_ta: 'ஏலக்கி வாழைப்பழம்',
    categoryId: 'cat-bananas',
    description_en: 'Petite, fragrance-rich baby banana loved by kids and elders alike.',
    description_ta: 'மென்மையான இனிப்பு மணம் கொண்ட சிறிய ஏலக்கி பழம்.',
    price: 85,
    unit: 'kg',
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1566393028639-d108a42c46a7?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },

  // 2. Ready-to-Cook Snacks
  {
    id: 'prod-chips-salted',
    name_en: 'Classic Coconut Oil Nendran Chips (Salted)',
    name_ta: 'தேங்காய் எண்ணெய் நேந்திரன் சிப்ஸ் (உப்பு)',
    categoryId: 'cat-snacks',
    description_en: 'Thin crisp raw banana slices deep-fried in 100% pure cold-pressed coconut oil.',
    description_ta: 'சுத்தமான தேங்காய் எண்ணெயில் வறுத்த நறுமணமிக்க வாழைக்காய் சிப்ஸ்.',
    price: 120,
    unit: 'packet',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true
  },
  {
    id: 'prod-chips-masala',
    name_en: 'Spicy Masala Banana Chips',
    name_ta: 'கார மசாலா வாழைக்காய் சிப்ஸ்',
    categoryId: 'cat-snacks',
    description_en: 'Crispy banana chips tossed in South Indian crushed red chilli and pepper spice blend.',
    description_ta: 'காரசாரமான மிளகாய் மசாலா தூவப்பட்ட மொறுமொறுப்பான சிப்ஸ்.',
    price: 130,
    unit: 'packet',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1621996346565-e3d5d628165b?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },
  {
    id: 'prod-sweet-upperi',
    name_en: 'Sharkara Upperi (Sweet Jaggery Banana Chips)',
    name_ta: 'சர்க்கரை வரட்டி / உப்பேரி',
    categoryId: 'cat-snacks',
    description_en: 'Thick chunky plantain cuts coated in caramelized jaggery, dried ginger & cardamom.',
    description_ta: 'நாட்டு வெல்லம், சுக்கு, ஏலக்காய் தோய்த்த பாரம்பரிய இனிப்பு உப்பேரி.',
    price: 145,
    unit: 'packet',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },

  // 3. Banana Leaf & Parts
  {
    id: 'prod-banana-leaf-bundle',
    name_en: 'Fresh Banana Leaves for Dining (5 Sheets)',
    name_ta: 'தலைவாழை இலை கட்டு (5 இலைகள்)',
    categoryId: 'cat-banana-leaf',
    description_en: 'Lush green full-size dining banana leaves, perfect for authentic South Indian meals.',
    description_ta: 'பாரம்பரிய விருந்து சாப்பாட்டிற்கான புதிய தலைவாழை இலைகள்.',
    price: 45,
    unit: 'bunch',
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true
  },
  {
    id: 'prod-banana-leaf-bulk',
    name_en: 'Catering Feast Banana Leaves (Bulk 200 Sheets)',
    name_ta: 'மொத்த விசேஷ வாழை இலைகள் (200 இலைகள்)',
    categoryId: 'cat-banana-leaf',
    description_en: 'Direct harvest banana leaves bundle for weddings, temple pujas, and restaurants.',
    description_ta: 'திருமணம், கோவில் மற்றும் அன்னதானத்திற்கான மொத்த வாழை இலை கட்டு.',
    price: 1400,
    unit: 'bunch',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: true,
    featured: false
  },
  {
    id: 'prod-vazhaithandu',
    name_en: 'Fresh Banana Stem (Vazhaithandu)',
    name_ta: 'நாட்டு வாழைத்தண்டு',
    categoryId: 'cat-banana-leaf',
    description_en: 'Crunchy fiber-rich stem excellent for weight wellness, detox juice, and traditional kootu.',
    description_ta: 'சிறுநீரக ஆரோக்கியத்திற்கும் உடல் நச்சுக்களை நீக்கவும் உதவும் வாழைத்தண்டு.',
    price: 35,
    unit: 'piece',
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true
  },
  {
    id: 'prod-vazhaipoo',
    name_en: 'Fresh Banana Flower (Vazhaipoo)',
    name_ta: 'புதிய வாழைப்பூ',
    categoryId: 'cat-banana-leaf',
    description_en: 'Freshly cut banana blossom. Perfect for crispy vazhaipoo vadai and usili.',
    description_ta: 'சுவையான மொறுமொறு வாழைப்பூ வடை மற்றும் உசிலி செய்ய ஏற்ற புதிய வாழைப்பூ.',
    price: 40,
    unit: 'piece',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },

  // 4. Papad
  {
    id: 'prod-madurai-appalam',
    name_en: 'Madurai Sun-Dried Urad Appalam (200g)',
    name_ta: 'மதுரை பாரம்பரிய உளுந்து அப்பளம் (200g)',
    categoryId: 'cat-papad',
    description_en: 'Crunchy traditional appalam crafted from pure urad dal and seasoned with asafoetida.',
    description_ta: 'பெருங்காயம் கலந்த மதுரை கைவினை மொறுமொறு அப்பளம்.',
    price: 55,
    unit: 'packet',
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true
  },
  {
    id: 'prod-pepper-appalam',
    name_en: 'Crushed Pepper & Cumin Appalam (200g)',
    name_ta: 'மிளகு சீரக அப்பளம் (200g)',
    categoryId: 'cat-papad',
    description_en: 'Zesty spiced papad infused with whole black pepper corns and roasted cumin seeds.',
    description_ta: 'கருப்பு மிளகு மற்றும் சீரக மணம் கொண்ட கார அப்பளம்.',
    price: 65,
    unit: 'packet',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },

  // 5. Masala & Spice Powders
  {
    id: 'prod-sambar-powder',
    name_en: 'Traditional Chettinad Sambar Powder (250g)',
    name_ta: 'செட்டிநாடு சாம்பார் பொடி (250g)',
    categoryId: 'cat-spices',
    description_en: 'Stone-ground aromatic blend with coriander seeds, fenugreek, red chillies and lentils.',
    description_ta: 'கைமுறை வறுத்து அரைத்த மணமணக்கும் பாரம்பரிய செட்டிநாடு சாம்பார் பொடி.',
    price: 95,
    unit: 'packet',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true
  },
  {
    id: 'prod-rasam-powder',
    name_en: 'Heritage Pepper Cumin Rasam Powder (250g)',
    name_ta: 'நாட்டு மிளகு ரசப் பொடி (250g)',
    categoryId: 'cat-spices',
    description_en: 'Comforting, digestion-friendly rasam blend packed with Malabar pepper and roasted cumin.',
    description_ta: 'அஜீரணம் நீக்கும் நறுமணமிக்க நாட்டு மிளகு சீரக ரசப் பொடி.',
    price: 90,
    unit: 'packet',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },
  {
    id: 'prod-erode-turmeric',
    name_en: 'Pure Erode Turmeric Powder (200g)',
    name_ta: 'ஈரோடு சுத்தமான மஞ்சள் தூள் (200g)',
    categoryId: 'cat-spices',
    description_en: 'High-curcumin golden yellow turmeric straight from Erode farms, 100% adulterant-free.',
    description_ta: 'ஈரோட்டின் உயர்தர இயற்கை மஞ்சள் தூள், கலப்படமற்ற பொன் நிறம்.',
    price: 60,
    unit: 'packet',
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },
  {
    id: 'prod-guntur-chilli',
    name_en: 'Guntur Sun-Dried Red Chilli Powder (250g)',
    name_ta: 'குண்டூர் மிளகாய் தூள் (250g)',
    categoryId: 'cat-spices',
    description_en: 'Deep crimson red colour with punchy heat for authentic South Indian curries.',
    description_ta: 'அடர்ந்த சிவப்பு நிறம் மற்றும் சுவையான காரம் தரும் மிளகாய் தூள்.',
    price: 85,
    unit: 'packet',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1599909624555-9b291c136367?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },

  // 6. Aloo Kanda
  {
    id: 'prod-chinna-vengayam',
    name_en: 'Country Small Onions / Shallots (Chinna Vengayam)',
    name_ta: 'நாட்டு சின்ன வெங்காயம் (சாம்பார் வெங்காயம்)',
    categoryId: 'cat-aloo-kanda',
    description_en: 'Essential for soul-satisfying Tamil sambar, vatha kuzhambu, and shallot chutney.',
    description_ta: 'வத்தக்குழம்பு மற்றும் சாம்பாரின் சுவைக்கு இன்றியமையாத நாட்டு சின்ன வெங்காயம்.',
    price: 75,
    unit: 'kg',
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true
  },
  {
    id: 'prod-red-onions',
    name_en: 'Fresh Red Onions (Periya Vengayam)',
    name_ta: 'பெரிய வெங்காயம் (Nashik Red)',
    categoryId: 'cat-aloo-kanda',
    description_en: 'Firm, juicy red onions for daily curries, biryani, and salads.',
    description_ta: 'அன்றாட சமையலுக்கு பயன்படும் தரமான பெரிய வெங்காயம்.',
    price: 38,
    unit: 'kg',
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },
  {
    id: 'prod-potatoes',
    name_en: 'Fresh Farm Potatoes (Urulaikizhangu)',
    name_ta: 'உருளைக்கிழங்கு (Aloo)',
    categoryId: 'cat-aloo-kanda',
    description_en: 'Golden thin-skin potatoes, perfect for potato roast (poriyal) or masala dosa filling.',
    description_ta: 'மசால் தோசை மற்றும் உருளைக்கிழங்கு வறுவலுக்கு சிறந்த புதிய கிழங்கு.',
    price: 34,
    unit: 'kg',
    stock: 110,
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },

  // 7. Rice
  {
    id: 'prod-brown-rice',
    name_en: 'Traditional Unpolished Brown Rice (1kg)',
    name_ta: 'கைக்குத்தல் பழுப்பு அரிசி (1kg)',
    categoryId: 'cat-rice',
    description_en: 'Wholesome bran-rich brown rice with nutty aroma and balanced glycemic index.',
    description_ta: 'இயற்கை தவிடு நீக்கப்படாத சத்தான பழுப்பு அரிசி.',
    price: 95,
    unit: 'kg',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true
  },
  {
    id: 'prod-matta-rice',
    name_en: 'Palakkadan Matta Red Rice (1kg)',
    name_ta: 'கேரளா பாலக்காடன் மட்ட அரிசி (1kg)',
    categoryId: 'cat-rice',
    description_en: 'Hearty Kerala red parboiled rice, rich in magnesium and minerals.',
    description_ta: 'அடர்ந்த சுவை கொண்ட பாரம்பரிய மட்ட அரிசி.',
    price: 88,
    unit: 'kg',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },

  // 8. Coconut
  {
    id: 'prod-pollachi-coconut',
    name_en: 'Pollachi Matured Whole Coconut',
    name_ta: 'பொள்ளாச்சி முழு நாட்டுத் தேங்காய்',
    categoryId: 'cat-coconut',
    description_en: 'Heavy, sweet water-rich coconut with thick white meat for authentic chutney and oil.',
    description_ta: 'அடர்ந்த தேங்காய்ப்பருப்பு மற்றும் இனிப்பு நீர் கொண்ட பொள்ளாச்சி தேங்காய்.',
    price: 42,
    unit: 'piece',
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true
  },
  {
    id: 'prod-tender-coconut',
    name_en: 'Fresh Tender Coconut (Elaneer)',
    name_ta: 'செவ்விளநீர் / புதிய இளநீர்',
    categoryId: 'cat-coconut',
    description_en: 'Refreshing, electrolyte-packed tender coconut with sweet water and tender malai.',
    description_ta: 'உடலுக்கு குளிர்ச்சி தரும் இனிமையான இயற்கை இளநீர்.',
    price: 60,
    unit: 'piece',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: false
  },

  // 9. More
  {
    id: 'prod-curry-leaves',
    name_en: 'Fresh Country Curry Leaves (Karuveppilai 100g)',
    name_ta: 'நாட்டு கருவேப்பிலை கட்டு (100g)',
    categoryId: 'cat-more',
    description_en: 'Intensely fragrant dark green curry leaves picked fresh every single dawn.',
    description_ta: 'அதிகாலை பறிக்கப்பட்ட நறுமணமிக்க புதிய நாட்டு கருவேப்பிலை.',
    price: 15,
    unit: 'bunch',
    stock: 90,
    images: [
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true
  },
  {
    id: 'prod-drumstick',
    name_en: 'Native Tender Drumstick (Murungakkai)',
    name_ta: 'நாட்டு முருங்கைக்காய் (2 துண்டுகள்)',
    categoryId: 'cat-more',
    description_en: 'Meaty, aromatic drumsticks for finger-licking sambar and poriyal.',
    description_ta: 'சாம்பாரின் ருசியை பன்மடங்கு உயர்த்தும் சதைப்பற்றுள்ள முருங்கைக்காய்.',
    price: 30,
    unit: 'piece',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=800&auto=format&fit=crop&q=80'
    ],
    isAvailable: true,
    isBulkOnly: false,
    featured: true
  }
];

export const SHOP_CONTACT = {
  name: 'VEGGIE NADU (Selvaraj Vegetable & Grocery Shop)',
  shortAddress: 'Nerul East, Sector 29, Navi Mumbai',
  fullAddress: 'Selvaraj Vegetable & Grocery Shop, 3rd, near bus depot, opposite Murugan Temple, Nerul East, Sector 29, Nerul, Navi Mumbai, Maharashtra 400706',
  phone: '9029186608',
  phoneDisplay: '+91 90291 86608',
  hours: 'Everyday: 6:00 AM – 10:00 PM',
  mapQuery: 'Selvaraj Vegetable & Grocery Shop Nerul Navi Mumbai',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Selvaraj+Vegetable+Grocery+Shop+Nerul+Navi+Mumbai&t=&z=15&ie=UTF8&iwloc=&output=embed'
};
