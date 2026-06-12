-- 0006: Advisor-Fixes (Phase 08) — search_path fixiert, Trigger-Fn nicht via RPC aufrufbar
-- Rollback: Funktionen neu ohne set search_path anlegen; grants wiederherstellen (nicht empfohlen)
create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
