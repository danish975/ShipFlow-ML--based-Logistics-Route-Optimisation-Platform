'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Bike,
  Box,
  Brain,
  Clock,
  Package,
  Search,
  Timer,
  Truck,
  Van,
} from 'lucide-react';
import LiveMap from './components/LiveMap';
import { DEMO_FLEET, STATUS_META } from './components/fleet-data';
import type { FleetVehicle } from './components/fleet-data';
import { Donut, LineChart, MiniBars } from './components/charts';
import { Badge, Card, CardHeader, CHART, KpiStrip, MoreButton, cn } from './components/ui';
import type { Kpi } from './components/ui';

const kpis: Kpi[] = [
  { icon: Package, label: 'Total shipments today', value: '142', caption: 'Across all hubs', delta: '+12.4%', deltaGood: true },
  { icon: Truck, label: 'Active vehicles', value: '17 / 20', caption: 'Currently on route', delta: '+4.2%', deltaGood: true, deltaCaption: 'vs last 7 days' },
  { icon: Timer, label: 'Avg. delivery time', value: '4h 12m', caption: 'Faster than 30-day avg', delta: '-18m', deltaGood: true },
  { icon: Clock, label: 'On-time delivery rate', value: '96.5%', caption: 'Target: 98.0%', delta: '-0.4%', deltaGood: false },
];

const performance = {
  Today: {
    labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    delivered: [6, 14, 31, 52, 89, 112, 131],
    delayed: [0, 1, 1, 2, 3, 4, 5],
    title: (l: string) => `Today · ${l}`,
  },
  'This week': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    delivered: [118, 126, 134, 129, 141, 97, 88],
    delayed: [6, 4, 7, 5, 3, 4, 2],
    title: (l: string) => `${l} · full day`,
  },
} as const;

type Range = keyof typeof performance;

const orderStatus = [
  { label: 'Delivered', value: 89, color: CHART.green },
  { label: 'In transit', value: 38, color: CHART.blue },
  { label: 'Delayed', value: 5, color: CHART.amber },
  { label: 'Pending', value: 10, color: CHART.violet },
];

const alerts = [
  {
    severity: 'High', tone: 'red' as const, type: 'Delay risk',
    title: 'SHP-2003 — Delhi → Jaipur',
    description: '78% probability of a 45 min delay due to NH-8 congestion.',
    time: '10 mins ago', link: '/dashboard/shipments/SHP-2003',
  },
  {
    severity: 'Medium', tone: 'amber' as const, type: 'Route deviation',
    title: 'DL1LV9999 — 1.8 km off route',
    description: 'Driver Amit Patel deviated from the planned route near Manesar.',
    time: '25 mins ago', link: '/dashboard/fleet',
  },
  {
    severity: 'Low', tone: 'gray' as const, type: 'Traffic alert',
    title: 'Gurugram–Jaipur corridor congestion',
    description: 'Affecting 5 shipments and 2 vehicles.',
    time: '1 hr ago', link: '/dashboard/exceptions',
  },
];

// Route endpoints & progress for the active-fleet list
const fleetRoutes: Record<string, { from: string; fromSub: string; to: string; toSub: string; progress: number }> = {
  v1: { from: 'GGN', fromSub: 'Cyber Hub', to: 'DEL', toSub: 'Connaught Pl.', progress: 64 },
  v2: { from: 'DEL', fromSub: 'Connaught Pl.', to: 'NOI', toSub: 'Sector 62', progress: 12 },
  v3: { from: 'DEL', fromSub: 'Nehru Place', to: 'JAI', toSub: 'Jaipur', progress: 58 },
  v4: { from: 'DEL', fromSub: 'Vasant Kunj', to: 'GZB', toSub: 'Indirapuram', progress: 41 },
  v5: { from: 'NOI', fromSub: 'Sector 62', to: 'GGN', toSub: 'Cyber Hub', progress: 77 },
};

export default function DashboardPage() {
  const [range, setRange] = useState<Range>('Today');
  const [fleetQuery, setFleetQuery] = useState('');
  const perf = performance[range];

  return (
    <div className="space-y-4">
      {/* Operations overview */}
      <Card>
        <CardHeader
          title="Operations overview"
          action={
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-gray-500">Live · updated just now</span>
              <MoreButton />
            </div>
          }
          className="mb-5"
        />
        <KpiStrip items={kpis} />
      </Card>

      {/* Performance chart + live map */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-4">
        <Card>
          <CardHeader
            title="Delivery performance"
            subtitle="Cumulative deliveries vs delays"
            action={
              <select
                value={range}
                onChange={e => setRange(e.target.value as Range)}
                aria-label="Time range"
                className="h-8 pl-3 pr-8 text-[13px] text-gray-700 bg-white border border-gray-200 rounded-lg outline-none focus:border-green-600 cursor-pointer"
              >
                {(Object.keys(performance) as Range[]).map(r => <option key={r}>{r}</option>)}
              </select>
            }
          />
          <LineChart
            key={range}
            labels={[...perf.labels]}
            height={300}
            tooltipTitle={i => perf.title(perf.labels[i])}
            series={[
              { name: 'Delivered', color: CHART.green, values: [...perf.delivered], area: true },
              { name: 'Delayed', color: CHART.amber, values: [...perf.delayed], dashed: true },
            ]}
          />
        </Card>

        <Card className="flex flex-col min-h-[460px]">
          <CardHeader
            title="Live fleet tracking"
            subtitle="Delhi NCR · updates every few seconds"
            action={
              <label className="flex items-center gap-2 h-8 px-3 w-44 sm:w-56 bg-white border border-gray-200 rounded-lg focus-within:border-green-600">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  value={fleetQuery}
                  onChange={e => setFleetQuery(e.target.value)}
                  placeholder="Search for fleet"
                  className="flex-1 min-w-0 bg-transparent outline-none text-[13px] placeholder:text-gray-400"
                />
              </label>
            }
          />
          <div className="flex-1 min-h-[360px]">
            <LiveMap query={fleetQuery} />
          </div>
        </Card>
      </div>

      {/* Active fleet · loading · order status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card className="flex flex-col">
          <CardHeader title="Active fleet" subtitle={`${DEMO_FLEET.filter(v => v.shipmentNumber).length} vehicles on assignment`} />
          <div className="space-y-3 overflow-y-auto max-h-[340px] pr-1 -mr-1">
            {DEMO_FLEET.filter(v => fleetRoutes[v.id]).map(v => (
              <FleetRouteCard key={v.id} vehicle={v} />
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Current loading status" subtitle="Across Okhla, Gurugram & Noida hubs" />
          <div className="grid grid-cols-2 border border-gray-200 rounded-xl overflow-hidden">
            <LoadingStat value="03" label="Trucks being loaded" bars={[3, 5, 2, 4, 3]} />
            <LoadingStat value="72%" label="Average load" bars={[64, 78, 70, 81, 72]} unit="%" className="border-l" />
            <LoadingStat value="5 / 8" label="Docks in use" bars={[4, 6, 5, 7, 5]} className="border-t" />
            <LoadingStat value="24m" label="Avg. loading time" bars={[31, 27, 26, 22, 24]} unit="m" className="border-l border-t" />
          </div>
        </Card>

        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader title="Order status" subtitle="Today’s shipments by state" />
          <Donut segments={orderStatus} centerLabel="Total shipments" size={190} />
        </Card>
      </div>

      {/* AI alerts */}
      <Card>
        <CardHeader
          title={
            <span className="inline-flex items-center gap-2">
              <Brain className="w-4 h-4 text-green-700" />
              ML alerts & exceptions
            </span>
          }
          subtitle="Predicted by the delay-risk and route-deviation models"
          action={
            <Link href="/dashboard/exceptions" className="inline-flex items-center gap-1 text-[13px] font-medium text-green-700 hover:text-green-800">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {alerts.map(a => (
            <Link
              key={a.title}
              href={a.link}
              className="group block p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge tone={a.tone} dot>{a.severity}</Badge>
                  <span className="text-xs text-gray-500">{a.type}</span>
                </div>
                <span className="text-[11px] text-gray-400">{a.time}</span>
              </div>
              <p className="mt-2.5 text-sm font-medium text-gray-900">{a.title}</p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">{a.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-green-700 opacity-0 group-hover:opacity-100 transition-opacity">
                Investigate <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FleetRouteCard({ vehicle }: { vehicle: FleetVehicle }) {
  const route = fleetRoutes[vehicle.id];
  const meta = STATUS_META[vehicle.status];
  const tone = vehicle.status === 'delayed' ? 'amber' : vehicle.status === 'pickup' ? 'blue' : 'green';
  const Icon = vehicle.vehicleType === 'BIKE' ? Bike : vehicle.vehicleType === 'VAN' ? Van : Truck;

  return (
    <div className="border border-gray-200 rounded-xl">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <p className="text-[13px] text-gray-900">
          <span className="font-semibold">{vehicle.vehicleNumber}</span>
          <span className="text-gray-300 mx-1.5">•</span>
          <span className="text-gray-500">ETA {vehicle.eta}</span>
        </p>
        <Badge tone={tone}>{meta.label}</Badge>
      </div>
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-gray-600" strokeWidth={1.75} />
        </div>
        <div className="text-center w-16 shrink-0">
          <p className="text-[13px] font-semibold text-gray-900">{route.from}</p>
          <p className="text-[11px] text-gray-500 truncate">{route.fromSub}</p>
        </div>
        <div className="relative flex-1 h-4 flex items-center" aria-label={`${route.progress}% complete`}>
          <div className="absolute inset-x-0 border-t-2 border-dashed border-gray-200" />
          <div className="absolute left-0 h-[3px] rounded-full bg-gray-900" style={{ width: `${route.progress}%` }} />
          <div
            className="absolute w-4 h-4 -ml-2 rounded-full bg-gray-900 ring-4 ring-white flex items-center justify-center"
            style={{ left: `${route.progress}%` }}
          >
            <span className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-white ml-[1px]" />
          </div>
        </div>
        <div className="text-center w-16 shrink-0">
          <p className="text-[13px] font-semibold text-gray-900">{route.to}</p>
          <p className="text-[11px] text-gray-500 truncate">{route.toSub}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingStat({
  value,
  label,
  bars,
  unit,
  className,
}: {
  value: string;
  label: string;
  bars: number[];
  unit?: string;
  className?: string;
}) {
  return (
    <div className={cn('p-4 border-gray-200', className)}>
      <div className="flex items-center gap-2">
        <Box className="w-3.5 h-3.5 text-gray-400" />
        <p className="text-[22px] font-semibold text-gray-900 tracking-tight tabular-nums">{value}</p>
      </div>
      <p className="text-xs text-gray-500 mt-0.5 mb-4">{label}</p>
      <MiniBars values={bars} color={CHART.green} unit={unit} />
    </div>
  );
}
