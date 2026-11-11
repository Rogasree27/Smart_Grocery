import React, { useState } from 'react';
import { Menu, ShoppingBag, PlusCircle, LogOut, ShieldCheck, User } from 'lucide-react';
import { NavTab } from './Sidebar';
import { useGrocery } from '../../context/GroceryContext';
import { useAuth } from '../../context/AuthContext';
import { LogoutConfirmModal } from '../common/LogoutConfirmModal';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSidebar: () => void;
  onOpenQuickAddModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSidebar,
  onOpenQuickAddModal,
}) => {
  const { cart, basketAnalysis } = useGrocery();
  const { role, currentUser, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Customer Dashboard & Deals';
      case 'comparison':
        return 'Grocery Price Comparison';
      case 'shopping':
        return 'Shopping List & Savings';
      case 'admin':
        return 'Admin Portal Dashboard';
      case 'admin-products':
        return 'Admin / Products Inventory';
      case 'admin-shops':
        return 'Admin / Shop Locations';
      case 'admin-prices':
        return 'Admin / Price Matrix & Updates';
      default:
        return 'Smart Grocery';
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b border-white/80 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Zone 1: Mobile toggle & Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-purple-100/60 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap">
            {getBreadcrumbTitle()}
          </span>
          <span
            className={`hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              role === 'admin'
                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                : 'bg-purple-100/70 text-purple-700'
            }`}
          >
            {role === 'admin' ? 'Admin Mode' : 'Customer Mode'}
          </span>
        </div>
      </div>

      {/* Zone 2: Contextual Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
        {role === 'customer' ? (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-purple-700 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard' ? 'text-purple-700 font-semibold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`hover:text-purple-700 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'comparison' ? 'text-purple-700 font-semibold' : ''
              }`}
            >
              Compare Prices
            </button>
            <button
              onClick={() => setActiveTab('shopping')}
              className={`hover:text-purple-700 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'shopping' ? 'text-purple-700 font-semibold' : ''
              }`}
            >
              Shopping List
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('admin')}
              className={`hover:text-purple-700 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'admin' ? 'text-purple-700 font-semibold' : ''
              }`}
            >
              Admin Overview
            </button>
            <button
              onClick={() => setActiveTab('admin-products')}
              className={`hover:text-purple-700 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'admin-products' ? 'text-purple-700 font-semibold' : ''
              }`}
            >
              Manage Products
            </button>
            <button
              onClick={() => setActiveTab('admin-shops')}
              className={`hover:text-purple-700 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'admin-shops' ? 'text-purple-700 font-semibold' : ''
              }`}
            >
              Manage Shops
            </button>
            <button
              onClick={() => setActiveTab('admin-prices')}
              className={`hover:text-purple-700 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'admin-prices' ? 'text-purple-700 font-semibold' : ''
              }`}
            >
              Price Matrix
            </button>
          </>
        )}
      </nav>

      {/* Zone 3: Primary Actions & User Status */}
      <div className="flex items-center gap-2.5 shrink-0">
        {role === 'customer' && (
          <button
            onClick={() => setActiveTab('shopping')}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-purple-900 text-xs font-semibold border border-purple-200/60 transition-colors cursor-pointer"
            title="Open Shopping List"
          >
            <ShoppingBag className="w-4 h-4 text-purple-700" />
            <span className="hidden sm:inline">My Basket</span>
            {cart.length > 0 && (
              <span className="px-1.5 py-0.2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-mono text-[11px] rounded-full font-bold">
                {cart.length}
              </span>
            )}
            {basketAnalysis.splitOptimalCost > 0 && (
              <span className="hidden lg:inline text-[11px] font-mono text-emerald-700 font-bold ml-1">
                ₹{basketAnalysis.splitOptimalCost}
              </span>
            )}
          </button>
        )}

        {/* Role-specific Actions & User Profile */}
        {role === 'admin' ? (
          <div className="flex items-center gap-3">
            {/* Quick Add Entry shortcut */}
            {onOpenQuickAddModal && (
              <button
                onClick={onOpenQuickAddModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-sm shadow-indigo-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Entry</span>
              </button>
            )}

            {/* Admin Profile Section */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-purple-50/80 border border-purple-200/70 text-slate-800">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight max-w-[130px] truncate">
                  {currentUser?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-purple-700 font-semibold leading-none">
                  Admin Profile
                </div>
              </div>
            </div>

            {/* Clearly Visible Admin Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 hover:text-rose-800 border border-rose-200/90 shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Logout from Admin Dashboard"
            >
              <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 pl-2 border-l border-purple-200/60">
            <span className="hidden sm:inline text-xs font-semibold text-slate-700 max-w-[120px] truncate">
              {currentUser?.name}
            </span>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
        role={role}
      />
    </header>
  );
};
