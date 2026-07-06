import React from 'react';

interface EmotionStepProps {
  onSelect: (hasEmotion: boolean) => void;
}

export const EmotionStep: React.FC<EmotionStepProps> = ({ onSelect }) => (
  <div className="flex flex-col min-h-[580px] pb-8">
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
      <h2 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight leading-snug max-w-[280px]">
        Did you notice any emotional shift during rest?
      </h2>
      <p className="text-sm text-slate-500 leading-relaxed mb-10 max-w-[280px]">
        Choose what best matches how you felt.
      </p>

      <div className="w-full space-y-3 max-w-[300px]">
        <button
          type="button"
          onClick={() => onSelect(false)}
          className="w-full py-4 px-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-sm font-medium text-slate-800 transition-all cursor-pointer active:scale-[0.98] shadow-sm"
        >
          No noticeable shift
        </button>
        <button
          type="button"
          onClick={() => onSelect(true)}
          className="w-full py-4 px-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-sm font-medium text-slate-800 transition-all cursor-pointer active:scale-[0.98] shadow-sm"
        >
          Yes, I felt a shift
        </button>
      </div>
    </div>
  </div>
);
