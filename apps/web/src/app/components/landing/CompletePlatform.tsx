import Link from 'next/link';
import { ArrowRight, BarChart3, Boxes, Check, Package, Route as RouteIcon, Truck } from 'lucide-react';
import { Card, IconChip, Section, SectionHeading } from './ui';

const modules = [
  {
    icon: Package,
    title: 'Shipment operations',
    text: 'Create and manage shipments end to end.',
    features: ['Auto-numbered shipments', 'Status timeline & events', 'Delivery windows & notes'],
    href: '/dashboard/shipments',
  },
  {
    icon: Truck,
    title: 'Fleet management',
    text: 'Manage vehicles, drivers and capacity.',
    features: ['Live load vs capacity', 'Driver directory & ratings', 'Maintenance alerts'],
    href: '/dashboard/fleet',
  },
  {
    icon: RouteIcon,
    title: 'Route intelligence',
    text: 'Optimise routes and reroute dynamically.',
    features: ['Multi-stop optimisation', 'Current vs optimised plans', 'Distance, time & cost savings'],
    href: '/dashboard/routes',
  },
  {
    icon: BarChart3,
    title: 'Operations intelligence',
    text: 'Monitor risk, ETA, performance and exceptions.',
    features: ['ML delay-risk alerts', 'On-time performance', 'Model accuracy tracking'],
    href: '/dashboard/analytics',
  },
];

export default function CompletePlatform() {
  return (
    <Section id="solutions">
      <SectionHeading
        align="center"
        kicker="Solutions"
        kickerIcon={Boxes}
        title="One platform for the"
        highlight="entire delivery operation."
        description="ShipFlow connects shipment management, fleet operations, route intelligence, real-time tracking and analytics in one place."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {modules.map(m => (
          <Card key={m.title} className="group flex flex-col p-6 transition-all hover:border-[#BFE3C8] hover:shadow-[0_18px_40px_-12px_rgba(20,110,50,0.22)] sm:p-7">
            <div className="flex items-start gap-4">
              <IconChip icon={m.icon} />
              <div>
                <h3 className="text-[18px] font-bold tracking-[-0.01em] text-[#101C20]">{m.title}</h3>
                <p className="mt-1 text-[14.5px] text-[#59676A]">{m.text}</p>
              </div>
            </div>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
              {m.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-[13.5px] font-medium text-[#1F2D26]">
                  <Check size={15} className="mt-0.5 shrink-0 text-[#087D31]" strokeWidth={2.5} /> {f}
                </li>
              ))}
            </ul>
            <Link href={m.href} className="mt-6 inline-flex items-center gap-1.5 self-start text-[14px] font-semibold text-[#087D31] hover:text-[#065F25]">
              Open in dashboard <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}
