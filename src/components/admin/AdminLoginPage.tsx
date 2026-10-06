import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export const AdminLoginPage: React.FC<{
  onSuccess: () => void;
  onBackToSite: () => void;
}> = ({ onSuccess, onBackToSite }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your admin email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await login(trimmedEmail, password);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4">
      {/* Ambient background lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-md w-full space-y-6">
        <button
          onClick={onBackToSite}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Portfolio</span>
        </button>

        <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-900/30">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              HARSHZYNX ADMIN
            </h1>
            <p className="text-xs text-slate-400">
              Authorized Owner Control Portal
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-rose-950/50 border border-rose-800/50 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Field 1: Email */}
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Field 2: Password */}
            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="off"
                  className="w-full pl-10 pr-11 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 rounded text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-md shadow-blue-600/30 transition-all mt-3 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>LOGIN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500">
              HARSHZYNX Encrypted Administration Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
