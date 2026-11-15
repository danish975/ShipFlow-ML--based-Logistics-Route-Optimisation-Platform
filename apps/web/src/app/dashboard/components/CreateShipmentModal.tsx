'use client';

import { useEffect, useRef, useState } from 'react';
import { CircleAlert, MapPin, Package, Navigation, X } from 'lucide-react';
import { Button, cn } from './ui';
import { apiErrorMessages, useShipments } from './shipments-context';
import type { CreateShipmentInput } from './shipments-context';

type Priority = CreateShipmentInput['priority'];
const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

interface FormState {
  priority: Priority;
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupPincode: string;
  pickupContactName: string;
  pickupContactPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
  deliveryContactName: string;
  deliveryContactPhone: string;
  packageWeight: string;
  packageDescription: string;
  deliveryWindowStart: string;
  deliveryWindowEnd: string;
  deliveryNotes: string;
}

const EMPTY: FormState = {
  priority: 'MEDIUM',
  pickupAddress: '', pickupCity: '', pickupState: '', pickupPincode: '', pickupContactName: '', pickupContactPhone: '',
  deliveryAddress: '', deliveryCity: '', deliveryState: '', deliveryPincode: '', deliveryContactName: '', deliveryContactPhone: '',
  packageWeight: '', packageDescription: '',
  deliveryWindowStart: '', deliveryWindowEnd: '', deliveryNotes: '',
};

type Errors = Partial<Record<keyof FormState, string>>;

const PIN = /^\d{6}$/;
const PHONE = /^[+\d][\d\s-]{7,17}$/;

function validate(f: FormState): Errors {
  const e: Errors = {};
  const req = (k: keyof FormState, label: string, min = 2) => {
    if (f[k].trim().length < min) e[k] = `${label} is required`;
  };
  req('pickupAddress', 'Address', 3);
  req('pickupCity', 'City');
  req('pickupState', 'State');
  if (!PIN.test(f.pickupPincode.trim())) e.pickupPincode = 'Enter a 6-digit PIN code';
  if (f.pickupContactPhone && !PHONE.test(f.pickupContactPhone.trim())) e.pickupContactPhone = 'Enter a valid phone number';

  req('deliveryAddress', 'Address', 3);
  req('deliveryCity', 'City');
  req('deliveryState', 'State');
  if (!PIN.test(f.deliveryPincode.trim())) e.deliveryPincode = 'Enter a 6-digit PIN code';
  if (f.deliveryContactPhone && !PHONE.test(f.deliveryContactPhone.trim())) e.deliveryContactPhone = 'Enter a valid phone number';

  const w = Number(f.packageWeight);
  if (!f.packageWeight || Number.isNaN(w) || w < 0.1) e.packageWeight = 'Enter a weight of at least 0.1 kg';
  else if (w > 40000) e.packageWeight = 'Maximum is 40,000 kg';

  if (f.deliveryWindowStart && f.deliveryWindowEnd && new Date(f.deliveryWindowEnd) <= new Date(f.deliveryWindowStart)) {
    e.deliveryWindowEnd = 'Must be after the window start';
  }
  return e;
}

function toPayload(f: FormState): CreateShipmentInput {
  const opt = (v: string) => (v.trim() ? v.trim() : undefined);
  const iso = (v: string) => (v ? new Date(v).toISOString() : undefined);
  return {
    priority: f.priority,
    pickupAddress: f.pickupAddress.trim(),
    pickupCity: f.pickupCity.trim(),
    pickupState: f.pickupState.trim(),
    pickupPincode: f.pickupPincode.trim(),
    pickupContactName: opt(f.pickupContactName),
    pickupContactPhone: opt(f.pickupContactPhone),
    deliveryAddress: f.deliveryAddress.trim(),
    deliveryCity: f.deliveryCity.trim(),
    deliveryState: f.deliveryState.trim(),
    deliveryPincode: f.deliveryPincode.trim(),
    deliveryContactName: opt(f.deliveryContactName),
    deliveryContactPhone: opt(f.deliveryContactPhone),
    packageWeight: Number(f.packageWeight),
    packageDescription: opt(f.packageDescription),
    deliveryWindowStart: iso(f.deliveryWindowStart),
    deliveryWindowEnd: iso(f.deliveryWindowEnd),
    deliveryNotes: opt(f.deliveryNotes),
  };
}

export default function CreateShipmentModal({ onClose }: { onClose: () => void }) {
  const { createShipment } = useShipments();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, submitting]);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm(f => ({ ...f, [k]: value }));
    setErrors(prev => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setServerErrors([]);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await createShipment(toPayload(form));
      onClose();
    } catch (err) {
      setServerErrors(apiErrorMessages(err));
      setSubmitting(false);
    }
  };

  const field = (k: keyof FormState, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, ref?: React.Ref<HTMLInputElement>) => (
    <label className="block">
      <span className="text-xs font-medium text-gray-700">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <input
        ref={ref}
        value={form[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        {...props}
        required={false}
        className={cn(
          'mt-1 w-full h-9 px-3 rounded-lg border bg-white text-[13px] text-gray-900 outline-none placeholder:text-gray-400 transition-colors',
          errors[k] ? 'border-red-400 focus:ring-2 focus:ring-red-500/10' : 'border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10',
        )}
      />
      {errors[k] && <span className="mt-1 block text-[11px] text-red-600">{errors[k]}</span>}
    </label>
  );

  return (
    <div className="fixed inset-0 z-[1250] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px]" onClick={() => !submitting && onClose()} />
      <form
        onSubmit={onSubmit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-shipment-title"
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in-up my-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
          <div>
            <h2 id="create-shipment-title" className="text-base font-semibold text-gray-900">Create shipment</h2>
            <p className="text-xs text-gray-500 mt-0.5">A shipment number is generated automatically. You can assign a driver later.</p>
          </div>
          <button type="button" onClick={onClose} disabled={submitting} aria-label="Close" className="p-1.5 -m-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {serverErrors.length > 0 && (
            <div className="flex gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700">
              <CircleAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <ul className="space-y-0.5">{serverErrors.map(m => <li key={m}>{m}</li>)}</ul>
            </div>
          )}

          {/* Priority */}
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1.5">Priority</p>
            <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-xl">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, priority: p }))}
                  aria-pressed={form.priority === p}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    form.priority === p ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-800',
                  )}
                >
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup & delivery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <fieldset className="space-y-3">
              <legend className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <span className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center"><MapPin className="w-3.5 h-3.5" /></span>
                Pickup
              </legend>
              {field('pickupAddress', 'Address', { required: true, placeholder: 'Plot 14, Udyog Vihar Phase 4' }, firstFieldRef)}
              <div className="grid grid-cols-2 gap-3">
                {field('pickupCity', 'City', { required: true, placeholder: 'Gurugram' })}
                {field('pickupState', 'State', { required: true, placeholder: 'Haryana' })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field('pickupPincode', 'PIN code', { required: true, placeholder: '122015', inputMode: 'numeric', maxLength: 6 })}
                {field('pickupContactPhone', 'Contact phone', { placeholder: '+91 98765 43210', inputMode: 'tel' })}
              </div>
              {field('pickupContactName', 'Contact name', { placeholder: 'Warehouse desk' })}
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <span className="w-6 h-6 rounded-md bg-green-50 text-green-700 flex items-center justify-center"><Navigation className="w-3.5 h-3.5" /></span>
                Delivery
              </legend>
              {field('deliveryAddress', 'Address', { required: true, placeholder: 'Block E, Connaught Place' })}
              <div className="grid grid-cols-2 gap-3">
                {field('deliveryCity', 'City', { required: true, placeholder: 'New Delhi' })}
                {field('deliveryState', 'State', { required: true, placeholder: 'Delhi' })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field('deliveryPincode', 'PIN code', { required: true, placeholder: '110001', inputMode: 'numeric', maxLength: 6 })}
                {field('deliveryContactPhone', 'Contact phone', { placeholder: '+91 91234 56789', inputMode: 'tel' })}
              </div>
              {field('deliveryContactName', 'Contact name', { placeholder: 'Recipient name' })}
            </fieldset>
          </div>

          {/* Package & window */}
          <fieldset className="space-y-3">
            <legend className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
              <span className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center"><Package className="w-3.5 h-3.5" /></span>
              Package & delivery window
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {field('packageWeight', 'Weight (kg)', { required: true, placeholder: '450', inputMode: 'decimal', type: 'number', min: 0.1, step: 'any' })}
              <div className="sm:col-span-2">{field('packageDescription', 'Description', { placeholder: 'Consumer electronics — 2 cartons' })}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('deliveryWindowStart', 'Window start', { type: 'datetime-local' })}
              {field('deliveryWindowEnd', 'Window end', { type: 'datetime-local' })}
            </div>
            <label className="block">
              <span className="text-xs font-medium text-gray-700">Delivery notes</span>
              <textarea
                value={form.deliveryNotes}
                onChange={set('deliveryNotes')}
                rows={2}
                maxLength={500}
                placeholder="Call before arrival, gate 3…"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 resize-none"
              />
            </label>
          </fieldset>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {submitting ? 'Creating…' : 'Create shipment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
