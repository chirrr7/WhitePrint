alter table public.posts
  add column if not exists body_mdx text not null default '';

update public.posts
set body_mdx = body
where coalesce(body_mdx, '') = ''
  and coalesce(body, '') <> '';

create index if not exists posts_topic_published_idx
on public.posts (topic_id, published_at desc, id desc)
where status = 'published';

insert into public.topics (name, slug, description, sort_order, is_visible)
values
  (
    'Macro',
    'macro',
    'Macroeconomic analysis, policy, liquidity, and cross-asset research.',
    10,
    true
  ),
  (
    'Equity Research',
    'equity',
    'Company-specific work, valuation, and sector notes.',
    20,
    true
  ),
  (
    'Market Notes',
    'market-notes',
    'Short-form observations on price action, positioning, and catalysts.',
    30,
    true
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_visible = excluded.is_visible;
