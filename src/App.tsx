import React, { useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  Language, 
  CartItem, 
  Order, 
  BulkRequest, 
  AdminUser 
} from './types';
import { initialCategories, initialProducts } from './data/seedData';
import { db, auth } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// UI Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { BulkQuoteView } from './components/BulkQuoteView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AboutContactView } from './components/AboutContactView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminPortal } from './components/admin/AdminPortal';

export default function App() {
  // Localization: English or Tamil
  const [language, setLanguage] = useState<Language>('en');

  // Navigation: 'home' | 'shop' | 'bulk' | 'track' | 'about' | 'admin'
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('veggie_nadu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals & Detail
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [prefillOrderNumber, setPrefillOrderNumber] = useState<string>('');
  const [prefillBulkItem, setPrefillBulkItem] = useState<string>('');

  // Data Collections (Initialized from seed, synchronized with Firestore)
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bulkRequests, setBulkRequests] = useState<BulkRequest[]>([]);

  // Admin User Authentication State
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => {
    try {
      const savedAdmin = localStorage.getItem('veggie_nadu_admin');
      return savedAdmin ? JSON.parse(savedAdmin) : null;
    } catch {
      return null;
    }
  });

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('veggie_nadu_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [cartItems]);

  // Save admin user to local storage
  useEffect(() => {
    try {
      if (currentAdminUser) {
        localStorage.setItem('veggie_nadu_admin', JSON.stringify(currentAdminUser));
      } else {
        localStorage.removeItem('veggie_nadu_admin');
      }
    } catch (e) {
      console.warn('LocalStorage admin save error:', e);
    }
  }, [currentAdminUser]);

  // 1. Initial Firestore Synchronization & Auto-Seed
  useEffect(() => {
    let unsubscribeProducts: () => void;
    let unsubscribeCategories: () => void;
    let unsubscribeOrders: () => void;
    let unsubscribeBulk: () => void;

    async function initFirestoreData() {
      try {
        // Sync Categories
        const catCol = collection(db, 'categories');
        unsubscribeCategories = onSnapshot(
          catCol, 
          async (snapshot) => {
            if (!snapshot.empty) {
              const list: Category[] = snapshot.docs.map((d) => d.data() as Category);
              list.sort((a, b) => a.displayOrder - b.displayOrder);
              setCategories(list);
            } else {
              // Seed categories if empty
              try {
                const batch = writeBatch(db);
                initialCategories.forEach((cat) => {
                  const ref = doc(db, 'categories', cat.id);
                  batch.set(ref, cat);
                });
                await batch.commit();
              } catch (seedErr) {
                console.warn('[Veggie Nadu] Categories seed note:', seedErr);
              }
            }
          },
          (error) => {
            console.warn('[Veggie Nadu] Categories snapshot listener note:', error.message);
          }
        );

        // Sync Products
        const prodCol = collection(db, 'products');
        unsubscribeProducts = onSnapshot(
          prodCol, 
          async (snapshot) => {
            if (!snapshot.empty) {
              const list: Product[] = snapshot.docs.map((d) => d.data() as Product);
              setProducts(list);
            } else {
              // Seed initial products if collection is empty
              try {
                const batch = writeBatch(db);
                initialProducts.forEach((prod) => {
                  const ref = doc(db, 'products', prod.id);
                  batch.set(ref, prod);
                });
                await batch.commit();
              } catch (seedErr) {
                console.warn('[Veggie Nadu] Products seed note:', seedErr);
              }
            }
          },
          (error) => {
            console.warn('[Veggie Nadu] Products snapshot listener note:', error.message);
          }
        );

        // Sync Orders
        const orderCol = collection(db, 'orders');
        unsubscribeOrders = onSnapshot(
          orderCol, 
          (snapshot) => {
            if (!snapshot.empty) {
              const list: Order[] = snapshot.docs.map((d) => d.data() as Order);
              list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setOrders(list);
            }
          },
          (error) => {
            console.warn('[Veggie Nadu] Orders snapshot listener note:', error.message);
          }
        );

        // Sync Bulk Requests
        const bulkCol = collection(db, 'bulk_requests');
        unsubscribeBulk = onSnapshot(
          bulkCol, 
          (snapshot) => {
            if (!snapshot.empty) {
              const list: BulkRequest[] = snapshot.docs.map((d) => d.data() as BulkRequest);
              list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setBulkRequests(list);
            }
          },
          (error) => {
            console.warn('[Veggie Nadu] Bulk requests snapshot listener note:', error.message);
          }
        );
      } catch (err) {
        console.warn('[Veggie Nadu] Firestore listener fallback:', err);
      }
    }

    initFirestoreData();

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeCategories) unsubscribeCategories();
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeBulk) unsubscribeBulk();
    };
  }, []);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(product.id);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity } : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Order placed handler
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setPrefillOrderNumber(newOrder.orderNumber);
  };

  // Request quote for bulk item
  const handleRequestBulkQuote = (product: Product) => {
    const itemName = language === 'en' ? product.name_en : product.name_ta;
    setPrefillBulkItem(`${itemName} (${product.unit})`);
    setActiveTab('bulk');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation handlers
  const handleTabSelect = (tab: string) => {
    if (tab === 'admin') {
      if (currentAdminUser) {
        setActiveTab('admin');
      } else {
        setIsAdminLoginOpen(true);
      }
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    signOut(auth).catch(() => {});
    setCurrentAdminUser(null);
    setActiveTab('home');
  };

  // If in Admin mode with verified credentials, render Admin Portal
  if (activeTab === 'admin' && currentAdminUser) {
    return (
      <AdminPortal
        adminUser={currentAdminUser}
        language={language}
        products={products}
        categories={categories}
        orders={orders}
        bulkRequests={bulkRequests}
        onUpdateProducts={setProducts}
        onUpdateCategories={setCategories}
        onUpdateOrders={setOrders}
        onUpdateBulkRequests={setBulkRequests}
        onLogout={handleAdminLogout}
        onBackToStore={() => setActiveTab('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#14281D]">
      {/* Hidden button for programmatic order track jumping */}
      <button
        id="nav-track-btn"
        className="hidden"
        onClick={() => {
          setActiveTab('track');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Header */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage(language === 'en' ? 'ta' : 'en')}
        activeTab={activeTab}
        onSelectTab={handleTabSelect}
        cartItems={cartItems}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => {
          if (currentAdminUser) {
            setActiveTab('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onOpenAdminModal={() => {
          if (currentAdminUser) {
            setActiveTab('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (activeTab !== 'shop' && q.trim()) {
            setActiveTab('shop');
          }
        }}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            products={products}
            categories={categories}
            language={language}
            cartItems={cartItems}
            onSelectTab={handleTabSelect}
            onSelectCategory={handleCategorySelect}
            onAddToCart={handleAddToCart}
            onViewDetails={setSelectedProduct}
            onRequestBulkQuote={handleRequestBulkQuote}
          />
        )}

        {activeTab === 'shop' && (
          <ShopView
            products={products}
            categories={categories}
            language={language}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onViewDetails={setSelectedProduct}
            onRequestBulkQuote={handleRequestBulkQuote}
            initialCategory={selectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {activeTab === 'bulk' && (
          <BulkQuoteView
            language={language}
            prefillItem={prefillBulkItem}
          />
        )}

        {activeTab === 'track' && (
          <OrderTrackingView
            language={language}
            prefillOrderNumber={prefillOrderNumber}
          />
        )}

        {activeTab === 'about' && (
          <AboutContactView
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onSelectTab={handleTabSelect}
        onOpenAdmin={() => {
          if (currentAdminUser) {
            setActiveTab('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />

      {/* Cart & Checkout Drawer */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        language={language}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Product Quick View / Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        language={language}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onRequestBulkQuote={handleRequestBulkQuote}
        currentCartQty={
          selectedProduct
            ? cartItems.find((ci) => ci.product.id === selectedProduct.id)?.quantity || 0
            : 0
        }
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        language={language}
        onLoginSuccess={(admin) => {
          setCurrentAdminUser(admin);
          setActiveTab('admin');
        }}
      />
    </div>
  );
}
