import { Category, Product } from '../types';

export const SHOP_CONTACT = {
  name: 'VEGGIE NADU',
  phone: '+91 98765 43210',
  whatsapp: '+919876543210',
  email: 'support@veggienadu.in',
  address: 'Fresh Market Road, Tamil Nadu, India',
  hours: '6:00 AM - 9:00 PM',
  timings: '6:00 AM - 9:00 PM',
  pincodes: ['600001', '600002', '600028', '600040']
};

export const initialCategories: Category[] = [
  { id: 'cat-daily', name: 'Daily Essentials', nameTa: 'தினசரி காய்கறிகள்', icon: 'Sparkles' },
  { id: 'cat-leafy', name: 'Greens & Herbs', nameTa: 'கீரை வகைகள்', icon: 'Leaf' },
  { id: 'cat-gourds', name: 'Gourds & Squash', nameTa: 'காய் வகைகள்', icon: 'Apple' },
  { id: 'cat-roots', name: 'Tubers & Roots', nameTa: 'கிழங்கு வகைகள்', icon: 'Carrot' }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Tomato (Local / Nati)',
    nameTa: 'நாட்டு தக்காளி',
    categoryId: 'cat-daily',
    price: 38,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description: 'Farm-fresh tangy native tomatoes, ideal for rasam, sambar, and everyday curries.',
    stock: 120,
    isOrganic: true,
    isFeatured: true
  },
  {
    id: 'prod-002',
    name: 'Small Onion (Shallots)',
    nameTa: 'சின்ன வெங்காயம்',
    categoryId: 'cat-daily',
    price: 65,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    description: 'Pungent, authentic sambar onions essential for South Indian recipes.',
    stock: 85,
    isOrganic: false,
    isFeatured: true
  },
  {
    id: 'prod-003',
    name: 'Drumstick (Moringa)',
    nameTa: 'முருங்கைக்காய்',
    categoryId: 'cat-daily',
    price: 45,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80',
    description: 'Fresh, tender moringa pods packed with iron and nutrients.',
    stock: 50,
    isOrganic: false,
    isFeatured: true
  },
  {
    id: 'prod-004',
    name: 'Raw Banana (Plantain)',
    nameTa: 'வாழைக்காய்',
    categoryId: 'cat-daily',
    price: 35,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    description: 'Firm green cooking plantains for roasts, bajji, and poriyal.',
    stock: 70,
    isOrganic: false,
    isFeatured: false
  },
  {
    id: 'prod-005',
    name: 'Snake Gourd',
    nameTa: 'புடலங்காய்',
    categoryId: 'cat-gourds',
    price: 40,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=600&q=80',
    description: 'Tender, water-rich gourd suitable for kootu and stir-fry.',
    stock: 40,
    isOrganic: false,
    isFeatured: false
  },
  {
    id: 'prod-006',
    name: 'Palak (Spinach)',
    nameTa: 'பசலைக்கீரை',
    categoryId: 'cat-leafy',
    price: 25,
    unit: 'bunch',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp green broad leaves, washed and bundled fresh.',
    stock: 60,
    isOrganic: true,
    isFeatured: true
  }
];