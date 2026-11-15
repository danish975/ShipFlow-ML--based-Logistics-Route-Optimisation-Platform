'use client';

const drivers = [
  { empId: 'DRV-001', name: 'Ramesh Kumar', vehicle: 'HR38X1234', type: 'MINI_TRUCK', status: 'ON_DUTY', rating: 4.8, deliveries: 342, currentTask: 'SHP-2001' },
  { empId: 'DRV-002', name: 'Suresh Singh', vehicle: 'HR38X5678', type: 'VAN', status: 'AVAILABLE', rating: 4.5, deliveries: 289, currentTask: null },
  { empId: 'DRV-003', name: 'Amit Patel', vehicle: 'DL1LV9999', type: 'TRUCK', status: 'ON_DUTY', rating: 4.6, deliveries: 518, currentTask: 'SHP-2003' },
  { empId: 'DRV-004', name: 'Vikram Yadav', vehicle: 'UP16Z4321', type: 'MINI_TRUCK', status: 'ON_DUTY', rating: 4.9, deliveries: 401, currentTask: 'SHP-2004' },
  { empId: 'DRV-005', name: 'Rahul Gupta', vehicle: 'HR26YZ1111', type: 'BIKE', status: 'ON_DUTY', rating: 4.3, deliveries: 156, currentTask: 'SHP-2005' },
];

const vehicles = [
  { number: 'HR38X1234', type: 'MINI_TRUCK', make: 'Tata Ace', capacity: '1500 kg', status: 'IN_TRANSIT', odometer: '45,230 km', fuel: 'DIESEL' },
  { number: 'HR38X5678', type: 'VAN', make: 'Maruti Eeco', capacity: '800 kg', status: 'AVAILABLE', odometer: '32,100 km', fuel: 'DIESEL' },
  { number: 'DL1LV9999', type: 'TRUCK', make: 'Ashok Leyland Dost', capacity: '5000 kg', status: 'IN_TRANSIT', odometer: '78,540 km', fuel: 'DIESEL' },
  { number: 'UP16Z4321', type: 'MINI_TRUCK', make: 'Mahindra Bolero Pik-Up', capacity: '2000 kg', status: 'IN_TRANSIT', odometer: '56,800 km', fuel: 'DIESEL' },
  { number: 'HR26YZ1111', type: 'BIKE', make: 'Hero Splendor', capacity: '50 kg', status: 'IN_TRANSIT', odometer: '12,350 km', fuel: 'PETROL' },
];

const statusColors: Record<string, string> = {
  ON_DUTY: 'text-emerald-400 bg-emerald-400/10',
  AVAILABLE: 'text-blue-400 bg-blue-400/10',
  ON_BREAK: 'text-amber-400 bg-amber-400/10',
  OFF_DUTY: 'text-slate-400 bg-slate-400/10',
  IN_TRANSIT: 'text-emerald-400 bg-emerald-400/10',
  MAINTENANCE: 'text-amber-400 bg-amber-400/10',
};

export default function FleetPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Fleet & Drivers</h1>
        <p className="text-sm text-slate-500 mt-1">Manage vehicles and driver assignments</p>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Vehicles" value="5" />
        <StatCard label="In Transit" value="4" />
        <StatCard label="Drivers On Duty" value="4" />
        <StatCard label="Available" value="1" />
      </div>

      {/* Drivers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="text-base font-semibold text-slate-200">Drivers</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500">
              <th className="text-left px-5 py-2.5 font-medium text-xs">Employee</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs">Vehicle</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs">Status</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs">Rating</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs">Deliveries</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs">Current Task</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d.empId} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="px-5 py-3">
                  <div>
                    <p className="text-slate-200 font-medium text-xs">{d.name}</p>
                    <p className="text-slate-500 text-[11px]">{d.empId}</p>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-slate-300 text-xs">{d.vehicle}</span>
                  <span className="text-slate-600 text-[10px] ml-1.5">{d.type}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColors[d.status] || ''}`}>
                    {d.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-300 text-xs">⭐ {d.rating}</td>
                <td className="px-5 py-3 text-slate-300 text-xs">{d.deliveries}</td>
                <td className="px-5 py-3 text-xs">
                  {d.currentTask ? (
                    <span className="text-blue-400 font-medium">{d.currentTask}</span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vehicles */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="text-base font-semibold text-slate-200">Vehicles</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500">
              <th className="text-left px-5 py-2.5 font-medium text-xs">Vehicle</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs">Make & Model</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs">Capacity</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs">Status</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs">Odometer</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs">Fuel</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.number} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="px-5 py-3">
                  <p className="text-slate-200 font-semibold text-xs">{v.number}</p>
                  <p className="text-slate-500 text-[10px]">{v.type}</p>
                </td>
                <td className="px-5 py-3 text-slate-300 text-xs">{v.make}</td>
                <td className="px-5 py-3 text-slate-300 text-xs">{v.capacity}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColors[v.status] || ''}`}>
                    {v.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-300 text-xs font-mono">{v.odometer}</td>
                <td className="px-5 py-3 text-slate-400 text-xs">{v.fuel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
