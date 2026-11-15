'use client';

import Link from 'next/link';
import { CircleCheck, Plus, Star, Truck, Users, Wrench } from 'lucide-react';
import { Button, Card, CardHeader, KpiStrip, PageHeader, ProgressBar, StatusBadge, table } from '../components/ui';
import type { Kpi } from '../components/ui';

const drivers = [
  { empId: 'DRV-001', name: 'Ramesh Kumar', vehicle: 'HR38X1234', type: 'MINI_TRUCK', status: 'ON_DUTY', rating: 4.8, deliveries: 342, currentTask: 'SHP-2001' },
  { empId: 'DRV-002', name: 'Suresh Singh', vehicle: 'HR38X5678', type: 'VAN', status: 'ON_DUTY', rating: 4.5, deliveries: 289, currentTask: 'SHP-2002' },
  { empId: 'DRV-003', name: 'Amit Patel', vehicle: 'DL1LV9999', type: 'TRUCK', status: 'ON_DUTY', rating: 4.6, deliveries: 518, currentTask: 'SHP-2003' },
  { empId: 'DRV-004', name: 'Vikram Yadav', vehicle: 'UP16Z4321', type: 'MINI_TRUCK', status: 'ON_DUTY', rating: 4.9, deliveries: 401, currentTask: 'SHP-2004' },
  { empId: 'DRV-005', name: 'Rahul Gupta', vehicle: 'HR26YZ1111', type: 'BIKE', status: 'ON_DUTY', rating: 4.3, deliveries: 156, currentTask: 'SHP-2005' },
  { empId: 'DRV-006', name: 'Deepak Sharma', vehicle: 'DL3CAB2020', type: 'VAN', status: 'AVAILABLE', rating: 4.7, deliveries: 233, currentTask: null },
];

const vehicles = [
  { number: 'HR38X1234', type: 'MINI_TRUCK', make: 'Tata Ace', capacityKg: 1500, loadKg: 1120, status: 'IN_TRANSIT', odometer: '45,230 km', fuel: 'Diesel' },
  { number: 'HR38X5678', type: 'VAN', make: 'Maruti Eeco', capacityKg: 800, loadKg: 320, status: 'IN_TRANSIT', odometer: '32,100 km', fuel: 'Diesel' },
  { number: 'DL1LV9999', type: 'TRUCK', make: 'Ashok Leyland Dost', capacityKg: 5000, loadKg: 2400, status: 'IN_TRANSIT', odometer: '78,540 km', fuel: 'Diesel' },
  { number: 'UP16Z4321', type: 'MINI_TRUCK', make: 'Mahindra Bolero Pik-Up', capacityKg: 2000, loadKg: 1540, status: 'IN_TRANSIT', odometer: '56,800 km', fuel: 'Diesel' },
  { number: 'HR26YZ1111', type: 'BIKE', make: 'Hero Splendor', capacityKg: 50, loadKg: 18, status: 'IN_TRANSIT', odometer: '12,350 km', fuel: 'Petrol' },
  { number: 'DL3CAB2020', type: 'VAN', make: 'Tata Winger Cargo', capacityKg: 1200, loadKg: 640, status: 'AVAILABLE', odometer: '28,920 km', fuel: 'CNG' },
];

const kpis: Kpi[] = [
  { icon: Truck, label: 'Total vehicles', value: String(vehicles.length), caption: 'Registered to your fleet' },
  { icon: CircleCheck, label: 'In transit', value: String(vehicles.filter(v => v.status === 'IN_TRANSIT').length), caption: 'On active assignments', delta: '+1', deltaGood: true },
  { icon: Users, label: 'Drivers on duty', value: `${drivers.filter(d => d.status === 'ON_DUTY').length} / ${drivers.length}`, caption: 'Checked in today' },
  { icon: Wrench, label: 'Maintenance due', value: '1', caption: 'HR38X5678 — 450 km overdue', delta: 'Overdue', deltaGood: false, deltaCaption: 'schedule soon' },
];

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2);
}

export default function FleetPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Fleet & drivers"
        description="Manage vehicles, driver assignments and capacity."
        actions={<Button><Plus className="w-4 h-4" /> Add vehicle</Button>}
      />

      <Card>
        <KpiStrip items={kpis} />
      </Card>

      <Card padded={false} className="scroll-mt-4">
        <div id="vehicles" className="px-5 pt-5">
          <CardHeader title="All vehicles" subtitle="Live load against rated capacity" />
        </div>
        <div className={table.wrap}>
          <table className={table.table}>
            <thead>
              <tr className={table.headRow}>
                <th className={table.th}>Vehicle</th>
                <th className={table.th}>Make & model</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Current load</th>
                <th className={table.th}>Odometer</th>
                <th className={table.th}>Fuel</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => {
                const pct = Math.round((v.loadKg / v.capacityKg) * 100);
                return (
                  <tr key={v.number} className={table.row}>
                    <td className={table.td}>
                      <p className="font-semibold text-gray-900">{v.number}</p>
                      <p className="text-[11px] text-gray-400">{v.type.replace('_', ' ')}</p>
                    </td>
                    <td className={table.td}>{v.make}</td>
                    <td className={table.td}><StatusBadge status={v.status} /></td>
                    <td className={table.td}>
                      <div className="w-44">
                        <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                          <span>{v.loadKg.toLocaleString()} / {v.capacityKg.toLocaleString()} kg</span>
                          <span className="font-medium text-gray-700">{pct}%</span>
                        </div>
                        <ProgressBar value={pct} tone={pct > 90 ? 'amber' : 'green'} />
                      </div>
                    </td>
                    <td className={`${table.td} tabular-nums`}>{v.odometer}</td>
                    <td className={table.td}>{v.fuel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card padded={false}>
        <div id="drivers" className="px-5 pt-5 scroll-mt-4">
          <CardHeader title="Drivers directory" subtitle={`${drivers.length} drivers`} />
        </div>
        <div className={table.wrap}>
          <table className={table.table}>
            <thead>
              <tr className={table.headRow}>
                <th className={table.th}>Driver</th>
                <th className={table.th}>Vehicle</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Rating</th>
                <th className={table.th}>Deliveries</th>
                <th className={table.th}>Current task</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(d => (
                <tr key={d.empId} className={table.row}>
                  <td className={table.td}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-green-50 text-green-800 text-[11px] font-semibold flex items-center justify-center ring-1 ring-green-600/15">
                        {initials(d.name)}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{d.name}</p>
                        <p className="text-[11px] text-gray-400">{d.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className={table.td}>
                    {d.vehicle}
                    <span className="text-[11px] text-gray-400 ml-1.5">{d.type.replace('_', ' ')}</span>
                  </td>
                  <td className={table.td}><StatusBadge status={d.status} /></td>
                  <td className={table.td}>
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {d.rating}
                    </span>
                  </td>
                  <td className={`${table.td} tabular-nums`}>{d.deliveries}</td>
                  <td className={table.td}>
                    {d.currentTask ? (
                      <Link href={`/dashboard/shipments/${d.currentTask}`} className="font-medium text-green-700 hover:text-green-800">
                        {d.currentTask}
                      </Link>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
