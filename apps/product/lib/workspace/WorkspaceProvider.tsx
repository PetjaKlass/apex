import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Tables } from '@apex/types';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { settingsStorage } from '@/lib/theme/storage';

type Workspace = Tables<'workspaces'>;
type WorkspaceState = {
  workspaces: Workspace[];
  active: Workspace | null;
  loading: boolean;
  setActive: (id: string) => void;
};

const WorkspaceContext = createContext<WorkspaceState | null>(null);
const ACTIVE_KEY = 'apex-active-workspace';

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeId, setActiveId] = useState<string | null>(() => settingsStorage.get(ACTIVE_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setWorkspaces([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    void supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setWorkspaces(data ?? []);
        setLoading(false);
      });
  }, [session]);

  const setActive = (id: string) => {
    setActiveId(id);
    settingsStorage.set(ACTIVE_KEY, id);
  };

  const active = useMemo(
    () => workspaces.find((w) => w.id === activeId) ?? workspaces[0] ?? null,
    [workspaces, activeId]
  );

  const value = useMemo<WorkspaceState>(
    () => ({ workspaces, active, loading, setActive }),
    [workspaces, active, loading]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceState {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error('useWorkspace muss innerhalb von <WorkspaceProvider> verwendet werden.');
  return ctx;
}
