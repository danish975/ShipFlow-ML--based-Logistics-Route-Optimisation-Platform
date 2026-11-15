'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BarChart3, MapPin, Network, Zap } from 'lucide-react';

export default function Hero() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(document.cookie.includes('accessToken='));
  }, []);

  return (
    <>
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-copy">
            <p className="landing-kicker"><Zap size={14} fill="currentColor" /> Smart logistics platform</p>
            <h1>Optimize Every Shipment.<br /><span>Predict Every Delay.</span></h1>
            <p className="landing-hero-description">ShipFlow combines real-time fleet intelligence, predictive ETA, and intelligent route optimization to help logistics teams deliver faster and respond to disruptions in real time.</p>
            <div className="landing-hero-actions">
              {isAuth ? (
                <Link href="/dashboard" className="landing-button landing-button-primary">Explore Dashboard <ArrowRight size={17} /></Link>
              ) : (
                <>
                  <Link href="/register" className="landing-button landing-button-primary">Get Started <ArrowRight size={17} /></Link>
                  <button onClick={() => document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' })} className="landing-button landing-button-secondary">Explore Platform</button>
                </>
              )}
            </div>
            <div className="landing-hero-points">
              <div><span className="landing-point-icon"><MapPin size={20} /></span><span>Real-time<br />Fleet Tracking</span></div>
              <div><span className="landing-point-icon"><BarChart3 size={20} /></span><span>AI-Powered<br />Insights</span></div>
              <div><span className="landing-point-icon"><Network size={20} /></span><span>Intelligent<br />Route Optimization</span></div>
            </div>
          </div>

          <div className="landing-hero-visual" aria-label="Live delivery tracking preview">
            <Image src="/login-landscape.svg" alt="ShipFlow delivery truck traveling through a landscape" fill priority sizes="(max-width: 900px) 100vw, 58vw" />
            <div className="landing-visual-wash" />
            <div className="landing-map-card">
              <div className="landing-map-top"><span><i /> TRC-042</span><b>On schedule</b></div>
              <svg viewBox="0 0 320 142" role="img" aria-label="Optimized delivery route map">
                <path className="map-road map-road-one" d="M5 114 65 92 98 100 142 68 179 78 218 42 252 49 310 15" />
                <path className="map-road map-road-two" d="M5 114 48 68 92 79 131 41 172 50 208 20 248 30 310 15" />
                <path className="map-route-line" d="M5 114 65 92 98 100 142 68 179 78 218 42 252 49 310 15" />
                <circle cx="5" cy="114" r="7" className="map-stop" /><circle cx="142" cy="68" r="6" className="map-stop" /><circle cx="310" cy="15" r="8" className="map-stop map-stop-end" />
              </svg>
              <span className="landing-map-label">Optimized route <strong>−18 min</strong></span>
            </div>
            <div className="landing-eta-card"><span className="landing-mini-icon"><Zap size={15} fill="currentColor" /></span><div><small>On-time delivery</small><strong>96.5% <em>↑ 2.8%</em></strong><div className="landing-bars">{[10, 15, 11, 21, 17, 27, 23, 32].map((height, index) => <i key={index} style={{ height }} />)}</div></div></div>
            <div className="landing-shipment-card"><span><Network size={17} /></span><div><small>Active shipments</small><strong>142</strong></div></div>
            <div className="landing-visual-tag"><span className="landing-tag-mark">S</span><strong>ShipFlow</strong><small>Live fleet network</small></div>
          </div>
        </div>
      </section>
      <div className="landing-promise"><span>Your entire logistics operation.</span> <strong>One intelligent platform.</strong></div>
    </>
  );
}
