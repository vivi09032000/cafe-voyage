insert into public.cafe_status_reviews (
  status_source, cafe_source, cafe_source_id, country_code, city_key,
  cafe_name, cafe_address, google_place_id, google_business_status, google_maps_url,
  matched_name, matched_address, review_category, review_reason, status_checked_at, is_current
) values
  ('google_places', 'cafenomad', '1bc51fea-4bee-46a0-88b6-4a9b830392e6', 'TW', 'taitung', '4.5公里咖啡', '台東縣池上鄉3鄰33號', 'ChIJ_-TGh3QLbzQRCGL18COapyo', 'CLOSED_PERMANENTLY', '', '4.5公里咖啡', '3鄰33號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '1f0599af-cfef-49c7-9b42-603810444b63', 'TW', 'taitung', '洛恩米薩克 Roen Misak', '959台東縣東河鄉號', 'ChIJQUR2iO-ibzQRpU1s2iwxwyM', 'CLOSED_PERMANENTLY', '', '洛恩米薩克 Roen Misak', '959臺東縣東河鄉號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '382bb93b-60b9-4493-a920-7e3080b10521', 'TW', 'taitung', '蘭嶼海很藍咖啡', '台東蘭嶼鄉紅頭村4號', 'ChIJ_____0AJcDQR6leWtmPBpDI', 'OPERATIONAL', '', '海很藍咖啡/手作選物', '紅頭4號', 'suspected_closed', 'Google matched a different active business at the same address', now(), true),
  ('google_places', 'cafenomad', '40ebad36-9d8b-4d73-9dde-d5a8927347bf', 'TW', 'taitung', '石在有人咖啡館', '台東縣綠島鄉公館村60號', 'ChIJ28ZI07KNbzQR1IWxFYoGM28', 'CLOSED_PERMANENTLY', '', '石在有人咖啡館', '60號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '43a5da84-34a2-430c-8e5c-c8230cfde045', 'TW', 'taitung', '墾墨咖啡館', '台東市更生路1208號', 'ChIJ9Z2UBnm5bzQR1xN0aERJF7I', 'OPERATIONAL', '', '墾墨咖啡 Community Cafe''（Last Order 17:00)', '更生路1208號', 'suspected_closed', 'Google matched a different active business at the same address', now(), true),
  ('google_places', 'cafenomad', '5b940f3f-0769-40bc-a12a-84cc4b00c304', 'TW', 'taitung', 'Deep Coffee', '台東縣台東市豐榮路24巷1號', 'ChIJk_ZWVRq5bzQRGIYKlv4gwIc', 'CLOSED_TEMPORARILY', '', 'Deep Coffee', '豐榮路24巷1號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', '8fce43d2-9b7d-4f05-b537-71b38f555c9d', 'TW', 'taitung', 'Wow’s邦查（波浪屋2號倉庫）', '台東縣新生路105號', 'ChIJLeAZ5xW5bzQRdwkrQJN7xPk', 'OPERATIONAL', '', '台東波浪屋-原民文創產業聚落 TTstyle Arts & Crafts-Wavy Roof Crafts', '新生路105號', 'suspected_closed', 'Google matched a different active business at the same address', now(), true),
  ('google_places', 'cafenomad', 'a346d174-e99d-49c9-b038-064f0266d8db', 'TW', 'taitung', '默默珈琲手沖館', '台東縣池上鄉中華路61號', 'ChIJQ3oC7loNbzQR27XmktbaqTU', 'CLOSED_PERMANENTLY', '', '默默珈琲手沖館 (租約到期囉~房東收回自用~The rent is due, see ya somewhere! Thanks all!)', '中華路61號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', 'b1eb66c2-9fd2-4269-9e06-e67db079d79e', 'TW', 'taitung', 'Coffeeloft-咖啡工寓', '台東市浙江路36號', 'ChIJ09NnNEC5bzQRLCt2axHt8_4', 'OPERATIONAL', '', '咖啡工寓｜台東民宿1569號 咖啡店固定週二店休', '浙江路36號', 'suspected_closed', 'Google matched a different active business at the same address', now(), true),
  ('google_places', 'cafenomad', 'c61193cf-be30-42d5-92ab-e556042ef631', 'TW', 'taitung', '友蛇咖啡', '台東市岩灣路298號', 'ChIJqbngCW67bzQRtcACLUSEI0g', 'OPERATIONAL', '', 'Snake Cafe', '岩灣路298號', 'suspected_closed', 'Google matched a different active business at the same address', now(), true),
  ('google_places', 'cafenomad', 'd26d6524-0a2a-48fc-801c-b533c4b7cd9f', 'TW', 'taitung', '佐佑品有機咖啡莊園', '963台東縣太麻里乡太麻里鄉89之1號', 'ChIJdf3wGWbJbzQR7u8eCHQTdZM', 'OPERATIONAL', '', '佐佑品咖啡', '963臺東縣太麻里鄉89之1號', 'suspected_closed', 'Google matched a different active business at the same address', now(), true),
  ('google_places', 'cafenomad', 'dafd0066-d029-4730-b5fc-3ca22f431450', 'TW', 'taitung', '山木咖啡', '台東市中華路四段99號', 'ChIJQybbQw65bzQRq9DJ6nZzwGw', 'OPERATIONAL', '', '山木 SunMoon', '中華路四段99號', 'suspected_closed', 'Google matched a different active business at the same address', now(), true)
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
