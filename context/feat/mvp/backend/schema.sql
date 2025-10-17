-- Supabase Schema (MVP)

create extension if not exists "uuid-ossp";

-- Users are in auth.users; create a profile table for denormalized public data
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

-- Intake sessions
create table if not exists public.intake_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  mode text check (mode in ('quick','full')) not null,
  story_text text not null,
  created_at timestamptz default now(),
  completed boolean default false
);

create table if not exists public.intake_answers (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.intake_sessions(id) on delete cascade,
  question_id text not null,
  choice text check (choice in ('left','right','neither')) not null,
  intensity smallint check (intensity between 0 and 2) not null,
  created_at timestamptz default now()
);

-- Reflections (WIMTS + chosen translation)
create table if not exists public.reflections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  base_intake_text text not null,
  wimts_option_id text not null,
  translation_mode text check (translation_mode in ('4','8')) not null,
  chosen_translation_key text not null,
  translation_text text not null,
  recipient_id uuid,
  created_at timestamptz default now()
);

-- Contacts (Relational Web)
create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  name text not null,
  role text,
  relationship_type text,
  created_at timestamptz default now()
);

create table if not exists public.contact_sliders (
  contact_id uuid primary key references public.contacts(id) on delete cascade,
  directness int2 default 50,
  formality int2 default 50,
  warmth int2 default 70,
  support int2 default 70,
  humor int2 default 50,
  teasing int2 default 40
);

-- Insights (Profile feed)
create table if not exists public.insights (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  type text check (type in ('communication','trigger','growth','realization')) not null,
  title text,
  snippet text,
  tags text[],
  created_at timestamptz default now()
);

-- Admin config versions
create table if not exists public.admin_configs (
  config_id text primary key,
  status text check (status in ('draft','published')) not null,
  payload jsonb not null,
  author_user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.admin_audit_log (
  id bigserial primary key,
  actor_user_id uuid references auth.users(id),
  action text,
  config_id text,
  details jsonb,
  created_at timestamptz default now()
);

-- Shortlinks (for share)
create table if not exists public.shortlinks (
  code text primary key,
  target_url text not null,
  utm jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_intake_sessions_user on public.intake_sessions(user_id);
create index if not exists idx_reflections_user on public.reflections(user_id);
create index if not exists idx_contacts_user on public.contacts(user_id);
create index if not exists idx_insights_user on public.insights(user_id);
create index if not exists idx_admin_configs_status on public.admin_configs(status);


