import React, { useState } from 'react';
import {
  LayoutDashboard,
  Scale,
  ShoppingCart,
  Store,
  Package,
  TrendingDown,
  RotateCcw,
  Tag,
  ChevronRight,
  ShieldCheck,
  LogOut,
  User,
  SlidersHorizontal,
} from 'lucide-react';
import { useGrocery } from '../../context/GroceryContext';
import { useAuth } from '../../context/AuthContext';
import { LogoutConfirmModal } from '../common/LogoutConfirmModal';

export type NavTab =
  | 'dashboard'
  | 'comparison'
  | 'shopping'
  | 'admin'
  | 'admin-products'
  | 'admin-shops'
  | 'admin-prices';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) => {
  const { cart, stats, resetToDefaultData } = useGrocery();
  const { role, currentUser, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Role-based navigation items
  const customerNavItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Analytics, deals & insights',
    },
    {
      id: 'comparison' as NavTab,
      label: 'Price Comparison',
      icon: Scale,
      badge: `${stats.totalProducts} items`,
      description: 'Compare shop vs shop',
    },
    {
      id: 'shopping' as NavTab,
      label: 'Shopping & Savings',
      icon: ShoppingCart,
      badge: cart.length > 0 ? `${cart.length}` : null,
      description: 'Basket optimizer & checklist',
    },
  ];

  const adminNavItems = [
    {
      id: 'admin' as NavTab,
      label: 'Admin Overview',
      icon: LayoutDashboard,
      badge: 'Admin',
      description: 'Statistics & matrix summary',
    },
    {
      id: 'admin-products' as NavTab,
      label: 'Products Management',
      icon: Package,
      badge: `${stats.totalProducts}`,
      description: 'Add, edit & delete items',
    },
    {
      id: 'admin-shops' as NavTab,
      label: 'Shops & Supermarkets',
      icon: Store,
      badge: `${stats.totalShops}`,
      description: 'Manage store locations',
    },
    {
      id: 'admin-prices' as NavTab,
      label: 'Price Matrix',
      icon: Tag,
      badge: `${stats.totalPriceEntries}`,
      description: 'Update live grocery rates',
    },
  ];

  const navItems = role === 'admin' ? adminNavItems : customerNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col backdrop-blur-xl bg-white/80 border-r border-white/80 shadow-xl shadow-purple-900/5`}
      >
        {/* Brand Lockup */}
        <div className="p-6 border-b border-purple-100/60">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
                role === 'admin'
                  ? 'bg-gradient-to-tr from-indigo-700 via-purple-700 to-indigo-800 shadow-indigo-700/30'
                  : 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 shadow-indigo-500/25'
              }`}
            >
              {role === 'admin' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <Scale className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  Smart Grocery
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                    role === 'admin'
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {role === 'admin' ? 'Admin' : 'Shopper'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {role === 'admin' ? 'Management Console' : 'Price Comparison Engine'}
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Info Card in Sidebar */}
        <div className="px-4 pt-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50/80 to-indigo-50/50 border border-purple-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentUser?.name || 'Logged in user'}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {currentUser?.email}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Savings Callout Banner (shown to customer) */}
        {role === 'customer' && (
          <div className="px-4 pt-3">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-violet-600/10 via-purple-600/5 to-indigo-600/10 border border-purple-200/50 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                  Live Potential Savings
                </span>
                <span className="text-emerald-700 font-mono font-bold">
                  ₹{stats.totalCatalogueSavings}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Compare {stats.totalPriceEntries} prices across {stats.totalShops} local & online stores.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {role === 'admin' ? 'Admin Modules' : 'Customer Navigation'}
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full group text-left px-3.5 py-3 rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-600/20 font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-purple-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white/80 text-purple-700 group-hover:bg-purple-200/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-tight leading-tight">
                      {item.label}
                    </div>
                    <div
                      className={`text-[11px] leading-tight ${
                        isActive ? 'text-purple-100' : 'text-slate-500'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-indigo-700 font-bold'
                          : item.badge === 'Admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer Area with Logout & Sample Data */}
        <div className="p-4 border-t border-purple-100/60 space-y-2">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  'Restore initial 6 products, 4 shops, and 24 sample price entries?'
                )
              ) {
                resetToDefaultData();
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-medium text-slate-500 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Sample Data
          </button>
        </div>
      </aside>

      {/* Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
        role={role}
      />
    </>
  );
};
