/** Supabase-Client (Product) — Session-Persistenz über unseren Storage-Adapter (MMKV/localStorage). */
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import type { Database } from '@apex/types';
import { settingsStorage } from '@/lib/theme/storage';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error('Supabase-Env fehlt (apps/product/.env).');

export const supabase = createClient<Database>(url, key, {
  auth: {
    storage: {
      getItem: (k) => Promise.resolve(settingsStorage.get(k)),
      setItem: (k, v) => Promise.resolve(settingsStorage.set(k, v)),
      removeItem: (k) => Promise.resolve(settingsStorage.set(k, '')),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
