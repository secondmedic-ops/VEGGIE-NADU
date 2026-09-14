import React, { useState } from 'react';
import { Order, OrderStatus, BulkRequest, Language } from '../../types';
import { translations, formatINR } from '../../locales/translations';
import { bookBorzoCourier } from '../../services/borzoService';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  ClipboardList, 
  Truck, 
  Bike, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Phone, 
  MapPin, 
  RotateCw, 
  Search, 
  Filter,
  Building2,
  Calendar,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface OrderDashboardProps {
  orders: Order[];
  bulkRequests: BulkRequest[];
  language: Language;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateBulkRequests: (requests: BulkRequest[]) => void;
}

export const OrderDashboard: React.FC<OrderDashboardProps> = ({
  orders,
  bulkRequests,
  language,
  onUpdateOrders,
  onUpdateBulkRequests
}) => {
  const t = translations[language];

  const [mainTab, setMainTab] = useState<'orders' | 'bulk'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [bookingLoadingId, setBookingLoadingId] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.deliveryAddress.pincode.includes(q)
      );
    }
    return true;
  });

  // Handle Order Status Change
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
    onUpdateOrders(updated);

    try {
      const target = updated.find(o => o.id === orderId);
      if (target) {
        await setDoc(doc(db, 'orders', orderId), target);
      }
    } catch (e) {
      console.warn('Firestore order update note:', e);
    }
  };

  // Trigger / Retry Borzo Booking
  const handleTriggerBorzoBooking = async (order: Order) => {
    setBookingLoadingId(order.id);
    try {
      const res = await bookBorzoCourier(order);
      if (res.success) {
        const updated = orders.map(o => o.id === order.id ? {
          ...o,
          borzoOrderId: res.borzoOrderId,
          borzoTrackingUrl: res.trackingUrl,
          courierName: res.courierName,
          courierPhone: res.courierPhone,
          orderStatus: 'courier_assigned' as OrderStatus
        } : o);

        onUpdateOrders(updated);
        try {
          const target = updated.find(o => o.id === order.id);
          if (target) await setDoc(doc(db, 'orders', order.id), target);
        } catch (e) {
          console.warn('Firestore sync note:', e);
        }
      }
    } catch (err) {
      console.error('Borzo booking trigger failed:', err);
    } finally {
      setBookingLoadingId(null);
    }
  };

  // Update Bulk Request Status
  const handleUpdateBulkStatus = async (requestId: string, newStatus: BulkRequest['status']) => {
    const updated = bulkRequests.map(r => r.id === requestId ? { ...r, status: newStatus } : r);
    onUpdateBulkRequests(updated);

    try {
      const target = updated.find(r => r.id === requestId);
      if (target) {
        await setDoc(doc(db, 'bulk_requests', requestId), target);
      }
    } catch (e) {
      console.warn('Firestore bulk status note:', e);
    }
  };

  const pendingBulkCount = bulkRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#1B4332]/12 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMainTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'orders'
                ? 'bg-[#1B4332] text-[#FAF8F5]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ClipboardList size={15} />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setMainTab('bulk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'bulk'
                ? 'bg-[#D49726] text-[#14281D]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Building2 size={15} />
            <span>Bulk / Catering Inquiries ({bulkRequests.length})</span>
            {pendingBulkCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                {pendingBulkCount} new
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: CUSTOMER ORDERS */}
      {mainTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <input
                type="text"
                placeholder="Search by Order #, customer name, phone, or pincode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 pl-9 text-xs bg-white border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332]"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-xl font-medium cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="placed">Placed</option>
                <option value="packed">Packed</option>
                <option value="courier_assigned">Courier Assigned</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Cards Grid */}
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#1B4332]/10 rounded-2xl space-y-2">
              <p className="text-sm font-semibold text-gray-600">No orders matching this filter.</p>
              <p className="text-xs text-gray-400">Place an order in the shop to see it arrive here in real-time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isBooking = bookingLoadingId === order.id;

                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-white border border-[#1B4332]/15 shadow-xs space-y-4 hover:border-[#1B4332]/35 transition-all"
                  >
                    {/* Top Row: Order ID, Date, Status, Total */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-base text-[#1B4332]">
                            #{order.orderNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.paymentMethod === 'razorpay' ? 'Paid (Razorpay)' : 'Cash on Delivery'}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Placed: {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-sm text-[#14281D]">
                            {formatINR(order.total)}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {order.items.length} items (Del: {order.deliveryFee === 0 ? 'FREE' : formatINR(order.deliveryFee)})
                          </div>
                        </div>

                        {/* Status Dropdown */}
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1.5 text-xs font-bold bg-[#FAF8F5] border border-[#1B4332]/25 rounded-xl text-[#1B4332] cursor-pointer"
                        >
                          <option value="placed">Placed</option>
                          <option value="packed">Packed</option>
                          <option value="courier_assigned">Courier Assigned</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Middle Row: Customer Info & Ordered Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Customer Address */}
                      <div className="space-y-1">
                        <div className="font-bold text-gray-700 flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#1B4332]" />
                          <span>Delivery Location:</span>
                        </div>
                        <div className="text-gray-800 leading-snug">
                          <strong>{order.customerName}</strong> ({order.customerPhone})<br />
                          {order.deliveryAddress.houseStreet}, {order.deliveryAddress.areaLandmark}<br />
                          {order.deliveryAddress.city}, {order.deliveryAddress.state} - <span className="font-mono font-bold">{order.deliveryAddress.pincode}</span>
                        </div>
                      </div>

                      {/* Item details */}
                      <div className="space-y-1">
                        <div className="font-bold text-gray-700">
                          Package Contents:
                        </div>
                        <ul className="space-y-0.5 text-gray-600">
                          {order.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>{it.quantity}x {it.product.name_en} ({it.product.name_ta})</span>
                              <span className="font-mono text-gray-800">{formatINR(it.product.price * it.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Row: Borzo Courier Dispatch Panel */}
                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F5] p-3 rounded-xl">
                      <div className="flex items-center gap-2 text-xs">
                        <Bike size={16} className="text-[#1B4332]" />
                        {order.borzoOrderId ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-gray-800">
                              Borzo Rider: {order.courierName || 'Assigned'} ({order.courierPhone || 'In transit'})
                            </span>
                            <div className="text-[11px] text-gray-500 font-mono">
                              Borzo ID: {order.borzoOrderId}
                            </div>
                          </div>
                        ) : (
                          <span className="text-amber-800 font-semibold">
                            Courier not yet dispatched
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {order.borzoTrackingUrl && (
                          <a
                            href={order.borzoTrackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs rounded-lg border border-[#1B4332]/20 hover:bg-white text-[#1B4332] font-semibold inline-flex items-center gap-1 transition-colors"
                          >
                            <span>Live Map</span>
                            <ExternalLink size={12} />
                          </a>
                        )}

                        <button
                          onClick={() => handleTriggerBorzoBooking(order)}
                          disabled={isBooking}
                          className="px-3 py-1.5 text-xs rounded-lg bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <RotateCw size={12} className={isBooking ? 'animate-spin' : ''} />
                          <span>{order.borzoOrderId ? 'Re-dispatch Borzo' : 'Dispatch Borzo Courier'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: BULK & CATERING INQUIRIES */}
      {mainTab === 'bulk' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bulkRequests.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-white border border-[#1B4332]/10 rounded-2xl">
                <p className="text-sm font-semibold text-gray-600">No catering or bulk quote inquiries yet.</p>
              </div>
            ) : (
              bulkRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-white border border-[#1B4332]/15 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-serif-title font-bold text-base text-[#14281D]">
                          {req.businessName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Contact: <strong>{req.contactPerson}</strong> • {req.phone}
                        </div>
                      </div>

                      <select
                        value={req.status}
                        onChange={(e) => handleUpdateBulkStatus(req.id, e.target.value as BulkRequest['status'])}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                          req.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                          req.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF8F5] text-xs text-gray-800 space-y-1 border border-[#1B4332]/10">
                      <div><strong>Requested Items:</strong> {req.itemsNeeded}</div>
                      {req.estimatedQuantity && <div><strong>Volume / Guests:</strong> {req.estimatedQuantity}</div>}
                      <div className="flex items-center gap-1.5 text-[#1B4332] font-semibold">
                        <Calendar size={13} />
                        <span>Delivery Date Needed: {req.deliveryByDate}</span>
                      </div>
                      {req.notes && <div className="text-gray-500 italic">Notes: {req.notes}</div>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      Received: {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                    <a
                      href={`tel:${req.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-[#1B4332] text-white font-bold inline-flex items-center gap-1.5 hover:bg-[#2D6A4F] transition-colors"
                    >
                      <Phone size={12} />
                      <span>Call Client</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
