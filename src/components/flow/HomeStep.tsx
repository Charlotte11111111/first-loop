import React from 'react';
import { Sparkles } from 'lucide-react';
import { EnergyBudgetChart } from './EnergyBudgetChart';

interface HomeStepProps {
  skippedFlow: boolean;
  completedFlow: boolean;
}

export const HomeStep: React.FC<HomeStepProps> = ({ skippedFlow, completedFlow }) => (
  <div className="flex flex-col pb-8">
    <div className="px-4 pt-4 pb-3 flex items-start justify-between">
      <div>
        <p className="text-xs text-slate-400">Good evening</p>
        <h2 className="text-xl font-bold text-slate-900">Energy</h2>
      </div>
    </div>

    {completedFlow && (
      <div className="mx-4 mb-3 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
        <p className="text-[10px] text-emerald-700 leading-snug">
          First Loop complete · Initial baseline saved. Check Home later for delayed EDA response.
        </p>
      </div>
    )}

    {skippedFlow && (
      <div className="mx-4 mb-3 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-[10px] text-slate-500 leading-snug">
          You skipped the experience · You can start it anytime from Settings.
        </p>
      </div>
    )}

    {completedFlow && (
      <div className="mx-4 mb-3 px-3.5 py-3 rounded-2xl bg-[#f7f1e8] border border-[#efe6d8]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-[10px] font-bold">
            ↻
          </span>
          <span className="text-[12px] font-semibold text-orange-500">Repair</span>
          <span className="text-[11px] text-slate-400">Recovery Restoration Day</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Avoid strenuous exercise today, and remember to take short walks during breaks from meetings.
        </p>
      </div>
    )}

    <EnergyBudgetChart />

    <div className="mx-4 p-4 bg-white rounded-2xl border border-slate-100">
      <p className="text-xs font-bold text-slate-700 mb-2">Today</p>
      <div className="h-24 bg-slate-50 rounded-xl flex items-center justify-center">
        <p className="text-[10px] text-slate-400 px-4 text-center">
          {completedFlow
            ? 'Delayed EDA response will keep updating…'
            : 'Complete First Loop to unlock more insights'}
        </p>
      </div>
    </div>

    <div className="mx-4 mt-6 flex justify-center space-x-8 pt-2 border-t border-slate-100">
      {['Home', 'Trends', 'Coach', 'Profile'].map((tab, i) => (
        <div key={tab} className={`text-[10px] font-medium ${i === 0 ? 'text-blue-600' : 'text-slate-400'}`}>
          {tab}
        </div>
      ))}
    </div>
  </div>
);
