/**
 * Persistiert das Onboarding nach Supabase (DIREKT — PowerSync-Sync ist Stage-1 deferred).
 * Workspace „Personal" existiert bereits (handle_new_user-Trigger) → wir aktualisieren ihn,
 * statt einen zweiten anzulegen, und hängen Vision/Goal/Habit/OBT daran.
 */
import { supabase } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

// @apex/types deckt bisher nur die Phase-08-Tabellen ab (Regen der 30 Tabellen folgt mit der
// Sync-Aktivierung). Bis dahin generischer Zugriff für die neuen Tabellen:
const db = supabase as unknown as SupabaseClient;
import type { OnboardingData } from './store';

function quarterOf(d = new Date()): string {
  return `Q${Math.floor(d.getMonth() / 3) + 1}-${d.getFullYear()}`;
}

export async function submitOnboarding(
  data: OnboardingData,
  userId: string,
  workspaceId: string
): Promise<void> {
  // 1) Workspace benennen/typisieren
  await db
    .from('workspaces')
    .update({ name: data.workspaceName.trim() || 'Personal', type: data.workspaceType })
    .eq('id', workspaceId);

  // 2) Vision (optional)
  let visionId: string | null = null;
  if (data.visionTitle.trim()) {
    const { data: v } = await db
      .from('visions')
      .insert({
        workspace_id: workspaceId,
        title: data.visionTitle.trim(),
        future_self_statement: data.visionStatement.trim() || null,
        horizon: data.visionHorizon,
        created_by: userId,
      })
      .select('id')
      .single();
    visionId = v?.id ?? null;
  }

  // 3) Goal (optional) + 1 Key Result
  if (data.goalTitle.trim()) {
    const { data: g } = await db
      .from('goals')
      .insert({
        workspace_id: workspaceId,
        vision_id: visionId,
        title: data.goalTitle.trim(),
        quarter: quarterOf(),
        deadline: data.goalDeadline,
        created_by: userId,
      })
      .select('id')
      .single();
    if (g?.id && data.keyResult.trim()) {
      await db.from('key_results').insert({
        goal_id: g.id,
        workspace_id: workspaceId,
        title: data.keyResult.trim(),
      });
    }
  }

  // 4) Habit (optional)
  if (data.habitTitle.trim()) {
    await db.from('habits').insert({
      workspace_id: workspaceId,
      title: data.habitTitle.trim(),
      identity_statement: data.habitIdentity.trim() || data.habitTitle.trim(),
      frequency_type: data.habitFrequency,
      frequency_config: data.habitFrequency === 'x_per_week' ? { target_per_week: 4 } : {},
      created_by: userId,
    });
  }

  // 5) OBT als heutige Aufgabe (optional)
  if (data.obtTitle.trim()) {
    await db.from('tasks').insert({
      workspace_id: workspaceId,
      title: data.obtTitle.trim(),
      is_obt: true,
      scheduled_for: new Date().toISOString().slice(0, 10),
      priority: 'high',
      created_by: userId,
    });
  }

  // 6) Onboarding abschließen — Flag in profiles (existiert seit Phase 08; KEINE Migration 0014 nötig)
  await db.from('profiles').update({ onboarded_at: new Date().toISOString() }).eq('id', userId);
}
