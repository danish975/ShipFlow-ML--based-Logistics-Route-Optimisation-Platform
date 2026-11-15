'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth.service';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isAuth, setIsAuth] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsAuth(document.cookie.includes('accessToken='));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } finally {
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      setIsAuth(false);
      router.push('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-bold text-[#0A0A0A] tracking-tight">
            ShipFlow
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Platform</button>
          <button onClick={() => document.getElementById('intelligence')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Intelligence</button>
          <button onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Solutions</button>
          <button onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Resources</button>
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-6">
          {!isAuth ? (
            <>
              <Link href="/login" className="text-sm font-medium text-[#0A0A0A] hover:text-[#2563EB] transition-colors">
                Sign In
              </Link>
              <Link 
                href="/register"
                className="px-5 py-2 rounded-lg bg-[#0A0A0A] hover:bg-[#222222] text-[#FFFFFF] text-sm font-medium transition-colors"
              >
                Create Account
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-[#0A0A0A] hover:text-[#2563EB] transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/settings" className="text-sm font-medium text-[#0A0A0A] hover:text-[#2563EB] transition-colors">
                Account
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-[#0A0A0A] hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-[#5F6368] p-2 hover:text-[#0A0A0A] transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#FFFFFF] border-b border-[#E5E5E5] p-4 flex flex-col gap-4 shadow-xl">
          <button onClick={() => { setIsMenuOpen(false); document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left text-sm font-medium text-[#5F6368] hover:text-[#0A0A0A] py-2">Platform</button>
          <button onClick={() => { setIsMenuOpen(false); document.getElementById('intelligence')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left text-sm font-medium text-[#5F6368] hover:text-[#0A0A0A] py-2">Intelligence</button>
          <button onClick={() => { setIsMenuOpen(false); document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left text-sm font-medium text-[#5F6368] hover:text-[#0A0A0A] py-2">Solutions</button>
          <div className="pt-2 border-t border-[#E5E5E5]">
            <Link 
              href="/dashboard"
              className="block w-full text-center px-5 py-3 rounded-lg bg-[#0A0A0A] hover:bg-[#222222] text-[#FFFFFF] text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
