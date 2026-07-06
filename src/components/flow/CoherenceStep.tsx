import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play } from 'lucide-react';

interface CoherenceStepProps {
  onComplete: () => void;
}

const DURATION = 30;
const COHERENCE_VIDEO =
  'https://testonline-image.vesync.com/hbiz/behavior/v1/video/HRV_coherence.mp4';

export const CoherenceStep: React.FC<CoherenceStepProps> = ({ onComplete }) => {
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [useVideo, setUseVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setUseVideo(false));
    }
  };

  if (!started) {
    return (
      <div className="relative flex flex-col min-h-[620px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {useVideo ? (
            <video
              className="w-full h-full object-cover opacity-30 blur-[2px] scale-105"
              src={COHERENCE_VIDEO}
              muted
              playsInline
              preload="metadata"
              onError={() => setUseVideo(false)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-emerald-900/20 to-slate-900/10" />
          )}
          <div className="absolute inset-0 bg-[#f6f8fb]/85" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center pb-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-200 flex items-center justify-center mb-5">
            <Wind className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">Resonance breathing</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-[280px] mb-8">
            Follow the rhythm on screen and breathe slowly to help your body recover.
          </p>
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
    <div className="relative flex flex-col min-h-[620px] overflow-hidden bg-black">
      {useVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={COHERENCE_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setUseVideo(false)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-emerald-950 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-2 border-emerald-400/50 animate-breathe bg-emerald-400/10" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

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

        <div className="flex-1" />

        <div className="px-5 pb-8 text-center">
          <p className="text-white text-sm font-medium drop-shadow-md">Follow the rhythm, breathe slowly</p>
          <p className="text-white/60 text-[11px] mt-1">Relax your shoulders, stay natural</p>
        </div>
      </div>
    </div>
  );
};
