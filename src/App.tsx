import React, { useState } from 'react';
import { Activity, RotateCcw, Bell } from 'lucide-react';
import { FlowPath, FlowStepId, resolvePathAfterEmotion } from './flow/config';
import { ClickableNodeId, getDemoContextForStep, resolveBackStep } from './flow/graph';
import { FlowChart } from './components/FlowChart';
import { FlowDemoFrame } from './components/FlowDemoFrame';
import { ConsentStep } from './components/flow/ConsentStep';
import { RestStep } from './components/flow/RestStep';
import { EmotionStep } from './components/flow/EmotionStep';
import { StroopStep } from './components/flow/StroopStep';
import { CoherenceStep } from './components/flow/CoherenceStep';
import { FlowResultsStep } from './components/flow/FlowResultsStep';
import { HomeStep } from './components/flow/HomeStep';

const STEP_TITLES: Record<FlowStepId, string> = {
  register: 'Setup',
  consent: 'First Loop',
  rest: 'Rest baseline',
  emotion: 'Emotion check-in',
  stroop: 'Stroop challenge',
  coherence: 'Breathing training',
  results: 'Results',
  home: 'Home',
};

export default function App() {
  const [activePath, setActivePath] = useState<FlowPath | null>(null);
  const [currentStep, setCurrentStep] = useState<FlowStepId>('consent');
  const [completedSteps, setCompletedSteps] = useState<FlowStepId[]>(['register']);
  const [skippedSteps, setSkippedSteps] = useState<FlowStepId[]>([]);
  const [hadStroop, setHadStroop] = useState(false);
  const [skippedFlow, setSkippedFlow] = useState(false);
  const [flowKey, setFlowKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const bumpFlow = () => setFlowKey((k) => k + 1);

  const markComplete = (step: FlowStepId) => {
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  };

  const applyContext = (ctx: ReturnType<typeof getDemoContextForStep>) => {
    setCurrentStep(ctx.step);
    setActivePath(ctx.activePath);
    setHadStroop(ctx.hadStroop);
    setSkippedFlow(ctx.skippedFlow);
    setSkippedSteps(ctx.skippedSteps);
    setCompletedSteps(ctx.completedSteps);
    bumpFlow();
  };

  const handleNodeClick = (nodeId: ClickableNodeId) => {
    const ctx = getDemoContextForStep(nodeId);
    applyContext(ctx);
    showToast(`Go to: ${STEP_TITLES[ctx.step] ?? nodeId}`);
  };

  const handleBack = () => {
    const prev = resolveBackStep(currentStep, hadStroop, skippedFlow);
    if (!prev) return;
    const ctx = getDemoContextForStep(prev);
    applyContext({ ...ctx, step: prev });
    showToast(`Back: ${STEP_TITLES[prev]}`);
  };

  const backStep = resolveBackStep(currentStep, hadStroop, skippedFlow);
  const showBack = backStep !== null;

  const handleConsentAccept = () => {
    setActivePath(null);
    setSkippedFlow(false);
    setSkippedSteps([]);
    setHadStroop(false);
    markComplete('consent');
    setCurrentStep('rest');
    bumpFlow();
    showToast('Starting rest baseline');
  };

  const handleConsentSkip = () => {
    applyContext(getDemoContextForStep('consent_skip'));
    showToast('Going to Home');
  };

  const handleRestComplete = () => {
    markComplete('rest');
    setCurrentStep('emotion');
    bumpFlow();
  };

  const handleEmotionSelect = (hasEmotion: boolean) => {
    const path = resolvePathAfterEmotion(hasEmotion);
    setActivePath(path);
    setHadStroop(!hasEmotion);
    if (hasEmotion) setSkippedSteps((p) => [...new Set([...p, 'stroop'])]);
    else setSkippedSteps((p) => p.filter((s) => s !== 'stroop'));
    markComplete('emotion');
    setCurrentStep(hasEmotion ? 'coherence' : 'stroop');
    bumpFlow();
  };

  const handleStroopComplete = () => {
    markComplete('stroop');
    setCurrentStep('coherence');
    bumpFlow();
  };

  const handleCoherenceComplete = () => {
    markComplete('coherence');
    setCurrentStep('results');
    bumpFlow();
  };

  const handleResultsContinue = () => {
    markComplete('results');
    setCurrentStep('home');
    showToast('Going to Home');
  };

  const handleRetryExperience = () => {
    setSkippedFlow(false);
    setCompletedSteps(['register', 'consent']);
    setSkippedSteps([]);
    setCurrentStep('rest');
    bumpFlow();
    showToast('Try again · Rest baseline');
  };

  const handleReset = () => {
    applyContext(getDemoContextForStep('consent'));
    setCompletedSteps(['register']);
    setSkippedSteps([]);
    showToast('Flow reset');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'consent':
        return <ConsentStep onAccept={handleConsentAccept} onSkip={handleConsentSkip} />;
      case 'rest':
        return <RestStep key={`rest-${flowKey}`} onComplete={handleRestComplete} />;
      case 'emotion':
        return <EmotionStep onSelect={handleEmotionSelect} />;
      case 'stroop':
        return <StroopStep key={`stroop-${flowKey}`} onComplete={handleStroopComplete} />;
      case 'coherence':
        return (
          <CoherenceStep key={`coh-${flowKey}`} onComplete={handleCoherenceComplete} />
        );
      case 'results':
        return (
          <FlowResultsStep
            key={`res-${flowKey}`}
            hadStroop={hadStroop}
            onContinue={handleResultsContinue}
            onRetry={handleRetryExperience}
          />
        );
      case 'home':
        return (
          <HomeStep
            skippedFlow={skippedFlow}
            completedFlow={!skippedFlow && completedSteps.includes('results')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800 flex flex-col font-sans">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900/95 text-xs font-semibold text-white flex items-center space-x-2 shadow-xl">
          <Bell className="w-3.5 h-3.5 text-blue-400" />
          <span>{toast}</span>
        </div>
      )}

      <header className="border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-slate-900 tracking-tight">First Loop Flow Demo</h1>
            <p className="text-[11px] text-slate-400">Click the flowchart · App preview on the right</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
        <aside className="lg:col-span-5 xl:col-span-4 border-r border-slate-200 bg-white px-6 py-5 flex flex-col min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-hidden">
          <FlowChart
            activePath={activePath}
            currentStep={currentStep}
            completedSteps={completedSteps}
            skippedSteps={skippedSteps}
            skippedFlow={skippedFlow}
            onNodeClick={handleNodeClick}
          />
        </aside>

        <main className="lg:col-span-7 xl:col-span-8 bg-[#eef2f7] flex items-center justify-center p-6 overflow-y-auto min-h-[600px]">
          <FlowDemoFrame title={STEP_TITLES[currentStep]} showBack={showBack} onBack={handleBack}>
            {renderStep()}
          </FlowDemoFrame>
        </main>
      </div>
    </div>
  );
}
