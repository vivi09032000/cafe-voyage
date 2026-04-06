insert into public.cafe_status_reviews (
  status_source, cafe_source, cafe_source_id, country_code, city_key,
  cafe_name, cafe_address, google_place_id, google_business_status, google_maps_url,
  matched_name, matched_address, review_category, review_reason, status_checked_at, is_current
) values
  ('google_places', 'cafenomad', '06044732-8a40-4487-b0dc-6f848bc0dd9e', 'TW', 'yunlin', 'Easy Coffee 現烘手沖咖啡店', '雲林縣麥寮鄉中正路89號', 'ChIJ89uYcVOvbjQRWpfhoVdtygk', 'CLOSED_TEMPORARILY', '', 'Easy Coffee 現烘手沖咖啡店', '中正路89號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', '176c71a3-fb15-4bc2-b1be-29a2ab42aab2', 'TW', 'yunlin', '樺鄉咖啡莊園', '雲林縣古坑鄉桃源1-5號', 'ChIJVWJ4s73GbjQRHv4vxNVneu8', 'CLOSED_PERMANENTLY', '', '樺鄉咖啡莊園', '1號之5', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '4e24cc72-7ab3-41b4-bf39-9916142e225b', 'TW', 'yunlin', 'AOKI咖啡', '雲林縣北港鎮太平路89號', 'ChIJ9xbj4IyibjQR6B8RAR7F588', 'CLOSED_TEMPORARILY', '', 'AOKI CAFE', '太平路89號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', 'd475c8d4-8604-4f37-8a59-1427f9c8127e', 'TW', 'yunlin', '映星園咖啡自家烘培 instarland coffee', '雲林縣北港鎮中華路2-9號', 'ChIJg6gSyFGjbjQRvXtcMl9AGQ8', 'CLOSED_PERMANENTLY', '', '映星園咖啡自家烘焙 instarland coffee', '中華路2之9號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true)
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
