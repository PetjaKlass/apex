import { createContext, useContext, useEffect, useState } from 'react';
import type { AbstractPowerSyncDatabase } from '@powersync/common';
import { useAuth } from '@/lib/auth';
import { closeDb, openDbForUser } from './index';

type DbState = { db: AbstractPowerSyncDatabase | null; error: string | null };
const DbContext = createContext<DbState>({ db: null, error: null });

/** Öffnet die lokale Replik session-gekoppelt; ohne Session keine DB (Datenschutz). */
export function DbProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [state, setState] = useState<DbState>({ db: null, error: null });

  useEffect(() => {
    let cancelled = false;
    if (!session) {
      void closeDb();
      setState({ db: null, error: null });
      return;
    }
    openDbForUser(session.user.id)
      .then((db) => !cancelled && setState({ db, error: null }))
      .catch((e) => {
        // z.B. Expo Go (op-sqlite fehlt) — App bleibt nutzbar, /dev/db zeigt Hinweis
        console.warn('[apex-db]', e);
        if (!cancelled) setState({ db: null, error: e instanceof Error ? e.message : String(e) });
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  return <DbContext.Provider value={state}>{children}</DbContext.Provider>;
}

export function useDb(): DbState {
  return useContext(DbContext);
}
