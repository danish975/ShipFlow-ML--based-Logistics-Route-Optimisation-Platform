'use client';

import { MapPin, BrainCircuit, Route as RouteIcon, TriangleAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#0F1117]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F7FA] mb-4">Core Capabilities</h2>
          <p className="text-[#9AA3B2]">ShipFlow goes beyond visibility. It acts as an autonomous layer that optimizes your operations in real-time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Live Fleet Tracking */}
          <FeatureCard title="Live Fleet Tracking" icon={<MapPin className="text-[#4F8FF7]" />} link="/dashboard/fleet">
            <div className="h-40 w-full mt-4 bg-[#0F1117] rounded-xl border border-[#272D38] relative overflow-hidden group-hover:border-[#4F8FF7] transition-colors duration-300">
              <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#272D38 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
              
              <div className="absolute top-4 left-4 z-10">
                <p className="text-[10px] font-bold text-[#9AA3B2] mb-1">LIVE FLEET</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-[10px] rounded font-medium">18 Active</span>
                  <span className="px-2 py-1 bg-[#191E28] border border-[#272D38] text-[#9AA3B2] text-[10px] rounded font-medium">4 Idle</span>
                </div>
              </div>

              {/* Fake vehicles moving slightly on hover */}
              <div className="absolute top-[40%] left-[30%] w-2 h-2 bg-[#22C55E] rounded-full group-hover:translate-x-8 group-hover:-translate-y-4 transition-transform duration-1000" />
              <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-[#22C55E] rounded-full group-hover:-translate-x-6 group-hover:translate-y-2 transition-transform duration-1000 delay-100" />
              <div className="absolute top-[30%] left-[80%] w-2 h-2 bg-[#F59E0B] rounded-full group-hover:translate-x-2 transition-transform duration-1000 delay-200" />
              <div className="absolute top-[70%] left-[20%] w-2 h-2 bg-[#9AA3B2] rounded-full" />
            </div>
          </FeatureCard>

          {/* Card 2: ML-Powered ETA */}
          <FeatureCard title="ML-Powered ETA" icon={<BrainCircuit className="text-[#4F8FF7]" />} link="/dashboard/analytics">
            <div className="h-40 w-full mt-4 bg-[#0F1117] rounded-xl border border-[#272D38] p-4 flex flex-col justify-center group-hover:border-[#4F8FF7] transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-[10px] text-[#9AA3B2]">PREDICTED ETA</p>
                  <p className="text-lg font-bold text-[#F5F7FA]">14:32</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#9AA3B2]">ACTUAL</p>
                  <p className="text-lg font-bold text-[#F5F7FA]">14:35</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#9AA3B2]">ERROR</p>
                  <p className="text-lg font-bold text-[#22C55E]">3 min</p>
                </div>
              </div>
              
              {/* Chart simulation */}
              <div className="flex items-end gap-1 h-12 w-full mt-2">
                {[12, 15, 8, 4, 3, 3, 2].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#191E28] rounded-t-sm relative transition-colors" style={{ height: `${(h/15)*100}%` }}>
                    {i === 4 && <div className="absolute -top-1 w-full h-0.5 bg-[#4F8FF7]" />}
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-center text-[#9AA3B2] mt-2">Error margin trend (last 7 days)</p>
            </div>
          </FeatureCard>

          {/* Card 3: Route Optimization */}
          <FeatureCard title="Route Optimization" icon={<RouteIcon className="text-[#4F8FF7]" />} link="/dashboard/routes">
            <div className="h-40 w-full mt-4 bg-[#0F1117] rounded-xl border border-[#272D38] p-4 flex flex-col group-hover:border-[#4F8FF7] transition-colors duration-300">
              <div className="flex justify-between mb-2">
                <div className="text-center flex-1">
                  <p className="text-[10px] text-[#9AA3B2]">CURRENT</p>
                  <p className="text-sm font-bold text-[#9AA3B2] group-hover:line-through transition-all duration-500">45.2 km</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-[10px] text-[#22C55E]">OPTIMIZED</p>
                  <p className="text-lg font-bold text-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">39.7 km</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-[10px] text-[#22C55E]">SAVED</p>
                  <p className="text-lg font-bold text-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">14 min</p>
                </div>
              </div>
              
              <div className="flex-1 relative mt-2">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M 5 20 Q 25 5, 50 20 T 95 20" fill="none" stroke="#272D38" strokeWidth="2" strokeDasharray="2 2" className="group-hover:opacity-30 transition-opacity" />
                  <path d="M 5 20 L 50 25 L 95 20" fill="none" stroke="#4F8FF7" strokeWidth="2" strokeDasharray="100" strokeDashoffset="100" className="group-hover:stroke-dashoffset-0 transition-all duration-1000 ease-out" />
                </svg>
              </div>
            </div>
          </FeatureCard>

          {/* Card 4: Intelligent Exception Management */}
          <FeatureCard title="Exception Management" icon={<TriangleAlert className="text-[#4F8FF7]" />} link="/dashboard/exceptions">
            <div className="h-40 w-full mt-4 bg-[#0F1117] rounded-xl border border-[#272D38] p-4 flex flex-col justify-between group-hover:border-[#4F8FF7] transition-colors duration-300">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-bold rounded">DELAY RISK</span>
                  <span className="text-xs font-semibold text-[#F5F7FA]">SHP-2003</span>
                </div>
                <p className="text-xs text-[#9AA3B2]">78% delay probability. Traffic congestion detected on NH-8.</p>
              </div>
              
              <div className="bg-[#151922] rounded-lg p-3 border border-[#272D38]">
                <p className="text-[10px] text-[#22C55E] font-semibold mb-1">Alternative route available</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#9AA3B2]">Saves ~14 min</span>
                  <span className="text-[10px] text-[#4F8FF7] font-medium group-hover:underline">Investigate →</span>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, icon, children, link }: { title: string, icon: React.ReactNode, children: React.ReactNode, link: string }) {
  return (
    <Link href={link} className="block group">
      <div className="bg-[#151922] border border-[#272D38] rounded-2xl p-6 h-full transition-all duration-300 hover:border-[#4F8FF7] hover:-translate-y-1">
        <div className="flex justify-between items-start mb-2">
          <div className="p-3 bg-[#191E28] rounded-xl border border-[#272D38]">
            {icon}
          </div>
          <ArrowRight className="text-[#9AA3B2] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" size={20} />
        </div>
        <h3 className="text-xl font-bold text-[#F5F7FA] mt-4">{title}</h3>
        {children}
      </div>
    </Link>
  );
}
