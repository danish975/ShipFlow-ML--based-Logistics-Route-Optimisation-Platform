'use client';

import { useState } from 'react';
import Link from 'next/link';

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

const severityColors: Record<ExceptionSeverity, string> = {
  CRITICAL: 'text-red-400 bg-red-400/10 border-red-500/30',
  HIGH: 'text-amber-400 bg-amber-400/10 border-amber-500/30',
  MEDIUM: 'text-blue-400 bg-blue-400/10 border-blue-500/30',
  LOW: 'text-slate-400 bg-slate-400/10 border-slate-500/30',
};

const statusColors: Record<ExceptionStatus, string> = {
  OPEN: 'text-rose-400 bg-rose-400/10',
  ACKNOWLEDGED: 'text-amber-400 bg-amber-400/10',
  RESOLVED: 'text-emerald-400 bg-emerald-400/10',
  IGNORED: 'text-slate-500 bg-slate-500/10',
};

const categories = ['All', 'Critical', 'Delay', 'Route', 'Vehicle', 'Traffic', 'Weather', 'Delivery'];

export default function ExceptionsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [exceptions, setExceptions] = useState(EXCEPTIONS);

  const filtered = exceptions.filter(e => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Critical') return e.severity === 'CRITICAL';
    return e.category === activeCategory;
  });

  const openCount = exceptions.filter(e => e.status === 'OPEN').length;
  const criticalCount = exceptions.filter(e => e.severity === 'CRITICAL' && e.status !== 'RESOLVED').length;

  function updateStatus(id: string, status: ExceptionStatus) {
    setExceptions(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Exceptions Center</h1>
          <p className="text-sm text-slate-500 mt-1">
            {openCount} open · {criticalCount} critical
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:bg-slate-800 border border-transparent'
            }`}
          >
            {cat}
            {cat === 'Critical' && criticalCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-400 font-bold">
                {criticalCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Exceptions List */}
      <div className="space-y-3">
        {filtered.map((exc) => (
          <div key={exc.id} className={`bg-slate-900 border rounded-2xl p-5 transition-all ${
            exc.severity === 'CRITICAL' ? 'border-red-500/20' : 'border-slate-800'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${severityColors[exc.severity]}`}>
                    {exc.severity}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{exc.type.replace('_', ' ')}</span>
                  <span className="text-[10px] text-slate-600">·</span>
                  <span className="text-[10px] text-slate-600">{exc.detectedAt}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200">{exc.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{exc.description}</p>
                
                <div className="mt-3 p-2.5 bg-slate-950/50 border border-slate-800/50 rounded-lg">
                  <p className="text-[10px] text-slate-500 font-semibold mb-0.5">RECOMMENDED ACTION</p>
                  <p className="text-xs text-slate-300">{exc.recommendedAction}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColors[exc.status]}`}>
                  {exc.status}
                </span>
                {exc.status === 'OPEN' && (
                  <div className="flex gap-1.5 mt-1">
                    <button 
                      onClick={() => updateStatus(exc.id, 'ACKNOWLEDGED')}
                      className="px-2.5 py-1 bg-amber-600/20 text-amber-400 rounded text-[10px] font-medium hover:bg-amber-600/30 transition-colors"
                    >
                      Acknowledge
                    </button>
                    <button 
                      onClick={() => updateStatus(exc.id, 'RESOLVED')}
                      className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 rounded text-[10px] font-medium hover:bg-emerald-600/30 transition-colors"
                    >
                      Resolve
                    </button>
                  </div>
                )}
                {exc.shipmentId && (
                  <Link href={`/dashboard/shipments/${exc.shipmentId}`} className="text-[10px] text-blue-400 hover:text-blue-300 mt-1">
                    View Shipment →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
