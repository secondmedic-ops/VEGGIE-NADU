import React, { useState } from 'react';
import { VeggieNaduSealLogo } from './VeggieNaduSealLogo';
import { Language, CartItem } from '../types';
import { translations, formatINR } from '../locales/translations';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  Truck, 
  Store,
  Phone,
  Layers,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  cartItems?: CartItem[];
  cartCount?: number;
  onOpenCart: () => void;
  onOpenAdminModal?: () => void;
  onOpenAdmin?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  activeTab,
  onSelectTab,
  cartItems = [],
  cartCount,
  onOpenCart,
  onOpenAdminModal,
  onOpenAdmin,
  searchQuery,
  onSearchChange
}) => {
  const t = translations[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const cartTotalQty = cartCount !== undefined 
    ? cartCount 
    : safeCartItems.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  const cartSubtotal = safeCartItems.reduce((acc, item) => acc + ((item?.product?.price || 0) * (item?.quantity || 0)), 0);

  const handleAdminClick = () => {
    if (onOpenAdminModal) onOpenAdminModal();
    else if (onOpenAdmin) onOpenAdmin();
  };

  const navLinks = [
    { id: 'home', label: t.home },
    { id: 'shop', label: t.shop },
    { id: 'bulk', label: t.bulkOrders },
    { id: 'track', label: t.trackOrder },
    { id: 'about', label: t.about }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1B4332]/10 transition-colors">
      {/* Top Notification Bar */}
      <div className="bg-[#1B4332] text-[#FAF8F5] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D49726] animate-pulse" />
            <span className="truncate font-medium">
              {language === 'en' 
                ? 'Daily Farm Dispatch: 6:00 AM – 10:00 PM | Free Borzo delivery over ₹499!' 
                : 'தினமும் அதிகாலை புதிய வரவு | ₹499 க்கு மேல் இலவச டெலிவரி!'}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-[11px]">
            <a 
              href="tel:9029186608" 
              className="hidden sm:inline-flex items-center gap-1 hover:text-[#D49726] transition-colors"
            >
              <Phone size={12} />
              <span>9029186608</span>
            </a>
            <span className="hidden sm:inline text-white/40">|</span>
            <button
              onClick={handleAdminClick}
              className="inline-flex items-center gap-1 text-[#D49726] hover:text-white transition-colors font-medium cursor-pointer"
            >
              <ShieldCheck size={13} />
              <span>{t.adminLogin}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div 
          onClick={() => { onSelectTab('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <VeggieNaduSealLogo size={46} />
          <div>
            <div className="font-serif-title font-bold text-xl sm:text-2xl text-[#1B4332] tracking-tight leading-none group-hover:text-[#2D6A4F] transition-colors">
              VEGGIE NADU
            </div>
            <div className="text-[10px] sm:text-xs text-[#1B4332]/75 tracking-wider uppercase font-semibold mt-0.5 hidden xs:block">
              {language === 'en' ? 'Fresh South Indian Produce' : 'தென்னிந்திய பசுமைக் காய்கறிகள்'}
            </div>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== 'shop') onSelectTab('shop');
              }}
              className="w-full bg-[#F4F0E8] border border-[#1B4332]/15 text-[#14281D] placeholder-[#14281D]/50 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 text-[#1B4332]/60" size={16} />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-xs text-gray-500 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Actions & Nav Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle Button */}
          <button
            onClick={onToggleLanguage}
            title="Toggle English / Tamil"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1B4332]/25 hover:border-[#1B4332] bg-[#F4F0E8] text-xs font-semibold text-[#1B4332] transition-colors shadow-xs cursor-pointer"
          >
            <span className="text-sm">🌐</span>
            <span>{t.languageToggle}</span>
          </button>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-full text-[#1B4332] hover:bg-[#F4F0E8] transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            id="header-cart-button"
            className="relative flex items-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FAF8F5] px-3.5 py-2 rounded-full font-medium text-sm transition-all shadow-sm cursor-pointer"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline font-semibold">{formatINR(cartSubtotal)}</span>
            {cartTotalQty > 0 && (
              <span className="bg-[#D49726] text-[#14281D] text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center -ml-0.5">
                {cartTotalQty}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#1B4332] hover:bg-[#F4F0E8] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown Bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#1B4332]/10 bg-[#FAF8F5]">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== 'shop') onSelectTab('shop');
              }}
              autoFocus
              className="w-full bg-[#F4F0E8] border border-[#1B4332]/20 text-[#14281D] text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
            <Search className="absolute left-3.5 top-2.5 text-[#1B4332]/60" size={16} />
          </div>
        </div>
      )}

      {/* Desktop Secondary Link Bar */}
      <div className="hidden lg:block border-t border-[#1B4332]/8 bg-[#FAF8F5]/80">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`text-sm font-medium transition-colors py-1 cursor-pointer relative ${
                    isActive 
                      ? 'text-[#1B4332] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#D49726]' 
                      : 'text-[#14281D]/75 hover:text-[#1B4332]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 text-xs text-[#1B4332]/80">
            <span className="flex items-center gap-1">
              <Truck size={13} className="text-[#D49726]" />
              <span>Borzo Local Express Delivery</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Store size={13} className="text-[#1B4332]" />
              <span>Nerul Shop Open 6 AM</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1B4332]/10 bg-[#FAF8F5] px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left text-sm font-medium cursor-pointer transition-colors ${
                activeTab === link.id
                  ? 'bg-[#1B4332] text-[#FAF8F5]'
                  : 'text-[#14281D] hover:bg-[#F4F0E8]'
              }`}
            >
              <span>{link.label}</span>
              <ChevronRight size={16} className={activeTab === link.id ? 'text-[#D49726]' : 'text-gray-400'} />
            </button>
          ))}

          <div className="pt-3 border-t border-[#1B4332]/10 flex flex-col gap-2">
            <button
              onClick={() => {
                handleAdminClick();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#F4F0E8] border border-[#1B4332]/20 rounded-lg text-xs font-semibold text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-colors cursor-pointer"
            >
              <ShieldCheck size={14} className="text-[#D49726]" />
              <span>{t.adminLogin}</span>
            </button>
            <div className="text-center text-[11px] text-gray-500 pt-1">
              📞 Call: 9029186608 • Nerul, Navi Mumbai
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
