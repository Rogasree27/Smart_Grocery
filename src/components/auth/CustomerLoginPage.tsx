import React, { useState } from 'react';
import {
  ShoppingBag,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  Sparkles,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const CustomerLoginPage: React.FC = () => {
  const { login, navigate } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide your email and password.');
      return;
    }

    const result = login(email, password, 'customer');
    if (!result.success) {
      setError(result.error || 'Invalid email or password.');
    }
  };

  const fillDemoCustomer = () => {
    setEmail('customer@smartgrocery.com');
    setPassword('Customer@123');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-violet-100/70 via-purple-50/80 to-indigo-100/60 text-slate-800 relative overflow-hidden">
      {/* Decorative ambient orbs */}
      <div className="absolute top-1/4 -left-16 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-16 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Toast */}
        {toastMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-semibold text-center shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* Card */}
        <div className="p-8 rounded-3xl backdrop-blur-2xl bg-white/80 border border-white/90 shadow-2xl shadow-purple-900/10">
          {/* Back to Home Link */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors cursor-pointer"
            >
              <span>← Back to Home</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/25 text-white">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Smart Grocery Shopper</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to compare grocery prices and optimize your shopping list
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-purple-200/80 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-400 transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-purple-200/80 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-400 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In as Customer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mt-5 pt-4 border-t border-purple-100">
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between gap-2">
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold text-purple-900 block">Default Demo Shopper:</span>
                <span className="font-mono text-slate-500">customer@smartgrocery.com / Customer@123</span>
              </div>
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-700 text-[11px] font-semibold border border-purple-200 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
              >
                Auto-fill
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500">
              New to Smart Grocery?{' '}
              <button
                onClick={() => navigate('/customer-register')}
                className="font-bold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>

          {/* Switch to Admin Login Link */}
          <div className="mt-5 pt-4 border-t border-purple-100 text-center">
            <button
              onClick={() => navigate('/admin-login')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Are you an Administrator? Access Admin Login</span>
            </button>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        onSuccess={(resetEmail) => {
          setEmail(resetEmail);
          setToastMessage('Password updated! You can now sign in.');
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />
    </div>
  );
};
