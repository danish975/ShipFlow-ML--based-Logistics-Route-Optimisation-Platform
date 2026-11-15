import { AlertTriangle, Clock, MapPin, Package, RotateCcw, Timer, Truck } from 'lucide-react';
import { container, MapBackdrop } from './ui';

const kpis = [
  { icon: Package, label: 'Active shipments', value: '142', delta: '+12.4%', good: true },
  { icon: Truck, label: 'Fleet utilisation', value: '87%', delta: '+4.2%', good: true },
  { icon: Timer, label: 'On-time delivery', value: '96.5%', delta: '+1.2%', good: true },
  { icon: Clock, label: 'At risk', value: '3', delta: '−2', good: false },
];

const vehicles = [
  { id: 'HR38X1234', x: 22, y: 58, color: '#15803d' },
  { id: 'DL1LV9999', x: 47, y: 38, color: '#d97706' },
  { id: 'UP16Z4321', x: 74, y: 30, color: '#15803d' },
  { id: 'HR38X5678', x: 63, y: 70, color: '#0284c7' },
];

export default function DashboardPreview() {
  return (
    <section className="bg-white pt-14 pb-20 lg:pb-24">
      <div className={container}>
        <div className="overflow-hidden rounded-[24px] border border-[#E3ECE6] bg-white shadow-[0_30px_80px_-20px_rgba(20,70,40,0.22)]">
          {/* Window chrome */}
          <div className="flex h-12 items-center gap-4 border-b border-[#E8EFEA] bg-[#F7FAF8] px-5">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#F87171]" />
              <span className="h-3 w-3 rounded-full bg-[#FBBF24]" />
              <span className="h-3 w-3 rounded-full bg-[#4ADE80]" />
            </div>
            <div className="mx-auto flex h-7 w-full max-w-[360px] items-center justify-center rounded-lg border border-[#E3ECE6] bg-white text-[12px] text-[#6B7A72]">
              app.shipflow.io/dashboard
            </div>
            <span className="hidden w-14 sm:block" />
          </div>

          <div className="grid gap-5 bg-[#F5F7F6] p-5 sm:p-6">
            {/* KPI strip */}
            <div className="grid grid-cols-2 gap-y-5 rounded-2xl border border-[#E3ECE6] bg-white p-5 lg:grid-cols-4">
              {kpis.map(k => (
                <div key={k.label} className={`border-l-2 pl-4 ${k.good ? 'border-[#16A34A]' : 'border-red-400'}`}>
                  <p className="flex items-center gap-2 text-[13px] font-medium text-[#6B7A72]">
                    <k.icon size={15} strokeWidth={1.8} /> {k.label}
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-2 pr-3">
                    <p className="text-[26px] font-bold leading-none tracking-[-0.03em] text-[#101C20]">{k.value}</p>
                    <span className={`hidden rounded-full px-2 py-0.5 text-[11px] font-semibold sm:inline ${k.good ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {k.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              {/* Map */}
              <div className="relative h-[340px] overflow-hidden rounded-2xl border border-[#E3ECE6] bg-white sm:h-[380px]">
                <MapBackdrop />
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                  <path d="M22 58 C32 50 38 42 47 38 S66 32 74 30" fill="none" stroke="#16A34A" strokeWidth="0.9" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 3.5 }} />
                  <path d="M22 58 C35 66 50 72 63 70" fill="none" stroke="#0284C7" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 3 }} />
                </svg>
                {vehicles.map(v => (
                  <div key={v.id} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${v.x}%`, top: `${v.y}%` }}>
                    <div className="mb-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2 py-1 text-[11px] font-semibold text-[#111827] shadow-sm">{v.id}</div>
                    <div className="mx-auto grid h-7 w-7 translate-y-1/2 place-items-center rounded-full border-2 border-white text-white shadow-md" style={{ background: v.color, boxShadow: `0 0 0 4px ${v.color}33` }}>
                      <Truck size={13} />
                    </div>
                  </div>
                ))}
                <div className="absolute left-4 top-4 rounded-lg border border-[#E3ECE6] bg-white px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-[#3B4A42] shadow-sm">
                  <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-[#16A34A]" /> LIVE FLEET MAP
                </div>
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 overflow-hidden rounded-xl border border-[#E3ECE6] bg-white/95 text-[12px] text-[#3B4A42]">
                  {[['In transit', '#15803d'], ['Pick-up', '#0284c7'], ['Stationary', '#7c3aed'], ['Delayed', '#d97706']].map(([l, c], i) => (
                    <span key={l} className={`flex items-center justify-center gap-1.5 py-2 ${i ? 'border-l border-[#E3ECE6]' : ''}`}>
                      <i className="h-2 w-2 rounded-full" style={{ background: c }} /> <span className="hidden sm:inline">{l}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* AI exceptions */}
              <div className="rounded-2xl border border-[#E3ECE6] bg-white p-5">
                <p className="text-[13px] font-bold text-[#101C20]">AI exceptions</p>
                <p className="text-[12px] text-[#6B7A72]">Predicted by the delay-risk model</p>

                <div className="mt-4 rounded-xl border border-red-200 bg-red-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[13px] font-bold text-red-700"><AlertTriangle size={14} /> SHP-2031</span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-red-600 ring-1 ring-red-200">78% risk</span>
                  </div>
                  <p className="mt-1.5 text-[12px] text-red-900/80">NH-8 congestion near Manesar</p>
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-200 bg-white px-3 py-2 text-[12px] font-medium text-[#101C20]">
                    <RotateCcw size={13} className="text-[#087D31]" /> Route recalculated · saves 14 min
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-[#E3ECE6] bg-[#F7FAF8] p-4">
                  <span className="flex items-center gap-2 text-[13px] font-bold text-[#101C20]"><MapPin size={14} className="text-[#087D31]" /> SHP-1944</span>
                  <p className="mt-1 text-[12px] text-[#6B7A72]">Arriving in 14 mins · on schedule</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E3ECE6]"><div className="h-full w-[82%] rounded-full bg-[#16A34A]" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
