'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Rocket,
  Route,
  Truck,
  UserRound,
} from 'lucide-react';

import { AuthService } from '@/lib/auth.service';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** 0–4 score: length ≥ 8, mixed case, a digit, a symbol. */
function passwordScore(pw: string) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  // Anything typed counts as at least "Weak"; under 8 characters never rates higher.
  return pw.length < 8 ? 1 : Math.max(1, score);
}
const SCORE_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Already signed in (valid refresh session)? Go straight to the dashboard.
  useEffect(() => {
    let cancelled = false;
    AuthService.refresh()
      .then(ok => {
        if (ok && !cancelled) router.replace('/dashboard');
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [router]);

  const score = useMemo(() => passwordScore(form.password), [form.password]);
  const passwordsMismatch = form.confirmPassword.length > 0 && form.confirmPassword !== form.password;
  const passwordsMatch = form.confirmPassword.length > 0 && form.confirmPassword === form.password;

  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fullName = form.fullName.trim().replace(/\s+/g, ' ');
    if (!fullName) return setError('Please enter your full name.');
    if (!EMAIL.test(form.email.trim())) return setError('Please enter a valid work email.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (!acceptedTerms) return setError('Please accept the Terms and Privacy Policy to continue.');

    const [firstName, ...rest] = fullName.split(' ');
    setIsLoading(true);
    setError('');
    try {
      const result = await AuthService.register({
        email: form.email.trim(),
        password: form.password,
        firstName,
        // The API requires a last name; fall back to the first name for single-word names.
        lastName: rest.join(' ') || firstName,
        organizationName: form.companyName.trim() || undefined,
      });
      if (result.success) router.push('/dashboard');
      else {
        setError(result.error || 'Failed to create account.');
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const res = (err as { response?: { status?: number; data?: { message?: string | string[] } } }).response;
      const message = Array.isArray(res?.data?.message) ? res?.data?.message.join(' ') : res?.data?.message;
      if (res?.status === 409) setError('An account with this email already exists. Try signing in instead.');
      else setError(message || 'Unable to connect to ShipFlow. Please try again.');
    }
  };

  return (
    <main className="login-page">
      <section className="login-story" aria-label="ShipFlow logistics platform">
        <div className="login-story-glow" />
        <Link href="/" className="login-brand" aria-label="ShipFlow home">
          <Image src="/shipflow-logo.svg" alt="ShipFlow Logistics Command Center" width={482} height={146} priority />
        </Link>

        <div className="login-story-copy">
          <p className="login-eyebrow"><span className="login-eyebrow-dot" /> START IN MINUTES</p>
          <h1>Scale your operations.<br /><span>Start optimizing today.</span></h1>
          <p className="login-intro">Join logistics teams using ShipFlow to gain real-time visibility, predict delays, and dynamically route their fleets.</p>

          <div className="login-benefits" aria-label="How it works">
            <div className="login-benefit"><span className="login-benefit-icon"><Rocket size={22} /></span><span><strong>1. Create workspace</strong><small>Ready in under a minute</small></span></div>
            <div className="login-benefit"><span className="login-benefit-icon"><Truck size={22} /></span><span><strong>2. Add your fleet</strong><small>Vehicles, drivers, hubs</small></span></div>
            <div className="login-benefit"><span className="login-benefit-icon"><Route size={22} /></span><span><strong>3. Optimize routes</strong><small>AI-planned deliveries</small></span></div>
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

      <section className="login-panel" aria-label="Create account">
        <div className="login-card">
          <div className="login-card-heading">
            <p className="login-secure"><Rocket size={20} strokeWidth={2.6} /> Get started</p>
            <h2>Create an account</h2>
            <p>Set up your ShipFlow operations workspace.</p>
          </div>

          <form onSubmit={handleRegister} className="login-form" noValidate>
            {error && <div className="login-error" role="alert">{error}</div>}

            <div className="register-row">
              <div className="login-field">
                <label htmlFor="full-name">Full Name</label>
                <div className="login-input-wrap">
                  <UserRound size={20} aria-hidden="true" />
                  <input id="full-name" name="fullName" type="text" required value={form.fullName} onChange={update} placeholder="Jane Doe" autoComplete="name" />
                </div>
              </div>
              <div className="login-field">
                <label htmlFor="company">Company<span className="register-optional">(optional)</span></label>
                <div className="login-input-wrap">
                  <Building2 size={20} aria-hidden="true" />
                  <input id="company" name="companyName" type="text" value={form.companyName} onChange={update} placeholder="Logistics Inc." autoComplete="organization" />
                </div>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="work-email">Work Email</label>
              <div className="login-input-wrap">
                <Mail size={20} aria-hidden="true" />
                <input id="work-email" name="email" type="email" required value={form.email} onChange={update} placeholder="you@company.com" autoComplete="email" />
              </div>
            </div>

            <div className="register-row">
              <div className="login-field">
                <label htmlFor="new-password">Password</label>
                <div className="login-input-wrap">
                  <LockKeyhole size={20} aria-hidden="true" />
                  <input id="new-password" name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={update} placeholder="8+ characters" autoComplete="new-password" aria-describedby="password-strength" />
                  <button className="login-show-password" type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="login-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className={`login-input-wrap${passwordsMismatch ? ' is-invalid' : passwordsMatch ? ' is-valid' : ''}`}>
                  <LockKeyhole size={20} aria-hidden="true" />
                  <input id="confirm-password" name="confirmPassword" type={showPassword ? 'text' : 'password'} required value={form.confirmPassword} onChange={update} placeholder="Repeat password" autoComplete="new-password" aria-invalid={passwordsMismatch} />
                </div>
              </div>
            </div>

            <div id="password-strength" aria-live="polite">
              <div className="register-strength">
                <div className="register-strength-bars">
                  {[1, 2, 3, 4].map(i => <i key={i} className={score >= i ? `on-${score}` : ''} />)}
                </div>
                <span className="register-strength-label">{SCORE_LABEL[score]}</span>
              </div>
              <p className={`register-hint${passwordsMismatch ? ' is-error' : ''}`}>
                {passwordsMismatch ? 'Passwords do not match.' : 'Use 8+ characters with a mix of letters, numbers and symbols.'}
              </p>
            </div>

            <label className="register-terms">
              <input type="checkbox" checked={acceptedTerms} onChange={e => { setAcceptedTerms(e.target.checked); if (error) setError(''); }} />
              <span>I agree to the ShipFlow <Link href="/#resources">Terms of Service</Link> and <Link href="/#resources">Privacy Policy</Link>.</span>
            </label>

            <button type="submit" disabled={isLoading} className="login-submit">
              {isLoading ? <><span className="login-spinner" /> Creating workspace...</> : <>Create your workspace <ArrowRight size={19} /></>}
            </button>
          </form>

          <div className="login-divider"><span>OR</span></div>

          <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/v1/auth/google`} className="login-google">
            <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign up with Google
          </a>

          <p className="login-create">Already have a ShipFlow account? <Link href="/login">Sign in</Link></p>
          <div className="login-protected"><LockKeyhole size={16} /><span>Your workspace data is protected with secure authentication.</span></div>
        </div>
      </section>
    </main>
  );
}
