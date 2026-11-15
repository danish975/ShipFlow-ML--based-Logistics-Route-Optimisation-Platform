import { CircleCheck, PlayCircle, RefreshCw, ShieldAlert, TrafficCone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, Section, SectionHeading, cx } from './ui';

const scenario = [
  { value: '100', label: 'Shipments' },
  { value: '20', label: 'Vehicles' },
  { value: '6', label: 'Delivery windows' },
  { value: 'Live', label: 'Tracking' },
];

const timeline: Array<{ icon: LucideIcon; step: string; text: string; tone: 'red' | 'amber' | 'green' | 'done' }> = [
  { icon: TrafficCone, step: 'Problem', text: 'A traffic disruption hits multiple routes at once.', tone: 'red' },
  { icon: ShieldAlert, step: 'ShipFlow detected', text: 'Delay risk rises across 14 affected shipments.', tone: 'amber' },
  { icon: RefreshCw, step: 'Action', text: 'Route optimisation generates faster alternatives.', tone: 'green' },
  { icon: CircleCheck, step: 'Result', text: 'Updated routes are pushed to affected vehicles: 92% stay on time.', tone: 'done' },
];

const toneClass = {
  red: 'bg-red-50 text-red-600 ring-red-200',
  amber: 'bg-amber-50 text-amber-600 ring-amber-200',
  green: 'bg-[#E8F8E8] text-[#078F33] ring-[#BFE3C8]',
  done: 'bg-[#087D31] text-white ring-[#087D31]',
};

export default function InteractiveDemo() {
  return (
    <Section tone="tint">
      <SectionHeading
        align="center"
        kicker="Interactive demonstration"
        kickerIcon={PlayCircle}
        title="See ShipFlow"
        highlight="in action."
        description="A high-volume delivery day, and how ShipFlow keeps it on schedule when things go wrong."
      />

      <Card className="mt-12 grid overflow-hidden lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="border-b border-[#EDF2EE] bg-gradient-to-br from-[#F3FBF5] to-white p-8 lg:border-b-0 lg:border-r lg:p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#087D31]">Scenario</p>
          <h3 className="mt-2 text-[22px] font-extrabold tracking-[-0.02em] text-[#101C20]">High-volume delivery operation</h3>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {scenario.map(s => (
              <div key={s.label} className="rounded-2xl border border-[#E3ECE6] bg-white p-4">
                <p className="text-[26px] font-extrabold tracking-[-0.03em] text-[#101C20]">{s.value}</p>
                <p className="text-[13px] font-medium text-[#6B7A72]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <ol className="p-8 lg:p-10">
          {timeline.map((t, i) => (
            <li key={t.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1', toneClass[t.tone])}>
                  <t.icon size={17} />
                </span>
                {i < timeline.length - 1 && <span className="my-1 w-px flex-1 bg-[#E3ECE6]" />}
              </div>
              <div className={cx('pt-1.5', i < timeline.length - 1 && 'pb-6')}>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B7A72]">{t.step}</p>
                <p className={cx('mt-1 text-[15.5px] font-semibold', t.tone === 'done' ? 'text-[#087D31]' : 'text-[#101C20]')}>{t.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </Section>
  );
}
