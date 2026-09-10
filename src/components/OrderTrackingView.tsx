import React, { useState, useEffect } from 'react';
import { Order, Language, OrderStatus } from '../types';
import { translations, formatINR } from '../locales/translations';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  XCircle,
  Bike
} from 'lucide-react';
import { SealDivider } from './SealDivider';

interface OrderTrackingViewProps {
  language: Language;
  prefillOrderNumber?: string;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  language,
  prefillOrderNumber = ''
}) => {
  const t = translations[language];

  const [phone, setPhone] = useState('');
  const [orderIdInput, setOrderIdInput] = useState(prefillOrderNumber);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderIdInput.trim() && !phone.trim()) return;

    setIsSearching(true);
    setSearched(true);
    setMatchedOrder(null);

    try {
      // Normalize order ID input: clean prefix or trim
      const cleanOrderId = orderIdInput.trim();
      const cleanPhone = phone.trim().replace(/\D/g, '');

      // First try direct doc get if it matches an order doc ID
      if (cleanOrderId) {
        try {
          const docRef = doc(db, 'orders', cleanOrderId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setMatchedOrder(snap.data() as Order);
            setIsSearching(false);
            return;
          }
        } catch (e) {
          // ignore and query
        }

        // Try querying by orderNumber
        const numToSearch = cleanOrderId.startsWith('#') ? cleanOrderId.slice(1) : cleanOrderId;
        const q = query(
          collection(db, 'orders'),
          where('orderNumber', '==', numToSearch)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setMatchedOrder(snapshot.docs[0].data() as Order);
          setIsSearching(false);
          return;
        }
      }

      // Try searching by phone number
      if (cleanPhone) {
        const qPhone = query(
          collection(db, 'orders'),
          where('customerPhone', '==', cleanPhone)
        );
        const snapshotPhone = await getDocs(qPhone);
        if (!snapshotPhone.empty) {
          // Take most recent
          const list = snapshotPhone.docs.map(d => d.data() as Order);
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setMatchedOrder(list[0]);
          setIsSearching(false);
          return;
        }
      }
    } catch (err) {
      console.error('Error tracking order:', err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (prefillOrderNumber) {
      setOrderIdInput(prefillOrderNumber);
      handleSearch();
    }
  }, [prefillOrderNumber]);

  const stages: { key: OrderStatus; label: string; icon: any }[] = [
    { key: 'placed', label: t.statusPlaced, icon: Clock },
    { key: 'packed', label: t.statusPacked, icon: Package },
    { key: 'courier_assigned', label: t.statusCourierAssigned, icon: Bike },
    { key: 'out_for_delivery', label: t.statusOutForDelivery, icon: Truck },
    { key: 'delivered', label: t.statusDelivered, icon: CheckCircle }
  ];

  const getStageIndex = (status: OrderStatus): number => {
    if (status === 'cancelled') return -1;
    return stages.findIndex(s => s.key === status);
  };

  const currentStageIndex = matchedOrder ? getStageIndex(matchedOrder.orderStatus) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold">
          <Truck size={14} className="text-[#D49726]" />
          <span>Live Borzo Express Tracking</span>
        </div>

        <h1 className="font-serif-title font-bold text-3xl sm:text-4xl text-[#14281D]">
          {t.orderStatusTitle}
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          {t.orderStatusDesc}
        </p>

        <SealDivider icon="seal" />
      </div>

      {/* Lookup Card */}
      <div className="bg-white border border-[#1B4332]/15 rounded-2xl p-5 sm:p-6 shadow-xs mt-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
              {t.enterPhone}
            </label>
            <input
              type="tel"
              placeholder="e.g. 9820154321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
              {t.enterOrderId}
            </label>
            <input
              type="text"
              placeholder="e.g. VN-123456"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Search size={14} />
              <span>{isSearching ? '...' : t.checkStatus}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && !matchedOrder && !isSearching && (
        <div className="mt-8 p-6 rounded-2xl bg-white border border-rose-200 text-center space-y-3">
          <AlertCircle size={32} className="mx-auto text-rose-500" />
          <h3 className="font-semibold text-gray-800 text-sm">
            {t.orderNotFound}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Please make sure you entered the correct 10-digit phone number or the Order ID sent during checkout.
          </p>
        </div>
      )}

      {matchedOrder && (
        <div className="mt-8 space-y-6">
          {/* Order Header Summary */}
          <div className="bg-white border border-[#1B4332]/20 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order Number
                </span>
                <div className="font-serif-title font-bold text-xl text-[#1B4332]">
                  #{matchedOrder.orderNumber}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Placed on {new Date(matchedOrder.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  matchedOrder.orderStatus === 'delivered' 
                    ? 'bg-emerald-100 text-emerald-800'
                    : matchedOrder.orderStatus === 'cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-[#D49726]/20 text-[#14281D]'
                }`}>
                  {matchedOrder.orderStatus.replace('_', ' ')}
                </span>
                <div className="text-xs font-bold text-gray-700 mt-1">
                  Total: {formatINR(matchedOrder.total)}
                </div>
              </div>
            </div>

            {/* Stepper Progression */}
            {matchedOrder.orderStatus !== 'cancelled' ? (
              <div className="py-2">
                <div className="relative flex items-center justify-between">
                  {/* Background Track Line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-gray-200 z-0" />
                  {/* Completed Track Line */}
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1B4332] z-0 transition-all duration-500"
                    style={{ width: `${Math.max(0, (currentStageIndex / (stages.length - 1)) * 100)}%` }}
                  />

                  {stages.map((stg, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const IconComp = stg.icon;

                    return (
                      <div key={stg.key} className="relative z-10 flex flex-col items-center">
                        <div 
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-[#1B4332] text-[#FAF8F5] shadow-xs'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-[#D49726]/40 scale-110' : ''}`}
                        >
                          <IconComp size={16} />
                        </div>
                        <span className={`text-[10px] sm:text-xs mt-2 text-center font-medium max-w-[65px] sm:max-w-none leading-tight ${
                          isCompleted ? 'text-[#14281D] font-bold' : 'text-gray-400'
                        }`}>
                          {stg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
                <XCircle size={18} />
                <span>This order was cancelled. If you have questions, please call our store at 9029186608.</span>
              </div>
            )}

            {/* Courier Tracking Section */}
            {matchedOrder.borzoOrderId && (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#1B4332]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1B4332] uppercase tracking-wide">
                    <Truck size={16} className="text-[#D49726]" />
                    <span>Borzo Delivery Courier</span>
                  </div>
                  {matchedOrder.borzoTrackingUrl && (
                    <a
                      href={matchedOrder.borzoTrackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#1B4332] hover:text-[#2D6A4F] font-bold inline-flex items-center gap-1 hover:underline"
                    >
                      <span>{t.trackLiveBorzo}</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
                  <div>
                    <span className="text-gray-400">Assigned Partner:</span>{' '}
                    <strong className="text-gray-900">{matchedOrder.courierName || 'Borzo Rider'}</strong>
                  </div>
                  {matchedOrder.courierPhone && (
                    <div>
                      <span className="text-gray-400">Rider Contact:</span>{' '}
                      <a href={`tel:${matchedOrder.courierPhone}`} className="text-[#1B4332] font-semibold hover:underline">
                        {matchedOrder.courierPhone}
                      </a>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Borzo Order ID:</span>{' '}
                    <span className="font-mono">{matchedOrder.borzoOrderId}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Address & Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 text-xs border-t border-gray-100">
              <div className="space-y-1.5">
                <h4 className="font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <MapPin size={13} />
                  <span>Delivery Address</span>
                </h4>
                <p className="text-gray-800 leading-relaxed">
                  {matchedOrder.deliveryAddress.fullName} ({matchedOrder.deliveryAddress.phone})<br />
                  {matchedOrder.deliveryAddress.houseStreet}, {matchedOrder.deliveryAddress.areaLandmark}<br />
                  {matchedOrder.deliveryAddress.city}, {matchedOrder.deliveryAddress.state} - {matchedOrder.deliveryAddress.pincode}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold uppercase tracking-wider text-gray-500">
                  Items Ordered ({matchedOrder.items.length})
                </h4>
                <ul className="space-y-1 text-gray-700">
                  {matchedOrder.items.map((it, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{it.quantity}x {language === 'en' ? it.product.name_en : it.product.name_ta}</span>
                      <span className="font-semibold">{formatINR(it.product.price * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
