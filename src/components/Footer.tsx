import React from 'react';
import { VeggieNaduSealLogo } from './VeggieNaduSealLogo';
import { Language } from '../types';
import { translations } from '../locales/translations';
import { SHOP_CONTACT } from '../data/seedData';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Heart, 
  Leaf,
  CheckCircle2,
  Truck
} from 'lucide-react';

interface FooterProps {
  language: Language;
  onSelectTab: (tab: string) => void;
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onSelectTab,
  onOpenAdminModal
}) => {
  const t = translations[language];

  return (
    <footer className="bg-[#14281D] text-[#FAF8F5] pt-14 pb-8 border-t-4 border-[#D49726]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#FAF8F5]/10">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1B4332]/40 border border-[#FAF8F5]/5">
            <div className="p-2.5 rounded-full bg-[#D49726]/20 text-[#D49726] shrink-0">
              <Leaf size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base text-[#FAF8F5]">
                {t.freshGuarantee}
              </h4>
              <p className="text-xs text-[#FAF8F5]/70 mt-1 leading-relaxed">
                {t.freshGuaranteeDesc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1B4332]/40 border border-[#FAF8F5]/5">
            <div className="p-2.5 rounded-full bg-[#D49726]/20 text-[#D49726] shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base text-[#FAF8F5]">
                {t.ecoPackaging}
              </h4>
              <p className="text-xs text-[#FAF8F5]/70 mt-1 leading-relaxed">
                {t.ecoPackagingDesc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1B4332]/40 border border-[#FAF8F5]/5">
            <div className="p-2.5 rounded-full bg-[#D49726]/20 text-[#D49726] shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base text-[#FAF8F5]">
                {t.fastDelivery}
              </h4>
              <p className="text-xs text-[#FAF8F5]/70 mt-1 leading-relaxed">
                {t.fastDeliveryDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 py-10">
          {/* Shop Branding & About */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <VeggieNaduSealLogo size={56} />
              <div>
                <h3 className="font-serif-title font-bold text-2xl text-[#FAF8F5] tracking-tight">
                  VEGGIE NADU
                </h3>
                <p className="text-xs text-[#D49726] font-medium tracking-wide">
                  {t.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#FAF8F5]/75 leading-relaxed pr-2">
              {t.subTagline}
            </p>

            <div className="pt-2 text-xs text-[#FAF8F5]/60 flex items-center gap-2">
              <span>Managed with love by Selvaraj Family</span>
              <span>•</span>
              <span>Est. in Nerul</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D49726]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/80">
              <li>
                <button 
                  onClick={() => onSelectTab('home')} 
                  className="hover:text-[#D49726] transition-colors cursor-pointer"
                >
                  {t.home}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('shop')} 
                  className="hover:text-[#D49726] transition-colors cursor-pointer"
                >
                  {t.shop}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('bulk')} 
                  className="hover:text-[#D49726] transition-colors cursor-pointer"
                >
                  {t.bulkOrders}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('track')} 
                  className="hover:text-[#D49726] transition-colors cursor-pointer"
                >
                  {t.trackOrder}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('about')} 
                  className="hover:text-[#D49726] transition-colors cursor-pointer"
                >
                  {t.about}
                </button>
              </li>
              <li className="pt-2">
                <button 
                  onClick={onOpenAdminModal} 
                  className="text-[#D49726] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <ShieldCheck size={13} />
                  <span>{t.adminLogin}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D49726]">
              {t.storeDetails}
            </h4>
            <div className="space-y-2.5 text-xs text-[#FAF8F5]/80">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#D49726] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {SHOP_CONTACT.fullAddress}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#D49726] shrink-0" />
                <a 
                  href={`tel:${SHOP_CONTACT.phone}`} 
                  className="hover:text-[#D49726] transition-colors font-medium"
                >
                  {SHOP_CONTACT.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-[#D49726] shrink-0" />
                <span>{SHOP_CONTACT.hours}</span>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D49726]">
                Find Our Shop
              </h4>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(SHOP_CONTACT.fullAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#D49726] hover:underline inline-flex items-center gap-1"
              >
                <span>Open Map</span>
                <ExternalLink size={11} />
              </a>
            </div>

            <div className="w-full h-36 rounded-lg overflow-hidden border border-[#FAF8F5]/20 bg-[#1B4332]/60">
              <iframe
                title="Selvaraj Vegetable and Grocery Shop Map"
                src={SHOP_CONTACT.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(15%) contrast(1.1)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-[10px] text-[#FAF8F5]/60">
              📍 Landmark: Opposite Murugan Temple, Nerul East, Sector 29
            </p>
          </div>
        </div>

        {/* Bottom Bar with Copyright and Payment Badges */}
        <div className="pt-8 mt-6 border-t border-[#FAF8F5]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/60">
          <div>
            © {new Date().getFullYear()} VEGGIE NADU. All Rights Reserved. Greens from Our Shop. Straight to Your Plate.
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[#FAF8F5]/10 border border-[#FAF8F5]/10 font-mono">
              Razorpay Secured
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FAF8F5]/10 border border-[#FAF8F5]/10 font-mono">
              Borzo Express
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FAF8F5]/10 border border-[#FAF8F5]/10 font-mono">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
