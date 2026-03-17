-- AI Influencer Creator Platform — Schema inicial

create extension if not exists "uuid-ossp";

-- =====================
-- PROFILES
-- =====================
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  email text,
  credits integer not null default 50,
  is_dev boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================
-- AI MODELS
-- =====================
create table if not exists ai_models (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles on delete cascade,
  name text not null,
  age integer,
  ethnicity text,
  location text,
  niche text,
  bio text,
  status text not null default 'draft', -- draft | active | training
  config jsonb not null default '{}',
  preview_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================
-- MODEL PHOTOS (face refs for LoRA)
-- =====================
create table if not exists model_photos (
  id uuid primary key default uuid_generate_v4(),
  model_id uuid not null references ai_models on delete cascade,
  storage_path text,
  url text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================
-- CONTENT
-- =====================
create table if not exists content (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles on delete cascade,
  model_id uuid references ai_models on delete set null,
  prompt text,
  image_url text,
  status text not null default 'draft', -- draft | approved | archived
  credits_used integer not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- =====================
-- CREDIT TRANSACTIONS
-- =====================
create table if not exists credit_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles on delete cascade,
  amount integer not null, -- positivo = entrada, negativo = consumo
  reason text,
  created_at timestamptz not null default now()
);

-- =====================
-- TRIGGER: Auto-create profile on signup
-- =====================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =====================
-- TRIGGER: Updated_at auto-update
-- =====================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger ai_models_updated_at
  before update on ai_models
  for each row execute function update_updated_at();

-- =====================
-- RLS (Row Level Security)
-- =====================
alter table profiles enable row level security;
alter table ai_models enable row level security;
alter table model_photos enable row level security;
alter table content enable row level security;
alter table credit_transactions enable row level security;

-- Profiles
create policy "profiles_own" on profiles
  for all using (auth.uid() = id);

-- AI Models
create policy "ai_models_own" on ai_models
  for all using (auth.uid() = user_id);

-- Model Photos
create policy "model_photos_own" on model_photos
  for all using (
    model_id in (select id from ai_models where user_id = auth.uid())
  );

-- Content
create policy "content_own" on content
  for all using (auth.uid() = user_id);

-- Credit Transactions
create policy "credit_transactions_own" on credit_transactions
  for all using (auth.uid() = user_id);

-- =====================
-- STORAGE BUCKET (model photos)
-- =====================
insert into storage.buckets (id, name, public)
values ('model-photos', 'model-photos', false)
on conflict (id) do nothing;

create policy "model_photos_upload" on storage.objects
  for insert with check (
    bucket_id = 'model-photos' and auth.uid() is not null
  );

create policy "model_photos_read" on storage.objects
  for select using (
    bucket_id = 'model-photos' and auth.uid() is not null
  );

create policy "model_photos_delete" on storage.objects
  for delete using (
    bucket_id = 'model-photos' and auth.uid() is not null
  );
