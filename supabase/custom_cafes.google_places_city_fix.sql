update public.custom_cafes
set
  city = city_key,
  updated_at = now()
where country_code = 'TW'
  and source in ('google_places_demo', 'google_places_sample');
