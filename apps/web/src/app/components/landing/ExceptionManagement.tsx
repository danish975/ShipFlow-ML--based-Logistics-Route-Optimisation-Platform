import { AlertCircle, ArrowRight, Clock, Lightbulb, MapPin, ShieldAlert, Zap } from 'lucide-react';
import { Card, IconChip, Section, SectionHeading } from './ui';

const steps = [
  { icon: ShieldAlert, title: 'Detect', text: 'Risk models score every active shipment continuously.' },
  { icon: Lightbulb, title: 'Recommend', text: 'ShipFlow proposes the fix, e.g. a faster alternative route.' },
  { icon: Zap, title: 'Resolve', text: 'One click pushes the change to the driver and the customer.' },
];

export default function ExceptionManagement() {
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            kicker="Exception management"
            kickerIcon={ShieldAlert}
            title="Detect problems before they"
            highlight="become delays."
            description="ShipFlow doesn’t just track shipments. It actively helps operators respond to disruptions before they reach your customers."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-[#E3ECE6] bg-[#F7FAF8] p-4">
                <div className="flex items-center justify-between">
                  <IconChip icon={s.icon} size="sm" />
                  <span className="text-[11px] font-bold text-[#9AA8A0]">0{i + 1}</span>
                </div>
                <p className="mt-3 text-[15px] font-bold text-[#101C20]">{s.title}</p>
                <p className="mt-1 text-[13px] leading-[1.55] text-[#59676A]">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-[#EDF2EE] pb-4">
            <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#6B7A72]">Exception center</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 ring-1 ring-red-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> High priority
            </span>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <IconChip icon={AlertCircle} tone="red" />
            <div>
              <h3 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#101C20]">SHP-2031</h3>
              <p className="text-[14px] font-semibold text-red-600">Potential 45 min delay · Delhi → Jaipur</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[#E3ECE6] bg-[#F7FAF8] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7A72]">Cause indicators</p>
            <ul className="mt-3 space-y-2.5 text-[14px] font-medium text-[#1F2D26]">
              <li className="flex items-center gap-2.5"><AlertCircle size={15} className="text-red-500" /> Traffic congestion on NH-8</li>
              <li className="flex items-center gap-2.5"><MapPin size={15} className="text-amber-500" /> 1.8 km route deviation</li>
              <li className="flex items-center gap-2.5"><Clock size={15} className="text-amber-500" /> Delivery window closes 5:00 PM</li>
            </ul>
          </div>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7A72]">Recommended action</p>
          <div className="mt-2 flex items-center justify-between gap-4 rounded-xl border border-[#BFE3C8] bg-green-50/60 p-4">
            <div>
              <p className="text-[14px] font-bold text-[#101C20]">Alternative route via Bhiwadi</p>
              <p className="text-[12.5px] font-medium text-[#087D31]">Saves ~22 minutes</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#087D31] px-4 py-2 text-[13px] font-semibold text-white">
              Review route <ArrowRight size={14} />
            </span>
          </div>
        </Card>
      </div>
    </Section>
  );
}
