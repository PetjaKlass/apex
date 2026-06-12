import type { AbstractPowerSyncDatabase } from '@powersync/common';
import { AppSchema } from './schema';

/** Native: op-sqlite. LAZY import — kein PowerSync-Code zur Modulauswertung (SSG-sicher).
 *  Achtung: braucht Dev-Build — Expo Go hat das native Modul nicht. */
export async function createDb(dbFilename: string): Promise<AbstractPowerSyncDatabase> {
  const { PowerSyncDatabase } = await import('@powersync/react-native');
  const { OPSqliteOpenFactory } = await import('@powersync/op-sqlite');
  return new PowerSyncDatabase({
    schema: AppSchema,
    database: new OPSqliteOpenFactory({ dbFilename }),
  }) as unknown as AbstractPowerSyncDatabase;
}
