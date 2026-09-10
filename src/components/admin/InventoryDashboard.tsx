import React, { useState } from 'react';
import { Product, Category, Language, ProductUnit } from '../../types';
import { translations, formatINR } from '../../locales/translations';
import { db, storage } from '../../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Search, 
  Image as ImageIcon, 
  Check, 
  X, 
  Save, 
  Layers, 
  TrendingDown,
  Filter,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';

interface InventoryDashboardProps {
  products: Product[];
  categories: Category[];
  language: Language;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
}

export const InventoryDashboard: React.FC<InventoryDashboardProps> = ({
  products,
  categories,
  language,
  onUpdateProducts,
  onUpdateCategories
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'low-stock'>('products');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);

  // Edit / Add Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Edit / Add Category State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Low stock products
  const lowStockItems = products.filter(p => p.stock <= lowStockThreshold);

  // Filtered products list
  const filteredProducts = products.filter(p => {
    if (filterCategory !== 'all' && p.categoryId !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name_en.toLowerCase().includes(q) || p.name_ta.toLowerCase().includes(q);
    }
    return true;
  });

  // Quick Inline Stock Update
  const handleQuickStockUpdate = async (productId: string, newStock: number) => {
    const updated = products.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p);
    onUpdateProducts(updated);

    try {
      const prod = updated.find(p => p.id === productId);
      if (prod) {
        await setDoc(doc(db, 'products', productId), prod);
      }
    } catch (e) {
      console.warn('Firestore stock update note:', e);
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (productId: string) => {
    const updated = products.map(p => p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p);
    onUpdateProducts(updated);

    try {
      const prod = updated.find(p => p.id === productId);
      if (prod) {
        await setDoc(doc(db, 'products', productId), prod);
      }
    } catch (e) {
      console.warn('Firestore toggle note:', e);
    }
  };

  // Open Add Product
  const handleOpenAddProduct = () => {
    setEditingProduct({
      id: `prod_${Date.now()}`,
      name_en: '',
      name_ta: '',
      categoryId: categories[0]?.id || 'cat-bananas',
      description_en: '',
      description_ta: '',
      price: 50,
      unit: 'kg',
      stock: 20,
      images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'],
      isAvailable: true,
      isBulkOnly: false,
      featured: false
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsProductModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updatedList: Product[];
    const exists = products.some(p => p.id === editingProduct.id);
    if (exists) {
      updatedList = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    } else {
      updatedList = [editingProduct, ...products];
    }

    onUpdateProducts(updatedList);
    setIsProductModalOpen(false);

    try {
      await setDoc(doc(db, 'products', editingProduct.id), editingProduct);
    } catch (err) {
      console.warn('Firestore save product note:', err);
    }
  };

  // Delete / Deactivate Product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to deactivate or remove this product?')) return;
    const updated = products.filter(p => p.id !== productId);
    onUpdateProducts(updated);

    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.warn('Firestore delete product note:', err);
    }
  };

  // Image Upload helper (supports Firebase storage + base64 fallback)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setImageUploadLoading(true);
    try {
      // Try Firebase Storage upload
      try {
        const storageRef = ref(storage, `products/${editingProduct.id}_${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        setEditingProduct({
          ...editingProduct,
          images: [downloadUrl, ...editingProduct.images]
        });
        setImageUploadLoading(false);
        return;
      } catch (stErr) {
        console.warn('Firebase Storage offline, converting to base64 preview:', stErr);
      }

      // Base64 fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setEditingProduct({
          ...editingProduct,
          images: [base64Url, ...editingProduct.images]
        });
        setImageUploadLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image upload error:', err);
      setImageUploadLoading(false);
    }
  };

  // Open Add Category
  const handleOpenAddCategory = () => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      name_en: '',
      name_ta: '',
      slug: `category-${categories.length + 1}`,
      displayOrder: categories.length + 1,
      description_en: '',
      description_ta: ''
    });
    setIsCategoryModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    let updatedCategories: Category[];
    const exists = categories.some(c => c.id === editingCategory.id);
    if (exists) {
      updatedCategories = categories.map(c => c.id === editingCategory.id ? editingCategory : c);
    } else {
      updatedCategories = [...categories, editingCategory];
    }

    onUpdateCategories(updatedCategories);
    setIsCategoryModalOpen(false);

    try {
      await setDoc(doc(db, 'categories', editingCategory.id), editingCategory);
    } catch (e) {
      console.warn('Firestore category save note:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#1B4332]/12 shadow-2xs">
        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#1B4332] text-[#FAF8F5]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('low-stock')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'low-stock'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
            }`}
          >
            <AlertTriangle size={13} />
            <span>Low Stock Alerts ({lowStockItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#1B4332] text-[#FAF8F5]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'categories' ? (
            <button
              onClick={handleOpenAddCategory}
              className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FolderPlus size={15} />
              <span>Add Category</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus size={15} />
              <span>{t.addNewProduct}</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: PRODUCTS LIST */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search products by English or Tamil name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 pl-9 text-xs bg-white border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332]"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-xl focus:ring-2 focus:ring-[#1B4332]"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name_en} ({c.name_ta})</option>
              ))}
            </select>
          </div>

          {/* Product Items Table */}
          <div className="bg-white border border-[#1B4332]/15 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Bulk Only</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => {
                    const cat = categories.find(c => c.id === p.categoryId);
                    const isLow = p.stock <= lowStockThreshold;

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.name_en}
                              className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-gray-900">{p.name_en}</div>
                              <div className="text-[11px] text-[#1B4332]">{p.name_ta}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">
                          {cat?.name_en || 'Misc'}
                        </td>
                        <td className="p-3 font-bold text-[#1B4332]">
                          {formatINR(p.price)} <span className="font-normal text-gray-400">/{p.unit}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              value={p.stock}
                              onChange={(e) => handleQuickStockUpdate(p.id, Number(e.target.value))}
                              className={`w-16 px-2 py-1 border rounded text-xs font-bold text-center ${
                                isLow ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-gray-200 bg-white'
                              }`}
                            />
                            <span className="text-[11px] text-gray-400">{p.unit}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleAvailability(p.id)}
                            className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                              p.isAvailable 
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {p.isAvailable ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-3">
                          {p.isBulkOnly ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#D49726]/20 text-[#D49726] font-bold">
                              Bulk Only
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-gray-600 hover:text-[#1B4332] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: LOW STOCK ALERTS */}
      {activeTab === 'low-stock' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-amber-900">
              <AlertTriangle size={18} className="text-amber-700 shrink-0" />
              <span>
                Showing items below the threshold of <strong>{lowStockThreshold} units</strong>. Promptly replenish from the local mandi.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-900 font-semibold">Threshold:</span>
              <input
                type="number"
                min={1}
                max={50}
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-14 px-2 py-1 bg-white border border-amber-300 rounded text-xs font-bold text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-xs flex items-center gap-3">
                <img src={p.images[0]} alt={p.name_en} className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-900 truncate">{p.name_en}</div>
                  <div className="text-xs text-[#1B4332]">{p.name_ta}</div>
                  <div className="text-xs text-rose-700 font-bold mt-1">
                    Current Stock: {p.stock} {p.unit}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleQuickStockUpdate(p.id, p.stock + 20)}
                    className="px-2.5 py-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    +20 Stock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const count = products.filter(p => p.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="p-4 rounded-2xl bg-white border border-[#1B4332]/15 shadow-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-900">{cat.name_en}</h4>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                        {count} items
                      </span>
                    </div>
                    <div className="text-xs text-[#1B4332] font-semibold">{cat.name_ta}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 mt-1">{cat.description_en}</div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Slug: {cat.slug}</span>
                    <button
                      onClick={() => {
                        setEditingCategory({ ...cat });
                        setIsCategoryModalOpen(true);
                      }}
                      className="text-xs text-[#1B4332] font-bold hover:underline cursor-pointer"
                    >
                      Edit Category
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#1B4332]/20 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 sm:p-5 bg-[#1B4332] text-white flex items-center justify-between">
              <h3 className="font-serif-title font-bold text-lg">
                {products.some(p => p.id === editingProduct.id) ? t.editProduct : t.addNewProduct}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="cursor-pointer text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_en}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Product Name (Tamil - தமிழ்) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_ta}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_ta: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-xl"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name_en} ({c.name_ta})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Unit *
                    </label>
                    <select
                      value={editingProduct.unit}
                      onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value as ProductUnit })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-xl"
                    >
                      <option value="kg">kg</option>
                      <option value="piece">piece</option>
                      <option value="packet">packet</option>
                      <option value="bunch">bunch</option>
                      <option value="500g">500g</option>
                      <option value="250g">250g</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Initial Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Farm Origin (e.g. Erode / Pollachi)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.origin_en || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, origin_en: e.target.value, origin_ta: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-xl"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.description_en}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_en: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Description (Tamil)
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.description_ta}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_ta: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#1B4332]/20 rounded-xl"
                  />
                </div>
              </div>

              {/* Product Image URL & Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Product Image
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={editingProduct.images[0]}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="url"
                      placeholder="Image URL (https://...)"
                      value={editingProduct.images[0] || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-[#1B4332] hover:underline cursor-pointer">
                        <span>Upload photo file...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      {imageUploadLoading && <span className="text-xs text-amber-600">Uploading...</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-200 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                    className="accent-[#1B4332]"
                  />
                  <span className="font-semibold text-gray-800">Available in Shop</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBulkOnly}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBulkOnly: e.target.checked })}
                    className="accent-[#D49726]"
                  />
                  <span className="font-semibold text-gray-800">Bulk Order Only (Quote inquiry)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="accent-[#1B4332]"
                  />
                  <span className="font-semibold text-gray-800">Feature on Homepage</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#2D6A4F] cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FAF8F5] rounded-2xl shadow-xl p-6 border border-[#1B4332]/20 space-y-4">
            <h3 className="font-serif-title font-bold text-lg text-gray-900">
              Manage Category
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name_en}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Name (Tamil) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name_ta}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_ta: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Slug (URL key)
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1B4332] text-white text-xs font-bold hover:bg-[#2D6A4F] cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
