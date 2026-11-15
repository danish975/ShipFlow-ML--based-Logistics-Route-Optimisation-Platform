'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth.service';

const navigation = [
  { label: 'Platform', id: 'platform' },
  { label: 'Intelligence', id: 'intelligence' },
  { label: 'Solutions', id: 'solutions' },
  { label: 'Resources', id: 'resources' },
];

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(document.cookie.includes('accessToken='));
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

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="landing-nav">
      <div className="landing-nav-inner">
        <Link href="/" className="landing-nav-logo" aria-label="ShipFlow home">
          <Image src="/shipflow-logo.svg" alt="ShipFlow" width={700} height={190} priority />
        </Link>

        <div className="landing-nav-links">
          {navigation.map(item => (
            <button key={item.id} onClick={() => scrollToSection(item.id)}>{item.label}<ChevronDown size={13} /></button>
          ))}
        </div>

        <div className="landing-nav-actions">
          {!isAuth ? <>
            <Link className="landing-nav-signin" href="/login">Sign In</Link>
            <Link className="landing-nav-create" href="/register">Create Account</Link>
          </> : <>
            <Link className="landing-nav-signin" href="/dashboard">Dashboard</Link>
            <Link className="landing-nav-signin" href="/dashboard/settings">Account</Link>
            <button className="landing-nav-signin" onClick={handleLogout}>Sign Out</button>
          </>}
        </div>

        <button className="landing-nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen}>
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && <div className="landing-mobile-menu">
        {navigation.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)}>{item.label}<ChevronDown size={14} /></button>)}
        <div className="landing-mobile-actions">
          {!isAuth ? <><Link href="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link><Link href="/register" onClick={() => setIsMenuOpen(false)}>Create Account <span>→</span></Link></> : <>
            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <Link href="/dashboard/settings" onClick={() => setIsMenuOpen(false)}>Account</Link>
            <button onClick={() => { setIsMenuOpen(false); void handleLogout(); }}>Sign Out</button>
          </>}
        </div>
      </div>}
    </nav>
  );
}
