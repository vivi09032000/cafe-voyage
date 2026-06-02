create table if not exists public.user_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  cafe_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, cafe_id)
);

alter table public.user_favorites enable row level security;

drop policy if exists "Users can read own favorites" on public.user_favorites;
create policy "Users can read own favorites"
on public.user_favorites
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own favorites" on public.user_favorites;
create policy "Users can insert own favorites"
on public.user_favorites
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own favorites" on public.user_favorites;
create policy "Users can update own favorites"
on public.user_favorites
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own favorites" on public.user_favorites;
create policy "Users can delete own favorites"
on public.user_favorites
for delete
to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete on public.user_favorites to authenticated;
