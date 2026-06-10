create table if not exists public.region_google_syncs (
  id uuid primary key default gen_random_uuid(),
  country_code text not null default 'TW',
  city_key text not null,
  region_query text not null,
  last_synced_at timestamptz,
  last_status text not null default '',
  last_error text not null default '',
  places_checked integer not null default 0,
  new_cafes_inserted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_code, city_key, region_query)
);

create index if not exists region_google_syncs_lookup_idx
  on public.region_google_syncs (country_code, city_key, region_query);

create or replace function public.set_region_google_syncs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_region_google_syncs_updated_at on public.region_google_syncs;

create trigger set_region_google_syncs_updated_at
before update on public.region_google_syncs
for each row
execute function public.set_region_google_syncs_updated_at();

alter table public.region_google_syncs enable row level security;
