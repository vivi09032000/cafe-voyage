# Taipei Google Places Closure Review

Checked at: 2026-04-04T09:35:05.884Z

Google Places was used as the primary signal for closure review.

這份報表已經改成 review-friendly 版本：先看總覽，再分成幾個需要人工確認的群組。

## 總覽

- 總店數：1675
- Google 判定仍在營業：936
- 疑似永久歇業：361
- 疑似暫停營業：69
- 找不到 Google Places 候選：10
- API / 權限 / 配額問題：34
- Google 有回店家但沒有 business status：3

## 1. 疑似永久歇業

| 店名 | 資料地址 | Google 比對地址 | 狀態 | Google Maps |
| --- | --- | --- | --- | --- |
| 日子選食 | 台北市大同區赤峰街17巷20-1號 | 赤峰街17巷20-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12486582941562416257&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 石尚自然探索屋【冷水坑店】 | 台北市士林區菁山路101巷170號Ｂ1 | 菁山路101巷170號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4827204707879622787&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 好聊咖啡 | 台北市信義區忠孝東路四段553巷16弄7號 | 忠孝東路四段553巷22弄4-1號 | OPERATIONAL |  |
| 亞姆貝妮 Family Café | 台北市敦化北路145巷5號1樓 | 敦化北路145巷5號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3356574944687278207&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 和茗甘味處 | 106台灣台北市大安區金華街221號 | 金華街221號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4943355241013027625&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 河田咖啡館 | 台北市中山區長春路22號 | 長春路22號 | OPERATIONAL |  |
| 咦咖啡Yi café (已歇業) | 新店區民權路178號 | 民權路178號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11321849964385971063&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 神農市場MAJI FOOD & DELI | 台北市中山區玉門街1號 | 玉門街1號 | OPERATIONAL |  |
| 富錦樹353咖啡 | 105台灣台北市松山區富錦街353號 | 富錦街353號 | OPERATIONAL |  |
| 塔吉特信義人文會館 | 台北市信義區莊敬路423巷1弄2號 | 莊敬路423巷1弄2號 | OPERATIONAL |  |
| 路易莎咖啡Louisa Coffee 中和新生店 | 新北市中和區新生街136號 | 新生街136號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11355458832379766207&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 爐鍋咖啡＠小藝埕 | 台北市大同區迪化街一段32巷1號2樓 | 迪化街一段32巷1號2F | OPERATIONAL |  |
| Aka Coffee Brewers | 中山北路一段126巷2號 | 中山北路一段126巷3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10450185028223606907&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| CAFELAURENT | 台北市大安區忠孝東路四段219號 | 106臺北市大安區忠孝東路四段181巷40弄15號1樓 | OPERATIONAL |  |
| coffee blablabla 南京新生店 | 台北市中山區南京東路二段6號 | 南京東路二段6號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11775779685813461466&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Hi Nei Dou | 台北市金山南路二段141巷36號 Taipei, Taiwan | 106臺北市大安區金山南路二段141巷36號 | OPERATIONAL |  |
| HWC 黑沃咖啡 永和中山店 | 234新北市永和區中山路一段207號 | 中山路一段207號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3790394605668694910&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| K's New Coffee | 115 Taipei 臺北市八德路四段788號 | 八德路四段788號1樓 | OPERATIONAL |  |
| LaDouceur品悅糖 | 116台灣台北市大安區金華街223號 | 金華街223號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13387505378467008562&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| P Café | 淡水區中正路180號2樓 | 中正路180號 二樓 (由PORTER進入 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6528828936429684982&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Pâtisserie ALEX 法式甜點 | 台北市信義區忠孝東路四段553巷18號 | 忠孝東路四段553巷22弄37號 | OPERATIONAL |  |
| SoulOut Showroom Cafe 索奧咖啡 | 台北市中山區中山北路二段26巷29號 | 中山北路二段26巷29號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8194587765423634326&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| (暫停營業) The Kaffa Lovers | 台北市中正區金山北路3號 | 金山北路3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9248244450578369628&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 1:12 | 100台北市中正區羅斯福路四段92號(11號攤位) | 100臺北市中正區羅斯福路四段92號 | OPERATIONAL |  |
| 202 coffeebar | 新北市汐止區仁愛路202號 | 仁愛路202號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9920562938727528948&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 25hrs Coffee CO. | 台北市大安區臨江街42號 | 106臺北市大安區臨江街42號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14554056014226245884&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 3 Cafe Studio | 台北市中山區建國北路二段18號 | 建國北路二段18號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4664742880415678987&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 313 咖啡魔豆屋 | 台北市信義區基隆路二段19-1號 | 基隆路二段19-1號 | OPERATIONAL |  |
| 392 café | 台北市大同區民生西路392號 | 民生西路392號 | OPERATIONAL |  |
| 4Mano Caffé | 106台北市大安區復興南路二段65-1號 | 復興南路二段65-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16462161709160722169&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 515 Cafe&Books | 台北市大安區永康街75巷22號 | 永康街75巷22號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11668600786133262432&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 8% Ice Cafe | 10651台北市大安區永康街23巷6號 | 永康街23巷6號1樓 | OPERATIONAL |  |
| 85度C 台北永吉店 | 台北市信義區永吉路269號 | 永吉路269號 | OPERATIONAL |  |
| 917 好事咖啡創意廚房 | 台北市大安區安居街8巷19號 | 安居街8巷19號1樓 | OPERATIONAL |  |
| 一日一咖啡 One day coffee | 103台北市大同區庫倫街13巷2弄2號1樓 | 庫倫街13巷2弄2號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2783521864091793495&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 一席/Alone Together（已停業） | 台北市大安區延吉街294號 | 延吉街294號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9461555071205016833&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 九日咖啡 自家烘焙咖啡館（本店） | 108台北市萬華區廣州街213號 | 廣州街213號 | OPERATIONAL |  |
| 九號公寓caf'e手作館 | 100台北市中正區羅斯福路三段9號 | 羅斯福路三段9號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8714522801038996604&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 二條通．綠島小夜曲 | 10491台北市中山區中山北路一段33巷1號 | 中山北路一段33巷1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17060393833670898646&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 二會 gojiby | 台北市中山區華陰街21號2樓 | 華陰街21號2樓 | OPERATIONAL |  |
| 人性空間 新生南路店 | 台北市大安區新生南路三段60巷7號一樓 | 新生南路三段60巷7號 | OPERATIONAL |  |
| 十九本舖 | 新北市林口區文化二路一段86號 | 文化二路一段86號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=18172148722856482332&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 三峽老街一粟咖啡 | 三峽區民權路93號 | 民權街93號 | OPERATIONAL |  |
| 三隻貓頭鷹3owls c＠fe | 106台北市大安區和平東路二段96巷15弄38號 | 和平東路二段96巷15弄38號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7520541695921261878&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 上島咖啡店（誠品站前店） | 台北市中正區忠孝西路一段49號 | b1, No. 49號忠孝西路一段 | OPERATIONAL |  |
| 上島珈琲店 | 106台北市大安區敦化南路1段199號 | 敦化南路1段199號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3621930321570474429&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 久聆逅 The Nineties Coffee | 新北市三重區五華街218號 | 五華街218號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11578655230046790809&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 勺子雜貨咖啡 Spoongoods & cafe | 台北市松山區民生東路四段97巷4弄2-1號 | 民生東路四段97巷4弄2-1號號 | OPERATIONAL |  |
| 大鶴黑寶 hobo coffee place | 104台北市中山區南京東路一段13巷7弄9號1樓 | 南京東路一段13巷7弄9號1樓 | OPERATIONAL |  |
| 小公館Cafe / La Bistro Cafe | 台北市中正區羅斯福路三段316巷8弄3號2樓 | 羅斯福路三段316巷8弄3號2樓 | OPERATIONAL |  |
| 小虎Cafe | 台北市永康街30-1號 | 永康街30-1號 | OPERATIONAL |  |
| 小紅帽咖啡Julius Meinl | 台北市大安區大安路一段170號 | 大安路一段172號之二 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5918152948210577521&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 小苗苗。精品咖啡 | 屏東縣屏東市華山街2號 | 華山街2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16947716860123947187&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 小森咖啡 | 新北市新莊區瓊泰路103號 | 瓊泰路103號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9544530312288046696&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 小圓桌Café | 11274台北市北投區西安街二段275巷16號 | 西安街二段275巷16號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9598700373001183037&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 小路上。Dear Deer（已歇業） | 台北市大安區羅斯福路二段77巷7號1-3F | 羅斯福路二段77巷7號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15355598145866116911&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 山田珈琲店 YAMADA COFFEE | 台北市羅斯福路三段283巷21弄3號 | 羅斯福路三段283巷21弄3號 | OPERATIONAL |  |
| 丹家咖啡大安店 | 台北市復興南路一段340巷12號 | 復興南路一段340巷12號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3764512271004006678&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 丹堤咖啡 | 台北市大安區和平東路三段38號 | 和平東路三段38號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16513867754488950435&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 丹提咖啡 第一飯店店 | 10491台北市中山區南京東路二段63號 | 南京東路二段63號 | OPERATIONAL |  |
| 元食cafe | 110台北市信義區逸仙路42巷17號 | 110臺北市信義區逸仙路42巷17號1樓 | OPERATIONAL |  |
| 元益蔘藥行與寶來咖啡 | 242新北市新莊區建安街121巷30號 | 建安街121巷30號 | OPERATIONAL |  |
| 公園咖啡 Le Park | 台北市中山區遼寧街146號 | 遼寧街146號 | OPERATIONAL |  |
| 勾癮咖啡GOEE COFFEE | 台北市大安區和平東路二段293號 | 106臺北市大安區和平東路二段293號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=1169952842799653289&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 天使水晶心花園 | 三重區集賢路 | 集賢路110-3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13417557614979538458&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 日々生 日日生 | 新北市汐止區建成路178巷6號1樓 | 建成路178巷6號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15348714450540436892&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 月半咖啡 Dwaco Coffee | 106台北市大安區永康街47巷30號 | 30號, No. 30永康街47巷 | OPERATIONAL |  |
| 木法 | 新北市中和區和平街11號 | 235新北市中和區和平街11-2號 | OPERATIONAL |  |
| 仙笛咖啡 | 台北市士林區福港街292號 | 福港街292號, 1 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7333456338421775153&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 冉冉生活-南港店 | 115台北市南港區經貿二路196-1號 | 經貿二路196-1號 | OPERATIONAL |  |
| 加利利小鎮咖啡館 | 247新北市蘆洲區三民路98巷15號 | 三民路98巷15號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12702418374034921651&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 加爾第咖啡 | 台北市信義區吳興街600巷78號 | 吳興街600巷78號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14377149102719205124&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 卡那達咖啡店 | 台北市中正區臨沂街13巷5號 | 臨沂街13巷5號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13461617517811716759&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 卡門咖啡 | 新北市板橋區文化路一段435巷31弄6號 | 文化路一段435巷31弄6號 | OPERATIONAL |  |
| 古月珈琲 | 台北市汀州路4段144號 | 汀州路四段144號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4697658128429521676&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 外兒 . Stay Awhile | 新北市板橋區文化路一段45巷18號 | 文化路一段45巷18號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7379069711982701141&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 左巴咖啡（自家烘焙咖啡廳）Zorba Coffe | 111台北市士林區後港街182號 | 後港街182號 | OPERATIONAL |  |
| 左道 MinDemons(已歇業) | 台北市大安區延吉街70巷2弄5號 | 延吉街70巷2弄5號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8869681668967731060&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 巧克哈客巧克力專飲店 | 106台灣台北市大安區永康街7巷2號 | 永康街7巷2號 | OPERATIONAL |  |
| 布夏拉堤 | 台北市內湖區康寧路一段76號 | 康寧路一段76號 | OPERATIONAL |  |
| 布朗奇咖啡 敦南店 | 台北市大安區敦化南路二段182號 | 敦化南路二段182號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9719316283059989456&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 生活在他方 elsewhere cafe | 重慶南路三段5號1樓 | 100臺北市中正區重慶南路三段5號 | OPERATIONAL |  |
| 田中園咖啡廳，環亞店 | 台北市松山區南京東路三段303巷14弄2號 | 南京東路三段303巷14弄2號 | OPERATIONAL |  |
| 白胖咖啡Cafe | 台北市中正區南昌路一段36號1樓 | 南昌路一段36號1樓 | OPERATIONAL |  |
| 白蓮達coffee | 台北市中山區松江路330巷14號 | 松江路330巷14號1樓 | OPERATIONAL |  |
| 白鬍子咖啡（已停業） | 台北市大同區重慶北路三段25巷26號 | 重慶北路三段25巷26號號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15746984468058381935&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 石尚自然探索屋【小油坑店】 | 台北市北投區竹子湖路69號B1 | 竹子湖路69號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15605853394364818293&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 石尚自然探索屋【陽明山店】 | 台北市北投區竹子湖路1之20號Ｂ1 | 竹子湖路1-20號號 號B1 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10036034656584938800&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 石尚雨林店(老虎) | 臺北市文山區新光路二段30號 | 116臺北市文山區新光路二段30號 | OPERATIONAL |  |
| 石尚撒哈拉店(駱駝區) | 臺北市文山區新光路二段30號 | 116臺北市文山區新光路二段30號 | OPERATIONAL |  |
| 石尚LAB科學咖啡 | 台北市士林區士商路189號B1 (台北士林科教館) | 士商路189號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15615610207958532828&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 伍伍零 | 台北市士林區福華路147巷27號 | 111臺北市士林區福華路147巷27號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15935059812102862301&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 光一旅集 | 台北市大安區羅斯福路三段331號2樓 | 羅斯福路三段331號, 2 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2827942911291784796&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 光一敘集 | 台北市中山區中山北路二段20巷2-2號 | 中山北路二段20巷2-2號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8855663999730081809&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 光初日和 Hikari Café | 220新北市板橋區光正街18巷1號1樓 | 光正街18巷1號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15308796350842076724&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 光孚空間 | 台北市大安區基隆路二段132巷15號1樓 | 基隆路二段132巷15號 | OPERATIONAL |  |
| 光扉5號 | 台北市大安區大安路一段31巷5號 | 大安路一段31巷5號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14767762730906298010&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 光景 SCENE SELECT | 台北市松山區健康路11-1號 | 健康路11-1號店面（默光咖啡1樓 | OPERATIONAL |  |
| 光權 Kuang's Bistro | 新北市板橋區光正街32號 | 光正街32號 | OPERATIONAL |  |
| 吉米蘿絲咖啡 | 台北市文山區和興路19號 | 和興路19號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6466530490523895201&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 好氏品牌研究室 | 台北市大安區溫州街48巷22號 | 106臺北市士林區溫州街48巷22號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=1420517562195327737&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 好杯咖啡 | 台北市大同區昌吉街22號 | 昌吉街22號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=40751583986656579&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 好哆福 | 台北市中正區紹興南街15-2號 | 100臺北市中正區紹興南街15-2號 | OPERATIONAL |  |
| 好滴Deip Cafe環球板橋車站店 | 220新北市板橋區縣民大道二段七號二樓 | 縣民大道二段7號 號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10307996679864334984&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 安納塔夏 | 台北市內湖區內湖路二段152號 | 1樓, No. 152號內湖路二段 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10985967400792282387&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 忈人咖啡 | 台北市信義區莊敬路289巷4弄24號 | 莊敬路289巷4弄24號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2855362178088129140&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 成真咖啡永康店 | 台北市大安區永康街37巷6號 | 永康街37巷6號 | OPERATIONAL |  |
| 旭舊cafe | 220新北市板橋區中山路一段206巷39號 | 中山路一段206巷39號 | OPERATIONAL |  |
| 有地UDE Café Bistro | 台北市 萬華區開封街二段62號 | 開封街二段62號 | OPERATIONAL |  |
| 有河書店 | 112台北市北投區東華街二段380號1樓 | 東華街二段380號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3686521318642092485&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 朵朵開咖啡 | 台北市內湖區內湖路二段103巷38號 | 內湖路二段103巷38號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4680031209267931382&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 米洛町 | 103台北市大同區迪化街一段259號一樓 | 迪化街一段259號一樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7342260243902464581&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 米若可coffee | 新北市永和區大新街18號 | 大新街18號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=881548758470673388&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 羊羽咖啡自家烘培 | 台北市文山區辛亥路4段239號 | 辛亥路四段239號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7055275411517026436&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 老木咖啡 | 台北市大安區和平東路三段119巷11號 | 和平東路三段119巷11號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7093682895729413304&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 老爸咖啡有限公司 LE BAR COFFEE | 103台北市大同區塔城街64號3樓 | 塔城街64號3 樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2893750399997603907&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 老窩咖啡-林口仁愛店 | 244新北市林口區仁愛路二段257號 | 仁愛路二段257號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17121164962495818013&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 自由溫室liberbox | 新北市永和區水源街21巷2號 | 水源街21巷2號 | OPERATIONAL |  |
| 自家屋咖啡焙煎專賣店 | 台北市內湖區內湖路一段437巷4弄2號 | 內湖路一段437巷4弄2號 | OPERATIONAL |  |
| 自然產 | 新北市板橋區重慶路209號 | 220新北市板橋區重慶路209號 | OPERATIONAL |  |
| 自然醒咖啡公寓 | 台北市大安區和平東路二段157號2樓 | 和平東路二段157號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5819989561630286825&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 自然關係咖啡製造舍 | 台北市內湖區民權東路六段180巷8號1樓 | 民權東路六段180巷8號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5442889033849351879&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 艸地掛 | 新北市汐止區建成路178巷6號1樓 | 建成路178巷6號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=1147588669905266461&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 艸蘊 | 台北市中正區和平西路一段81號 | 和平西路一段81號 | OPERATIONAL |  |
| 艾白旅生 Alba Cafe | 220新北市板橋區雙十路三段10巷24號 | 雙十路三段10巷24號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15986833695302294739&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 艾格爾咖啡 | 新北市板橋區宏國路53號 | 宏國路53號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17122573737884487360&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 行旅者驛站 | 新北市板橋區忠孝路275號 | 忠孝路275號 | OPERATIONAL |  |
| 行路咖啡 | 106台北市大安區和平東路一段104巷6號1樓 | 和平東路一段104巷6號1樓 | OPERATIONAL |  |
| 西雅圖中信門市 | 台北市南港區經貿二路186 號 b 棟 3 樓 | 115臺北市南港區經貿二路186 號B棟3樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16019976531916705550&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 西雅圖咖啡世貿旗艦店 | 台北市信義區信義路五段6號 | 信義路五段6號 | OPERATIONAL |  |
| 西雅圖極品咖啡 忠孝倍利店 | 100台北市中正區忠孝東路二段93之1號 | 忠孝東路二段93之1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8109400841699178797&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 西雅圖極品嚴焙咖啡館 Barista Premium | 106台北市大安區忠孝東路四段250號 | 忠孝東路四段250號 | OPERATIONAL |  |
| 阡日咖啡供應所KŌFĪ SUPPLIER | 台北市大同區赤峰街41巷1-4號 | 赤峰街41巷1-4號二樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12429025121904586739&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 伯朗咖啡(重慶三店) | 台北市大同區重慶北路三段57號 | 重慶北路三段57號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14017867708929690443&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 伯朗咖啡館 中山三店 | 台北市中山區中山北路三段6號 | 中山北路三段6號 | OPERATIONAL |  |
| 伯朗咖啡館中山二店 | 台北市中山區中山北路一段106之1號 (長安西路口) | 10491臺北市中山區中山北路三段6號 | OPERATIONAL |  |
| 你後面 | 木柵路三段48巷1弄2號 | 木柵路三段48巷1弄2號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9771807288741993037&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 初米咖啡 Choose Me Cafe&Meals | 台北市中山區錦州街423之1號 | 錦州街423-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17343294902254999069&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 初曼咖啡分店 | 台北市萬華區貴陽街二段29巷1號 | 貴陽街二段29巷1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8615146060184982381&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 初聲・true sound  手沖咖啡 | 台北市中正區衡陽路84巷3號 （定位衡陽路86號，窄巷口） | 衡陽路84巷3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12271118080362400801&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 我們 | 新北市中和區明義街8號 | 明義街8號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5189385758149707106&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 沐吉Moöji cafe | 103台北市大同區重慶北路一段88號 | 重慶北路一段88號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6226506754708268104&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 沒有特別計畫cafe | New Taipei City, Tamsui District, 中山北路一段207巷37弄1號 | 中山北路一段207巷37弄1號 | OPERATIONAL |  |
| 沛二/ what the shot （已結束營業） | 台北市松山區健康路189號 | 健康路189號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17352784325414286867&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 玖仰茶食文化 | 106台北市大安區永康街9-1號 | 永康街9-1號 | OPERATIONAL |  |
| 良食究好市集餐廳WONMI | 台北市八德路四段138號 (京華城 Living Mall 10 F) | 八德路四段138號10F | CLOSED_PERMANENTLY | https://maps.google.com/?cid=1991218752609902997&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 角藍色 Cafe | 台北市士林區天母東路8巷93號 | 天母東路8巷93號1樓 | OPERATIONAL |  |
| 豆咖啡 BEANCAFE   北投店 | 台北市北投區豐年路一段49號 | 豐年路一段49號 | OPERATIONAL |  |
| 邦客思精品咖啡 | 新北市新店區中興路二段51號 | 231新北市新店區中興路二段51號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15674482109963194929&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 里山咖啡（已停業） | 台北市中山區伊通街66巷17號 | 伊通街66巷17號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11980124095454681170&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 亞舍咖啡 | 台北市大安區新生南路三段60巷1號 | 新生南路三段60巷1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6168552665846515304&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 享空間 Sharing Space | 236新北市土城區中華路一段30-1號 | 中華路一段30-1號 | OPERATIONAL |  |
| 享窩咖啡 | 台北市文山區指南路二段10-32 | 指南路二段32號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8241141570882108868&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 享窩咖啡 | 台北市文山區指南路二段32號2樓 | 指南路二段32號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8241141570882108868&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 來北投泡咖啡 | 台北市北投區溫泉路110-1號1樓 | 溫泉路110-1號號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16198732406258651380&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 來吧 Cafe | 台北市大安區信義路3段134巷12號 | 信義路三段134巷12號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7288893831219727203&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 來唄咖啡 | 臺北市大同區民權西路139號 | 民權西路139號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14134572168648712012&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 和本咖啡 | 台北市中正區汀州路一段271號 | 汀州路一段271號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9137431368607145191&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 咖啡．候機室The Departure Lounge台北長春店 | 104台北市中山區長春路126-1號1樓 | 長春路126-1號1樓 | OPERATIONAL |  |
| 咖啡休日Day off | 100台北市中正區羅斯福路四段136巷6弄23號 | 羅斯福路四段136巷6弄23號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14075721947516890305&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 咖啡原味-自家烘焙咖啡館 | 103台北市大同區長安西路145巷16號 | 長安西路145巷16號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17027180769575676336&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 咖啡視野CoffeeView Studio | 台北市萬華區大理街131號 | 108臺北市萬華區大理街131號1樓 | OPERATIONAL |  |
| 咖啡葉 CoffeeLeaf | 241新北市三重區正義北路77號 | 正義北路77號 | OPERATIONAL |  |
| 咖啡瑪榭忠孝店 | 台北市大安區敦化南路一段233巷62號 | 敦化南路一段233巷62號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6543974604719285228&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 咖啡鴨(關渡自然園區附設) | 台北市北投區關渡路55號 | 關渡路55號 | OPERATIONAL |  |
| 咖啡講南五店 | 台北市南京東路五段68-1號1樓 | 南京東路五段68之1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14286163181635815877&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 咖博館 台北民生東店 | 台北市松山區民生東路五段89號1樓 | 民生東路五段89號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16803416022389271926&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 咖樂烘豆colorroast | 台北市大安區延吉街68號-16號 | 延吉街68-16號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8977441768672110056&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 季安咖啡廳 | 台北市大同區迪化街一段72巷16號 | 迪化街一段72巷16號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15398169619138906473&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 尚合咖啡 | 新北市中和區景平路597號 | 景平路597號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8626143796747607751&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 帕卡遜 percussion caf'e | 新北市板橋區文化路一段47號 | 文化路一段47號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12694854522816701198&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 彼得好咖啡 | 新北市新莊區新泰路109號 | 242新北市新莊區新泰路109號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17583276715774115712&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 怡客咖啡 公保店 | 100台北市中正區青島西路13號 | 青島西路13號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12450306329764059377&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 怡客咖啡行天宮捷運店 | 台北市中山區松江路277號1樓 | 松江路267號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4607978119575230209&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 承繼 | 105台北市松山區敦化北路244巷17號 | 105臺北市松山區敦化北路244巷17號 | OPERATIONAL |  |
| 拎咖啡 | 247新北市蘆洲區民族路341號 | 民族路341號 | OPERATIONAL |  |
| 放空自我咖啡館 | 115台北市南港區富康街30號1樓 | 富康街30號1樓 | OPERATIONAL |  |
| 旺來咖啡 | 105台北市松山區南京東路三段335巷13-1號 | 105臺北市松山區南京東路三段335巷13-1號 | OPERATIONAL |  |
| 明日咖啡 | 新富市場 | 三水街70號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7258055536017458564&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 杯盃 PuiBui | 台北市信義路四段30巷48號 | 106臺北市大安區信義路四段30巷48號 | OPERATIONAL |  |
| 泡咖啡精品咖啡館 PowerCafe | 241新北市三重區重陽路四段61號 | 重陽路四段61號 | OPERATIONAL |  |
| 波浮 habu juice&foods | 台北市大安區安和路二段227巷4號 | 106臺北市大安區安和路二段227巷4號 | OPERATIONAL |  |
| 牧童咖啡 mutto coffee(連興店) | 新北市汐止區連興街34號 | 連興街34號 | OPERATIONAL |  |
| 牧童咖啡 mutto coffee(福德店) | 新北市汐止區福德一路106巷9號 | 福德一路106巷9號 | OPERATIONAL |  |
| 空兩格café | 新北市淡水區中山路90巷20號 | 中山路90巷20號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=1756180624875483972&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 芽可咖啡 | 100台北市中正區思源街1號 | 思源街1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=549061985563935679&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 虎記商行 | 台北市中正區寧波東街1-1號 | 寧波東街1-1號 | OPERATIONAL |  |
| 迎日手沖咖啡Sunny Cafe | 242新北市新莊區五工三路94巷1號1樓 | 五工三路94巷1號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6034725851090553061&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 金時Osmanthus | 104台北市中山區松江路204巷4-1號 | 松江路204巷4-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17411416185866233824&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 金礦咖啡 | 台北市內湖區瑞光路220號 | 瑞光路220號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4879124800816793019&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 門廊咖啡 | 新北市新莊區中正路514巷33弄10號 | 中正路514巷33弄10號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=18159978786874869569&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 阿特思咖啡 | 台北市松山區八德路三段192號 | 八德路三段192號 | OPERATIONAL |  |
| 阿福草｜輕食‧飲 | 台北市北投區學園路1號 (北藝大鷺鷥草原旁) | 學園路1號 | OPERATIONAL |  |
| 雨田先生手沖飲品吧 MrRdrinks | 106台北市大安區忠孝東路四段223巷69號 | 忠孝東路四段223巷69號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10824636195097098074&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 雨想說 咖啡 民藝 | 103台北市大同區迪化街一段292號 | 迪化街一段292號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15979628158632205408&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 雨聲咖啡 | 台北市文山區景華街28號 | 景華街28號 | OPERATIONAL |  |
| 青又田現烘咖啡專賣店 | 台北市南昌路一段59巷28-1號 | 南昌路一段59巷28號號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16944096665678057230&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 保安捌肆 | 台北市大同區保安街84號 | 保安街84號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=214384974557077587&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 南西六號公寓 | 台北市大同區南京西路18巷4弄6之1號 | 南京西路18巷4弄6-1號1樓 | OPERATIONAL |  |
| 南參陸咖啡 | 新北市中和區和平街36號 | 和平街36號1 樓 | OPERATIONAL |  |
| 厚實咖啡 House Caf'e（永久停業） | 新北市板橋區中山路一段158巷23號 | 中山路一段158巷23號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17191081104059323449&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 品黑巧克力專賣店　台北大安店 | 台北市大安區信義路四段30巷52號 | 信義路四段30巷52號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7036930813157931913&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 哈瓦那咖啡廳 美麗華店 | 台北市中山區敬業三路20號2樓 | 敬業三路20號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5299432724097497942&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 哈亞咖啡天母店 | 台北市士林區天母北路66號 | 天母北路66號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11423088477223649147&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 哈亞珈琲三創店 | 台北市中山區市民大道三段2號4樓 | 4樓, No. 2號市民大道三段 | OPERATIONAL |  |
| 城西時光plainstay | 台北市大同區鄭州路21巷4號 | 鄭州路21巷4號 | OPERATIONAL |  |
| 威尼斯現烘咖啡 | 新北市板橋區互助街5號 | 220新北市板橋區南雅東路20-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=77175495150926637&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 威爾貝克手烘咖啡 南京店 | 台北市松山區南京東路五段123巷2弄1號 | 南京東路五段123巷2弄1號 | OPERATIONAL |  |
| 威爾貝克手烘咖啡古亭店 | 台北市中正區羅斯福路二段118號 | 羅斯福路二段118號 | OPERATIONAL |  |
| 威爾貝克手烘咖啡開封店 | 100 Taipei 開封街一段9號 | 開封街一段9號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13828185509579253646&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 室角舍記 ～咖啡議廊 | 台北市文山區景華街23號 | 景華街23號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15403511174831248100&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 屋穀雜糧woogu house cafe | 新北市淡水區中山北路一段247巷72號 | 中山北路一段247巷72號 | OPERATIONAL |  |
| 拾米 TO GO | 112 台北市北投區泉源路12號1樓 | 泉源路12號右側號 | OPERATIONAL |  |
| 星乃咖啡店HOSHINO COFFEE | 台北市中山區南京西路12號（新光三越台北南西店一館4樓） | 南京西路12號4樓 | OPERATIONAL |  |
| 派樂思咖啡 | 臺北市中山區松江路362巷32號 | 松江路362巷32號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16542648909086992867&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 秋山珈琲屋 | 台北市士林區雨農路25-4號2樓 | 2樓, No. 25-4號雨農路 | OPERATIONAL |  |
| 約約客Scooping Cafe | 台北市中正區羅斯福路一段9巷9號 | 羅斯福路一段9巷9號 | OPERATIONAL |  |
| 胖豆恋 SWEET CAFE | 台北市大同區長安西路190號 | 長安西路190號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15096731764697650756&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 苔毛 | 台北市大安區嘉興街345號 | 嘉興街345號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7674441755670531240&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 虹喬咖啡 | 台北市大同區庫倫街48號 | 庫倫街48號-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=422810517419157446&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 食隨之味 | 台北市大安區瑞安街131號 | 瑞安街131號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7846505003407007058&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 香遇Arom amour | 104台北市中山區建國北路二段48號 | 建國北路二段48號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8356083722296400730&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 倆男咖啡室 | 10491台北市中山區松江路204巷33號1F | 松江路204巷33號1F | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10000691982174923528&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 恩寵花園 | 台北市赤峰街71巷4號 | 赤峰街71巷4號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14804952012074173299&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 悅來咖啡館 | 22175 新北市汐止區新台五路一段新台五路一段99號4樓 | 新台五路一段99號4樓 | OPERATIONAL |  |
| 旅沐豆行 | 台北市中山區錦州街416號 | 錦州街416號 | OPERATIONAL |  |
| 時光咖啡故事舘 | 新北市汐止區龍安路202巷51號 | 龍安路202巷51號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8096389357263428506&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 時行 | 台北市大同區延平北路二段61巷22號 | 延平北路二段61巷22號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9243231404195089193&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 時咖啡 | 三重區大仁街5號 | 大仁街5號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17067107533170591035&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 時間之旅 Time Travel Coffee Roaster | 蘆洲區忠孝路56號 | 247新北市蘆洲區忠孝路56號 | OPERATIONAL |  |
| 泰比咖啡 | 台北市大安區樂業街68號 | 樂業街68號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4092857648741912845&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 海邊的卡夫卡 Kafka by the Sea | 台北市中正區羅斯福路三段244巷2號2樓 | 羅斯福路三段244巷2號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6071919448752534138&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 秘氏咖啡 | 台北市大安區浦城街4巷30號 | 浦城街4巷30號 | OPERATIONAL |  |
| 索引文創 | 台北市中山區大直街34巷30號 | 大直街34巷30號 | OPERATIONAL |  |
| 茶布里Chaburi | 10491台北市中山區南京東路一段13巷7弄1號 | 南京東路一段13巷7弄1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17186409554791214682&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 茶悟茶咖啡店 | 235台灣新北市中和區中山路二段36號 | 中山路二段36號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6652257935928542002&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 馬克老爹-大同門市 | 新北市汐止區大同路一段306-2號 | 大同路一段306-2號 | OPERATIONAL |  |
| 馬克老爹R79中山誠品店 | 104臺北市中山南京西路25巷B1（誠品R79 中山地下書街） | 南京西路25巷b1 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4390721314614213506&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 動物誌 About Animals | 台北市和平東路三段228巷25號 | 106臺北市大安區和平東路三段228巷25號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=1002970272059258638&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 啡茶湯自家烘培咖啡 | 新北市三重區重陽路一段43巷20號 | 24161 號, No. 20重陽路一段43巷 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5533520994312856305&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 宿舍 | 板橋區館前西路166號 | 220新北市板橋區館前西路166號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7017444010508513050&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 曼尼咖啡 | 台北市中山區撫順街39號 | 撫順街39號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15249137461350581681&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 產出The Food | 台北市大同區赤峰街53巷2號 | 赤峰街26-2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13533983300109671582&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 產出The Food 貳店 | 台北市台北市大同區赤峰街18號之3 | 赤峰街26-2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13533983300109671582&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 眼鏡咖啡 | 台北市大安區四維路52巷6號 | 四維路52巷6號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3671886930077880205&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 聊國咖啡烘焙館 | 241新北市三重區重新路三段204號 | 重新路三段204號 | OPERATIONAL |  |
| 莫凡彼 （三創台北店） | 台北市中正區市民大道三段2號9樓 | 市民大道三段2號9樓 | OPERATIONAL |  |
| 莫凡彼台大店 | 台北市大安區羅斯福路四段85號 | 羅斯福路四段85號 | OPERATIONAL |  |
| 蛋黃那一面朝上 | 臺北市開封街一段67號 | 開封街一段67號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5787953113094562748&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 逗留食間Time Point | 100台北市中正區金門街1巷1號 | 金門街1巷1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10026824539501338378&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 都凱莊園精品咖啡 Tucán Café | 新北市板橋區民族路139號 | 民族路139號 | OPERATIONAL |  |
| 野夫咖啡 | 244新北市林口區信義路180號 | 信義路180號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6130514475978475262&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 雀客咖啡 | 台北市松江路253號 | 松江路一段253號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12681880092330238749&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 麥兜咖啡 | 新北市蘆洲區中原路1-3號 | 中原路1-3號 | OPERATIONAL |  |
| 傑焙克Jayback鮮烘咖啡 | 新北市新莊區民安路188巷5號 | 民安路188巷5號號 No | OPERATIONAL |  |
| 創咖啡 TRUST CAFÉ | 台北市中山區民權東路三段60巷7號 | 民權東路三段60巷7號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5214863171090075098&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 喬安拾豆咖啡 Gian 6 degrees Coffee | 台北市大安區復興南路一段279巷28號 | 復興南路一段279巷28號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17063701135758730235&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 喬茵咖啡 | 新北市永和區竹林路201巷1號 | 竹林路201巷1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17892929043231627068&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 喵吧咖啡廳 - meow bar | 台北市松山區南京東路5段123巷1弄11號 | 南京東路五段123巷1弄11號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4471369788962774191&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 壹玖木巷咖啡19 wood alley cafe | 台北市大同區太原路11巷19號1樓 | 太原路11巷19號 | OPERATIONAL |  |
| 就是蝴蝶 | 台北市松山區民生東路三段113巷25弄4號 | 民生東路三段113巷6弄15號 | OPERATIONAL |  |
| 惡老闆咖啡 | 114台北市內湖區江南街19號 | 江南街19號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17626611333590690389&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 愜意Pleasant cafe | 111台北市士林區天玉街38巷18弄22號1樓 | 天玉街38巷18弄22號1樓 | OPERATIONAL |  |
| 握咖啡 Oh!Cafe台北信義店 | 11041台北市信義區吳興街55號 | 吳興街55號一樓 | OPERATIONAL |  |
| 斑果咖啡 Bengal Cafe' （豹貓貓咖啡、簡餐、貓咪旅館） | 22064新北市板橋區實踐路93巷3號 | 實踐路93巷3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11854110354752506369&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 斯陋café | 新北市雙溪區中正路13號 | 227新北市雙溪區中山路58號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14173763805457782851&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 棗點Breakfirst | 台北市中山區北安路573巷15號 | 1樓 No. 15號北安路573巷 | OPERATIONAL |  |
| 森丘 Afternoon Tease | 台北市士林區中山北路六段476號2樓 | 中山北路六段476號2F | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8026669738302712110&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 森式咖啡館 SENSE | 新北市永和區水源街39巷26號 | 水源街39巷26號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12850975521967134313&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 森高砂咖啡館大稻埕店 | 台北市延平北路二段1號 | 延平北路二段1號 | OPERATIONAL |  |
| 森高砂咖啡館中山店 | 104臺北市中山區中山北路1段133號 | 104臺北市中山區中山北路一段133號 | OPERATIONAL |  |
| 森高砂咖啡館東門店 | 台北市大安區金華街223-2號 | 金華街223-2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9092376982333111033&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 植萃吧 Énergie de Plante | 104台北市中山區明水路672巷32號1F | 明水路672巷32號1F | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3775834732392471421&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 發光吧 infinity coffee | 忠孝東路六段481號一樓 | 忠孝東路六段481號一樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10943965390576567483&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 童心未泯咖啡館 | 台北市大同區南京西路239巷33號 | 南京西路239巷33號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9884252384530902494&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 統將咖啡和平店 | 台北市大安區和平東路三段228巷20號 | 和平東路三段228巷20號 | OPERATIONAL |  |
| 統將咖啡溫州店 | 台北市大安區溫州街74巷12號1樓 | 溫州街74巷12號 | OPERATIONAL |  |
| 菲瑪咖啡 Cafe Fima | 新北市永和區仁愛路300號 | 仁愛路300號 | OPERATIONAL |  |
| 著咖啡 | 台北市大安區通安街32號 | 通安街32號 | OPERATIONAL |  |
| 買咖啡 | 台北市中正區羅斯福路四段136巷6弄23號 | 羅斯福路四段136巷6弄23號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7957832181951195611&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 逸軒咖啡 龜山復興 | 333桃園市龜山區復興一路280號 | 復興一路280號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5948184054932674366&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 鈐龍奭自家烘焙咖啡館 | 新北市樹林區保安二街38號 | 238新北市樹林區保安二街38號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9241624616817931851&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 開心路輕食吧 | 台北市北投區雙全街38號 | 112台灣臺北市北投區 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15689615907147601749&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 集合咖啡 | 241061新北市三重區自強路四段51號1樓 | 自強路四段51號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6375021858842046973&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 雲海咖啡 | 新北市永和區福和路120號 | 234新北市永和區福和路120號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15547932795381202623&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 黑吧煎焙咖啡專賣店 | 221新北市汐止區新台五路一段116號 | 221新北市汐止區新台五路一段116號 | OPERATIONAL |  |
| 黑吧煎焙咖啡專賣店 | 110台北市信義區基隆路二段27號 | 基隆路二段27號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11619605140381380013&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 黑沃咖啡 （威秀店） | 台北市信義區松壽路20號A17 | 松壽路20巷 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5781090626835685499&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 黑金魚咖啡館 | 台北市北投區育仁路8巷3號 | 112臺北市北投區育仁路8巷7號1樓 | OPERATIONAL |  |
| 黑鼻司康 | 新北市新莊區中誠街152號 | 中誠街152號 | OPERATIONAL |  |
| 奧蘿茉 OROMO CAFE 北車店 | 台北市中正區南陽街26號 | 南陽街26號 | OPERATIONAL |  |
| 奧蘿茉 OROMO CAFE 敦南店(已歇業) | 敦化南路二段63巷20號 | 敦化南路二段63巷20號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4145876083018654663&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 微亭咖啡（已歇業） | 220新北市板橋區民族路73號 | 民族路73號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7096480847493820927&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 溫床 NEST | 台北市大安區信義路二段198巷38號 | 信義路二段198巷38號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11029633148070332298&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 爺茶 GRANDPA | 台北市中山區伊通街127-3號 | 伊通街127-3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17235476729228682560&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 猿田彥珈琲 微風南山店 | 11073台北市信義區松仁路100號松智路17號2樓 | 松智路17號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16233884629794258950&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 獅王咖啡 美麗華店 | 台北市中山區敬業三路20號B1 | 敬業三路20號三樓 | OPERATIONAL |  |
| 當樂咖啡 | 新北市板橋區光正街40號 | 光正街40號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16362182612427022213&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 稜角室 | 新北市板橋區光武街8號 | 光武街8號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13288440391563935085&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 路易．莎咖啡（建國花市門市） | 106台北市大安區信義路三段104號 | 信義路三段104號 | OPERATIONAL |  |
| 路易莎 土城裕民門市 | 新北市土城區裕民路99號 | 裕民路99號1、2樓 | OPERATIONAL |  |
| 路易莎 北投社直營門市 | 112台北市北投區光明路65號 | 光明路65號1 樓 | OPERATIONAL |  |
| 路易莎-瑞光店 | 台北市內湖區瑞光路431號 | 瑞光路431號 | OPERATIONAL |  |
| 路易莎咖啡汐止建成直營店 | 新北市汐止區建成路60號 | 建成路60號 | OPERATIONAL |  |
| 路易莎咖啡景美SOHO店 | 116台北市文山區羅斯福路六段146號 | 羅斯福路六段146號 | OPERATIONAL |  |
| 路易莎咖啡LOUISA COFFEE 永春概念店 | 台北市信義區永吉路326巷50號 | 永吉路326巷50號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=1713667945669917833&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 路易莎咖啡Louisa coffee蘆洲長榮店 | 新北市蘆洲區長榮路412號 | 長榮路412號 | OPERATIONAL |  |
| 路易莎新海直營店 | 新北市板橋區雨農路58號 | 雨農路58號 | OPERATIONAL |  |
| 路易莎樂群店 | 台北市樂群二路150號 | 樂群二路150號 | OPERATIONAL |  |
| 路燈咖啡 - Light Café公館店 | 台北市中正區羅斯福路三段244巷10弄19號 | 羅斯福路三段244巷10弄19號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15681911728994735097&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 躱貓貓南京三民店 | 台北市南京東路五段188號3F-3 | 南京東路五段188號3號樓之3 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15884661454829340286&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 遇見貓咖啡輕食館 | 新北市中和區復興路18號 | 235047新北市中和區復興路18號 | OPERATIONAL |  |
| 酮伴咖啡 | 100台北市中正區福州街5之1號 | 福州街5之1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2905025185091455697&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 夢飛行甜點咖啡店 | 100台北市中正區愛國東路38號 | 100臺北市中正區愛國東路38號 | OPERATIONAL |  |
| 夢遊咖啡館 Longtimeago Café | 台北市大安區安和路一段21巷9號 | 安和路一段21巷9號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=1634620015290430545&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 夥食 | 台北市北投區石牌路一段71巷9弄1號 | 112臺北市北投區石牌路一段71巷3弄2號 | OPERATIONAL |  |
| 孵咖啡-孵咖啡洋行 | 103台灣台北市大同區迪化街一段 328 號一樓 | 迪化街一段328 號一樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4542527337972765015&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 敲敲咖啡 KNOCK KAFE | 台北市大安區延吉街126巷10號 | 延吉街126巷10號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6241291096740980668&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 滿滿咖啡 | 台北市士林區承德路四段34號 | 承德路四段34號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13212661650534713151&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 滿樂鐵板吐司內湖店 | 台北市中山區龍江路93號 | 洲子街50號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9157056234344179358&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 演珈琲 Acting cafe | 110台北市信義區莊敬路341巷1號 | 110臺北市信義區莊敬路341巷7號1樓 | OPERATIONAL |  |
| 漫步藍 - 土城店 | 新北市土城區明峰街7號 | 明峯街7號 | OPERATIONAL |  |
| 漸層蘭Jian Chen Lan Ａrt & Coffee | 103台北市大同區蘭州街89巷12號 | 103臺北市大同區蘭州街89巷12號2樓 | OPERATIONAL |  |
| 瑪可緹Mocktail 長安店 | 台北市中山區長安東路二段99號 | 長安東路二段99號 No | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4046171268107980090&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 瑪吉咖啡(已歇業) | 台北市大同區承德路三段239號 | 承德路三段239號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5816230835730854629&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 瑪黑家居 x P&T柏林茶館 中山店 | 110台北市中山區中山北路二段36巷18號 | 中山北路二段36巷18號 | OPERATIONAL |  |
| 瑰夏咖啡創始店 UNC COFFEE | 台北市信義區忠孝東路五段372巷27弄1號1樓 | 忠孝東路五段372巷27弄1號1樓 | OPERATIONAL |  |
| 福來得咖啡Fred`s Cafe | 台北市信義區信義路四段413-1號 | 信義路四段413-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17162395142787025064&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 福璟咖啡(捷運三重站店) | 新北市三重區捷運路36號B1 | 捷運路36號B1 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=18033710263859083093&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 福璟直火咖啡豆專賣店 | 新北市板橋區民族路21號 | 民族路21號 | OPERATIONAL |  |
| 窩心房Sweet-Art Coffee | 新北市新莊區昌平街59巷9號1 樓 | 昌平街59巷9號1 樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8153450304336542141&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 維堤咖啡 | 台北市內湖區瑞光路358巷32號1樓 | 瑞光路358巷32號 | OPERATIONAL |  |
| 聞山自家焙煎咖啡館 | 景中街19號 | 景中街19號 | OPERATIONAL |  |
| 聞豆奇 | 台北市信義區莊敬路391巷1弄2號 | 信義路五段150巷14弄2號 | OPERATIONAL |  |
| 臺北市立動物園【石尚貓熊主題餐廳】 | 台北市文山區新光路二段30號 | 新光路二段30號 | OPERATIONAL |  |
| 慕門咖啡 Coffee Moment | 110台北市信義區基隆路一段139號B1F | B1, No. 171號松德路信義區臺北市110 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7737829616979248124&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 樂波波咖啡研究室Le BoBo coffee | 台北市中正區仁愛路二段10-1號 | 仁愛路二段10-1號 | OPERATIONAL |  |
| 樂樂咖啡 | 台北市松山區延壽街129號 | 延壽街129號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12626275971925270966&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 樓上的嬉皮與笑臉男 | 106台北市大安區和平東路二段157號2樓 | 和平東路二段157號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12234226253622093407&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 歐克法自家烘培咖啡 | 台北市大安區辛亥路二段171巷6弄10號 | 辛亥路二段171巷6弄10號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16826179214189213984&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 歐若拉專業烘培咖啡店 | 台北市中華路二段309巷1號 | 中華路二段309巷1號 | OPERATIONAL |  |
| 賦茶 | 台北市大安區光復南路322號 | 光復南路322號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12296027186726815422&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 踩踩水cafe | 100台北市中正區金門街25-2號 | 100臺北市中正區金門街25-2號 | OPERATIONAL |  |
| 遷鳥陳列所-Cafe bar | 103台北市大同區南京西路239巷28號 | 南京西路239巷28號 | OPERATIONAL |  |
| 鄰居咖啡Neighbor's Cafe | 台北市大安區青田街2巷4號 | 青田街2巷4號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6819879392600352135&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 鬧鄰居咖啡 | 106台北市大安區潮州街39號 | 潮州街39號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14302809607947306238&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 凝視咖啡Gaze Cafe | 台北市萬華區廣州街32號 | 廣州街32號1樓 | OPERATIONAL |  |
| 樹男咖啡。TreemanCafe | 新北市淡水區民生路52巷8號 | 251新北市淡水區民生路52巷8號 | OPERATIONAL |  |
| 樹慢扭法式甜點 C'est Manuel | 234新北市永和區文化路90巷24號 | 文化路90巷24號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4184608368608208512&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 橙舍咖啡 TW COFFEE | 台北市萬華區漢口街二段41號 | 漢口街二段41號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=18257904736881850751&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 澤山珈琲 | 10450 台北市台北市中山區中山北路二段59巷41弄5號 | 中山北路二段59巷41弄5號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=772433384046221387&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 璞豆咖啡.日常 | 106台北市大安區溫州街66號 | 溫州街66號 | OPERATIONAL |  |
| 興波咖啡Simple Kaffa | 台北市中正區忠孝東路二段27號 | 忠孝東路二段27號 | OPERATIONAL |  |
| 貓孩在極簡 minimal cafe | 台北市大安區泰順街2巷42號 | 泰順街2巷42號 | OPERATIONAL |  |
| 錘子咖啡淡大店 | 新北市淡水區英專路151號在學生活動中心一樓 | 英專路151號在學生活動中心樓下一樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5370450299281141489&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 嚐途。Tcoffeewn | 台北市信義區莊敬路391巷3號 | 莊敬路391巷3號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3864882521727503818&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 戴安娜咖啡 | 新北市新店區百忍街27號 | 百忍街27號 | OPERATIONAL |  |
| 璐巴咖啡店 | 106台北市大安區羅斯福路三段283巷21弄2號 | 羅斯福路三段283巷21弄2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5013267883952003752&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 癈墟 | 新北市中和區民有街49號1樓 | 235新北市中和區民有街49號 | OPERATIONAL |  |
| 穗(禾十心) Sui Studio | 241新北市三重區集成路32巷3號 | 集成路32巷3號 | OPERATIONAL |  |
| 薄荷夜 Peppermint Night Cafe | 100台北市中正區師大路138號 | 100臺北市中正區師大路138號 | OPERATIONAL |  |
| 醜小鴨咖啡外帶吧 | 台北市內湖區江南街123號 | 江南街123號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15651214771055310671&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 麋所咖啡飲啤館 MeetSoul Coffee | 新北市新莊區公園路8-2號 | 公園路8-2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=1226974160290589437&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 職藝咖啡 | 新北市林口區文化一路一段228號 | 244新北市林口區文化北路一段58號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10896301757541122691&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 藍色微光 One Earth Café | 板橋區文化路二段225巷72弄60號 | 220新北市板橋區文化路二段225巷72弄60號 | OPERATIONAL |  |
| 鬆土 sang-thóo workshop | 台北市士林區劍潭路56號一樓 | 劍潭路56號一樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16322806340757520477&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 爍Soul Cafe (已歇業) | 大安區通安街139號 | 106臺北市大安區通安街139號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2952366287891941511&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 羅伯咖啡永和店 | 新北市永和區永貞路366號 | 永貞路366號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16200161312660522791&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 羅得奧商行。Après la Mousson | 台北市富錦街370號 | 富錦街370號 | OPERATIONAL |  |
| 羅曼尼咖啡 | 台北市文山區興隆路二段220巷55弄1號 | 興隆路二段220巷55弄1號 | OPERATIONAL |  |
| 麓鳩 | 台北市松山區光復南路32巷18號 | 光復南路32巷18號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4218520140335534305&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 爐鍋咖啡 關渡店 | 台北市北投區大度路三段296巷39號 | 大度路三段296巷39號 | OPERATIONAL |  |
| 蘑菇咖啡MOGU CAFE'（已歇業） | 台北市大同區南京西路25巷18-1號 | 南京西路25巷18-1號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17821447630753539056&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 覺旅咖啡(陽光店) | 台北市陽光街321巷42號 | 陽光街321巷42號 | OPERATIONAL |  |
| 鹹花生Salt Peanuts | 台北市迪化街一段197號一進 | 迪化街一段197號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=471010461125875613&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 麵包歌 Bread Song Bakery | 新北市板橋區中正路403號 | 220新北市板橋區中正路332之7號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3610535384265620393&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 蘭空咖啡VOEZ Café | 台北市信義區東興路45號一樓 | 1F45號東興路 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8903718106283180799&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 露邸斯海姆 | 115台北市南港區研究院路一段59號 | 研究院路一段59號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17136591179498347779&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 露特西亞 台灣戲曲中心 | 臺北市士林區文林路751號 | 文林路751號 | OPERATIONAL |  |
| 權泉珈琲 KWON SAEM COFFEE | 台北市大同區承德路二段53巷36號 | 赤峰街18-3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7969155351963961005&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 蘿菈愛咖啡 Rola I Coffee | 中正區杭州北路28-1號 | 杭州北路28-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=18376766763599983365&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| 㒭咖啡自家烘焙工作室 | 新北市三重區重新路四段242-2號 | 重新路四段242-2號 | OPERATIONAL |  |
| A Day日日村 | 新北市永和區仁愛路279號 | 仁愛路279號 | OPERATIONAL |  |
| A8 Café & Gallery | 台北市大安區和平東路三段67巷8號 | 和平東路三段67巷8號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13597898576276946437&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Aakii coffee | 10491台北市中山區中山北路二段128巷36號 | 中山北路二段128巷36號 | OPERATIONAL |  |
| about KUAN 寬庭（誠品生活南西店2樓） | 台北市中山區南京西路14號2樓 | 南京西路14號2F | CLOSED_PERMANENTLY | https://maps.google.com/?cid=821470153605704276&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| abt.coffee | 10491台北市中山區民權東路二段79號 | 民權東路二段79號 | OPERATIONAL |  |
| After Rain coffee & dessert | 台北市松山區民權東路三段160巷19弄16號 | 民權東路三段160巷19弄16號 | OPERATIONAL |  |
| afterhours cafe | 台北市松山區延壽街117-1號 | 延壽街117-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3142337621741695661&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Amandier cafe 雅蒙蒂創意飲食 新生店 | 台北市中山區新生北路一段66號 | 新生北路一段66號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7667649266160855263&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Ancre Cafe | 新北市淡水區中正路233-3號 | 中正路233-3號2樓 | OPERATIONAL |  |
| Andrew Frank Café | 106台北市大安區復興南路二段128巷4號1樓 | 復興南路二段128巷4號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12396282647027547756&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| anike阿提卡自家烘焙咖啡&進口茶 | 103台北市大同區西寧北路17之2號 | 西寧北路17之2號 | OPERATIONAL |  |
| APO CAFE | 10491台北市中山區敬業一路118號 | 敬業一路118號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8586098313587462537&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Apple Museum Cafe | 台北市大安區溫州街74巷3弄5號 | 溫州街74巷3弄5號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14543859831522243335&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| APU cafe | 永和區永和路一段83號一樓 | 永和路一段83號號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15617317267522148466&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Ariel 愛瑞兒 咖啡、燕窩、生活館 | 新北市林口區中山路576-8號 | 中山路576-8號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6267352133138928008&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| artco 典藏咖啡廳 - 長安店 | 台北市中山區長安東路一段8-1號 | 長安東路一段8-1號 | OPERATIONAL |  |
| Aspoon Aspoon阿本紅蔘咖啡館（新莊宏匯廣場店） | 242新北市新莊區新北大道四段3號2樓 | 新北大道四段3號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9035670543763773773&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Aussie Cafe 澳氏咖啡 | 台北市中山區中山北路二段115巷33號 (錦州街13巷進入即可看到) | 中山北路二段115巷33號 | OPERATIONAL |  |
| Balcony 陽台 Café | 台北市中山區大直街34巷20號2F | 大直街34巷20號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6544705796256159143&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Barry & Gabriela's 小酒趴 | 台北市大同區南京西路239巷3號 | 南京西路239巷3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=1905736715862654826&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| BEANS & BEATS | 105台北市松山區富錦街346號 | 富錦街346號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13372427473909833288&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Beutii Kitchen | 台北市中山區市民大道三段2號4樓 | 4樓, No. 2號市民大道三段 | OPERATIONAL |  |
| BitterSweet 三創店 | 台北市中山區市民大道三段2號11樓 | 市民大道三段2號B2 | OPERATIONAL |  |
| BlackShiba黑柴職人手工咖啡館 | 11263台北市北投區中央南路一段17號 | 中央南路一段17號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12275363812756923258&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Blacktail cafe | 台北市內湖區江南街65巷51號1樓 | 江南街65巷51號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11892576936757710263&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Bo+Caffe 板橋介壽店 | 新北市板橋區介壽街28號 | 介壽街28號 | OPERATIONAL |  |
| BRICK WORKS TAIPEI (花博店) | 台北市中山區玉門街1號(MAJI市場廣場S17專櫃) | 玉門街1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8277172535098533108&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Buddy’s | 台北市信義區虎林街143號1樓 | 110臺北市信義區虎林街143號1樓 | OPERATIONAL |  |
| Bunn Cafe & Roastery | 106台北市大安區四維路6巷10號 | 四維路6巷10號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=339594576732685633&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| C＆C café | 台北市大安區羅斯福路3段283巷36號 | 羅斯福路三段283巷36號106 號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15384684348771602736&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| CAFE ACME｜Xiangshan 象山 | 台北市信義區信義路五段150巷11弄1號1樓 | 110臺北市信義區信義路五段7號35樓 | OPERATIONAL |  |
| Cafe Ami 阿米咖啡 | 台北市文山區興隆路二段154巷 | 興隆路二段154巷12號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8877327220124279306&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Cafe chat 04 | 台灣台北市大同區蘭州街14號 | 10358臺北市大同區蘭州街14號 | OPERATIONAL |  |
| Cafe de Gear | 台北市中正區寧波東街3-3號 | 寧波東街3-3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9750145402851774098&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Café La Loop 86 | 104台北市中山區樂群三路75號 | 樂群三路75號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11981012796456440809&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Cafe no.218 x Elca zakka | 11064 Taipei 台北市信義區基隆路一段147巷34號之一 | 基隆路一段147巷34號之1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7667586726596636112&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| CAFE SOLÉ 日出印象咖啡館（本店） | 110台北市信義區光復南路133號 | 菸廠路88號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=450554033579845076&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Cafe Walker | 臺北市信義區松勤街5號 | 松勤街5號 | OPERATIONAL |  |
| CAFE!N 硬咖啡 衡陽店 | 10045台北市中正區衡陽路35號 | 衡陽路35號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8838143562577526995&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Cafejiasong咖央 | 106台北市大安區大安路一段51巷2號2樓 | 大安路一段51巷2號2樓 | OPERATIONAL |  |
| CAFEPRO敦化店 | 105台北市松山區八德路三段12巷52弄13號 | 八德路三段12巷52弄13號1樓CAFEPRO | OPERATIONAL |  |
| Cafetaster咖啡嗜者 | 台北市大安區雲和街72巷1號 | 雲和街72巷1號 號1樓 | OPERATIONAL |  |
| Caffe’ Rue路口加啡 | 台北市中山北路六段35巷2號 | 中山北路六段35巷2號 | OPERATIONAL |  |
| Cans Coffee 罐頭珈琲（永久停業） | 台北市中山區中原街4號 | 104臺北市中山區中原街4號 | OPERATIONAL |  |
| CBC SPACE CAFE 景美咖啡圖書館 | 台北市文山區景興路193號1樓 | 景興路193號 | OPERATIONAL |  |
| chat cafe | 台北市松山區復興北路145號1樓 | 復興北路145號1樓 | OPERATIONAL |  |
| Chill Moon coffee棲木商行 | 新北市板橋區文化路二段263巷18號 | 文化路二段263巷18號 | OPERATIONAL |  |
| Chüan Chuan 捲捲 | 111台北市士林區福壽街45號1樓 | 福壽街45號1樓 | OPERATIONAL |  |
| Chubby Bird County 茶彼鳥 | 台北市松山區南京東路五段59巷30弄8號 | 南京東路五段59巷30弄8號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11084788957829738869&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| citilite coffee & roasters | 台北市中山區合江街41巷16號 | 合江街41巷16號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4373811111408038719&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| COFE 喫茶咖啡 | 103台北市大同區迪化街一段 248號2樓 | 迪化街一段248號2樓 | OPERATIONAL |  |
| Coffee Boy Hop Man | 106台北市大安區羅斯福路三段283巷36號 | 羅斯福路三段283巷36號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2828103340747633949&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Coffee Buff | 台北市中山區大直街62巷8號 | 大直街62巷8號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5729684436369304831&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| COFFEE LOVER's PLANET | 台北市大安區敦化南路一段246號B1 | B1, No. 246號敦化南路1段 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15712197064685873983&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Coffee Smith石牌店 | 台北市北投區明德路333巷31號 | 明德路333巷31號 | OPERATIONAL |  |
| Coffee Window 咖啡文朵 精品咖啡 / 新鮮烘焙 | 100台北市中正區林森北路3號1樓 | 林森北路3號1樓 | OPERATIONAL |  |
| Coffee-z(湛盧外帶店 | 台北市中山區復興北路76號 | 104104臺北市中山區復興北路76號 | OPERATIONAL |  |
| Coffice 咖啡意識 | 新北市永和區永利路109號 | 永利路109號 | OPERATIONAL |  |
| Congrat's cafe 西門店 | 108台北市萬華區武昌街二段83號 | 武昌街二段83號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2944308878536999512&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Coppii Lumii living coffee 冉冉生活 | 10491台北市中山區龍江路298巷23號 | 10491臺北市中山區龍江路298巷23號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=981377048896673963&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Cuiqu Coffee 奎克咖啡（台北忠孝店） | 台北市大安區忠孝東路四段216巷11弄8號1樓 | 忠孝東路四段216巷11弄8號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17127037820761380833&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| D23 cafe | 台北市中山區明水路397巷7弄46號 | 明水路397巷7弄46號 | OPERATIONAL |  |
| Dancing Goats Coffee 跳舞山羊 | 10660 台北市大安區新生南路三段6-1號 | 新生南路三段6-1號 | OPERATIONAL |  |
| Deesco coffee德果咖啡 | 台北市大安區安和路二段86號 | 106臺北市大安區安和路二段86號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10928204466947759231&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Dehors Café 域外咖啡 | 100台北市中正區中華路一段9巷21號 | 中華路一段9巷21號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9038633384791747208&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Dolly Coffee 多莉咖啡 | 112台北市北投區承德路七段188巷28號1樓 | 承德路七段188巷28號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2256937353763897230&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| DOTEL Coffice Ximen 西門町手沖咖啡館 | 10843台北市萬華區雅江街2號 | 雅江街2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16062392909840317292&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Doupicks x Freaker coffee | 103台北市大同區赤峰街77號 | 赤峰街77號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4923437319731117609&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Drink Eat Coffee 君飲咖啡 | 231新北市新店區二十張路40-1號 | 二十張路40-1號 | OPERATIONAL |  |
| Drink Eat Coffee 君飲咖啡 | 231新北市新店區二十張路40-1號 | 二十張路40-1號 | OPERATIONAL |  |
| E-Fun-手作工藝 | 台北市大安區和平東路三段463巷2號 | 和平東路三段463巷2號1樓 | OPERATIONAL |  |
| Easy Coffee(台北市康復之友協會附設咖啡坊) | 台北市中正區忠孝東路一段58號B1(捷運善導寺站內部6號出口下方 | 忠孝東路一段58號6號出口側捷運站內B1 | OPERATIONAL |  |
| ECM cafe 咖啡訪 | 台北市文山區羅斯福路六段267號 | 羅斯福路六段267號 | OPERATIONAL |  |
| Eggtion Coffee艾炫咖啡 | 106台北市大安區和平東路一段129-1號 | 和平東路一段129-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7821940763698255665&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Elephant Machine | 台北市永康街37巷5號 | 永康街37巷5號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4690957506133093569&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Emma`s Kitchen | 台北市中山區濱江路12號 | 濱江街12號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16639095990696253457&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| ERC Cafe 中和春嶺店 阿達阿永咖啡廳 | 新北市中和區捷運路37號 | 捷運路37號全聯（正後方 | OPERATIONAL |  |
| es Cafe | 10361台北市大同區承德路二段189號 | 承德路二段189號一 樓 | OPERATIONAL |  |
| Felice Cafe 享樂咖啡 內湖康寧店 | 號, No. 139康寧路一段內湖區, 台北市114 | 康寧路一段139號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13921201914544218951&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Ferrari coffee | 台北市中山區雙城街17巷10-1號 | 104臺北市中山區雙城街13巷11-1號 | OPERATIONAL |  |
| Fika Fika 伊通店 | 台北市伊通街33號一樓 | 伊通街33號 | OPERATIONAL |  |
| FIVE FLAVOR coffee roasters | 台北市大安區瑞安街258號1樓 | 1樓, No. 258號瑞安街 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6070036637033399541&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| FOCUS COFFEE 福客斯咖啡 | 台北市信義區永吉路344號1樓 | 永吉路344號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13120886409329625990&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Freckle & Dimple 雀斑梨渦 | 新北市板橋區莒光路39巷9號 | 莒光路39巷9號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8351944505959784767&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Gato Café Stand（永久停業） | 台北市松山區市民大道五段9號 | 市民大道五段9號號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5861515761957979840&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Geesaa咖啡體驗館 三創店 | 台北市中正區市民大道三段2號 | 市民大道三段2號5樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16042590293912432778&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Gentle x WanDao | 新北市板橋區文昌街22號 | 文昌街22號1樓 | OPERATIONAL |  |
| GEORGE HOUSE 台北永康門市 | 106台北市大安區永康街75巷3號 | 永康街75巷3號 | OPERATIONAL |  |
| Gerbera Cafe宓坊咖啡 | 台北市民生東路三段113巷29號 | 民生東路三段113巷29號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5464190417743517552&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| GinGin Coffee Company | 台北市臨沂街27巷9號1樓 | 臨沂街27巷9號1樓 | OPERATIONAL |  |
| Golden Bee Coffee Store | 244新北市林口區仁愛路二段265號 | 仁愛路二段265號 | OPERATIONAL |  |
| Goldern Bean Cocoa | 台北市信義區松山路465巷29弄19號 | 松山路465巷29弄19號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=1330079975038454306&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Good Goods Cafe 好東西 | 臺北市羅斯福路四段一號 | 羅斯福路四段1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2769058944220168386&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Good Neighbors’ 小宅咖啡 | 新北市五股區水碓五路2號 | 水碓五路2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6414139607213231182&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Goodmans Coffee 芝山店 | 台北市士林區德行西路38號 | 德行西路38號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5893631814697291536&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Goodmans Songshan | 台北市南港區市民大道七段8號1樓 | 市民大道七段8號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12353992923807304242&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| haikacafe嗨咖咖啡 | 台北市信義區虎林街164巷78號 | 虎林街164巷78號 | OPERATIONAL |  |
| hao's repair | 台北市松山區南京東路四段189號1樓 | 105臺北市松山區南京東路四段53巷8弄17號1樓 | OPERATIONAL |  |
| harbor market | 南港區重陽路504巷1弄2號 | 重陽路504巷1弄2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6530846461860222580&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Hater Cafe | 台北市羅斯福路四段146號2樓 | 羅斯福路四段146號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2571801089650649949&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Her café | 新北市瑞芳區金瓜石祈堂路95-21號 | 祈堂路95-21號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3376829339776437371&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| herzmoment 笛瑟甜點工坊 | 110台北市信義區虎林街202巷66號 | 虎林街虎林街202巷 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17801773746269581093&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| HEY CAFE | 10491台北市中山區中山北路一段33巷28號 | 中山北路一段33巷28號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5130930082624981782&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| HOFFE CAFE 花博店 | 台北市中山區玉門街1號 | 玉門街1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9067591094057269226&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| HOK-House of Kuo 郭元益的家 | 台北市士林區文林路526號 | 11111臺北市士林區文林路546號 | OPERATIONAL |  |
| HOKA CAFÉ | 台北市長安東路二段64號 | 長安東路二段64號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16736862818000168926&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Honuscoffee-赫諾斯咖啡 | 台北市大安區和平東路二段118巷4-1號 | 和平東路二段118巷4-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7170152978726665861&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| hosei café | 台北市松山區延壽街325號 | No. 325號, 延壽街 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13361199371703137756&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Hulu House | 236 土城區青雲路240號 | 236新北市土城區青雲路240號 | OPERATIONAL |  |
| Humble beginnings Café | 台北市士林區中山北路七段36-1號 | 中山北路七段36之1號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12305612211182451151&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Hustle Colour | 台北市內湖區江南街65巷51號 | 江南街65巷51號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11901808288560387209&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| HWC黑沃咖啡 台北馬偕店 | 台北市中山區民生西路45巷9弄26號 | 民生西路45巷9弄26號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=124846268216602532&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| HWC黑沃咖啡 南京三民店 | 台北市松山區八德路四段245巷13弄2號 | 八德路四段245巷13弄2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16338516504923268628&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| i3東珈琲 | 新北市新莊區公園一路109號 | 公園一路109號 | OPERATIONAL |  |
| ID COFFEE艾迪咖啡 | 台北市大同區太原路153號 | No. 153, 太原路 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7827096855847462879&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| IMPCT Coffee For The Future (已停業) | 100台北市中正區八德路一段104號 | 八德路一段104號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13075991552637084056&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Imperfect coffee & matcha | 台北市大安區新生南路三段96-5號2F | 新生南路三段96-5號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12256004524285185937&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Insomnia coffee | 台北市內湖區洲子街112點 | 洲子街112號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6598567147622254077&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Instil coffee dimension | 台北市大安區復興南路二段78巷2號地下 | 號地下, 2復興南路二段78巷 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7855979841049791330&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| ISAAC CAFE 撒子咖啡甜點店 | 台北市中山區敬業一路128巷12號1樓 | 敬業一路128巷12號1樓 | OPERATIONAL |  |
| ISLANDER夏威夷咖啡 | 台北市中山區南京西路12號B2（ 新光三越台北南西店一館） | 10491臺北市中山區南京西路12號 | OPERATIONAL |  |
| It's Coffee | 台北市中山區中山北路一段105巷4號1F | 中山北路一段105巷4號1F | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2290621808840590103&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| ITCafe (已歇業) | 台北市內湖區金莊路90號 | 金莊路90號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9488202682900397180&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| J Robot | 新北市三重區三德街35號 | 三德街35號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2593993579625631048&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Joe's Cafe | 台北市富錦街464號 | 富錦街464號 | OPERATIONAL |  |
| joker咖啡 | 台北市內湖區陽光街275號1F | 陽光街275號114 | OPERATIONAL |  |
| JOMO Coffee 大龍店 | 103台北市大同區大龍街91巷17-1號 | 大龍街91巷17-1號 | OPERATIONAL |  |
| Just in Cafe | 台北市大同區長安西路78巷3弄4-1號1樓 | 長安西路78巷3弄4-1號 | OPERATIONAL |  |
| Kahvi Coffee | 台北市大同區重慶北路一段1號 | 103臺北市大同區重慶北路一段1號1F | OPERATIONAL |  |
| KNIGHT COFFEE騎士精品咖啡 | 新北市深坑區北深路三段266號 | 北深路三段266號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5402071745737674027&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| LEE cafè手作烘焙咖啡豆 | 台北市萬華區寶興街116號 | 寶興街116號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4431868799957901929&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Lento coffee&brunch | 新北市板橋區建國街123號 | 光正街40號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16362182612427022213&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Library134 | 10491台北市中山區遼寧街134號 | 遼寧街134號 | OPERATIONAL |  |
| Little Green | 台北市松山區南京東路四段118-2號1F | 105臺北市松山區南京東路五段250巷2弄39號1樓右側 | OPERATIONAL |  |
| Little Green Cafe & Health Studio | 台北市中山區玉門街1號 | 玉門街1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8972618466402079773&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Lost and Found it cafe 失物招領咖啡館 | 105 台北市大安區敦化南路一段161巷6號2樓 | 敦化南路一段161巷6號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12631658051930061960&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Lotty cafe 綠蒂咖啡 | 台北市中山區台北市中山區農安街53號 | 農安街53號 | OPERATIONAL |  |
| Louisa 新店中正店 | 新北市新店區中正路510號 | 中正路510號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3996999537803834303&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Louisa Coffee 竹圍店 | 251新北市淡水區民權路38號 | 民權路38號 | OPERATIONAL |  |
| Louisa Coffee 路易莎咖啡 (北投社3rd直營門市) | 112台北市北投區光明路65號1樓 | 光明路65號1 樓 | OPERATIONAL |  |
| Louisa Coffee路易莎咖啡 東湖店 | 台北市內湖區東湖路33巷8號 | 東湖路33巷8號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13454142403341849111&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Love; café | 100台北市中正區牯嶺街133號 | 100臺北市中正區牯嶺街133號 | OPERATIONAL |  |
| Lu.Coffee 旅珈啡(遠企門市) | 106台北市大安區敦化南路二段269號 | 敦化南路二段269號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5500096653905874571&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Lubar Cafe | 新北市五股區新城八路416號 | 新城八路416號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10695704577524534431&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Lucky5 Light Cafe | 大安區光復南路200巷26號 | 光復南路200巷26號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=233189576249905816&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Ludique Crème 調皮奶油 | 台北市信義區基隆路一段147巷25號 | 基隆路一段147巷25號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14077475698889257879&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Luna自家烘焙咖啡 | 淡水區中正路179號 | 中正路179號 | OPERATIONAL |  |
| M.E.kaffa | 新店區民族路12號 | 民族路12號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9026903536896526111&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Maven Coworking Cafe | 104 台北市北安路518巷3號一樓 | 北安路518巷3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=234500483930189077&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Merci café | 220新北市板橋區新民街7巷17號 | 新民街7巷17號 | OPERATIONAL |  |
| Merci Petit | 新北市板橋區新民街7巷29號 | 新民街7巷12號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17258256374689071097&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Miao米亞歐隨義小廚 | 台北市信義區忠孝東路五段71巷32號 | 忠孝東路五段71巷32弄2號一樓B | CLOSED_PERMANENTLY | https://maps.google.com/?cid=11850925268733675058&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| MIKI 米綺咖啡 | 台北市信義區松德路12-1號 | 11075臺北市信義區松德路119號1樓 | OPERATIONAL |  |
| Miuya Cafe 米屋珈琲 | 台北市大安區文昌街49號 | 106臺北市大安區文昌街49號 | OPERATIONAL |  |
| Modism cafe 士林店 | 台北市士林區中正路235巷29號 | 中正路235巷29號 | OPERATIONAL |  |
| Moi Cafe | 臺北市大同區承德路一段一號二樓 | 承德路一段1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16169279333089544624&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Moi Cafe 仁愛店 | 台北市仁愛路四段408巷13號 | 106臺北市大安區仁愛路四段408巷13號 | OPERATIONAL |  |
| Moooon River Cafe & Books | 台北市內湖區瑞光路218號 | 瑞光路218號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9273858650103758080&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| MORLAN COFFEE | 台北市大安區溫州街48號 | 溫州街48號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5724448283821894816&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Mountain Fusion | 台北市內湖區內湖路一段312號(入口在洲子街上;洲子街116號) | 內湖路一段312號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3655312957324541691&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Mr.Brown Cafe' 松江店 | 台北市中山區松江路332號 | 松江路332號 | OPERATIONAL |  |
| Mr.George & J's Coffee Alley | 新北市淡水區北新路169巷7號 | 北新路169巷7號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6986849480109577690&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Myron cafe | 10491台北市中山區赤峰街44巷8號 | 中山北路二段72巷6號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4325085253364243702&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| N3 Cafe恩山咖啡 | 台北市中山區中山北路二段48巷7號爵士廣場B1 | 赤峰街53巷21號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9593653118470834744&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Naissance Coffee | 台北市中正區羅斯福路三段62號 | 100臺北市中正區羅斯福路三段62號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17160063444625617728&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Neighbors Cafe 好鄰居 | 111台北市士林區中山北路六段430號 | 中山北路六段430號2F | CLOSED_PERMANENTLY | https://maps.google.com/?cid=16559722329138469366&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Nichi Nichi 日子咖啡 | 台北市大同區赤峰街17巷8號 | 赤峰街17巷8號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17490162592076265199&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Norma Coffee 諾馬咖啡-大同哈密店 | 台北市大同區哈密街65號 | 哈密街65號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5823098901930308613&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| NOTCH內湖店 | 台北市內湖區內湖路一段411巷10-2號 | 內湖路一段411巷10號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10625803100172993584&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| nu studio ( nuhi / nanhi ) | 106台北市大安區瑞安街208巷5號 | 106臺北市大安區瑞安街208巷5號 | OPERATIONAL |  |
| OD Café | 台北市大安區溫州街58巷2號 | 溫州街58巷2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=7550369222329738529&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Ontheway cafe | 106047台北市大安區通化街19巷11號 | 通化街19巷11號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4204142673150190083&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Orange看電車咖啡館 | 台北市士林區文林路302號 | 文林路302號 | OPERATIONAL |  |
| Orchard CAFE | 10491台北市中山區民權東路一段79號1樓 | 民權東路一段79號1樓 | OPERATIONAL |  |
| OROMO CAFE 世貿店 | 110台北市信義區吳興街15號 | 吳興街15號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14785543965008182995&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Our time Cafe Resturant時光・我們的 | 台北市松山區敦化北路155巷91號 | 敦化北路155巷91號 | OPERATIONAL |  |
| Out of office 不在辦公室 | 台北市忠孝東路五段之17號之3B1 | B1 No, No. 17-3號忠孝東路五段 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4035073504783930122&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Peace & Love Cafe | 新北市新店區民權路42巷18號 | 231新北市新店區民權路42巷18號 | OPERATIONAL |  |
| Petite Cafe 波醍精品咖啡館 新光三越信義 A4 店 | 台北市信義區松高路新光三越A4 | 松高路19號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=6389526787805441001&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Phoenix Roasteria 鳳焙吉林 | 台北市中山區吉林路323號 | 吉林路323號1樓 | OPERATIONAL |  |
| Pica Pica Café 喜鵲咖啡 | 台北市大安區羅斯福路三段269巷74號 | 羅斯福路三段269巷74號 | OPERATIONAL |  |
| Pillow Caf'e | 台北市大安區瑞安街133號 | 瑞安街133號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12447523023099101076&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Polar Cafe 民生店 | 台北市民生東路五段69巷2-2號 | 延壽街329號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9880809164616588294&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| PONPIE澎派 | 220新北市板橋區民權路202巷4弄1號 | 民權路202巷4弄1號 | OPERATIONAL |  |
| Powder Workshop | 台北市大安區信義路二段86巷25號 | 106臺北市大安區信義路二段86巷25號1樓 | OPERATIONAL |  |
| Q咖啡工作室 | 新北市鶯歌區南雅路493號 | 南雅路493號 | OPERATIONAL |  |
| Quel Café - 克爾‧何等的咖啡 | 台北市松山區民權東路三段140巷2號之1 | 民權東路三段140巷2-1號 | OPERATIONAL |  |
| R•U Coffee | 台北市士林區德行東路90巷11號 | 德行東路90巷11號 | OPERATIONAL |  |
| Racer Cafe | 新北市永和區文化路174號 | 文化路174號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=18347486971483569761&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Rayca Coffee 雷咖咖啡錦西店 | 台北市中山區錦西街24號 | 錦西街24號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15847653806639838253&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Red Best Coffee 紅頂商人咖啡 | 台北市士林區環河北路三段119號 | 環河北路三段119號 | OPERATIONAL |  |
| Reeds Cafe 內湖店 | 台北市內湖區成功路三段146號 | 成功路三段146號 | OPERATIONAL |  |
| REEDS Cafe Beitou | 112台北市北投區磺港路6號 | 磺港路6號 | OPERATIONAL |  |
| Rilakkuma CafE | 台灣大安台北 | 106臺北市大安區忠孝東路四段248巷3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15424965654567676995&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Rooftop café 頂樓咖啡 | 新北市三峽區三樹路64號1樓 | 三樹路64號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10991442310848840031&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| SD Coworking Plaza | 台北市中山區合江街102巷18號 | 合江街102巷18號2樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2663527188300396034&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Sit Down Plz Coffee Roasting 西當･普里斯 | 新北市三重區安樂街47號 | 安樂街47號 | OPERATIONAL |  |
| Sole Cafe（二店） | 台北市信義區菸廠路88號 | 菸廠路88號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=450554033579845076&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Steam E;den Café 蒸氣龐克主題咖啡館 | 台北市中山區中山北路二段42巷10號1樓 | 1 No. 10號, 中山北路二段42巷 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=702131447704992198&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Strange Brew Coffe Roster 怪咖啡自家烘焙 | 台北市安居街108巷20號1樓 | 安居街108巷20號1樓 | OPERATIONAL |  |
| SunSquareCafe | 新北市蘆洲區鷺江街65號 | 鷺江街65號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8331202904581081776&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Sway Black Coffee 嗜黑精品咖啡專門店 | 台北市松山區八德路二段352號 | 八德路二段352號 | OPERATIONAL |  |
| SweetWater | 台北市松山區民生東路五段63號1樓 | 民生東路五段63號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2498964154660690179&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| SWELL CO.CAFE | 台北市大安區四維路23號 | 四維路23號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15812429105818033076&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| TAHOJA（已停業） | 台北市太原路46號 | 太原路46號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8386625221603481835&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Taipei8 cafe | 台北市中山區林森北133巷47號 | 林森北路133巷47號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=5752300185211435330&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| TapLife Cafe & Studio | 台北市信義區松德路106號1樓 | 松德路106號 | OPERATIONAL |  |
| TAV Cafe 藝術村餐坊 | 台北市中正區北平東路7號 | 北平東路7號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15143544660346950365&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| TCWJ輕鬆片嗑 | 台北市大同區大龍街98號 | 大龍街98號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15020188656894393257&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| TEMP COFFEE | 新北市新莊區幸福路825-1號1樓 | 幸福路825-1號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=8964216779518122640&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| The Five Cafe Lab | 台北市內湖區民權東路六段461號 | 樓號, No. 461號1民權東路六段 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=18420163140176195689&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| The Lobby of Simple Kaffa | 台北市中正區忠孝東路二段27號 | 100臺北市中正區忠孝東路二段27號 | OPERATIONAL |  |
| THE NORMAL | 106台北市大安區仁愛路四段413號1樓 | 仁愛路四段413號 | OPERATIONAL |  |
| THE NORMAL 敦北店 | 105台北市松山區敦化北路50巷17號1樓 | 敦化北路50巷17號1樓 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=294405000857384667&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| THIRD FLOOR COFFEE 在三樓 | 台北市中山區八德路二段330號三樓 | 3樓, No. 330號八德路二段 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13617612223666283386&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| tic tac cafe 踢他咖啡 | 新北市永和區成功路二段79號 | 成功路二段79號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14930845697700665843&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Touching | 台北市大安區羅斯福路三段269巷6-1號 | 105臺北市松山區南京東路三段269巷6-1號 | OPERATIONAL |  |
| Travel Eye Cafe（已停業） | 松山區八德路3段12巷4弄15號1樓 台北市 | 八德路三段12巷4弄15號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4613351262987857361&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Trunko cafe | 台北市安和路二段59巷5號 | 安和路二段59巷5號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13119529359364155006&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Tzubi Park Project 趣未商行-公園計劃 | 114台北市內湖區新湖二路(行愛路77巷進) | 114新湖二路259巷7號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2509834545311851106&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| U.latte 雨你咖啡 2號店 | 10556台北市松山區八德路二段360-2號 | 八德路二段360-2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=9965361209319363875&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| ville cafe | 台北市中正區羅斯福路三段284巷5號 | 羅斯福路三段284巷5號 | OPERATIONAL |  |
| Vinyl Decision 黑膠咖啡 | 台北市信義區崇德街38巷6號 | 110臺北市信義區崇德街38巷6號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=12572798097782131219&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Vis cafe 覓時咖啡 南京三民店 | 105台北市松山區八德路四段245巷48號 | 八德路四段245巷48號 | OPERATIONAL |  |
| Vis Cafe 窩是咖啡 | 台北市大同區酒泉街34-3號 | 酒泉街34-3號 | OPERATIONAL |  |
| W&M workshop | 台北市中山區林森北路487號1樓225室 | 104臺北市中山區林森北路487號1樓225室 | OPERATIONAL |  |
| Waffle Please 比利時列日鬆餅專賣店 | 台北市內湖區港墘路127巷7號 | 港墘路127巷7號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=13442467296963482246&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Walk in Cafe | 新北市林口區東湖路155號 | 東湖路155號 | OPERATIONAL |  |
| wanaka coffee | 台北市松山區東興路21號 | 10570臺北市松山區東興路21號 | OPERATIONAL |  |
| WaWa Land 保平直營店（已歇業） | 234 新北市永和區保平路 262 號 | 保平路262號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=10049494527036437698&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| WeiCoffee. | 台北市中山區四平街89號 | 四平街89號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17697834597810231395&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| WellMore維摩甜點 | 台北市民生東路三段113巷25弄4號 | 民生東路三段113巷25弄4號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15152443764155882612&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| WhisperCoffee 微聲咖啡 | 新北市三重區成功路108巷6之2號 | 成功路108巷6之2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=2851514162040315469&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Who's Cafe 誰的書房（永久停業） | 台北市大安區永康街75巷14-2號 | 永康街75巷14-2號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=4745083656967029599&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Wicked Wolfpack | 台北市士林區中山北路七段29號 | 中山北路七段29號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14186945864596392808&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Wishing Coffee | 114台灣台北市內湖區內湖路一段591巷6號 | 內湖路一段591巷6號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=3588055958424827699&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| WM咖啡工作室｜我想喝咖啡｜WMcoffeestudio｜ | 241新北市三重區新北大道一段46巷18弄17號 | 新北大道一段46巷18弄17號 | OPERATIONAL |  |
| wow cafe' | 新北市深坑區昇高坑路30號 | 昇高坑路30號 | OPERATIONAL |  |
| Yvonne Caf'e（已停業） | 台北市大安區信義路三段109-4號 | 號 No. 109-4, 信義路三段 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=15700964102981475942&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| Zaki | 234新北市永和區, 永利路94和縣巷3號 | 234新北市永和區永利路94巷3號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=17649382624013578953&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |
| ZOo Café -入咖啡 | 新北市板橋區東門街20號 | 220新北市板橋區東門街20號 | CLOSED_PERMANENTLY | https://maps.google.com/?cid=14616096231355008979&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAIYBCAA |

## 2. 疑似暫停營業

| 店名 | 資料地址 | Google 比對地址 | 狀態 | Google Maps |
| --- | --- | --- | --- | --- |
| 七三茶堂 7teahouse | 台北市信義區忠孝東路四段553巷46弄16號 | 光復南路133號B4櫃位E103製菸工廠東向1樓 A7 | CLOSED_TEMPORARILY |  |
| 1+1 Together Republic Cafe | 台北市中山區中山北路二段26巷10-1號 | 號2F, No. 10-1中山北路二段26巷 | CLOSED_TEMPORARILY |  |
| 11號精品咖啡 | 台北市萬華區興義街11號 | 興義街11號 | CLOSED_TEMPORARILY |  |
| 八米共同工作空間 8 Meters Coworking Space | 台北市大安區和平東路二段107巷23弄6號 | 和平東路二段107巷23弄6號 | CLOSED_TEMPORARILY |  |
| 八拾捌茶輪番所 Rinbansyo | 台北市萬華區中華路一段174號 | 中華路一段174號 | CLOSED_TEMPORARILY |  |
| 士林三號出口咖啡廳 | 台北市士林區福德路31-1號 | 福德路31-1號 | CLOSED_TEMPORARILY |  |
| 大樹下 | 忠孝東路四段181巷40弄12號 | 敦化南路一段187巷75之一號號旁 | CLOSED_TEMPORARILY |  |
| 大樹書房 | 新北市淡水區中正路一段6巷36號(雲門劇場旁) | 中正路一段6巷36號 | CLOSED_TEMPORARILY |  |
| 小吉市場 | 台北市南昌路二段111號2樓 | 南昌路二段111號2樓 | CLOSED_TEMPORARILY |  |
| 卡瓦利義式咖啡館 | 台北市大安區永康街2巷5號 | 112臺北市北投區大業路554號 | CLOSED_TEMPORARILY |  |
| 四婁cafeˊ | 新北市土城區中央路三段126巷21號4樓 | 中央路三段126巷21號4 樓 | CLOSED_TEMPORARILY |  |
| 共楽 | 台北市大同區赤峰街22號1樓 | 103臺北市大同區赤峰街22號一樓 | CLOSED_TEMPORARILY |  |
| 好藝時光﹒beitou times | 112 台北市台北市北投區大業路727號 | 大業路727號 | CLOSED_TEMPORARILY |  |
| 有點胖咖啡 | 新北市新莊區建興街63號 | 建興街63號 | CLOSED_TEMPORARILY |  |
| 自在田 | 台北市文山區老泉街45巷27號 | 老泉街45巷27號 | CLOSED_TEMPORARILY |  |
| 艾斯糖 S Don Coffee | 台北市大安區新生南路一段97巷13號 | 新生南路一段97巷13號 | CLOSED_TEMPORARILY |  |
| 初心者咖啡店 | No. 6號民生東路三段88巷中山區台北市10491 | 民生東路三段88巷6號 | CLOSED_TEMPORARILY |  |
| 沐鴉咖啡 | 台北市中山區伊通街19巷8號 | 伊通街19巷8號 | CLOSED_TEMPORARILY |  |
| 沛洛瑟 | 100台北市中正區中華路二段75巷40號 | 中華路二段75巷40號 | CLOSED_TEMPORARILY |  |
| 松菸小賣所 | 松山文創園區 東向製菸工廠1樓 | 光復南路133號松菸小賣所2號店 | CLOSED_TEMPORARILY |  |
| 南美咖啡(天母店) | 台北市士林區天母西路13巷19號 | 天母西路13巷19號 | CLOSED_TEMPORARILY |  |
| 城市草倉 C-tea loft | 台北市大安區羅斯福路三段283巷19弄4號 | 羅斯福路三段283巷19弄4號 | CLOSED_TEMPORARILY |  |
| 後台咖啡 | 台北市大安區羅斯福路四段1號 台大綜合體育館2樓206室及214室 | 羅斯福路四段1號台大綜合體育館2樓206室 | CLOSED_TEMPORARILY |  |
| 閃咖啡 Shiny Caf'e | 111台北市士林區大南路288號 | 承德路四段278號 | CLOSED_TEMPORARILY |  |
| 喝什麼。KaPi | 台北市中山區民權西路36-1號 | 民權西路36-1號 | CLOSED_TEMPORARILY |  |
| 無 · 咖啡 | 台北市中正區濟南路二段36號 | 濟南路二段36號 | CLOSED_TEMPORARILY |  |
| 街口6號珈啡 | 台北市貴陽街二段6號 | 中華路一段182號 2號樓 之 2 | CLOSED_TEMPORARILY |  |
| 奧爾咖啡 OUR Cafe | 新北市永和區信義路25巷3號1樓 | 信義路25巷3號1樓 | CLOSED_TEMPORARILY |  |
| 微貳獨冊（自由咖啡ZU CAFE） | 台北市大安區光復南路346巷56號 | 光復南路346巷56號 | CLOSED_TEMPORARILY |  |
| 愛上咖啡館A LOVING CAFE | 台北市士林區中正路235巷47號 | 號 No, No. 47中正路235巷 | CLOSED_TEMPORARILY |  |
| 暗角咖啡 | 台北市中正區廈門街1號 | 108臺北市萬華區漢口街二段90巷8弄3號二樓 | CLOSED_TEMPORARILY |  |
| 椿咖啡 | 104台北市中山區民權東路一段七十巷十號 | 民權東路一段七十巷十號 | CLOSED_TEMPORARILY |  |
| 溫叨CAFE | 台北市中正區新生南路一段162號 | 110臺北市信義區菸廠路88號2樓 | CLOSED_TEMPORARILY |  |
| 肆序商行 Sù Sī Coffee Roaster | 台中市大甲區鎮瀾街177號1樓 | 鎮瀾街177號 | CLOSED_TEMPORARILY |  |
| 頓益咖啡匠 | 10491台灣台北市中山區遼寧街108巷3號 | 遼寧街108巷3號 | CLOSED_TEMPORARILY |  |
| 慢豆君MR.SLOW | 10491台北市中山區明水路575號 | 明水路575號B1 | CLOSED_TEMPORARILY |  |
| 敲我Ciao.O烘焙工作室 | 新北市新莊區明中街36號 | 明中街36號 | CLOSED_TEMPORARILY |  |
| 福璟鮮烘咖啡店 | 新北市中和區景平路598號 | 景平路598號 | CLOSED_TEMPORARILY |  |
| 窩著咖啡 perch cafe | 104台北市中山區松江路97巷2號 | 松江路97巷2號 | CLOSED_TEMPORARILY |  |
| 器咖啡 | 台北市大安區新生南路一段133-3號2樓 | 新生南路一段133之3號寵物公園樓上2樓 | CLOSED_TEMPORARILY |  |
| 鮮烘咖啡工作室 | 台北市雲和街95號 | 辛亥路一段87號 | CLOSED_TEMPORARILY |  |
| 點星咖啡 café l'étoile | 106台北市大安區忠孝東路三段248巷13弄12號1樓 | 忠孝東路三段248巷13弄12號1樓 | CLOSED_TEMPORARILY |  |
| 藍色公路海景咖啡館 | 244新北市林口區瑞平村66號 | 瑞平里9鄰66號 | CLOSED_TEMPORARILY |  |
| 豐巢咖啡 | 115台北市南港區舊莊街一段3巷12弄6號 | 舊莊街一段3巷12弄6號 | CLOSED_TEMPORARILY |  |
| 獺空間 Aotter Space | 台北市松山區光復北路95號1F | 光復北路95號 | CLOSED_TEMPORARILY |  |
| 鐵咖咖啡 | 新北市土城區中央路二段61巷30號 | 中央路二段61巷30號1樓 | CLOSED_TEMPORARILY |  |
| AGCT Apartment | 台北市大安區溫州街49巷2-2號3樓 | 羅斯福路三段283巷19弄4號 | CLOSED_TEMPORARILY |  |
| AZ Coffee | 242新北市新莊區建興街11號 | 建興街11號 | CLOSED_TEMPORARILY |  |
| BONBE COFFEE | 新北市新莊區中平路380號 | 中平路380號 | CLOSED_TEMPORARILY |  |
| Cafe Bastille 台大 | 台北市大安區溫州街91號 | 溫州街91號 | CLOSED_TEMPORARILY |  |
| CAFEPRO | 114台北市內湖區新湖一路128巷15號1樓 | 新湖一路128巷15號1樓 | CLOSED_TEMPORARILY |  |
| Charming Chat Café(CCCafé) | 112台北市北投區石牌路一段39巷136號 | 號1樓, No. 136石牌路一段39巷 | CLOSED_TEMPORARILY |  |
| CO77EE | 台北市南港區市民大道七段7號 | 市民大道七段7號 | CLOSED_TEMPORARILY |  |
| DoDidDone Coffee Research | 台北市松山區民權東路三段103巷3號 | 105臺北市松山區健康路58巷3號 | CLOSED_TEMPORARILY |  |
| Doffee 驢咖啡 | 新北市新莊區明中街1號 | 明中街1號 | CLOSED_TEMPORARILY |  |
| Engedi Koffee Espresso Bar&Prophesy（已停業） | Engedi Koffee Espresso Bar&Prophesy | 泰順街26巷4-1號 | CLOSED_TEMPORARILY |  |
| G log 咖啡館 | 台北市大安區仁愛路三段31巷16號 | 仁愛路三段31巷16號1樓 | CLOSED_TEMPORARILY |  |
| Hera Cafe | 台北市大同區承德路二段一巷7號 | 承德路二段1巷7號 | CLOSED_TEMPORARILY |  |
| In Natural Coffee 陽光夏 | 台北市中正區衡陽路15號 | 衡陽路15號1樓 | CLOSED_TEMPORARILY |  |
| M式烘豆所咖啡館 | 新北市中和區連城路89巷18號1樓 | 連城路89巷18號 | CLOSED_TEMPORARILY |  |
| Moodie Cafe | 新北市樹林區復興路41號 | 復興路41號 | CLOSED_TEMPORARILY |  |
| O.L.O Café | 台北市松山區南京東路五段97號 | 南京東路五段97號 | CLOSED_TEMPORARILY |  |
| OFNA Coffee | 105 台北市 南京東路五段66巷2弄11號1樓 | 南京東路五段66巷2弄11號1樓 | CLOSED_TEMPORARILY |  |
| P&C Boutique Cafe | 台北市大同區赤峰街28之4號 | 赤峰街28之4號 | CLOSED_TEMPORARILY |  |
| PIQUE NIQUE Cafe 野餐咖啡館 | 台北市北投區中央北路三段65號 | 中央北路三段53巷1號1F-1 | CLOSED_TEMPORARILY |  |
| T-park cafe&eatery | 台北市中山區林森北路107巷10號 | 林森北路107巷10號1樓 | CLOSED_TEMPORARILY |  |
| The Shrine | 台北市中正區師大路132號 | 師大路132號 | CLOSED_TEMPORARILY |  |
| TRIVOC | 內湖區新湖ㄧ路143號 | 新湖一路143號 | CLOSED_TEMPORARILY |  |
| WhyWhy壞壞Cafe | 台北市松山區八德路四段245巷32弄20號 | 八德路四段245巷32弄20號 | CLOSED_TEMPORARILY |  |

## 3. 找不到 Google 候選

| 店名 | 資料地址 | 來源網址 | 原因 |
| --- | --- | --- | --- |
| 久久津乳酪菓子手造所-南港 | 台北南港區興中路12巷9號 |  | No Google Places candidate found |
| 公雞咖啡 | 臺北市中山區南京西路25巷20號之5 | https://www.facebook.com/RoosterCafe/ | No Google Places candidate found |
| 水牛書店 | 台北市大安區瑞安街222巷2號 | https://www.facebook.com/ShuiNiuWenHuaShiYe/ | No Google Places candidate found |
| 良日激動所（已遷址） |  | https://www.facebook.com/良日artxspace-844356629017014/ | No Google Places candidate found |
| 拾貨咖啡 | 220新北市板橋區貴興路97號 | https://coffee-shop-3972.business.site/ | No Google Places candidate found |
| 旅心咖啡 | 台北市民生西路421號 (423巷裡) | https://www.facebook.com/ROUTECAFE55 | No Google Places candidate found |
| CAFEPRO職人咖啡商行林口店 | 24452新北市林口區粉寮路一段86號1樓 |  | No Google Places candidate found |
| Milx | 台北市民生東路二段127巷21號 | https://www.facebook.com/pg/milx.tw | No Google Places candidate found |
| Node.Tent | 捷運東門站四號出口步行2分鐘 | https://www.fineighbor.com/tent | No Google Places candidate found |
| T&T cafe (已歇業) | 台北市南港區永吉路544號 | https://www.facebook.com/tt.cafe1020214/ | No Google Places candidate found |

## 4. API / 權限 / 配額問題

| 店名 | 資料地址 | 來源網址 | 原因 |
| --- | --- | --- | --- |
| 11 Cafe' | 台北市信義區忠孝東路四段553巷12號 | https://www.facebook.com/11Cafe | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 19烘豆研究室 | 台北市松山區民生東路五段175之1號 | https://www.facebook.com/pg/19coffeeroastinglab/about/?ref=page_internal | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 一杯咖啡士林店 | 台北市士林區中山北路五段505巷36號 | https://www.facebook.com/acupofcoffeeshilin/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 予菓．銅鑼燒&手作烘焙工坊 | 台北市士林區士東路66號 | https://www.facebook.com/aug16coffee/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 加爾第咖啡(莊敬店) | 台北市信義區吳興街269巷1弄21號 | https://www.facebook.com/KaldiCoffee1989JJ/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 安和353咖啡會館 | 台北市大安區安和路二段35巷3號1樓 | https://www.facebook.com/%E5%AE%89%E5%92%8C353%E5%92%96%E5%95%A1%E6%9C%83%E9%A4%A8-712242285885693/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 安提.司朵 | 台北市內湖區成功路五段402號 |  | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 米卡咖啡 Mica Coffee | 108台北市萬華區西園路一段236號 | https://zh-tw.facebook.com/Micacoffee | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 老窩咖啡-吳興店 | 吳興街29號 | https://www.facebook.com/LAOOCOFF/ | Text Search denied: API keys with referer restrictions cannot be used with this API. |
| 伯朗咖啡館 南京概念店 | 台北市中山區南京東路二段218號 |  | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 沛二/ what the shot | 台北市松山區健康路189號 | https://m.facebook.com/pelosocoffee2/ | fetch failed |
| 紅澤咖啡豆販 | 新北市板橋區文化路二段441巷2弄7號 | https://www.facebook.com/caferedbean/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 宸品咖啡 | 台北市和平東路一段226號 | https://www.facebook.com/%E5%AE%B8%E5%93%81%E5%92%96%E5%95%A1-472800089434228/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 著·咖啡 Draw Coffee 東門店 | 106台北市大安區金山南路二段15號 |  | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 隅咖啡Aroundtheblock | 100台北市中正區汀州路二段175號 |  | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 蜂巢咖啡 | 新北市永和區永貞路214號 | https://www.facebook.com/honeycombcafe2016/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 路易莎新月橋店 | 新北市新莊區新泰路2-21號 | https://www.facebook.com/louisa.bridge.coffee/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| 曬貓咖啡 | 106台北市大安區106和平東路2段107巷23弄17號1樓 |  | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| alpha Black (延吉店) | 台北市大安區忠孝東路四段250-2號1樓 |  | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| C25度咖啡館 | 臺北市大安區安和路一段21巷23號1F | https://www.facebook.com/c25cafe/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| Cafe Fundoor 咖啡方桌 | 台北市大安區大安路二段55號 | https://www.facebook.com/CafeFundoor/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| Dreamers Coffee Roasters忠誠店 | Dreamers Coffee Roasters忠誠店 |  | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| HI-HAT COFFEE | 台北市中正區齊東街68號 | https://www.facebook.com/HIHATCOFFEE/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| HITOKUCHI COFFEE 一口一口咖啡 | 234新北市永和區復興街102號 | https://www.facebook.com/HitokuchiCoffee/ | fetch failed |
| JOMO Coffee 葫洲店 | 114台北市內湖區康寧路三段99巷17弄28-1號 | https://www.facebook.com/jomocoffee/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| LAIFA Coffee Bar - 來發咖啡吧 | 新北市樹林區中華路80號-1 | https://www.facebook.com/LAIFACoffeeBarMan/ | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| Louisa 明德店 | 台北市北投區明德路119號 |  | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| Middle Name coffee & space | 103台北市大同區南京西路18巷10號 | https://www.facebook.com/middlenamecoffee | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| Miss May Cafe | 寶強路5號 |  | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| Olivia Coffee Roaster | 106, Taipei City, Da’an District, 光復南路346巷50號台灣 |  | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| S&D 新北園區店 | 新北市新莊區五工三路87號 | https://www.facebook.com/fly7788995/?ref=aymt_homepage_panel | Text Search denied: API keys with referer restrictions cannot be used with this API. |
| Take away_帶著走 | 士林區中正路213巷2-1號 | https://www.facebook.com/pg/takeawaycoffeetogo/about/?ref=page_internal | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |
| THT唱片 | 台北市中山區興安街10-2號 | https://www.facebook.com/THTRECORDs/?fref=ts | Nearby Search failed: 400 |
| Uranium Cafe | 復興南路一段253巷32號 |  | Nearby Search denied: API keys with referer restrictions cannot be used with this API. |

## 5. Google 有回店家但沒有 business status

| 店名 | 資料地址 | Google 比對地址 | Google Maps |
| --- | --- | --- | --- |
| 康定19綠色人文饗味空間 | 108台北市萬華區康定路19號 | 108台灣臺北市萬華區康定路19號 |  |
| MASS CAFE（已歇業） | 新北市板橋區南雅南路二段11-28號 | 220新北市板橋區南雅南路二段11-28號 |  |
| Rich cafe睿淇咖啡 | 新北市三重區頂崁街234巷1號 | 241新北市三重區頂崁街234巷1號 |  |
