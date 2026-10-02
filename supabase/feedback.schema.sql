create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('suggestion', 'bug', 'new_cafe', 'other')),
  message text not null check (char_length(message) between 1 and 2000),
  email text not null default '' check (char_length(email) <= 200),
  lang text not null default '',
  country text not null default '',
  region text not null default '',
  page_url text not null default '',
  user_agent text not null default '',
  status text not null default 'new' check (status in ('new', 'read', 'done')),
  created_at timestamp with time zone not null default now()
);

create index if not exists feedback_created_at_idx
  on public.feedback using btree (created_at desc);

-- 不開任何 policy：只有 /api/feedback 用 service role key 能寫入，前端無法直接讀寫。
alter table public.feedback enable row level security;
