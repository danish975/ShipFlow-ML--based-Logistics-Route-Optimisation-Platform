'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

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

const statusColors: Record<string, string> = {
  CREATED: 'text-slate-400 bg-slate-400/10 border-slate-500/20',
  ASSIGNED: 'text-blue-400 bg-blue-400/10 border-blue-500/20',
  IN_TRANSIT: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
  DELAYED: 'text-amber-400 bg-amber-400/10 border-amber-500/20',
  DELIVERED: 'text-green-400 bg-green-400/10 border-green-500/20',
};

export default function ShipmentDetailPage() {
  const params = useParams();
  const shipmentId = params.id as string;
  const s = getShipmentData(shipmentId);
  const progress = s.distanceKm > 0 ? Math.round((s.completedKm / s.distanceKm) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/dashboard/shipments" className="hover:text-slate-300 transition-colors">Shipments</Link>
        <span>›</span>
        <span className="text-slate-300">{s.number}</span>
      </div>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-100">{s.number}</h1>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusColors[s.status] || ''}`}>
                {s.status.replace('_', ' ')}
              </span>
              {s.priority === 'HIGH' || s.priority === 'URGENT' ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-400 bg-amber-400/10">
                  {s.priority}
                </span>
              ) : null}
            </div>
            <p className="text-slate-400 mt-2 text-sm">{s.from} → {s.to}</p>
            <p className="text-slate-500 mt-1 text-xs">{s.weight} · {s.packageDesc}</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-xs text-slate-500 mb-1">ETA</p>
              <p className="text-lg font-bold text-slate-100">{s.eta}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Delay Risk</p>
              <p className={`text-lg font-bold ${s.riskScore > 60 ? 'text-rose-400' : s.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {s.riskScore}%
              </p>
              <p className={`text-[10px] font-bold ${s.riskScore > 60 ? 'text-rose-400' : s.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {s.riskLevel}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Progress</p>
              <p className="text-lg font-bold text-slate-100">{progress}%</p>
            </div>
          </div>
        </div>

        {/* Route Progress Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>{s.completedKm} km completed</span>
            <span>{s.remainingKm} km remaining</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-slate-200 mb-5">Shipment Timeline</h3>
          <div className="space-y-0">
            {s.timeline.map((event: any, i: number) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shrink-0">
                    {event.icon}
                  </div>
                  {i < s.timeline.length - 1 && (
                    <div className="w-px h-8 bg-slate-800"></div>
                  )}
                </div>
                <div className="pb-6 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-mono text-slate-500">{event.time}</span>
                    <span className={`text-sm font-medium ${
                      event.type === 'DELIVERY_DELAY_DETECTED' ? 'text-amber-400' :
                      event.type === 'ROUTE_RECALCULATED' ? 'text-blue-400' :
                      'text-slate-200'
                    }`}>
                      {event.event}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-5">
          {/* Risk Factors */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm">🧠</span>
              <h3 className="text-sm font-semibold text-slate-200">AI Delivery Insights</h3>
            </div>

            <div className="space-y-1 mb-4">
              <p className="text-xs text-slate-500">Delay Probability</p>
              <p className={`text-2xl font-bold ${s.riskScore > 60 ? 'text-rose-400' : s.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {s.riskScore}%
              </p>
              <p className="text-xs text-slate-400">Predicted delay: {s.predictedDelay}</p>
            </div>

            <div className="space-y-3">
              {s.riskFactors.map((factor: any, i: number) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">{factor.label}</span>
                    <span className="text-slate-300 font-mono">{factor.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${factor.value > 70 ? 'bg-rose-500' : factor.value > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${factor.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-600 mt-3">
              Factors derived from ML model predictions. Not guaranteed causal explanations.
            </p>
          </div>

          {/* Recommendation */}
          {s.recommendation && (
            <div className="bg-slate-900 border border-blue-500/20 rounded-2xl p-5">
              <h4 className="text-xs font-semibold text-blue-400 mb-2">RECOMMENDED ACTION</h4>
              <p className="text-sm text-slate-200 font-medium">{s.recommendation.title}</p>
              <p className="text-xs text-slate-400 mt-1">{s.recommendation.description}</p>
              <p className="text-xs text-emerald-400 mt-2 font-medium">
                Expected improvement: {s.recommendation.improvement}
              </p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-600/30 transition-colors">
                  View Alternative
                </button>
                <button className="flex-1 px-3 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-600/30 transition-colors">
                  Apply Reroute
                </button>
              </div>
            </div>
          )}

          {/* Assignment */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-xs font-semibold text-slate-500 mb-3">ASSIGNMENT</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Driver</span>
                <span className="text-slate-200 font-medium">{s.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle</span>
                <span className="text-slate-200 font-medium">{s.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type</span>
                <span className="text-slate-200 font-medium">{s.vehicleType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
