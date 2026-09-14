import React from 'react';
import { Product, Language } from '../types';
import { translations, formatINR } from '../locales/translations';
import { Plus, Minus, ShoppingBag, Eye, AlertCircle, FileText } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  language: Language;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
  onRequestBulkQuote?: (product: Product) => void;
  currentCartQty?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onAddToCart,
  onViewDetails,
  onRequestBulkQuote,
  currentCartQty = 0
}) => {
  const t = translations[language];
  const isOutOfStock = !product.isAvailable || product.stock <= 0;
  const isBulk = product.isBulkOnly;

  const primaryName = language === 'en' ? product.name_en : product.name_ta;
  const secondaryName = language === 'en' ? product.name_ta : product.name_en;
  const primaryDesc = language === 'en' ? product.description_en : product.description_ta;

  return (
    <div className="group relative bg-[#FAF8F5] border border-[#1B4332]/12 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full hover:border-[#1B4332]/35">
      {/* Product Image Container */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative aspect-square w-full bg-[#F4F0E8] overflow-hidden cursor-pointer"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80'}
          alt={primaryName}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {isOutOfStock ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-rose-700 text-white shadow-xs">
              {t.outOfStock}
            </span>
          ) : isBulk ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#D49726] text-[#14281D] shadow-xs">
              {t.bulkOnly}
            </span>
          ) : product.stock < 10 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              Only {product.stock} left
            </span>
          ) : null}

          {product.featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1B4332] text-[#FAF8F5]">
              ★ Farm Fresh
            </span>
          )}
        </div>

        {/* Quick View Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-[#1B4332] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          title="Quick view"
          aria-label="View product details"
        >
          <Eye size={16} />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Titles: Primary + Dual language sub-heading */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-serif-title font-bold text-base sm:text-lg text-[#14281D] line-clamp-1 group-hover:text-[#1B4332] transition-colors cursor-pointer"
          >
            {primaryName}
          </h3>

          <div className="text-xs text-[#1B4332]/70 font-medium line-clamp-1 mt-0.5">
            {secondaryName}
          </div>

          <p className="text-xs text-[#14281D]/70 line-clamp-2 mt-1.5 leading-relaxed">
            {primaryDesc}
          </p>
        </div>

        {/* Price and Unit */}
        <div className="pt-2 border-t border-[#1B4332]/8 flex items-baseline justify-between">
          <div>
            <span className="font-bold text-lg sm:text-xl text-[#1B4332]">
              {formatINR(product.price)}
            </span>
            <span className="text-xs text-gray-500 font-medium ml-1">
              / {product.unit}
            </span>
          </div>

          {!isOutOfStock && !isBulk && (
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              {t.inStock}
            </span>
          )}
        </div>

        {/* Actions Button */}
        <div>
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-2 px-3 rounded-xl bg-gray-200 text-gray-500 text-xs font-semibold cursor-not-allowed text-center"
            >
              {t.outOfStock}
            </button>
          ) : isBulk ? (
            <button
              onClick={() => onRequestBulkQuote ? onRequestBulkQuote(product) : onViewDetails(product)}
              className="w-full py-2 px-3 rounded-xl bg-[#D49726] hover:bg-[#b37d14] text-[#14281D] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileText size={14} />
              <span>{t.requestQuote}</span>
            </button>
          ) : currentCartQty > 0 ? (
            <div className="flex items-center justify-between bg-[#1B4332] text-[#FAF8F5] rounded-xl p-1">
              <button
                onClick={() => onAddToCart(product, currentCartQty - 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold px-2">
                {currentCartQty}
              </span>
              <button
                onClick={() => onAddToCart(product, currentCartQty + 1)}
                disabled={currentCartQty >= product.stock}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 active:bg-white/20 disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product, 1)}
              className="w-full py-2 px-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FAF8F5] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <ShoppingBag size={14} />
              <span>{t.addToCart}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
