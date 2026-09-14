import React from 'react';
import { Product, Category, Language, CartItem } from '../types';
import { translations, formatINR } from '../locales/translations';
import { VeggieNaduSealLogo } from './VeggieNaduSealLogo';
import { SealDivider } from './SealDivider';
import { ProductCard } from './ProductCard';
import { 
  ArrowRight, 
  ShoppingBag, 
  Leaf, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  FileText,
  CheckCircle2,
  Clock,
  Phone
} from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  categories: Category[];
  language: Language;
  cartItems: CartItem[];
  onSelectTab: (tab: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
  onRequestBulkQuote: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories,
  language,
  cartItems,
  onSelectTab,
  onSelectCategory,
  onAddToCart,
  onViewDetails,
  onRequestBulkQuote
}) => {
  const t = translations[language];

  // Featured produce
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  // Best sellers
  const bestSellers = products.filter(p => !p.isBulkOnly && p.stock > 0).slice(0, 8);

  return (
    <div className="space-y-14 sm:space-y-20 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1B4332] via-[#17382B] to-[#14281D] text-[#FAF8F5] pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D49726]">
        {/* Subtle decorative background botanical lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leaf-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 0 C60 20, 60 60, 40 80 C20 60, 20 20, 40 0 Z" fill="none" stroke="#FAF8F5" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Circular Seal Badge */}
          <div className="flex justify-center">
            <div className="p-2 rounded-full bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 backdrop-blur-xs shadow-lg">
              <VeggieNaduSealLogo size={78} showText={false} />
            </div>
          </div>

          {/* Micro Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D49726]/20 border border-[#D49726]/40 text-[#D49726] text-xs font-bold tracking-wider uppercase">
            <Sparkles size={13} />
            <span>Nerul’s Authentic South Indian Mandi</span>
          </div>

          {/* Tagline Title */}
          <h1 className="font-serif-title font-bold text-3xl sm:text-5xl md:text-6xl text-[#FAF8F5] tracking-tight leading-tight max-w-3xl mx-auto">
            {t.tagline}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-[#FAF8F5]/85 max-w-2xl mx-auto leading-relaxed font-light">
            {t.subTagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => onSelectTab('shop')}
              className="px-7 py-3.5 rounded-full bg-[#D49726] hover:bg-[#b37d14] text-[#14281D] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag size={18} />
              <span>{t.shopNow}</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onSelectTab('bulk')}
              className="px-6 py-3.5 rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] border border-[#FAF8F5]/30 font-semibold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText size={18} className="text-[#D49726]" />
              <span>{t.bulkOrders}</span>
            </button>
          </div>

          {/* Delivery Promise Snippet */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#FAF8F5]/70">
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-[#D49726]" />
              <span>Fast Borzo Delivery in 90 Mins</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Leaf size={14} className="text-[#D49726]" />
              <span>Packed in Fresh Banana Leaves</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#D49726]" />
              <span>Mandi Open 6:00 AM – 10:00 PM</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BROWSER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D49726]">
            Authentic South Indian Staples
          </span>
          <h2 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#14281D]">
            {t.exploreCategories}
          </h2>
          <SealDivider icon="leaf" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            const primaryName = language === 'en' ? cat.name_en : cat.name_ta;
            const secondaryName = language === 'en' ? cat.name_ta : cat.name_en;
            const desc = language === 'en' ? cat.description_en : cat.description_ta;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectTab('shop');
                }}
                className="group relative p-5 rounded-2xl bg-white border border-[#1B4332]/12 hover:border-[#1B4332]/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#1B4332]/10 text-[#1B4332] flex items-center justify-center group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
                    <Leaf size={20} />
                  </div>
                  <h3 className="font-serif-title font-bold text-base sm:text-lg text-[#14281D] group-hover:text-[#1B4332] transition-colors">
                    {primaryName}
                  </h3>
                  <div className="text-xs text-[#D49726] font-semibold">
                    {secondaryName}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 group-hover:text-[#1B4332] font-medium">
                  <span>{count} items</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. TODAY'S FARM FRESH PICKS */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D49726]">
                Picked at Dawn
              </span>
              <h2 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#14281D]">
                {t.featuredProduce}
              </h2>
            </div>

            <button
              onClick={() => onSelectTab('shop')}
              className="text-xs font-bold text-[#1B4332] hover:text-[#2D6A4F] inline-flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <span>View Full Shop</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => {
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
        </section>
      )}

      {/* 4. BULK & CATERING ORDERS PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#FAF8F5] via-[#F4F0E8] to-[#EAE3D2] border-2 border-[#D49726]/40 p-6 sm:p-10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4332] text-[#FAF8F5] text-xs font-bold">
              <FileText size={13} className="text-[#D49726]" />
              <span>For Temples, Canteens & Wedding Feasts</span>
            </div>

            <h3 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#14281D]">
              {t.bulkCateringBannerTitle}
            </h3>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {t.bulkCateringBannerDesc}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-700">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-700" />
                <span>Custom bundles up to 500+ sheets</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-700" />
                <span>Direct mandi wholesale quotes</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-700" />
                <span>Scheduled 5:00 AM delivery</span>
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onSelectTab('bulk')}
              className="px-7 py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FAF8F5] text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{t.requestQuote}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS & PANTRY ESSENTIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D49726]">
              Handpicked Everyday
            </span>
            <h2 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#14281D]">
              {t.bestSellers}
            </h2>
          </div>

          <button
            onClick={() => onSelectTab('shop')}
            className="text-xs font-bold text-[#1B4332] hover:text-[#2D6A4F] inline-flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <span>See All Products</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => {
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
      </section>
    </div>
  );
};
