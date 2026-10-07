-- ============================================================
--  KREAKS – Update 2: Keys, Freischaltung, Admin, verschlüsselte Spielversionen
--  Im Supabase-Dashboard: SQL Editor → New query → alles einfügen → Run
--  (setup.sql muss vorher schon einmal gelaufen sein)
--
--  ACHTUNG: Die Zeile mit dem privaten Spielschlüssel ganz unten ist in dieser
--  öffentlichen Datei nur ein Platzhalter. Die ausgefüllte Fassung bekommst
--  du separat – sie darf NIE ins öffentliche Repository.
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

-- Privater Bereich: nicht über die API erreichbar
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- ---------- Profile erweitern ----------
alter table public.profiles add column if not exists licensed    boolean not null default false;
alter table public.profiles add column if not exists is_admin    boolean not null default false;
alter table public.profiles add column if not exists license_key text;

-- Spieler dürfen an ihrem Profil nur noch "zuletzt angemeldet" ändern –
-- Freischaltung und Admin-Rechte kann niemand selbst setzen.
revoke update on public.profiles from authenticated, anon;
grant update (last_login) on public.profiles to authenticated;

-- ---------- Keys ----------
create table if not exists private.license_keys (
  key         text primary key,
  note        text,
  source      text not null default 'code',          -- 'code' (von dir verschenkt) oder 'kauf'
  created_at  timestamptz not null default now(),
  created_by  uuid,
  used_by     uuid references auth.users(id) on delete set null,   -- Konto gelöscht → Key wieder frei
  used_at     timestamptz
);

create table if not exists private.secrets (
  name  text primary key,
  value text not null
);

-- Key vereinheitlichen: Großbuchstaben, ohne Leerzeichen
create or replace function private.norm_key(k text) returns text
language sql immutable as $$ select upper(regexp_replace(coalesce(k, ''), '\s', '', 'g')) $$;

-- Neuen Key erzeugen: KRKS-XXXX-XXXX-XXXX (ohne verwechselbare Zeichen wie 0/O, 1/I)
create or replace function private.new_key() returns text
language plpgsql volatile set search_path = private, extensions as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  b bytea := extensions.gen_random_bytes(12);
  s text := 'KRKS';
  i int;
begin
  for i in 0..11 loop
    if i % 4 = 0 then s := s || '-'; end if;
    s := s || substr(alphabet, (get_byte(b, i) % 32) + 1, 1);
  end loop;
  return s;
end $$;

create or replace function private.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- ---------- Registrierung: nur mit gültigem Key ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public, private as $$
declare
  k text := private.norm_key(new.raw_user_meta_data->>'license_key');
begin
  if k = '' then
    raise exception 'KREAKS_KEY_FEHLT';
  end if;
  update private.license_keys set used_by = new.id, used_at = now()
   where key = k and used_by is null;
  if not found then
    raise exception 'KREAKS_KEY_UNGUELTIG';
  end if;
  insert into public.profiles (id, username, licensed, license_key)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', 'Spieler_' || substr(new.id::text, 1, 6)), true, k);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Funktionen für den Launcher ----------

-- Vor dem Registrieren: Ist der Key gültig? → 'frei' | 'benutzt' | 'ungueltig'
create or replace function public.key_status(k text)
returns text language sql stable security definer set search_path = private as $$
  select case
    when not exists (select 1 from private.license_keys where key = private.norm_key(k)) then 'ungueltig'
    when exists (select 1 from private.license_keys where key = private.norm_key(k) and used_by is not null) then 'benutzt'
    else 'frei' end
$$;
grant execute on function public.key_status(text) to anon, authenticated;

-- Angemeldetes Konto nachträglich freischalten
create or replace function public.redeem_key(k text)
returns boolean language plpgsql security definer set search_path = public, private as $$
declare nk text := private.norm_key(k);
begin
  if auth.uid() is null then raise exception 'Nicht angemeldet'; end if;
  if exists (select 1 from public.profiles where id = auth.uid() and licensed) then return true; end if;
  update private.license_keys set used_by = auth.uid(), used_at = now() where key = nk and used_by is null;
  if not found then return false; end if;
  update public.profiles set licensed = true, license_key = nk where id = auth.uid();
  return true;
end $$;
grant execute on function public.redeem_key(text) to authenticated;

-- Eigener Status (Freischaltung, Admin)
create or replace function public.my_status()
returns json language sql stable security definer set search_path = public as $$
  select json_build_object('username', username, 'licensed', licensed, 'is_admin', is_admin)
    from public.profiles where id = auth.uid()
$$;
grant execute on function public.my_status() to authenticated;

-- Schlüssel einer Spielversion freigeben – nur für freigeschaltete Konten
create or replace function public.unwrap_game_key(wrapped text)
returns text language plpgsql stable security definer set search_path = public, private, extensions as $$
declare pk text;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and licensed) then
    raise exception 'KREAKS_NICHT_FREIGESCHALTET';
  end if;
  select value into pk from private.secrets where name = 'game_private_key';
  if pk is null then raise exception 'KREAKS_KEIN_SPIELSCHLUESSEL'; end if;
  return extensions.pgp_pub_decrypt(extensions.dearmor(wrapped), extensions.dearmor(pk));
end $$;
grant execute on function public.unwrap_game_key(text) to authenticated;

-- ---------- Admin: Keys verwalten ----------
create or replace function public.admin_create_keys(anzahl int default 1, notiz text default null)
returns setof text language plpgsql security definer set search_path = public, private as $$
declare i int; k text;
begin
  if not private.is_admin() then raise exception 'Keine Admin-Rechte'; end if;
  if anzahl < 1 or anzahl > 100 then raise exception 'Anzahl muss zwischen 1 und 100 liegen'; end if;
  for i in 1..anzahl loop
    loop
      k := private.new_key();
      exit when not exists (select 1 from private.license_keys where key = k);
    end loop;
    insert into private.license_keys (key, note, created_by) values (k, nullif(trim(notiz), ''), auth.uid());
    return next k;
  end loop;
end $$;
grant execute on function public.admin_create_keys(int, text) to authenticated;

create or replace function public.admin_list_keys()
returns table (key text, note text, source text, created_at timestamptz, used_at timestamptz, used_by_name text)
language plpgsql stable security definer set search_path = public, private as $$
begin
  if not private.is_admin() then raise exception 'Keine Admin-Rechte'; end if;
  return query
    select l.key, l.note, l.source, l.created_at, l.used_at, p.username
      from private.license_keys l left join public.profiles p on p.id = l.used_by
     order by l.created_at desc;
end $$;
grant execute on function public.admin_list_keys() to authenticated;

create or replace function public.admin_delete_key(k text)
returns boolean language plpgsql security definer set search_path = public, private as $$
begin
  if not private.is_admin() then raise exception 'Keine Admin-Rechte'; end if;
  delete from private.license_keys where key = private.norm_key(k) and used_by is null;
  return found;
end $$;
grant execute on function public.admin_delete_key(text) to authenticated;

-- Funktionen nur für angemeldete Spieler (Postgres erlaubt sonst jedem das Ausführen)
revoke execute on function public.redeem_key(text), public.my_status(), public.unwrap_game_key(text),
  public.admin_create_keys(int, text), public.admin_list_keys(), public.admin_delete_key(text) from public, anon;
revoke execute on function private.norm_key(text), private.new_key(), private.is_admin() from public, anon, authenticated;

-- ---------- Dein Konto: freischalten und Admin ----------
update public.profiles set licensed = true, is_admin = true
 where id in (select id from auth.users where lower(email) = lower('%%ADMIN_EMAIL%%'));

-- ---------- Privater Spielschlüssel (nur in der ausgefüllten Fassung) ----------
insert into private.secrets (name, value) values ('game_private_key', '%%PRIVATE_KEY%%')
on conflict (name) do update set value = excluded.value;
