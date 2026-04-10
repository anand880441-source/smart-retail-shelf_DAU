import React, { useState } from 'react';
import { 
  Cpu, Lock, Mail, ArrowRight, Code2, 
  Globe, Shield, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this calls the API
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4 relative overflow-hidden font-outfit">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="surface-noise" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/20 mb-4 group transition-transform hover:scale-105">
            <Cpu size={32} className="text-white group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ShelfIQ</h1>
          <p className="text-slate-500 mt-2">Next-Gen AI Retail Intelligence</p>
        </div>

        <div className="glass-card rounded-[24px] p-8 border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs animate-shake">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Connect to Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-[#0B0F1A] px-4 text-slate-600">Secure Enterprise Access</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href="http://localhost:8000/auth/google/login"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 rounded-xl text-slate-300 text-xs font-semibold transition-all"
            >
              <Globe size={16} /> Google
            </a>
            <a
              href="http://localhost:8000/auth/github/login"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 rounded-xl text-slate-300 text-xs font-semibold transition-all"
            >
              <Code2 size={16} /> GitHub
            </a>
          </div>

          <div className="text-center mt-6">
            <span className="text-slate-500 text-sm">Don't have an account? </span>
            <Link to="/register" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">Register</Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-slate-600">
            <Shield size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">AES-256 Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Shield size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}