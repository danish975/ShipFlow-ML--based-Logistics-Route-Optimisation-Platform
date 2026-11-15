'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CircleCheck, X } from 'lucide-react';
import { api } from '@/lib/api';
import CreateShipmentModal from './CreateShipmentModal';

/* ------------------------------------------------------------------ */
/* API types                                                           */
/* ------------------------------------------------------------------ */

export interface ApiShipmentEvent {
  id: string;
  eventType: string;
  description?: string | null;
  createdAt: string;
}

export interface ApiShipment {
  id: string;
  shipmentNumber: string;
  status: string;
  priority: string;
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupPincode: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
  packageWeight: number;
  packageDescription?: string | null;
  deliveryWindowStart?: string | null;
  deliveryWindowEnd?: string | null;
  estimatedArrival?: string | null;
  distanceKm?: number | null;
  riskScore?: number | null;
  riskLevel?: string | null;
  createdAt: string;
  driver?: { employeeId: string; user?: { firstName?: string; lastName?: string } | null } | null;
  vehicle?: { vehicleNumber: string; type: string } | null;
  events?: ApiShipmentEvent[];
}

export interface CreateShipmentInput {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupPincode: string;
  pickupContactName?: string;
  pickupContactPhone?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
  deliveryContactName?: string;
  deliveryContactPhone?: string;
  packageWeight: number;
  packageDescription?: string;
  deliveryWindowStart?: string;
  deliveryWindowEnd?: string;
  deliveryNotes?: string;
}

/** Turns a Nest error response into readable messages. */
export function apiErrorMessages(err: unknown): string[] {
  const e = err as { response?: { data?: { message?: string | string[] } }; message?: string };
  const msg = e.response?.data?.message;
  if (Array.isArray(msg)) return msg;
  if (msg) return [msg];
  if (!e.response) return ['Unable to reach the ShipFlow API. Is it running on port 3002?'];
  return [e.message || 'Something went wrong.'];
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

interface ShipmentsContextValue {
  shipments: ApiShipment[];
  loading: boolean;
  loadError: string | null;
  recentlyCreatedId: string | null;
  openCreateShipment: () => void;
  createShipment: (input: CreateShipmentInput) => Promise<ApiShipment>;
}

const ShipmentsContext = createContext<ShipmentsContextValue | null>(null);

export function useShipments() {
  const ctx = useContext(ShipmentsContext);
  if (!ctx) throw new Error('useShipments must be used inside <ShipmentsProvider>');
  return ctx;
}

export function ShipmentsProvider({ children }: { children: React.ReactNode }) {
  const [shipments, setShipments] = useState<ApiShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<ApiShipment | null>(null);
  const [recentlyCreatedId, setRecentlyCreatedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<ApiShipment[]>('/api/v1/shipments')
      .then(res => {
        if (!cancelled) setShipments(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        if (!cancelled) setLoadError(apiErrorMessages(err)[0]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const createShipment = useCallback(async (input: CreateShipmentInput) => {
    const res = await api.post<ApiShipment>('/api/v1/shipments', input);
    const created = res.data;
    setShipments(prev => [created, ...prev]);
    setRecentlyCreatedId(created.id);
    setToast(created);
    return created;
  }, []);

  const value = useMemo<ShipmentsContextValue>(
    () => ({
      shipments,
      loading,
      loadError,
      recentlyCreatedId,
      openCreateShipment: () => setModalOpen(true),
      createShipment,
    }),
    [shipments, loading, loadError, recentlyCreatedId, createShipment],
  );

  return (
    <ShipmentsContext.Provider value={value}>
      {children}
      {modalOpen && <CreateShipmentModal onClose={() => setModalOpen(false)} />}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[1300] w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4 flex gap-3 animate-fade-in-up"
        >
          <CircleCheck className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Shipment {toast.shipmentNumber} created</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {toast.pickupCity} → {toast.deliveryCity} · {toast.packageWeight} kg
            </p>
            <Link
              href={`/dashboard/shipments/${toast.id}`}
              onClick={() => setToast(null)}
              className="inline-block mt-2 text-xs font-medium text-green-700 hover:text-green-800"
            >
              View shipment →
            </Link>
          </div>
          <button type="button" aria-label="Dismiss" onClick={() => setToast(null)} className="self-start p-0.5 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </ShipmentsContext.Provider>
  );
}
