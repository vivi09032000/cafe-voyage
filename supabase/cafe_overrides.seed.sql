insert into public.cafe_overrides (
  cafe_source,
  cafe_source_id,
  country_code,
  city_key,
  display_name_override,
  address_override,
  is_hidden,
  sort_penalty,
  note,
  is_active
) values
  (
    'cafenomad',
    '00e21150-8b6d-4a54-b4bb-5fa45099b15e',
    'TW',
    'taipei',
    '',
    '',
    false,
    100,
    '8號咖啡屋資料待確認，先降排序避免每次測試都跑到最前面。',
    true
  )
on conflict (cafe_source, cafe_source_id) do update set
  country_code = excluded.country_code,
  city_key = excluded.city_key,
  display_name_override = excluded.display_name_override,
  address_override = excluded.address_override,
  is_hidden = excluded.is_hidden,
  sort_penalty = excluded.sort_penalty,
  note = excluded.note,
  is_active = excluded.is_active;
