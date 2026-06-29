import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

const db = supabase as unknown as SupabaseClient;

export type Horizon = '1y' | '3y' | '5y';
export type FrequencyType = 'daily' | 'x_per_week' | 'weekly';

export type OnboardingData = {
  consent: boolean;
  identity: string | null;
  workspaceName: string;
  workspaceType: 'solo' | 'duo';
  visionTitle: string;
  visionStatement: string;
  visionHorizon: Horizon;
  goalTitle: string;
  keyResult: string;
  habitTitle: string;
  habitIdentity: string;
  habitFrequency: FrequencyType;
  obtTitle: string;
};

export const INITIAL: OnboardingData = {
  consent: false,
  identity: null,
  workspaceName: 'Personal',
  workspaceType: 'solo',
  visionTitle: '',
  visionStatement: '',
  visionHorizon: '3y',
  goalTitle: '',
  keyResult: '',
  habitTitle: '',
  habitIdentity: '',
  habitFrequency: 'daily',
  obtTitle: '',
};

const quarterOf = (d = new Date()) => `Q${Math.floor(d.getMonth() / 3) + 1}-${d.getFullYear()}`;

export async function submitOnboarding(
  data: OnboardingData,
  userId: string,
  workspaceId: string
): Promise<void> {
  await db
    .from('workspaces')
    .update({ name: data.workspaceName.trim() || 'Personal', type: data.workspaceType })
    .eq('id', workspaceId);

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

  if (data.goalTitle.trim()) {
    const { data: g } = await db
      .from('goals')
      .insert({
        workspace_id: workspaceId,
        vision_id: visionId,
        title: data.goalTitle.trim(),
        quarter: quarterOf(),
        created_by: userId,
      })
      .select('id')
      .single();
    if (g?.id && data.keyResult.trim()) {
      await db
        .from('key_results')
        .insert({ goal_id: g.id, workspace_id: workspaceId, title: data.keyResult.trim() });
    }
  }

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

  await db.from('profiles').update({ onboarded_at: new Date().toISOString() }).eq('id', userId);
}
