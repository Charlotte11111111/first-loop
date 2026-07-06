import { CalibrationState, PhaseMode, SignalProfile } from '../types';

/** Four result tabs: Positive | Unchanged (EDA) | Negative (EDA) | Other */
export type ResultTabId = 'positive' | 'unchanged_eda' | 'negative_eda' | 'other';

export interface ResultVariant {
  id: string;
  label: string;
  phases: PhaseMode[];
  signal: SignalProfile;
  title: string;
  body: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
}

export interface ResultTabConfig {
  id: ResultTabId;
  label: string;
  state: CalibrationState;
  variants: ResultVariant[];
}

const POSITIVE_COPY = {
  '3phase': {
    title: 'Your body responded clearly',
    body: 'Skin conductance rose during the task and began to fall after recovery training. Heart rate held a steady rhythm throughout breathing. We captured both stress and recovery.',
    primaryButtonText: 'Enter Home',
  },
  '2phase': {
    title: 'Alignment complete',
    body: 'Your resting baseline was clear. During breathing training, heart rate held a steady rhythm and skin conductance began to fall. You can start ongoing tracking from Home.',
    primaryButtonText: 'Enter Home',
  },
};

const UNCHANGED_EDA_COPY = {
  '3phase': {
    title: 'Stress detected, recovery still in progress',
    body: 'Skin conductance rose during the task and heart rate kept a steady rhythm during breathing — but EDA has not clearly fallen yet within this window. That does not mean coherence training failed; EDA recovery often takes longer. Delayed changes may show up on Home later.',
    primaryButtonText: 'Enter Home',
    secondaryButtonText: 'Try Again',
  },
  '2phase': {
    title: 'Rhythm detected, EDA not yet down',
    body: 'Heart rate held a steady rhythm during breathing, but skin conductance has not clearly fallen yet in this window. That does not mean training failed; EDA recovery often takes longer. Check Home later for delayed response.',
    primaryButtonText: 'Enter Home',
    secondaryButtonText: 'Try Again',
  },
};

const NEGATIVE_EDA_COPY = {
  '3phase': {
    title: 'Skin conductance is still elevated',
    body: 'Skin conductance rose during stress but continued to climb after recovery training — your body may still be activated. You can enter Home to watch for later changes, or try again when you feel more settled.',
    primaryButtonText: 'Enter Home',
    secondaryButtonText: 'Try Again',
  },
  '2phase': {
    title: 'Skin conductance is still elevated',
    body: 'Skin conductance did not fall during breathing training and may still be rising. You can enter Home to watch for later changes, or try again when you feel more settled.',
    primaryButtonText: 'Enter Home',
    secondaryButtonText: 'Try Again',
  },
};

function otherVariants(phase: PhaseMode): ResultVariant[] {
  const byId: Record<string, ResultVariant> = {
    other_flat: {
      id: 'other_flat',
      label: 'No EDA & HR',
      phases: ['3phase', '2phase'],
      signal: { edaQuality: 'flat', hrQuality: 'flat' },
      title: 'Signals were quiet this time',
      body: 'We did not see a clear stress or recovery pattern in this session — you may have already been relaxed, or your body needs more time to respond. Your first baseline is saved; continued wear will improve readings.',
      primaryButtonText: 'Enter Home',
      secondaryButtonText: 'Try Again',
    },
    other_hr_rhythm: {
      id: 'other_hr_rhythm',
      label: 'No EDA',
      phases: ['3phase', '2phase'],
      signal: { edaQuality: 'flat', hrQuality: 'normal' },
      title: 'Heart rate responded',
      body: 'Breathing training pulled out a heart rate rhythm, but skin conductance stayed flat in this session. The device still recorded useful data — keep wearing the ring and check Home for updates.',
      primaryButtonText: 'Enter Home',
      secondaryButtonText: 'Try Again',
    },
    other_no_hr: {
      id: 'other_no_hr',
      label: 'No HR',
      phases: ['3phase', '2phase'],
      signal: { edaQuality: 'plateau', hrQuality: 'flat' },
      title: 'Breathing rhythm not established',
      body: 'Heart rate did not settle into a clear rhythm during breathing training. Make sure you are following the pace and staying still. Try again or enter Home to keep tracking.',
      primaryButtonText: 'Try Again',
      secondaryButtonText: 'Enter Home',
    },
    other_interference: {
      id: 'other_interference',
      label: 'Interference',
      phases: ['3phase', '2phase'],
      signal: { edaQuality: 'abnormal', hrQuality: 'abnormal' },
      title: 'Could not confirm results',
      body: 'We could not reliably read your body response — this may be due to movement, fit, or environment. Keep the ring snug, stay still, and try again. You can also enter Home and we will keep observing.',
      primaryButtonText: 'Try Again',
      secondaryButtonText: 'Enter Home',
    },
  };

  const order = ['other_flat', 'other_hr_rhythm', 'other_no_hr', 'other_interference'];
  return order
    .map((id) => byId[id])
    .filter((v) => v.phases.includes(phase));
}

export function getResultTabs(phase: PhaseMode): ResultTabConfig[] {
  return [
    {
      id: 'positive',
      label: 'Positive',
      state: 'positive',
      variants: [
        {
          id: 'positive_full',
          label: 'Full response',
          phases: ['3phase', '2phase'],
          signal: { edaQuality: 'normal', hrQuality: 'normal' },
          ...POSITIVE_COPY[phase],
        },
      ],
    },
    {
      id: 'unchanged_eda',
      label: 'Unchanged',
      state: 'neutral',
      variants: [
        {
          id: 'unchanged_eda_plateau',
          label: 'EDA not yet down',
          phases: ['3phase', '2phase'],
          signal: { edaQuality: 'plateau', hrQuality: 'normal' },
          ...UNCHANGED_EDA_COPY[phase],
        },
      ],
    },
    {
      id: 'negative_eda',
      label: 'Negative',
      state: 'negative',
      variants: [
        {
          id: 'negative_eda_rising',
          label: 'EDA still rising',
          phases: ['3phase', '2phase'],
          signal: { edaQuality: 'rising', hrQuality: 'normal' },
          ...NEGATIVE_EDA_COPY[phase],
        },
      ],
    },
    {
      id: 'other',
      label: 'Other',
      state: 'neutral',
      variants: otherVariants(phase),
    },
  ];
}

export function getActiveVariant(
  tabs: ResultTabConfig[],
  tabId: ResultTabId,
  variantId: string
): ResultVariant {
  const tab = tabs.find((t) => t.id === tabId) ?? tabs[0];
  return tab.variants.find((v) => v.id === variantId) ?? tab.variants[0];
}
