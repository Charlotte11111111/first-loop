import React, { useState, useEffect } from 'react';
import { ChevronLeft, MoreHorizontal, ShieldCheck, HelpCircle, AlertTriangle } from 'lucide-react';
import { ActivePreview, DataPoint } from '../types';
import { CalibrationChart } from './CalibrationChart';

interface IPhoneFrameProps {
  preview: ActivePreview;
  data: DataPoint[];
  hoveredTime: number | null;
  setHoveredTime: (time: number | null) => void;
  onPrimaryClick: () => void;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  preview,
  data,
  hoveredTime,
  setHoveredTime,
  onPrimaryClick,
}) => {
  const [timeStr, setTimeStr] = useState('19:53');
  const { copy, signal, isTwoPhase, outcome } = preview;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderStatusIcon = () => {
    switch (outcome) {
      case 'positive':
        return (
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 mb-3 animate-fade-in">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
          </div>
        );
      case 'neutral':
        return (
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-3 animate-fade-in">
            <HelpCircle className="w-7 h-7 text-slate-500" />
          </div>
        );
      case 'negative':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100 mb-3 animate-pulse">
            <AlertTriangle className="w-7 h-7 text-amber-600" />
          </div>
        );
    }
  };

  return (
    <div className="relative mx-auto select-none" style={{ width: '375px', height: '812px' }}>
      <div className="absolute inset-0 bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
        <div className="relative flex-1 bg-[#f6f8fb] rounded-[38px] overflow-hidden flex flex-col text-slate-800 select-none">
          <div className="h-11 px-6 pt-3 flex items-center justify-between z-30 bg-[#f6f8fb] text-slate-900 text-xs font-semibold">
            <span className="font-mono text-[13px] tracking-tight">{timeStr}</span>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-[19px] bg-black rounded-full z-40" />
            <div className="w-5 h-3 border border-slate-900 rounded-[3px] p-[1px]">
              <div className="bg-slate-900 h-full rounded-[1px] w-[80%]" />
            </div>
          </div>

          <div className="h-11 px-4 flex items-center justify-between border-b border-slate-100/60 bg-[#f6f8fb] z-20">
            <ChevronLeft className="w-5.5 h-5.5 text-slate-600" />
            <span className="text-sm font-semibold text-slate-800 tracking-wide">Calibration</span>
            <MoreHorizontal className="w-5.5 h-5.5 text-slate-600" />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 no-scrollbar flex flex-col space-y-3 z-10">
            <CalibrationChart
              type="eda"
              data={data}
              quality={signal.edaQuality}
              hoveredTime={hoveredTime}
              setHoveredTime={setHoveredTime}
              isTwoPhase={isTwoPhase}
            />
            <CalibrationChart
              type="hr"
              data={data}
              quality={signal.hrQuality}
              hoveredTime={hoveredTime}
              setHoveredTime={setHoveredTime}
              isTwoPhase={isTwoPhase}
            />

            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-100/60 flex flex-col items-center text-center animate-fade-in">
              {renderStatusIcon()}
              <h3 className="text-[16px] font-bold text-slate-900 leading-tight mb-2 px-1">{copy.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 text-justify">{copy.body}</p>
              <div className="w-full space-y-2 mt-2">
                <button
                  onClick={onPrimaryClick}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-300 shadow-sm cursor-pointer
                    ${outcome === 'positive'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.98]'
                      : outcome === 'negative'
                        ? 'bg-amber-600 hover:bg-amber-700 text-white active:scale-[0.98]'
                        : 'bg-slate-800 hover:bg-slate-950 text-white active:scale-[0.98]'
                    }`}
                >
                  {copy.primaryButtonText}
                </button>
                {copy.secondaryButtonText && (
                  <button
                    onClick={onPrimaryClick}
                    className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    {copy.secondaryButtonText}
                  </button>
                )}
              </div>
            </div>
            <div className="h-6" />
          </div>

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-950 rounded-full z-30 opacity-70" />
        </div>
      </div>
    </div>
  );
};
