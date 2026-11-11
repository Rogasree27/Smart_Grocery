import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { login, navigate } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both admin email and password.');
      return;
    }

    setLoading(true);
    // Simulating instant validation
    const result = login(email, password, 'admin');
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Invalid admin credentials.');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@smartgrocery.com');
    setPassword('Admin@123');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Container with Glassmorphism */}
        <div className="p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl shadow-indigo-950/50">
          {/* Back to Home Link */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>← Back to Home</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30 text-white">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-[11px] font-semibold mb-2 border border-violet-500/30">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>Restricted Access</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Admin Portal Login
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Sign in to manage products, stores, and central price matrix
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@smartgrocery.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-400 focus:bg-white/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-400 focus:bg-white/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mt-6 pt-5 border-t border-white/15">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
              <div className="text-[11px] text-slate-300">
                <span className="font-semibold text-violet-300 block">Default Admin Demo:</span>
                <span className="font-mono text-slate-400">admin@smartgrocery.com / Admin@123</span>
              </div>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="px-2.5 py-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 text-[11px] font-semibold border border-violet-500/30 transition-colors whitespace-nowrap cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          </div>

          {/* Switch to Customer Login Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Looking for price comparisons & shopping lists?
            </p>
            <button
              onClick={() => navigate('/customer-login')}
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-violet-300 hover:text-white transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Switch to Customer Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
