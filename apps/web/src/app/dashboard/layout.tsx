'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChartColumn,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PanelLeft,
  Plus,
  Route,
  Search,
  Sparkles,
  TriangleAlert,
  Truck,
  X,
} from 'lucide-react';
import { AuthService } from '@/lib/auth.service';
import { cn } from './components/ui';
import { ShipmentsProvider, useShipments } from './components/shipments-context';

interface Profile {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

interface NavChild {
  href: string;
  label: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavChild[];
}

const mainNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/shipments', label: 'Shipments & Deliveries', icon: Package },
  {
    href: '/dashboard/fleet',
    label: 'Fleet Management',
    icon: Truck,
    children: [
      { href: '/dashboard/fleet#vehicles', label: 'All Vehicles' },
      { href: '/dashboard/fleet#drivers', label: 'Drivers Directory' },
    ],
  },
  { href: '/dashboard/routes', label: 'Route Intelligence', icon: Route },
  { href: '/dashboard/exceptions', label: 'Exceptions', icon: TriangleAlert, badge: 4 },
  { href: '/dashboard/analytics', label: 'Analytics & Reports', icon: ChartColumn },
];

const pageTitles: Array<[RegExp, string]> = [
  [/^\/dashboard\/shipments\/.+/, 'Shipment details'],
  [/^\/dashboard\/shipments/, 'Shipments & Deliveries'],
  [/^\/dashboard\/fleet/, 'Fleet Management'],
  [/^\/dashboard\/routes/, 'Route Intelligence'],
  [/^\/dashboard\/exceptions/, 'Exceptions'],
  [/^\/dashboard\/analytics/, 'Analytics & Reports'],
  [/^\/dashboard\/?$/, 'Dashboard'],
];

const API_DOCS_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/docs`;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  // The drawer remembers the path it was opened on, so navigating closes it.
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null);
  const mobileOpen = mobileOpenPath === pathname;
  const setMobileOpen = (open: boolean) => setMobileOpenPath(open ? pathname : null);

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

  const handleLogout = async () => {
    await AuthService.logout();
    router.replace('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const title = pageTitles.find(([re]) => re.test(pathname))?.[1] ?? 'Dashboard';

  return (
    <ShipmentsProvider>
    <div className="h-screen bg-[#F5F6F8] flex text-gray-900 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          pathname={pathname}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(c => !c)}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[1100] flex">
          <div className="absolute inset-0 bg-gray-900/30" onClick={() => setMobileOpen(false)} />
          <div className="relative">
            <Sidebar
              pathname={pathname}
              collapsed={false}
              onToggleCollapse={() => setMobileOpen(false)}
              onLogout={handleLogout}
              mobile
            />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={title}
          user={user}
          onOpenMenu={() => setMobileOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 pb-8 pt-1 max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
    </ShipmentsProvider>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

function Sidebar({
  pathname,
  collapsed,
  onToggleCollapse,
  onLogout,
  mobile = false,
}: {
  pathname: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  mobile?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ '/dashboard/fleet': true });
  const searchRef = useRef<HTMLInputElement>(null);

  // Cmd/Ctrl + K focuses the menu search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filteredNav = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mainNav;
    return mainNav.filter(
      item =>
        item.label.toLowerCase().includes(q) ||
        item.children?.some(c => c.label.toLowerCase().includes(q)),
    );
  }, [query]);

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        'h-screen bg-[#FAFAFB] border-r border-gray-200/80 flex flex-col shrink-0 transition-[width] duration-200',
        collapsed ? 'w-[76px]' : 'w-[260px]',
        mobile && 'shadow-xl',
      )}
    >
      {/* Brand */}
      <div className={cn('h-16 flex items-center px-5', collapsed ? 'justify-center px-0' : 'justify-between')}>
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-[9px] bg-green-700 flex items-center justify-center shrink-0 shadow-sm">
            <span className="w-3.5 h-3.5 border-2 border-white rounded-[3px] rotate-45" />
          </span>
          {!collapsed && <span className="text-[17px] font-semibold tracking-tight text-gray-900">ShipFlow</span>}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={mobile ? 'Close menu' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            {mobile ? <X className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {collapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Expand sidebar"
          className="mx-auto mb-2 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      )}

      {/* Search */}
      {!collapsed && (
        <div className="px-4 pb-3">
          <label className="flex items-center gap-2 px-3 h-9 bg-white border border-gray-200 rounded-xl text-sm focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-600/10">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 min-w-0 bg-transparent outline-none text-[13px] placeholder:text-gray-400"
            />
            <kbd className="text-[10px] text-gray-400 border border-gray-200 rounded-md px-1.5 py-0.5 font-sans">⌘K</kbd>
          </label>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {!collapsed && <SectionLabel>Main menu</SectionLabel>}
        <ul className="space-y-0.5">
          {filteredNav.map(item => {
            const active = isActive(item.href);
            const groupOpen = openGroups[item.href] || !!query;

            if (item.children && !collapsed) {
              return (
                <li key={item.href}>
                  <div className="flex items-center">
                    <Link href={item.href} className={navItemClass(active, false)}>
                      <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
                      <span className="flex-1 truncate">{item.label}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setOpenGroups(g => ({ ...g, [item.href]: !g[item.href] }))}
                      aria-label={groupOpen ? 'Collapse group' : 'Expand group'}
                      className="p-1.5 -ml-8 mr-1 rounded-md text-gray-400 hover:text-gray-700"
                    >
                      <ChevronDown className={cn('w-4 h-4 transition-transform', !groupOpen && '-rotate-90')} />
                    </button>
                  </div>
                  {groupOpen && (
                    <ul className="ml-[22px] mt-0.5 mb-1 border-l border-gray-200 space-y-0.5">
                      {item.children.map(child => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block ml-3 px-3 py-1.5 rounded-lg text-[13px] text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link href={item.href} title={collapsed ? item.label : undefined} className={navItemClass(active, collapsed)}>
                  <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {item.badge !== undefined && !collapsed && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-gray-800 text-white text-[10px] font-semibold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {item.badge !== undefined && collapsed && (
                    <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </Link>
              </li>
            );
          })}
          {filteredNav.length === 0 && (
            <li className="px-3 py-2 text-xs text-gray-400">No matches for “{query}”</li>
          )}
        </ul>

        {!collapsed ? <SectionLabel className="mt-6">Support</SectionLabel> : <div className="my-3 mx-3 border-t border-gray-200" />}
        <ul className="space-y-0.5">
          <li>
            <a href={API_DOCS_URL} target="_blank" rel="noreferrer" title={collapsed ? 'API docs' : undefined} className={navItemClass(false, collapsed)}>
              <BookOpen className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
              {!collapsed && <span className="flex-1">API docs</span>}
            </a>
          </li>
          <li>
            <button type="button" onClick={onLogout} title={collapsed ? 'Log out' : undefined} className={cn(navItemClass(false, collapsed), 'w-full')}>
              <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
              {!collapsed && <span className="flex-1 text-left">Log out</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* Promo card */}
      {!collapsed && (
        <div className="p-4">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="h-16 bg-gradient-to-br from-green-100 via-emerald-50 to-white" />
            <div className="absolute top-3 left-4 w-10 h-10 rounded-xl bg-green-700 text-white flex items-center justify-center shadow-md shadow-green-700/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="px-4 pb-4 -mt-2">
              <p className="text-sm font-semibold text-gray-900">AI Route Optimizer</p>
              <p className="text-xs text-gray-500 mt-0.5">Cut today’s distance by up to 18%.</p>
              <Link
                href="/dashboard/routes"
                className="mt-3 flex items-center justify-center gap-1.5 h-9 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-800 hover:bg-gray-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Optimize routes
              </Link>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function navItemClass(active: boolean, collapsed: boolean) {
  return cn(
    'relative flex items-center gap-3 rounded-xl text-[13px] font-medium transition-colors border',
    collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 py-2 w-full',
    active
      ? 'bg-white text-gray-900 border-gray-200 shadow-[0_1px_2px_rgba(16,24,40,0.06)] [&>svg]:text-green-700'
      : 'text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900',
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('px-3 mb-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-400', className)}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Top bar                                                             */
/* ------------------------------------------------------------------ */

function Topbar({
  title,
  user,
  onOpenMenu,
  onLogout,
}: {
  title: string;
  user: Profile;
  onOpenMenu: () => void;
  onLogout: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { openCreateShipment } = useShipments();

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const initials = `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}`.toUpperCase() || 'U';

  return (
    <header className="h-16 shrink-0 flex items-center gap-3 px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-[17px] font-semibold tracking-tight text-gray-900 truncate">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 h-9 px-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-700">
          <CalendarDays className="w-4 h-4 text-gray-500" />
          {today}
        </div>

        <Link
          href="/dashboard/exceptions"
          aria-label="Exceptions and alerts"
          className="relative w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Account menu"
            className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-[12px] font-semibold text-gray-700 hover:bg-gray-50"
          >
            {initials}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg z-[1200] overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                {user.role && (
                  <p className="mt-1.5 text-[11px] text-green-700 font-medium">{String(user.role).replace(/_/g, ' ').toLowerCase()}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={openCreateShipment}
          className="inline-flex items-center gap-1.5 h-9 px-3 sm:px-3.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-[13px] font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick shipment</span>
        </button>
      </div>
    </header>
  );
}
