'use client';

import Link from 'next/link';
import { useState } from 'react';

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

const statusColors: Record<string, string> = {
  CREATED: 'text-slate-400 bg-slate-400/10',
  ASSIGNED: 'text-blue-400 bg-blue-400/10',
  PICKED_UP: 'text-cyan-400 bg-cyan-400/10',
  IN_TRANSIT: 'text-emerald-400 bg-emerald-400/10',
  DELAYED: 'text-amber-400 bg-amber-400/10',
  DELIVERED: 'text-green-400 bg-green-400/10',
  FAILED: 'text-rose-400 bg-rose-400/10',
  CANCELLED: 'text-slate-500 bg-slate-500/10',
};

const riskColors: Record<string, string> = {
  LOW: 'text-emerald-400',
  MEDIUM: 'text-amber-400',
  HIGH: 'text-rose-400',
  CRITICAL: 'text-red-500',
};

const filters = ['All', 'In Transit', 'Assigned', 'Created', 'Delivered', 'Delayed'];

export default function ShipmentsPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = SHIPMENTS.filter(s => {
    if (activeFilter === 'All') return true;
    return s.status === activeFilter.toUpperCase().replace(' ', '_');
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Shipments</h1>
          <p className="text-sm text-slate-500 mt-1">{SHIPMENTS.length} total shipments</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
          + Create Shipment
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === f
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:bg-slate-800 border border-transparent'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500">
              <th className="text-left px-5 py-3 font-medium">Shipment</th>
              <th className="text-left px-5 py-3 font-medium">Route</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Priority</th>
              <th className="text-left px-5 py-3 font-medium">Driver</th>
              <th className="text-left px-5 py-3 font-medium">ETA</th>
              <th className="text-left px-5 py-3 font-medium">Risk</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3.5">
                  <Link href={`/dashboard/shipments/${s.id}`} className="text-blue-400 hover:text-blue-300 font-semibold">
                    {s.id}
                  </Link>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-slate-200 text-xs">{s.from}</span>
                  <span className="text-slate-600 mx-1.5">→</span>
                  <span className="text-slate-200 text-xs">{s.to}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${statusColors[s.status] || ''}`}>
                    {s.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium ${s.priority === 'HIGH' || s.priority === 'URGENT' ? 'text-amber-400' : 'text-slate-400'}`}>
                    {s.priority}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-300 text-xs">{s.driver}</td>
                <td className="px-5 py-3.5 text-slate-300 text-xs font-mono">{s.eta}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${s.riskScore > 60 ? 'bg-rose-500' : s.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${s.riskScore}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-bold ${riskColors[s.riskLevel]}`}>
                      {s.riskScore}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
