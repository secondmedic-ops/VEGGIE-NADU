import React, { useState } from 'react';
import { Language, BulkRequest } from '../types';
import { translations } from '../locales/translations';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  Building2, 
  Calendar, 
  Phone, 
  User, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  ShoppingBag,
  Send,
  Leaf
} from 'lucide-react';
import { SealDivider } from './SealDivider';

interface BulkQuoteViewProps {
  language: Language;
  prefillItem?: string;
}

export const BulkQuoteView: React.FC<BulkQuoteViewProps> = ({ language, prefillItem }) => {
  const t = translations[language];

  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [itemsNeeded, setItemsNeeded] = useState(prefillItem ? `1x ${prefillItem}` : '');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [deliveryByDate, setDeliveryByDate] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<BulkRequest | null>(null);

  const quickItems = [
    '500 Banana Feast Leaves (Virundhu ilai)',
    '50 kg Country Sambar Onions (Shallots)',
    '40 kg Farm Fresh Potatoes',
    '100 Pollachi Coconuts',
    '10 kg Fresh Vazhaithandu (Banana Stem)',
    '25 kg Fresh Nendran Bananas for Chips',
    '10 kg Madurai Appalam (50 pkts)'
  ];

  const handleAddQuickItem = (itemStr: string) => {
    setItemsNeeded((prev) => (prev ? `${prev}, ${itemStr}` : itemStr));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestId = `bulk_${Date.now()}`;
      const newRequest: BulkRequest = {
        id: requestId,
        businessName,
        contactPerson,
        phone,
        email,
        itemsNeeded,
        estimatedQuantity,
        deliveryByDate,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'bulk_requests', requestId), newRequest);
      } catch (err) {
        console.warn('[Veggie Nadu] Bulk quote stored in fallback:', err);
      }

      setSubmittedRequest(newRequest);
    } catch (error) {
      console.error('Error submitting bulk quote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D49726]/20 text-[#1B4332] text-xs font-bold border border-[#D49726]/40">
          <Sparkles size={14} className="text-[#D49726]" />
          <span>Wholesale Mandi Rates • Direct Farm Dispatch</span>
        </div>

        <h1 className="font-serif-title font-bold text-3xl sm:text-4xl text-[#14281D]">
          {t.bulkQuoteTitle}
        </h1>

        <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto leading-relaxed">
          {t.bulkQuoteSubtitle}
        </p>

        <SealDivider icon="leaf" />
      </div>

      {submittedRequest ? (
        /* Success Screen */
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#1B4332]/20 shadow-md text-center space-y-5 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <h2 className="font-serif-title font-bold text-2xl text-[#14281D]">
            {t.quoteSuccessTitle}
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {t.quoteSuccessDesc}
          </p>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#1B4332]/10 text-left text-xs space-y-2">
            <div><strong>Organization / Client:</strong> {submittedRequest.businessName}</div>
            <div><strong>Contact Person:</strong> {submittedRequest.contactPerson} ({submittedRequest.phone})</div>
            <div><strong>Items:</strong> {submittedRequest.itemsNeeded}</div>
            <div><strong>Required Date:</strong> {submittedRequest.deliveryByDate}</div>
            <div><strong>Status:</strong> <span className="text-amber-700 font-bold uppercase">Pending Review by Order Team</span></div>
          </div>

          <button
            onClick={() => {
              setSubmittedRequest(null);
              setBusinessName('');
              setItemsNeeded('');
              setEstimatedQuantity('');
            }}
            className="px-6 py-2.5 rounded-full bg-[#1B4332] text-white text-xs font-bold hover:bg-[#2D6A4F] transition-colors cursor-pointer"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        /* The Form */
        <div className="bg-white border border-[#1B4332]/15 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#1B4332]" />
                  <span>{t.businessName} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Murugan Temple Canteen / Sai Caterers"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <User size={14} className="text-[#1B4332]" />
                  <span>{t.contactPerson} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. K. Selvam"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Phone size={14} className="text-[#1B4332]" />
                  <span>{t.phoneNumber} *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9820154321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
                />
              </div>

              {/* Delivery By Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#1B4332]" />
                  <span>{t.deliveryByDateLabel} *</span>
                </label>
                <input
                  type="date"
                  required
                  value={deliveryByDate}
                  onChange={(e) => setDeliveryByDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Click Common Bulk Items */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-500">Quick add items:</span>
              <div className="flex flex-wrap gap-2">
                {quickItems.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddQuickItem(item)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[#F4F0E8] hover:bg-[#1B4332] hover:text-white text-[#1B4332] border border-[#1B4332]/15 transition-colors cursor-pointer"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Needed (Free Text) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                <FileText size={14} className="text-[#1B4332]" />
                <span>{t.itemsNeededLabel} *</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="List required items: e.g. 500 Banana Feast Leaves, 40 kg Sambar Onions, 30 kg Potatoes, 5 kg Curry Leaves..."
                value={itemsNeeded}
                onChange={(e) => setItemsNeeded(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
              />
            </div>

            {/* Estimated Quantity / Headcount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  {t.estimatedQuantityLabel}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 350 guests / 150 kg total"
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Email / Alternate Contact (Optional)
                </label>
                <input
                  type="email"
                  placeholder="orders@canteen.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                {t.additionalNotes}
              </label>
              <input
                type="text"
                placeholder="e.g. Morning 5:00 AM delivery needed before puja start"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FAF8F5] font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send size={16} />
              <span>{isSubmitting ? 'Submitting Quote Request...' : t.submitQuoteRequest}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
