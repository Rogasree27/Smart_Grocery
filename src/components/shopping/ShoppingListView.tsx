import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  TrendingDown,
  Store,
  CheckCircle2,
  ArrowRight,
  Printer,
  RotateCcw,
  AlertTriangle,
  Receipt,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useGrocery } from '../../context/GroceryContext';
import { ProductImage } from '../common/ProductImage';

export const ShoppingListView: React.FC<{ onNavigateToCompare: () => void }> = ({
  onNavigateToCompare,
}) => {
  const {
    cart,
    products,
    shops,
    prices,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getProductPriceComparison,
    basketAnalysis,
    addToCart,
  } = useGrocery();

  // Interactive in-store checklist state (checkboxes)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Products available to add quickly that are not yet in cart
  const unaddedProducts = products.filter(
    (p) => !cart.some((c) => c.productId === p.id)
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/75 border border-white/80 shadow-lg shadow-purple-900/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-md mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              Smart Basket & Savings Optimizer
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              My Shopping List & Multi-Store Savings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Compare your entire cart total across stores to see how much you save by picking the cheapest shop.
            </p>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold border border-purple-200 transition-colors"
                title="Print shopping list"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print Checklist</span>
              </button>
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                title="Clear all items"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear List</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      {cart.length === 0 ? (
        <div className="p-12 text-center rounded-3xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your shopping list is empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
            Add items from the grocery comparison catalog to automatically calculate the lowest store totals and potential savings.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={onNavigateToCompare}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 hover:opacity-95 transition-all"
            >
              Browse Grocery Catalog
            </button>
          </div>

          {/* Quick Add Section */}
          {products.length > 0 && (
            <div className="mt-10 pt-8 border-t border-purple-100/60 max-w-2xl mx-auto">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Popular Items to Start With
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.slice(0, 6).map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => addToCart(prod.id, 1)}
                    className="p-3 rounded-xl bg-white hover:bg-purple-50/60 border border-purple-100 text-left transition-all group flex items-center gap-2.5"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <ProductImage src={prod.image} alt={prod.name} category={prod.category} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800 truncate group-hover:text-purple-700">
                        {prod.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{prod.unit}</div>
                    </div>
                    <Plus className="w-4 h-4 text-purple-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/75 border border-white/80 shadow-lg shadow-purple-900/5">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-purple-100/60">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Items in Shopping List</h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {basketAnalysis.totalItems} products · {basketAnalysis.totalQuantity} units
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Click checkbox when bought
                </span>
              </div>

              <div className="divide-y divide-purple-100/60">
                {cart.map((item) => {
                  const comp = getProductPriceComparison(item.productId);
                  if (!comp) return null;

                  const isChecked = checkedItems[item.productId] || false;
                  const itemCheapestTotal = comp.lowestPrice * item.quantity;
                  const itemHighestTotal = comp.highestPrice * item.quantity;
                  const itemSavings = itemHighestTotal - itemCheapestTotal;

                  return (
                    <div
                      key={item.productId}
                      className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-opacity ${
                        isChecked ? 'opacity-50' : 'opacity-100'
                      }`}
                    >
                      {/* Checkbox & Thumbnail & Title */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => toggleCheck(item.productId)}
                          className="text-purple-600 hover:text-purple-800 transition-colors shrink-0"
                          title={isChecked ? 'Mark unbought' : 'Mark bought'}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400 hover:text-purple-600" />
                          )}
                        </button>

                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          <ProductImage
                            src={comp.product.image}
                            alt={comp.product.name}
                            category={comp.product.category}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`text-sm font-bold text-slate-900 truncate ${
                                isChecked ? 'line-through text-slate-500' : ''
                              }`}
                            >
                              {comp.product.name}
                            </h3>
                            <span className="text-[10px] text-purple-700 bg-purple-100/60 font-semibold px-1.5 py-0.2 rounded">
                              {comp.product.unit}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                            <span>Cheapest at:</span>
                            <span className="font-semibold text-emerald-700">
                              {comp.cheapestShop?.name} (₹{comp.lowestPrice})
                            </span>
                            {itemSavings > 0 && (
                              <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                                Save ₹{itemSavings}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Cost */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-8 sm:pl-0">
                        {/* Stepper */}
                        <div className="flex items-center rounded-xl bg-purple-50/80 border border-purple-200/60 p-1">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-purple-100 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-mono font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-purple-100 text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Calculated Subtotal */}
                        <div className="text-right min-w-[70px]">
                          <div className="text-sm font-extrabold text-slate-900 font-mono">
                            ₹{itemCheapestTotal}
                          </div>
                          {itemSavings > 0 && (
                            <div className="text-[10px] text-slate-600 line-through font-mono">
                              ₹{itemHighestTotal}
                            </div>
                          )}
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Add More Available Products */}
            {unaddedProducts.length > 0 && (
              <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-sm">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Add More Items to Basket
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {unaddedProducts.map((p) => {
                    const comp = getProductPriceComparison(p.id);
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-purple-50/40 border border-purple-100/50 hover:bg-purple-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            <ProductImage src={p.image} alt={p.name} category={p.category} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 truncate">{p.name}</div>
                            <div className="text-[10px] text-slate-500">
                              From ₹{comp?.lowestPrice} · {p.unit}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(p.id, 1)}
                          className="p-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors shrink-0 shadow-xs"
                          title="Add to list"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right 1 Col: Savings Analysis & Store by Store Comparison */}
          <div className="space-y-6">
            {/* Savings Summary Card */}
            <div className="p-6 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-purple-900/15 border border-white/20">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Savings Analysis Summary</span>
              </div>

              <div className="mb-4">
                <span className="text-xs text-purple-200 uppercase font-medium tracking-wider">
                  Cheapest Possible Total
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white mt-0.5">
                  ₹{basketAnalysis.splitOptimalCost}
                </div>
                <p className="text-[11px] text-purple-200 mt-1">
                  Buying each item from its respective cheapest store
                </p>
              </div>

              {basketAnalysis.maxPotentialSavings > 0 && (
                <div className="pt-3 border-t border-white/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-200">Max Possible Savings:</span>
                    <span className="font-extrabold text-emerald-300 font-mono text-sm">
                      ₹{basketAnalysis.maxPotentialSavings}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-200">Highest Store Total:</span>
                    <span className="line-through text-purple-300 font-mono">
                      ₹{basketAnalysis.highestSingleShopCost}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Store by Store Basket Cost Comparison */}
            <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/75 border border-white/80 shadow-lg shadow-purple-900/5">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-purple-100/60">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Store-by-Store Total</h3>
                  <p className="text-[11px] text-slate-500">
                    If you buy your entire basket at one store:
                  </p>
                </div>
                <Store className="w-4 h-4 text-purple-600" />
              </div>

              <div className="space-y-3">
                {basketAnalysis.singleShopComparisons.map((item) => {
                  return (
                    <div
                      key={item.shop.id}
                      className={`p-3.5 rounded-2xl transition-all ${
                        item.isCheapest
                          ? 'bg-emerald-50/90 border border-emerald-200 shadow-sm'
                          : 'bg-slate-50/70 border border-slate-100 hover:bg-purple-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">
                            {item.shop.name}
                          </span>
                          {item.isCheapest && (
                            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                              Best Single Store
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-sm font-extrabold font-mono tabular-nums ${
                            item.isCheapest ? 'text-emerald-700' : 'text-slate-900'
                          }`}
                        >
                          ₹{item.totalCost}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{item.shop.type} · {item.shop.location}</span>
                        {item.savingsVsHighest > 0 ? (
                          <span className="text-emerald-600 font-medium">
                            Save ₹{item.savingsVsHighest}
                          </span>
                        ) : (
                          <span className="text-slate-600">Highest Cost</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {basketAnalysis.cheapestSingleShop && (
                <div className="mt-5 p-3 rounded-xl bg-purple-50/70 border border-purple-200/60 text-xs text-purple-900">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                    <span>Smart Recommendation:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    If you prefer a single trip, shop at{' '}
                    <strong className="text-purple-900">
                      {basketAnalysis.cheapestSingleShop.shop.name}
                    </strong>{' '}
                    for ₹{basketAnalysis.cheapestSingleShop.totalCost} total. Or split between stores to pay just{' '}
                    <strong className="text-emerald-700">
                      ₹{basketAnalysis.splitOptimalCost}
                    </strong>{' '}
                    (extra ₹
                    {basketAnalysis.cheapestSingleShop.totalCost -
                      basketAnalysis.splitOptimalCost}{' '}
                    saved)!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
