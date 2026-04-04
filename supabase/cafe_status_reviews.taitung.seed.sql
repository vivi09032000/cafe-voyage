insert into public.cafe_status_reviews (
  status_source, cafe_source, cafe_source_id, country_code, city_key,
  cafe_name, cafe_address, google_place_id, google_business_status, google_maps_url,
  matched_name, matched_address, review_category, review_reason, status_checked_at, is_current
) values
  ('google_places', 'cafenomad', '1bc51fea-4bee-46a0-88b6-4a9b830392e6', 'TW', 'taitung', '4.5公里咖啡', '台東縣池上鄉3鄰33號', 'ChIJ_-TGh3QLbzQRCGL18COapyo', 'CLOSED_PERMANENTLY', '', '4.5公里咖啡', '3鄰33號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '1f0599af-cfef-49c7-9b42-603810444b63', 'TW', 'taitung', '洛恩米薩克 Roen Misak', '959台東縣東河鄉號', 'ChIJQUR2iO-ibzQRpU1s2iwxwyM', 'CLOSED_PERMANENTLY', '', '洛恩米薩克 Roen Misak', '959臺東縣東河鄉號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '40ebad36-9d8b-4d73-9dde-d5a8927347bf', 'TW', 'taitung', '石在有人咖啡館', '台東縣綠島鄉公館村60號', 'ChIJ28ZI07KNbzQR1IWxFYoGM28', 'CLOSED_PERMANENTLY', '', '石在有人咖啡館', '60號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '5b940f3f-0769-40bc-a12a-84cc4b00c304', 'TW', 'taitung', 'Deep Coffee', '台東縣台東市豐榮路24巷1號', 'ChIJk_ZWVRq5bzQRGIYKlv4gwIc', 'CLOSED_TEMPORARILY', '', 'Deep Coffee', '豐榮路24巷1號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', 'a346d174-e99d-49c9-b038-064f0266d8db', 'TW', 'taitung', '默默珈琲手沖館', '台東縣池上鄉中華路61號', 'ChIJQ3oC7loNbzQR27XmktbaqTU', 'CLOSED_PERMANENTLY', '', '默默珈琲手沖館 (租約到期囉~房東收回自用~The rent is due, see ya somewhere! Thanks all!)', '中華路61號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true)
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
