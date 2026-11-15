'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "What is ShipFlow?", a: "ShipFlow is an AI-powered intelligent logistics and route optimization platform built to help operations teams manage shipments, track fleets, and predict delivery delays." },
  { q: "How does ShipFlow optimize delivery routes?", a: "ShipFlow uses advanced Vehicle Routing Problem (VRP) algorithms (powered by Google OR-Tools) to evaluate distances, travel times, vehicle capacity, and delivery windows to calculate the most efficient paths." },
  { q: "How does predictive ETA work?", a: "Our ML service uses XGBoost models trained on historical delivery data, traffic conditions, and weather to estimate arrival times with high confidence." },
  { q: "Can ShipFlow track vehicles in real time?", a: "Yes. ShipFlow receives high-frequency telemetry via WebSockets to update fleet positions instantly on the dashboard." },
  { q: "How does dynamic rerouting work?", a: "When the delay risk engine detects a high probability of a missed delivery window, it triggers the optimization engine to find an alternative route and pushes the update to the driver." },
  { q: "Does ShipFlow support multiple vehicles and stops?", a: "Yes. ShipFlow is designed to optimize complex multi-vehicle, multi-stop routing scenarios." },
  { q: "How does ShipFlow handle delayed shipments?", a: "Delayed shipments are automatically flagged in the Exception Management center, alerting operators and suggesting actionable reroutes to mitigate impact." },
  { q: "What technologies power ShipFlow?", a: "ShipFlow is built on Next.js, NestJS, PostgreSQL, Redis, BullMQ for event queues, and FastAPI for machine learning inference." },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 bg-[#F7F7F5] border-y border-[#E5E5E5]">
      <div className="max-w-[800px] mx-auto px-6">
        <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-[#0A0A0A] leading-[1.1] mb-12 tracking-tight text-center">
          Frequently asked questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[16px] overflow-hidden">
              <button 
                className="w-full text-left p-6 flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-bold text-[#0A0A0A]">{faq.q}</span>
                <ChevronDown className={`text-[#5F6368] transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`px-6 text-[#5F6368] text-lg leading-relaxed transition-all origin-top ${
                  openIndex === index ? 'pb-6 max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
