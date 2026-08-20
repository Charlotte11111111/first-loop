import React, { useState, useEffect } from 'react';
import { Play, Waves } from 'lucide-react';

interface RestStepProps {
  onComplete: () => void;
}

const DURATION = 30;

export const RestStep: React.FC<RestStepProps> = ({ onComplete }) => {
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!started) return;
    if (elapsed >= DURATION) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setElapsed((e) => e + 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, elapsed]);

  if (!started) {
    return (
      <div className="flex flex-col min-h-[580px] pb-8 bg-[#f6f8fb]">
        <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-200 flex items-center justify-center mb-5">
            <Waves className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
            Get ready for your rest baseline
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-[285px] mb-6">
            We’ll first measure your signals while your body is at rest.
          </p>
          <div className="w-full max-w-[300px] rounded-2xl bg-white border border-slate-100 p-4 text-left space-y-3 mb-8 shadow-sm">
            <p className="text-xs text-slate-700"><span className="font-semibold text-blue-600">01</span> Breathe evenly and naturally</p>
            <p className="text-xs text-slate-700"><span className="font-semibold text-blue-600">02</span> Rest your wrist on the table</p>
            <p className="text-xs text-slate-700"><span className="font-semibold text-blue-600">03</span> Keep still and avoid talking</p>
          </div>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="w-full max-w-[300px] py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start rest measurement</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-4">Stay still for 30 seconds</p>
        </div>
      </div>
    );
  }

  const remaining = DURATION - elapsed;
  const ringProgress = (elapsed / DURATION) * 100;

  return (
    <div className="flex flex-col min-h-[580px] pb-8">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-8">
        <div className="relative w-36 h-36 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="6" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#2563eb"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(ringProgress / 100) * 327} 327`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-semibold text-slate-900 tabular-nums tracking-tight">
              {remaining}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">sec</span>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">Rest baseline</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-[260px]">
          Stay relaxed and breathe naturally. Avoid talking or large movements.
        </p>
      </div>
    </div>
  );
};
