'use client';

import { useState } from 'react';
import { Check, Clock, IndianRupee, MapPin, Package, Route as RouteIcon, Sparkles, Truck } from 'lucide-react';
import { Badge, Button, Card, CardHeader, CHART, KpiStrip, PageHeader, cn } from '../components/ui';
import type { Kpi } from '../components/ui';

const routeData = {
  shipments: 12,
  vehicles: 4,
  stops: 28,
  current: { distanceKm: 184, travelTimeMin: 342, vehicles: 4, estimatedCost: 12400 },
  optimized: { distanceKm: 151, travelTimeMin: 291, vehicles: 4, estimatedCost: 10200 },
};

// Identity colors follow the vehicle (fixed categorical order)
const vehicleRoutes = [
  { vehicle: 'HR38X1234', driver: 'Ramesh Kumar', type: 'MINI_TRUCK', stops: 8, distanceKm: 52, durationMin: 96, optDistanceKm: 41, optDurationMin: 78, color: CHART.green },
  { vehicle: 'HR38X5678', driver: 'Suresh Singh', type: 'VAN', stops: 6, distanceKm: 38, durationMin: 72, optDistanceKm: 34, optDurationMin: 64, color: CHART.blue },
  { vehicle: 'DL1LV9999', driver: 'Amit Patel', type: 'TRUCK', stops: 8, distanceKm: 58, durationMin: 108, optDistanceKm: 46, optDurationMin: 89, color: CHART.amber },
  { vehicle: 'UP16Z4321', driver: 'Vikram Yadav', type: 'MINI_TRUCK', stops: 6, distanceKm: 36, durationMin: 66, optDistanceKm: 30, optDurationMin: 60, color: CHART.violet },
];

function formatTime(minutes: number) {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

const kpis: Kpi[] = [
  { icon: Package, label: 'Shipments in plan', value: String(routeData.shipments), caption: 'Ready for dispatch' },
  { icon: Truck, label: 'Vehicles', value: String(routeData.vehicles), caption: 'Assigned to this plan' },
  { icon: MapPin, label: 'Total stops', value: String(routeData.stops), caption: 'Pickups and drop-offs' },
  { icon: Sparkles, label: 'Projected savings', value: '18%', caption: 'Distance vs current plan', delta: '-33 km', deltaGood: true, deltaCaption: 'per day' },
];

export default function RouteIntelligencePage() {
  const [applied, setApplied] = useState(false);

  const saved = {
    distanceKm: routeData.current.distanceKm - routeData.optimized.distanceKm,
    timeMin: routeData.current.travelTimeMin - routeData.optimized.travelTimeMin,
    cost: routeData.current.estimatedCost - routeData.optimized.estimatedCost,
  };
  const pct = (a: number, b: number) => Math.round(((a - b) / a) * 100);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Route intelligence"
        description="AI-powered route optimisation and planning for today’s dispatch."
        actions={
          <Button onClick={() => setApplied(true)} disabled={applied} variant={applied ? 'secondary' : 'primary'}>
            {applied ? <><Check className="w-4 h-4 text-green-700" /> Routes applied</> : <><Sparkles className="w-4 h-4" /> Apply optimised routes</>}
          </Button>
        }
      />

      <Card>
        <KpiStrip items={kpis} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlanCard
          title="Current plan"
          active={!applied}
          data={routeData.current}
        />
        <PlanCard
          title="Optimised plan"
          active={applied}
          highlight
          data={routeData.optimized}
          savings={{
            distance: `-${pct(routeData.current.distanceKm, routeData.optimized.distanceKm)}%`,
            time: `-${pct(routeData.current.travelTimeMin, routeData.optimized.travelTimeMin)}%`,
            cost: `-${pct(routeData.current.estimatedCost, routeData.optimized.estimatedCost)}%`,
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SavingTile icon={RouteIcon} value={`${saved.distanceKm} km`} label="Distance saved" />
        <SavingTile icon={Clock} value={`${saved.timeMin} min`} label="Time saved" />
        <SavingTile icon={IndianRupee} value={`₹${saved.cost.toLocaleString('en-IN')}`} label="Cost saved" />
      </div>

      <Card>
        <CardHeader title="Vehicle route breakdown" subtitle={applied ? 'Showing optimised distances and durations' : 'Apply the optimised plan to compare'} />
        <div className="space-y-3">
          {vehicleRoutes.map(r => {
            const dist = applied ? r.optDistanceKm : r.distanceKm;
            return (
              <div key={r.vehicle} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 sm:w-64 shrink-0">
                  <span className="w-2.5 h-10 rounded-full shrink-0" style={{ background: r.color }} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{r.vehicle}</p>
                    <p className="text-xs text-gray-500 truncate">{r.driver} · {r.type.replace('_', ' ')} · {r.stops} stops</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(dist / 60) * 100}%`, background: r.color }} />
                  </div>
                </div>
                <div className="flex gap-6 text-[13px] sm:w-56 sm:justify-end">
                  <Metric before={`${r.distanceKm} km`} after={`${r.optDistanceKm} km`} applied={applied} />
                  <Metric before={formatTime(r.durationMin)} after={formatTime(r.optDurationMin)} applied={applied} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function PlanCard({
  title,
  active,
  highlight,
  data,
  savings,
}: {
  title: string;
  active: boolean;
  highlight?: boolean;
  data: typeof routeData.current;
  savings?: { distance: string; time: string; cost: string };
}) {
  return (
    <Card className={cn('transition-all', active && highlight && 'border-green-300 ring-4 ring-green-600/5', !active && 'opacity-80')}>
      <CardHeader
        title={title}
        action={active ? <Badge tone={highlight ? 'green' : 'blue'} dot>Active</Badge> : <Badge>Inactive</Badge>}
      />
      <div className="grid grid-cols-2 gap-3">
        <PlanStat label="Distance" value={`${data.distanceKm} km`} delta={savings?.distance} />
        <PlanStat label="Travel time" value={formatTime(data.travelTimeMin)} delta={savings?.time} />
        <PlanStat label="Vehicles" value={String(data.vehicles)} />
        <PlanStat label="Estimated cost" value={`₹${data.estimatedCost.toLocaleString('en-IN')}`} delta={savings?.cost} />
      </div>
    </Card>
  );
}

function PlanStat({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-lg font-semibold text-gray-900 tabular-nums">{value}</p>
        {delta && <span className="text-xs font-medium text-green-700">{delta}</span>}
      </div>
    </div>
  );
}

function SavingTile({ icon: Icon, value, label }: { icon: typeof Clock; value: string; label: string }) {
  return (
    <Card className="flex items-center gap-4">
      <span className="w-11 h-11 rounded-xl bg-green-50 text-green-700 flex items-center justify-center ring-1 ring-green-600/10">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <p className="text-xl font-semibold text-gray-900 tabular-nums">{value}</p>
        <p className="text-xs text-gray-500">{label} per day</p>
      </div>
    </Card>
  );
}

function Metric({ before, after, applied }: { before: string; after: string; applied: boolean }) {
  return (
    <div className="text-right">
      <p className={cn('tabular-nums', applied ? 'text-xs text-gray-400 line-through' : 'text-gray-900 font-medium')}>{before}</p>
      {applied && <p className="font-semibold text-green-700 tabular-nums">{after}</p>}
    </div>
  );
}
