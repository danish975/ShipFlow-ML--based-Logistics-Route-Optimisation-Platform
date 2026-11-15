'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth.service';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/shipments', label: 'Shipments', icon: '📦' },
  { href: '/dashboard/fleet', label: 'Fleet & Drivers', icon: '🚛' },
  { href: '/dashboard/routes', label: 'Route Intelligence', icon: '🗺️' },
  { href: '/dashboard/exceptions', label: 'Exceptions', icon: '⚠️' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    // Clear the (httpOnly) auth cookies server-side before leaving, so a stale
    // session can't send the user straight back here.
    const signOut = async () => {
      await AuthService.logout();
      if (!cancelled) router.replace('/login');
    };

    AuthService.getProfile()
      .then(res => {
        if (cancelled) return;
        if (res.success) {
          setUser(res.data);
        } else {
          signOut();
        }
      })
      .catch(() => {
        signOut();
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!user) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl flex flex-col shrink-0">
        <Link href="/" className="p-6 border-b border-slate-800 block">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            ShipFlow
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5 tracking-wider">LOGISTICS COMMAND CENTER</p>
        </Link>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
