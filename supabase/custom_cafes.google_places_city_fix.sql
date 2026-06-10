with fixed as (
  select
    id,
    case
      when address like '%台北市%' or address like '%臺北市%' or address like '%新北市%' then 'taipei'
      when address like '%桃園市%' then 'taoyuan'
      when address like '%台中市%' or address like '%臺中市%' then 'taichung'
      when address like '%台南市%' or address like '%臺南市%' then 'tainan'
      when address like '%高雄市%' then 'kaohsiung'
      when address like '%基隆市%' then 'keelung'
      when address like '%新竹市%' or address like '%新竹縣%' then 'hsinchu'
      when address like '%苗栗縣%' then 'miaoli'
      when address like '%彰化縣%' then 'changhua'
      when address like '%南投縣%' then 'nantou'
      when address like '%雲林縣%' then 'yunlin'
      when address like '%嘉義市%' or address like '%嘉義縣%' then 'chiayi'
      when address like '%屏東縣%' then 'pingtung'
      when address like '%宜蘭縣%' then 'yilan'
      when address like '%花蓮縣%' then 'hualien'
      when address like '%台東縣%' or address like '%臺東縣%' then 'taitung'
      else city_key
    end as fixed_city_key
  from public.custom_cafes
  where country_code = 'TW'
    and source in ('google_places_demo', 'google_places_sample')
)
update public.custom_cafes c
set
  city = fixed.fixed_city_key,
  city_key = fixed.fixed_city_key,
  city_label = case fixed.fixed_city_key
    when 'taipei' then '台北'
    when 'taoyuan' then '桃園'
    when 'taichung' then '台中'
    when 'tainan' then '台南'
    when 'kaohsiung' then '高雄'
    when 'keelung' then '基隆'
    when 'hsinchu' then '新竹'
    when 'miaoli' then '苗栗'
    when 'changhua' then '彰化'
    when 'nantou' then '南投'
    when 'yunlin' then '雲林'
    when 'chiayi' then '嘉義'
    when 'pingtung' then '屏東'
    when 'yilan' then '宜蘭'
    when 'hualien' then '花蓮'
    when 'taitung' then '台東'
    else c.city_label
  end,
  updated_at = now()
from fixed
where c.id = fixed.id;
