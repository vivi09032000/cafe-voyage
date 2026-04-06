insert into public.cafe_status_reviews (
  status_source, cafe_source, cafe_source_id, country_code, city_key,
  cafe_name, cafe_address, google_place_id, google_business_status, google_maps_url,
  matched_name, matched_address, review_category, review_reason, status_checked_at, is_current
) values
  ('google_places', 'cafenomad', '55ee878d-f982-4c79-8920-fefb27aca5df', 'TW', 'miaoli', '甜宅 cafe''', '苗栗縣苗栗市忠孝路142號', 'ChIJGxx5UQisaTQRorVfoPrIvLI', 'CLOSED_PERMANENTLY', '', '甜宅 Cafe''', '忠孝路142號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '641e60f2-7c85-4ff6-9339-da22310c9de9', 'TW', 'miaoli', 'OLULU Cafe & 傑恩咖啡工廠(苑裡店)', '苗栗縣苑裡鎮上館里九鄰上館180-1號', 'ChIJ-35dhJ0PaTQRjr84hDzrMhU', 'CLOSED_TEMPORARILY', '', 'OLULU Cafe & 傑恩咖啡工廠（OLULU Cafe暫時歇業啦～轉換型態中！新模式還請待後續公告🙏）', '火炎山七路180號358', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true)
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
