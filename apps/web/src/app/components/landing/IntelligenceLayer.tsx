import { Brain, Clock, Repeat, Route as RouteIcon, ShieldAlert } from 'lucide-react';
import { Card, IconChip, Section, SectionHeading } from './ui';

export default function IntelligenceLayer() {
  return (
    <Section id="intelligence" tone="tint">
      <SectionHeading
        kicker="Intelligence"
        kickerIcon={Brain}
        title="Intelligence across every"
        highlight="stage of delivery."
        description="Four connected models turn raw telemetry into decisions, from the first ETA to the final reroute."
      />

      <div className="relative mt-12">
        {/* connector line behind the step numbers on large screens */}
        <div className="absolute left-[12.5%] right-[12.5%] top-[22px] hidden h-px bg-gradient-to-r from-[#BFE3C8] via-[#16A34A] to-[#BFE3C8] lg:block" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Step n={1} icon={Clock} title="Predict" text="ETA prediction for every active shipment.">
            <div className="text-center">
              <p className="text-[11px] font-medium text-[#6B7A72]">Predicted arrival</p>
              <p className="text-[26px] font-extrabold tracking-[-0.03em] text-[#101C20]">4:32 PM</p>
            </div>
          </Step>
          <Step n={2} icon={ShieldAlert} title="Detect" text="Delay-risk scoring flags trouble early.">
            <div className="w-full">
              <div className="mb-1.5 flex justify-between text-[12px] font-semibold"><span className="text-[#3B4A42]">Delay risk</span><span className="text-red-600">78%</span></div>
              <div className="h-2 rounded-full bg-[#EDF2EE]"><div className="h-full w-[78%] rounded-full bg-gradient-to-r from-amber-400 to-red-500" /></div>
            </div>
          </Step>
          <Step n={3} icon={RouteIcon} title="Optimise" text="Route solver finds the faster path.">
            <svg viewBox="0 0 120 40" className="h-16 w-full" aria-hidden>
              <path d="M5 30 C30 5 50 38 70 18 S105 10 115 12" fill="none" stroke="#CBD5D0" strokeWidth="3" strokeDasharray="5 5" />
              <path d="M5 30 C35 22 70 16 115 12" fill="none" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="5" cy="30" r="4" fill="#087D31" /><circle cx="115" cy="12" r="4" fill="#087D31" />
            </svg>
          </Step>
          <Step n={4} icon={Repeat} title="Respond" text="Updated routes pushed to drivers.">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[12.5px] font-semibold text-green-700 ring-1 ring-green-600/15">
              <Repeat size={13} /> Rerouted · −14 min
            </span>
          </Step>
        </div>
      </div>
    </Section>
  );
}

function Step({
  n,
  icon,
  title,
  text,
  children,
}: {
  n: number;
  icon: typeof Clock;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col">
      <span className="relative z-10 mx-auto mb-5 hidden h-11 w-11 place-items-center rounded-full border-4 border-[#F5FAF6] bg-[#087D31] text-[14px] font-bold text-white lg:grid">
        {n}
      </span>
      <Card className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <IconChip icon={icon} size="sm" />
          <h3 className="text-[17px] font-bold text-[#101C20]">{title}</h3>
        </div>
        <p className="mt-3 flex-1 text-[14px] leading-[1.6] text-[#59676A]">{text}</p>
        <div className="mt-5 flex h-24 items-center justify-center rounded-xl border border-[#EDF2EE] bg-[#F7FAF8] px-4">{children}</div>
      </Card>
    </div>
  );
}
