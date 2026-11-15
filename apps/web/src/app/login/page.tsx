'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BarChart3, Eye, EyeOff, LockKeyhole, Mail, MapPin, ShieldCheck, Zap } from 'lucide-react';

import { AuthService } from '@/lib/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const nextPath = () => {
    const next = new URLSearchParams(window.location.search).get('next');
    return next && /^\/dashboard(\/|$|\?)/.test(next) ? next : '/dashboard';
  };

  useEffect(() => {
    let cancelled = false;
    AuthService.refresh()
      .then(ok => {
        if (ok && !cancelled) router.replace(nextPath());
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [router]);

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

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return setError('Email is required.');
    if (!password) return setError('Password is required.');

    setIsLoading(true);
    setError('');
    try {
      const result = await AuthService.login({ email, password });
      if (result.success) router.push(nextPath());
      else {
        setError(result.error || 'Invalid email or password.');
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || 'Unable to connect to ShipFlow. Please try again.');
    }
  };

  return (
    <main className="login-page">
      <section className="login-story" aria-label="ShipFlow logistics platform">
        <div className="login-story-glow" />
        <Link href="/" className="login-brand" aria-label="ShipFlow home">
          <Image src="/shipflow-logo.svg" alt="ShipFlow Logistics Command Center" width={350} height={96} priority />
        </Link>

        <div className="login-story-copy">
          <p className="login-eyebrow"><span className="login-eyebrow-dot" /> LOGISTICS COMMAND CENTER</p>
          <h1>Smarter logistics.<br /><span>Predictable deliveries.</span></h1>
          <p className="login-intro">Real-time fleet intelligence, predictive ETA, and intelligent route optimization — all in one operational platform.</p>

          <div className="login-benefits" aria-label="Platform features">
            <div className="login-benefit"><span className="login-benefit-icon"><MapPin size={22} /></span><span><strong>Live Fleet Tracking</strong><small>Real-time visibility</small></span></div>
            <div className="login-benefit"><span className="login-benefit-icon"><BarChart3 size={22} /></span><span><strong>AI Route Optimization</strong><small>Faster, cost-efficient routes</small></span></div>
            <div className="login-benefit"><span className="login-benefit-icon"><Zap size={22} fill="currentColor" /></span><span><strong>Predictive ETA</strong><small>On-time deliveries</small></span></div>
          </div>
        </div>

        <div className="login-landscape" aria-hidden="true">
          <Image src="/login-landscape.svg" alt="" fill priority sizes="(max-width: 900px) 100vw, 58vw" />
          <div className="login-route">
            <span className="route-pin route-pin-one"><MapPin size={26} fill="currentColor" /></span>
            <span className="route-pin route-pin-two"><MapPin size={30} fill="currentColor" /></span>
            <span className="route-pin route-pin-three"><MapPin size={34} fill="currentColor" /></span>
          </div>
          <div className="login-ops-bar">
            <span className="login-live"><span /> Platform in Action</span>
            <span className="login-ops-stat"><strong>24</strong><small>Vehicles Active</small></span>
            <span className="login-ops-stat"><strong>142</strong><small>Shipments</small></span>
            <span className="login-ops-stat"><strong>98.2%</strong><small>On-time Delivery</small></span>
          </div>
        </div>
      </section>

      <section className="login-panel" aria-label="Sign in">
        <div className="login-card">
          <div className="login-card-heading">
            <p className="login-secure"><ShieldCheck size={20} strokeWidth={2.8} /> Secure access</p>
            <h2>Welcome back</h2>
            <p>Sign in to your ShipFlow operations workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="login-error" role="alert">{error}</div>}
            <div className="login-field">
              <label htmlFor="work-email">Work Email</label>
              <div className="login-input-wrap">
                <Mail size={20} aria-hidden="true" />
                <input id="work-email" type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@company.com" autoComplete="email" />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="work-password">Password</label>
              <div className="login-input-wrap">
                <LockKeyhole size={20} aria-hidden="true" />
                <input id="work-password" type={showPassword ? 'text' : 'password'} required value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" />
                <button className="login-show-password" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember"><input type="checkbox" /><span>Remember me</span></label>
              <Link href="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" disabled={isLoading} className="login-submit">
              {isLoading ? <><span className="login-spinner" /> Signing in...</> : <>Sign in to ShipFlow <ArrowRight size={19} /></>}
            </button>
          </form>

          <div className="login-divider"><span>OR</span></div>

          <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/v1/auth/google`} className="login-google">
            <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </a>

          <p className="login-create">Don&apos;t have a ShipFlow account? <Link href="/register">Create an account</Link></p>
          <div className="login-protected"><LockKeyhole size={16} /><span>Your workspace data is protected with secure authentication.</span></div>
        </div>
      </section>
    </main>
  );
}
