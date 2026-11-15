'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsAuth(document.cookie.includes('accessToken='));
    }
  }, []);

  return (
    <section className="pt-40 pb-20 bg-[#FFFFFF]">
      <div className="max-w-[1000px] mx-auto px-6 text-center animate-fade-in-up">
        
        <h1 className="text-[clamp(48px,6vw,88px)] font-bold tracking-tight text-[#0A0A0A] leading-[1.1] mb-8">
          Optimize Every Shipment.<br />
          <span className="text-[#2563EB]">Predict Every Delay.</span>
        </h1>
        
        <p className="text-[20px] text-[#5F6368] max-w-[800px] mx-auto leading-[1.6] mb-12">
          ShipFlow combines real-time fleet intelligence, predictive ETA, and intelligent route optimization to help logistics teams deliver faster and respond to disruptions in real time.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isAuth ? (
            <>
              <Link 
                href="/register"
                className="px-8 py-4 rounded-xl bg-[#0A0A0A] hover:bg-[#222222] text-[#FFFFFF] font-semibold transition-colors"
              >
                Get Started
              </Link>
              <button 
                onClick={() => document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F7F5] text-[#0A0A0A] font-semibold border border-[#E5E5E5] transition-colors"
              >
                Explore Platform
              </button>
            </>
          ) : (
            <Link 
              href="/dashboard"
              className="px-8 py-4 rounded-xl bg-[#0A0A0A] hover:bg-[#222222] text-[#FFFFFF] font-semibold transition-colors"
            >
              Explore Dashboard
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
