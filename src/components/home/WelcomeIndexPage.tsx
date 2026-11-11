import React from 'react';
import {
  Scale,
  ShoppingBag,
  ShieldCheck,
  UserPlus,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Store,
  CheckCircle2,
  Package,
  Receipt,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGrocery } from '../../context/GroceryContext';

export const WelcomeIndexPage: React.FC = () => {
  const { navigate } = useAuth();
  const { stats, shops } = useGrocery();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-100/70 via-purple-50/80 to-indigo-100/60 text-slate-800 antialiased font-sans relative overflow-x-hidden selection:bg-purple-200 selection:text-purple-900">
      {/* Decorative ambient background glassmorphism orbs */}
      <div className="fixed top-12 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-12 right-1/4 w-96 h-96 bg-indigo-300/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-10 w-72 h-72 bg-violet-400/15 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b border-white/80 shadow-xs px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  Smart Grocery
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md">
                  Tracker
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Grocery Price Comparison & Savings Optimizer
              </p>
            </div>
          </div>

          {/* Quick Header Navigation Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/customer-login')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-purple-900 hover:bg-purple-100/60 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
              <span>Customer Sign In</span>
            </button>
            <button
              onClick={() => navigate('/admin-login')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-16 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-xs font-semibold text-purple-800 border border-purple-200/60 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Smart Grocery Price Comparison Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight sm:leading-tight mb-4 text-balance">
            Compare Grocery Prices & Stop Overpaying
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Find the lowest prices across local neighborhood kirana marts, regional supermarkets, and quick-delivery online stores. Optimize your entire grocery shopping basket to maximize monthly savings.
          </p>

          {/* Live highlight badge strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold text-purple-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {stats.totalProducts} Grocery Staples Tracked
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5 font-semibold text-purple-900">
              <Store className="w-4 h-4 text-indigo-600" />
              {stats.totalShops} Monitored Stores
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              Save up to {stats.averageSavingsPercent || 18}% per item
            </span>
          </div>
        </div>

        {/* Dual Entrance Cards: Customer & Admin Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
          {/* Card 1: Customer Portal Entrance */}
          <div className="p-7 sm:p-8 rounded-3xl backdrop-blur-2xl bg-white/80 border border-white/90 shadow-xl shadow-purple-900/10 hover:shadow-2xl hover:border-purple-200 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                  Shoppers
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                Customer Portal
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Compare grocery prices across shops, identify the cheapest store, build shopping checklists, and analyze total basket savings.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Side-by-side grocery price comparisons</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cheapest single store vs optimal split basket</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Printable grocery shopping checklist</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-purple-100/70">
              <button
                onClick={() => navigate('/customer-login')}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Customer Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <p className="text-xs text-slate-500">
                  New customer?{' '}
                  <button
                    onClick={() => navigate('/customer-register')}
                    className="font-bold text-purple-700 hover:text-purple-900 hover:underline transition-colors cursor-pointer"
                  >
                    Register an Account
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Admin Portal Entrance */}
          <div className="p-7 sm:p-8 rounded-3xl backdrop-blur-2xl bg-white/80 border border-white/90 shadow-xl shadow-purple-900/10 hover:shadow-2xl hover:border-indigo-200 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-700 via-purple-700 to-slate-900 text-white flex items-center justify-center shadow-lg shadow-indigo-900/30 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
                  Management
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                Admin Dashboard
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Restricted access for store managers and inventory administrators to configure products, shops, and live prices.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Add, edit, and delete grocery products</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Register local shops & online supermarkets</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Interactive multi-shop price matrix & live updates</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-purple-100/70">
              <button
                onClick={() => navigate('/admin-login')}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-700 to-slate-900 hover:from-indigo-800 hover:to-slate-950 shadow-md shadow-indigo-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Admin Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <p className="text-xs text-slate-500 font-mono">
                  Demo credentials: admin@smartgrocery.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 pt-12 border-t border-purple-200/50">
          <div className="text-center mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-900">
              How Smart Grocery Saves Money
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white/60 border border-white/80 shadow-sm backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Scale className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                1. Side-by-Side Comparison
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compare price per kg or liter for rice, sugar, milk, and cooking oil across 4 different stores.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/60 border border-white/80 shadow-sm backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                2. Lowest Price Indicator
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Clear green badges identify the absolute cheapest store for every staple, with exact rupee savings.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/60 border border-white/80 shadow-sm backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Receipt className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                3. Smart Basket Optimizer
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compare the checkout cost of your entire shopping list if bought at a single store vs. splitting purchases.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-purple-100/80 backdrop-blur-md bg-white/40 py-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-slate-700">
              Smart Grocery – Grocery Price Comparison Tracker
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Browser LocalStorage Data Persistence</span>
            <span>·</span>
            <span>No External Database Required</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
