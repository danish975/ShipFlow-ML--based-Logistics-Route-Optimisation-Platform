import { BellRing, CircleCheck, Clock, Gauge } from 'lucide-react';
import { Card, IconChip, Section, SectionHeading } from './ui';

const points = [
  { icon: Gauge, title: 'Confidence on every ETA', text: 'Each prediction ships with a confidence score, so dispatchers know which ones to trust.' },
  { icon: BellRing, title: 'Early delay warnings', text: 'Shipments at risk of missing their window are flagged before the customer notices.' },
];

export default function PredictiveEta() {
  return (
    <Section tone="tint">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Card className="relative order-2 flex h-[440px] items-center justify-center overflow-hidden p-6 lg:order-1">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#E3F6E8,transparent_60%)]" />
          <div className="relative w-full max-w-[380px] overflow-hidden rounded-2xl border border-[#E3ECE6] bg-white shadow-[0_24px_60px_-20px_rgba(20,70,40,0.35)]">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold text-[#101C20]">SHP-2031</span>
                <span className="text-[12px] font-medium text-[#6B7A72]">Delhi → Jaipur</span>
              </div>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7A72]">Predicted arrival</p>
              <p className="text-[42px] font-extrabold leading-tight tracking-[-0.04em] text-[#101C20]">4:32 PM</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7A72]">Delivery window</p>
                  <p className="text-[14px] font-semibold text-[#101C20]">4:30 – 5:00 PM</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[12px] font-semibold text-green-700 ring-1 ring-green-600/15">
                  <CircleCheck size={13} /> Low risk
                </span>
              </div>
            </div>
            <div className="border-t border-[#EDF2EE] bg-[#F7FAF8] p-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7A72]">Prediction confidence</span>
                <span className="text-[14px] font-bold text-[#087D31]">87%</span>
              </div>
              <div className="mt-4 flex h-16 items-end gap-1.5">
                {[18, 30, 46, 64, 100, 58, 34, 20].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-t-[4px] ${i === 4 ? 'bg-[#087D31]' : 'bg-[#BFE3C8]'}`} style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-[#6B7A72]"><span>4:10</span><span>4:32</span><span>4:55</span></div>
            </div>
          </div>
        </Card>

        <div className="order-1 lg:order-2">
          <SectionHeading
            kicker="Predictive ETA"
            kickerIcon={Clock}
            title="Know when every shipment"
            highlight="will arrive."
            description="ShipFlow continuously re-estimates delivery times from live location, traffic and history, and identifies shipments that may miss their delivery windows."
          />
          <div className="mt-8 space-y-5">
            {points.map(p => (
              <div key={p.title} className="flex gap-4">
                <IconChip icon={p.icon} size="sm" />
                <div>
                  <p className="text-[15px] font-bold text-[#101C20]">{p.title}</p>
                  <p className="mt-1 text-[14.5px] leading-[1.6] text-[#59676A]">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
