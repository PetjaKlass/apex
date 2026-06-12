/**
 * Persistenz-Adapter für Theme/Akzent.
 * Web → localStorage · Native → MMKV (lazy; in Expo Go nicht verfügbar → Memory-Fallback).
 */
import { Platform } from 'react-native';

type KV = { get(key: string): string | null; set(key: string, value: string): void };

function createStorage(): KV {
  if (Platform.OS === 'web') {
    return {
      get: (k) => {
        try {
          return window.localStorage.getItem(k);
        } catch {
          return null;
        }
      },
      set: (k, v) => {
        try {
          window.localStorage.setItem(k, v);
        } catch {
          /* noop */
        }
      },
    };
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    const mmkv = createMMKV({ id: 'apex-settings' }); // MMKV v4 (Nitro): createMMKV statt new MMKV
    return {
      get: (k) => mmkv.getString(k) ?? null,
      set: (k, v) => mmkv.set(k, v),
    };
  } catch {
    // Expo Go: natives Modul fehlt → Sitzungs-Memory (Dev-Builds ab Phase 21 nutzen MMKV)
    console.info(
      '[apex] MMKV nicht verfügbar (Expo Go?) — Theme-Persistenz nur in dieser Sitzung.'
    );
    const mem = new Map<string, string>();
    return { get: (k) => mem.get(k) ?? null, set: (k, v) => mem.set(k, v) };
  }
}

export const settingsStorage = createStorage();
