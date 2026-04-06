insert into public.cafe_status_reviews (
  status_source, cafe_source, cafe_source_id, country_code, city_key,
  cafe_name, cafe_address, google_place_id, google_business_status, google_maps_url,
  matched_name, matched_address, review_category, review_reason, status_checked_at, is_current
) values
  ('google_places', 'cafenomad', '1832f5fa-4706-4856-854d-3d08bbc104b2', 'TW', 'pingtung', '小苗苗。精品咖啡 ', '屏東縣屏東市華山街2號', 'ChIJKbH_Ub4XbjQRsyCWAbFiMus', 'CLOSED_PERMANENTLY', '', '小苗苗。精品咖啡', '華山街2號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '39ec33a9-2fc1-4c53-9a7c-7840b77e480c', 'TW', 'pingtung', '厚厚一片-東港旗艦店', '928屏東縣東港鎮明德路90號', 'ChIJgwSneNLhcTQRoIPvxbURAXA', 'CLOSED_PERMANENTLY', '', '厚厚一片東港旗艦店', '明德路90號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '49e55c60-3beb-4b36-a6ea-886f0905b220', 'TW', 'pingtung', 'Eske Place Coffee House', '屏東縣屏東市民享路142號', 'ChIJp0jF3ZMXbjQRXLjEBBiM6CQ', 'CLOSED_TEMPORARILY', '', 'Eske Place Coffee House', '民享路142號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', '833cddcb-c503-4c21-a87f-2c3be6902bb8', 'TW', 'pingtung', '半島咖啡 Fangliao Café', '屏東縣枋寮鄉儲運路7號', 'ChIJTRczdT7ccTQRqaX_XrWwBoA', 'CLOSED_PERMANENTLY', '', '半島咖啡 Fangliao Café', '儲運路7號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', 'b91de885-ddee-4e98-9b67-c16da918a7df', 'TW', 'pingtung', '小白咖啡店', '屏東縣屏東市豐榮街209號旁邊空地', 'ChIJUfj8_L8XbjQR-_yXywZwzyo', 'CLOSED_TEMPORARILY', '', '小白咖啡店', '豐榮街209號旁邊空地', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true)
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
