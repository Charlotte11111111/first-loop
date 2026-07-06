import React, { useRef, useState } from 'react';
import { DataPoint, SignalQuality } from '../types';

interface CalibrationChartProps {
  type: 'eda' | 'hr';
  data: DataPoint[];
  quality: SignalQuality;
  hoveredTime: number | null;
  setHoveredTime: (time: number | null) => void;
  isTwoPhase?: boolean;
}

export const CalibrationChart: React.FC<CalibrationChartProps> = ({
  type,
  data,
  quality,
  hoveredTime,
  setHoveredTime,
  isTwoPhase = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 315, height: 110 });

  // Handle container resize dynamically
  React.useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        // Keep a clinical aspect ratio
        setDimensions({
          width: width || 315,
          height: 110
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const { width, height } = dimensions;

  // Chart padding
  const paddingLeft = 32;
  const paddingRight = 12;
  const paddingTop = 14;
  const paddingBottom = 18;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Scales & Limits
  const minTime = 0;
  const maxTime = 120;

  const minEda = 0;
  const maxEda = 10;

  const minHr = 40;
  const maxHr = 130;

  const getX = (t: number) => {
    return paddingLeft + (t / maxTime) * chartWidth;
  };

  // Convert value to Y coordinate
  const getY = (val: number) => {
    if (type === 'eda') {
      const clamped = Math.max(minEda, Math.min(maxEda, val));
      return paddingTop + chartHeight - (clamped / maxEda) * chartHeight;
    } else {
      const clamped = Math.max(minHr, Math.min(maxHr, val));
      const range = maxHr - minHr;
      return paddingTop + chartHeight - ((clamped - minHr) / range) * chartHeight;
    }
  };

  const activeTime = hoveredTime ?? maxTime;
  const activePoint = data.find((d) => d.time === activeTime) || data[data.length - 1];
  const activeValue = type === 'eda' ? activePoint.eda : activePoint.hr;
  const unit = type === 'eda' ? 'μS' : 'bpm';
  const label = type === 'eda' ? 'Electrodermal Activity (EDA)' : 'Heart Rate (HR)';
  const colorClass = type === 'eda' ? 'text-blue-600 font-semibold' : 'text-emerald-600 font-semibold';

  const visibleData = data;
  let pathD = '';
  if (visibleData.length > 0) {
    pathD = `M ${getX(visibleData[0].time)} ${getY(type === 'eda' ? visibleData[0].eda : visibleData[0].hr)}`;
    for (let i = 1; i < visibleData.length; i++) {
      const pt = visibleData[i];
      const val = type === 'eda' ? pt.eda : pt.hr;
      pathD += ` L ${getX(pt.time)} ${getY(val)}`;
    }
  }

  // Mouse move handler for scrubbing
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    
    // Calculate time based on X coordinate
    const relativeX = clientX - paddingLeft;
    const ratio = Math.max(0, Math.min(1, relativeX / chartWidth));
    const rawTime = ratio * maxTime;
    
    // Snap to nearest integer second (0 to playProgress)
    const snappedTime = Math.round(rawTime);
    if (snappedTime >= 0 && snappedTime <= maxTime) {
      setHoveredTime(snappedTime);
    } else {
      setHoveredTime(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredTime(null);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches[0].clientX - rect.left;
    
    const relativeX = clientX - paddingLeft;
    const ratio = Math.max(0, Math.min(1, relativeX / chartWidth));
    const rawTime = ratio * maxTime;
    
    const snappedTime = Math.round(rawTime);
    if (snappedTime >= 0 && snappedTime <= maxTime) {
      setHoveredTime(snappedTime);
    } else {
      setHoveredTime(null);
    }
  };

  // Phase coordinates
  const x0 = getX(0);
  const x30 = getX(30);
  const x75 = getX(75);
  const x120 = getX(120);

  // Border styles for normal vs abnormal
  const cardBorderClass =
    quality === 'abnormal'
      ? 'border border-amber-300 shadow-[0_2px_12px_rgba(217,119,6,0.08)] bg-amber-50/10'
      : quality === 'rising'
      ? 'border border-rose-200 shadow-[0_2px_12px_rgba(244,63,94,0.06)] bg-rose-50/10'
      : quality === 'plateau'
      ? 'border border-sky-200 shadow-[0_2px_12px_rgba(14,165,233,0.05)] bg-sky-50/10'
      : 'border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white';

  return (
    <div
      ref={containerRef}
      className={`p-3 rounded-2xl transition-all duration-300 ${cardBorderClass}`}
    >
      {/* Mini metric header: only label + value, no long titles */}
      <div className="flex items-baseline justify-between mb-1 px-1">
        <span className="text-[12px] font-medium text-slate-500 tracking-wide">
          {label}
        </span>
        <div className="flex items-baseline space-x-1">
          <span className={`text-lg font-mono tracking-tight font-bold ${colorClass}`}>
            {activeValue.toFixed(type === 'eda' ? 2 : 1)}
          </span>
          <span className="text-[10px] text-slate-400 font-mono font-medium">{unit}</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative select-none" style={{ height }}>
        <svg
          width="100%"
          height={height}
          className="overflow-visible cursor-crosshair touch-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseLeave}
        >
          {/* Phase Background Bands */}
          {/* 1. Rest 0–30s: Light Blue */}
          <rect
            x={x0}
            y={paddingTop}
            width={x30 - x0}
            height={chartHeight}
            fill="#e0f2fe"
            fillOpacity="0.45"
            rx="2"
          />

          {/* 2. Coherence (30–120s or 75-120s) */}
          {isTwoPhase ? (
            <rect
              x={x30}
              y={paddingTop}
              width={x120 - x30}
              height={chartHeight}
              fill="#dcfce7"
              fillOpacity="0.45"
              rx="2"
            />
          ) : (
            <>
              {/* Stroop 30–75s: Light Red */}
              <rect
                x={x30}
                y={paddingTop}
                width={x75 - x30}
                height={chartHeight}
                fill="#fee2e2"
                fillOpacity="0.45"
                rx="2"
              />
              {/* Coherence 75–120s: Light Green */}
              <rect
                x={x75}
                y={paddingTop}
                width={x120 - x75}
                height={chartHeight}
                fill="#dcfce7"
                fillOpacity="0.45"
                rx="2"
              />
            </>
          )}

          {/* Phase labels inside background band margins */}
          <text
            x={x0 + (x30 - x0) / 2}
            y={paddingTop + 11}
            textAnchor="middle"
            className="text-[9px] font-medium fill-sky-600/90 pointer-events-none"
          >
            Rest 0-30s
          </text>
          {isTwoPhase ? (
            <text
              x={x30 + (x120 - x30) / 2}
              y={paddingTop + 11}
              textAnchor="middle"
              className="text-[9px] font-medium fill-emerald-600/90 pointer-events-none"
            >
              Resonance Breathing 30-120s
            </text>
          ) : (
            <>
              <text
                x={x30 + (x75 - x30) / 2}
                y={paddingTop + 11}
                textAnchor="middle"
                className="text-[9px] font-medium fill-rose-600/90 pointer-events-none"
              >
                Stroop 30-75s
              </text>
              <text
                x={x75 + (x120 - x75) / 2}
                y={paddingTop + 11}
                textAnchor="middle"
                className="text-[9px] font-medium fill-emerald-600/90 pointer-events-none"
              >
                Coherence 75-120s
              </text>
            </>
          )}

          {/* Horizontal Grid lines */}
          {type === 'eda' ? (
            // EDA grid values (e.g. 2.0, 5.0, 8.0)
            [2, 5, 8].map((val) => (
              <g key={val} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={getY(val)}
                  x2={width - paddingRight}
                  y2={getY(val)}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <text
                  x={paddingLeft - 6}
                  y={getY(val) + 3}
                  textAnchor="end"
                  className="text-[8px] font-mono fill-slate-400 pointer-events-none"
                >
                  {val}
                </text>
              </g>
            ))
          ) : (
            // HR grid values (e.g. 60, 80, 100, 120)
            [60, 80, 100, 120].map((val) => (
              <g key={val} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={getY(val)}
                  x2={width - paddingRight}
                  y2={getY(val)}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <text
                  x={paddingLeft - 6}
                  y={getY(val) + 3}
                  textAnchor="end"
                  className="text-[8px] font-mono fill-slate-400 pointer-events-none"
                >
                  {val}
                </text>
              </g>
            ))
          )}

          {/* Vertical phase boundaries */}
          <line
            x1={x30}
            y1={paddingTop}
            x2={x30}
            y2={paddingTop + chartHeight}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          {!isTwoPhase && (
            <line
              x1={x75}
              y1={paddingTop}
              x2={x75}
              y2={paddingTop + chartHeight}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
          )}

          {/* X Axis boundary line */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={width - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="#cbd5e1"
            strokeWidth="1"
          />

          {/* X Axis Labels */}
          {(isTwoPhase ? [0, 30, 120] : [0, 30, 75, 120]).map((t) => (
            <text
              key={t}
              x={getX(t)}
              y={paddingTop + chartHeight + 11}
              textAnchor={t === 0 ? 'start' : t === 120 ? 'end' : 'middle'}
              className="text-[8px] font-mono fill-slate-400 pointer-events-none font-medium"
            >
              {t}s
            </text>
          ))}

          {/* The Main Signal Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={type === 'eda' ? '#2563eb' : '#059669'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-75"
            />
          )}

          {/* Interactive cursor lines and dots */}
          {hoveredTime !== null && (
            <>
              {/* Vertical dotted scrub line */}
              <line
                x1={getX(activeTime)}
                y1={paddingTop}
                x2={getX(activeTime)}
                y2={paddingTop + chartHeight}
                stroke="#64748b"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                className="pointer-events-none"
              />

              {/* Indicator pulse dot on the line */}
              <circle
                cx={getX(activeTime)}
                cy={getY(activeValue)}
                r="4.5"
                fill={type === 'eda' ? '#2563eb' : '#059669'}
                stroke="#ffffff"
                strokeWidth="1.5"
                className="pointer-events-none shadow-sm"
              />
            </>
          )}
        </svg>

        {/* Warning Indicator Overlay Badge for Anomalous Signals */}
        {quality === 'abnormal' && (
          <div className="absolute top-2 right-2 flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 text-[8px] font-semibold uppercase tracking-wide border border-amber-500/20 pointer-events-none animate-pulse">
            <span>⚠ Signal interference</span>
          </div>
        )}
        {quality === 'rising' && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700 text-[8px] font-semibold border border-rose-500/20 pointer-events-none">
            ↑ Still rising
          </div>
        )}
        {quality === 'plateau' && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-700 text-[8px] font-semibold border border-sky-500/20 pointer-events-none">
            — Plateau
          </div>
        )}
      </div>
    </div>
  );
};
