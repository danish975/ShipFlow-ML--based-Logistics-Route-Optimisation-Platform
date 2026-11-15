'use client';

import { useState } from 'react';
import { BarChart3, Clock, LayoutGrid, MapPin, Package, Route, Star, Truck, UserCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, MapBackdrop, Section, SectionHeading, cx } from './ui';

const items: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  { icon: Package, title: 'Intelligent shipment management', desc: 'Create, assign, monitor, and complete shipments through a unified operational workflow.' },
  { icon: MapPin, title: 'Real-time fleet tracking', desc: 'Monitor every vehicle in your fleet on an interactive live map with status and assignment.' },
  { icon: Clock, title: 'Predictive ETA & delay detection', desc: 'Machine-learning models predict arrival times and flag high-risk shipments before they slip.' },
  { icon: Route, title: 'Dynamic route optimisation', desc: 'Recalculate efficient delivery paths automatically when disruptions occur.' },
  { icon: UserCheck, title: 'Smart vehicle assignment', desc: 'Dispatch shipments to the best available driver based on capacity, proximity and schedule.' },
  { icon: BarChart3, title: 'Operational analytics', desc: 'Visibility into fleet utilisation, on-time performance and routing efficiency.' },
];

export default function SimplifyLogistics() {
  const [active, setActive] = useState(0);

  return (
    <Section id="platform" tone="tint">
      <SectionHeading
        kicker="Platform"
        kickerIcon={LayoutGrid}
        title="Built to simplify"
        highlight="logistics operations."
        description="One workspace for dispatchers, fleet managers and operations leads, from the first pickup to proof of delivery."
      />

      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
        <div className="space-y-2.5" role="tablist" aria-orientation="vertical">
          {items.map((item, i) => {
            const on = i === active;
            return (
              <button
                key={item.title}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className={cx(
                  'w-full rounded-2xl border p-4 text-left transition-all sm:p-5',
                  on ? 'border-[#BFE3C8] bg-white shadow-[0_10px_30px_-12px_rgba(20,110,50,0.25)]' : 'border-transparent hover:bg-white/70',
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors', on ? 'bg-[#087D31] text-white' : 'bg-[#E8F8E8] text-[#078F33]')}>
                    <item.icon size={18} />
                  </span>
                  <span className={cx('text-[16px] font-bold tracking-[-0.01em]', on ? 'text-[#101C20]' : 'text-[#3B4A42]')}>{item.title}</span>
                  <span className="ml-auto text-[12px] font-semibold text-[#9AA8A0]">0{i + 1}</span>
                </div>
                <div className={cx('grid transition-all duration-300', on ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                  <p className="overflow-hidden pl-14 text-[14.5px] leading-[1.6] text-[#59676A]">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <Card className="relative flex min-h-[440px] items-center justify-center overflow-hidden p-6 sm:p-10 lg:sticky lg:top-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,#E3F6E8,transparent_60%)]" />
          <div key={active} className="relative w-full max-w-[420px] animate-fade-in-up">
            <Visual index={active} />
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Panel({ title, children, badge }: { title: string; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#E3ECE6] bg-white p-5 shadow-[0_20px_50px_-20px_rgba(20,70,40,0.3)]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] font-bold text-[#101C20]">{title}</p>
        {badge}
      </div>
      {children}
    </div>
  );
}

const pill = (text: string, cls: string) => <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{text}</span>;

function Visual({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <Panel title="Create shipment" badge={pill('Auto-numbered', 'bg-green-50 text-green-700')}>
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            {[['Pickup', 'Cyber Hub, Gurugram'], ['Delivery', 'Connaught Place, Delhi'], ['Weight', '450 kg'], ['Priority', 'High']].map(([l, v]) => (
              <div key={l}>
                <p className="mb-1 font-medium text-[#6B7A72]">{l}</p>
                <p className="rounded-lg border border-[#E3ECE6] px-3 py-2 font-medium text-[#101C20]">{v}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-lg bg-[#087D31] py-2.5 text-[13px] font-semibold text-white">Create shipment</button>
        </Panel>
      );
    case 1:
      return (
        <Panel title="Live fleet" badge={pill('6 vehicles', 'bg-green-50 text-green-700')}>
          <div className="relative h-48 overflow-hidden rounded-xl border border-[#E3ECE6]">
            <MapBackdrop />
            {[[25, 60, '#15803d'], [52, 35, '#d97706'], [75, 55, '#15803d'], [40, 78, '#0284c7']].map(([x, y, c], i) => (
              <span key={i} className="absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white text-white shadow" style={{ left: `${x}%`, top: `${y}%`, background: c as string }}>
                <Truck size={11} />
              </span>
            ))}
          </div>
        </Panel>
      );
    case 2:
      return (
        <Panel title="SHP-2031 · Delhi → Jaipur" badge={pill('High risk', 'bg-red-50 text-red-600')}>
          <div className="flex items-end justify-between border-b border-[#EDF2EE] pb-4">
            <div><p className="text-[12px] text-[#6B7A72]">Predicted arrival</p><p className="text-[30px] font-extrabold tracking-[-0.03em] text-[#101C20]">4:32 PM</p></div>
            <div className="text-right"><p className="text-[12px] text-[#6B7A72]">Delay risk</p><p className="text-[22px] font-bold text-red-600">78%</p></div>
          </div>
          <div className="mt-4 space-y-2.5 text-[12px]">
            {[['Traffic congestion', 82, 'bg-red-500'], ['Route load', 61, 'bg-amber-500'], ['Schedule deviation', 48, 'bg-amber-500']].map(([l, v, c]) => (
              <div key={l as string}>
                <div className="mb-1 flex justify-between text-[#3B4A42]"><span>{l}</span><span className="font-semibold">{v}%</span></div>
                <div className="h-1.5 rounded-full bg-[#EDF2EE]"><div className={`h-full rounded-full ${c}`} style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
        </Panel>
      );
    case 3:
      return (
        <Panel title="Route comparison" badge={pill('−11.6 km', 'bg-green-50 text-green-700')}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#E3ECE6] bg-[#F7FAF8] p-4"><p className="text-[12px] text-[#6B7A72]">Current</p><p className="mt-1 text-[20px] font-bold text-[#3B4A42]">45.8 km</p><p className="text-[12px] text-[#6B7A72]">58 min</p></div>
            <div className="rounded-xl border border-[#BFE3C8] bg-green-50 p-4"><p className="text-[12px] text-green-800">Optimised</p><p className="mt-1 text-[20px] font-bold text-[#087D31]">34.2 km</p><p className="text-[12px] text-green-800">42 min</p></div>
          </div>
        </Panel>
      );
    case 4:
      return (
        <Panel title="Suggested drivers" badge={pill('Best match', 'bg-green-50 text-green-700')}>
          <div className="space-y-2.5">
            {[['Vikram Yadav', 'UP16Z4321 · 2.1 km away', 4.9, true], ['Ramesh Kumar', 'HR38X1234 · 4.8 km away', 4.8, false], ['Deepak Sharma', 'DL3CAB2020 · 6.3 km away', 4.7, false]].map(([n, d, r, best]) => (
              <div key={n as string} className={cx('flex items-center gap-3 rounded-xl border p-3', best ? 'border-[#BFE3C8] bg-green-50/60' : 'border-[#E3ECE6]')}>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#E8F8E8] text-[11px] font-bold text-[#087D31]">{(n as string).split(' ').map(p => p[0]).join('')}</span>
                <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold text-[#101C20]">{n}</p><p className="truncate text-[11px] text-[#6B7A72]">{d}</p></div>
                <span className="flex items-center gap-1 text-[12px] font-semibold text-[#3B4A42]"><Star size={12} className="fill-amber-400 text-amber-400" />{r}</span>
              </div>
            ))}
          </div>
        </Panel>
      );
    default:
      return (
        <Panel title="Deliveries this week" badge={pill('+8.3%', 'bg-green-50 text-green-700')}>
          <div className="flex h-40 items-end gap-2.5">
            {[42, 38, 55, 51, 48, 62, 58].map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="w-full rounded-t-[5px] bg-gradient-to-t from-[#087D31] to-[#4ADE80]" style={{ height: `${(v / 62) * 120}px` }} />
                <span className="text-[10px] text-[#6B7A72]">{'MTWTFSS'[i]}</span>
              </div>
            ))}
          </div>
        </Panel>
      );
  }
}
