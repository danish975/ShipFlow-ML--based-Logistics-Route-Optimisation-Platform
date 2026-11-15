import { CHART } from './ui';

export type FleetStatus = 'in_transit' | 'pickup' | 'stationary' | 'delayed';

export const STATUS_META: Record<FleetStatus, { label: string; color: string }> = {
  in_transit: { label: 'In transit', color: CHART.green },
  pickup: { label: 'Pick-up', color: CHART.blue },
  stationary: { label: 'Stationary', color: CHART.violet },
  delayed: { label: 'Delayed', color: CHART.amber },
};

export interface FleetVehicle {
  id: string;
  driverId: string;
  driverName: string;
  vehicleNumber: string;
  vehicleType: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  status: FleetStatus;
  shipmentNumber?: string;
  destination?: string;
  eta?: string;
}

export interface Hub {
  name: string;
  lat: number;
  lng: number;
}

export const HUBS: Hub[] = [
  { name: 'Okhla Hub', lat: 28.5355, lng: 77.271 },
  { name: 'Gurugram Hub', lat: 28.4744, lng: 77.0466 },
  { name: 'Noida Hub', lat: 28.5921, lng: 77.3375 },
];

// Demo fleet seeded from the application's driver/vehicle records
export const DEMO_FLEET: FleetVehicle[] = [
  {
    id: 'v1', driverId: 'DRV-001', driverName: 'Ramesh Kumar',
    vehicleNumber: 'HR38X1234', vehicleType: 'MINI_TRUCK',
    lat: 28.4895, lng: 77.0866, heading: 45, speed: 42,
    status: 'in_transit', shipmentNumber: 'SHP-2001',
    destination: 'Connaught Place, Delhi', eta: '14:32',
  },
  {
    id: 'v2', driverId: 'DRV-002', driverName: 'Suresh Singh',
    vehicleNumber: 'HR38X5678', vehicleType: 'VAN',
    lat: 28.6304, lng: 77.2177, heading: 110, speed: 12,
    status: 'pickup', shipmentNumber: 'SHP-2002',
    destination: 'Sector 62, Noida', eta: '15:45',
  },
  {
    id: 'v3', driverId: 'DRV-003', driverName: 'Amit Patel',
    vehicleNumber: 'DL1LV9999', vehicleType: 'TRUCK',
    lat: 28.5494, lng: 77.1526, heading: 225, speed: 28,
    status: 'delayed', shipmentNumber: 'SHP-2003',
    destination: 'Jaipur', eta: '16:45',
  },
  {
    id: 'v4', driverId: 'DRV-004', driverName: 'Vikram Yadav',
    vehicleNumber: 'UP16Z4321', vehicleType: 'MINI_TRUCK',
    lat: 28.6276, lng: 77.3411, heading: 80, speed: 35,
    status: 'in_transit', shipmentNumber: 'SHP-2004',
    destination: 'Indirapuram, Ghaziabad', eta: '15:10',
  },
  {
    id: 'v5', driverId: 'DRV-005', driverName: 'Rahul Gupta',
    vehicleNumber: 'HR26YZ1111', vehicleType: 'BIKE',
    lat: 28.5092, lng: 77.2157, heading: 250, speed: 18,
    status: 'in_transit', shipmentNumber: 'SHP-2005',
    destination: 'Cyber Hub, Gurugram', eta: '14:55',
  },
  {
    id: 'v6', driverId: 'DRV-006', driverName: 'Deepak Sharma',
    vehicleNumber: 'DL3CAB2020', vehicleType: 'VAN',
    lat: 28.5520, lng: 77.2480, heading: 0, speed: 0,
    status: 'stationary', destination: 'Loading at Okhla Hub',
  },
];
