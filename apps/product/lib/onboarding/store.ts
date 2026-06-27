/**
 * Onboarding-Zwischenstand (Zustand) — mmkv-persistiert, damit ein Reload mitten im
 * Flow nicht alles verliert (Pitfall #1). URL hält nur den aktuellen Schritt.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { settingsStorage } from '@/lib/theme/storage';

export type Horizon = '1y' | '3y' | '5y';
export type FrequencyType = 'daily' | 'x_per_week' | 'specific_days' | 'weekly';

export type OnboardingData = {
  consent: boolean;
  identity: string | null; // Preset-Key oder Custom-Text
  workspaceName: string;
  workspaceType: 'solo' | 'duo';
  visionTitle: string;
  visionStatement: string;
  visionHorizon: Horizon;
  goalTitle: string;
  goalDeadline: string | null;
  keyResult: string;
  habitTitle: string;
  habitIdentity: string;
  habitFrequency: FrequencyType;
  obtTitle: string;
};

const initial: OnboardingData = {
  consent: false,
  identity: null,
  workspaceName: 'Personal',
  workspaceType: 'solo',
  visionTitle: '',
  visionStatement: '',
  visionHorizon: '3y',
  goalTitle: '',
  goalDeadline: null,
  keyResult: '',
  habitTitle: '',
  habitIdentity: '',
  habitFrequency: 'daily',
  obtTitle: '',
};

type Store = OnboardingData & {
  set: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
  reset: () => void;
};

export const useOnboarding = create<Store>()(
  persist(
    (set) => ({
      ...initial,
      set: (key, value) => set({ [key]: value } as Partial<OnboardingData>),
      reset: () => set(initial),
    }),
    {
      name: 'apex-onboarding',
      storage: createJSONStorage(() => ({
        getItem: (k) => settingsStorage.get(k),
        setItem: (k, v) => settingsStorage.set(k, v),
        removeItem: (k) => settingsStorage.set(k, ''),
      })),
    }
  )
);

/** Reihenfolge der Schritte (für Progress + Vor/Zurück). welcome/complete zählen nicht mit. */
export const STEPS = ['identity', 'workspace', 'vision', 'goal', 'habit', 'obt'] as const;
export type Step = (typeof STEPS)[number];
