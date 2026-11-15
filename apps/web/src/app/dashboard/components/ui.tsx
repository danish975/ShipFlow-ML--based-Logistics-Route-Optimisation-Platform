'use client';

import type { LucideIcon } from 'lucide-react';
import { EllipsisVertical, TrendingDown, TrendingUp } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */

// Categorical chart palette (validated: lightness, chroma, CVD, contrast).
// Fixed order — always assign in this order, never cycle.
export const CHART = {
  green: '#15803d',
  blue: '#0284c7',
  amber: '#d97706',
  violet: '#7c3aed',
} as const;

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cn(
        'bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)]',
        padded && 'p-5',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-3 mb-4', className)}>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action ?? <MoreButton />}
    </div>
  );
}

export function MoreButton({ label = 'More options' }: { label?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="p-1 -m-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
    >
      <EllipsisVertical className="w-4 h-4" />
    </button>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-h-9">
      <div>
        {/* The top bar already shows the page title visually. */}
        <h2 className="sr-only">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Badges & pills                                                      */
/* ------------------------------------------------------------------ */

export type Tone = 'green' | 'red' | 'amber' | 'blue' | 'violet' | 'gray';

const toneClasses: Record<Tone, string> = {
  green: 'bg-green-50 text-green-700 ring-green-600/15',
  red: 'bg-red-50 text-red-600 ring-red-600/15',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  blue: 'bg-sky-50 text-sky-700 ring-sky-600/15',
  violet: 'bg-violet-50 text-violet-700 ring-violet-600/15',
  gray: 'bg-gray-100 text-gray-600 ring-gray-500/15',
};

export function Badge({
  tone = 'gray',
  children,
  dot = false,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset whitespace-nowrap',
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

// Shared status → tone mapping for shipments, drivers, vehicles, exceptions.
const statusTone: Record<string, Tone> = {
  CREATED: 'gray',
  ASSIGNED: 'blue',
  PICKED_UP: 'violet',
  IN_TRANSIT: 'green',
  DELAYED: 'amber',
  DELIVERED: 'green',
  FAILED: 'red',
  CANCELLED: 'gray',
  ON_DUTY: 'green',
  AVAILABLE: 'blue',
  ON_BREAK: 'amber',
  OFF_DUTY: 'gray',
  MAINTENANCE: 'amber',
  OPEN: 'red',
  ACKNOWLEDGED: 'amber',
  RESOLVED: 'green',
  IGNORED: 'gray',
  CRITICAL: 'red',
  HIGH: 'amber',
  MEDIUM: 'blue',
  LOW: 'gray',
  URGENT: 'red',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const label = status
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return (
    <Badge tone={statusTone[status] ?? 'gray'} className={className}>
      {label}
    </Badge>
  );
}

export function DeltaBadge({ value, good }: { value: string; good: boolean }) {
  const Icon = value.trim().startsWith('-') ? TrendingDown : TrendingUp;
  return (
    <Badge tone={good ? 'green' : 'red'}>
      <Icon className="w-3 h-3" />
      {value}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* KPI strip (the "Operations overview" row)                           */
/* ------------------------------------------------------------------ */

export interface Kpi {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  delta?: string;
  deltaGood?: boolean;
  deltaCaption?: string;
}

export function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-5">
      {items.map((k) => (
        <div
          key={k.label}
          className={cn(
            'pl-4 pr-3 border-l-2',
            k.deltaGood === false ? 'border-red-400' : 'border-green-600',
          )}
        >
          <div className="flex items-center gap-2 text-gray-500">
            <k.icon className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-[13px] font-medium">{k.label}</span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              <p className="text-[26px] leading-none font-semibold text-gray-900 tracking-tight">{k.value}</p>
              <p className="text-xs text-gray-500 mt-2">{k.caption}</p>
            </div>
            {k.delta && (
              <div className="text-right">
                <DeltaBadge value={k.delta} good={k.deltaGood ?? true} />
                <p className="text-[11px] text-gray-500 mt-2">{k.deltaCaption ?? 'vs yesterday'}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  counts,
  className,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  counts?: Partial<Record<T, number>>;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex flex-wrap gap-1 p-1 bg-gray-100 rounded-xl', className)}>
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              active ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-800',
            )}
          >
            {o}
            {counts?.[o] !== undefined && (
              <span className={cn('ml-1.5 text-[10px]', active ? 'text-green-700' : 'text-gray-400')}>
                {counts[o]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Button({
  children,
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-colors disabled:opacity-60 disabled:cursor-default',
        variant === 'primary' && 'bg-green-700 text-white hover:bg-green-800 shadow-sm',
        variant === 'secondary' && 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
        variant === 'ghost' && 'text-gray-600 hover:bg-gray-100',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ value, tone = 'green' }: { value: number; tone?: 'green' | 'amber' | 'red' | 'blue' }) {
  const color = { green: 'bg-green-600', amber: 'bg-amber-500', red: 'bg-red-500', blue: 'bg-sky-600' }[tone];
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function riskTone(score: number): 'green' | 'amber' | 'red' {
  return score > 60 ? 'red' : score > 30 ? 'amber' : 'green';
}

/* ------------------------------------------------------------------ */
/* Tables                                                              */
/* ------------------------------------------------------------------ */

export const table = {
  wrap: 'overflow-x-auto',
  table: 'w-full text-sm',
  headRow: 'border-b border-gray-100 bg-gray-50/60',
  th: 'text-left px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-gray-500 whitespace-nowrap',
  row: 'border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition-colors',
  td: 'px-5 py-3 text-[13px] text-gray-700 whitespace-nowrap',
};
