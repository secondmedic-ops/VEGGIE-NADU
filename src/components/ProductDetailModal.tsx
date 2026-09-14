import React, { useState } from 'react';
import { Product, Language } from '../types';
import { translations, formatINR } from '../locales/translations';
import { X, ShoppingBag, Plus, Minus, Check, MapPin, Sparkles, ShieldCheck, FileText } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  language: Language;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onRequestBulkQuote?: (product: Product) => void;
  currentCartQty?: number;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  language,
  onClose,
  onAddToCart,
  onRequestBulkQuote,
  currentCartQty = 0
}) => {
  if (!product) return null;

  const t = translations[language];
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [qty, setQty] = useState(currentCartQty > 0 ? currentCartQty : 1);
  const isOutOfStock = !product.isAvailable || product.stock <= 0;
  const isBulk = product.isBulkOnly;

  const primaryName = language === 'en' ? product.name_en : product.name_ta;
  const secondaryName = language === 'en' ? product.name_ta : product.name_en;
  const primaryDesc = language === 'en' ? product.description_en : product.description_ta;
  const origin = language === 'en' ? product.origin_en : product.origin_ta;

  const handleAdd = () => {
    onAddToCart(product, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#1B4332]/20 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header close button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-black transition-colors shadow-sm cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#F4F0E8] border border-[#1B4332]/10 relative">
                <img
                  src={product.images[selectedImgIndex] || product.images[0]}
                  alt={primaryName}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isOutOfStock ? 'grayscale opacity-60' : ''
                  }`}
                />
                {isOutOfStock ? (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-700 text-white shadow-xs">
                    {t.outOfStock}
                  </span>
                ) : isBulk ? (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#D49726] text-[#14281D] shadow-xs">
                    {t.bulkOnly}
                  </span>
                ) : null}
              </div>

              {/* Thumbnails if multiple images */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImgIndex === idx 
                          ? 'border-[#1B4332] shadow-sm' 
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content info */}
            <div className="space-y-4">
              <div>
                <h2 className="font-serif-title font-bold text-2xl text-[#14281D]">
                  {primaryName}
                </h2>
                <div className="text-sm font-semibold text-[#1B4332] mt-0.5">
                  {secondaryName}
                </div>

                {origin && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md mt-2 border border-amber-200">
                    <MapPin size={12} />
                    <span>Harvest Origin: {origin}</span>
                  </div>
                )}
              </div>

              {/* Price & Unit */}
              <div className="p-3.5 rounded-xl bg-[#F4F0E8] border border-[#1B4332]/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-2xl text-[#1B4332]">
                    {formatINR(product.price)}
                  </span>
                  <span className="text-xs text-gray-600 font-medium ml-1">
                    / {product.unit}
                  </span>
                </div>
                <div>
                  {!isOutOfStock ? (
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      {product.stock} {product.unit} available in shop
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-700">
                      {t.outOfStock}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Description
                </h4>
                <p className="text-xs sm:text-sm text-[#14281D]/80 leading-relaxed">
                  {primaryDesc}
                </p>
              </div>

              {/* Key Trust Highlights */}
              <div className="space-y-2 pt-2 border-t border-[#1B4332]/10 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-700 shrink-0" />
                  <span>Fresh daily mandi procurement from Selvaraj store</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-700 shrink-0" />
                  <span>Borzo express door delivery across Navi Mumbai & Mumbai</span>
                </div>
              </div>

              {/* Quantity Selector & Action Button */}
              {!isOutOfStock && !isBulk && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-700">{t.qty}:</span>
                    <div className="flex items-center border border-[#1B4332]/20 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="p-2 text-[#1B4332] hover:bg-[#F4F0E8] transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-sm font-bold text-[#14281D]">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                        className="p-2 text-[#1B4332] hover:bg-[#F4F0E8] transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      Total: {formatINR(product.price * qty)}
                    </span>
                  </div>

                  <button
                    onClick={handleAdd}
                    className="w-full py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FAF8F5] text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    <ShoppingBag size={16} />
                    <span>{t.addToCart} ({formatINR(product.price * qty)})</span>
                  </button>
                </div>
              )}

              {isBulk && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    This item is packaged for high-volume temple pujas, wedding feasts, hotels and canteens. Please submit a wholesale quote request.
                  </p>
                  <button
                    onClick={() => {
                      if (onRequestBulkQuote) onRequestBulkQuote(product);
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#D49726] hover:bg-[#b37d14] text-[#14281D] text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText size={16} />
                    <span>{t.requestQuote}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
