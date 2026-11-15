'use client';

import { useState } from 'react';
import { Brain, Clock, Download, Fuel, Gauge, IndianRupee, PackageCheck, Route as RouteIcon, Timer } from 'lucide-react';
import { BarChart, Donut, LineChart } from '../components/charts';
import { Button, Card, CardHeader, CHART, KpiStrip, PageHeader, ProgressBar, Segmented } from '../components/ui';
import type { Kpi } from '../components/ui';

const kpis: Kpi[] = [
  { icon: PackageCheck, label: 'Total deliveries (30d)', value: '1,847', caption: 'Completed shipments', delta: '+8.3%', deltaGood: true, deltaCaption: 'vs prior 30d' },
  { icon: Timer, label: 'Avg. delivery time', value: '4h 12m', caption: 'Pickup to proof of delivery', delta: '-11m', deltaGood: true, deltaCaption: 'vs prior 30d' },
  { icon: Clock, label: 'On-time rate', value: '96.5%', caption: 'Target: 98.0%', delta: '+1.2%', deltaGood: true, deltaCaption: 'vs prior 30d' },
  { icon: Gauge, label: 'Avg. risk score', value: '18.4', caption: 'ML delay-risk model', delta: '-3.2', deltaGood: true, deltaCaption: 'vs prior 30d' },
];

const volume = {
  '7 days': [
    { label: 'Mon', value: 42 }, { label: 'Tue', value: 38 }, { label: 'Wed', value: 55 },
    { label: 'Thu', value: 51 }, { label: 'Fri', value: 48 }, { label: 'Sat', value: 62 }, { label: 'Sun', value: 58 },
  ],
  '4 weeks': [
    { label: 'Wk 1', value: 318 }, { label: 'Wk 2', value: 342 }, { label: 'Wk 3', value: 365 }, { label: 'Wk 4', value: 354 },
  ],
};
type VolumeRange = keyof typeof volume;

const statusToday = [
  { label: 'Delivered', value: 89, color: CHART.green },
  { label: 'In transit', value: 38, color: CHART.blue },
  { label: 'Delayed', value: 5, color: CHART.amber },
  { label: 'Pending', value: 10, color: CHART.violet },
];

const onTime = {
  labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  values: [91.2, 92.8, 93.5, 94.9, 95.3, 96.5],
};

const impact = [
  { icon: RouteIcon, value: '847 km', label: 'Distance saved' },
  { icon: Clock, value: '23.4 hrs', label: 'Time saved' },
  { icon: IndianRupee, value: '₹62,400', label: 'Cost saved' },
  { icon: Fuel, value: '142 L', label: 'Fuel saved' },
];

const models = [
  { model: 'ETA prediction', accuracy: 91, version: 'v1.0', predictions: '4,231' },
  { model: 'Delay risk', accuracy: 87, version: 'v1.0', predictions: '1,847' },
  { model: 'Route optimisation', accuracy: 94, version: 'v1.0', predictions: '312' },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<VolumeRange>('7 days');

  return (
    <div className="space-y-4">
      <PageHeader
        title="Operational analytics"
        description="Performance metrics and delivery insights."
        actions={<Button variant="secondary"><Download className="w-4 h-4" /> Export report</Button>}
      />

      <Card>
        <KpiStrip items={kpis} />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Delivery volume"
            subtitle="Completed deliveries"
            action={<Segmented options={Object.keys(volume) as VolumeRange[]} value={range} onChange={setRange} />}
          />
          <BarChart data={volume[range]} color={CHART.green} height={260} />
        </Card>

        <Card>
          <CardHeader title="Status distribution" subtitle="Today’s shipments" />
          <Donut segments={statusToday} centerLabel="Shipments today" size={180} />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title="On-time delivery rate" subtitle="Monthly, last 6 months (%)" />
          <LineChart
            labels={onTime.labels}
            height={240}
            yMin={80}
            series={[{ name: 'On-time rate', color: CHART.green, values: onTime.values, area: true }]}
          />
        </Card>

        <Card>
          <CardHeader
            title={<span className="inline-flex items-center gap-2"><Brain className="w-4 h-4 text-green-700" />ML model accuracy</span>}
          />
          <div className="space-y-3">
            {models.map(m => (
              <div key={m.model} className="p-3.5 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-medium text-gray-900">{m.model}</span>
                  <span className="text-sm font-semibold text-gray-900 tabular-nums">{m.accuracy}%</span>
                </div>
                <ProgressBar value={m.accuracy} />
                <p className="mt-2 text-[11px] text-gray-500">{m.version} · {m.predictions} predictions</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Route optimisation impact" subtitle="Last 30 days, compared with unoptimised plans" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {impact.map(i => (
            <div key={i.label} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200">
              <span className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center ring-1 ring-green-600/10 shrink-0">
                <i.icon className="w-5 h-5" />
              </span>
              <div>
                <p className="text-lg font-semibold text-gray-900 tabular-nums">{i.value}</p>
                <p className="text-xs text-gray-500">{i.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
