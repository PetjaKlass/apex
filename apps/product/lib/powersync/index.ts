/**
 * DB-Singleton, user-scoped: je Supabase-User eine eigene lokale Datei
 * (apex-<userid>) — Logout schließt nur; fremde Daten landen nie in derselben Replik.
 * Sync: connectIfConfigured() verbindet NUR wenn EXPO_PUBLIC_POWERSYNC_URL gesetzt
 * (deferred bis Pre-Launch — siehe docs/phases/log.md Phase 09b).
 */
import type { AbstractPowerSyncDatabase } from '@powersync/common';
import { createDb } from './db';
import { SupabaseConnector, SYNC_CONFIGURED } from './connector';

let current: { userId: string; db: AbstractPowerSyncDatabase } | null = null;

export async function openDbForUser(userId: string): Promise<AbstractPowerSyncDatabase> {
  if (current?.userId === userId) return current.db;
  if (current) await current.db.close();
  const db = await createDb(`apex-${userId}.db`);
  await db.init();
  if (SYNC_CONFIGURED) {
    await db.connect(new SupabaseConnector());
  }
  current = { userId, db };
  return db;
}

export async function closeDb(): Promise<void> {
  if (current) {
    await current.db.close();
    current = null;
  }
}

export { SYNC_CONFIGURED } from './connector';
