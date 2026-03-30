alter table public.stances
  add column if not exists ticker text not null default '',
  add column if not exists name text not null default '',
  add column if not exists coverage_category text not null default 'equity',
  add column if not exists tags text[] not null default '{}'::text[],
  add column if not exists opinion text not null default 'neutral',
  add column if not exists conviction text not null default 'medium',
  add column if not exists thesis text not null default '',
  add column if not exists coverage_status text not null default 'active',
  add column if not exists scenario_type text not null default 'price',
  add column if not exists bear numeric,
  add column if not exists base numeric,
  add column if not exists bull numeric;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'stances_coverage_category_check'
      and conrelid = 'public.stances'::regclass
  ) then
    alter table public.stances
      add constraint stances_coverage_category_check
      check (coverage_category in ('macro', 'equity', 'market-notes'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'stances_opinion_check'
      and conrelid = 'public.stances'::regclass
  ) then
    alter table public.stances
      add constraint stances_opinion_check
      check (opinion in ('cautious', 'neutral', 'constructive'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'stances_conviction_check'
      and conrelid = 'public.stances'::regclass
  ) then
    alter table public.stances
      add constraint stances_conviction_check
      check (conviction in ('high', 'medium', 'low'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'stances_coverage_status_check'
      and conrelid = 'public.stances'::regclass
  ) then
    alter table public.stances
      add constraint stances_coverage_status_check
      check (coverage_status in ('active', 'monitoring', 'expired'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'stances_scenario_type_check'
      and conrelid = 'public.stances'::regclass
  ) then
    alter table public.stances
      add constraint stances_scenario_type_check
      check (scenario_type in ('price', 'fcf'));
  end if;
end $$;

update public.stances
set
  name = case
    when trim(name) = '' then title
    else name
  end,
  thesis = case
    when trim(thesis) = '' then coalesce(nullif(summary, ''), title)
    else thesis
  end
where trim(name) = ''
   or trim(thesis) = '';

create index if not exists stances_opinion_idx
on public.stances (opinion, coverage_status, published_at desc);
