-- 0001: privates Schema + Helper (data-model.md §RLS)
-- Rollback: drop function public.set_updated_at(); drop schema app;
-- Hinweis: app.user_workspaces() lebt in 0004 (sql-Funktionen validieren Body bei CREATE → Tabelle muss existieren).
create schema if not exists app;
grant usage on schema app to authenticated;

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;
