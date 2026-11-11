/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GroceryProvider } from './context/GroceryContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { PriceComparisonView } from './components/comparison/PriceComparisonView';
import { ShoppingListView } from './components/shopping/ShoppingListView';
import { AdminManagementView } from './components/admin/AdminManagementView';
import { WelcomeIndexPage } from './components/home/WelcomeIndexPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { CustomerLoginPage } from './components/auth/CustomerLoginPage';
import { CustomerRegisterPage } from './components/auth/CustomerRegisterPage';
import { QuickAddModal } from './components/common/QuickAddModal';
import { Scale, ShieldCheck } from 'lucide-react';

function MainApp() {
  const { isAuthenticated, role, currentPath, navigate } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    return role === 'admin' ? 'admin' : 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // Sync activeTab & route protection when role or currentPath changes
  useEffect(() => {
    if (!isAuthenticated) return;

    if (role === 'admin') {
      // If admin lands on index or login pages, automatically route to /admin
      if (['/', '/admin-login', '/customer-login', '/customer-register', '/dashboard', '/comparison', '/shopping'].includes(currentPath)) {
        setActiveTab('admin');
        if (currentPath !== '/admin') {
          navigate('/admin');
        }
        return;
      }

      if (currentPath === '/admin-products') setActiveTab('admin-products');
      else if (currentPath === '/admin-shops') setActiveTab('admin-shops');
      else if (currentPath === '/admin-prices') setActiveTab('admin-prices');
      else setActiveTab('admin');
    } else if (role === 'customer') {
      // If customer lands on index, login or admin pages, route to /dashboard
      if (['/', '/customer-login', '/admin-login', '/customer-register', '/admin', '/admin-products', '/admin-shops', '/admin-prices'].includes(currentPath)) {
        setActiveTab('dashboard');
        if (currentPath !== '/dashboard') {
          navigate('/dashboard');
        }
        return;
      }

      if (currentPath === '/comparison') setActiveTab('comparison');
      else if (currentPath === '/shopping') setActiveTab('shopping');
      else setActiveTab('dashboard');
    }
  }, [role, isAuthenticated, currentPath]);

  // If user is not authenticated: render the respective view
  if (!isAuthenticated) {
    if (currentPath === '/admin-login') {
      return <AdminLoginPage />;
    }
    if (currentPath === '/customer-login') {
      return <CustomerLoginPage />;
    }
    if (currentPath === '/customer-register') {
      return <CustomerRegisterPage />;
    }
    // Main entry route is the common Welcome Index Page (/)
    return <WelcomeIndexPage />;
  }

  // Handle tab change with URL update
  const handleTabChange = (tab: NavTab) => {
    // Role protection: Customer cannot switch to admin
    if (role === 'customer' && ['admin', 'admin-products', 'admin-shops', 'admin-prices'].includes(tab)) {
      setActiveTab('dashboard');
      navigate('/dashboard');
      return;
    }

    // Role protection: Admin cannot switch to customer-only shopping list
    if (role === 'admin' && ['comparison', 'shopping'].includes(tab)) {
      setActiveTab('admin');
      navigate('/admin');
      return;
    }

    setActiveTab(tab);
    if (tab === 'dashboard') navigate('/dashboard');
    else if (tab === 'comparison') navigate('/comparison');
    else if (tab === 'shopping') navigate('/shopping');
    else if (tab === 'admin') navigate('/admin');
    else if (tab === 'admin-products') navigate('/admin-products');
    else if (tab === 'admin-shops') navigate('/admin-shops');
    else if (tab === 'admin-prices') navigate('/admin-prices');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-100/50 via-purple-50/60 to-indigo-50/70 text-slate-800 antialiased font-sans relative overflow-x-hidden">
      {/* Decorative ambient glassmorphism orbs in background */}
      <div className="fixed top-10 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-1/3 w-64 h-64 bg-violet-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Layout with 288px (w-72) offset on desktop */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        <Header
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenQuickAddModal={() => setQuickAddOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
          {/* Customer views */}
          {role === 'customer' && activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => handleTabChange(tab)}
              onOpenAddModal={() => setQuickAddOpen(true)}
            />
          )}

          {role === 'customer' && activeTab === 'comparison' && <PriceComparisonView />}

          {role === 'customer' && activeTab === 'shopping' && (
            <ShoppingListView onNavigateToCompare={() => handleTabChange('comparison')} />
          )}

          {/* Admin views */}
          {role === 'admin' && activeTab === 'admin' && (
            <AdminManagementView initialSubTab="products" />
          )}

          {role === 'admin' && activeTab === 'admin-products' && (
            <AdminManagementView initialSubTab="products" />
          )}

          {role === 'admin' && activeTab === 'admin-shops' && (
            <AdminManagementView initialSubTab="shops" />
          )}

          {role === 'admin' && activeTab === 'admin-prices' && (
            <AdminManagementView initialSubTab="prices" />
          )}
        </main>

        {/* Professional Footer */}
        <footer className="mt-auto border-t border-purple-100/80 backdrop-blur-md bg-white/40 py-6 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center">
                <Scale className="w-3 h-3" />
              </div>
              <span className="font-bold text-slate-700">
                Smart Grocery – Grocery Price Comparison Tracker
              </span>
              <span>·</span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                ₹ INR Pricing
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                Browser LocalStorage Persisted
              </span>
              <span>·</span>
              <span className="capitalize font-semibold text-purple-700">
                {role} Mode Active
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Quick Add Modal (Available to Admin) */}
      {role === 'admin' && (
        <QuickAddModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GroceryProvider>
        <MainApp />
      </GroceryProvider>
    </AuthProvider>
  );
}
