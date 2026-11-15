'use client';

import { useState } from 'react';

const routeData = {
  shipments: 12,
  vehicles: 4,
  stops: 28,
  current: {
    distanceKm: 184,
    travelTimeMin: 342, // 5h 42m
    vehicles: 4,
    estimatedCost: 12400,
  },
  optimized: {
    distanceKm: 151,
    travelTimeMin: 291, // 4h 51m
    vehicles: 4,
    estimatedCost: 10200,
  },
};

const vehicleRoutes = [
  { 
    vehicle: 'HR38X1234', driver: 'Ramesh Kumar', type: 'MINI_TRUCK',
    stops: 8, distanceKm: 52, durationMin: 96,
    optDistanceKm: 41, optDurationMin: 78,
    color: '#3b82f6', // blue
  },
  { 
    vehicle: 'HR38X5678', driver: 'Suresh Singh', type: 'VAN',
    stops: 6, distanceKm: 38, durationMin: 72,
    optDistanceKm: 34, optDurationMin: 64,
    color: '#8b5cf6', // violet
  },
  { 
    vehicle: 'DL1LV9999', driver: 'Amit Patel', type: 'TRUCK',
    stops: 8, distanceKm: 58, durationMin: 108,
    optDistanceKm: 46, optDurationMin: 89,
    color: '#06b6d4', // cyan
  },
  { 
    vehicle: 'UP16Z4321', driver: 'Vikram Yadav', type: 'MINI_TRUCK',
    stops: 6, distanceKm: 36, durationMin: 66,
    optDistanceKm: 30, optDurationMin: 60,
    color: '#f59e0b', // amber
  },
];

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export default function RouteIntelligencePage() {
  const [showOptimized, setShowOptimized] = useState(false);
  const [applied, setApplied] = useState(false);
  
  const saved = {
    distanceKm: routeData.current.distanceKm - routeData.optimized.distanceKm,
    timeMin: routeData.current.travelTimeMin - routeData.optimized.travelTimeMin,
    cost: routeData.current.estimatedCost - routeData.optimized.estimatedCost,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Route Intelligence</h1>
          <p className="text-sm text-slate-500 mt-1">AI-powered route optimization and planning</p>
        </div>
        <button 
          onClick={() => { setApplied(true); setShowOptimized(true); }}
          disabled={applied}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            applied 
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
          }`}
        >
          {applied ? '✓ Routes Applied' : 'Apply Optimized Routes'}
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-slate-100">{routeData.shipments}</p>
          <p className="text-xs text-slate-500 mt-1">Shipments</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-slate-100">{routeData.vehicles}</p>
          <p className="text-xs text-slate-500 mt-1">Vehicles</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-slate-100">{routeData.stops}</p>
          <p className="text-xs text-slate-500 mt-1">Total Stops</p>
        </div>
      </div>

      {/* Current vs Optimized Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current */}
        <div className={`bg-slate-900 border rounded-2xl p-6 transition-all ${showOptimized ? 'border-slate-800 opacity-60' : 'border-slate-700'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Current Plan</h3>
            {!showOptimized && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold text-blue-400 bg-blue-400/10">ACTIVE</span>
            )}
          </div>
          <div className="space-y-3">
            <ComparisonRow label="Distance" value={`${routeData.current.distanceKm} km`} />
            <ComparisonRow label="Travel Time" value={formatTime(routeData.current.travelTimeMin)} />
            <ComparisonRow label="Vehicles" value={`${routeData.current.vehicles}`} />
            <ComparisonRow label="Estimated Cost" value={`₹${routeData.current.estimatedCost.toLocaleString()}`} />
          </div>
        </div>

        {/* Optimized */}
        <div className={`bg-slate-900 border rounded-2xl p-6 transition-all ${showOptimized ? 'border-emerald-500/30' : 'border-blue-500/20'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Optimized Plan</h3>
            {showOptimized && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 bg-emerald-400/10">ACTIVE</span>
            )}
          </div>
          <div className="space-y-3">
            <ComparisonRow label="Distance" value={`${routeData.optimized.distanceKm} km`} highlight />
            <ComparisonRow label="Travel Time" value={formatTime(routeData.optimized.travelTimeMin)} highlight />
            <ComparisonRow label="Vehicles" value={`${routeData.optimized.vehicles}`} />
            <ComparisonRow label="Estimated Cost" value={`₹${routeData.optimized.estimatedCost.toLocaleString()}`} highlight />
          </div>
        </div>
      </div>

      {/* Savings */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-emerald-400">{saved.distanceKm} km</p>
          <p className="text-xs text-slate-500 mt-1">Distance Saved</p>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-emerald-400">{saved.timeMin} min</p>
          <p className="text-xs text-slate-500 mt-1">Time Saved</p>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-emerald-400">₹{saved.cost.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Cost Saved</p>
        </div>
      </div>

      {/* Per-Vehicle Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-slate-200 mb-4">Vehicle Route Breakdown</h3>
        <div className="space-y-4">
          {vehicleRoutes.map((route) => (
            <div key={route.vehicle} className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-800/50 rounded-xl">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: route.color }}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-200">{route.vehicle}</span>
                  <span className="text-xs text-slate-500">{route.driver}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{route.type} · {route.stops} stops</p>
              </div>
              <div className="text-right text-xs">
                <p className="text-slate-400">
                  <span className={showOptimized ? 'line-through text-slate-600' : ''}>{route.distanceKm} km</span>
                  {showOptimized && <span className="text-emerald-400 ml-2">{route.optDistanceKm} km</span>}
                </p>
                <p className="text-slate-500 mt-0.5">
                  <span className={showOptimized ? 'line-through text-slate-600' : ''}>{formatTime(route.durationMin)}</span>
                  {showOptimized && <span className="text-emerald-400 ml-2">{formatTime(route.optDurationMin)}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-emerald-400' : 'text-slate-200'}`}>{value}</span>
    </div>
  );
}
