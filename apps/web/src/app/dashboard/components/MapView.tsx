'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FleetVehicle, Hub } from './fleet-data';
import { STATUS_META } from './fleet-data';

interface MapViewProps {
  fleet: FleetVehicle[];
  hubs: Hub[];
  selectedVehicle: FleetVehicle | null;
  onSelectVehicle: (vehicle: FleetVehicle | null) => void;
}

const ARROW_PATH = 'M12 2 L20 21 L12 16.5 L4 21 Z';
const SQUARE_PATH = 'M7 7 H17 V17 H7 Z';

function createVehicleIcon(vehicle: FleetVehicle, selected: boolean): L.DivIcon {
  const { color } = STATUS_META[vehicle.status];
  // Stationary vehicles get a square glyph; moving ones an arrow rotated to
  // their heading — shape is a second channel alongside color.
  const glyph =
    vehicle.status === 'stationary'
      ? `<path d="${SQUARE_PATH}" fill="white"/>`
      : `<path d="${ARROW_PATH}" fill="white" transform="rotate(${vehicle.heading} 12 12)"/>`;

  return L.divIcon({
    className: 'sf-vehicle-marker',
    html: `
      <div class="sf-marker ${selected ? 'is-selected' : ''}">
        <div class="sf-marker-label">${vehicle.vehicleNumber}</div>
        <div class="sf-marker-dot" style="background:${color}; box-shadow: 0 0 0 4px ${color}33, 0 2px 6px rgba(0,0,0,.25)">
          <svg width="13" height="13" viewBox="0 0 24 24">${glyph}</svg>
        </div>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function createHubIcon(hub: Hub): L.DivIcon {
  return L.divIcon({
    className: 'sf-hub-marker',
    html: `<div class="sf-hub"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 21V8l9-5 9 5v13"/><path d="M8 21v-7h8v7"/></svg>${hub.name}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export default function MapView({ fleet, hubs, selectedVehicle, onSelectVehicle }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelectVehicle);
  useEffect(() => {
    onSelectRef.current = onSelectVehicle;
  }, [onSelectVehicle]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [28.56, 77.2], // Delhi NCR
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0.25,
    });

    // Esri World Topo: light, soft basemap that works without an API key.
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.attribution({ position: 'bottomleft', prefix: 'Tiles © Esri' }).addTo(map);

    hubs.forEach(h => {
      L.marker([h.lat, h.lng], { icon: createHubIcon(h), interactive: false, zIndexOffset: -100 }).addTo(map);
    });

    mapRef.current = map;
    const markers = markersRef.current;

    // Leaflet measures its container on init; re-measure once layout settles,
    // then frame every vehicle and hub with room for the marker labels.
    const t = setTimeout(() => {
      map.invalidateSize();
      const points: L.LatLngExpression[] = [
        ...Array.from(markers.values()).map(m => m.getLatLng()),
        ...hubs.map(h => [h.lat, h.lng] as L.LatLngTuple),
      ];
      if (points.length) {
        map.fitBounds(L.latLngBounds(points), { paddingTopLeft: [50, 70], paddingBottomRight: [70, 50], animate: false });
      }
    }, 200);

    return () => {
      clearTimeout(t);
      map.remove();
      mapRef.current = null;
      markers.clear();
    };
  }, [hubs]);

  // Sync markers with the (possibly filtered) fleet
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const ids = new Set(fleet.map(v => v.id));
    markersRef.current.forEach((marker, id) => {
      if (!ids.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    fleet.forEach(vehicle => {
      const selected = selectedVehicle?.id === vehicle.id;
      const icon = createVehicleIcon(vehicle, selected);
      const existing = markersRef.current.get(vehicle.id);

      if (existing) {
        existing.setLatLng([vehicle.lat, vehicle.lng]);
        existing.setIcon(icon);
        existing.off('click');
        existing.on('click', () => onSelectRef.current(vehicle));
      } else {
        const marker = L.marker([vehicle.lat, vehicle.lng], { icon });
        marker.on('click', () => onSelectRef.current(vehicle));
        marker.addTo(map);
        markersRef.current.set(vehicle.id, marker);
      }
    });
  }, [fleet, selectedVehicle]);

  // Fly to selected vehicle
  useEffect(() => {
    if (selectedVehicle && mapRef.current) {
      mapRef.current.flyTo([selectedVehicle.lat, selectedVehicle.lng], 13, { duration: 0.8 });
    }
    // Only when the selection changes, not on every position tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicle?.id]);

  return <div ref={containerRef} className="w-full h-full" style={{ minHeight: '100%' }} />;
}
