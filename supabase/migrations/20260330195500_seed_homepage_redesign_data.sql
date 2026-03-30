insert into public.pipeline (
  id,
  codename,
  subtitle,
  redacted,
  category,
  hook,
  format,
  status,
  status_type,
  last_updated,
  sort_order,
  visible
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'THE EIGHT-BODY PROBLEM',
    'Financial Architecture of the 2026 Iran Conflict — Reel Series',
    false,
    array['GEO', 'FOR'],
    'Eight actors. One choke point. The Strait of Hormuz reel series — who absorbs the financial cost when it closes, and for how long?',
    'REEL SERIES — PARTS II–VII',
    'IN PRODUCTION',
    'active',
    'March 2026',
    10,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'PROJECT MERIDIAN',
    null,
    true,
    array['EQ', 'FOR'],
    'The capex cycle is ending. The margin story has not caught up. The model shows the spread — the consensus does not.',
    'EQUITY RESEARCH NOTE',
    'DRAFTING MODEL',
    'drafting',
    'March 2026',
    20,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'CREDIT ARCHITECTURE',
    null,
    true,
    array['MACRO', 'CRED'],
    'Three years of spread compression. One rate path. The convexity nobody is pricing into duration.',
    'MACRO NOTE',
    'RESEARCHING',
    'research',
    'March 2026',
    30,
    true
  )
on conflict (id) do update
set
  codename = excluded.codename,
  subtitle = excluded.subtitle,
  redacted = excluded.redacted,
  category = excluded.category,
  hook = excluded.hook,
  format = excluded.format,
  status = excluded.status,
  status_type = excluded.status_type,
  last_updated = excluded.last_updated,
  sort_order = excluded.sort_order,
  visible = excluded.visible;

insert into public.desk_brief (
  id,
  label,
  badge,
  body,
  sort_order,
  visible
)
values
  (
    '44444444-4444-4444-8444-444444444444',
    'Iran',
    'Caution',
    'Hormuz closure probability non-trivial. Iran''s leverage is asymmetric — the cost of disruption falls harder on Asian importers than on the US, which is a structural shift from 2012.',
    10,
    true
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'GCC',
    'Hold',
    'Saudi and UAE reserve buffers are substantial. The fiscal break-evens matter more than spot prices — both are currently above threshold for a sustained conflict scenario.',
    20,
    true
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'Energy',
    'Watch',
    'Re-acceleration in energy prices would directly constrain Fed easing capacity. Oil above $100 changes the inflation calculus materially. Monitoring.',
    30,
    true
  )
on conflict (id) do update
set
  label = excluded.label,
  badge = excluded.badge,
  body = excluded.body,
  sort_order = excluded.sort_order,
  visible = excluded.visible;

update public.posts
set
  sources_count = seeded.sources_count,
  scenarios_count = seeded.scenarios_count
from (
  values
    ('the-eight-body-problem', 16, 8),
    ('oracle-software-margins-infrastructure-capex', 11, 3),
    ('eog-resources-the-base-case-is-priced-in', 9, 3),
    ('liquidity-squeeze-fed-march-2026', 12, 4)
) as seeded(slug, sources_count, scenarios_count)
where public.posts.slug = seeded.slug;

do $$
begin
  if exists (
    select 1
    from public.posts
    where slug = 'the-eight-body-problem'
      and status = 'published'
  ) and not exists (
    select 1
    from public.posts
    where status = 'published'
      and featured = true
  ) then
    update public.posts
    set featured = true
    where slug = 'the-eight-body-problem';
  end if;
end $$;
