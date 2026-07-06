export type FlowPath = 'A' | 'B' | 'C';

export type FlowStepId =
  | 'register'
  | 'consent'
  | 'rest'
  | 'emotion'
  | 'stroop'
  | 'coherence'
  | 'results'
  | 'home';

export type StepStatus = 'pending' | 'active' | 'completed' | 'skipped';

export interface FlowNode {
  id: FlowStepId;
  label: string;
  shortLabel: string;
  duration?: string;
  paths: FlowPath[];
}

export const FLOW_NODES: FlowNode[] = [
  { id: 'register', label: 'Link & register device', shortLabel: 'Register', paths: ['A', 'B', 'C'] },
  { id: 'consent', label: 'Join the experience?', shortLabel: 'Consent', paths: ['A', 'B', 'C'] },
  { id: 'rest', label: 'Rest baseline', shortLabel: 'Rest 30s', duration: '30s', paths: ['A', 'B'] },
  { id: 'emotion', label: 'Subjective emotional shift', shortLabel: 'Emotion', paths: ['A', 'B'] },
  { id: 'stroop', label: 'Stroop reaction challenge', shortLabel: 'Stroop', duration: '50s', paths: ['A'] },
  { id: 'coherence', label: 'Coherence breathing training', shortLabel: 'Breathing', duration: '30s', paths: ['A', 'B'] },
  { id: 'results', label: 'Before / during / after comparison', shortLabel: 'Results', paths: ['A', 'B'] },
  { id: 'home', label: 'Go to Home', shortLabel: 'Home', paths: ['A', 'B', 'C'] },
];

export const PATH_META: Record<
  FlowPath,
  { title: string; subtitle: string; duration: string; description: string }
> = {
  A: {
    title: 'Path A',
    subtitle: 'Full Detect → Act → Confirm',
    duration: '~4 min',
    description: 'No emotional shift → Stroop stress → breathing recovery → results',
  },
  B: {
    title: 'Path B',
    subtitle: 'Detect → Act → Confirm',
    duration: '~3.5 min',
    description: 'Emotional shift → skip Stroop → breathing recovery → results',
  },
  C: {
    title: 'Path C',
    subtitle: 'Minimal flow',
    duration: '~1 min',
    description: 'Skip experience → go straight to Home',
  },
};

export function getStepsForPath(path: FlowPath): FlowStepId[] {
  switch (path) {
    case 'A':
      return ['register', 'consent', 'rest', 'emotion', 'stroop', 'coherence', 'results', 'home'];
    case 'B':
      return ['register', 'consent', 'rest', 'emotion', 'coherence', 'results', 'home'];
    case 'C':
      return ['register', 'consent', 'home'];
  }
}

export function getNextStep(path: FlowPath, current: FlowStepId): FlowStepId | null {
  const steps = getStepsForPath(path);
  const idx = steps.indexOf(current);
  if (idx === -1 || idx >= steps.length - 1) return null;
  return steps[idx + 1];
}

export function resolvePathAfterEmotion(hasEmotion: boolean): 'A' | 'B' {
  return hasEmotion ? 'B' : 'A';
}
