'use client';

import { useState } from 'react';
import { Route as RouteIcon, Warehouse } from 'lucide-react';
import { Card, MapBackdrop, Section, SectionHeading, cx } from './ui';

// Stops in a 0–100 coordinate space.
const depot = { x: 14, y: 62 };
const stops = [
  { id: 1, x: 32, y: 24 },
  { id: 2, x: 58, y: 30 },
  { id: 3, x: 84, y: 48 },
  { id: 4, x: 66, y: 80 },
];
const currentOrder = [depot, stops[0], stops[3], stops[1], stops[2]];
const optimisedOrder = [depot, stops[0], stops[1], stops[2], stops[3]];
const toPath = (pts: Array<{ x: number; y: number }>) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');

export default function RouteOptimizationDemo() {
  const [optimised, setOptimised] = useState(false);

  const stats = [
    { label: 'Distance', current: '45.8 km', opt: '34.2 km', delta: '−25%' },
    { label: 'Travel time', current: '58 min', opt: '42 min', delta: '−16 min' },
    { label: 'Stops', current: '4', opt: '4' },
    { label: 'Vehicles', current: '1', opt: '1' },
  ];

  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            kicker="Route optimisation"
            kickerIcon={RouteIcon}
            title="Turn every route into an"
            highlight="optimised route."
            description="ShipFlow weighs vehicle availability, delivery windows, distance, travel time and live conditions to build the most efficient delivery plan."
          />

          <div className="mt-8 inline-flex rounded-xl border border-[#E3ECE6] bg-[#F5FAF6] p-1" role="tablist">
            {[['Current route', false], ['Optimised route', true]].map(([label, val]) => (
              <button
                key={label as string}
                role="tab"
                aria-selected={optimised === val}
                onClick={() => setOptimised(val as boolean)}
                className={cx(
                  'rounded-lg px-5 py-2 text-[14px] font-semibold transition-all',
                  optimised === val ? 'bg-white text-[#101C20] shadow-sm ring-1 ring-[#E3ECE6]' : 'text-[#6B7A72] hover:text-[#101C20]',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(s => (
              <div key={s.label} className="rounded-xl border border-[#E3ECE6] bg-white p-4">
                <p className="text-[12px] font-medium text-[#6B7A72]">{s.label}</p>
                <p className={cx('mt-1 text-[22px] font-extrabold tracking-[-0.03em] transition-colors', optimised && s.delta ? 'text-[#087D31]' : 'text-[#101C20]')}>
                  {optimised ? s.opt : s.current}
                </p>
                <p className={cx('h-4 text-[11px] font-semibold text-[#087D31] transition-opacity', optimised && s.delta ? 'opacity-100' : 'opacity-0')}>{s.delta}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="relative h-[440px] overflow-hidden">
          <MapBackdrop />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <path d={toPath(currentOrder)} fill="none" stroke="#94A3B8" strokeDasharray="7 7" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={cx('transition-opacity duration-500', optimised ? 'opacity-25' : 'opacity-100')} style={{ strokeWidth: 3 }} />
            <path d={toPath(optimisedOrder)} fill="none" stroke="#16A34A" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" className={cx('transition-opacity duration-500', optimised ? 'opacity-100' : 'opacity-0')} style={{ strokeWidth: 4.5 }} />
          </svg>

          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${depot.x}%`, top: `${depot.y}%` }}>
            <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-white bg-[#101C20] text-white shadow-lg"><Warehouse size={17} /></span>
          </div>
          {stops.map(s => (
            <span
              key={s.id}
              className={cx('absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-white text-[12px] font-bold shadow-md transition-colors', optimised ? 'bg-[#16A34A] text-white' : 'bg-white text-[#3B4A42] ring-1 ring-[#CBD5D0]')}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              {optimised ? optimisedOrder.indexOf(s) : currentOrder.indexOf(s)}
            </span>
          ))}

          <div className="absolute left-4 top-4 rounded-xl border border-[#E3ECE6] bg-white/95 px-3.5 py-2.5 shadow-sm">
            <p className="text-[11px] font-medium text-[#6B7A72]">{optimised ? 'Optimised plan' : 'Current plan'}</p>
            <p className={cx('text-[15px] font-bold', optimised ? 'text-[#087D31]' : 'text-[#101C20]')}>{optimised ? '34.2 km · 42 min' : '45.8 km · 58 min'}</p>
          </div>
        </Card>
      </div>
    </Section>
  );
}
