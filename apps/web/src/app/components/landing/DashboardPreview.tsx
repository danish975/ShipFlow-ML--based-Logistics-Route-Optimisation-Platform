'use client';

import { AlertTriangle, Truck, MapPin, RotateCcw } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section className="pb-32 bg-[#FFFFFF] px-6">
      <div className="max-w-[1280px] mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
          
          {/* Fake Dashboard Header */}
          <div className="h-14 border-b border-[#E5E5E5] flex items-center justify-between px-6 bg-[#F7F7F5]/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
              <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
              <div className="w-3 h-3 rounded-full bg-[#E5E5E5]" />
            </div>
            <div className="text-[11px] font-bold text-[#5F6368] uppercase tracking-widest">ShipFlow Operations</div>
            <div className="w-10" />
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 bg-[#F7F7F5]/30">
            
            {/* Top KPIs - span full */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E5E5] shadow-sm">
                <p className="text-xs font-semibold text-[#5F6368] mb-1">Active Shipments</p>
                <p className="text-3xl font-bold text-[#0A0A0A]">142</p>
              </div>
              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E5E5] shadow-sm">
                <p className="text-xs font-semibold text-[#5F6368] mb-1">Fleet</p>
                <p className="text-3xl font-bold text-[#0A0A0A]">87%</p>
              </div>
              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E5E5] shadow-sm">
                <p className="text-xs font-semibold text-[#5F6368] mb-1">On-Time</p>
                <p className="text-3xl font-bold text-[#0A0A0A]">96.5%</p>
              </div>
              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E5E5] shadow-sm">
                <p className="text-xs font-semibold text-[#5F6368] mb-1">At Risk</p>
                <p className="text-3xl font-bold text-[#EF4444]">3</p>
              </div>
            </div>

            {/* Map Area */}
            <div className="lg:col-span-3 bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] h-[400px] shadow-sm relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#E5E5E5 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
              
              {/* Fake routes */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 20 80 Q 40 40 70 20" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
                <path d="M 30 70 Q 50 60 80 80" fill="none" stroke="#0A0A0A" strokeWidth="2" />
              </svg>

              <div className="absolute top-[40%] left-[45%] w-8 h-8 bg-[#0A0A0A] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                <Truck size={14} />
              </div>
              <div className="absolute top-[65%] left-[65%] w-8 h-8 bg-[#0A0A0A] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                <Truck size={14} />
              </div>
              
              <div className="absolute top-4 left-4 bg-[#FFFFFF] px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-[10px] font-bold text-[#5F6368] tracking-widest shadow-sm">
                LIVE FLEET MAP
              </div>
            </div>

            {/* Sidebar Alerts */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E5E5] shadow-sm h-full">
                <p className="text-xs font-bold text-[#0A0A0A] mb-4 uppercase tracking-wider">AI Exceptions</p>
                
                <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className="text-[#EF4444]" />
                    <span className="text-sm font-bold text-[#EF4444]">SHP-2031</span>
                  </div>
                  <p className="text-xs text-[#7F1D1D] mb-3">Delay risk: 78%</p>
                  
                  <div className="flex items-center gap-2 text-xs font-medium text-[#0A0A0A] bg-[#FFFFFF] p-2 rounded border border-[#FCA5A5]">
                    <RotateCcw size={12} className="text-[#2563EB]" /> Route recalculated
                  </div>
                </div>

                <div className="bg-[#F7F7F5] border border-[#E5E5E5] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-[#5F6368]" />
                    <span className="text-sm font-bold text-[#0A0A0A]">SHP-1944</span>
                  </div>
                  <p className="text-xs text-[#5F6368]">Arriving in 14 mins</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
