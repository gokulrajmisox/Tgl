-- Touch Grass Later — profiles table, RLS, and idempotent signup trigger.
-- Run this in the Supabase SQL editor (project "risk").

-- ------------------------------------------------------------------
-- profiles: one row per auth user. Role is server-managed ONLY.
-- ------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'student'
    check (role in ('student', 'mentor', 'admin')),
  referral_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------------
-- Idempotent profile creation on signup.
-- The trigger is the PRIMARY path: it runs inside auth, works whether
-- or not email confirmation is enabled, and is a no-op on conflict.
-- ------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, referral_code)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    'student', -- NEVER anything else at signup; admin is granted manually.
    nullif(new.raw_user_meta_data ->> 'referral_code', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------
-- Row Level Security.
-- - Users can read and update ONLY their own profile.
-- - Users can insert ONLY their own profile row (fallback path; the
--   trigger handles the normal case via security definer).
-- - Role changes are NOT allowed from the client: the update policy
--   excludes the role column via a trigger guard below.
-- ------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Guard: the role column can only be changed by the service role
-- (e.g. from the Supabase dashboard or a secure admin API), never
-- by the profile owner through the anon/postgrest path.
create or replace function public.prevent_role_self_change()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role
     and auth.role() <> 'service_role' then
    raise exception 'Role changes are not permitted.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_self_change on public.profiles;
create trigger profiles_prevent_role_self_change
  before update of role on public.profiles
  for each row execute function public.prevent_role_self_change();
