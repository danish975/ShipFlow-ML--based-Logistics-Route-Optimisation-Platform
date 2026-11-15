import { ArrowDown } from 'lucide-react';

const flowEvents = [
  'Shipment Created',
  'Vehicle Assigned',
  'Shipment Dispatched',
  'Location Updated',
  'ETA Recalculated',
  'Delay Detected',
  'Route Optimized',
  'Driver Updated',
  'Delivery Completed'
];

export default function EventDriven() {
  return (
    <section className="py-32 bg-[#F7F7F5] border-y border-[#E5E5E5]">
      <div className="max-w-[800px] mx-auto px-6 text-center">
        
        <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-[#0A0A0A] leading-[1.1] mb-6 tracking-tight">
          Every operational event, connected
        </h2>
        <p className="text-[20px] text-[#5F6368] leading-[1.6] mb-16">
          ShipFlow processes shipment, tracking, routing, and delivery events asynchronously so operational workflows can respond in real time.
        </p>

        <div className="relative max-w-sm mx-auto">
          {/* Tech labels */}
          <div className="absolute -left-24 top-[10%] text-[10px] font-bold text-[#5F6368] uppercase tracking-widest text-right">NestJS<br/>PostgreSQL</div>
          <div className="absolute -right-24 top-[30%] text-[10px] font-bold text-[#5F6368] uppercase tracking-widest text-left">Socket.IO<br/>Next.js</div>
          <div className="absolute -left-24 top-[50%] text-[10px] font-bold text-[#5F6368] uppercase tracking-widest text-right">FastAPI<br/>XGBoost</div>
          <div className="absolute -right-24 top-[70%] text-[10px] font-bold text-[#5F6368] uppercase tracking-widest text-left">Redis<br/>BullMQ</div>

          <div className="flex flex-col items-center">
            {flowEvents.map((event, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`px-6 py-3 rounded-lg border border-[#E5E5E5] text-sm font-semibold transition-colors bg-[#FFFFFF] ${
                  i === 5 || i === 6 ? 'text-[#0A0A0A] shadow-sm border-[#0A0A0A]' : 'text-[#5F6368]'
                }`}>
                  {event}
                </div>
                {i < flowEvents.length - 1 && (
                  <div className="h-6 w-px bg-[#E5E5E5] my-1" />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
