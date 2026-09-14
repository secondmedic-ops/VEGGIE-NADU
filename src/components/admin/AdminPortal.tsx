import React, { useState } from 'react';
import { AdminUser, Product, Category, Order, BulkRequest, Language } from '../../types';
import { translations } from '../../locales/translations';
import { InventoryDashboard } from './InventoryDashboard';
import { OrderDashboard } from './OrderDashboard';
import { VeggieNaduSealLogo } from '../VeggieNaduSealLogo';
import { 
  Boxes, 
  ClipboardList, 
  LogOut, 
  Store, 
  ShieldCheck, 
  Crown,
  ChevronRight
} from 'lucide-react';

interface AdminPortalProps {
  adminUser: AdminUser;
  language: Language;
  products: Product[];
  categories: Category[];
  orders: Order[];
  bulkRequests: BulkRequest[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateBulkRequests: (requests: BulkRequest[]) => void;
  onLogout: () => void;
  onBackToStore: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  adminUser,
  language,
  products,
  categories,
  orders,
  bulkRequests,
  onUpdateProducts,
  onUpdateCategories,
  onUpdateOrders,
  onUpdateBulkRequests,
  onLogout,
  onBackToStore
}) => {
  const t = translations[language];

  // Default active tab based on role
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>(
    adminUser.role === 'orders' ? 'orders' : 'inventory'
  );

  const canAccessInventory = adminUser.role === 'inventory' || adminUser.role === 'owner';
  const canAccessOrders = adminUser.role === 'orders' || adminUser.role === 'owner';

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#1B4332] text-[#FAF8F5] border-b-2 border-[#D49726] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VeggieNaduSealLogo size={36} showText={false} />
            <div>
              <div className="font-serif-title font-bold text-base sm:text-lg leading-tight flex items-center gap-2">
                <span>VEGGIE NADU</span>
                <span className="text-[10px] uppercase font-sans tracking-widest bg-[#D49726] text-[#14281D] px-2 py-0.5 rounded-full font-bold">
                  {adminUser.role === 'owner' ? 'Owner Portal' : adminUser.role === 'inventory' ? 'Inventory Manager' : 'Order Dispatch'}
                </span>
              </div>
              <div className="text-[11px] text-[#FAF8F5]/70">
                {adminUser.displayName || adminUser.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF8F5] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Store size={14} />
              <span className="hidden sm:inline">View Customer Store</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-900/50 text-[#FAF8F5] text-xs font-semibold transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Role Switching Tabs (Visible for Owner or gated) */}
        {adminUser.role === 'owner' && (
          <div className="bg-[#14281D] px-4 sm:px-6 lg:px-8 flex items-center gap-4 text-xs font-bold">
            <span className="text-gray-400 py-2.5 flex items-center gap-1 text-[11px]">
              <Crown size={13} className="text-[#D49726]" />
              <span>Owner Switch:</span>
            </span>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'inventory'
                  ? 'border-[#D49726] text-[#D49726]'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              <Boxes size={14} />
              <span>Inventory & Products</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'border-[#D49726] text-[#D49726]'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              <ClipboardList size={14} />
              <span>Orders & Borzo Dispatch</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Admin Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Render Inventory dashboard if permitted */}
        {activeTab === 'inventory' && canAccessInventory && (
          <InventoryDashboard
            products={products}
            categories={categories}
            language={language}
            onUpdateProducts={onUpdateProducts}
            onUpdateCategories={onUpdateCategories}
          />
        )}

        {/* Render Order dashboard if permitted */}
        {activeTab === 'orders' && canAccessOrders && (
          <OrderDashboard
            orders={orders}
            bulkRequests={bulkRequests}
            language={language}
            onUpdateOrders={onUpdateOrders}
            onUpdateBulkRequests={onUpdateBulkRequests}
          />
        )}

        {/* Role Restriction Guard */}
        {activeTab === 'inventory' && !canAccessInventory && (
          <div className="p-8 text-center bg-white border border-rose-200 rounded-2xl">
            <h3 className="text-sm font-bold text-rose-700">Access Restricted</h3>
            <p className="text-xs text-gray-600 mt-1">
              Your account ({adminUser.role}) is only authorized for order fulfillment and dispatch.
            </p>
          </div>
        )}

        {activeTab === 'orders' && !canAccessOrders && (
          <div className="p-8 text-center bg-white border border-rose-200 rounded-2xl">
            <h3 className="text-sm font-bold text-rose-700">Access Restricted</h3>
            <p className="text-xs text-gray-600 mt-1">
              Your account ({adminUser.role}) is only authorized for inventory and product management.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
