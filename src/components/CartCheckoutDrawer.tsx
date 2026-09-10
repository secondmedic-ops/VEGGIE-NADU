import React, { useState, useEffect } from 'react';
import { CartItem, Language, DeliveryAddress, Order, PaymentMethod } from '../types';
import { translations, formatINR } from '../locales/translations';
import { calculateBorzoDeliveryFee, bookBorzoCourier } from '../services/borzoService';
import { processRazorpayPayment } from '../services/razorpayService';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  Banknote, 
  Truck, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  MapPin,
  AlertTriangle
} from 'lucide-react';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  language,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [step, setStep] = useState<'cart' | 'address' | 'payment' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Address State (India-format)
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    houseStreet: '',
    areaLandmark: '',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    pincode: '400706'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [deliveryFee, setDeliveryFee] = useState<number>(45);

  const safeItems = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = safeItems.reduce((sum, item) => sum + ((item?.product?.price || 0) * (item?.quantity || 0)), 0);

  // Free delivery above ₹499
  const effectiveDeliveryFee = subtotal >= 499 ? 0 : deliveryFee;
  const grandTotal = subtotal + effectiveDeliveryFee;

  // Recalculate estimated Borzo fee when pincode changes
  useEffect(() => {
    async function updateFee() {
      if (address.pincode && address.pincode.length === 6) {
        const fee = await calculateBorzoDeliveryFee(address);
        setDeliveryFee(fee);
      }
    }
    updateFee();
  }, [address.pincode, address.houseStreet]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName.trim() || !address.phone.trim() || !address.houseStreet.trim()) {
      setErrorMessage(language === 'en' ? 'Please fill in all required delivery address fields.' : 'தயவுசெய்து அனைத்து விவரங்களையும் நிரப்பவும்.');
      return;
    }
    if (address.phone.replace(/\D/g, '').length < 10) {
      setErrorMessage(language === 'en' ? 'Please enter a valid 10-digit mobile number.' : 'சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.');
      return;
    }
    setErrorMessage(null);
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderNumber = `VN-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderId = `order_${Date.now()}`;

      const newOrder: Order = {
        id: orderId,
        orderNumber,
        customerName: address.fullName,
        customerPhone: address.phone,
        deliveryAddress: address,
        items: [...cartItems],
        subtotal,
        deliveryFee: effectiveDeliveryFee,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'pending',
        orderStatus: 'placed',
        createdAt: new Date().toISOString()
      };

      // If Razorpay chosen, process online payment
      if (paymentMethod === 'razorpay') {
        const paymentResult = await processRazorpayPayment(newOrder);
        if (!paymentResult.success) {
          setErrorMessage(paymentResult.error || 'Payment was not completed. You can retry or choose Cash on Delivery.');
          setIsSubmitting(false);
          return;
        }
        newOrder.paymentStatus = 'paid';
      }

      // Automatically book Borzo delivery courier for confirmed order
      try {
        const borzoRes = await bookBorzoCourier(newOrder);
        if (borzoRes.success) {
          newOrder.borzoOrderId = borzoRes.borzoOrderId;
          newOrder.borzoTrackingUrl = borzoRes.trackingUrl;
          newOrder.courierName = borzoRes.courierName;
          newOrder.courierPhone = borzoRes.courierPhone;
          newOrder.orderStatus = 'courier_assigned';
        }
      } catch (err) {
        console.warn('[Veggie Nadu] Borzo auto-dispatch note:', err);
      }

      // Save order to Firestore
      try {
        await setDoc(doc(db, 'orders', orderId), newOrder);
      } catch (dbErr) {
        console.warn('[Veggie Nadu] Storing order locally:', dbErr);
      }

      setCreatedOrder(newOrder);
      onOrderPlaced(newOrder);
      onClearCart();
      setStep('success');
    } catch (err: any) {
      console.error('[Veggie Nadu] Order placement error:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#FAF8F5] h-full flex flex-col shadow-2xl border-l border-[#1B4332]/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#1B4332] text-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#D49726]" />
            <h2 className="font-serif-title font-bold text-lg text-[#FAF8F5]">
              {step === 'cart' && t.cart}
              {step === 'address' && t.deliveryAddress}
              {step === 'payment' && t.paymentMethod}
              {step === 'success' && t.orderSuccessTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#FAF8F5]/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Delivery Meter Banner */}
        {step !== 'success' && subtotal > 0 && (
          <div className="bg-[#F4F0E8] px-4 py-2 border-b border-[#1B4332]/10 text-xs flex items-center justify-between text-[#14281D]">
            {subtotal >= 499 ? (
              <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>You unlocked FREE Borzo Delivery!</span>
              </span>
            ) : (
              <span className="text-amber-900 font-medium">
                Add {formatINR(499 - subtotal)} more for FREE Borzo Delivery!
              </span>
            )}
            <span className="font-mono font-semibold text-[#1B4332]">
              {subtotal >= 499 ? 'FREE' : formatINR(deliveryFee)}
            </span>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="m-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Drawer Body content by step */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <div>
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#F4F0E8] text-[#1B4332] flex items-center justify-center mx-auto">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="font-serif-title font-bold text-lg text-gray-800">
                    {t.emptyCart}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    {t.emptyCartDesc}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full bg-[#1B4332] text-white text-xs font-bold hover:bg-[#2D6A4F] transition-colors cursor-pointer"
                  >
                    {t.startShopping}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const primaryName = language === 'en' ? item.product.name_en : item.product.name_ta;
                    return (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#1B4332]/10 shadow-2xs"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={primaryName}
                          className="w-16 h-16 rounded-lg object-cover bg-[#F4F0E8] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs sm:text-sm text-[#14281D] truncate">
                            {primaryName}
                          </h4>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {formatINR(item.product.price)} / {item.product.unit}
                          </div>
                          <div className="font-bold text-xs text-[#1B4332] mt-1">
                            {formatINR(item.product.price * item.quantity)}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#1B4332]/20 rounded-lg bg-[#FAF8F5] overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-[#F4F0E8] text-[#1B4332] transition-colors cursor-pointer"
                            aria-label="Decrease"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#14281D]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1.5 hover:bg-[#F4F0E8] text-[#1B4332] disabled:opacity-40 transition-colors cursor-pointer"
                            aria-label="Increase"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-gray-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: DELIVERY ADDRESS FORM (India Format) */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} id="address-form" className="space-y-4">
              <div className="text-xs text-gray-600 mb-2">
                Deliveries handled safely via Borzo from Selvaraj store, Nerul.
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Nadar"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#1B4332]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.phoneNumber} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10 digit phone number (e.g. 9820154321)"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#1B4332]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.houseStreet} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat 402, Sai Sagar Apts, Plot 14, Sector 21"
                  value={address.houseStreet}
                  onChange={(e) => setAddress({ ...address, houseStreet: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#1B4332]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.areaLandmark} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Near Nerul Railway Station / Palm Beach Road"
                  value={address.areaLandmark}
                  onChange={(e) => setAddress({ ...address, areaLandmark: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#1B4332]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.city}
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.state}
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.pincode} *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="400706"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT METHOD SELECTION */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white border border-[#1B4332]/10 space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#1B4332]" />
                  <span>Delivering to:</span>
                </h4>
                <p className="text-xs text-gray-800 leading-snug">
                  <strong className="font-semibold">{address.fullName}</strong> ({address.phone})<br />
                  {address.houseStreet}, {address.areaLandmark}, {address.city}, {address.state} - {address.pincode}
                </p>
                <button
                  onClick={() => setStep('address')}
                  className="text-xs text-[#1B4332] hover:underline font-semibold cursor-pointer"
                >
                  Edit Address
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                  Select Payment Option
                </label>

                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#1B4332] bg-[#1B4332]/5 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 accent-[#1B4332]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} className="text-[#1B4332]" />
                      <span className="font-bold text-sm text-[#14281D]">
                        Razorpay Online Payment
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        FAST & SECURE
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Instant UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and Netbanking.
                    </p>
                  </div>
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    paymentMethod === 'cod'
                      ? 'border-[#1B4332] bg-[#1B4332]/5 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-[#1B4332]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Banknote size={18} className="text-[#D49726]" />
                      <span className="font-bold text-sm text-[#14281D]">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Pay cash or UPI directly to the Borzo courier upon home delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS CONFIRMATION */}
          {step === 'success' && createdOrder && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 className="font-serif-title font-bold text-2xl text-[#14281D]">
                  {t.orderSuccessTitle}
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
                  {t.orderSuccessDesc}
                </p>
              </div>

              {/* Order Number & Summary Card */}
              <div className="p-4 rounded-xl bg-white border border-[#1B4332]/15 text-left space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">Order Number</span>
                  <span className="font-mono font-bold text-sm text-[#1B4332]">
                    #{createdOrder.orderNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Payment Status</span>
                  <span className={`font-semibold capitalize ${
                    createdOrder.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {createdOrder.paymentStatus === 'paid' ? 'Paid via Razorpay' : 'Pay on Delivery (COD)'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Delivery Partner</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1">
                    <Truck size={13} className="text-[#D49726]" />
                    <span>Borzo Express Courier</span>
                  </span>
                </div>

                {createdOrder.borzoOrderId && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="font-semibold">Borzo Courier Assigned:</div>
                    <div>{createdOrder.courierName} ({createdOrder.courierPhone})</div>
                    <div className="text-[11px] text-emerald-700">Order ID: {createdOrder.borzoOrderId}</div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    // trigger order tracking tab
                    const trackBtn = document.getElementById('nav-track-btn');
                    if (trackBtn) trackBtn.click();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#2D6A4F] transition-colors cursor-pointer"
                >
                  {t.trackNow} (#{createdOrder.orderNumber})
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-xs text-gray-500 hover:text-black font-semibold cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer with Price Summary and Navigation Buttons */}
        {cartItems.length > 0 && step !== 'success' && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#1B4332]/10 space-y-3">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-gray-800">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.deliveryFee} (Borzo)</span>
                <span className="font-semibold text-gray-800">
                  {effectiveDeliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    formatINR(effectiveDeliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#14281D] pt-1.5 border-t border-gray-100">
                <span>{t.total}</span>
                <span className="text-[#1B4332] text-base">{formatINR(grandTotal)}</span>
              </div>
            </div>

            {/* Step Controls */}
            {step === 'cart' && (
              <button
                onClick={() => setStep('address')}
                className="w-full py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FAF8F5] text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>{t.checkout}</span>
                <ArrowRight size={16} />
              </button>
            )}

            {step === 'address' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-1/3 py-2.5 px-3 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Back to Cart
                </button>
                <button
                  form="address-form"
                  type="submit"
                  className="w-2/3 py-2.5 px-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FAF8F5] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Select Payment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  disabled={isSubmitting}
                  className="w-1/3 py-2.5 px-3 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 px-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FAF8F5] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <span>{t.processingOrder}</span>
                  ) : (
                    <>
                      <ShieldCheck size={16} className="text-[#D49726]" />
                      <span>{t.placeOrder} ({formatINR(grandTotal)})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
