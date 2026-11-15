'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { apiErrorMessages } from '../../components/shipments-context';
import type { ApiShipment } from '../../components/shipments-context';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Brain,
  ChevronRight,
  MapPin,
  Package,
  PackageCheck,
  RefreshCw,
  Send,
  TriangleAlert,
  Truck,
  User,
} from 'lucide-react';
import { Badge, Button, Card, CardHeader, ProgressBar, StatusBadge, riskTone } from '../../components/ui';

// Demo data for SHP-2003 (the high-risk one)
const SHIPMENT_DATA: Record<string, any> = {
  'SHP-2003': {
    id: 'SHP-2003', number: 'SHP-2003',
    from: 'Nehru Place, Delhi', to: 'Jaipur, Rajasthan',
    status: 'IN_TRANSIT', priority: 'HIGH',
    driver: 'Amit Patel', driverId: 'DRV-003',
    vehicle: 'DL1LV9999', vehicleType: 'TRUCK',
    eta: '4:45 PM', 
    weight: '2400 kg', packageDesc: 'Electronics — 6 pallets',
    distanceKm: 268, completedKm: 172, remainingKm: 96,
    riskScore: 78, riskLevel: 'HIGH',
    predictedDelay: '38–52 min',
    riskFactors: [
      { label: 'Traffic Congestion', value: 82 },
      { label: 'Route Load', value: 61 },
      { label: 'Schedule Deviation', value: 48 },
    ],
    timeline: [
      { time: '09:10', event: 'Shipment Created', type: 'SHIPMENT_CREATED', icon: '📦' },
      { time: '09:24', event: 'Vehicle DL1LV9999 assigned', type: 'SHIPMENT_ASSIGNED', icon: '🚛' },
      { time: '09:26', event: 'Driver Amit Patel assigned', type: 'DRIVER_ASSIGNED', icon: '👤' },
      { time: '10:02', event: 'Picked up from Nehru Place warehouse', type: 'SHIPMENT_DISPATCHED', icon: '📤' },
      { time: '10:45', event: 'Dispatched — en route to Jaipur', type: 'SHIPMENT_DISPATCHED', icon: '🚀' },
      { time: '12:18', event: 'Delay detected — NH-8 congestion near Manesar', type: 'DELIVERY_DELAY_DETECTED', icon: '⚠️' },
      { time: '12:22', event: 'Route recalculated — alternative via Bhiwadi', type: 'ROUTE_RECALCULATED', icon: '🔄' },
      { time: '13:04', event: 'Location updated — near Dharuhera', type: 'LOCATION_UPDATED', icon: '📍' },
    ],
    recommendation: {
      title: 'Alternative route available via Bhiwadi bypass',
      improvement: '14 minutes',
      description: 'Rerouting through Bhiwadi-Alwar corridor avoids NH-8 congestion between Manesar and Dharuhera.',
    },
  },
};

// Fallback for any shipment ID
function getShipmentData(id: string) {
  return SHIPMENT_DATA[id] || {
    id, number: id,
    from: 'Cyber Hub, Gurugram', to: 'Connaught Place, Delhi',
    status: 'IN_TRANSIT', priority: 'MEDIUM',
    driver: 'Ramesh Kumar', driverId: 'DRV-001',
    vehicle: 'HR38X1234', vehicleType: 'MINI_TRUCK',
    eta: '2:32 PM',
    weight: '450 kg', packageDesc: 'Consumer goods — 2 cartons',
    distanceKm: 18.4, completedKm: 11.7, remainingKm: 6.7,
    riskScore: 12, riskLevel: 'LOW',
    predictedDelay: '0–5 min',
    riskFactors: [
      { label: 'Traffic Congestion', value: 18 },
      { label: 'Route Load', value: 22 },
      { label: 'Schedule Deviation', value: 8 },
    ],
    timeline: [
      { time: '10:00', event: 'Shipment Created', type: 'SHIPMENT_CREATED', icon: '📦' },
      { time: '10:15', event: 'Vehicle assigned', type: 'SHIPMENT_ASSIGNED', icon: '🚛' },
      { time: '10:45', event: 'Picked up', type: 'SHIPMENT_DISPATCHED', icon: '📤' },
    ],
    recommendation: null,
  };
}

const eventIcons: Record<string, { icon: LucideIcon; tone: string }> = {
  SHIPMENT_CREATED: { icon: Package, tone: 'bg-gray-100 text-gray-600' },
  SHIPMENT_ASSIGNED: { icon: Truck, tone: 'bg-sky-50 text-sky-700' },
  DRIVER_ASSIGNED: { icon: User, tone: 'bg-sky-50 text-sky-700' },
  SHIPMENT_DISPATCHED: { icon: Send, tone: 'bg-green-50 text-green-700' },
  DELIVERY_DELAY_DETECTED: { icon: TriangleAlert, tone: 'bg-amber-50 text-amber-700' },
  ROUTE_RECALCULATED: { icon: RefreshCw, tone: 'bg-violet-50 text-violet-700' },
  LOCATION_UPDATED: { icon: MapPin, tone: 'bg-green-50 text-green-700' },
  SHIPMENT_DELIVERED: { icon: PackageCheck, tone: 'bg-green-50 text-green-700' },
};

const riskText = { green: 'text-green-700', amber: 'text-amber-600', red: 'text-red-600' } as const;

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

/** Maps a live API shipment onto the shape the detail view renders. */
function fromApi(a: ApiShipment) {
  const driverName = a.driver?.user ? `${a.driver.user.firstName ?? ''} ${a.driver.user.lastName ?? ''}`.trim() : '';
  const eta = a.estimatedArrival ?? a.deliveryWindowEnd;
  const events = [...(a.events ?? [])].sort((x, y) => x.createdAt.localeCompare(y.createdAt));
  return {
    id: a.id,
    number: a.shipmentNumber,
    from: `${a.pickupAddress}, ${a.pickupCity}, ${a.pickupState} ${a.pickupPincode}`,
    to: `${a.deliveryAddress}, ${a.deliveryCity}, ${a.deliveryState} ${a.deliveryPincode}`,
    status: a.status,
    priority: a.priority,
    driver: driverName || 'Unassigned',
    driverId: a.driver?.employeeId ?? '—',
    vehicle: a.vehicle?.vehicleNumber ?? 'Unassigned',
    vehicleType: a.vehicle?.type ?? '—',
    eta: eta ? fmtTime(eta) : 'Pending',
    weight: `${a.packageWeight} kg`,
    packageDesc: a.packageDescription || 'No description',
    distanceKm: a.distanceKm ?? 0,
    completedKm: 0,
    remainingKm: a.distanceKm ?? 0,
    riskScore: a.riskScore ?? 0,
    riskLevel: a.riskLevel ?? 'LOW',
    assessed: a.riskScore !== null && a.riskScore !== undefined,
    predictedDelay: 'Awaiting prediction',
    riskFactors: [] as Array<{ label: string; value: number }>,
    timeline: events.map(e => ({
      time: fmtTime(e.createdAt),
      event: e.description || e.eventType.replace(/_/g, ' ').toLowerCase(),
      type: e.eventType,
    })),
    recommendation: null,
  };
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const shipmentId = params.id as string;
  // Demo shipments use their SHP-xxxx number in the URL; live ones use the database id.
  const isDemo = shipmentId.startsWith('SHP-');
  const [live, setLive] = useState<ApiShipment | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemo) return;
    let cancelled = false;
    api
      .get<ApiShipment>(`/api/v1/shipments/${encodeURIComponent(shipmentId)}`)
      .then(res => { if (!cancelled) setLive(res.data); })
      .catch(err => { if (!cancelled) setLoadError(apiErrorMessages(err)[0]); });
    return () => { cancelled = true; };
  }, [isDemo, shipmentId]);

  if (!isDemo && !live) {
    return (
      <Card className="py-16 text-center">
        {loadError ? (
          <>
            <p className="text-sm font-medium text-gray-900">Shipment not available</p>
            <p className="text-xs text-gray-500 mt-1">{loadError}</p>
            <Link href="/dashboard/shipments" className="inline-block mt-4 text-[13px] font-medium text-green-700 hover:text-green-800">
              ← Back to shipments
            </Link>
          </>
        ) : (
          <div className="w-7 h-7 mx-auto border-[3px] border-green-700 border-t-transparent rounded-full animate-spin" />
        )}
      </Card>
    );
  }

  const s = isDemo ? { ...getShipmentData(shipmentId), assessed: true } : fromApi(live as ApiShipment);
  const progress = s.distanceKm > 0 ? Math.round((s.completedKm / s.distanceKm) * 100) : 0;
  const tone = riskTone(s.riskScore);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-500">
        <Link href="/dashboard/shipments" className="hover:text-gray-900">Shipments</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium">{s.number}</span>
      </nav>

      {/* Header */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight">{s.number}</h2>
              <StatusBadge status={s.status} />
              {(s.priority === 'HIGH' || s.priority === 'URGENT') && <StatusBadge status={s.priority} />}
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
              <span>{s.from}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span>{s.to}</span>
            </div>
            <p className="text-gray-500 mt-1 text-xs">{s.weight} · {s.packageDesc}</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-100 border border-gray-200 rounded-xl">
            <HeaderStat label="ETA" value={s.eta} />
            {s.assessed ? (
              <HeaderStat label="Delay risk" value={`${s.riskScore}%`} sub={s.riskLevel} className={riskText[tone]} />
            ) : (
              <HeaderStat label="Delay risk" value="—" sub="NOT ASSESSED" className="text-gray-400" />
            )}
            <HeaderStat label="Progress" value={`${progress}%`} />
          </div>
        </div>

        <div className="mt-6">
          {s.distanceKm > 0 ? (
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{s.completedKm} km completed</span>
              <span>{s.remainingKm} km remaining</span>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mb-2">Distance will be calculated once a route is planned.</p>
          )}
          <ProgressBar value={progress} />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader title="Shipment timeline" subtitle={`${s.timeline.length} ${s.timeline.length === 1 ? 'event' : 'events'}`} />
          <ol>
            {s.timeline.map((event: any, i: number) => {
              const meta = eventIcons[event.type] ?? eventIcons.SHIPMENT_CREATED;
              return (
                <li key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${meta.tone}`}>
                      <meta.icon className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    {i < s.timeline.length - 1 && <div className="w-px flex-1 min-h-6 bg-gray-200 my-1" />}
                  </div>
                  <div className="pb-5 pt-1.5 min-w-0">
                    <p className={`text-sm font-medium ${event.type === 'DELIVERY_DELAY_DETECTED' ? 'text-amber-700' : 'text-gray-900'}`}>
                      {event.event}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 tabular-nums">{event.time}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        <div className="space-y-4">
          {/* AI insights */}
          <Card>
            <CardHeader
              title={<span className="inline-flex items-center gap-2"><Brain className="w-4 h-4 text-green-700" />AI delivery insights</span>}
            />
            <p className="text-xs text-gray-500">Delay probability</p>
            {s.assessed ? (
              <p className={`text-[28px] font-semibold tracking-tight ${riskText[tone]}`}>{s.riskScore}%</p>
            ) : (
              <p className="text-[28px] font-semibold tracking-tight text-gray-300">—</p>
            )}
            <p className="text-xs text-gray-500">Predicted delay: <span className="text-gray-900 font-medium">{s.predictedDelay}</span></p>
            {s.riskFactors.length === 0 && (
              <p className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600">
                The delay-risk model scores a shipment once a driver and route are assigned.
              </p>
            )}

            <div className="mt-5 space-y-3">
              {s.riskFactors.map((factor: any) => (
                <div key={factor.label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-600">{factor.label}</span>
                    <span className="text-gray-900 font-medium tabular-nums">{factor.value}%</span>
                  </div>
                  <ProgressBar value={factor.value} tone={factor.value > 70 ? 'red' : factor.value > 40 ? 'amber' : 'green'} />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-4">
              Factors come from ML model predictions and are not guaranteed causal explanations.
            </p>
          </Card>

          {s.recommendation && (
            <Card className="border-green-200 bg-gradient-to-b from-green-50/70 to-white">
              <Badge tone="green">Recommended action</Badge>
              <p className="mt-3 text-sm font-medium text-gray-900">{s.recommendation.title}</p>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{s.recommendation.description}</p>
              <p className="text-xs text-green-700 mt-2 font-medium">Expected improvement: {s.recommendation.improvement}</p>
              <div className="flex gap-2 mt-4">
                <Link href="/dashboard/routes" className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-xl text-[13px] font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">
                  View alternative
                </Link>
                <Button className="flex-1">Apply reroute</Button>
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title="Assignment" />
            <dl className="space-y-2.5 text-[13px]">
              <Row label="Driver" value={s.driverId && s.driverId !== '—' ? `${s.driver} · ${s.driverId}` : s.driver} />
              <Row label="Vehicle" value={s.vehicle} />
              <Row label="Type" value={s.vehicleType.replace('_', ' ')} />
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HeaderStat({ label, value, sub, className }: { label: string; value: string; sub?: string; className?: string }) {
  return (
    <div className="px-5 py-3 text-center">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className={`text-lg font-semibold tabular-nums ${className ?? 'text-gray-900'}`}>{value}</p>
      {sub && <p className={`text-[10px] font-semibold ${className ?? ''}`}>{sub}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900 font-medium text-right">{value}</dd>
    </div>
  );
}

