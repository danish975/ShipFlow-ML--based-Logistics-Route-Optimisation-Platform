'use client';

import { useState } from 'react';
import { Route as RouteIcon, MapPin, Truck, CheckCircle2 } from 'lucide-react';

export default function RouteOptimizationDemo() {
  const [isOptimized, setIsOptimized] = useState(false);

  return (
    <section className="py-32 bg-[#FFFFFF]">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Copy */}
        <div>
          <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-[#0A0A0A] leading-[1.1] mb-6 tracking-tight">
            Turn every route into an optimized route
          </h2>
          <p className="text-[20px] text-[#5F6368] leading-[1.6] mb-10">
            ShipFlow evaluates vehicle availability, delivery constraints, route distance, travel time, and operational conditions to generate efficient delivery plans.
          </p>

          <div className="flex bg-[#F7F7F5] rounded-xl p-1 w-max border border-[#E5E5E5] mb-10">
            <button 
              onClick={() => setIsOptimized(false)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${!isOptimized ? 'bg-[#FFFFFF] text-[#0A0A0A] shadow-sm' : 'text-[#5F6368] hover:text-[#0A0A0A]'}`}
            >
              Current Route
            </button>
            <button 
              onClick={() => setIsOptimized(true)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${isOptimized ? 'bg-[#FFFFFF] text-[#0A0A0A] shadow-sm' : 'text-[#5F6368] hover:text-[#0A0A0A]'}`}
            >
              Optimized Route
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-semibold text-[#5F6368] mb-1">Distance</p>
              <p className="text-2xl font-bold text-[#0A0A0A] transition-all">{isOptimized ? '34.2 km' : '45.8 km'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#5F6368] mb-1">Travel Time</p>
              <p className="text-2xl font-bold text-[#0A0A0A] transition-all">{isOptimized ? '42 min' : '58 min'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#5F6368] mb-1">Stops</p>
              <p className="text-2xl font-bold text-[#0A0A0A]">4</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#5F6368] mb-1">Vehicles</p>
              <p className="text-2xl font-bold text-[#0A0A0A]">1</p>
            </div>
          </div>
        </div>

        {/* Visual Map Demo */}
        <div className="bg-[#F7F7F5] border border-[#E5E5E5] rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] h-[500px] p-8 flex items-center justify-center relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#E5E5E5 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
          
          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Unoptimized Path */}
            <path 
              d="M 20 50 L 30 20 L 70 80 L 50 30 L 80 50" 
              fill="none" 
              stroke="#0A0A0A" 
              strokeWidth="2" 
              strokeDasharray="4 4"
              className={`transition-opacity duration-500 ${isOptimized ? 'opacity-0' : 'opacity-40'}`}
            />

            {/* Optimized Path */}
            <path 
              d="M 20 50 L 30 20 L 50 30 L 80 50 L 70 80" 
              fill="none" 
              stroke="#2563EB" 
              strokeWidth="3" 
              className={`transition-opacity duration-500 ${isOptimized ? 'opacity-100' : 'opacity-0'}`}
            />
          </svg>

          {/* Stops */}
          <div className="absolute top-[50%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#0A0A0A] rounded-lg shadow border-2 border-white z-10 flex items-center justify-center text-white">
            <RouteIcon size={14} />
          </div>
          
          <div className="absolute top-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFFFFF] rounded-full shadow border-2 border-[#E5E5E5] z-10" />
          <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFFFFF] rounded-full shadow border-2 border-[#E5E5E5] z-10" />
          <div className="absolute top-[80%] left-[70%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFFFFF] rounded-full shadow border-2 border-[#E5E5E5] z-10" />
          <div className="absolute top-[50%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFFFFF] rounded-full shadow border-2 border-[#E5E5E5] z-10" />
          
        </div>

      </div>
    </section>
  );
}
