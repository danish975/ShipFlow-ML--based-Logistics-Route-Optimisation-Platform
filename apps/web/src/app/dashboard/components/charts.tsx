'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from './ui';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function niceMax(value: number, ticks = 4) {
  if (value <= 0) return ticks;
  const rough = value / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= rough) ?? 10 * mag;
  return step * ticks;
}

/* ------------------------------------------------------------------ */
/* Line chart — crosshair + tooltip, legend that toggles series        */
/* ------------------------------------------------------------------ */

export interface LineSeries {
  name: string;
  color: string;
  values: number[];
  dashed?: boolean;
  area?: boolean;
}

export function LineChart({
  labels,
  series,
  height = 280,
  tooltipTitle,
  yMin = 0,
}: {
  labels: string[];
  series: LineSeries[];
  height?: number;
  tooltipTitle?: (index: number) => string;
  yMin?: number;
}) {
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [hover, setHover] = useState<number | null>(null);
  const gradientId = useId().replace(/:/g, '');

  const visible = series.filter(s => !hidden[s.name]);
  const pad = { top: 16, right: 16, bottom: 28, left: 40 };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = height - pad.top - pad.bottom;
  const yMax = yMin + niceMax(Math.max(1, ...visible.flatMap(s => s.values)) - yMin);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(yMin + (yMax - yMin) * t));

  const x = (i: number) => pad.left + (labels.length > 1 ? (i / (labels.length - 1)) * innerW : innerW / 2);
  const y = (v: number) => pad.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  const pathFor = (values: number[]) => values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = e.clientX - rect.left;
    const idx = Math.round((rel / rect.width) * (labels.length - 1));
    setHover(Math.max(0, Math.min(labels.length - 1, idx)));
  };

  const primary = visible[0];
  const tooltipLeft = hover !== null ? x(hover) : 0;
  const flip = hover !== null && tooltipLeft > width * 0.6;

  return (
    <div>
      {/* Legend (doubles as series toggle) — only for 2+ series */}
      {series.length > 1 && <div className="grid border border-gray-200 rounded-xl overflow-hidden mb-4" style={{ gridTemplateColumns: `repeat(${series.length}, minmax(0,1fr))` }}>
        {series.map((s, i) => {
          const off = hidden[s.name];
          return (
            <button
              key={s.name}
              type="button"
              aria-pressed={!off}
              onClick={() => setHidden(h => ({ ...h, [s.name]: !h[s.name] }))}
              className={cn(
                'flex items-center justify-center gap-2 py-2 text-[13px] transition-colors',
                i > 0 && 'border-l border-gray-200',
                off ? 'text-gray-400 bg-gray-50' : 'text-gray-700 hover:bg-gray-50',
              )}
            >
              <svg width="18" height="8" aria-hidden>
                <line x1="1" y1="4" x2="17" y2="4" stroke={off ? '#d1d5db' : s.color} strokeWidth="2" strokeDasharray={s.dashed ? '4 3' : undefined} strokeLinecap="round" />
              </svg>
              {s.name}
            </button>
          );
        })}
      </div>}

      <div ref={wrapRef} className="relative" style={{ height }}>
        {width > 0 && (
          <svg width={width} height={height} className="overflow-visible">
            <defs>
              {primary && (
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={primary.color} stopOpacity="0.16" />
                  <stop offset="100%" stopColor={primary.color} stopOpacity="0" />
                </linearGradient>
              )}
            </defs>

            {/* Grid + y axis */}
            {ticks.map(t => (
              <g key={t}>
                <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke="#eef0f3" />
                <text x={pad.left - 10} y={y(t)} textAnchor="end" dominantBaseline="middle" className="fill-gray-400 text-[11px]">
                  {t}
                </text>
              </g>
            ))}
            {labels.map((l, i) => (
              <g key={l}>
                <line x1={x(i)} x2={x(i)} y1={pad.top} y2={pad.top + innerH} stroke="#f3f4f6" />
                <text
                  x={x(i)}
                  y={height - 8}
                  textAnchor="middle"
                  className={cn('text-[11px]', hover === i ? 'fill-gray-900 font-semibold' : 'fill-gray-400')}
                >
                  {l}
                </text>
              </g>
            ))}

            {/* Area under primary series */}
            {primary?.area && (
              <path
                d={`${pathFor(primary.values)} L${x(primary.values.length - 1)},${y(yMin)} L${x(0)},${y(yMin)} Z`}
                fill={`url(#${gradientId})`}
              />
            )}

            {/* Lines */}
            {visible.map(s => (
              <g key={s.name}>
                <path d={pathFor(s.values)} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? '6 4' : undefined} />
                {s.values.map((v, i) => (
                  <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 3.5} fill="#fff" stroke={s.color} strokeWidth="2" />
                ))}
                {/* Direct end label */}
                <text x={x(s.values.length - 1) - 6} y={y(s.values[s.values.length - 1]) - 10} textAnchor="end" className="fill-gray-500 text-[11px] font-medium">
                  {s.name}
                </text>
              </g>
            ))}

            {/* Crosshair */}
            {hover !== null && primary && (
              <g pointerEvents="none">
                <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + innerH} stroke="#9ca3af" strokeDasharray="3 3" />
                <line x1={pad.left} x2={width - pad.right} y1={y(primary.values[hover])} y2={y(primary.values[hover])} stroke="#374151" strokeDasharray="2 3" />
                <rect x={0} y={y(primary.values[hover]) - 10} width={pad.left - 4} height={20} rx={6} fill="#111827" />
                <text x={(pad.left - 4) / 2} y={y(primary.values[hover])} textAnchor="middle" dominantBaseline="middle" className="fill-white text-[11px] font-semibold">
                  {primary.values[hover]}
                </text>
              </g>
            )}

            {/* Hit area */}
            <rect
              x={pad.left}
              y={pad.top}
              width={innerW}
              height={innerH}
              fill="transparent"
              onMouseMove={onMove}
              onMouseLeave={() => setHover(null)}
            />
          </svg>
        )}

        {hover !== null && visible.length > 0 && (
          <div
            className="absolute z-10 pointer-events-none bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow-lg min-w-[170px]"
            style={{
              top: pad.top,
              left: flip ? undefined : tooltipLeft + 12,
              right: flip ? width - tooltipLeft + 12 : undefined,
            }}
          >
            <p className="px-3 py-2 text-xs font-semibold text-gray-900 border-b border-gray-100 text-center">
              {tooltipTitle ? tooltipTitle(hover) : labels[hover]}
            </p>
            <div className="px-3 py-2 space-y-1.5">
              {visible.map(s => (
                <div key={s.name} className="flex items-center justify-between gap-4 text-xs">
                  <span className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    {s.name}
                  </span>
                  <span className="font-semibold text-gray-900 tabular-nums">{s.values[hover]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Donut — 2px surface gaps between segments, hover focuses a segment  */
/* ------------------------------------------------------------------ */

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export function Donut({
  segments,
  centerLabel,
  size = 200,
  thickness = 16,
}: {
  segments: DonutSegment[];
  centerLabel: string;
  size?: number;
  thickness?: number;
}) {
  const [active, setActive] = useState<number | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const gap = 4; // px of arc left empty between segments

  const arcs = useMemo(
    () =>
      segments.map((s, i) => {
        const before = segments.slice(0, i).reduce((sum, x) => sum + x.value, 0);
        const len = (s.value / total) * c;
        return { len: Math.max(0, len - gap), offset: (before / total) * c };
      }),
    [segments, total, c],
  );

  const shown = active !== null ? segments[active] : null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={thickness} />
          {segments.map((s, i) => (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={active === i ? thickness + 4 : thickness}
              strokeDasharray={`${arcs[i].len} ${c - arcs[i].len}`}
              strokeDashoffset={-arcs[i].offset}
              strokeLinecap="butt"
              opacity={active === null || active === i ? 1 : 0.35}
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <p className="text-[26px] font-semibold text-gray-900 tracking-tight tabular-nums">
            {(shown ? shown.value : total).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            {shown ? `${shown.label} · ${Math.round((shown.value / total) * 100)}%` : centerLabel}
          </p>
        </div>
      </div>

      <ul className="mt-5 w-full grid grid-cols-2 gap-x-4 gap-y-2">
        {segments.map((s, i) => (
          <li
            key={s.label}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className="flex items-center justify-between gap-2 text-xs cursor-default"
          >
            <span className="flex items-center gap-2 text-gray-600 min-w-0">
              <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: s.color }} />
              <span className="truncate">{s.label}</span>
            </span>
            <span className="font-semibold text-gray-900 tabular-nums">{s.value.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bar chart — single series, rounded tops, per-bar tooltip            */
/* ------------------------------------------------------------------ */

export function BarChart({
  data,
  color = '#15803d',
  height = 220,
  unit = '',
}: {
  data: Array<{ label: string; value: number }>;
  color?: string;
  height?: number;
  unit?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const yMax = niceMax(Math.max(1, ...data.map(d => d.value)));
  const ticks = [0, 0.5, 1].map(t => Math.round(yMax * t));

  return (
    <div className="flex gap-3" style={{ height }}>
      <div className="flex flex-col justify-between text-[11px] text-gray-400 pb-6 text-right w-8 shrink-0">
        {[...ticks].reverse().map(t => <span key={t} className="leading-none">{t}</span>)}
      </div>
      <div className="relative flex-1">
        <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
          {ticks.map(t => <div key={t} className="border-t border-gray-100" />)}
        </div>
        <div className="absolute inset-0 flex items-end gap-[2px] sm:gap-3">
          {data.map((d, i) => (
            <div
              key={d.label}
              className="relative flex-1 h-full flex flex-col justify-end items-center"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="w-full flex-1 flex items-end pb-6">
                <div
                  className="relative w-full max-w-10 mx-auto rounded-t-[4px] transition-opacity"
                  style={{ height: `${(d.value / yMax) * 100}%`, background: color, opacity: hover === null || hover === i ? 1 : 0.45 }}
                >
                  {hover === i && (
                    <div className="absolute z-10 bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap">
                      {d.label}: {d.value}{unit}
                    </div>
                  )}
                </div>
              </div>
              <span className={cn('absolute bottom-0 text-[11px]', hover === i ? 'text-gray-900 font-semibold' : 'text-gray-400')}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mini bars (decorative sparkline-style, with hover values)            */
/* ------------------------------------------------------------------ */

export function MiniBars({ values, color = '#15803d', unit = '' }: { values: number[]; color?: string; unit?: string }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex items-end gap-1.5 h-12">
      {values.map((v, i) => (
        <div
          key={i}
          title={`${v}${unit}`}
          className="flex-1 rounded-t-[4px] bg-gradient-to-b"
          style={{ height: `${(v / max) * 100}%`, backgroundImage: `linear-gradient(to bottom, ${color}, ${color}22)` }}
        />
      ))}
    </div>
  );
}
