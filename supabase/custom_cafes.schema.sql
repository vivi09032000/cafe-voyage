create extension if not exists "pgcrypto";

create table if not exists public.custom_cafes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  city text not null,
  country_code text not null,
  country_name text not null,
  city_key text not null,
  city_label text not null,
  wifi numeric(3,1) not null default 0,
  seat numeric(3,1) not null default 0,
  quiet numeric(3,1) not null default 0,
  tasty numeric(3,1) not null default 0,
  cheap numeric(3,1) not null default 0,
  music numeric(3,1) not null default 0,
  url text not null default '',
  address text not null default '',
  latitude numeric(10,7),
  longitude numeric(10,7),
  limited_time text not null default '',
  socket text not null default '',
  standing_desk text not null default '',
  mrt text not null default '',
  open_time text not null default '',
  source text not null default 'manual',
  source_url text not null default '',
  photo_url text not null default '',
  google_place_id text not null default '',
  editor_note text not null default '',
  verified boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists custom_cafes_country_city_idx
  on public.custom_cafes (country_code, city_key);

create index if not exists custom_cafes_published_idx
  on public.custom_cafes (is_published);

create or replace function public.set_custom_cafes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_custom_cafes_updated_at on public.custom_cafes;

create trigger set_custom_cafes_updated_at
before update on public.custom_cafes
for each row
execute function public.set_custom_cafes_updated_at();

alter table public.custom_cafes enable row level security;

drop policy if exists "Public can read published custom cafes" on public.custom_cafes;
create policy "Public can read published custom cafes"
on public.custom_cafes
for select
to anon, authenticated
using (is_published = true);

