create table if not exists public.cafe_score_reports (
  id uuid primary key default gen_random_uuid(),
  cafe_id text not null,
  cafe_name text not null default '',
  cafe_source text not null default '',
  wifi numeric(3, 1) not null check (wifi >= 1 and wifi <= 5),
  seat numeric(3, 1) not null check (seat >= 1 and seat <= 5),
  quiet numeric(3, 1) not null check (quiet >= 1 and quiet <= 5),
  tasty numeric(3, 1) not null check (tasty >= 1 and tasty <= 5),
  cheap numeric(3, 1) not null check (cheap >= 1 and cheap <= 5),
  music numeric(3, 1) not null check (music >= 1 and music <= 5),
  created_at timestamp with time zone not null default now()
);

create index if not exists cafe_score_reports_cafe_id_idx
  on public.cafe_score_reports using btree (cafe_id);

create index if not exists cafe_score_reports_created_at_idx
  on public.cafe_score_reports using btree (created_at desc);

alter table public.cafe_score_reports enable row level security;
