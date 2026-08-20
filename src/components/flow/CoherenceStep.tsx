import React, { useState, useEffect } from 'react';
import { Wind, Play } from 'lucide-react';

interface CoherenceStepProps {
  onComplete: () => void;
}

const DURATION = 30;

export const CoherenceStep: React.FC<CoherenceStepProps> = ({ onComplete }) => {
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!started || elapsed >= DURATION) {
      if (started && elapsed >= DURATION) onComplete();
      return;
    }
    const t = setTimeout(() => setElapsed((e) => e + 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, elapsed]);

  const handleStart = () => {
    setStarted(true);
    setElapsed(0);
  };

  if (!started) {
    return (
      <div className="relative flex flex-col min-h-[620px] overflow-hidden bg-[#f6f8fb]">
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center pb-10">
          <div className="relative w-28 h-28 flex items-center justify-center mb-5">
            <div className="absolute inset-0 rounded-full breathing-orb opacity-80" />
            <div className="relative w-14 h-14 rounded-full bg-white/80 border border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Wind className="w-7 h-7 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">Resonance breathing</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-[285px] mb-5">
            Follow the circle to slow your breathing and help your body recover.
          </p>
          <div className="w-full max-w-[280px] grid grid-cols-2 gap-2 mb-7">
            <div className="rounded-xl bg-white border border-emerald-100 px-3 py-3">
              <p className="text-xs font-semibold text-emerald-700">Circle expands</p>
              <p className="text-[11px] text-slate-500 mt-1">Breathe in slowly</p>
            </div>
            <div className="rounded-xl bg-white border border-emerald-100 px-3 py-3">
              <p className="text-xs font-semibold text-emerald-700">Circle shrinks</p>
              <p className="text-[11px] text-slate-500 mt-1">Breathe out slowly</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="w-full max-w-[280px] py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start training</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-4">About 30 seconds</p>
        </div>
      </div>
    );
  }

  const progress = Math.min(100, (elapsed / DURATION) * 100);

  return (
    <div className="relative flex flex-col min-h-[620px] overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950">
      <div className="relative z-10 flex flex-col h-full min-h-[620px]">
        <div className="px-5 pt-4">
          <div className="flex justify-between items-center text-white/90 text-[11px] font-medium mb-2">
            <span>Breathing training</span>
            <span className="font-mono tabular-nums">{DURATION - elapsed}s</span>
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/90 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-44 h-44 rounded-full breathing-orb" />
        </div>

        <div className="px-5 pb-8 text-center">
          <p className="text-white text-sm font-medium drop-shadow-md">Expand: inhale · Shrink: exhale</p>
          <p className="text-white/60 text-[11px] mt-1">Relax your shoulders, stay natural</p>
        </div>
      </div>
    </div>
  );
};
