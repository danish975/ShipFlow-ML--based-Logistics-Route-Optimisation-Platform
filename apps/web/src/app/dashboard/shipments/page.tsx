'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CircleCheck, Download, Package, Plus, Search, TriangleAlert, Truck } from 'lucide-react';
import { useShipments } from '../components/shipments-context';
import type { ApiShipment } from '../components/shipments-context';
import {
  Badge,
  Button,
  Card,
  KpiStrip,
  PageHeader,
  ProgressBar,
  StatusBadge,
  riskTone,
  table,
} from '../components/ui';
import type { Kpi } from '../components/ui';

// Demo shipment data matching seed
const SHIPMENTS = [
  { id: 'SHP-2001', from: 'Cyber Hub, Gurugram', to: 'Connaught Place, Delhi', status: 'IN_TRANSIT', priority: 'MEDIUM', driver: 'Ramesh Kumar', vehicle: 'HR38X1234', eta: '14:32', riskLevel: 'LOW', riskScore: 12 },
  { id: 'SHP-2002', from: 'Connaught Place, Delhi', to: 'Sector 62, Noida', status: 'ASSIGNED', priority: 'MEDIUM', driver: 'Suresh Singh', vehicle: 'HR38X5678', eta: '15:45', riskLevel: 'LOW', riskScore: 8 },
  { id: 'SHP-2003', from: 'Nehru Place, Delhi', to: 'Jaipur', status: 'IN_TRANSIT', priority: 'HIGH', driver: 'Amit Patel', vehicle: 'DL1LV9999', eta: '16:45', riskLevel: 'HIGH', riskScore: 78 },
  { id: 'SHP-2004', from: 'Vasant Kunj, Delhi', to: 'Indirapuram, Ghaziabad', status: 'IN_TRANSIT', priority: 'MEDIUM', driver: 'Vikram Yadav', vehicle: 'UP16Z4321', eta: '15:10', riskLevel: 'MEDIUM', riskScore: 42 },
  { id: 'SHP-2005', from: 'Sector 62, Noida', to: 'Cyber Hub, Gurugram', status: 'IN_TRANSIT', priority: 'MEDIUM', driver: 'Rahul Gupta', vehicle: 'HR26YZ1111', eta: '14:55', riskLevel: 'LOW', riskScore: 15 },
  { id: 'SHP-2006', from: 'Indirapuram, Ghaziabad', to: 'Vasant Kunj, Delhi', status: 'CREATED', priority: 'LOW', driver: '—', vehicle: '—', eta: '—', riskLevel: 'LOW', riskScore: 5 },
  { id: 'SHP-2007', from: 'Cyber Hub, Gurugram', to: 'Nehru Place, Delhi', status: 'DELIVERED', priority: 'MEDIUM', driver: 'Ramesh Kumar', vehicle: 'HR38X1234', eta: '—', riskLevel: 'LOW', riskScore: 0 },
  { id: 'SHP-2008', from: 'Connaught Place, Delhi', to: 'Indirapuram, Ghaziabad', status: 'PICKED_UP', priority: 'URGENT', driver: 'Suresh Singh', vehicle: 'HR38X5678', eta: '16:20', riskLevel: 'MEDIUM', riskScore: 38 },
];

const filters = ['All', 'In Transit', 'Picked Up', 'Assigned', 'Created', 'Delivered'] as const;
type Filter = (typeof filters)[number];

const toStatus = (f: Filter) => f.toUpperCase().replace(' ', '_');

interface Row {
  key: string;
  id: string;
  href: string;
  from: string;
  to: string;
  status: string;
  priority: string;
  driver: string;
  vehicle: string;
  eta: string;
  riskScore: number | null;
  live: boolean;
}

const DEMO_ROWS: Row[] = SHIPMENTS.map(s => ({
  key: s.id,
  id: s.id,
  href: `/dashboard/shipments/${s.id}`,
  from: s.from,
  to: s.to,
  status: s.status,
  priority: s.priority,
  driver: s.driver,
  vehicle: s.vehicle,
  eta: s.eta,
  riskScore: s.riskScore,
  live: false,
}));

function toRow(s: ApiShipment): Row {
  const driverName = s.driver?.user ? `${s.driver.user.firstName ?? ''} ${s.driver.user.lastName ?? ''}`.trim() : '';
  const eta = s.estimatedArrival ?? s.deliveryWindowEnd;
  return {
    key: s.id,
    id: s.shipmentNumber,
    href: `/dashboard/shipments/${s.id}`,
    from: `${s.pickupAddress}, ${s.pickupCity}`,
    to: `${s.deliveryAddress}, ${s.deliveryCity}`,
    status: s.status,
    priority: s.priority,
    driver: driverName || 'Unassigned',
    vehicle: s.vehicle?.vehicleNumber ?? '—',
    eta: eta ? new Date(eta).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '—',
    riskScore: s.riskScore ?? null,
    live: true,
  };
}

export default function ShipmentsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const { shipments: apiShipments, loadError, recentlyCreatedId, openCreateShipment } = useShipments();

  const rows = useMemo(() => [...apiShipments.map(toRow), ...DEMO_ROWS], [apiShipments]);

  const kpis: Kpi[] = [
    { icon: Package, label: 'Total shipments', value: String(rows.length), caption: `${apiShipments.length} live · ${DEMO_ROWS.length} demo` },
    { icon: Truck, label: 'In transit', value: String(rows.filter(s => s.status === 'IN_TRANSIT').length), caption: 'Moving right now' },
    { icon: CircleCheck, label: 'Delivered today', value: String(rows.filter(s => s.status === 'DELIVERED').length), caption: 'Proof of delivery captured' },
    { icon: TriangleAlert, label: 'High delay risk', value: String(rows.filter(s => (s.riskScore ?? 0) > 60).length), caption: 'Risk score above 60%', delta: 'Needs review', deltaGood: false, deltaCaption: 'ML prediction' },
  ];

  const counts = useMemo(() => {
    const c = {} as Record<Filter, number>;
    filters.forEach(f => {
      c[f] = f === 'All' ? rows.length : rows.filter(s => s.status === toStatus(f)).length;
    });
    return c;
  }, [rows]);

  const q = query.trim().toLowerCase();
  const filtered = rows.filter(s => {
    if (activeFilter !== 'All' && s.status !== toStatus(activeFilter)) return false;
    if (!q) return true;
    return [s.id, s.from, s.to, s.driver, s.vehicle].some(v => v.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Shipments"
        description="Track every consignment from pickup to proof of delivery."
        actions={
          <>
            <Button variant="secondary"><Download className="w-4 h-4" /> Export</Button>
            <Button onClick={openCreateShipment}><Plus className="w-4 h-4" /> Create shipment</Button>
          </>
        }
      />

      {loadError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-[13px] text-amber-800">
          <TriangleAlert className="w-4 h-4 shrink-0" />
          Couldn’t load live shipments ({loadError}). Showing demo data only.
        </div>
      )}

      <Card>
        <KpiStrip items={kpis} />
      </Card>

      <Card padded={false}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <div className="inline-flex flex-wrap gap-1 p-1 bg-gray-100 rounded-xl">
            {filters.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === f ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {f}
                <span className={`ml-1.5 text-[10px] ${activeFilter === f ? 'text-green-700' : 'text-gray-400'}`}>{counts[f]}</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 h-9 px-3 w-full lg:w-72 bg-white border border-gray-200 rounded-xl focus-within:border-green-600">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search ID, city, driver, vehicle"
              className="flex-1 min-w-0 bg-transparent outline-none text-[13px] placeholder:text-gray-400"
            />
          </label>
        </div>

        <div className={table.wrap}>
          <table className={table.table}>
            <thead>
              <tr className={table.headRow}>
                <th className={table.th}>Shipment</th>
                <th className={table.th}>Route</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Priority</th>
                <th className={table.th}>Driver</th>
                <th className={table.th}>ETA</th>
                <th className={table.th}>Delay risk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.key} className={`${table.row} ${s.key === recentlyCreatedId ? 'bg-green-50/60' : ''}`}>
                  <td className={table.td}>
                    <Link href={s.href} className="font-semibold text-gray-900 hover:text-green-700">
                      {s.id}
                    </Link>
                    <p className="mt-0.5">
                      {s.key === recentlyCreatedId ? (
                        <Badge tone="green">New</Badge>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">{s.live ? 'Live' : 'Demo'}</span>
                      )}
                    </p>
                  </td>
                  <td className={table.td}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full border-2 border-gray-400 shrink-0" />
                      <span className="text-gray-700">{s.from}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-700 shrink-0" />
                      <span className="text-gray-500">{s.to}</span>
                    </div>
                  </td>
                  <td className={table.td}><StatusBadge status={s.status} /></td>
                  <td className={table.td}>
                    {s.priority === 'HIGH' || s.priority === 'URGENT' ? (
                      <StatusBadge status={s.priority} />
                    ) : (
                      <span className="text-gray-500 text-xs">{s.priority.charAt(0) + s.priority.slice(1).toLowerCase()}</span>
                    )}
                  </td>
                  <td className={table.td}>
                    <p className="text-gray-900">{s.driver}</p>
                    <p className="text-[11px] text-gray-400">{s.vehicle}</p>
                  </td>
                  <td className={`${table.td} tabular-nums`}>{s.eta}</td>
                  <td className={table.td}>
                    {s.riskScore === null ? (
                      <span className="text-xs text-gray-400">Not assessed</span>
                    ) : (
                      <div className="flex items-center gap-2.5 w-32">
                        <ProgressBar value={s.riskScore} tone={riskTone(s.riskScore)} />
                        <span className="text-xs font-semibold text-gray-700 tabular-nums w-8 text-right">{s.riskScore}%</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500">
                    No shipments match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing {filtered.length} of {rows.length} shipments
        </div>
      </Card>
    </div>
  );
}
