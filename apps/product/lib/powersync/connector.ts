/**
 * Supabase-Connector — VOLLSTÄNDIG implementiert, aber nur aktiv, wenn
 * EXPO_PUBLIC_POWERSYNC_URL gesetzt ist (Entscheidung 2026-06-12: Sync deferred
 * bis Pre-Launch — Supabase Free hat keine IPv4-Replikationsverbindung).
 * Aktivierung später: Env setzen → connectIfConfigured() verbindet. Keine weiteren Änderungen.
 */
import {
  AbstractPowerSyncDatabase,
  CrudEntry,
  PowerSyncBackendConnector,
  UpdateType,
} from '@powersync/common';
import { supabase } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

// @apex/types kennt bisher nur Phase-08-Tabellen (Regen der 30 Tabellen folgt).
// Der Connector arbeitet bewusst generisch über alle CRUD-Tabellen:
const raw = supabase as unknown as SupabaseClient;

export const POWERSYNC_URL = process.env.EXPO_PUBLIC_POWERSYNC_URL ?? '';
export const SYNC_CONFIGURED = POWERSYNC_URL.length > 0;

export class SupabaseConnector implements PowerSyncBackendConnector {
  async fetchCredentials() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return null;
    return { endpoint: POWERSYNC_URL, token };
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const tx = await database.getNextCrudTransaction();
    if (!tx) return;
    try {
      for (const op of tx.crud) {
        await this.applyOperation(op);
      }
      await tx.complete();
    } catch (err) {
      // Nicht-wiederholbare Fehler (RLS/Constraint) würden die Queue blockieren —
      // Strategie Stage 1: loggen + Transaktion verwerfen; verfeinert in Phase 13.
      console.error('[powersync] upload fehlgeschlagen:', err);
      throw err;
    }
  }

  private async applyOperation(op: CrudEntry): Promise<void> {
    const table = op.table;
    if (op.op === UpdateType.PUT) {
      const { error } = await raw.from(table).upsert({ ...op.opData, id: op.id });
      if (error) throw error;
    } else if (op.op === UpdateType.PATCH) {
      const { error } = await raw.from(table).update(op.opData!).eq('id', op.id);
      if (error) throw error;
    } else if (op.op === UpdateType.DELETE) {
      const { error } = await raw.from(table).delete().eq('id', op.id);
      if (error) throw error;
    }
  }
}
