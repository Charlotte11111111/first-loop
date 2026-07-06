import React, { useState, useEffect } from 'react';

interface RestStepProps {
  onComplete: () => void;
}

const DURATION = 30;

export const RestStep: React.FC<RestStepProps> = ({ onComplete }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (elapsed >= DURATION) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setElapsed((e) => e + 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed]);

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
