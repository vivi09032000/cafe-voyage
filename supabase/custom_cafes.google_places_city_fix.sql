update public.custom_cafes
set city = case
  when address like '%台北市%' then '台北市'
  when address like '%臺北市%' then '台北市'
  when address like '%新北市%' then '新北市'
  when address like '%桃園市%' then '桃園市'
  when address like '%台中市%' then '台中市'
  when address like '%臺中市%' then '台中市'
  when address like '%台南市%' then '台南市'
  when address like '%臺南市%' then '台南市'
  when address like '%高雄市%' then '高雄市'
  when address like '%基隆市%' then '基隆市'
  when address like '%新竹市%' then '新竹市'
  when address like '%新竹縣%' then '新竹縣'
  when address like '%苗栗縣%' then '苗栗縣'
  when address like '%彰化縣%' then '彰化縣'
  when address like '%南投縣%' then '南投縣'
  when address like '%雲林縣%' then '雲林縣'
  when address like '%嘉義市%' then '嘉義市'
  when address like '%嘉義縣%' then '嘉義縣'
  when address like '%屏東縣%' then '屏東縣'
  when address like '%宜蘭縣%' then '宜蘭縣'
  when address like '%花蓮縣%' then '花蓮縣'
  when address like '%台東縣%' then '台東縣'
  when address like '%臺東縣%' then '台東縣'
  else city
end,
updated_at = now()
where country_code = 'TW'
  and source in ('google_places_demo', 'google_places_sample');
