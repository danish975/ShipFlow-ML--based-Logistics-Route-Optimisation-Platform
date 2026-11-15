'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import dynamic from 'next/dynamic';

// Lazy-load the map to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('./MapView'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950">
      <div className="text-slate-500 text-sm animate-pulse">Loading map…</div>
    </div>
  ),
});

export interface FleetVehicle {
  id: string;
  driverId: string;
  driverName: string;
  vehicleNumber: string;
  vehicleType: string;
  lat: number;
  lng: number;
  speed: number;
  status: 'active' | 'delayed' | 'idle';
  shipmentId?: string;
  shipmentNumber?: string;
  destination?: string;
  eta?: string;
}

// Demo fleet data seeded from the application's actual driver/vehicle records
const DEMO_FLEET: FleetVehicle[] = [
  {
    id: 'v1', driverId: 'DRV-001', driverName: 'Ramesh Kumar',
    vehicleNumber: 'HR38X1234', vehicleType: 'MINI_TRUCK',
    lat: 28.4595, lng: 77.0266, speed: 42,
    status: 'active', shipmentId: 'shp-1', shipmentNumber: 'SHP-2001',
    destination: 'Connaught Place, Delhi', eta: '14:32',
  },
  {
    id: 'v2', driverId: 'DRV-002', driverName: 'Suresh Singh',
    vehicleNumber: 'HR38X5678', vehicleType: 'VAN',
    lat: 28.6304, lng: 77.2177, speed: 0,
    status: 'idle', shipmentId: undefined, shipmentNumber: undefined,
    destination: undefined, eta: undefined,
  },
  {
    id: 'v3', driverId: 'DRV-003', driverName: 'Amit Patel',
    vehicleNumber: 'DL1LV9999', vehicleType: 'TRUCK',
    lat: 28.5494, lng: 77.2526, speed: 28,
    status: 'delayed', shipmentId: 'shp-3', shipmentNumber: 'SHP-2003',
    destination: 'Jaipur', eta: '16:45',
  },
  {
    id: 'v4', driverId: 'DRV-004', driverName: 'Vikram Yadav',
    vehicleNumber: 'UP16Z4321', vehicleType: 'MINI_TRUCK',
    lat: 28.6276, lng: 77.3711, speed: 35,
    status: 'active', shipmentId: 'shp-4', shipmentNumber: 'SHP-2004',
    destination: 'Indirapuram, Ghaziabad', eta: '15:10',
  },
  {
    id: 'v5', driverId: 'DRV-005', driverName: 'Rahul Gupta',
    vehicleNumber: 'HR26YZ1111', vehicleType: 'BIKE',
    lat: 28.5292, lng: 77.1557, speed: 18,
    status: 'active', shipmentId: 'shp-5', shipmentNumber: 'SHP-2005',
    destination: 'Cyber Hub, Gurugram', eta: '14:55',
  },
];

export default function LiveMap() {
  const [fleet, setFleet] = useState<FleetVehicle[]>(DEMO_FLEET);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const orgId = 'swift-logistics';
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002', {
      query: { organizationId: orgId },
      transports: ['websocket'],
      reconnectionAttempts: 3,
    });

    socket.on('connect', () => {
      console.log('[ShipFlow] WebSocket connected');
    });

    socket.on('fleet_location_updated', (data: { driverId: string; lat: number; lng: number }) => {
      setFleet(prev => prev.map(v => 
        v.driverId === data.driverId 
          ? { ...v, lat: data.lat, lng: data.lng }
          : v
      ));
    });

    socketRef.current = socket;

    // Simulate gentle movement for demo purposes
    const interval = setInterval(() => {
      setFleet(prev => prev.map(v => {
        if (v.status === 'idle') return v;
        return {
          ...v,
          lat: v.lat + (Math.random() - 0.5) * 0.002,
          lng: v.lng + (Math.random() - 0.5) * 0.002,
        };
      }));
    }, 4000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <MapView 
        fleet={fleet} 
        selectedVehicle={selectedVehicle} 
        onSelectVehicle={setSelectedVehicle} 
      />
      
      {/* Vehicle Detail Drawer */}
      {selectedVehicle && (
        <div className="absolute top-3 right-3 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl z-[1000] animate-fade-in-up overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-100">{selectedVehicle.vehicleNumber}</h4>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-500 hover:text-slate-300 text-lg leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2.5 text-xs">
              <DetailRow label="Driver" value={selectedVehicle.driverName} />
              <DetailRow label="Vehicle" value={selectedVehicle.vehicleType.replace('_', ' ')} />
              <DetailRow 
                label="Status" 
                value={
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    selectedVehicle.status === 'active' ? 'text-emerald-400 bg-emerald-400/10' :
                    selectedVehicle.status === 'delayed' ? 'text-amber-400 bg-amber-400/10' :
                    'text-slate-400 bg-slate-700'
                  }`}>
                    {selectedVehicle.status.toUpperCase()}
                  </span>
                } 
              />
              <DetailRow label="Speed" value={`${selectedVehicle.speed} km/h`} />
              {selectedVehicle.shipmentNumber && (
                <>
                  <div className="border-t border-slate-800 my-2"></div>
                  <DetailRow label="Shipment" value={selectedVehicle.shipmentNumber} />
                  <DetailRow label="Destination" value={selectedVehicle.destination || '—'} />
                  <DetailRow label="ETA" value={selectedVehicle.eta || '—'} />
                </>
              )}
            </div>
          </div>
          
          <div className="border-t border-slate-800 p-3 flex gap-2">
            {selectedVehicle.shipmentNumber && (
              <button className="flex-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-600/30 transition-colors">
                View Shipment
              </button>
            )}
            <button className="flex-1 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors">
              View Route
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200 font-medium">{typeof value === 'string' ? value : value}</span>
    </div>
  );
}
