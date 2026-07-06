import React from 'react';
import { Activity, Heart, Moon, Home, Sparkles } from 'lucide-react';

interface HomeStepProps {
  skippedFlow: boolean;
  completedFlow: boolean;
}

export const HomeStep: React.FC<HomeStepProps> = ({ skippedFlow, completedFlow }) => (
  <div className="flex flex-col pb-8">
    <div className="px-4 pt-4 pb-3">
      <p className="text-xs text-slate-400">Good evening</p>
      <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
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

    <div className="mx-4 grid grid-cols-2 gap-2 mb-4">
      {[
        { icon: Activity, label: 'Stress', value: completedFlow ? 'Low' : '—', color: 'text-blue-600' },
        { icon: Heart, label: 'HR', value: completedFlow ? '74' : '—', color: 'text-emerald-600' },
        { icon: Moon, label: 'Sleep', value: '—', color: 'text-indigo-600' },
        { icon: Home, label: 'Recovery', value: completedFlow ? 'Tracking' : 'Pending', color: 'text-amber-600' },
      ].map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
          <Icon className={`w-4 h-4 ${color} mb-2`} />
          <p className="text-[10px] text-slate-400">{label}</p>
          <p className="text-sm font-bold text-slate-800">{value}</p>
        </div>
      ))}
    </div>

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
