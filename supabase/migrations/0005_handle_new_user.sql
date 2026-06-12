-- 0005: Auto-Provisionierung bei Signup — Profil + persönlicher Workspace + Membership
-- Rollback: drop trigger on_auth_user_created on auth.users; drop function public.handle_new_user();
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  ws_id uuid;
begin
  insert into public.profiles (id, email, display_name, locale)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'locale', 'en')
  );

  insert into public.workspaces (type, name, owner_id)
  values ('solo', 'Personal', new.id)
  returning id into ws_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (ws_id, new.id, 'owner');

  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
