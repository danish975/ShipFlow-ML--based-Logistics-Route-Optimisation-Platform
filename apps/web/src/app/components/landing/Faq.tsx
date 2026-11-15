'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown, CircleHelp } from 'lucide-react';
import { Card, GithubIcon, Section, SectionHeading, cx } from './ui';

const faqs = [
  { q: 'What is ShipFlow?', a: 'ShipFlow is an AI-powered logistics and route optimisation platform that helps operations teams manage shipments, track fleets and predict delivery delays.' },
  { q: 'How does ShipFlow optimise delivery routes?', a: 'ShipFlow uses Vehicle Routing Problem (VRP) algorithms, powered by Google OR-Tools, to weigh distances, travel times, vehicle capacity and delivery windows and compute the most efficient paths.' },
  { q: 'How does predictive ETA work?', a: 'The ML service uses XGBoost models trained on historical deliveries, traffic and weather to estimate arrival times, each with a confidence score.' },
  { q: 'Can ShipFlow track vehicles in real time?', a: 'Yes. ShipFlow receives telemetry over WebSockets and updates fleet positions on the dashboard map instantly.' },
  { q: 'How does dynamic rerouting work?', a: 'When the delay-risk engine detects a likely missed delivery window, it triggers the optimisation engine to find an alternative route and pushes the update to the driver.' },
  { q: 'Does ShipFlow support multiple vehicles and stops?', a: 'Yes. ShipFlow is designed for complex multi-vehicle, multi-stop routing scenarios.' },
  { q: 'How does ShipFlow handle delayed shipments?', a: 'Delayed shipments are flagged automatically in the Exceptions center, alerting operators and suggesting actionable reroutes.' },
  { q: 'What technologies power ShipFlow?', a: 'Next.js, NestJS, PostgreSQL, Redis and BullMQ for event queues, and FastAPI for machine-learning inference.' },
];

const API_DOCS = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/docs`;
const GITHUB = 'https://github.com/danish975/ShipFlow-ML--based-Logistics-Route-Optimisation-Platform';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="resources">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            kicker="Resources"
            kickerIcon={CircleHelp}
            title="Frequently asked"
            highlight="questions."
            description="Everything you need to know about how ShipFlow plans, predicts and tracks deliveries."
          />
          <div className="mt-8 grid gap-3">
            <a href={API_DOCS} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-[#E3ECE6] bg-[#F7FAF8] p-4 transition-colors hover:border-[#BFE3C8] hover:bg-white">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E8F8E8] text-[#078F33]"><BookOpen size={18} /></span>
              <span><span className="block text-[14.5px] font-bold text-[#101C20]">API documentation</span><span className="text-[13px] text-[#6B7A72]">Interactive Swagger reference</span></span>
            </a>
            <a href={GITHUB} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-[#E3ECE6] bg-[#F7FAF8] p-4 transition-colors hover:border-[#BFE3C8] hover:bg-white">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#101C20] text-white"><GithubIcon size={18} /></span>
              <span><span className="block text-[14.5px] font-bold text-[#101C20]">Source on GitHub</span><span className="text-[13px] text-[#6B7A72]">Architecture, setup and code</span></span>
            </a>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Card key={f.q} className={cx('overflow-hidden transition-colors', isOpen && 'border-[#BFE3C8]')}>
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-[16px] font-bold text-[#101C20]">{f.q}</span>
                  <span className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all', isOpen ? 'rotate-180 bg-[#087D31] text-white' : 'bg-[#F0F5F1] text-[#3B4A42]')}>
                    <ChevronDown size={16} />
                  </span>
                </button>
                <div className={cx('grid transition-all duration-300', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <p className="overflow-hidden px-6 text-[15px] leading-[1.65] text-[#59676A]">
                    <span className="block pb-5">{f.a}</span>
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
