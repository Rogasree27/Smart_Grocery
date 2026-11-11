import React, { useState } from 'react';
import {
  Package,
  Store,
  Tag,
  Plus,
  Pencil,
  Trash2,
  Search,
  Check,
  X,
  AlertCircle,
  TrendingDown,
  Building2,
  Phone,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { useGrocery } from '../../context/GroceryContext';
import { Product, Shop, ShopType } from '../../types/grocery';
import { ProductImage } from '../common/ProductImage';
import { CATEGORIES } from '../../data/initialData';

interface AdminManagementViewProps {
  initialSubTab?: 'products' | 'shops' | 'prices';
}

export const AdminManagementView: React.FC<AdminManagementViewProps> = ({
  initialSubTab = 'products',
}) => {
  const {
    products,
    shops,
    prices,
    addProduct,
    updateProduct,
    deleteProduct,
    addShop,
    updateShop,
    deleteShop,
    setPrice,
    deletePrice,
  } = useGrocery();

  // Sub-tabs: 'products' | 'shops' | 'prices'
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'shops' | 'prices'>(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Search & filter
  const [productSearch, setProductSearch] = useState('');
  const [shopSearch, setShopSearch] = useState('');

  // Modals state
  const [productModal, setProductModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });

  const [shopModal, setShopModal] = useState<{
    isOpen: boolean;
    shop: Shop | null;
  }>({ isOpen: false, shop: null });

  const [priceModal, setPriceModal] = useState<{
    isOpen: boolean;
    productId: string;
    shopId: string;
    currentPrice: number;
  }>({ isOpen: false, productId: '', shopId: '', currentPrice: 0 });

  // Product Form state
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Grains & Staples',
    unit: '1 kg',
    image: '',
    description: '',
  });

  // Shop Form state
  const [shopForm, setShopForm] = useState({
    name: '',
    type: 'local' as ShopType,
    location: '',
    contactPhone: '',
    websiteOrApp: '',
  });

  // Price Form state
  const [priceInput, setPriceInput] = useState<string>('0');

  // Notification toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Product Modal (New or Edit)
  const openProductModal = (prod: Product | null = null) => {
    if (prod) {
      setProductForm({
        name: prod.name,
        category: prod.category,
        unit: prod.unit,
        image: prod.image,
        description: prod.description,
      });
      setProductModal({ isOpen: true, product: prod });
    } else {
      setProductForm({
        name: '',
        category: 'Grains & Staples',
        unit: '1 kg',
        image: '',
        description: '',
      });
      setProductModal({ isOpen: true, product: null });
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    if (productModal.product) {
      updateProduct(productModal.product.id, productForm);
      showToast(`Updated product "${productForm.name}"`);
    } else {
      const created = addProduct(productForm);
      showToast(`Added new product "${created.name}"`);
    }
    setProductModal({ isOpen: false, product: null });
  };

  // Open Shop Modal (New or Edit)
  const openShopModal = (shop: Shop | null = null) => {
    if (shop) {
      setShopForm({
        name: shop.name,
        type: shop.type,
        location: shop.location,
        contactPhone: shop.contactPhone || '',
        websiteOrApp: shop.websiteOrApp || '',
      });
      setShopModal({ isOpen: true, shop });
    } else {
      setShopForm({
        name: '',
        type: 'local',
        location: '',
        contactPhone: '',
        websiteOrApp: '',
      });
      setShopModal({ isOpen: true, shop: null });
    }
  };

  const handleSaveShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopForm.name.trim()) return;

    if (shopModal.shop) {
      updateShop(shopModal.shop.id, shopForm);
      showToast(`Updated shop "${shopForm.name}"`);
    } else {
      const created = addShop(shopForm);
      showToast(`Added new shop "${created.name}"`);
    }
    setShopModal({ isOpen: false, shop: null });
  };

  // Open Price Modal
  const openPriceEditModal = (productId: string, shopId: string) => {
    const existing = prices.find((p) => p.productId === productId && p.shopId === shopId);
    setPriceInput(existing ? String(existing.price) : '0');
    setPriceModal({
      isOpen: true,
      productId,
      shopId,
      currentPrice: existing ? existing.price : 0,
    });
  };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(priceInput);
    if (isNaN(val) || val < 0) return;

    setPrice(priceModal.productId, priceModal.shopId, val, true);
    showToast('Updated price successfully');
    setPriceModal({ isOpen: false, productId: '', shopId: '', currentPrice: 0 });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-xl text-xs font-semibold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/75 border border-white/80 shadow-lg shadow-purple-900/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-md mb-2">
              <Store className="w-3.5 h-3.5" />
              Store & Catalogue Administration
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Manage Products, Shops & Live Prices
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Add new inventory, register local supermarkets or online stores, and update prices in real time.
            </p>
          </div>

          {/* Sub-tab navigation switch */}
          <div className="flex items-center p-1 bg-purple-100/70 rounded-2xl self-start sm:self-auto border border-purple-200/50">
            <button
              onClick={() => setActiveSubTab('products')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'products'
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('shops')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'shops'
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Shops ({shops.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('prices')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'prices'
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Price Matrix ({prices.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: PRODUCTS MANAGEMENT */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-purple-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              onClick={() => openProductModal(null)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="rounded-3xl backdrop-blur-xl bg-white/75 border border-white/80 shadow-lg shadow-purple-900/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-100 bg-purple-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Price Count</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100/60 text-xs">
                  {products
                    .filter((p) =>
                      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                      p.category.toLowerCase().includes(productSearch.toLowerCase())
                    )
                    .map((prod) => {
                      const prodPrices = prices.filter((pr) => pr.productId === prod.id);

                      return (
                        <tr key={prod.id} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                                <ProductImage
                                  src={prod.image}
                                  alt={prod.name}
                                  category={prod.category}
                                />
                              </div>
                              <span className="font-bold text-slate-900">{prod.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-md text-[11px]">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                            {prod.unit}
                          </td>
                          <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                            {prod.description}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-700">
                            {prodPrices.length} shops
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openProductModal(prod)}
                                className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-100/60 rounded-lg transition-colors"
                                title="Edit product"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Delete "${prod.name}" and all its price entries?`
                                    )
                                  ) {
                                    deleteProduct(prod.id);
                                    showToast(`Deleted ${prod.name}`);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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

      {/* SUB-TAB 2: SHOP MANAGEMENT */}
      {activeSubTab === 'shops' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search shops or locations..."
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-purple-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              onClick={() => openShopModal(null)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Shop / Supermarket</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shops
              .filter(
                (s) =>
                  s.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
                  s.location.toLowerCase().includes(shopSearch.toLowerCase())
              )
              .map((shop) => {
                const shopPricesCount = prices.filter((pr) => pr.shopId === shop.id).length;

                return (
                  <div
                    key={shop.id}
                    className="p-5 rounded-2xl backdrop-blur-xl bg-white/80 border border-white/80 shadow-md shadow-purple-900/5 hover:border-purple-200 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          <h3 className="text-base font-bold text-slate-900">{shop.name}</h3>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            shop.type === 'online'
                              ? 'bg-sky-100 text-sky-800'
                              : shop.type === 'supermarket'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {shop.type === 'online'
                            ? 'Online App'
                            : shop.type === 'supermarket'
                            ? 'Supermarket'
                            : 'Local Store'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 mt-3">
                        <div className="flex items-start gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{shop.location}</span>
                        </div>
                        {shop.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-mono">{shop.contactPhone}</span>
                          </div>
                        )}
                        {shop.websiteOrApp && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{shop.websiteOrApp}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-purple-100/60 flex items-center justify-between">
                      <span className="text-xs font-mono text-purple-700 font-semibold">
                        {shopPricesCount} prices recorded
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openShopModal(shop)}
                          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-100/60 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete "${shop.name}" and remove all its price entries?`
                              )
                            ) {
                              deleteShop(shop.id);
                              showToast(`Deleted ${shop.name}`);
                            }
                          }}
                          className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PRICE MANAGEMENT & COMPARISON MATRIX */}
      {activeSubTab === 'prices' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Interactive Multi-Shop Price Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Click any price cell to instantly update or enter new product prices across shops.
              </p>
            </div>
            <span className="text-xs font-mono bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-lg">
              {prices.length} Active Price Entries
            </span>
          </div>

          <div className="rounded-3xl backdrop-blur-xl bg-white/75 border border-white/80 shadow-lg shadow-purple-900/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-100 bg-purple-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4 min-w-[200px]">Product & Unit</th>
                    {shops.map((s) => (
                      <th key={s.id} className="py-3 px-4 text-center min-w-[130px]">
                        <div>{s.name}</div>
                        <div className="text-[9px] text-slate-600 font-normal uppercase">
                          {s.type}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100/60 text-xs">
                  {products.map((prod) => {
                    // Find lowest price for this product to highlight in matrix
                    const prodPrices = prices.filter((pr) => pr.productId === prod.id && pr.inStock);
                    const lowestVal =
                      prodPrices.length > 0 ? Math.min(...prodPrices.map((p) => p.price)) : 0;

                    return (
                      <tr key={prod.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                              <ProductImage
                                src={prod.image}
                                alt={prod.name}
                                category={prod.category}
                              />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{prod.name}</div>
                              <div className="text-[10px] text-slate-500">{prod.unit}</div>
                            </div>
                          </div>
                        </td>

                        {shops.map((s) => {
                          const entry = prices.find(
                            (pr) => pr.productId === prod.id && pr.shopId === s.id
                          );
                          const isLowest = entry && entry.price === lowestVal && lowestVal > 0;

                          return (
                            <td key={s.id} className="py-3 px-4 text-center">
                              {entry ? (
                                <button
                                  onClick={() => openPriceEditModal(prod.id, s.id)}
                                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer group ${
                                    isLowest
                                      ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                                      : 'bg-slate-100 hover:bg-purple-100 text-slate-800 border border-slate-200'
                                  }`}
                                  title="Click to edit price"
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    <span className="font-mono font-bold text-xs">
                                      ₹{entry.price}
                                    </span>
                                    <Pencil className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  {isLowest && (
                                    <div className="text-[9px] uppercase font-bold text-emerald-700 leading-none mt-0.5">
                                      Lowest
                                    </div>
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={() => openPriceEditModal(prod.id, s.id)}
                                  className="px-2.5 py-1 text-[11px] font-medium text-purple-600 hover:bg-purple-100 rounded-lg transition-colors border border-dashed border-purple-300"
                                >
                                  + Set Price
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {productModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h2 className="text-base font-bold text-slate-900">
                {productModal.product ? 'Edit Grocery Product' : 'Add New Grocery Product'}
              </h2>
              <button
                onClick={() => setProductModal({ isOpen: false, product: null })}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basmati Rice, Refined Sugar..."
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 kg, 1 L, 500 g"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="text"
                  placeholder="Paste image URL or leave blank for category icon"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description of the grocery product..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModal({ isOpen: false, product: null })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SHOP */}
      {shopModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h2 className="text-base font-bold text-slate-900">
                {shopModal.shop ? 'Edit Shop Details' : 'Register New Shop / Supermarket'}
              </h2>
              <button
                onClick={() => setShopModal({ isOpen: false, shop: null })}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShop} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shop Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Local Mart, More Supermarket..."
                  value={shopForm.name}
                  onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Shop Type</label>
                <select
                  value={shopForm.type}
                  onChange={(e) => setShopForm({ ...shopForm, type: e.target.value as ShopType })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                >
                  <option value="local">Local Kirana / Convenience Mart</option>
                  <option value="supermarket">Physical Supermarket Chain</option>
                  <option value="online">Online Supermarket / Quick Commerce App</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar, Main Market, Bengaluru"
                  value={shopForm.location}
                  onChange={(e) => setShopForm({ ...shopForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98450 12345"
                  value={shopForm.contactPhone}
                  onChange={(e) => setShopForm({ ...shopForm, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website / App / Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. www.mart.in or Near Metro Station"
                  value={shopForm.websiteOrApp}
                  onChange={(e) => setShopForm({ ...shopForm, websiteOrApp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShopModal({ isOpen: false, shop: null })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-sm"
                >
                  Save Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE PRICE */}
      {priceModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h2 className="text-base font-bold text-slate-900">Set Product Price</h2>
              <button
                onClick={() =>
                  setPriceModal({ isOpen: false, productId: '', shopId: '', currentPrice: 0 })
                }
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-4 mt-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Product:</div>
                <div className="text-sm font-bold text-slate-800">
                  {products.find((p) => p.id === priceModal.productId)?.name} (
                  {products.find((p) => p.id === priceModal.productId)?.unit})
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Store:</div>
                <div className="text-sm font-bold text-indigo-700">
                  {shops.find((s) => s.id === priceModal.shopId)?.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Price in INR (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPriceModal({ isOpen: false, productId: '', shopId: '', currentPrice: 0 })
                  }
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-sm"
                >
                  Update Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
