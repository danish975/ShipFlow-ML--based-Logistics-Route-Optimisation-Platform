'use client';

import Link from 'next/link';
import LiveMap from './components/LiveMap';

const kpiCards = [
  { 
    label: 'ACTIVE SHIPMENTS', value: '142', trend: '+12.4%', trendLabel: 'vs yesterday',
    detail: '32', detailLabel: 'Due within 2 hours',
    color: 'from-blue-500 to-cyan-400', trendUp: true,
  },
  { 
    label: 'FLEET UTILIZATION', value: '87%', trend: '+4.2%', trendLabel: 'vs last 7 days',
    detail: '17 / 20', detailLabel: 'Vehicles active',
    color: 'from-indigo-500 to-purple-400', trendUp: true,
  },
  { 
    label: 'ON-TIME DELIVERY', value: '96.5%', trend: '+1.2%', trendLabel: 'vs last week',
    detail: '274 / 284', detailLabel: 'Delivered on time',
    color: 'from-emerald-500 to-teal-400', trendUp: true,
  },
  { 
    label: 'ACTIVE DELAYS', value: '3', trend: '-2', trendLabel: 'vs yesterday',
    detail: '1 critical', detailLabel: 'Requires attention',
    color: 'from-rose-500 to-orange-400', trendUp: false,
  },
];

const alerts = [
  { 
    severity: 'HIGH', type: 'DELAY RISK', 
    title: 'SHP-2003 — Delhi → Jaipur',
    description: '78% probability of 45 min delay due to NH-8 congestion',
    time: '10 mins ago', 
    color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-500/20',
    link: '/dashboard/shipments/SHP-2003',
    actions: ['Investigate', 'View Route'],
  },
  { 
    severity: 'MED', type: 'ROUTE DEVIATION', 
    title: 'Vehicle DL1LV9999 — 1.8 km off route',
    description: 'Driver Amit Patel deviated from planned route near Manesar',
    time: '25 mins ago', 
    color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-500/20',
    link: '/dashboard/fleet',
    actions: ['View Vehicle', 'Recalculate'],
  },
  { 
    severity: 'LOW', type: 'TRAFFIC ALERT', 
    title: 'Heavy congestion — Gurugram-Jaipur corridor',
    description: 'Affecting 5 shipments and 2 vehicles',
    time: '1 hr ago', 
    color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-500/20',
    link: '/dashboard/exceptions',
    actions: ['View Affected'],
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Operations Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time logistics command center</p>
        </div>
        <Link 
          href="/dashboard/shipments"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
        >
          + New Shipment
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpiCards.map((metric, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} rounded-full mix-blend-multiply filter blur-3xl opacity-15 group-hover:opacity-30 transition-opacity duration-500`}></div>
            <p className="text-slate-500 text-xs font-semibold tracking-wider">{metric.label}</p>
            <div className="mt-3 flex items-baseline gap-3">
              <h3 className="text-3xl font-bold text-slate-100">{metric.value}</h3>
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${metric.trendUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                {metric.trend}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{metric.trendLabel}</p>
            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-baseline gap-2">
              <span className="text-sm font-semibold text-slate-300">{metric.detail}</span>
              <span className="text-xs text-slate-500">{metric.detailLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Map + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: '480px' }}>
        {/* Live Map */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-200">Live Fleet Tracking</h3>
            <div className="flex gap-1.5">
              {['All', 'Active', 'Delayed', 'Idle'].map((f) => (
                <button key={f} className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${f === 'All' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden">
            <LiveMap />
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-200">ML Alerts & Exceptions</h3>
            <Link href="/dashboard/exceptions" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="flex-1 space-y-3 overflow-auto">
            {alerts.map((alert, i) => (
              <Link 
                key={i} 
                href={alert.link}
                className={`block p-3.5 rounded-xl border ${alert.border} bg-slate-950/50 hover:bg-slate-950 transition-colors group/alert`}
              >
                <div className="flex items-start gap-3">
                  <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${alert.color} ${alert.bg} shrink-0 mt-0.5`}>
                    {alert.severity}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium">{alert.type}</p>
                    <p className="text-sm text-slate-200 font-medium mt-0.5 truncate">{alert.title}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{alert.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] text-slate-600">{alert.time}</p>
                      <div className="flex gap-2 opacity-0 group-hover/alert:opacity-100 transition-opacity">
                        {alert.actions.map((action) => (
                          <span key={action} className="text-[10px] text-blue-400 font-medium">{action}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
