insert into public.cafe_status_reviews (
  status_source, cafe_source, cafe_source_id, country_code, city_key,
  cafe_name, cafe_address, google_place_id, google_business_status, google_maps_url,
  matched_name, matched_address, review_category, review_reason, status_checked_at, is_current
) values
  ('google_places', 'cafenomad', '10cbb92a-29aa-46e5-9bb1-4f429f91559d', 'TW', 'hualien', '回春工作室', '花蓮市光復街91-1號', 'ChIJ2TsYcgmfaDQRjpd93J12nlI', 'CLOSED_PERMANENTLY', '', '回春工作室', '建國路75巷16弄26號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '1a7b507f-d8df-482f-b599-4e4f7de21716', 'TW', 'hualien', '花蓮秘密海咖啡', '花蓮縣花蓮市海濱街66號', 'ChIJsU1rOeifaDQR56W01brD6xc', 'CLOSED_TEMPORARILY', '', '秘密海小館', '海濱街66號1樓', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', '60a3c32c-5011-48c1-8ad0-31e0395a840f', 'TW', 'hualien', '亞瑟的王座', '花蓮市中興路81號', 'ChIJq_-gyCEhZjQRyJ6OmOUj_SM', 'CLOSED_PERMANENTLY', '', '亞瑟的王座 AT Cafe', '中興路81號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '7070f1eb-a497-40e7-8706-c346176f8fdf', 'TW', 'hualien', '斗宅。揀茶舍', '花蓮市三民街23號(花蓮縣縣定古蹟檢察長宿舍)', 'ChIJvyyCkVafaDQRafDuV1g5Gr0', 'CLOSED_PERMANENTLY', '', '咖逼小売所 ｜ 斗宅。揀茶舍', '三民街23號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '72838829-ec7a-46f4-97ea-0de4a32a2d9d', 'TW', 'hualien', '小室集合空間', '花蓮市有恆街3號', 'ChIJr-LtlKOfaDQRyU1fEqJK_2o', 'CLOSED_TEMPORARILY', '', '小室咖啡 花蓮總店', '有恆街3號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', '7e2604e2-0bd1-42bc-9c4d-6893fe75fe5f', 'TW', 'hualien', '咖啡舍 Seven Beans', '花蓮市建林街132號', 'ChIJkYAmhL6faDQRrC2AtGcLcxg', 'CLOSED_PERMANENTLY', '', '咖啡舍（營業時間有臨時變動請搜尋臉書及IG)', '建林街132號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', '852b4fa3-8427-4b04-80e3-b598237916a4', 'TW', 'hualien', '众咖啡', '花蓮市中山路624號', 'ChIJZ5_7nbGfaDQRzm9WkUEB2KU', 'CLOSED_PERMANENTLY', '', '众蔬食3.0 - 心滿義足 People''s Cafe（義大利主廚，正念素食(全素/蛋奶素） Italian Chef, Vegetarian and Vegan）', '中山路624號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', 'a6df7233-5a3b-4ee7-9feb-50fe64e73f6f', 'TW', 'hualien', '色香貓精品咖啡', '花蓮市建國路75巷16弄19號', 'ChIJNz4E176faDQRnpvnzlokHFY', 'CLOSED_PERMANENTLY', '', '色香貓咖啡', '建國路75巷16弄19號號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', 'bc937057-a552-48b8-a0da-d1d3b0bfb62c', 'TW', 'hualien', 'Choco Choco 手工巧克力咖啡館', '花蓮市忠孝街70號', 'ChIJSZWJD76faDQR_0dySE8qs3s', 'OPERATIONAL', '', 'Stroll散步咖啡', '忠孝街70號', 'suspected_closed', 'Google matched a different active business at the same address', now(), true),
  ('google_places', 'cafenomad', 'c451e1c0-2f8c-4cbe-a038-5e89f98c2781', 'TW', 'hualien', '吉野精品咖啡烘焙室', '970花蓮縣花蓮市成功街206號', 'ChIJ5yt3LeufaDQRGfUEVg_Us04', 'OPERATIONAL', '', '吉野咖啡', '成功街206號', 'suspected_closed', 'Google matched a different active business at the same address', now(), true),
  ('google_places', 'cafenomad', 'dd4dca91-7f4a-4910-a2f9-2d14ec1b2a77', 'TW', 'hualien', '波米咖啡', '花蓮市民國路 45 號', 'ChIJB9fzcDmfaDQRBWA1M9VbccE', 'CLOSED_PERMANENTLY', '', '波米咖啡館', '2F, No. 581號和平路', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', 'dfd85d0f-5ca6-4e16-ab5c-ffa32b7ff456', 'TW', 'hualien', '珈琲鋪子 (咖啡鋪子)', '花蓮市節約街8號', 'ChIJeRybDMCfaDQRvsjS_5FO1Vw', 'CLOSED_PERMANENTLY', '', '珈琲舖子(咖啡舖子)', '節約街8號', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', 'e1af95d8-9d07-483f-86df-56ca0bd1156b', 'TW', 'hualien', 'Koukouvagia 咕咕發芽咖啡驛棧', '花蓮縣玉里鎮大同路58號', 'ChIJAWylgWRqbzQRgdv-FT89I2o', 'CLOSED_TEMPORARILY', '', 'Koukouvagia 咕咕發芽咖啡驛棧', '大同路58號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true),
  ('google_places', 'cafenomad', 'e433a385-ce45-4778-a23f-2280febb0c8c', 'TW', 'hualien', '月荷塘鄉村廚房', '花蓮縣富里鄉983花蓮縣富里鄉羅山村東湖39號', 'ChIJhwNSKThtbzQRF86UBteeXV0', 'CLOSED_PERMANENTLY', '', '月荷塘鄉村廚房', '983台灣花蓮縣富里鄉', 'suspected_closed', 'Google Places businessStatus = CLOSED_PERMANENTLY', now(), true),
  ('google_places', 'cafenomad', 'ec611d48-7dcb-41d8-a919-619005a8a94e', 'TW', 'hualien', '斗。宅商社 Cafe & Bar', '花蓮市福建街460號 (鐵道文化園區二館內)', 'ChIJG0Ns5hCfaDQRPb_Cyv2ywZI', 'CLOSED_TEMPORARILY', '', '花聲客廳（咖啡&酒吧&週末現場演出）', '福建街460號', 'review', 'Google Places businessStatus = CLOSED_TEMPORARILY', now(), true)
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
