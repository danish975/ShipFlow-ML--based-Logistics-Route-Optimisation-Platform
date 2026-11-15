import { BarChart3, Clock, MapPin, Network, Route, Truck } from 'lucide-react';
import { container } from './ui';

const capabilities = [
  { icon: MapPin, label: 'Real-time tracking' },
  { icon: Clock, label: 'Predictive ETA' },
  { icon: Route, label: 'Dynamic routing' },
  { icon: Truck, label: 'Fleet intelligence' },
  { icon: Network, label: 'Event-driven processing' },
  { icon: BarChart3, label: 'Operational analytics' },
];

export default function Capabilities() {
  return (
    <section className="border-y border-[#E4EEE7] bg-[#F5FAF6] py-10">
      <div className={container}>
        <p className="text-center text-[12px] font-bold uppercase tracking-[0.14em] text-[#6B7A72]">
          Built for modern logistics operations
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {capabilities.map(c => (
            <li
              key={c.label}
              className="flex items-center justify-center gap-2.5 rounded-xl border border-[#E3ECE6] bg-white px-4 py-3.5 text-[14px] font-semibold text-[#1F2D26]"
            >
              <c.icon size={17} className="shrink-0 text-[#087D31]" />
              {c.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
