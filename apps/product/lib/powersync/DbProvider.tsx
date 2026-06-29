import { createContext, useContext, useEffect, useState } from 'react';
import type { AbstractPowerSyncDatabase } from '@powersync/common';
import { useAuth } from '@/lib/auth';
import { closeDb, openDbForUser, SYNC_CONFIGURED } from './index';

type DbState = { db: AbstractPowerSyncDatabase | null; error: string | null };
const DbContext = createContext<DbState>({ db: null, error: null });

/** Öffnet die lokale Replik session-gekoppelt; ohne Session keine DB (Datenschutz). */
export function DbProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const uid = session?.user?.id ?? null;
  const [state, setState] = useState<DbState>({ db: null, error: null });

  useEffect(() => {
    let cancelled = false;
    // Lokale Replik erst öffnen, wenn Sync konfiguriert ist (deferred bis Pre-Launch).
    // Bis dahin liest die App direkt aus Supabase → keine PowerSync-Web-Initialisierung
    // (vermeidet den wa-sqlite-URL-Fehler) und keine Re-Run-Schleife.
    if (!uid || !SYNC_CONFIGURED) {
      void closeDb();
      setState({ db: null, error: null });
      return;
    }
    openDbForUser(uid)
      .then((db) => !cancelled && setState({ db, error: null }))
      .catch((e) => {
        console.warn('[apex-db]', e);
        if (!cancelled) setState({ db: null, error: e instanceof Error ? e.message : String(e) });
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  return <DbContext.Provider value={state}>{children}</DbContext.Provider>;
}

export function useDb(): DbState {
  return useContext(DbContext);
}
