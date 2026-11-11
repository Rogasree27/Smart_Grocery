import React, { useState } from 'react';
import { X, Package, Store, Tag } from 'lucide-react';
import { useGrocery } from '../../context/GroceryContext';
import { CATEGORIES } from '../../data/initialData';
import { ShopType } from '../../types/grocery';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const { products, shops, addProduct, addShop, setPrice } = useGrocery();
  const [tab, setTab] = useState<'price' | 'product' | 'shop'>('price');

  // Quick price form
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [selectedShop, setSelectedShop] = useState(shops[0]?.id || '');
  const [priceVal, setPriceVal] = useState('');

  // Quick product form
  const [prodName, setProdName] = useState('');
  const [prodCat, setProdCat] = useState('Grains & Staples');
  const [prodUnit, setProdUnit] = useState('1 kg');

  // Quick shop form
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState<ShopType>('local');
  const [shopLocation, setShopLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'price') {
      const p = parseFloat(priceVal);
      if (p > 0 && selectedProduct && selectedShop) {
        setPrice(selectedProduct, selectedShop, p);
        onClose();
      }
    } else if (tab === 'product') {
      if (prodName.trim()) {
        addProduct({
          name: prodName.trim(),
          category: prodCat,
          unit: prodUnit.trim() || '1 kg',
          image: '',
          description: 'Added via Smart Grocery quick entry.',
        });
        onClose();
      }
    } else if (tab === 'shop') {
      if (shopName.trim() && shopLocation.trim()) {
        addShop({
          name: shopName.trim(),
          type: shopType,
          location: shopLocation.trim(),
        });
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-purple-100">
          <h2 className="text-base font-bold text-slate-900">Quick Entry Action</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-purple-50 rounded-xl my-4 border border-purple-100">
          <button
            onClick={() => setTab('price')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === 'price' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Update Price
          </button>
          <button
            onClick={() => setTab('product')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === 'product' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            New Product
          </button>
          <button
            onClick={() => setTab('shop')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === 'shop' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            New Shop
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'price' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Store
                </label>
                <select
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400"
                >
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Price in ₹
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
                    placeholder="e.g. 55"
                    value={priceVal}
                    onChange={(e) => setPriceVal(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'product' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brown Eggs, Paneer, Basmati Rice"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={prodCat}
                    onChange={(e) => setProdCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400"
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
                    placeholder="e.g. 1 kg, 500 g"
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'shop' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shop Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nature's Basket, Nilgiris"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                <select
                  value={shopType}
                  onChange={(e) => setShopType(e.target.value as ShopType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400"
                >
                  <option value="local">Local Kirana / Convenience Mart</option>
                  <option value="supermarket">Supermarket Chain</option>
                  <option value="online">Online Supermarket / App</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location / Area *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whitefield, Bengaluru"
                  value={shopLocation}
                  onChange={(e) => setShopLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-sm"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
