import { FlowStepId } from './config';

export type ClickableNodeId = FlowStepId | 'invite_skip' | 'home_c';

export const PREVIOUS_STEP: Partial<Record<FlowStepId, FlowStepId>> = {
  connect: 'register',
  invite: 'connect',
  rest: 'invite',
  emotion: 'rest',
  stroop: 'emotion',
  coherence: 'stroop',
  results: 'coherence',
  home: 'results',
};

export function resolveBackStep(
  current: FlowStepId,
  hadStroop: boolean,
  skippedFlow: boolean
): FlowStepId | null {
  if (current === 'register' || current === 'connect') return null;
  if (current === 'home') return skippedFlow ? null : 'results';
  if (current === 'coherence') return hadStroop ? 'stroop' : 'emotion';
  return PREVIOUS_STEP[current] ?? null;
}

export function getDemoContextForStep(step: ClickableNodeId): {
  step: FlowStepId;
  activePath: 'A' | 'B' | 'C' | null;
  hadStroop: boolean;
  skippedFlow: boolean;
  skippedSteps: FlowStepId[];
  completedSteps: FlowStepId[];
} {
  const registered = ['register'] as FlowStepId[];

  switch (step) {
    case 'register':
    case 'connect':
      return {
        step: 'connect',
        activePath: null,
        hadStroop: false,
        skippedFlow: false,
        skippedSteps: [],
        completedSteps: registered,
      };
    case 'invite':
      return {
        step: 'invite',
        activePath: null,
        hadStroop: false,
        skippedFlow: false,
        skippedSteps: [],
        completedSteps: [...registered, 'connect'],
      };
    case 'invite_skip':
    case 'home_c':
      return {
        step: 'home',
        activePath: 'C',
        hadStroop: false,
        skippedFlow: true,
        skippedSteps: ['rest', 'emotion', 'stroop', 'coherence', 'results'],
        completedSteps: [...registered, 'connect', 'invite'],
      };
    case 'rest':
      return {
        step: 'rest',
        activePath: null,
        hadStroop: false,
        skippedFlow: false,
        skippedSteps: [],
        completedSteps: [...registered, 'connect', 'invite'],
      };
    case 'emotion':
      return {
        step: 'emotion',
        activePath: null,
        hadStroop: false,
        skippedFlow: false,
        skippedSteps: [],
        completedSteps: [...registered, 'connect', 'invite', 'rest'],
      };
    case 'stroop':
      return {
        step: 'stroop',
        activePath: 'A',
        hadStroop: true,
        skippedFlow: false,
        skippedSteps: [],
        completedSteps: [...registered, 'connect', 'invite', 'rest', 'emotion'],
      };
    case 'coherence':
      return {
        step: 'coherence',
        activePath: 'A',
        hadStroop: true,
        skippedFlow: false,
        skippedSteps: [],
        completedSteps: [...registered, 'connect', 'invite', 'rest', 'emotion', 'stroop'],
      };
    case 'results':
      return {
        step: 'results',
        activePath: 'A',
        hadStroop: true,
        skippedFlow: false,
        skippedSteps: [],
        completedSteps: [
          ...registered,
          'connect',
          'invite',
          'rest',
          'emotion',
          'stroop',
          'coherence',
        ],
      };
    case 'home':
      return {
        step: 'home',
        activePath: 'A',
        hadStroop: true,
        skippedFlow: false,
        skippedSteps: [],
        completedSteps: [
          ...registered,
          'connect',
          'invite',
          'rest',
          'emotion',
          'stroop',
          'coherence',
          'results',
        ],
      };
    default:
      return {
        step: 'connect',
        activePath: null,
        hadStroop: false,
        skippedFlow: false,
        skippedSteps: [],
        completedSteps: registered,
      };
  }
}

export function isNodeActive(
  nodeId: ClickableNodeId,
  currentStep: FlowStepId,
  skippedFlow: boolean
): boolean {
  if (nodeId === 'invite_skip' || nodeId === 'home_c') {
    return skippedFlow && currentStep === 'home';
  }
  if (nodeId === 'home') {
    return !skippedFlow && currentStep === 'home';
  }
  if (nodeId === 'register') {
    return false;
  }
  return nodeId === currentStep;
}

export function isNodeCompleted(
  nodeId: ClickableNodeId,
  completedSteps: FlowStepId[],
  _skippedSteps: FlowStepId[]
): boolean {
  if (nodeId === 'invite_skip') return false;
  if (nodeId === 'register') return true;
  return completedSteps.includes(nodeId as FlowStepId);
}

export function isNodeSkipped(nodeId: ClickableNodeId, skippedSteps: FlowStepId[]): boolean {
  if (nodeId === 'invite_skip') return false;
  return skippedSteps.includes(nodeId as FlowStepId);
}
