import type { AbstractPowerSyncDatabase } from '@powersync/common';
import { AppSchema } from './schema';

/** Web: wa-sqlite, ohne Worker/Multi-Tab (Metro-freundlich, 1-Tab-Dogfooding).
 *  LAZY import — SSG (Node) evaluiert keinen Browser-Code. */
export async function createDb(dbFilename: string): Promise<AbstractPowerSyncDatabase> {
  const { PowerSyncDatabase } = await import('@powersync/web');
  return new PowerSyncDatabase({
    schema: AppSchema as never,
    database: { dbFilename },
    flags: { useWebWorker: false, enableMultiTabs: false },
  }) as unknown as AbstractPowerSyncDatabase;
}
