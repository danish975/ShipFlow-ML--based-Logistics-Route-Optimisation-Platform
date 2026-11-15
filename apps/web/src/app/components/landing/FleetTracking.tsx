'use client';

import { useState } from 'react';
import { MapPin, Truck } from 'lucide-react';
import { Card, MapBackdrop, Section, SectionHeading, cx } from './ui';

type Status = 'Active' | 'Delayed' | 'High risk' | 'Idle';
const FILTERS = ['All', 'Active', 'Delayed', 'High risk', 'Idle'] as const;

const COLORS: Record<Status, string> = {
  Active: '#15803d',
  Delayed: '#d97706',
  'High risk': '#dc2626',
  Idle: '#7c3aed',
};

const fleet: Array<{ id: string; driver: string; status: Status; x: number; y: number; eta: string }> = [
  { id: 'HR38X1234', driver: 'Ramesh Kumar', status: 'Active', x: 18, y: 64, eta: '14:32' },
  { id: 'DL1LV9999', driver: 'Amit Patel', status: 'High risk', x: 44, y: 36, eta: '16:45' },
  { id: 'UP16Z4321', driver: 'Vikram Yadav', status: 'Active', x: 70, y: 28, eta: '15:10' },
  { id: 'HR26YZ1111', driver: 'Rahul Gupta', status: 'Delayed', x: 58, y: 66, eta: '15:20' },
  { id: 'DL3CAB2020', driver: 'Deepak Sharma', status: 'Idle', x: 82, y: 58, eta: '—' },
  { id: 'HR38X5678', driver: 'Suresh Singh', status: 'Active', x: 30, y: 30, eta: '15:45' },
];

export default function FleetTracking() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [selected, setSelected] = useState('DL1LV9999');

  const visible = fleet.filter(v => filter === 'All' || v.status === filter);
  const sel = visible.find(v => v.id === selected) ?? visible[0];

  return (
    <Section tone="tint">
      <SectionHeading
        align="center"
        kicker="Fleet tracking"
        kickerIcon={MapPin}
        title="One view of your"
        highlight="entire fleet."
        description="Filter by status, spot delays instantly and drill into any vehicle without leaving the map."
      />

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map(f => {
          const count = f === 'All' ? fleet.length : fleet.filter(v => v.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cx(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors',
                filter === f ? 'border-[#087D31] bg-[#087D31] text-white' : 'border-[#DCE6DF] bg-white text-[#3B4A42] hover:border-[#087D31] hover:text-[#087D31]',
              )}
            >
              {f !== 'All' && <span className="h-2 w-2 rounded-full" style={{ background: filter === f ? '#fff' : COLORS[f] }} />}
              {f}
              <span className={cx('text-[11px]', filter === f ? 'text-white/80' : 'text-[#9AA8A0]')}>{count}</span>
            </button>
          );
        })}
      </div>

      <Card className="relative mt-8 h-[480px] overflow-hidden">
        <MapBackdrop />
        {visible.map(v => (
          <button
            key={v.id}
            onClick={() => setSelected(v.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${v.x}%`, top: `${v.y}%` }}
            aria-label={`${v.id}, ${v.status}`}
          >
            {v.status === 'High risk' && <span className="absolute inset-0 animate-ping rounded-full bg-red-500/40" />}
            <span
              className={cx('relative grid h-9 w-9 place-items-center rounded-full border-[3px] border-white text-white shadow-lg transition-transform', sel?.id === v.id && 'scale-125')}
              style={{ background: COLORS[v.status] }}
            >
              <Truck size={15} />
            </span>
          </button>
        ))}

        {sel && (
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-[#E3ECE6] bg-white p-4 shadow-xl sm:bottom-auto sm:left-auto sm:top-4 sm:w-60">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-[#101C20]">{sel.id}</span>
              <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white" style={{ background: COLORS[sel.status] }}>{sel.status}</span>
            </div>
            <dl className="mt-3 space-y-1.5 text-[12.5px]">
              <div className="flex justify-between"><dt className="text-[#6B7A72]">Driver</dt><dd className="font-semibold text-[#101C20]">{sel.driver}</dd></div>
              <div className="flex justify-between"><dt className="text-[#6B7A72]">ETA</dt><dd className="font-semibold text-[#101C20]">{sel.eta}</dd></div>
            </dl>
          </div>
        )}

        {visible.length === 0 && (
          <div className="absolute inset-0 grid place-items-center text-[14px] text-[#6B7A72]">No vehicles in this state right now.</div>
        )}
      </Card>
    </Section>
  );
}
