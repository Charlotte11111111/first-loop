import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface EventPoint {
  id: string;
  /** 0–1 along full timeline */
  t: number;
  /** 0–1 chart height (0 = bottom) */
  y: number;
  title: string;
  timeLabel: string;
  hrFrom: number;
  hrTo: number;
  bodyFrom: string;
  bodyTo: string;
}

const W = 320;
const H = 160;
const PAD = { top: 18, right: 14, bottom: 28, left: 14 };
const NOW_T = 0.52;

const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

function xAt(t: number) {
  return PAD.left + t * plotW;
}
function yAt(v: number) {
  return PAD.top + (1 - v) * plotH;
}

/** Budget history (solid) up to Now */
const BUDGET_PAST = [
  [0.0, 0.42],
  [0.08, 0.5],
  [0.16, 0.58],
  [0.24, 0.72],
  [0.32, 0.68],
  [0.4, 0.78],
  [0.48, 0.82],
  [NOW_T, 0.8],
] as const;

/** Forecast (dashed) from Now */
const BUDGET_FORECAST = [
  [NOW_T, 0.8],
  [0.62, 0.74],
  [0.74, 0.68],
  [0.86, 0.62],
  [1.0, 0.58],
] as const;

/** Demand */
const DEMAND = [
  [0.0, 0.28],
  [0.12, 0.32],
  [0.24, 0.38],
  [0.36, 0.42],
  [0.48, 0.46],
  [NOW_T, 0.48],
  [0.65, 0.52],
  [0.8, 0.55],
  [1.0, 0.58],
] as const;

const EVENTS: EventPoint[] = [
  {
    id: 'rest',
    t: 0.24,
    y: 0.72,
    title: 'Rest baseline',
    timeLabel: '2:10 PM · 4 min ago',
    hrFrom: 86,
    hrTo: 78,
    bodyFrom: 'Elevated',
    bodyTo: 'Easing',
  },
];

function toPath(pts: readonly (readonly [number, number])[]) {
  return pts.map(([t, v], i) => `${i === 0 ? 'M' : 'L'} ${xAt(t).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ');
}

function bandPath(
  top: readonly (readonly [number, number])[],
  bottom: readonly (readonly [number, number])[]
) {
  const up = top.map(([t, v], i) => `${i === 0 ? 'M' : 'L'} ${xAt(t).toFixed(1)} ${yAt(v).toFixed(1)}`);
  const down = [...bottom]
    .reverse()
    .map(([t, v]) => `L ${xAt(t).toFixed(1)} ${yAt(v).toFixed(1)}`);
  return `${up.join(' ')} ${down.join(' ')} Z`;
}

export const EnergyBudgetChart: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = EVENTS.find((e) => e.id === openId) ?? null;

  const forecastBandTop = BUDGET_FORECAST;
  const forecastBandBottom = DEMAND.filter(([t]) => t >= NOW_T);

  return (
    <div className="mx-4 mb-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-3.5 pt-3.5 flex items-start justify-between">
        <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
          Energy Budget
        </p>
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
          Ample Budget
        </span>
      </div>

      <div className="relative px-1 pt-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Energy budget chart">
          {/* Forecast band */}
          <path
            d={bandPath(forecastBandTop, forecastBandBottom)}
            fill="#93c5fd"
            fillOpacity={0.18}
          />

          {/* Demand */}
          <path
            d={toPath(DEMAND)}
            fill="none"
            stroke="#f97316"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Budget past */}
          <path
            d={toPath(BUDGET_PAST)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Forecast dashed */}
          <path
            d={toPath(BUDGET_FORECAST)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2.25}
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Now vertical */}
          <line
            x1={xAt(NOW_T)}
            y1={PAD.top}
            x2={xAt(NOW_T)}
            y2={PAD.top + plotH}
            stroke="#cbd5e1"
            strokeWidth={1.25}
            strokeDasharray="3 3"
          />
          <circle cx={xAt(NOW_T)} cy={yAt(0.8)} r={3.5} fill="#fff" stroke="#3b82f6" strokeWidth={1.75} />
          <circle cx={xAt(NOW_T)} cy={yAt(0.48)} r={3.5} fill="#fff" stroke="#f97316" strokeWidth={1.75} />

          {/* Start marker */}
          <circle cx={xAt(0)} cy={yAt(0.42)} r={7} fill="#0f172a" />
          <text
            x={xAt(0)}
            y={yAt(0.42) + 0.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize={8}
            fontWeight={700}
            fontFamily="Inter, system-ui, sans-serif"
          >
            S
          </text>

          {/* Axis labels */}
          <text
            x={xAt(NOW_T)}
            y={H - 8}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={9}
            fontFamily="Inter, system-ui, sans-serif"
          >
            Now
          </text>
          <text
            x={xAt(0.88)}
            y={H - 8}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={9}
            fontFamily="Inter, system-ui, sans-serif"
          >
            +30 min
          </text>

          {/* Interactive green event dots */}
          {EVENTS.map((e) => {
            const cx = xAt(e.t);
            const cy = yAt(e.y);
            const active = openId === e.id;
            return (
              <g
                key={e.id}
                className="cursor-pointer"
                onClick={() => setOpenId(active ? null : e.id)}
              >
                {/* Icon above */}
                <circle cx={cx} cy={cy - 16} r={6} fill="#22c55e" fillOpacity={0.15} />
                <circle cx={cx} cy={cy - 16} r={3.5} fill="none" stroke="#22c55e" strokeWidth={1.5} />
                <circle cx={cx} cy={cy - 16} r={1.5} fill="#22c55e" />
                {/* Dot on line */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={active ? 6 : 5}
                  fill="#22c55e"
                  stroke="#fff"
                  strokeWidth={2}
                />
                {/* Larger hit area */}
                <circle cx={cx} cy={cy} r={14} fill="transparent" />
              </g>
            );
          })}
        </svg>

        {/* Event detail popover */}
        {open && (
          <div className="absolute left-3 right-3 top-2 z-20 bg-white rounded-2xl border border-slate-200 shadow-xl p-3.5 animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inset-0 rounded-full border border-emerald-500" />
                    <span className="absolute inset-[3px] rounded-full bg-emerald-500" />
                  </span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-900 leading-tight">{open.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{open.timeLabel}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-slate-50">
                <span className="text-[11px] text-slate-500 shrink-0">Heart rate</span>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] text-slate-400 tabular-nums">{open.hrFrom} bpm</span>
                  <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-900 tabular-nums">{open.hrTo} bpm</span>
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[9px] font-semibold tabular-nums">
                    {open.hrTo - open.hrFrom}bpm
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-slate-50">
                <span className="text-[11px] text-slate-500 shrink-0">Body response</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">{open.bodyFrom}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-900">{open.bodyTo}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-3.5 pb-3.5 pt-1 flex items-center justify-center gap-4 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <svg width="16" height="4" className="shrink-0">
            <line x1="0" y1="2" x2="16" y2="2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Budget
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="16" height="4" className="shrink-0">
            <line
              x1="0"
              y1="2"
              x2="16"
              y2="2"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="3 2"
              strokeLinecap="round"
            />
          </svg>
          Forecast
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="16" height="4" className="shrink-0">
            <line x1="0" y1="2" x2="16" y2="2" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Demand
        </span>
      </div>
    </div>
  );
};
