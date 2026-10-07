-- ============================================================
--  KREAKS – Datenbank-Einrichtung für Supabase
--  Im Supabase-Dashboard: SQL Editor → New query → alles einfügen → Run
-- ============================================================

-- Spielerprofile: eine Zeile pro Konto, verknüpft über die Konto-UUID
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text not null,
  created_at  timestamptz not null default now(),
  last_login  timestamptz,
  constraint username_format check (username ~ '^[A-Za-z0-9_]{3,16}$')
);
-- Spielernamen sind eindeutig, Groß-/Kleinschreibung zählt dabei nicht
create unique index if not exists profiles_username_lower on public.profiles (lower(username));

alter table public.profiles enable row level security;

-- Jeder angemeldete Spieler darf Profile sehen (z.B. für Freundeslisten später)
drop policy if exists "profiles lesen" on public.profiles;
create policy "profiles lesen" on public.profiles for select to authenticated using (true);

-- Nur das eigene Profil darf geändert werden
drop policy if exists "eigenes profil ändern" on public.profiles;
create policy "eigenes profil ändern" on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Beim Registrieren wird automatisch ein Profil mit dem gewählten Namen angelegt
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', 'Spieler_' || substr(new.id::text, 1, 6)));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Prüft vor dem Registrieren, ob ein Spielername noch frei ist
create or replace function public.username_available(name text)
returns boolean language sql security definer set search_path = public stable as $$
  select name ~ '^[A-Za-z0-9_]{3,16}$'
     and not exists (select 1 from public.profiles where lower(username) = lower(name));
$$;
grant execute on function public.username_available(text) to anon, authenticated;
