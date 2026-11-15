'use client';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Operational Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Performance metrics and delivery insights</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticsCard label="Total Deliveries (30d)" value="1,847" trend="+8.3%" up />
        <AnalyticsCard label="Avg Delivery Time" value="4h 12m" trend="-11 min" up />
        <AnalyticsCard label="On-Time Rate" value="96.5%" trend="+1.2%" up />
        <AnalyticsCard label="Avg Risk Score" value="18.4" trend="-3.2" up />
      </div>

      {/* Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Volume */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Delivery Volume — Last 7 Days</h3>
          <div className="flex items-end gap-2 h-40">
            {[42, 38, 55, 51, 48, 62, 58].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md transition-all hover:opacity-80"
                  style={{ height: `${(val / 62) * 100}%` }}
                />
                <span className="text-[10px] text-slate-500">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Status Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Status Distribution — Today</h3>
          <div className="space-y-3">
            {[
              { label: 'Delivered', value: 89, total: 142, color: 'bg-emerald-500' },
              { label: 'In Transit', value: 38, total: 142, color: 'bg-blue-500' },
              { label: 'Assigned', value: 9, total: 142, color: 'bg-indigo-500' },
              { label: 'Delayed', value: 3, total: 142, color: 'bg-amber-500' },
              { label: 'Failed', value: 2, total: 142, color: 'bg-rose-500' },
              { label: 'Created', value: 1, total: 142, color: 'bg-slate-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-slate-300 font-mono">{item.value}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.value / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Optimization Impact */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Route Optimization Impact (30d)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-emerald-400">847 km</p>
              <p className="text-xs text-slate-500 mt-1">Distance Saved</p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-emerald-400">23.4 hrs</p>
              <p className="text-xs text-slate-500 mt-1">Time Saved</p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-emerald-400">₹62,400</p>
              <p className="text-xs text-slate-500 mt-1">Cost Saved</p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-emerald-400">142L</p>
              <p className="text-xs text-slate-500 mt-1">Fuel Saved</p>
            </div>
          </div>
        </div>

        {/* ML Model Performance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">ML Model Accuracy</h3>
          <div className="space-y-4">
            {[
              { model: 'ETA Prediction', accuracy: 91, version: 'v1.0', predictions: '4,231' },
              { model: 'Delay Risk', accuracy: 87, version: 'v1.0', predictions: '1,847' },
              { model: 'Route Optimization', accuracy: 94, version: 'v1.0', predictions: '312' },
            ].map(m => (
              <div key={m.model} className="p-3 bg-slate-950/50 border border-slate-800/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-300 font-medium">{m.model}</span>
                  <span className="text-[10px] text-slate-600">{m.version} · {m.predictions} predictions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${m.accuracy}%` }} />
                  </div>
                  <span className="text-xs text-blue-400 font-bold">{m.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ label, value, trend, up }: { label: string; value: string; trend: string; up: boolean }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-bold text-slate-100">{value}</p>
        <span className={`text-xs font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>{trend}</span>
      </div>
    </div>
  );
}
