import React from 'react';

interface ConnectStepProps {
  onContinue: () => void;
  onSkip: () => void;
}

export const ConnectStep: React.FC<ConnectStepProps> = ({ onContinue, onSkip }) => (
  <div className="flex flex-col min-h-[620px] bg-[#f4f4f5]">
    <div className="flex-1 flex flex-col px-6 pt-6 pb-5">
      <h2 className="text-[26px] font-bold text-slate-900 tracking-tight leading-tight mb-3">
        Put on your ring
      </h2>
      <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
        Wear the ring with the three dots facing your palm for optimal sensor performance and data
        accuracy.
      </p>

      <div className="flex-1 flex items-center justify-center py-2">
        <img
          src={`${import.meta.env.BASE_URL}ring-hand.png`}
          alt="Hand wearing smart ring"
          className="w-full max-w-[260px] h-auto object-contain select-none"
          draggable={false}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4">
        <button
          type="button"
          onClick={onSkip}
          className="py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="py-3.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
);
