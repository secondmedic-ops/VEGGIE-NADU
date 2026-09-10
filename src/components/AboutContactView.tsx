import React from 'react';
import { Language } from '../types';
import { translations } from '../locales/translations';
import { SHOP_CONTACT } from '../data/seedData';
import { VeggieNaduSealLogo } from './VeggieNaduSealLogo';
import { SealDivider } from './SealDivider';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  Truck,
  Heart
} from 'lucide-react';

interface AboutContactViewProps {
  language: Language;
}

export const AboutContactView: React.FC<AboutContactViewProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero / Story Banner */}
      <div className="bg-white border border-[#1B4332]/15 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <VeggieNaduSealLogo size={80} showText={false} />
          </div>
          <h1 className="font-serif-title font-bold text-3xl sm:text-4xl text-[#14281D]">
            {t.shopStoryTitle}
          </h1>
          <p className="text-sm font-semibold text-[#D49726] tracking-wide uppercase">
            {t.tagline}
          </p>
          <SealDivider icon="leaf" />
        </div>

        <div className="max-w-3xl mx-auto space-y-5 text-sm sm:text-base text-gray-700 leading-relaxed">
          <p>
            {t.shopStoryP1}
          </p>
          <p>
            {t.shopStoryP2}
          </p>
          <p>
            {language === 'en'
              ? 'Whether you are cooking a feast for Diwali, preparing a traditional Sunday lunch on fresh banana leaves, or simply need genuine Chettinad sambar masala and freshly grated coconut, Selvaraj and our dedicated team ensure only the freshest picks leave our Nerul shop.'
              : 'தீபாவளி, பொங்கல் விருந்து சாப்பாட்டிற்கான தலைவாழை இலைகள் முதல் மணமணக்கும் செட்டிநாடு சாம்பார் பொடி வரை அனைத்தும் எங்கள் நேருல் கடையிலிருந்து தரமாக அனுப்பி வைக்கப்படுகிறது.'}
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#1B4332]/10 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center mx-auto">
              <Leaf size={20} />
            </div>
            <h3 className="font-bold text-sm text-[#14281D]">
              Direct From Tamil Farms
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Native produce harvested from partner growers in Pollachi, Erode, Theni & Madurai.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#1B4332]/10 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center mx-auto">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-sm text-[#14281D]">
              Traditional Eco Packing
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Greens bundled gently in moist plantain sheets to retain natural moisture and crispness.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#1B4332]/10 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center mx-auto">
              <Truck size={20} />
            </div>
            <h3 className="font-bold text-sm text-[#14281D]">
              Fast Local Delivery
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Powered by Borzo delivery network for doorstep drop-off across Navi Mumbai & Mumbai.
            </p>
          </div>
        </div>
      </div>

      {/* Location, Contact & Map Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-white border border-[#1B4332]/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D49726]">
                Visit Us in Person
              </span>
              <h2 className="font-serif-title font-bold text-2xl text-[#14281D] mt-1">
                Selvaraj Vegetable & Grocery Shop
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#1B4332] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Store Address:</strong><br />
                  {SHOP_CONTACT.fullAddress}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={20} className="text-[#1B4332] shrink-0" />
                <div>
                  <strong>Phone / WhatsApp:</strong><br />
                  <a href={`tel:${SHOP_CONTACT.phone}`} className="text-[#1B4332] font-bold hover:underline">
                    {SHOP_CONTACT.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={20} className="text-[#1B4332] shrink-0" />
                <div>
                  <strong>Shop Hours:</strong><br />
                  <span>{SHOP_CONTACT.hours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(SHOP_CONTACT.fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>{t.getDirections}</span>
              <ExternalLink size={14} />
            </a>
            <a
              href={`tel:${SHOP_CONTACT.phone}`}
              className="py-3 px-4 rounded-xl bg-[#FAF8F5] border border-[#1B4332]/25 hover:bg-[#F4F0E8] text-[#1B4332] text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={14} />
              <span>Call Shop</span>
            </a>
          </div>
        </div>

        {/* Embedded Google Map */}
        <div className="lg:col-span-7 bg-white border border-[#1B4332]/15 rounded-3xl p-3 shadow-xs overflow-hidden min-h-[360px] flex flex-col">
          <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200">
            <iframe
              title="Veggie Nadu Store Google Map"
              src={SHOP_CONTACT.mapEmbedUrl}
              width="100%"
              height="100%"
              className="w-full h-full min-h-[340px]"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
