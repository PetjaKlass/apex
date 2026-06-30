'use client';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@apex/types';

// Publishable/anon-Werte sind per Design client-öffentlich (RLS schützt die Daten) →
// als Fallback gesetzt, damit der Deploy auch ohne Dashboard-Env sofort läuft.
// Env-Variablen (falls gesetzt) haben Vorrang.
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uzbzrcwexifduawmzrfn.supabase.co';
const ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fisJhYHdd2r_qQjfyyWhYA_zYJEISc6';

export const supabase = createClient<Database>(URL, ANON);
