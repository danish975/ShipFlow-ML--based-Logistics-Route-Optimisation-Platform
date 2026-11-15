import {
  CircleCheck,
  Clock,
  MapPin,
  Network,
  Package,
  RefreshCw,
  Send,
  TriangleAlert,
  Truck,
  UserCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, Section, SectionHeading, cx } from './ui';

const events: Array<{ time: string; label: string; icon: LucideIcon; tone?: 'alert' | 'action' }> = [
  { time: '09:10', label: 'Shipment created', icon: Package },
  { time: '09:24', label: 'Vehicle assigned', icon: Truck },
  { time: '10:02', label: 'Shipment dispatched', icon: Send },
  { time: '11:40', label: 'Location updated', icon: MapPin },
  { time: '12:05', label: 'ETA recalculated', icon: Clock },
  { time: '12:18', label: 'Delay detected', icon: TriangleAlert, tone: 'alert' },
  { time: '12:22', label: 'Route optimised', icon: RefreshCw, tone: 'action' },
  { time: '12:23', label: 'Driver updated', icon: UserCheck },
  { time: '16:31', label: 'Delivery completed', icon: CircleCheck },
];

const stack = [
  { layer: 'API & data', items: ['NestJS', 'PostgreSQL'] },
  { layer: 'Real-time', items: ['Socket.IO', 'Next.js'] },
  { layer: 'Machine learning', items: ['FastAPI', 'XGBoost'] },
  { layer: 'Queues & events', items: ['Redis', 'BullMQ'] },
];

export default function EventDriven() {
  return (
    <Section>
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            kicker="Event-driven"
            kickerIcon={Network}
            title="Every operational event,"
            highlight="connected."
            description="ShipFlow processes shipment, tracking, routing and delivery events asynchronously, so workflows react the moment something changes."
          />
          <div className="mt-8 grid grid-cols-2 gap-3">
            {stack.map(s => (
              <div key={s.layer} className="rounded-2xl border border-[#E3ECE6] bg-[#F7FAF8] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7A72]">{s.layer}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {s.items.map(i => (
                    <span key={i} className="rounded-md border border-[#DCE6DF] bg-white px-2 py-1 text-[12.5px] font-semibold text-[#1F2D26]">{i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-[14px] font-bold text-[#101C20]">SHP-2031 · event stream</p>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#087D31]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#16A34A]" /> Live
            </span>
          </div>
          <ol>
            {events.map((e, i) => (
              <li key={e.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={cx(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-full',
                      e.tone === 'alert' ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' : e.tone === 'action' ? 'bg-[#087D31] text-white' : 'bg-[#E8F8E8] text-[#078F33]',
                    )}
                  >
                    <e.icon size={16} />
                  </span>
                  {i < events.length - 1 && <span className="my-1 w-px flex-1 bg-[#E3ECE6]" />}
                </div>
                <div className={cx('flex flex-1 items-center justify-between gap-3 pb-4', i < events.length - 1 && 'min-h-[52px]')}>
                  <p className={cx('pt-2 text-[14.5px] font-semibold', e.tone === 'alert' ? 'text-amber-700' : 'text-[#101C20]')}>{e.label}</p>
                  <span className="pt-2 text-[12px] tabular-nums text-[#9AA8A0]">{e.time}</span>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </Section>
  );
}
