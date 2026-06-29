import { randomUUID } from 'expo-crypto';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Chip, Input, cn } from '@apex/ui';
import { useAuth } from '@/lib/auth';
import { useDb } from '@/lib/powersync/DbProvider';
import { SYNC_CONFIGURED } from '@/lib/powersync';

type Row = { id: string; title: string; status: string; created_at: string };

export default function DbTestScreen() {
  const { session, profile } = useAuth();
  const { db, error } = useDb();
  const [title, setTitle] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!db) return;
    // Live-Query: PowerSync watch — aktualisiert bei jedem lokalen Write
    const abort = new AbortController();
    void (async () => {
      for await (const result of db.watch(
        'select id, title, status, created_at from tasks order by created_at desc limit 20',
        [],
        { signal: abort.signal }
      )) {
        setRows(result.rows?._array ?? []);
        const c = await db.get<{ n: number }>('select count(*) as n from tasks');
        setCount(c.n);
      }
    })().catch(() => {});
    return () => abort.abort();
  }, [db]);

  const addTask = async () => {
    if (!db || !session || !title.trim()) return;
    const ws = await db.getOptional<{ id: string }>('select id from areas limit 0'); // noop ts-helper
    void ws;
    await db.execute(
      `insert into tasks (id, workspace_id, title, status, priority, energy, tags, is_obt, position, created_by, created_at, updated_at)
       values (?, ?, ?, 'todo', 'medium', 'medium', '[]', 0, 0, ?, ?, ?)`,
      [
        randomUUID(),
        profile?.id ?? session.user.id, // Platzhalter-Workspace bis Phase 10 Workspace-Kontext lädt
        title.trim(),
        session.user.id,
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );
    setTitle('');
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 gap-4 p-6">
        <Text className="text-2xs text-fg-3 font-semibold uppercase tracking-widest">
          Dev — Lokale DB (PowerSync, Phase 09b)
        </Text>
        <View className="flex-row gap-2">
          <Chip
            label={SYNC_CONFIGURED ? 'Sync: konfiguriert' : 'Sync: aus (lokal only)'}
            dot={SYNC_CONFIGURED ? 'success' : 'onhold'}
          />
          <Chip label={db ? 'SQLite: offen' : 'SQLite: —'} dot={db ? 'success' : 'danger'} />
        </View>

        {error && (
          <Card variant="subtle">
            <Text className="text-danger-fg text-xs">
              DB nicht verfügbar: {error}
              {'\n'}(Expo Go? op-sqlite braucht einen Dev-Build — Web funktioniert.)
            </Text>
          </Card>
        )}

        <Card header="Offline-E2E" hint={count !== null ? `${count} Tasks lokal` : undefined}>
          <View className="gap-3">
            <Input
              label="Neue lokale Task"
              placeholder="Flugmodus an — es funktioniert trotzdem"
              value={title}
              onChangeText={setTitle}
              onSubmitEditing={() => void addTask()}
              returnKeyType="done"
            />
            <Button variant="primary" onPress={() => void addTask()}>
              Lokal speichern
            </Button>
            <Text className="text-fg-3 text-xs">
              Beweis: Eintrag anlegen → App neu laden → Eintrag ist noch da (IndexedDB/SQLite). Beim
              späteren Aktivieren des Syncs laufen diese Zeilen automatisch in die Upload-Queue.
            </Text>
          </View>
        </Card>

        <Card header="Lokale Tasks" hint="watch() — live">
          {rows.length === 0 ? (
            <Text className="text-fg-3 text-sm">Noch keine Einträge.</Text>
          ) : (
            rows.map((r, i) => (
              <View
                key={r.id}
                className={cn(
                  'border-border flex-row items-baseline gap-2 py-2',
                  i > 0 && 'border-t'
                )}
              >
                <Text className="text-fg-1 flex-1 text-sm" numberOfLines={1}>
                  {r.title}
                </Text>
                <Text className="text-2xs text-fg-3 font-mono">{r.status}</Text>
              </View>
            ))
          )}
        </Card>
      </View>
    </SafeAreaView>
  );
}
