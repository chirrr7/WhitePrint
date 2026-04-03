-- Allow anonymous (public) reads on in_progress_items so the Research Docket
-- renders correctly for unauthenticated visitors.
drop policy if exists "Public can read in-progress items" on public.in_progress_items;
create policy "Public can read in-progress items"
  on public.in_progress_items
  for select
  to anon
  using (true);

-- Add redacted flag so individual pipeline entries can be partially obscured
-- on the homepage while still signalling that work is in progress.
alter table public.in_progress_items
  add column if not exists redacted boolean not null default false;
