import React from 'react';
import {
  Package,
  Store,
  Tag,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Scale,
  Plus,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useGrocery } from '../../context/GroceryContext';
import { useAuth } from '../../context/AuthContext';
import { NavTab } from '../layout/Sidebar';
import { ProductImage } from '../common/ProductImage';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenAddModal }) => {
  const { products, shops, prices, stats, allComparisons, addToCart, cart } = useGrocery();
  const { role } = useAuth();

  // Top Deals: Sort comparisons by max savings percentage descending
  const topDeals = [...allComparisons]
    .filter((comp) => comp.maxSavings > 0)
    .sort((a, b) => b.maxSavingsPercentage - a.maxSavingsPercentage)
    .slice(0, 4);

  // Category counts
  const categoryMap = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Shop average pricing for comparison chart
  const shopAverages = shops.map((shop) => {
    const shopPrices = prices.filter((p) => p.shopId === shop.id && p.inStock);
    const avg =
      shopPrices.length > 0
        ? Math.round(shopPrices.reduce((sum, item) => sum + item.price, 0) / shopPrices.length)
        : 0;
    return {
      shop,
      avgPrice: avg,
      itemCount: shopPrices.length,
    };
  });

  const lowestAvgPrice = Math.min(
    ...shopAverages.filter((s) => s.avgPrice > 0).map((s) => s.avgPrice)
  );
  const highestAvgPrice = Math.max(...shopAverages.map((s) => s.avgPrice));

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Quick Pitch */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-indigo-700/90 text-white shadow-xl shadow-purple-900/10 border border-white/20">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Smart Grocery Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2 text-balance">
            Stop Overpaying for Daily Groceries.
          </h1>
          <p className="text-sm sm:text-base text-purple-100 font-normal leading-relaxed max-w-2xl mb-6">
            Instantly compare identical grocery products across neighborhood kirana shops, local supermarkets, and quick-commerce online platforms to pocket up to {stats.averageSavingsPercent || 18}% in direct household savings.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('comparison')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-purple-50 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              Compare All Prices
            </button>
            <button
              onClick={() => onNavigate('shopping')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 text-white border border-white/30 text-xs sm:text-sm font-semibold backdrop-blur-md transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Open Smart Shopping List ({cart.length})
            </button>
            {role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-transparent hover:bg-white/10 text-purple-100 hover:text-white text-xs sm:text-sm font-medium transition-colors"
              >
                <Store className="w-4 h-4" />
                Manage Shops & Products
              </button>
            )}
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute -right-12 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/4 -top-12 w-48 h-48 bg-purple-300/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Total Products */}
        <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-md shadow-purple-900/5 transition-all hover:shadow-lg hover:border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tracked Products
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {stats.totalProducts}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Across</span>
            <span className="font-semibold text-purple-700">{Object.keys(categoryMap).length} categories</span>
          </div>
        </div>

        {/* Stat 2: Total Shops */}
        <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-md shadow-purple-900/5 transition-all hover:shadow-lg hover:border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monitored Shops
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {stats.totalShops}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-indigo-600 font-medium">Local Marts</span>
            <span>·</span>
            <span className="text-purple-600 font-medium">Supermarkets</span>
            <span>·</span>
            <span className="text-sky-600 font-medium">Online</span>
          </div>
        </div>

        {/* Stat 3: Total Price Entries */}
        <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-md shadow-purple-900/5 transition-all hover:shadow-lg hover:border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Price Points
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {stats.totalPriceEntries}
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Real-time Indian Rupee (₹)</span>
          </div>
        </div>

        {/* Stat 4: Potential Catalogue Savings */}
        <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-md shadow-purple-900/5 transition-all hover:shadow-lg hover:border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Max Item Savings
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
            ₹{stats.totalCatalogueSavings}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Avg</span>
            <span className="font-semibold text-emerald-700">{stats.averageSavingsPercent}% price gap</span>
            <span>per item</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Visual Shop Price Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Shop Price Comparison Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl backdrop-blur-xl bg-white/75 border border-white/80 shadow-lg shadow-purple-900/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Average Grocery Basket by Shop
              </h2>
              <p className="text-xs text-slate-500">
                Benchmark price index across all tracked grocery staples
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/50 self-start sm:self-auto">
              Updated Live
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="space-y-4 pt-2">
            {shopAverages.map((item) => {
              const isBest = item.avgPrice === lowestAvgPrice;
              // Calculate width percentage relative to highest average
              const percent = highestAvgPrice > 0 ? (item.avgPrice / highestAvgPrice) * 100 : 0;

              return (
                <div key={item.shop.id} className="group">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{item.shop.name}</span>
                      <span className="text-[10px] text-slate-600 uppercase font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.shop.type}
                      </span>
                      {isBest && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          Cheapest Store
                        </span>
                      )}
                    </div>
                    <div className="font-mono tabular-nums text-right">
                      <span className="font-bold text-slate-900 text-sm">₹{item.avgPrice}</span>
                      <span className="text-slate-600 text-[11px] ml-1">avg/item</span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 flex items-center">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isBest
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xs'
                          : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                      }`}
                      style={{ width: `${Math.max(15, percent)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                    <span>{item.shop.location}</span>
                    <span>{item.itemCount} items listed</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-purple-100/60 flex items-center justify-between text-xs text-slate-600">
            <span>Cheapest single shop offers average savings vs the most expensive store</span>
            <button
              onClick={() => onNavigate('comparison')}
              className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
            >
              See product breakdowns <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Product Category Overview */}
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/75 border border-white/80 shadow-lg shadow-purple-900/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Categories</h2>
                <p className="text-xs text-slate-500">Inventory distribution</p>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {products.length} products
              </span>
            </div>

            <div className="space-y-2.5">
              {Object.entries(categoryMap).map(([category, count]) => {
                const pct = Math.round((count / products.length) * 100);
                return (
                  <div
                    key={category}
                    className="p-2.5 rounded-xl bg-purple-50/40 hover:bg-purple-100/40 transition-colors border border-purple-100/50"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800">{category}</span>
                      <span className="font-mono text-purple-700 font-bold">{count} items</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-purple-100/60">
            <button
              onClick={onOpenAddModal}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Product or Category
            </button>
          </div>
        </div>
      </div>

      {/* Cheapest Grocery Deals Spotlight */}
      <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/75 border border-white/80 shadow-lg shadow-purple-900/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-lg font-bold text-slate-900">Cheapest Grocery Deals</h2>
            </div>
            <p className="text-xs text-slate-500">
              Highest price discrepancies across shops right now — buy here to maximize savings
            </p>
          </div>
          <button
            onClick={() => onNavigate('comparison')}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            View all {allComparisons.length} products <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topDeals.map((deal) => {
            const inCart = cart.some((c) => c.productId === deal.product.id);

            return (
              <div
                key={deal.product.id}
                className="group relative rounded-2xl bg-white/80 border border-purple-100/80 p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top image thumbnail */}
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                    <ProductImage
                      src={deal.product.image}
                      alt={deal.product.name}
                      category={deal.product.category}
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      Save ₹{deal.maxSavings} ({deal.maxSavingsPercentage}%)
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="text-[11px] text-purple-600 font-medium mb-0.5">
                    {deal.product.category} · {deal.product.unit}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-purple-700 transition-colors">
                    {deal.product.name}
                  </h3>

                  {/* Price info */}
                  <div className="mt-3 p-2.5 rounded-xl bg-purple-50/50 border border-purple-100/50">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500">Cheapest at:</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {deal.cheapestShop?.name}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg font-extrabold text-emerald-700 font-mono">
                        ₹{deal.lowestPrice}
                      </span>
                      <span className="text-xs text-slate-600 line-through font-mono">
                        ₹{deal.highestPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {deal.shopPrices.length} shops compare
                  </span>
                  <button
                    onClick={() => addToCart(deal.product.id, 1)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      inCart
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-95 shadow-xs'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{inCart ? 'Added' : 'Add to List'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Cards to All Three Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigate('comparison')}
          className="p-6 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-md shadow-purple-900/5 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center justify-between">
            <span>Price Comparison</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Side-by-side shop price comparisons, highlighted cheapest options, and live price difference calculations for all groceries.
          </p>
        </div>

        <div
          onClick={() => onNavigate('shopping')}
          className="p-6 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-md shadow-purple-900/5 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center justify-between">
            <span>Shopping List & Savings</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-violet-600 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Basket optimization comparing single store totals vs optimal multi-store split to maximize monthly household grocery savings.
          </p>
        </div>

        {role === 'admin' ? (
          <div
            onClick={() => onNavigate('admin')}
            className="p-6 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-md shadow-purple-900/5 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>Shop & Price Admin</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-800 transition-all" />
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Add new local supermarkets, online delivery services, grocery items, and update live prices in the central price matrix.
            </p>
          </div>
        ) : (
          <div
            onClick={() => onNavigate('comparison')}
            className="p-6 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-md shadow-purple-900/5 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>Smart Deals Finder</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-800 transition-all" />
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Discover which neighborhood store or online app currently offers the cheapest staple groceries to pocket maximum monthly savings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
