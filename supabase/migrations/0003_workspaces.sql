-- 0003: workspaces + invites
-- Rollback: drop table public.workspace_invites; drop table public.workspaces cascade;
create table public.workspaces (
  id          uuid primary key default gen_random_uuid(),
  type        text not null default 'solo' check (type in ('solo','duo')),
  name        text not null,
  owner_id    uuid not null references public.profiles(id),
  plan        text not null default 'free' check (plan in ('free','pro','duo','lifetime')),
  trial_ends_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger set_updated_at_workspaces before update on public.workspaces
  for each row execute function public.set_updated_at();

create table public.workspace_invites (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email        text not null,
  invited_by   uuid not null references public.profiles(id),
  token        text not null unique,
  expires_at   timestamptz not null,
  accepted_at  timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.workspaces enable row level security;
alter table public.workspace_invites enable row level security;
-- Policies folgen in 0004 (brauchen workspace_members + app.user_workspaces()).
