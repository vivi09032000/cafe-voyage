drop policy if exists "Admin can insert cafe overrides" on public.cafe_overrides;
create policy "Admin can insert cafe overrides"
on public.cafe_overrides
for insert
to authenticated
with check (
  is_active = true
  and auth.jwt() ->> 'email' = 'vivi09032000@gmail.com'
);

drop policy if exists "Admin can update cafe overrides" on public.cafe_overrides;
create policy "Admin can update cafe overrides"
on public.cafe_overrides
for update
to authenticated
using (
  auth.jwt() ->> 'email' = 'vivi09032000@gmail.com'
)
with check (
  auth.jwt() ->> 'email' = 'vivi09032000@gmail.com'
);
