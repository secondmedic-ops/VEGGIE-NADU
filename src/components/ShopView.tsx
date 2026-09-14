import React, { useState, useMemo } from 'react';
import { Product, Category, Language, CartItem } from '../types';
import { translations, formatINR } from '../locales/translations';
import { ProductCard } from './ProductCard';
import { SealDivider } from './SealDivider';
import { 
  Filter, 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  Check, 
  ShoppingBag,
  Leaf
} from 'lucide-react';

interface ShopViewProps {
  products: Product[];
  categories: Category[];
  language: Language;
  cartItems: CartItem[];
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
  onRequestBulkQuote: (product: Product) => void;
  initialCategory?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  categories,
  language,
  cartItems,
  onAddToCart,
  onViewDetails,
  onRequestBulkQuote,
  initialCategory = 'all',
  searchQuery = '',
  onSearchChange
}) => {
  const t = translations[language];

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [includeBulkOnly, setIncludeBulkOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategory !== 'all' && prod.categoryId !== selectedCategory) {
        return false;
      }

      // Stock filter
      if (inStockOnly && (!prod.isAvailable || prod.stock <= 0)) {
        return false;
      }

      // Bulk filter
      if (!includeBulkOnly && prod.isBulkOnly) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchEn = prod.name_en.toLowerCase().includes(query) || prod.description_en.toLowerCase().includes(query);
        const matchTa = prod.name_ta.toLowerCase().includes(query) || prod.description_ta.toLowerCase().includes(query);
        if (!matchEn && !matchTa) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') {
        const nameA = language === 'en' ? a.name_en : a.name_ta;
        const nameB = language === 'en' ? b.name_en : b.name_ta;
        return nameA.localeCompare(nameB);
      }
      // default: featured first, then in stock first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0);
    });
  }, [products, selectedCategory, inStockOnly, includeBulkOnly, searchQuery, sortBy, language]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="font-serif-title font-bold text-3xl sm:text-4xl text-[#14281D]">
          {t.shop}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          {language === 'en'
            ? 'Fresh vegetables, native bananas, traditional appalams, and spice powders sourced directly from Tamil Nadu and local markets.'
            : 'தமிழ்நாட்டிலிருந்து நேரடியாக வரவழைக்கப்பட்ட புதிய காய்கறிகள், பாரம்பரிய வாழைப்பழங்கள் மற்றும் மசாலாக்கள்.'}
        </p>
        <SealDivider icon="leaf" />
      </div>

      {/* Categories Pills Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Filter size={13} className="text-[#1B4332]" />
            <span>{t.exploreCategories}</span>
          </span>
          <span className="text-xs text-gray-500">
            Showing {filteredProducts.length} items
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#1B4332] text-[#FAF8F5] shadow-xs'
                : 'bg-white text-gray-700 border border-[#1B4332]/15 hover:border-[#1B4332]/40'
            }`}
          >
            {t.allCategories}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const label = language === 'en' ? cat.name_en : cat.name_ta;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1B4332] text-[#FAF8F5] shadow-xs'
                    : 'bg-white text-gray-700 border border-[#1B4332]/15 hover:border-[#1B4332]/40'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#1B4332]/12 shadow-2xs">
        {/* Search input in shop */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 text-xs bg-[#FAF8F5] border border-[#1B4332]/15 rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
          {searchQuery && (
            <button
              onClick={() => onSearchChange && onSearchChange('')}
              className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-black cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-[#1B4332] rounded cursor-pointer"
            />
            <span>In stock only</span>
          </label>

          <span className="text-gray-300">|</span>

          <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700">
            <input
              type="checkbox"
              checked={includeBulkOnly}
              onChange={(e) => setIncludeBulkOnly(e.target.checked)}
              className="accent-[#1B4332] rounded cursor-pointer"
            />
            <span>Show bulk catering items</span>
          </label>

          <span className="text-gray-300">|</span>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-gray-700">
            <SlidersHorizontal size={13} />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#FAF8F5] border border-gray-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1B4332] cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#1B4332]/10 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-gray-400 flex items-center justify-center mx-auto">
            <Leaf size={24} />
          </div>
          <h3 className="font-semibold text-gray-700 text-sm">
            No products found matching your search.
          </h3>
          <p className="text-xs text-gray-500">
            Try choosing a different category or clearing search filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setInStockOnly(false);
              setIncludeBulkOnly(true);
              if (onSearchChange) onSearchChange('');
            }}
            className="px-4 py-2 rounded-full bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#2D6A4F] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const currentItem = cartItems.find((ci) => ci.product.id === product.id);
            const currentQty = currentItem ? currentItem.quantity : 0;
            return (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
                onRequestBulkQuote={onRequestBulkQuote}
                currentCartQty={currentQty}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
