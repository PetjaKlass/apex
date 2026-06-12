-- 0004: workspace_members + Kern-RLS
-- Rollback: drop table public.workspace_members cascade; (+ Policies via drop policy)
create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  role         text not null default 'member' check (role in ('owner','member')),
  joined_at    timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
alter table public.workspace_members enable row level security;

create or replace function app.user_workspaces() returns setof uuid
language sql stable security definer set search_path = public as $$
  select workspace_id from public.workspace_members where user_id = auth.uid()
$$;
revoke all on function app.user_workspaces() from public;
grant execute on function app.user_workspaces() to authenticated;

-- members: eigene Mitgliedschaften lesen; Verwaltung owner-seitig (Phase 09+ für Duo-Invite-Accept via RPC)
create policy "members: self read" on public.workspace_members
  for select using (user_id = auth.uid());
create policy "members: self leave" on public.workspace_members
  for delete using (user_id = auth.uid() and role <> 'owner');

-- workspaces: Mitglieder lesen; nur Owner ändert
create policy "workspaces: member read" on public.workspaces
  for select using (id in (select app.user_workspaces()));
create policy "workspaces: owner update" on public.workspaces
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- invites: nur Owner des Workspaces sieht/verwaltet (Accept-Flow kommt als RPC in Phase 09)
create policy "invites: owner all" on public.workspace_invites
  for all using (
    workspace_id in (select id from public.workspaces where owner_id = auth.uid())
  ) with check (
    workspace_id in (select id from public.workspaces where owner_id = auth.uid())
  );
