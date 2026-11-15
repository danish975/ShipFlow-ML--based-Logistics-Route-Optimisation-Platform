import { Clock, MapPin, Network, Route, Sparkles } from 'lucide-react';
import { Card, IconChip, Section, SectionHeading } from './ui';

const items = [
  {
    icon: MapPin,
    title: 'Real-time fleet tracking',
    text: 'Every vehicle on one live map, with status, speed and assignment at a glance.',
    stat: '< 2s',
    statLabel: 'location refresh',
  },
  {
    icon: Clock,
    title: 'Predictive ETA intelligence',
    text: 'Machine-learning ETAs that flag shipments likely to miss their delivery window.',
    stat: '91%',
    statLabel: 'ETA model accuracy',
  },
  {
    icon: Route,
    title: 'Dynamic route optimisation',
    text: 'Multi-stop, multi-vehicle plans that recalculate automatically when conditions change.',
    stat: '−18%',
    statLabel: 'average distance',
  },
  {
    icon: Network,
    title: 'Event-driven operations',
    text: 'Every pickup, delay and reroute flows through one event stream your team can act on.',
    stat: '9',
    statLabel: 'lifecycle events tracked',
  },
];

export default function Metrics() {
  return (
    <Section>
      <SectionHeading
        kicker="Why ShipFlow"
        kickerIcon={Sparkles}
        title="Logistics intelligence built for"
        highlight="every delivery."
        description="Four capabilities that work together, so operations teams spend less time firefighting and more time delivering."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(item => (
          <Card key={item.title} className="group flex flex-col p-6 transition-all hover:-translate-y-1 hover:border-[#BFE3C8] hover:shadow-[0_18px_40px_-12px_rgba(20,110,50,0.25)]">
            <IconChip icon={item.icon} />
            <h3 className="mt-5 text-[17px] font-bold tracking-[-0.01em] text-[#101C20]">{item.title}</h3>
            <p className="mt-2 flex-1 text-[14px] leading-[1.6] text-[#59676A]">{item.text}</p>
            <div className="mt-6 border-t border-[#EDF2EE] pt-4">
              <p className="text-[24px] font-extrabold tracking-[-0.03em] text-[#087D31]">{item.stat}</p>
              <p className="text-[12px] font-medium text-[#6B7A72]">{item.statLabel}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
