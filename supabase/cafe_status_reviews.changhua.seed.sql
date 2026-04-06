insert into public.cafe_status_reviews (
  status_source, cafe_source, cafe_source_id, country_code, city_key,
  cafe_name, cafe_address, google_place_id, google_business_status, google_maps_url,
  matched_name, matched_address, review_category, review_reason, status_checked_at, is_current
) values
  ('google_places', 'cafenomad', '0ca410ca-5edc-4cbf-b170-b997f5ae58c8', 'TW', 'changhua', '敘杯Sobremesa', '彰化縣彰化市旭光路221號', 'ChIJf9xN0dQ5aTQR1d-qOn0Sps4', 'CLOSED_PERMANENTLY', '', '敘杯Sobremesa', '旭光路221號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '18e98010-98fb-4302-ade2-5c60a03d4946', 'TW', 'changhua', '咪咖啡', '彰化縣彰化市陳稜路189號之1號', 'ChIJPZz8-YQ5aTQRhEFMDwJto2M', 'CLOSED_TEMPORARILY', '', '咪咖啡 Mi_cafe''外帶專門（5/23開始休息，會盡快滿血回歸）', '189號之, No. 1陳稜路', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', '320bb5f3-d6b7-4bb1-8607-fd1743021965', 'TW', 'changhua', '二本咖啡-URBAN CAFE', '彰化縣員林鎮南昌路119號', 'ChIJM7zEUF42aTQRt1573dePEO4', 'CLOSED_PERMANENTLY', '', '二本咖啡Urban Cafe', '南昌路119號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '32ac4b3e-f793-4296-ac8a-0f1617466302', 'TW', 'changhua', 'circus cafe 圓圈咖啡', '彰化縣員林市員東路二段351巷1號', 'ChIJH-0IB1o2aTQR7ZF-_775F-s', 'CLOSED_PERMANENTLY', '', 'Circus Cafe 圓圈咖啡', '員東路二段351巷1號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '3d9d0338-4929-4eb4-9c2f-f30edd7bf236', 'TW', 'changhua', '天外啡鮮', '彰化縣秀水鄉彰水路二段321號', 'ChIJrca5cXpIaTQR5TupcHQQKAg', 'CLOSED_PERMANENTLY', '', '天外啡鮮', '彰水路二段321號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '62253131-3a5b-4970-b39f-2a3fb92e6edc', 'TW', 'changhua', '美寶', '彰化縣花壇鄉中正路186號', 'ChIJO5aHihw4aTQRYkJ9D67YyoY', 'CLOSED_PERMANENTLY', '', '美寶精品咖啡', '中正路186號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '6f9882d3-d68c-4478-9294-1114953c9e01', 'TW', 'changhua', '樂居咖啡', '彰化縣員林市萬年路四段', 'ChIJbYgABFc2aTQRfZNqXsq7zjc', 'CLOSED_PERMANENTLY', '', '樂居咖啡', '510彰化縣員林市萬年路四段82號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '7a4fc96d-680a-44fa-9459-b1a225a3f651', 'TW', 'changhua', '硬巷咖啡 Hard Ln, cafe''', '510彰化縣員林市溝皂北三街70號', 'ChIJqwuzom83aTQRe8UMCp3VmjA', 'CLOSED_TEMPORARILY', '', 'HardLn Cafe', '溝皂北三街70號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', '9c1b23f6-53c1-42a2-bf60-facc9ddec5ea', 'TW', 'changhua', 'Sean''s cafe享樂玩咖', '500彰化縣彰化市長壽街157號', 'ChIJnYubPbg4aTQRFiFYEkTB628', 'CLOSED_PERMANENTLY', '', 'Sean''s cafe享樂玩咖', '長壽街157號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', 'd41ebeed-a6f4-4205-b815-fcf9fa039b98', 'TW', 'changhua', '頂客來咖啡', '彰化縣埤頭鄉文鄉南街103號', 'ChIJn3stZUBLaTQRumGKO1gU0Z4', 'CLOSED_PERMANENTLY', '', '頂客來咖啡', '文鄉南街103號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true)
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
