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
    body: 'Skin conductance rose during the Stroop task and began to fall after recovery training. Heart rate held a steady rhythm throughout breathing. We captured both stress and recovery across three phases.',
    primaryButtonText: 'Enter Home',
  },
  '2phase': {
    title: 'Your body settled after breathing',
    body: 'You reported an emotional shift, so we treated your EDA as already elevated. After breathing training, skin conductance began to fall — a clear recovery from an activated state.',
    primaryButtonText: 'Enter Home',
  },
};

const UNCHANGED_EDA_COPY = {
  '3phase': {
    title: 'Stress detected, recovery still in progress',
    body: 'Skin conductance rose during Stroop and heart rate kept a steady rhythm during breathing — but EDA has not clearly fallen yet within this window. That does not mean coherence training failed; EDA recovery often takes longer. Delayed changes may show up on Home later.',
    primaryButtonText: 'Enter Home',
    secondaryButtonText: 'Try Again',
  },
  '2phase': {
    title: 'Still elevated — not yet down',
    body: 'You started from an activated state. Heart rate may have shown rhythm during breathing, but skin conductance stayed high and did not clearly fall in this window. Delayed EDA recovery may still appear on Home later.',
    primaryButtonText: 'Enter Home',
    secondaryButtonText: 'Try Again',
  },
};

const NEGATIVE_EDA_COPY = {
  '3phase': {
    title: 'Skin conductance is still elevated',
    body: 'Skin conductance rose during Stroop but continued to climb after recovery training — your body may still be activated. You can enter Home to watch for later changes, or try again when you feel more settled.',
    primaryButtonText: 'Enter Home',
    secondaryButtonText: 'Try Again',
  },
  '2phase': {
    title: 'Still climbing after breathing',
    body: 'You started activated, and skin conductance did not fall during breathing — it stayed high or kept rising. You can enter Home to watch for later changes, or try again when you feel more settled.',
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
      title: phase === '2phase' ? 'No clear recovery this time' : 'Signals were quiet this time',
      body:
        phase === '2phase'
          ? 'You started activated, but we did not see a clear EDA decline or HR rhythm during breathing. Your baseline is saved; continued wear will improve readings.'
          : 'We did not see a clear stress or recovery pattern in this session — you may have already been relaxed, or your body needs more time to respond. Your first baseline is saved; continued wear will improve readings.',
      primaryButtonText: 'Enter Home',
      secondaryButtonText: 'Try Again',
    },
    other_no_hr: {
      id: 'other_no_hr',
      label: 'No HR',
      phases: ['3phase', '2phase'],
      signal: { edaQuality: 'normal', hrQuality: 'flat' },
      title: 'Skin conductance fell, no breathing rhythm',
      body: 'Skin conductance came down after training, but heart rate never settled into a clear rhythm. Make sure you follow the breathing pace and stay still — that will make the recovery signal even stronger next time.',
      primaryButtonText: 'Enter Home',
      secondaryButtonText: 'Try Again',
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

  const order = ['other_flat', 'other_no_hr', 'other_interference'];
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
