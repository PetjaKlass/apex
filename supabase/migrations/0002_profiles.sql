-- 0002: profiles (1:1 zu auth.users)
-- Rollback: drop table public.profiles cascade;
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  display_name  text,
  avatar_url    text,
  locale        text not null default 'en' check (locale in ('en','de')),
  timezone      text not null default 'Europe/Berlin',
  role          text not null default 'user' check (role in ('user','admin')),
  onboarded_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger set_updated_at_profiles before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
create policy "profiles: self read"   on public.profiles for select using (id = auth.uid());
create policy "profiles: self update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
-- insert nur über Trigger (security definer) — keine Insert-Policy für Clients.
