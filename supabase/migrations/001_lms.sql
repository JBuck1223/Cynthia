-- Cynthia Productions LMS
create extension if not exists "pgcrypto";

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  sku text not null,
  amount_cents integer not null,
  stripe_session_id text unique,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create table if not exists public.course_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_slug text not null,
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_slug text not null,
  lesson_slug text not null,
  status text not null default 'completed',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, course_slug, lesson_slug)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.course_entitlements enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.leads enable row level security;

create policy "users read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "users read own entitlements" on public.course_entitlements
  for select using (auth.uid() = user_id);

create policy "users read own progress" on public.lesson_progress
  for select using (auth.uid() = user_id);

create policy "users write own progress" on public.lesson_progress
  for insert with check (auth.uid() = user_id);

create policy "users update own progress" on public.lesson_progress
  for update using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
