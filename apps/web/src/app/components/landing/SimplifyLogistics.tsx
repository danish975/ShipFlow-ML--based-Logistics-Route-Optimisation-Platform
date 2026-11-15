'use client';

import { useState } from 'react';

const items = [
  { id: 1, title: 'Intelligent shipment management', desc: 'Create, assign, monitor, and complete shipments through a unified operational workflow.' },
  { id: 2, title: 'Real-time fleet tracking', desc: 'Monitor every vehicle in your fleet with sub-second latency on interactive maps.' },
  { id: 3, title: 'Predictive ETA & delay detection', desc: 'Use machine learning models to predict accurate arrival times and flag high-risk shipments.' },
  { id: 4, title: 'Dynamic route optimization', desc: 'Recalculate efficient delivery paths automatically when disruptions occur.' },
  { id: 5, title: 'Smart vehicle assignment', desc: 'Dispatch shipments to the best available driver based on capacity, proximity, and schedule.' },
  { id: 6, title: 'Operational analytics', desc: 'Gain visibility into fleet utilization, on-time performance, and routing efficiency.' },
];

export default function SimplifyLogistics() {
  const [activeItem, setActiveItem] = useState(1);

  return (
    <section id="platform" className="py-32 bg-[#F7F7F5] border-t border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-[#0A0A0A] leading-[1.1] mb-16 tracking-tight">
          Built to simplify logistics operations
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Accordion */}
          <div className="space-y-2 border-t border-[#E5E5E5] pt-2">
            {items.map((item) => (
              <div 
                key={item.id} 
                className={`border-b border-[#E5E5E5] overflow-hidden transition-all duration-300 ${activeItem === item.id ? 'pb-6' : 'pb-0'}`}
              >
                <button 
                  onClick={() => setActiveItem(item.id)}
                  className="w-full text-left py-6 flex justify-between items-center group"
                >
                  <h3 className={`text-xl font-semibold transition-colors ${activeItem === item.id ? 'text-[#0A0A0A]' : 'text-[#5F6368] group-hover:text-[#0A0A0A]'}`}>
                    {item.title}
                  </h3>
                </button>
                <div 
                  className={`text-[#5F6368] text-lg leading-relaxed transition-all duration-500 origin-top ${
                    activeItem === item.id ? 'max-h-40 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'
                  }`}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Visualization Panel */}
          <div className="bg-[#FFFFFF] rounded-[24px] border border-[#E5E5E5] shadow-[0_4px_20px_rgba(0,0,0,0.04)] h-[500px] p-8 sticky top-32 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[#F7F7F5]/50" />
            
            <div className="z-10 bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm rounded-xl w-full max-w-md p-6 animate-fade-in-up" key={activeItem}>
              {activeItem === 1 && (
                <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-[#E5E5E5] rounded" />
                  <div className="h-10 w-full bg-[#F7F7F5] rounded border border-[#E5E5E5]" />
                  <div className="h-10 w-full bg-[#F7F7F5] rounded border border-[#E5E5E5]" />
                  <div className="h-10 w-full bg-[#2563EB] rounded" />
                </div>
              )}
              {activeItem === 2 && (
                <div className="space-y-4">
                  <div className="h-32 w-full bg-[#F7F7F5] rounded border border-[#E5E5E5] relative overflow-hidden">
                     <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-[#0A0A0A] rounded-full shadow" />
                     <div className="absolute top-[60%] left-[70%] w-3 h-3 bg-[#0A0A0A] rounded-full shadow" />
                  </div>
                </div>
              )}
              {activeItem === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-4">
                    <span className="text-[#5F6368] text-sm">Predicted ETA</span>
                    <span className="text-[#0A0A0A] font-bold text-lg">4:32 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5F6368] text-sm">Risk</span>
                    <span className="text-[#EF4444] font-bold text-sm bg-[#FEF2F2] px-2 py-1 rounded">High</span>
                  </div>
                </div>
              )}
              {activeItem === 4 && (
                <div className="space-y-4">
                  <div className="h-4 w-1/2 bg-[#E5E5E5] rounded" />
                  <div className="flex gap-4">
                    <div className="flex-1 h-20 bg-[#F7F7F5] rounded border border-[#E5E5E5]" />
                    <div className="flex-1 h-20 bg-[#EFF6FF] border border-[#BFDBFE] rounded" />
                  </div>
                </div>
              )}
              {activeItem === 5 && (
                <div className="space-y-4">
                  <div className="h-12 w-full bg-[#F7F7F5] rounded border border-[#E5E5E5] flex items-center px-4">
                     <div className="w-6 h-6 rounded-full bg-[#E5E5E5] mr-3" />
                     <div className="h-2 w-1/3 bg-[#E5E5E5] rounded" />
                  </div>
                  <div className="h-12 w-full bg-[#F7F7F5] rounded border border-[#E5E5E5] flex items-center px-4">
                     <div className="w-6 h-6 rounded-full bg-[#E5E5E5] mr-3" />
                     <div className="h-2 w-1/2 bg-[#E5E5E5] rounded" />
                  </div>
                </div>
              )}
              {activeItem === 6 && (
                <div className="space-y-4 flex items-end h-32 gap-2">
                  <div className="flex-1 bg-[#2563EB] rounded-t" style={{ height: '60%' }} />
                  <div className="flex-1 bg-[#2563EB] rounded-t" style={{ height: '80%' }} />
                  <div className="flex-1 bg-[#2563EB] rounded-t" style={{ height: '40%' }} />
                  <div className="flex-1 bg-[#2563EB] rounded-t" style={{ height: '90%' }} />
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
