'use client';

import Link from 'next/link';

export default function FinalCta() {
  return (
    <section className="py-40 bg-[#FFFFFF]">
      <div className="max-w-[800px] mx-auto px-6 text-center">
        <h2 className="text-[clamp(40px,5vw,72px)] font-bold text-[#0A0A0A] leading-[1.1] tracking-tight mb-8">
          Make every delivery more predictable.
        </h2>
        <p className="text-[20px] text-[#5F6368] leading-[1.6] mb-12">
          Bring shipment management, fleet intelligence, predictive ETA, and route optimization into one operational platform.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard"
            className="px-8 py-4 rounded-xl bg-[#0A0A0A] hover:bg-[#222222] text-[#FFFFFF] font-semibold transition-colors w-full sm:w-auto"
          >
            Explore ShipFlow
          </Link>
          <button 
            onClick={() => document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F7F5] text-[#0A0A0A] font-semibold border border-[#E5E5E5] transition-colors w-full sm:w-auto"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}
