'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  CloudRain,
  Lightbulb,
  Navigation,
  PackageX,
  Timer,
  TrafficCone,
  TriangleAlert,
  Wrench,
} from 'lucide-react';
import { Button, Card, KpiStrip, PageHeader, Segmented, StatusBadge, cn } from '../components/ui';
import type { Kpi } from '../components/ui';

type ExceptionSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
type ExceptionStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'IGNORED';

interface Exception {
  id: string;
  severity: ExceptionSeverity;
  type: string;
  category: string;
  title: string;
  description: string;
  shipmentId?: string;
  vehicleId?: string;
  detectedAt: string;
  status: ExceptionStatus;
  recommendedAction: string;
}

const EXCEPTIONS: Exception[] = [
  {
    id: 'EXC-001', severity: 'CRITICAL', type: 'DELAY', category: 'Delay',
    title: 'SHP-2003 — Severe delay risk (78%)',
    description: 'Heavy congestion on NH-8 between Manesar and Dharuhera. Predicted delay: 38–52 minutes.',
    shipmentId: 'SHP-2003', vehicleId: 'DL1LV9999',
    detectedAt: '12:18 PM', status: 'OPEN',
    recommendedAction: 'Reroute via Bhiwadi bypass — saves ~14 min',
  },
  {
    id: 'EXC-002', severity: 'HIGH', type: 'ROUTE_DEVIATION', category: 'Route',
    title: 'Vehicle DL1LV9999 — 1.8 km off planned route',
    description: 'Driver Amit Patel deviated from planned route near Manesar toll plaza.',
    vehicleId: 'DL1LV9999',
    detectedAt: '12:45 PM', status: 'ACKNOWLEDGED',
    recommendedAction: 'Recalculate route from current position',
  },
  {
    id: 'EXC-003', severity: 'MEDIUM', type: 'TRAFFIC', category: 'Traffic',
    title: 'Heavy congestion — Gurugram-Jaipur corridor',
    description: 'Affecting 5 active shipments and 2 vehicles. Average speed reduced to 18 km/h.',
    detectedAt: '11:30 AM', status: 'OPEN',
    recommendedAction: 'Review affected shipments and consider rerouting',
  },
  {
    id: 'EXC-004', severity: 'LOW', type: 'WEATHER', category: 'Weather',
    title: 'Light rain forecast — Delhi NCR',
    description: 'Light rain expected in Delhi NCR region between 3–6 PM. Minor impact on delivery times.',
    detectedAt: '10:00 AM', status: 'IGNORED',
    recommendedAction: 'No action required — monitor conditions',
  },
  {
    id: 'EXC-005', severity: 'HIGH', type: 'VEHICLE', category: 'Vehicle',
    title: 'HR38X5678 — Maintenance overdue',
    description: 'Vehicle HR38X5678 is 450 km past scheduled maintenance interval.',
    vehicleId: 'HR38X5678',
    detectedAt: '09:00 AM', status: 'OPEN',
    recommendedAction: 'Schedule maintenance within 48 hours',
  },
  {
    id: 'EXC-006', severity: 'MEDIUM', type: 'DELIVERY', category: 'Delivery',
    title: 'SHP-2008 — Delivery window at risk',
    description: 'Shipment SHP-2008 may miss its 4:00 PM delivery window based on current speed.',
    shipmentId: 'SHP-2008',
    detectedAt: '01:15 PM', status: 'OPEN',
    recommendedAction: 'Contact customer to extend window or expedite delivery',
  },
];


const typeIcons: Record<string, LucideIcon> = {
  DELAY: Timer,
  ROUTE_DEVIATION: Navigation,
  TRAFFIC: TrafficCone,
  WEATHER: CloudRain,
  VEHICLE: Wrench,
  DELIVERY: PackageX,
};

const severityAccent: Record<ExceptionSeverity, string> = {
  CRITICAL: 'bg-red-50 text-red-600 ring-red-600/15',
  HIGH: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  MEDIUM: 'bg-sky-50 text-sky-700 ring-sky-600/15',
  LOW: 'bg-gray-100 text-gray-600 ring-gray-500/15',
};

const categories = ['All', 'Critical', 'Delay', 'Route', 'Vehicle', 'Traffic', 'Weather', 'Delivery'] as const;
type Category = (typeof categories)[number];

export default function ExceptionsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [exceptions, setExceptions] = useState(EXCEPTIONS);

  const filtered = exceptions.filter(e => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Critical') return e.severity === 'CRITICAL';
    return e.category === activeCategory;
  });

  const openCount = exceptions.filter(e => e.status === 'OPEN').length;
  const ackCount = exceptions.filter(e => e.status === 'ACKNOWLEDGED').length;
  const resolvedCount = exceptions.filter(e => e.status === 'RESOLVED').length;
  const criticalCount = exceptions.filter(e => e.severity === 'CRITICAL' && e.status !== 'RESOLVED').length;

  const kpis: Kpi[] = [
    { icon: CircleAlert, label: 'Open exceptions', value: String(openCount), caption: 'Awaiting action' },
    { icon: TriangleAlert, label: 'Critical', value: String(criticalCount), caption: 'Unresolved critical issues', delta: criticalCount ? 'Act now' : 'Clear', deltaGood: criticalCount === 0, deltaCaption: 'priority' },
    { icon: Timer, label: 'Acknowledged', value: String(ackCount), caption: 'Being worked on' },
    { icon: CircleCheck, label: 'Resolved today', value: String(resolvedCount), caption: 'Closed this session' },
  ];

  const counts = Object.fromEntries(
    categories.map(c => [
      c,
      c === 'All' ? exceptions.length : c === 'Critical' ? criticalCount : exceptions.filter(e => e.category === c).length,
    ]),
  ) as Record<Category, number>;

  function updateStatus(id: string, status: ExceptionStatus) {
    setExceptions(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Exceptions center" description={`${openCount} open · ${criticalCount} critical`} />

      <Card>
        <KpiStrip items={kpis} />
      </Card>

      <Segmented options={categories} value={activeCategory} onChange={setActiveCategory} counts={counts} />

      <div className="space-y-3">
        {filtered.map(exc => {
          const Icon = typeIcons[exc.type] ?? CircleAlert;
          const done = exc.status === 'RESOLVED' || exc.status === 'IGNORED';
          return (
            <Card key={exc.id} className={cn('transition-all', exc.severity === 'CRITICAL' && !done && 'border-red-200', done && 'opacity-70')}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <span className={cn('w-10 h-10 rounded-xl flex items-center justify-center ring-1 ring-inset shrink-0', severityAccent[exc.severity])}>
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={exc.severity} />
                    <span className="text-xs text-gray-500">{exc.type.replace('_', ' ').toLowerCase()}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{exc.detectedAt}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{exc.id}</span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-gray-900">{exc.title}</h4>
                  <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">{exc.description}</p>

                  <div className="mt-3 flex items-start gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <Lightbulb className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Recommended action</p>
                      <p className="text-[13px] text-gray-800 mt-0.5">{exc.recommendedAction}</p>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                  <StatusBadge status={exc.status} />
                  {exc.status === 'OPEN' && (
                    <div className="flex gap-2 md:mt-1">
                      <Button variant="secondary" className="px-2.5 py-1.5 text-xs" onClick={() => updateStatus(exc.id, 'ACKNOWLEDGED')}>
                        Acknowledge
                      </Button>
                      <Button className="px-2.5 py-1.5 text-xs" onClick={() => updateStatus(exc.id, 'RESOLVED')}>
                        Resolve
                      </Button>
                    </div>
                  )}
                  {exc.status === 'ACKNOWLEDGED' && (
                    <Button className="px-2.5 py-1.5 text-xs md:mt-1" onClick={() => updateStatus(exc.id, 'RESOLVED')}>
                      Resolve
                    </Button>
                  )}
                  {exc.shipmentId && (
                    <Link
                      href={`/dashboard/shipments/${exc.shipmentId}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-green-700 hover:text-green-800 md:mt-1"
                    >
                      View shipment <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="text-center py-12 text-sm text-gray-500">No exceptions in this category.</Card>
        )}
      </div>
    </div>
  );
}
