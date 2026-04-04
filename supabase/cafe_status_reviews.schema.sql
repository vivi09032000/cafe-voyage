create extension if not exists "pgcrypto";

create table if not exists public.cafe_status_reviews (
  id uuid primary key default gen_random_uuid(),
  status_source text not null default 'google_places',
  cafe_source text not null default 'cafenomad',
  cafe_source_id text not null,
  country_code text not null,
  city_key text not null,
  cafe_name text not null default '',
  cafe_address text not null default '',
  google_place_id text not null default '',
  google_business_status text not null default '',
  google_maps_url text not null default '',
  matched_name text not null default '',
  matched_address text not null default '',
  review_category text not null default '',
  review_reason text not null default '',
  status_checked_at timestamptz not null default now(),
  manual_override_status text not null default '',
  manual_note text not null default '',
  is_current boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (status_source, cafe_source, cafe_source_id)
);

create index if not exists cafe_status_reviews_lookup_idx
  on public.cafe_status_reviews (cafe_source, cafe_source_id, is_current);

create index if not exists cafe_status_reviews_city_idx
  on public.cafe_status_reviews (country_code, city_key, is_current);

create or replace function public.set_cafe_status_reviews_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_cafe_status_reviews_updated_at on public.cafe_status_reviews;

create trigger set_cafe_status_reviews_updated_at
before update on public.cafe_status_reviews
for each row
execute function public.set_cafe_status_reviews_updated_at();

alter table public.cafe_status_reviews enable row level security;

drop policy if exists "Public can read current cafe status reviews" on public.cafe_status_reviews;
create policy "Public can read current cafe status reviews"
on public.cafe_status_reviews
for select
to anon, authenticated
using (is_current = true);
