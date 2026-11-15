'use client';

import { useState } from 'react';
import { Package, GitCommit, Truck, Map, Zap, TriangleAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 1, title: 'Create Shipment', icon: <Package size={24}/>, desc: 'API or Dashboard ingests order details.', tech: 'NestJS + PostgreSQL', out: 'Shipment record + Event' },
  { id: 2, title: 'Optimize Route', icon: <GitCommit size={24}/>, desc: 'Groups shipments and calculates optimal vehicle paths.', tech: 'Google OR-Tools / VRP', out: 'Optimized Route Plan' },
  { id: 3, title: 'Assign Vehicle', icon: <Truck size={24}/>, desc: 'Dispatches instructions to the best available driver.', tech: 'Redis + BullMQ', out: 'Vehicle Assigned Event' },
  { id: 4, title: 'Track in Real Time', icon: <Map size={24}/>, desc: 'Streams high-frequency GPS telemetry.', tech: 'Socket.IO + Next.js', out: 'Live Location Updates' },
  { id: 5, title: 'Predict ETA', icon: <Zap size={24}/>, desc: 'Estimates arrival using traffic and historical data.', tech: 'FastAPI + XGBoost', out: 'Predicted ETA + Confidence' },
  { id: 6, title: 'Detect Risk', icon: <TriangleAlert size={24}/>, desc: 'Identifies potential delays or disruptions proactively.', tech: 'ML Risk Engine', out: 'Delay Probability Score' },
  { id: 7, title: 'Reroute', icon: <ArrowRight size={24}/>, desc: 'Automatically recalculates route if risk exceeds threshold.', tech: 'Optimization Engine', out: 'Alternative Route' },
  { id: 8, title: 'Deliver', icon: <CheckCircle2 size={24}/>, desc: 'Captures proof of delivery and updates analytics.', tech: 'Core API', out: 'Completed Status + Metrics' },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section id="how-it-works" className="py-24 bg-[#151922] border-t border-[#272D38]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F7FA] mb-4">From Shipment to Delivery</h2>
          <p className="text-[#9AA3B2]">See exactly how ShipFlow orchestrates logistics from start to finish.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Timeline Selector */}
          <div className="lg:w-1/2 relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-[#272D38]" />
            
            <div className="space-y-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full flex items-center gap-6 p-4 rounded-xl text-left transition-all relative z-10 ${
                    activeStep === step.id 
                      ? 'bg-[#191E28] border border-[#272D38]' 
                      : 'hover:bg-[#191E28]/50 opacity-60 hover:opacity-100 border border-transparent'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-[3px] transition-colors ${
                    activeStep === step.id ? 'bg-[#4F8FF7] border-[#0F1117] text-[#F5F7FA]' : 'bg-[#151922] border-[#272D38] text-[#9AA3B2]'
                  }`}>
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#9AA3B2] mb-1">0{step.id}</p>
                    <p className={`text-lg font-bold transition-colors ${activeStep === step.id ? 'text-[#4F8FF7]' : 'text-[#F5F7FA]'}`}>
                      {step.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contextual Panel */}
          <div className="lg:w-1/2">
            <div className="sticky top-32 bg-[#191E28] border border-[#272D38] rounded-2xl p-8 animate-fade-in-up transition-all duration-300">
              <div className="w-14 h-14 bg-[#4F8FF7]/10 text-[#4F8FF7] border border-[#4F8FF7]/20 rounded-xl flex items-center justify-center mb-6">
                {steps[activeStep - 1].icon}
              </div>
              
              <h3 className="text-2xl font-bold text-[#F5F7FA] mb-4">
                <span className="text-[#9AA3B2] mr-3">0{activeStep}</span>
                {steps[activeStep - 1].title}
              </h3>
              
              <p className="text-[#9AA3B2] text-lg leading-relaxed mb-8">
                {steps[activeStep - 1].desc}
              </p>
              
              <div className="space-y-4">
                <div className="bg-[#151922] rounded-xl p-4 border border-[#272D38]">
                  <p className="text-[10px] font-bold text-[#9AA3B2] tracking-wider mb-1">TECHNOLOGY USED</p>
                  <p className="text-sm text-[#4F8FF7] font-medium">{steps[activeStep - 1].tech}</p>
                </div>
                
                <div className="bg-[#151922] rounded-xl p-4 border border-[#272D38]">
                  <p className="text-[10px] font-bold text-[#9AA3B2] tracking-wider mb-1">DATA OUTPUT</p>
                  <p className="text-sm text-[#22C55E] font-medium">{steps[activeStep - 1].out}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
