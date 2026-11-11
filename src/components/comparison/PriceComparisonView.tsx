import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Scale,
  Plus,
  Minus,
  Check,
  TrendingDown,
  Store,
  ChevronDown,
  ArrowUpDown,
  Tag,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useGrocery } from '../../context/GroceryContext';
import { ProductImage } from '../common/ProductImage';
import { CATEGORIES } from '../../data/initialData';

export const PriceComparisonView: React.FC = () => {
  const { allComparisons, addToCart, cart, shops } = useGrocery();

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState<'savings' | 'price-asc' | 'name'>('savings');

  // Quantity selection tracker for adding to cart
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQtyChange = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  // Filtered and sorted comparisons
  const filteredComparisons = useMemo(() => {
    return allComparisons
      .filter((comp) => {
        const matchesSearch =
          comp.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comp.product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All Categories' || comp.product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'savings') {
          return b.maxSavings - a.maxSavings;
        } else if (sortBy === 'price-asc') {
          return a.lowestPrice - b.lowestPrice;
        } else {
          return a.product.name.localeCompare(b.product.name);
        }
      });
  }, [allComparisons, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/75 border border-white/80 shadow-lg shadow-purple-900/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-md mb-2">
              <Scale className="w-3.5 h-3.5" />
              Customer Grocery Price Comparator
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Compare Grocery Prices Across All Stores
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Side-by-side pricing from local kirana stores, regional supermarkets, and fast online delivery apps.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-purple-50/80 border border-purple-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
            >
              <option value="savings">Highest Savings First</option>
              <option value="price-asc">Cheapest Price First</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-4 border-t border-purple-100/60 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name (e.g., Basmati Rice, Milk, Cooking Oil)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-purple-200/80 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-400 transition-all shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-3 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs'
                    : 'bg-white/80 hover:bg-purple-100/70 text-slate-600 border border-purple-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid Results */}
      {filteredComparisons.length === 0 ? (
        <div className="p-12 text-center rounded-3xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-md">
          <Scale className="w-10 h-10 text-purple-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or select "All Categories" to see available items.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredComparisons.map((comp) => {
            const qty = quantities[comp.product.id] || 1;
            const inCart = cart.find((item) => item.productId === comp.product.id);

            return (
              <div
                key={comp.product.id}
                className="flex flex-col justify-between rounded-3xl backdrop-blur-xl bg-white/80 border border-white/90 p-5 sm:p-6 shadow-md shadow-purple-900/5 hover:shadow-xl hover:border-purple-200 transition-all duration-300"
              >
                <div>
                  {/* Top Product Header Row */}
                  <div className="flex gap-4 items-start mb-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 relative shadow-xs">
                      <ProductImage
                        src={comp.product.image}
                        alt={comp.product.name}
                        category={comp.product.category}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-purple-700 font-semibold mb-0.5">
                        <span>{comp.product.category}</span>
                        <span>·</span>
                        <span className="font-mono bg-purple-100/70 px-1.5 py-0.2 rounded text-purple-800">
                          {comp.product.unit}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug line-clamp-1">
                        {comp.product.name}
                      </h2>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {comp.product.description}
                      </p>

                      {/* Savings summary callout */}
                      {comp.maxSavings > 0 && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            Save up to ₹{comp.maxSavings} ({comp.maxSavingsPercentage}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Store Price Table - Sorted Lowest to Highest */}
                  <div className="mt-4 border-t border-purple-100/60 pt-3">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                      <span>Store / Supermarket</span>
                      <span>Price ({comp.product.unit})</span>
                    </div>

                    <div className="space-y-2">
                      {comp.shopPrices.map((sp) => {
                        return (
                          <div
                            key={sp.shop.id}
                            className={`p-2.5 rounded-xl transition-colors flex items-center justify-between ${
                              sp.isLowest
                                ? 'bg-emerald-50/80 border border-emerald-200/80 shadow-xs'
                                : 'bg-slate-50/70 border border-slate-100 hover:bg-purple-50/40'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  sp.isLowest ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-800 truncate">
                                    {sp.shop.name}
                                  </span>
                                  {sp.isLowest && (
                                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-md tracking-tight uppercase">
                                      Cheapest Option
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-600 truncate">
                                  {sp.shop.location} · {sp.shop.type}
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0 ml-2">
                              <div className="flex items-baseline gap-1 justify-end">
                                <span
                                  className={`text-sm sm:text-base font-extrabold font-mono tabular-nums ${
                                    sp.isLowest ? 'text-emerald-700' : 'text-slate-900'
                                  }`}
                                >
                                  ₹{sp.price}
                                </span>
                              </div>
                              {sp.priceDiffFromLowest > 0 && (
                                <span className="text-[10px] font-mono text-slate-600">
                                  +₹{sp.priceDiffFromLowest} ({sp.priceDiffPercentage}%)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Cart Action Bar */}
                <div className="mt-5 pt-3 border-t border-purple-100/60 flex items-center justify-between gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-xl bg-purple-50/80 border border-purple-200/60 p-1">
                    <button
                      onClick={() => handleQtyChange(comp.product.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-purple-100 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-mono font-bold text-slate-800">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleQtyChange(comp.product.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-purple-100 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add / Update Cart CTA */}
                  <button
                    onClick={() => addToCart(comp.product.id, qty)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>
                      {inCart ? `Add More (${inCart.quantity} in list)` : 'Add to Shopping List'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
