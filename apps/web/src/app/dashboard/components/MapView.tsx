'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FleetVehicle } from './LiveMap';

interface MapViewProps {
  fleet: FleetVehicle[];
  selectedVehicle: FleetVehicle | null;
  onSelectVehicle: (vehicle: FleetVehicle | null) => void;
}

// Custom marker icons based on vehicle status
function createVehicleIcon(status: string): L.DivIcon {
  const colors: Record<string, string> = {
    active: '#10b981',   // emerald
    delayed: '#f59e0b',  // amber
    idle: '#64748b',     // slate
  };
  const color = colors[status] || colors.idle;
  
  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        width: 28px; height: 28px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 12px ${color}80, 0 2px 8px rgba(0,0,0,0.4);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function MapView({ fleet, selectedVehicle, onSelectVehicle }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [28.55, 77.15], // Delhi NCR center
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Attribution in bottom-left
    L.control.attribution({ position: 'bottomleft', prefix: '© OpenStreetMap' }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when fleet changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    fleet.forEach((vehicle) => {
      const existing = markersRef.current.get(vehicle.id);
      
      if (existing) {
        // Smoothly move existing marker
        existing.setLatLng([vehicle.lat, vehicle.lng]);
        existing.setIcon(createVehicleIcon(vehicle.status));
      } else {
        // Create new marker
        const marker = L.marker([vehicle.lat, vehicle.lng], {
          icon: createVehicleIcon(vehicle.status),
        });

        marker.bindTooltip(
          `<div style="font-size:11px;line-height:1.4">
            <strong>${vehicle.vehicleNumber}</strong><br/>
            ${vehicle.driverName}<br/>
            <span style="color:#94a3b8">${vehicle.status.toUpperCase()} · ${vehicle.speed} km/h</span>
          </div>`,
          { direction: 'top', offset: [0, -16], className: 'vehicle-tooltip' }
        );

        marker.on('click', () => {
          onSelectVehicle(vehicle);
        });

        marker.addTo(map);
        markersRef.current.set(vehicle.id, marker);
      }
    });
  }, [fleet, onSelectVehicle]);

  // Fly to selected vehicle
  useEffect(() => {
    if (selectedVehicle && mapRef.current) {
      mapRef.current.flyTo([selectedVehicle.lat, selectedVehicle.lng], 14, { duration: 0.8 });
    }
  }, [selectedVehicle]);

  return (
    <div ref={containerRef} className="w-full h-full" style={{ minHeight: '100%' }} />
  );
}
