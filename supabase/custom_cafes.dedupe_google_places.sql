with ranked_place_ids as (
  select
    id,
    row_number() over (
      partition by google_place_id
      order by created_at asc, id asc
    ) as rn
  from public.custom_cafes
  where country_code = 'TW'
    and source in ('google_places_demo', 'google_places_sample')
    and google_place_id <> ''
),
ranked_name_addresses as (
  select
    id,
    row_number() over (
      partition by
        lower(regexp_replace(name, '[[:space:][:punct:]]', '', 'g')),
        lower(regexp_replace(regexp_replace(replace(address, '臺', '台'), '^[0-9]{3,5}', ''), '[[:space:][:punct:]]', '', 'g'))
      order by created_at asc, id asc
    ) as rn
  from public.custom_cafes
  where country_code = 'TW'
    and source in ('google_places_demo', 'google_places_sample')
    and google_place_id = ''
),
duplicates as (
  select id from ranked_place_ids where rn > 1
  union
  select id from ranked_name_addresses where rn > 1
)
delete from public.custom_cafes
where id in (select id from duplicates);

create unique index if not exists custom_cafes_google_place_id_unique_idx
  on public.custom_cafes (google_place_id)
  where google_place_id <> '';
