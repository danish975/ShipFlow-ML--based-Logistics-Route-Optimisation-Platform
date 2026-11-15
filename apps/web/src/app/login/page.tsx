'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Box, Truck, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { AuthService } from '@/lib/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const oauthError = new URLSearchParams(window.location.search).get('oauthError');
    const messages: Record<string, string> = {
      google_not_configured: 'Google sign-in is not configured yet. Add the Google OAuth credentials to the API environment and restart it.',
      google_cancelled: 'Google sign-in was cancelled.',
      google_invalid_state: 'Google sign-in expired. Please try again.',
      google_failed: 'Google sign-in could not be completed. Please try again.',
    };
    if (oauthError && messages[oauthError]) setError(messages[oauthError]);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await AuthService.login({ email, password });
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Invalid email or password.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Unable to connect to ShipFlow. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col lg:flex-row font-sans relative overflow-hidden">
      
      {/* Subtle Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-[#E0E7FF] rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[50%] bg-[#EDE9FE] rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-[#CCFBF1] rounded-full blur-[120px] opacity-40 pointer-events-none" />

      {/* LEFT SIDE - Brand & Visual */}
      <div className="w-full lg:w-[55%] p-8 lg:p-16 flex flex-col justify-between relative z-10 min-h-[50vh] lg:min-h-screen">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 mb-12 lg:mb-0">
          <div className="w-8 h-8 bg-[#111111] rounded-[8px] flex items-center justify-center text-white transform rotate-45">
            <div className="w-3 h-3 border-2 border-white rounded-[2px] transform -rotate-45" />
          </div>
          <span className="text-[28px] font-bold text-[#111111] tracking-tight">ShipFlow</span>
        </Link>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center mt-12 lg:mt-0">
          <h1 className="text-[clamp(48px,5vw,72px)] font-[700] leading-[1.02] tracking-[-0.045em] text-[#111111] mb-6">
            Smarter logistics.<br />
            <span className="text-[#2563EB]">Predictable deliveries.</span>
          </h1>
          
          <p className="text-[18px] text-[#5F6368] leading-[1.6] max-w-[540px] mb-16">
            Real-time fleet intelligence, predictive ETA, and intelligent route optimization — all in one operational platform.
          </p>

          {/* Logistics Visualization */}
          <div className="relative h-[240px] max-w-[500px] bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 overflow-hidden hidden md:block">
            <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#E5E7EB 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
            
            <div className="relative w-full h-full flex items-center justify-between px-4">
              {/* Route Line */}
              <div className="absolute top-1/2 left-12 right-12 h-0.5 border-t-2 border-dashed border-[#2563EB] -translate-y-1/2 opacity-50" />
              
              {/* Warehouse */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-[#111827] rounded-xl flex items-center justify-center shadow-lg border-2 border-white mb-2">
                  <Box size={24} className="text-white" />
                </div>
                <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider bg-white px-2 py-0.5 rounded shadow-sm border border-[#E5E7EB]">Warehouse</span>
              </div>

              {/* Active Vehicle */}
              <div className="relative z-10 flex flex-col items-center absolute left-[50%] -translate-x-1/2">
                <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center shadow-lg border-2 border-white mb-2">
                  <Truck size={20} className="text-white" />
                </div>
                <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider bg-[#EFF6FF] px-2 py-0.5 rounded shadow-sm border border-[#BFDBFE]">In Transit</span>
              </div>

              {/* Delivery Destination */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-[#FFFFFF] rounded-xl flex items-center justify-center shadow-lg border-2 border-[#16A34A] mb-2">
                  <MapPin size={24} className="text-[#16A34A]" />
                </div>
                <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-wider bg-[#F0FDF4] px-2 py-0.5 rounded shadow-sm border border-[#BBF7D0]">Destination</span>
              </div>
            </div>
          </div>
          
          {/* Operations Status */}
          <div className="mt-8 flex flex-wrap gap-6 items-center">
            <span className="text-[10px] font-bold text-[#111111] uppercase tracking-widest bg-white px-3 py-1.5 rounded-full border border-[#E5E7EB] shadow-sm">
              Demo Operations
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-sm font-semibold text-[#5F6368]">24 Vehicles Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span className="text-sm font-semibold text-[#5F6368]">142 Shipments</span>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE - Auth Card */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative z-10">
        
        <div className="w-full max-w-[500px] bg-[#FFFFFF] rounded-[24px] border border-[#E5E7EB] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-12">
          
          <div className="mb-8">
            <p className="text-[11px] font-bold text-[#5F6368] uppercase tracking-widest mb-3">Secure Access</p>
            <h2 className="text-[32px] font-bold text-[#111111] tracking-tight mb-2">Welcome back</h2>
            <p className="text-[#5F6368] text-sm">Sign in to your ShipFlow operations workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111111]">Work Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                className="w-full h-[52px] px-4 rounded-[10px] border border-[#D9DDE3] bg-[#FFFFFF] text-[#111111] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111111]">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full h-[52px] px-4 pr-12 rounded-[10px] border border-[#D9DDE3] bg-[#FFFFFF] text-[#111111] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6368] hover:text-[#111111] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input type="checkbox" className="peer appearance-none w-5 h-5 border border-[#D9DDE3] rounded-[6px] checked:bg-[#2563EB] checked:border-[#2563EB] transition-colors cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[#5F6368] group-hover:text-[#111111] transition-colors">Remember me</span>
              </label>

              <Link href="/forgot-password" className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-[54px] bg-[#111111] hover:bg-[#252525] text-white rounded-full font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in to ShipFlow'
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-[#E5E7EB] flex-1" />
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">OR</span>
            <div className="h-px bg-[#E5E7EB] flex-1" />
          </div>

          <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/v1/auth/google`} className="w-full h-[54px] bg-white border border-[#D9DDE3] hover:bg-[#F9FAFB] text-[#111111] rounded-full font-semibold transition-colors flex items-center justify-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <p className="mt-8 text-center text-sm text-[#5F6368]">
            Don't have a ShipFlow account?{' '}
            <Link href="/register" className="font-semibold text-[#111111] hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex items-center justify-center gap-2 text-[#7A808A]">
            <Lock size={14} />
            <span className="text-[12px]">Your workspace data is protected with secure authentication.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
