insert into public.cafe_status_reviews (
  status_source, cafe_source, cafe_source_id, country_code, city_key,
  cafe_name, cafe_address, google_place_id, google_business_status, google_maps_url,
  matched_name, matched_address, review_category, review_reason, status_checked_at, is_current
) values
  ('google_places', 'cafenomad', '00014645-38c8-4eb4-ad9b-faa871d7e511', 'TW', 'chiayi', 'R5小餐館', '嘉義市東區忠孝路205號', 'ChIJn5-gsZGVbjQRqnfpga7UJPc', 'CLOSED_PERMANENTLY', '', 'JASC杰斯克小餐館', '忠孝路205號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '185290e1-8333-4b9a-8f48-0890dabe8a98', 'TW', 'chiayi', 'Picgather吾友野事', '嘉義縣中埔鄉和興村公館97-20號', 'ChIJv-8ZWuSTbjQR1n8uKdI-Pmg', 'CLOSED_TEMPORARILY', '', 'Picgather 吾友野事', '公館97-20號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', '23d131fd-881b-4e4b-92b1-fcb8470cfe3d', 'TW', 'chiayi', '奇喚咖啡', '600嘉義市西區保安一路保安市場29號', 'ChIJk2vraaSXbjQRokBNAgH79jk', 'CLOSED_TEMPORARILY', '', '奇喚咖啡', '600嘉義市東區民權路254號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', '3df93a47-1d47-47ae-b8b2-ee035140293f', 'TW', 'chiayi', '33號咖啡店', '600嘉義市東區義教東路49號600', 'ChIJ4ybIe7CVbjQRprY8yzhl2Ts', 'CLOSED_PERMANENTLY', '', '33號咖啡店', '東義路33號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '7ad3de68-2d10-4f29-a37c-4b012cef7feb', 'TW', 'chiayi', 'Yoi傢俱樂窩', '嘉義市體育路51號', 'ChIJj-P1fUiUbjQR8rrycXGm6Xc', 'CLOSED_PERMANENTLY', '', 'Yoi傢俱', '體育路51號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '8b8bc93e-96d1-4384-bf79-5b279b66dd05', 'TW', 'chiayi', '後站 漫時光', '嘉義市遠東街2號', 'ChIJY32QLyuUbjQRwmpQPqt5ujA', 'CLOSED_PERMANENTLY', '', '後站。漫時光', '自由路101號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '973665e6-207f-4d85-9d87-dc0a4813301b', 'TW', 'chiayi', '832 Coffee Roasters_捌參貳焙煎所', '嘉義市東區成仁街228號', 'ChIJsQKLCTOUbjQRs3DlYAZ7pBw', 'CLOSED_PERMANENTLY', '', '832 Coffee Roasters 捌參貳焙煎所', '成仁街228號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '9b98f0ad-a880-42b6-9070-d4537ad001bc', 'TW', 'chiayi', '咖啡人自家烘焙', '嘉義市民國路170號', 'ChIJUaLajEqUbjQRcK6z-uBAvi8', 'CLOSED_PERMANENTLY', '', '咖啡人自家烘焙', '民國路170號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', 'a9e477c2-236b-401e-abd1-f99a9c6cbf7f', 'TW', 'chiayi', '江鳥咖啡- 嘉義吳鳳北路店', '600嘉義市東區吳鳳北路132號', 'ChIJiWQEo9uVbjQRGmijyA5G2TE', 'CLOSED_PERMANENTLY', '', '江鳥咖啡- 嘉義吳鳳北路店', '吳鳳北路132號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', 'eb2b1a4c-37f7-4269-9d75-0d17af0d0210', 'TW', 'chiayi', 'Dadala cafe', '600嘉義市東區延平街219號', 'ChIJoyTdcgCVbjQRuHdmU4hTqeE', 'CLOSED_TEMPORARILY', '', 'DADALA Cafe & Stationery', '延平街219號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', 'ef4fb4af-523f-44ad-a749-b66aec9c9c1c', 'TW', 'chiayi', '美好咖啡', '嘉義市東區啟明路146號', 'ChIJiwuxhQOVbjQRwMXkB0tfybw', 'CLOSED_TEMPORARILY', '', '美好咖啡店ＭihoCoffee 最後營業日2024/06/30', '啟明路146號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true)
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
