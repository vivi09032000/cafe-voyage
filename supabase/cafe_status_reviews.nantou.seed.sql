insert into public.cafe_status_reviews (
  status_source, cafe_source, cafe_source_id, country_code, city_key,
  cafe_name, cafe_address, google_place_id, google_business_status, google_maps_url,
  matched_name, matched_address, review_category, review_reason, status_checked_at, is_current
) values
  ('google_places', 'cafenomad', '0bd1257d-7492-4eb9-a810-e01dfbd81b46', 'TW', 'nantou', 'MOST木思埔里店', '南投縣埔里鎮民有三街11號', 'ChIJUfFtJ5HZaDQRxsvFk-uj-4E', 'CLOSED_PERMANENTLY', '', '木思MOST全新健康廚房', '民有三街11號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '8eb26039-4cdc-4148-9fe3-49ad1ba9d096', 'TW', 'nantou', '麥子鄉村咖啡屋 My Coffee', '南投縣草屯鎮信義街25號', 'ChIJIzfKomUwaTQRjDP3B-zG9gQ', 'CLOSED_PERMANENTLY', '', '麥子鄉村咖啡屋 My Coffee', '信義街25號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', 'dfbe73bc-9dff-4dbb-b972-398d3f8b02f7', 'TW', 'nantou', '不靠海工作室', '南投縣埔里鎮育樂路8號', 'ChIJH2O1MaLZaDQRKuLVtKWdGlI', 'CLOSED_PERMANENTLY', '', '不靠海工作室', '育樂路8號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true)
on conflict (status_source, cafe_source, cafe_source_id) do update set
  country_code = excluded.country_code,
  city_key = excluded.city_key,
  cafe_name = excluded.cafe_name,
  cafe_address = excluded.cafe_address,
  google_place_id = excluded.google_place_id,
  google_business_status = excluded.google_business_status,
  google_maps_url = excluded.google_maps_url,
  matched_name = excluded.matched_name,
  matched_address = excluded.matched_address,
  review_category = excluded.review_category,
  review_reason = excluded.review_reason,
  status_checked_at = excluded.status_checked_at,
  is_current = excluded.is_current;
