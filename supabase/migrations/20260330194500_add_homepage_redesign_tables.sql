create extension if not exists pgcrypto;

alter table public.posts
  add column if not exists sources_count integer,
  add column if not exists scenarios_count integer;

create table if not exists public.pipeline (
  id uuid primary key default gen_random_uuid(),
  codename text not null,
  subtitle text,
  redacted boolean not null default true,
  category text[] not null default '{}',
  hook text,
  format text,
  status text,
  status_type text,
  last_updated text,
  sort_order integer,
  visible boolean not null default true
);

create index if not exists pipeline_visible_sort_idx
  on public.pipeline (visible, sort_order, codename);

create table if not exists public.desk_brief (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  badge text not null,
  body text not null,
  sort_order integer,
  visible boolean not null default true
);

create index if not exists desk_brief_visible_sort_idx
  on public.desk_brief (visible, sort_order, label);
