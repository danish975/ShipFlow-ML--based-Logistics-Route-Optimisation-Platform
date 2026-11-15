'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { io } from 'socket.io-client';
import dynamic from 'next/dynamic';
import { X } from 'lucide-react';
import { cn } from './ui';
import { DEMO_FLEET, HUBS, STATUS_META } from './fleet-data';
import type { FleetStatus, FleetVehicle } from './fleet-data';

export type { FleetStatus, FleetVehicle, Hub } from './fleet-data';
export { DEMO_FLEET, HUBS, STATUS_META } from './fleet-data';

// Lazy-load the map to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="text-gray-400 text-sm animate-pulse">Loading map…</div>
    </div>
  ),
});

export default function LiveMap({ query = '' }: { query?: string }) {
  const [fleet, setFleet] = useState<FleetVehicle[]>(DEMO_FLEET);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hiddenStatuses, setHiddenStatuses] = useState<Partial<Record<FleetStatus, boolean>>>({});

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002', {
      query: { organizationId: 'swift-logistics' },
      transports: ['websocket'],
      reconnectionAttempts: 3,
    });

    socket.on('fleet_location_updated', (data: { driverId: string; lat: number; lng: number }) => {
      setFleet(prev => prev.map(v => (v.driverId === data.driverId ? { ...v, lat: data.lat, lng: data.lng } : v)));
    });

    // Simulate gentle movement along each vehicle's heading for the demo.
    const interval = setInterval(() => {
      setFleet(prev =>
        prev.map(v => {
          if (v.status === 'stationary') return v;
          const rad = (v.heading * Math.PI) / 180;
          const step = 0.0006 + Math.random() * 0.0006;
          const heading = (v.heading + (Math.random() - 0.5) * 20 + 360) % 360;
          return { ...v, heading, lat: v.lat + Math.cos(rad) * step, lng: v.lng + Math.sin(rad) * step };
        }),
      );
    }, 4000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  const q = query.trim().toLowerCase();
  const visibleFleet = useMemo(
    () =>
      fleet.filter(
        v =>
          !hiddenStatuses[v.status] &&
          (!q ||
            v.vehicleNumber.toLowerCase().includes(q) ||
            v.driverName.toLowerCase().includes(q) ||
            v.shipmentNumber?.toLowerCase().includes(q)),
      ),
    [fleet, hiddenStatuses, q],
  );

  const counts = useMemo(() => {
    const c: Record<FleetStatus, number> = { in_transit: 0, pickup: 0, stationary: 0, delayed: 0 };
    fleet.forEach(v => c[v.status]++);
    return c;
  }, [fleet]);

  const selectedVehicle = fleet.find(v => v.id === selectedId) ?? null;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-gray-200">
        <MapView
          fleet={visibleFleet}
          hubs={HUBS}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={v => setSelectedId(v?.id ?? null)}
        />

        {q && visibleFleet.length === 0 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 shadow-sm">
            No vehicles match “{query}”
          </div>
        )}

        {selectedVehicle && (
          <div className="absolute top-3 right-3 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-[1000] animate-fade-in-up overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{selectedVehicle.vehicleNumber}</h4>
                  <p className="text-[11px] text-gray-500">{selectedVehicle.vehicleType.replace('_', ' ')}</p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setSelectedId(null)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <DetailRow label="Driver" value={selectedVehicle.driverName} />
                <DetailRow
                  label="Status"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: STATUS_META[selectedVehicle.status].color }} />
                      {STATUS_META[selectedVehicle.status].label}
                    </span>
                  }
                />
                <DetailRow label="Speed" value={`${selectedVehicle.speed} km/h`} />
                {selectedVehicle.destination && <DetailRow label="Destination" value={selectedVehicle.destination} />}
                {selectedVehicle.shipmentNumber && (
                  <>
                    <DetailRow label="Shipment" value={selectedVehicle.shipmentNumber} />
                    <DetailRow label="ETA" value={selectedVehicle.eta || '—'} />
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 p-3 flex gap-2">
              {selectedVehicle.shipmentNumber && (
                <Link
                  href={`/dashboard/shipments/${selectedVehicle.shipmentNumber}`}
                  className="flex-1 text-center px-3 py-1.5 bg-green-700 text-white rounded-lg text-xs font-medium hover:bg-green-800"
                >
                  View shipment
                </Link>
              )}
              <Link
                href="/dashboard/routes"
                className="flex-1 text-center px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50"
              >
                View route
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Legend — click to filter by status */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 border border-gray-200 rounded-xl overflow-hidden">
        {(Object.keys(STATUS_META) as FleetStatus[]).map((s, i) => {
          const off = hiddenStatuses[s];
          return (
            <button
              key={s}
              type="button"
              aria-pressed={!off}
              onClick={() => setHiddenStatuses(h => ({ ...h, [s]: !h[s] }))}
              className={cn(
                'flex items-center justify-center gap-2 py-2 text-[13px] transition-colors',
                i > 0 && 'sm:border-l border-gray-200',
                i % 2 === 1 && 'border-l',
                i > 1 && 'border-t sm:border-t-0',
                off ? 'text-gray-400 bg-gray-50 line-through' : 'text-gray-700 hover:bg-gray-50',
              )}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: off ? '#d1d5db' : STATUS_META[s].color }} />
              {STATUS_META[s].label}
              <span className="text-[11px] text-gray-400 tabular-nums">{counts[s]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right truncate">{value}</span>
    </div>
  );
}
