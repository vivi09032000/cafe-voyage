create extension if not exists "pgcrypto";

create table if not exists public.cafe_overrides (
  id uuid primary key default gen_random_uuid(),
  cafe_source text not null default 'cafenomad',
  cafe_source_id text not null,
  country_code text not null default '',
  city_key text not null default '',
  display_name_override text not null default '',
  address_override text not null default '',
  is_hidden boolean not null default false,
  sort_penalty integer not null default 0,
  note text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cafe_source, cafe_source_id)
);

create index if not exists cafe_overrides_lookup_idx
  on public.cafe_overrides (cafe_source, cafe_source_id, is_active);

create index if not exists cafe_overrides_city_idx
  on public.cafe_overrides (country_code, city_key, is_active);

create or replace function public.set_cafe_overrides_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_cafe_overrides_updated_at on public.cafe_overrides;

create trigger set_cafe_overrides_updated_at
before update on public.cafe_overrides
for each row
execute function public.set_cafe_overrides_updated_at();

alter table public.cafe_overrides enable row level security;

drop policy if exists "Public can read active cafe overrides" on public.cafe_overrides;
create policy "Public can read active cafe overrides"
on public.cafe_overrides
for select
to anon, authenticated
using (is_active = true);
