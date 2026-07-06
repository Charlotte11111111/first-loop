import React, { useState, useEffect, useCallback, useRef } from 'react';

interface StroopStepProps {
  onComplete: () => void;
}

const COLORS = [
  { name: 'Red', hex: '#ef4444', label: 'Red' },
  { name: 'Blue', hex: '#3b82f6', label: 'Blue' },
  { name: 'Green', hex: '#22c55e', label: 'Green' },
  { name: 'Yellow', hex: '#eab308', label: 'Yellow' },
];

const TOTAL_QUESTIONS = 10;
const SECONDS_PER_QUESTION = 5;

function pickTrial() {
  const wordIdx = Math.floor(Math.random() * COLORS.length);
  let colorIdx = Math.floor(Math.random() * COLORS.length);
  while (colorIdx === wordIdx) {
    colorIdx = Math.floor(Math.random() * COLORS.length);
  }
  return { word: COLORS[wordIdx], ink: COLORS[colorIdx] };
}

export const StroopStep: React.FC<StroopStepProps> = ({ onComplete }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [trial, setTrial] = useState(pickTrial);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const lockedRef = useRef(false);

  const advanceQuestion = useCallback(
    (correct: boolean | null) => {
      if (lockedRef.current) return;
      lockedRef.current = true;

      if (correct !== null) {
        setScore((s) => s + (correct ? 1 : 0));
        setFeedback(correct ? '✓' : '✗');
      }

      const delay = correct !== null ? 350 : 0;
      setTimeout(() => {
        const next = questionIndex + 1;
        if (next >= TOTAL_QUESTIONS) {
          onComplete();
          return;
        }
        setQuestionIndex(next);
        setTimeLeft(SECONDS_PER_QUESTION);
        setTrial(pickTrial());
        setFeedback(null);
        lockedRef.current = false;
      }, delay);
    },
    [questionIndex, onComplete]
  );

  useEffect(() => {
    if (lockedRef.current || feedback) return;

    if (timeLeft <= 0) {
      advanceQuestion(null);
      return;
    }

    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, feedback, advanceQuestion]);

  const handleAnswer = (color: (typeof COLORS)[0]) => {
    if (lockedRef.current || feedback) return;
    advanceQuestion(color.name === trial.ink.name);
  };

  const questionProgress =
    ((questionIndex + (SECONDS_PER_QUESTION - timeLeft) / SECONDS_PER_QUESTION) / TOTAL_QUESTIONS) *
    100;

  return (
    <div className="flex flex-col pb-6">
      <div className="mx-4 mt-3 px-3 py-2.5 bg-white rounded-xl border border-slate-100">
        <div className="flex justify-between text-[10px] mb-1.5">
          <span className="text-slate-500 font-medium">Reaction challenge</span>
          <span className="font-mono text-slate-700 font-bold tabular-nums">
            Q{questionIndex + 1}/{TOTAL_QUESTIONS} · {timeLeft}s
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, questionProgress)}%` }}
          />
        </div>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < questionIndex
                  ? 'bg-blue-500'
                  : i === questionIndex
                    ? 'bg-blue-300'
                    : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mx-4 mt-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
        <p className="text-xs text-slate-400 mb-4">Pick the ink color, not the word meaning</p>
        <p
          className="text-4xl font-bold mb-2 transition-opacity duration-200 tracking-tight"
          style={{ color: trial.ink.hex, opacity: feedback ? 0.5 : 1 }}
        >
          {trial.word.name}
        </p>
        {feedback && (
          <p className={`text-lg font-semibold ${feedback === '✓' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {feedback}
          </p>
        )}
      </div>

      <div className="mx-4 mt-4 grid grid-cols-2 gap-2.5">
        {COLORS.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => handleAnswer(c)}
            disabled={!!feedback || lockedRef.current}
            className="py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-medium text-sm transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: c.hex }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-5 tabular-nums">
        {score} correct · up to {TOTAL_QUESTIONS * SECONDS_PER_QUESTION}s
      </p>
    </div>
  );
};
