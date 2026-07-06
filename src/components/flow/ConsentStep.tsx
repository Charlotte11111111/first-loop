import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ConsentStepProps {
  onAccept: () => void;
  onSkip: () => void;
}

export const ConsentStep: React.FC<ConsentStepProps> = ({ onAccept, onSkip }) => (
  <div className="flex flex-col min-h-[580px] pb-8">
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/15 mb-6">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight leading-snug">
        Complete a body-signal experience
      </h2>
      <p className="text-sm text-slate-500 leading-relaxed mb-10 max-w-[280px]">
        About 3–4 minutes to see how the device reads your body and how training makes a difference.
      </p>

      <div className="w-full space-y-3 max-w-[300px]">
        <button
          type="button"
          onClick={onAccept}
          className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center justify-center space-x-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Get started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="w-full py-3 rounded-2xl text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors cursor-pointer"
        >
          Skip for now, go to Home
        </button>
      </div>
    </div>
  </div>
);
