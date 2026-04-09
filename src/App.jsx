import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { createClient } from "@supabase/supabase-js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SUPABASE_URL = "https://dmymcnmsyhppwstpwmal.supabase.co";
const SUPABASE_KEY = "sb_publishable_2mlstxr8qtRrybaIyBIB8Q_oS_Im60Q";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ADMIN_EMAIL = "vivi09032000@gmail.com";

async function getCrowdReport(cafeId) {
  const since = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/crowd_reports?cafe_id=eq.${cafeId}&Reported_at=gte.${since}&order=Reported_at.desc&limit=1`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const report = data[0] || null;
  // Handle case-sensitivity mismatch if the column is Capitalized in the DB
  if (report && report.Reported_at && !report.reported_at) {
    report.reported_at = report.Reported_at;
  }
  return report;
}

async function fetchEmptyCafeIds() {
  const since = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/crowd_reports?Reported_at=gte.${since}&order=Reported_at.desc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const map = {};
  for (const r of data) {
    if (!map[r.cafe_id]) map[r.cafe_id] = r;
  }
  return new Set(Object.keys(map).filter(id => map[id].status === "empty"));
}

async function submitCrowdReport(cafeId, status) {
  await fetch(`${SUPABASE_URL}/rest/v1/crowd_reports`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cafe_id: cafeId, status }),
  });
}

const T = {
  brown: "#5C3D2E", darkBrown: "#3E2723", cream: "#FAF6F0",
  beige: "#E8DDD0", green: "#2D4A3E", gold: "#C9A84C",
  text: "#2C2016", sub: "#7A6652", tag: "#2D4A3E",
};
const UI = {
  paper: "#FFFDF8",
  oat: "#F6EFE7",
  latte: "#EFE4D5",
  surface: "#FFFDF8",
  panel: "rgba(255, 253, 248, 0.92)",
  line: "rgba(92, 61, 46, 0.14)",
  softLine: "rgba(92, 61, 46, 0.08)",
  hairline: "rgba(92, 61, 46, 0.08)",
  muted: "rgba(122, 102, 82, 0.88)",
  subtle: "rgba(122, 102, 82, 0.72)",
  onDark: "#FFF8EE",
  onDarkMuted: "#F1E5D6",
  placeholder: "#A89880",
  inputBorder: "#C8BFB5",
  chipNeutral: "#E7DCCD",
  chipNeutralText: "#8A745F",
  warning: "#B7791F",
  danger: "#9B2335",
  scoreWarm: "#C8A96D",
  scoreClay: "#B9785F",
  scoreTrack: "rgba(92, 61, 46, 0.12)",
  overlay: "rgba(32, 24, 18, 0.26)",
  sage: "#6F7F62",
  shadow: "0 10px 24px rgba(62, 39, 35, 0.06)",
  shadowMedium: "0 14px 34px rgba(62, 39, 35, 0.14)",
  shadowStrong: "0 18px 40px rgba(62, 39, 35, 0.18)",
  drawerShadow: "-18px 0 40px rgba(62, 39, 35, 0.18)",
  shadowSoft: "0 6px 16px rgba(62, 39, 35, 0.04)",
  activeShadow: "0 10px 22px rgba(92, 61, 46, 0.10)",
  activeShadowSmall: "0 8px 18px rgba(92, 61, 46, 0.12)",
  controlShadow: "0 8px 22px rgba(62, 39, 35, 0.13)",
  popupShadow: "0 12px 28px rgba(62, 39, 35, 0.16)",
  shellShadow: "0 0 40px rgba(62, 39, 35, 0.15)",
  greenShadow: "0 8px 18px rgba(45, 74, 62, 0.12)",
  navFade: "linear-gradient(180deg, rgba(250, 246, 240, 0), rgba(232, 221, 208, 0.96) 34%)",
  avatarGradient: "linear-gradient(180deg, #F1E7DA 0%, #EADCCC 100%)",
  selectedTint: "rgba(92, 61, 46, 0.04)",
  selectedHairline: "rgba(92, 61, 46, 0.06)",
  cardBorder: "rgba(232, 221, 208, 0.75)",
  regionBorder: "rgba(232, 221, 208, 0.92)",
  activeSubtitle: "rgba(255, 248, 238, 0.82)",
  pageBg: "#F0EBE4",
  mapUser: "#4285F4",
  mapStation: "#C84C31",
  mapPinInner: "#FFF8EE",
};
const FONT = {
  display: "'Playfair Display', Georgia, serif",
  body: "-apple-system, BlinkMacSystemFont, 'PingFang TC', 'Noto Sans TC', sans-serif",
};
const TYPE = {
  brand: { fontFamily: FONT.display, fontSize: "1.18rem", lineHeight: 1.08, fontWeight: 700, letterSpacing: "-0.012em" },
  pageTitle: { fontFamily: FONT.body, fontSize: "1.18rem", lineHeight: 1.2, fontWeight: 780, letterSpacing: "-0.024em" },
  detailTitle: { fontFamily: FONT.display, fontSize: "1.46rem", lineHeight: 1.12, fontWeight: 700, letterSpacing: "-0.034em" },
  sectionTitle: { fontSize: "0.98rem", lineHeight: 1.28, fontWeight: 760, letterSpacing: "-0.018em" },
  cardTitle: { fontSize: "0.95rem", lineHeight: 1.36, fontWeight: 760, letterSpacing: "-0.018em" },
  body: { fontSize: "0.875rem", lineHeight: 1.52, fontWeight: 500 },
  meta: { fontSize: "0.78rem", lineHeight: 1.48, fontWeight: 500 },
  caption: { fontSize: "0.72rem", lineHeight: 1.42, fontWeight: 600 },
  control: { fontSize: "0.78rem", lineHeight: 1, fontWeight: 720 },
  nav: { fontSize: "0.68rem", lineHeight: 1.1, fontWeight: 680 },
};
const SPACE = {
  pageX: 16,
  headerTop: 16,
  headerBottom: 12,
  sectionGap: 14,
  groupGap: 10,
  chipGap: 7,
  cardGap: 12,
  cardPad: 14,
  cardPadX: 15,
};

const REGION_PROMPT_KEY = "prompt";
const REGION_STORAGE_KEY = "cafe-voyage:region";
const COUNTRY_STORAGE_KEY = "cafe-voyage:country";
const LANGUAGE_STORAGE_KEY = "cafe-voyage:lang";
const MAP_CACHE_KEY = "cafe-voyage:map-cafes:v2";
const MAP_CACHE_TTL = 1000 * 60 * 60 * 12;
const SEARCH_INPUT_STYLE = {
  width: "100%",
  padding: "10px 14px 10px 36px",
  borderRadius: 14,
  border: `1px solid ${UI.inputBorder}`,
  background: UI.surface,
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
  color: T.text,
  fontWeight: 500,
  boxShadow: UI.shadowSoft,
};
const REGION_PATTERN = /(台北市|新北市|桃園市|台中市|臺中市|台南市|臺南市|高雄市|基隆市|新竹市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義市|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|臺東縣)/;
const LANGUAGE_OPTIONS = [
  { key: "zh", label: "中文" },
  { key: "en", label: "English" },
];
const COUNTRY_OPTIONS = [
  { key: "taiwan", labels: { zh: "台灣", en: "Taiwan" }, code: "TW" },
  { key: "vietnam", labels: { zh: "越南", en: "Vietnam" }, code: "VN" },
  { key: "thailand", labels: { zh: "泰國", en: "Thailand" }, code: "TH", comingSoon: true },
  { key: "japan", labels: { zh: "日本", en: "Japan" }, code: "JP", comingSoon: true },
];
const REGION_GROUPS = [
  { key: "taipei", labels: { zh: "台北", en: "Taipei" }, country: "taiwan", members: ["台北市", "新北市"] },
  { key: "taichung", labels: { zh: "台中", en: "Taichung" }, country: "taiwan", members: ["台中市"] },
  { key: "tainan", labels: { zh: "台南", en: "Tainan" }, country: "taiwan", members: ["台南市"] },
  { key: "kaohsiung", labels: { zh: "高雄", en: "Kaohsiung" }, country: "taiwan", members: ["高雄市"] },
  { key: "chiayi", labels: { zh: "嘉義", en: "Chiayi" }, country: "taiwan", members: ["嘉義市", "嘉義縣"] },
  { key: "hsinchu", labels: { zh: "新竹", en: "Hsinchu" }, country: "taiwan", members: ["新竹市", "新竹縣"] },
  { key: "taoyuan", labels: { zh: "桃園", en: "Taoyuan" }, country: "taiwan", members: ["桃園市"] },
  { key: "keelung", labels: { zh: "基隆", en: "Keelung" }, country: "taiwan", members: ["基隆市"] },
  { key: "miaoli", labels: { zh: "苗栗", en: "Miaoli" }, country: "taiwan", members: ["苗栗縣"] },
  { key: "changhua", labels: { zh: "彰化", en: "Changhua" }, country: "taiwan", members: ["彰化縣"] },
  { key: "nantou", labels: { zh: "南投", en: "Nantou" }, country: "taiwan", members: ["南投縣"] },
  { key: "yunlin", labels: { zh: "雲林", en: "Yunlin" }, country: "taiwan", members: ["雲林縣"] },
  { key: "pingtung", labels: { zh: "屏東", en: "Pingtung" }, country: "taiwan", members: ["屏東縣"] },
  { key: "yilan", labels: { zh: "宜蘭", en: "Yilan" }, country: "taiwan", members: ["宜蘭縣"] },
  { key: "hualien", labels: { zh: "花蓮", en: "Hualien" }, country: "taiwan", members: ["花蓮縣"] },
  { key: "taitung", labels: { zh: "台東", en: "Taitung" }, country: "taiwan", members: ["台東縣"] },
  { key: "hoi_an", labels: { zh: "會安", en: "Hoi An" }, country: "vietnam", members: ["Hội An", "Hoi An", "會安"] },
];

const COPY = {
  zh: {
    searchPlaceholder: "搜尋店名、地址、地標",
    common: {
      all: "全部",
      loadingCafes: "載入咖啡廳...",
      loadingMap: "載入地圖資料...",
      countUnit: "間",
      cityPrompt: "選地區",
      viewDetails: "查看詳情",
      openInGoogleMaps: "在 Google Maps 開啟",
      similarTagsHint: "點標籤看相似店",
      comingSoon: "即將推出",
      settings: "設定",
      region: "地區",
      language: "語言",
      save: "儲存",
      clear: "清除",
      filter: "篩選",
      collapseFilters: "收起篩選",
    },
    nav: { home: "首頁", nearby: "附近", map: "地圖", favorites: "收藏" },
    settings: {
      openMenu: "開啟設定選單",
      close: "關閉設定",
      loggedIn: "已登入",
      notLoggedIn: "尚未登入",
      connectedGoogle: "已連接 Google 帳號",
      syncFavorites: "用 Google 同步收藏",
      signIn: "用 Google 登入",
      signInBusy: "前往 Google...",
      signOut: "登出",
      signOutBusy: "登出中...",
      aboutTitle: "關於 Cafe Voyage",
      aboutSubtitle: "找工作、放空、約會都剛好的咖啡廳地圖",
      feedbackTitle: "意見回饋",
      feedbackSubtitle: "建議或錯誤回報",
      supportTitle: "Buy me a coffee",
      supportSubtitle: "支持 Cafe Voyage",
      switchCountry: "切換國家選單",
    },
    tags: {
      noLimit: "不限時",
      holidayLimit: "△ 假日限時",
      limited: "✗ 有限時",
      socketMany: "插座多",
      socketFew: "插座少",
      standing: "站立桌",
      tempClosed: "暫停營業",
      empty: "很空",
    },
    filters: {
      noLimit: "不限時",
      socket: "插座多",
      standing: "站立桌",
      wifi: "WiFi穩",
      quiet: "超安靜",
      tasty: "咖啡好喝",
      cheap: "價格實惠",
      music: "舒服氛圍",
      empty: "目前人少",
      sections: {
        workspace: "工作環境",
        atmosphere: "網路與氛圍",
        live: "即時狀態",
      },
    },
    presets: {
      focus: { title: "專心工作", subtitle: "安靜、網路穩，適合打開電腦" },
      longStay: { title: "久坐友善", subtitle: "不趕時間，也不用擔心沒電" },
      coffee: { title: "好咖啡", subtitle: "想認真喝一杯的時候" },
      vibe: { title: "舒服氛圍", subtitle: "適合聊天、約會、放慢一點" },
    },
    pagination: { prev: "← 上一頁", next: "下一頁 →" },
    home: {
      chooseCity: "先選一個城市",
      chooseCityHint: "我們會先用地區整理列表，之後也能在設定裡切換。",
      chooseCityAction: "選擇城市",
      byNeed: "依需求找咖啡廳",
      noResultsTitle: "找不到符合的店",
      noResultsHint: "試試店名、路名或地標，或清除篩選看看。",
      total: "共 {count} 間",
      totalPaged: "共 {count} 間（顯示第 {start}-{end} 間）",
    },
    nearby: {
      title: "附近咖啡廳",
      distanceSort: "依距離由近到遠",
      locating: "正在取得位置",
      allowLocation: "允許定位後依距離排序",
      total: "{sort}・共 {count} 間",
      totalPaged: "{sort}・共 {count} 間（第 {start}-{end} 間）",
      noResultsTitle: "附近沒有符合的店",
      noResultsHint: "可以切回「全部」，或改用店名、路名搜尋。",
      browserNoLocation: "這個瀏覽器無法定位。",
      allowPermission: "請在瀏覽器允許位置權限。",
      timeout: "定位逾時，先用預設排序。",
      locateFailed: "暫時無法取得位置，先用預設排序。",
    },
    favorites: {
      title: "我的收藏",
      savedCount: "已收藏 {count} 間",
      emptyTitle: "還沒有收藏",
      emptyHint: "先去首頁或附近看看，點星號就能收藏喜歡的店。",
      emptyAction: "去探索咖啡店",
    },
    map: {
      yourLocation: "你的位置",
      searchLocation: "搜尋位置",
      locateUnsupported: "這個瀏覽器不支援定位。",
      httpsRequired: "定位需要 HTTPS 才能使用。",
      allowPermission: "請在瀏覽器設定允許位置權限。",
      timeout: "定位逾時，請到訊號較好的地方再試。",
      genericError: "暫時無法取得位置，請稍後再試。",
      locating: "定位中",
      locatingTitle: "定位中...",
      backToLocation: "回到我的位置",
    },
    crowd: {
      title: "現在人多嗎？",
      loading: "載入狀態...",
      empty: "很空，快來",
      normal: "普通",
      crowded: "很擠，慎入",
      thanks: "已收到，謝謝！",
      update: "更新狀態",
      current: "現在狀況",
    },
    detail: {
      back: "返回上一頁",
      openStoreLink: "開啟店家連結",
      hideCafe: "隱藏這家店",
      hidingCafe: "隱藏中...",
      hideFailed: "隱藏失敗，請稍後再試。",
      scores: "環境評分",
      wifi: "WiFi",
      stable: "穩定",
      quiet: "安靜",
      level: "程度",
      coffee: "咖啡",
      tasty: "好喝",
      seat: "座位",
      seatsAvailable: "通常有位",
      price: "價格",
      cheap: "便宜",
      vibe: "氛圍",
      music: "裝潢音樂",
    },
    auth: {
      redirecting: "正在前往 Google 登入。",
      signInFailed: "登入失敗，請稍後再試。",
      signedOut: "已登出。",
      signOutFailed: "登出失敗，請稍後再試。",
      adminOnly: "只有管理帳號可以隱藏店家。",
    },
    timeAgo: {
      justNow: "今天 {time}・剛剛",
      minsAgo: "今天 {time}・{mins} 分鐘前",
      hoursAgo: "今天 {time}・{hours} 小時前",
    },
    aria: {
      details: "查看 {name} 詳情",
      favorite: "收藏 {name}",
      unfavorite: "取消收藏 {name}",
    },
  },
  en: {
    searchPlaceholder: "Search cafe name, address, or landmark",
    common: {
      all: "All",
      loadingCafes: "Loading cafes...",
      loadingMap: "Loading map cafes...",
      countUnit: "",
      cityPrompt: "Choose area",
      viewDetails: "View details",
      openInGoogleMaps: "Open in Google Maps",
      similarTagsHint: "Tap a tag to find similar cafes",
      comingSoon: "Coming soon",
      settings: "Settings",
      region: "Region",
      language: "Language",
      save: "Save",
      clear: "Clear",
      filter: "Filter",
      collapseFilters: "Hide filters",
    },
    nav: { home: "Home", nearby: "Nearby", map: "Map", favorites: "Saved" },
    settings: {
      openMenu: "Open settings menu",
      close: "Close settings",
      loggedIn: "Signed in",
      notLoggedIn: "Not signed in",
      connectedGoogle: "Google account connected",
      syncFavorites: "Sync favorites with Google",
      signIn: "Sign in with Google",
      signInBusy: "Opening Google...",
      signOut: "Sign out",
      signOutBusy: "Signing out...",
      aboutTitle: "About Cafe Voyage",
      aboutSubtitle: "A cafe map for work, rest, and easy dates.",
      feedbackTitle: "Feedback",
      feedbackSubtitle: "Suggestions or bug reports",
      supportTitle: "Buy me a coffee",
      supportSubtitle: "Support Cafe Voyage",
      switchCountry: "Switch country menu",
    },
    tags: {
      noLimit: "No time limit",
      holidayLimit: "Holiday time limit",
      limited: "Time limit",
      socketMany: "Many outlets",
      socketFew: "Few outlets",
      standing: "Standing desk",
      tempClosed: "Temporarily closed",
      empty: "Quiet now",
    },
    filters: {
      noLimit: "No time limit",
      socket: "Many outlets",
      standing: "Standing desk",
      wifi: "Strong Wi-Fi",
      quiet: "Very quiet",
      tasty: "Great coffee",
      cheap: "Budget-friendly",
      music: "Good ambiance",
      empty: "Quiet now",
      sections: {
        workspace: "Work setup",
        atmosphere: "Network & vibe",
        live: "Live status",
      },
    },
    presets: {
      focus: { title: "Focus mode", subtitle: "Quiet and reliable for deep work" },
      longStay: { title: "Long stay", subtitle: "Outlets and time to stay awhile" },
      coffee: { title: "Great coffee", subtitle: "For when the cup matters most" },
      vibe: { title: "Cozy vibe", subtitle: "Good for chats, dates, and slow afternoons" },
    },
    pagination: { prev: "← Prev", next: "Next →" },
    home: {
      chooseCity: "Choose a city first",
      chooseCityHint: "We organize the list by area first, and you can switch later in Settings.",
      chooseCityAction: "Choose city",
      byNeed: "Find cafes by mood",
      noResultsTitle: "No matching cafes",
      noResultsHint: "Try a cafe name, street, or landmark, or clear the filters.",
      total: "{count} cafes",
      totalPaged: "{count} cafes ({start}-{end})",
    },
    nearby: {
      title: "Nearby cafes",
      distanceSort: "Sorted by distance",
      locating: "Finding your location",
      allowLocation: "Allow location to sort by distance",
      total: "{sort} · {count} cafes",
      totalPaged: "{sort} · {count} cafes ({start}-{end})",
      noResultsTitle: "No nearby match",
      noResultsHint: "Switch back to All, or search by cafe, street, or landmark.",
      browserNoLocation: "This browser can't access location.",
      allowPermission: "Please allow location access in your browser.",
      timeout: "Location timed out. Using default sort for now.",
      locateFailed: "Couldn't get your location. Using default sort.",
    },
    favorites: {
      title: "Saved cafes",
      savedCount: "{count} saved",
      emptyTitle: "No saved cafes yet",
      emptyHint: "Browse Home or Nearby, then tap the star to save a cafe you like.",
      emptyAction: "Explore cafes",
    },
    map: {
      yourLocation: "Your location",
      searchLocation: "Search result",
      locateUnsupported: "Location isn't supported in this browser.",
      httpsRequired: "Location requires HTTPS.",
      allowPermission: "Please allow location permission in your browser settings.",
      timeout: "Location timed out. Try again with a better signal.",
      genericError: "We couldn't get your location right now.",
      locating: "Locating",
      locatingTitle: "Locating...",
      backToLocation: "Back to my location",
    },
    crowd: {
      title: "How busy is it now?",
      loading: "Loading status...",
      empty: "Quiet and easy",
      normal: "Normal",
      crowded: "Crowded",
      thanks: "Thanks, got it!",
      update: "Update",
      current: "Current status",
    },
    detail: {
      back: "Back",
      openStoreLink: "Open store link",
      hideCafe: "Hide this cafe",
      hidingCafe: "Hiding...",
      hideFailed: "Couldn't hide this cafe. Please try again.",
      scores: "Cafe profile",
      wifi: "Wi-Fi",
      stable: "Stability",
      quiet: "Quiet",
      level: "Level",
      coffee: "Coffee",
      tasty: "Taste",
      seat: "Seats",
      seatsAvailable: "Seat comfort",
      price: "Price",
      cheap: "Budget",
      vibe: "Vibe",
      music: "Interior & music",
    },
    auth: {
      redirecting: "Opening Google sign-in...",
      signInFailed: "Sign-in failed. Please try again.",
      signedOut: "Signed out.",
      signOutFailed: "Sign-out failed. Please try again.",
      adminOnly: "Only the admin account can hide cafes.",
    },
    timeAgo: {
      justNow: "Today {time} · Just now",
      minsAgo: "Today {time} · {mins} min ago",
      hoursAgo: "Today {time} · {hours} hr ago",
    },
    aria: {
      details: "View details for {name}",
      favorite: "Save {name}",
      unfavorite: "Remove {name} from saved",
    },
  },
};

const getCopy = (lang, path, vars = {}) => {
  const source = COPY[lang] || COPY.zh;
  const value = path.split(".").reduce((acc, key) => acc?.[key], source);
  if (typeof value !== "string") return value;
  return Object.entries(vars).reduce((text, [key, replacement]) => text.replaceAll(`{${key}}`, String(replacement)), value);
};

const GEO_ERROR_LABELS = {
  zh: {
    1: "權限被拒絕",
    2: "無法取得位置來源",
    3: "定位逾時",
  },
  en: {
    1: "Permission denied",
    2: "Position unavailable",
    3: "Timed out",
  },
};

const withGeoErrorDetails = (lang, base, error) => {
  const code = Number(error?.code);
  if (!code) return base;
  const labels = GEO_ERROR_LABELS[lang] || GEO_ERROR_LABELS.zh;
  const fallbackLabels = GEO_ERROR_LABELS.zh;
  const label = labels[code] || fallbackLabels[code] || `Code ${code}`;
  return lang === "en" ? `${base} (${label}, code ${code})` : `${base}（${label}，code ${code}）`;
};

const getCountryLabel = (country, lang) => country?.labels?.[lang] || country?.labels?.zh || "";
const getRegionLabel = (regionGroup, lang) => regionGroup?.labels?.[lang] || regionGroup?.labels?.zh || "";

const normalizeRegionLabel = (label = "") => label
  .replace("臺中市", "台中市")
  .replace("臺南市", "台南市")
  .replace("臺東縣", "台東縣");

const findRegionGroup = (regionLabel = "") =>
  REGION_GROUPS.find((group) => group.members.includes(regionLabel)) || null;

const getCafeCountryKey = (cafe) => {
  if (cafe.city === "hoi_an_vn" || /Vietnam|Việt Nam|Hội An|Hoi An/.test(cafe.address || "")) return "vietnam";
  return "taiwan";
};

const getCafeRegion = (cafe) => {
  if (getCafeCountryKey(cafe) === "vietnam") return "Hội An";
  const match = (cafe.address || "").match(REGION_PATTERN);
  if (match) return normalizeRegionLabel(match[0]);
  return "";
};

const getCafeRegionGroupKey = (cafe) => findRegionGroup(getCafeRegion(cafe))?.key || "";

// ── helpers ──
const CLOSED_KW = ["暫停營業", "已歇業", "停業", "結束營業"];
const isOpen = (c) => !CLOSED_KW.some(kw => c.name.includes(kw));
const scoreBar = (val, max = 5) => {
  if (!val || val === 0) return null;
  const pct = (val / max) * 100;
  const color = pct >= 70 ? T.green : pct >= 40 ? UI.scoreWarm : UI.scoreClay;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1 }}>
      <div style={{ flex: 1, height: 4, background: UI.scoreTrack, borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4 }} />
      </div>
      <span style={{ ...TYPE.caption, color: UI.muted, minWidth: 24, fontVariantNumeric: "tabular-nums" }}>{val.toFixed(1)}</span>
    </div>
  );
};

const scorePill = (label, val) => {
  if (!val || val === 0) return null;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "5px 8px",
      borderRadius: 999,
      background: UI.oat,
      border: `1px solid ${UI.softLine}`,
      color: T.sub,
      ...TYPE.caption,
      fontWeight: 680,
      whiteSpace: "nowrap",
    }}>
      <span>{label}</span>
      <span style={{ color: T.text, fontVariantNumeric: "tabular-nums" }}>{Number(val).toFixed(1)}</span>
    </span>
  );
};

const Icon = ({ name, size = 16, strokeWidth = 2, style }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: false,
    style: { display: "inline-block", flexShrink: 0, ...style },
  };

  if (name === "starFilled") {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="m12 3.2 2.62 5.32 5.88.86-4.25 4.14 1 5.86L12 16.62 6.75 19.38l1-5.86L3.5 9.38l5.88-.86L12 3.2Z" />
      </svg>
    );
  }

  const paths = {
    check: <path d="m5 12 4 4 10-10" />,
    plug: <><path d="M8 2v6" /><path d="M16 2v6" /><path d="M7 8h10v3a5 5 0 0 1-10 0V8Z" /><path d="M12 16v6" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
    pause: <><circle cx="12" cy="12" r="8.5" /><path d="M10 8.5v7" /><path d="M14 8.5v7" /></>,
    status: <circle cx="12" cy="12" r="5.5" fill="currentColor" stroke="none" />,
    train: <><rect x="6" y="4" width="12" height="12" rx="3" /><path d="M9 20h6" /><path d="M9 16l-2 4" /><path d="M15 16l2 4" /><path d="M9 8h6" /><path d="M9 12h.01" /><path d="M15 12h.01" /></>,
    pin: <><path d="M12 21s7-5.4 7-12a7 7 0 0 0-14 0c0 6.6 7 12 7 12Z" /><circle cx="12" cy="9" r="2.2" /></>,
    star: <path d="m12 3.2 2.62 5.32 5.88.86-4.25 4.14 1 5.86L12 16.62 6.75 19.38l1-5.86L3.5 9.38l5.88-.86L12 3.2Z" />,
    coffee: <><path d="M6 8h10v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" /><path d="M16 10h1.5a2 2 0 0 1 0 4H16" /><path d="M5 20h13" /><path d="M8 4v1" /><path d="M12 4v1" /></>,
    user: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
    wifi: <><path d="M5 10a10 10 0 0 1 14 0" /><path d="M8.5 13.5a5 5 0 0 1 7 0" /><path d="M12 17h.01" /></>,
    quiet: <><path d="M4 14h3l5 4V6L7 10H4v4Z" /><path d="M17 9l4 4" /><path d="M21 9l-4 4" /></>,
    seat: <><path d="M7 11V7a4 4 0 0 1 8 0v4" /><path d="M5 11h14v5H5z" /><path d="M7 16v4" /><path d="M17 16v4" /></>,
    price: <><path d="M12 3v18" /><path d="M17 7.5c-.8-1.2-2.2-2-4.2-2-2.3 0-3.8 1-3.8 2.6 0 4 8.5 1.8 8.5 6.5 0 1.8-1.7 3-4.4 3-2 0-3.8-.7-5-2" /></>,
    music: <><path d="M9 18V5l10-2v13" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="16" r="2" /></>,
    external: <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" /></>,
    hide: <><path d="M3 3l18 18" /><path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" /><path d="M9.2 5.3A10.8 10.8 0 0 1 12 5c5 0 8.5 4.2 9.5 7-0.4 1.1-1.4 2.6-2.8 3.9" /><path d="M6.7 6.8C4.6 8.2 3.2 10.3 2.5 12c1 2.8 4.5 7 9.5 7 1.6 0 3.1-.4 4.4-1.2" /></>,
    heart: <path d="M20.5 8.5c0 5-8.5 10-8.5 10S3.5 13.5 3.5 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8.5 2.5Z" />,
    chevronUp: <path d="m7 14 5-5 5 5" />,
    chevronDown: <path d="m7 10 5 5 5-5" />,
    map: <><path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15" /><path d="M15 6v15" /></>,
    checkCircle: <><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12.2 2.3 2.3 4.8-5" /></>,
  };

  return (
    <svg {...common}>
      {paths[name] || paths.coffee}
    </svg>
  );
};

const InlineIcon = ({ name, size = 14, color = "currentColor", style }) => (
  <Icon name={name} size={size} style={{ color, verticalAlign: "-0.18em", ...style }} />
);

const CountryMark = ({ code }) => (
  <span
    aria-hidden="true"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 24,
      height: 18,
      borderRadius: 6,
      background: UI.oat,
      border: `1px solid ${UI.line}`,
      color: T.brown,
      fontSize: 9,
      fontWeight: 760,
      letterSpacing: "0.04em",
      lineHeight: 1,
      fontFamily: FONT.body,
    }}
  >
    {code}
  </span>
);

const Tag = ({ label, type = "green", onClick, icon }) => {
  const styles = {
    green: { bg: T.green, color: UI.onDark },
    amber: { bg: UI.warning, color: UI.onDark },
    red: { bg: UI.danger, color: UI.onDark },
    gray: { bg: T.beige, color: T.sub },
  };
  const s = styles[type] || styles.gray;
  const style = {
    background: s.bg,
    color: s.color,
    borderRadius: 999,
    padding: "4px 9px",
    ...TYPE.caption,
    fontWeight: 680,
    whiteSpace: "nowrap",
    letterSpacing: "-0.01em",
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          ...style,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {icon && <Icon name={icon} size={12} strokeWidth={2.2} style={{ marginRight: 4, verticalAlign: "-0.12em" }} />}
        {label}
      </button>
    );
  }

  return (
    <span style={style}>
      {icon && <Icon name={icon} size={12} strokeWidth={2.2} style={{ marginRight: 4, verticalAlign: "-0.12em" }} />}
      {label}
    </span>
  );
};

const limitedTag = (v, lang, onNoLimitClick) => {
  if (v === "no") return <Tag label={getCopy(lang, "tags.noLimit")} type="green" icon="check" onClick={onNoLimitClick} />;
  if (v === "maybe") return <Tag label={getCopy(lang, "tags.holidayLimit")} type="amber" />;
  if (v === "yes") return <Tag label={getCopy(lang, "tags.limited")} type="red" />;
  return null;
};

const socketTag = (v, lang, onSocketClick) => {
  if (v === "yes") return <Tag label={getCopy(lang, "tags.socketMany")} type="green" icon="plug" onClick={onSocketClick} />;
  if (v === "maybe") return <Tag label={getCopy(lang, "tags.socketFew")} type="amber" icon="plug" />;
  return null;
};

const temporaryClosureTag = (cafe, lang) => {
  if (cafe.google_business_status === "CLOSED_TEMPORARILY") {
    return <Tag label={getCopy(lang, "tags.tempClosed")} type="amber" icon="pause" />;
  }
  return null;
};

// ── Crowd helpers ──
const crowdTagFromIds = (cafeId, emptyCafeIds, lang, onEmptyClick) => {
  if (emptyCafeIds && emptyCafeIds.has && emptyCafeIds.has(cafeId)) {
    return <Tag label={getCopy(lang, "tags.empty")} type="green" icon="status" onClick={onEmptyClick} />;
  }
  return null;
};

// ── Filter Section ──
const DEFAULT_HOME_FILTERS = {
  noLimit: false,
  socket: false,
  standing: false,
  wifi: false,
  quiet: false,
  tasty: false,
  cheap: false,
  music: false,
  empty: false,
};
const FILTER_PRESET_DEFS = [
  {
    key: "focus",
    filters: { wifi: true, quiet: true },
    score: (cafe) => (Number(cafe.wifi) || 0) * 0.4 + (Number(cafe.quiet) || 0) * 0.4 + (Number(cafe.seat) || 0) * 0.2,
  },
  {
    key: "longStay",
    filters: { socket: true, noLimit: true },
    score: (cafe) => (Number(cafe.seat) || 0) * 0.4 + (Number(cafe.wifi) || 0) * 0.35 + (Number(cafe.quiet) || 0) * 0.25,
  },
  {
    key: "coffee",
    filters: { tasty: true },
    score: (cafe) => (Number(cafe.tasty) || 0) * 0.7 + (Number(cafe.cheap) || 0) * 0.15 + (Number(cafe.seat) || 0) * 0.15,
  },
  {
    key: "vibe",
    filters: { music: true },
    score: (cafe) => (Number(cafe.music) || 0) * 0.5 + (Number(cafe.quiet) || 0) * 0.25 + (Number(cafe.tasty) || 0) * 0.25,
  },
];

const getFilterLabels = (lang) => ({
  noLimit: getCopy(lang, "filters.noLimit"),
  socket: getCopy(lang, "filters.socket"),
  standing: getCopy(lang, "filters.standing"),
  wifi: getCopy(lang, "filters.wifi"),
  quiet: getCopy(lang, "filters.quiet"),
  tasty: getCopy(lang, "filters.tasty"),
  cheap: getCopy(lang, "filters.cheap"),
  music: getCopy(lang, "filters.music"),
  empty: getCopy(lang, "filters.empty"),
});

const getFilterPresets = (lang) => FILTER_PRESET_DEFS.map((preset) => ({
  ...preset,
  title: getCopy(lang, `presets.${preset.key}.title`),
  subtitle: getCopy(lang, `presets.${preset.key}.subtitle`),
}));

const FilterChip = ({ active, label, onClick, icon }) => (
  <button type="button" className="soft-press" aria-pressed={active} onClick={onClick} style={{
    background: active ? T.green : UI.oat,
    color: active ? UI.onDark : T.sub,
    border: `1px solid ${active ? T.green : UI.line}`,
    borderRadius: 18,
    padding: "8px 14px",
    ...TYPE.control,
    cursor: "pointer",
    fontWeight: active ? 700 : 600,
    fontFamily: "inherit",
    boxShadow: active ? UI.greenShadow : "none",
    transition: "background 160ms ease, border-color 160ms ease, color 160ms ease",
  }}>
    {active && <Icon name="check" size={12} strokeWidth={2.4} style={{ marginRight: 4, verticalAlign: "-0.12em" }} />}
    {icon && <Icon name={icon} size={12} strokeWidth={2.2} style={{ marginRight: 4, verticalAlign: "-0.12em" }} />}
    {label}
  </button>
);

const FilterSection = ({ filters, toggle, lang }) => (
  <div style={{ marginBottom: SPACE.sectionGap, background: UI.panel, border: `1px solid ${UI.line}`, borderRadius: 18, padding: SPACE.cardPad }}>
    {[
      {
        title: getCopy(lang, "filters.sections.workspace"),
        items: [
          { key: "noLimit", label: getCopy(lang, "filters.noLimit") },
          { key: "socket", label: getCopy(lang, "filters.socket") },
          { key: "standing", label: getCopy(lang, "filters.standing") },
        ],
      },
      {
        title: getCopy(lang, "filters.sections.atmosphere"),
        items: [
          { key: "wifi", label: getCopy(lang, "filters.wifi") },
          { key: "quiet", label: getCopy(lang, "filters.quiet") },
          { key: "tasty", label: getCopy(lang, "filters.tasty") },
          { key: "cheap", label: getCopy(lang, "filters.cheap") },
          { key: "music", label: getCopy(lang, "filters.music") },
        ],
      },
      {
        title: getCopy(lang, "filters.sections.live"),
        items: [
          { key: "empty", label: getCopy(lang, "filters.empty"), icon: "status" },
        ],
      },
    ].map((section, index) => (
      <div key={section.title} style={{ marginBottom: index === 2 ? 0 : SPACE.groupGap + 2 }}>
        <div style={{ ...TYPE.caption, color: T.sub, marginBottom: SPACE.chipGap + 1, fontWeight: 760, letterSpacing: "0.08em" }}>{section.title}</div>
        <div style={{ display: "flex", gap: SPACE.chipGap, flexWrap: "wrap" }}>
          {section.items.map(({ key, label, icon }) => (
            <FilterChip key={key} active={filters[key]} label={label} icon={icon} onClick={() => toggle(key)} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const PER_PAGE = 30;
const Pagination = ({ page, total, onPage, lang }) => {
  const maxPage = Math.ceil(total / PER_PAGE);
  if (maxPage <= 1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "14px 0 4px" }}>
      <button onClick={() => onPage(page - 1)} disabled={page <= 1} style={{
        background: page <= 1 ? T.beige : T.brown, color: page <= 1 ? T.sub : UI.onDark,
        border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: page <= 1 ? "default" : "pointer", fontFamily: "inherit",
      }}>{getCopy(lang, "pagination.prev")}</button>
      <span style={{ fontSize: 12, color: T.sub }}>{page} / {maxPage}</span>
      <button onClick={() => onPage(page + 1)} disabled={page >= maxPage} style={{
        background: page >= maxPage ? T.beige : T.brown, color: page >= maxPage ? T.sub : UI.onDark,
        border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: page >= maxPage ? "default" : "pointer", fontFamily: "inherit",
      }}>{getCopy(lang, "pagination.next")}</button>
    </div>
  );
};

const timeAgo = (ts, lang) => {
  const date = new Date(ts);
  const mins = Math.floor((Date.now() - date) / 60000);
  const timeStr = date.toLocaleTimeString(lang === "en" ? "en-US" : "zh-TW", { hour: '2-digit', minute: '2-digit', hour12: false });
  if (mins < 1) return getCopy(lang, "timeAgo.justNow", { time: timeStr });
  if (mins < 60) return getCopy(lang, "timeAgo.minsAgo", { time: timeStr, mins });
  return getCopy(lang, "timeAgo.hoursAgo", { time: timeStr, hours: Math.floor(mins / 60) });
};

const distanceKm = (from, cafe) => {
  if (!from || !cafe.latitude || !cafe.longitude) return Infinity;
  const lat = Number(cafe.latitude);
  const lng = Number(cafe.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return Infinity;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthKm = 6371;
  const dLat = toRad(lat - from.lat);
  const dLng = toRad(lng - from.lng);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(from.lat)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
  return earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDistance = (km) => {
  if (!Number.isFinite(km)) return "";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
};

const workScore = (cafe) => (Number(cafe.wifi) || 0) + (Number(cafe.quiet) || 0) + (Number(cafe.tasty) || 0);

// ── Header ──
const Header = ({ title = "Cafe Voyage", cityLabel, subtitle, onOpenMenu, lang }) => {
  const metaText = subtitle ?? cityLabel;
  return (
  <div style={{ background: T.brown, padding: "18px 22px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
    <div>
      <div style={{ ...TYPE.brand, color: UI.onDark }}>{title}</div>
      {metaText !== "" && <div style={{ ...TYPE.meta, color: UI.onDarkMuted, marginTop: 5 }}>{metaText}</div>}
    </div>
    <button aria-label={getCopy(lang, "settings.openMenu")} onClick={onOpenMenu} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={UI.onDark} strokeWidth="2.2" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  </div>
  );
};

const SettingsPanel = ({
  open,
  country,
  countryOptions,
  setCountry,
  region,
  regionOptions,
  setRegion,
  onClose,
  user,
  authBusy,
  authMessage,
  authError,
  onGoogleSignIn,
  onSignOut,
  lang,
  setLang,
}) => {
  if (!open) return null;
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const menuLinks = [
    {
      title: getCopy(lang, "settings.aboutTitle"),
      subtitle: getCopy(lang, "settings.aboutSubtitle"),
      href: null,
    },
    {
      title: getCopy(lang, "settings.feedbackTitle"),
      subtitle: getCopy(lang, "settings.feedbackSubtitle"),
      href: null,
    },
    {
      title: getCopy(lang, "settings.supportTitle"),
      subtitle: getCopy(lang, "settings.supportSubtitle"),
      href: null,
    },
  ];

  const selectedCountry = countryOptions.find((item) => item.key === country) || COUNTRY_OPTIONS[0];
  const countryMenuItems = COUNTRY_OPTIONS.map((item) => ({
    ...item,
    enabled: item.comingSoon ? false : countryOptions.some((option) => option.key === item.key),
  }));

  useEffect(() => {
    if (!open) setCountryMenuOpen(false);
  }, [open]);

  const SectionRow = ({ title, subtitle, href }) => {
    const sharedStyle = {
      width: "100%",
      background: "none",
      border: "none",
      borderBottom: `1px solid ${UI.hairline}`,
      padding: "10px 0",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 10,
      textAlign: "left",
      textDecoration: "none",
      cursor: href ? "pointer" : "default",
      fontFamily: "inherit",
      color: T.text,
    };

    const content = (
      <>
        <div>
          <div style={{ ...TYPE.body, fontWeight: 680, color: T.text, marginBottom: subtitle ? 1 : 0, letterSpacing: "-0.01em" }}>{title}</div>
          {subtitle && <div style={{ ...TYPE.caption, color: UI.muted }}>{subtitle}</div>}
        </div>
        <div style={{ fontSize: 15, color: UI.subtle, flexShrink: 0, paddingTop: 1 }}>{href ? "›" : ""}</div>
      </>
    );

    if (href) {
      return (
        <a href={href} target="_blank" rel="noreferrer" style={sharedStyle}>
          {content}
        </a>
      );
    }

    return <div style={sharedStyle}>{content}</div>;
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 40, background: UI.overlay }} onClick={onClose}>
      <div
        className="settings-drawer"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "min(84vw, 312px)",
          height: "100%",
          background: UI.oat,
          boxShadow: UI.drawerShadow,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 18px 12px", flexShrink: 0 }}>
          <div style={{ ...TYPE.pageTitle, fontSize: "1.32rem", color: T.text }}>{getCopy(lang, "common.settings")}</div>
          <button
            aria-label={getCopy(lang, "settings.close")}
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: T.sub, fontSize: 23, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div style={{ background: UI.panel, border: `1px solid ${UI.cardBorder}`, borderRadius: 16, padding: 12, margin: "0 16px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: UI.avatarGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              <Icon name={user ? "coffee" : "user"} size={19} strokeWidth={2.2} style={{ color: T.brown }} />
            </div>
            <div>
              <div style={{ ...TYPE.cardTitle, color: T.text }}>
                {user ? getCopy(lang, "settings.loggedIn") : getCopy(lang, "settings.notLoggedIn")}
              </div>
              <div style={{ ...TYPE.caption, color: UI.muted, marginTop: 2 }}>
                {user ? (user.email || getCopy(lang, "settings.connectedGoogle")) : getCopy(lang, "settings.syncFavorites")}
              </div>
            </div>
          </div>

          {user ? (
            <button
              onClick={onSignOut}
              disabled={authBusy}
              style={{
                width: "100%",
                background: T.brown,
                color: UI.onDark,
                border: "none",
                borderRadius: 14,
                padding: "11px 12px",
                textAlign: "center",
                ...TYPE.control,
                cursor: authBusy ? "default" : "pointer",
                fontFamily: "inherit",
                opacity: authBusy ? 0.7 : 1,
                letterSpacing: "-0.01em",
              }}
            >
              {authBusy ? getCopy(lang, "settings.signOutBusy") : getCopy(lang, "settings.signOut")}
            </button>
          ) : (
            <button
              onClick={onGoogleSignIn}
              disabled={authBusy}
              style={{
                width: "100%",
                background: T.brown,
                color: UI.onDark,
                border: "none",
                borderRadius: 14,
                padding: "11px 12px",
                textAlign: "center",
                ...TYPE.control,
                cursor: authBusy ? "default" : "pointer",
                fontFamily: "inherit",
                opacity: authBusy ? 0.7 : 1,
                letterSpacing: "-0.01em",
              }}
            >
              {authBusy ? getCopy(lang, "settings.signInBusy") : getCopy(lang, "settings.signIn")}
            </button>
          )}

          {authMessage && <div style={{ ...TYPE.caption, color: T.green, marginTop: 6 }}>{authMessage}</div>}
          {authError && <div style={{ ...TYPE.caption, color: UI.danger, marginTop: 6 }}>{authError}</div>}
        </div>

        <div style={{ background: UI.panel, border: `1px solid ${UI.cardBorder}`, borderRadius: 16, padding: 12, margin: "0 16px 10px" }}>
          <div style={{ ...TYPE.caption, color: UI.muted, marginBottom: 8 }}>{getCopy(lang, "common.language")}</div>
          <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => setLang(option.key)}
                style={{
                  background: lang === option.key ? T.brown : T.cream,
                  color: lang === option.key ? UI.onDark : T.text,
                  border: `1px solid ${lang === option.key ? T.brown : UI.regionBorder}`,
                  borderRadius: 14,
                  padding: "8px 10px",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: lang === option.key ? 700 : 500,
                  lineHeight: 1.1,
                  flex: 1,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div style={{ ...TYPE.caption, color: UI.muted, marginBottom: 8 }}>{getCopy(lang, "common.region")}</div>
          <div style={{ border: `1px solid ${UI.scoreTrack}`, borderRadius: 14, overflow: "hidden", marginBottom: 10, background: UI.surface }}>
            <button
              aria-label={getCopy(lang, "settings.switchCountry")}
              onClick={() => setCountryMenuOpen((openState) => !openState)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                borderBottom: countryMenuOpen ? `1px solid ${UI.hairline}` : "none",
                padding: "12px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                cursor: "pointer",
                fontFamily: "inherit",
                color: T.text,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 650 }}>
                <CountryMark code={selectedCountry.code} />
                <span>{getCountryLabel(selectedCountry, lang)}</span>
              </span>
              <Icon name={countryMenuOpen ? "chevronUp" : "chevronDown"} size={14} strokeWidth={2.2} style={{ color: T.sub }} />
            </button>
            {countryMenuOpen && (
              <div>
                {countryMenuItems.map((item) => {
                  const isSelected = item.key === country;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (!item.enabled) return;
                        setCountry(item.key);
                        setCountryMenuOpen(false);
                      }}
                      disabled={!item.enabled}
                      style={{
                        width: "100%",
                        background: isSelected ? UI.selectedTint : "none",
                        border: "none",
                        borderBottom: `1px solid ${UI.selectedHairline}`,
                        padding: "12px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        cursor: item.enabled ? "pointer" : "default",
                        fontFamily: "inherit",
                        color: item.enabled ? T.text : T.sub,
                        opacity: item.enabled ? 1 : 0.72,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
                        <CountryMark code={item.code} />
                        <span>{getCountryLabel(item, lang)}</span>
                      </span>
                      {item.comingSoon ? (
                        <span style={{ fontSize: 10, color: T.sub, background: T.beige, padding: "3px 7px", borderRadius: 999 }}>{getCopy(lang, "common.comingSoon")}</span>
                      ) : isSelected ? (
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: T.brown, display: "inline-block" }} />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: country === "vietnam" ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))", gap: 7 }}>
            {regionOptions.map((item) => (
              <button
                key={item.key}
                onClick={() => { setRegion(item.key); onClose(); }}
                style={{
                  background: region === item.key ? T.brown : T.cream,
                  color: region === item.key ? UI.onDark : T.text,
                  border: `1px solid ${region === item.key ? T.brown : UI.regionBorder}`,
                  borderRadius: 14,
                  padding: "8px 4px",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: region === item.key ? 700 : 500,
                  lineHeight: 1.1,
                }}
              >
                {getRegionLabel(REGION_GROUPS.find((group) => group.key === item.key), lang)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 16px calc(16px + env(safe-area-inset-bottom, 0px))" }}>
          {menuLinks.map((item) => (
            <SectionRow key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Bottom Nav ──
const BottomNav = ({ active, onChange, lang }) => (
  <div style={{
    background: UI.navFade,
    padding: "8px 12px calc(10px + env(safe-area-inset-bottom, 0px))",
    flexShrink: 0,
    position: "sticky",
    bottom: 0,
    zIndex: 20,
  }}>
    <div style={{
      background: UI.panel,
      border: `1px solid ${UI.line}`,
      borderRadius: 24,
      boxShadow: UI.shadowMedium,
      display: "flex",
      justifyContent: "space-around",
      padding: "7px 6px",
    }}>
      {[
        { key: "home", label: getCopy(lang, "nav.home"), d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
        { key: "search", label: getCopy(lang, "nav.nearby"), circle: true },
        { key: "map", label: getCopy(lang, "nav.map"), pin: true },
        { key: "favorites", label: getCopy(lang, "nav.favorites"), heart: true },
      ].map(({ key, label, d, circle, pin, heart }) => {
        const on = active === key;
        const c = on ? UI.onDark : T.sub;
        return (
          <button
            key={key}
            className="soft-press nav-item"
            aria-label={label}
            onClick={() => onChange(key)}
            style={{
              background: on ? T.brown : "transparent",
              border: "none",
              borderRadius: 18,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              color: c,
              minWidth: 58,
              minHeight: 48,
              fontFamily: "inherit",
              transition: "background 160ms ease, color 160ms ease",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={heart && on ? c : "none"} stroke={c} strokeWidth="2" strokeLinecap="round">
              {d && <path d={d} />}
              {circle && <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>}
              {pin && <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>}
              {heart && <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />}
            </svg>
            <span style={{ ...TYPE.nav, fontWeight: on ? 760 : 620 }}>{label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const SwipeBackShell = ({ enabled, onBack, children }) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swipeActive = useRef(false);
  const [swipeX, setSwipeX] = useState(0);

  const handleTouchStart = (e) => {
    if (!enabled) return;
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    swipeActive.current = touch.clientX <= 28;
  };

  const handleTouchMove = (e) => {
    if (!enabled || !swipeActive.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      swipeActive.current = false;
      setSwipeX(0);
      return;
    }

    if (deltaX > 0) {
      setSwipeX(Math.min(deltaX, 120));
    } else {
      setSwipeX(0);
    }
  };

  const handleTouchEnd = () => {
    if (enabled && swipeActive.current && swipeX > 72) {
      setSwipeX(0);
      swipeActive.current = false;
      onBack();
      return;
    }
    swipeActive.current = false;
    setSwipeX(0);
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transform: swipeX ? `translateX(${swipeX}px)` : "translateX(0)",
        transition: swipeActive.current ? "none" : "transform 0.18s ease-out",
        touchAction: "pan-y",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {children}
    </div>
  );
};

// ── Cafe Card ──
const CafeCard = ({ cafe, onClick, fav, onFav, emptyCafeIds, lang }) => (
  <div
    className="cafe-card-shell"
    role="button"
    tabIndex={0}
    aria-label={getCopy(lang, "aria.details", { name: cafe.name })}
    style={{
      background: UI.paper,
      borderRadius: 16,
      border: `1px solid ${UI.line}`,
      marginBottom: SPACE.cardGap,
      overflow: "hidden",
      cursor: "pointer",
      boxShadow: UI.shadow,
      outlineOffset: 3,
    }}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <div style={{ padding: `${SPACE.cardPad}px ${SPACE.cardPadX}px 13px` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: SPACE.chipGap }}>
        <div style={{ flex: 1, marginRight: 8 }}>
          <div style={{ ...TYPE.cardTitle, color: T.text }}>{cafe.name}</div>
          <div style={{ marginTop: 4 }}>
            {cafe.mrt && <div style={{ ...TYPE.meta, color: T.sub }}><InlineIcon name="train" size={13} color={T.sub} /> {cafe.mrt}</div>}
            <div style={{ ...TYPE.meta, color: T.sub, marginTop: cafe.mrt ? 1 : 0 }}><InlineIcon name="pin" size={13} color={T.sub} /> {cafe.address}</div>
          </div>
        </div>
        <button
          className="soft-press favorite-button"
          aria-label={fav ? getCopy(lang, "aria.unfavorite", { name: cafe.name }) : getCopy(lang, "aria.favorite", { name: cafe.name })}
          onClick={e => { e.stopPropagation(); onFav(cafe.id); }}
          style={{ background: UI.oat, border: `1px solid ${UI.softLine}`, borderRadius: 999, cursor: "pointer", width: 34, height: 34, flexShrink: 0, color: fav ? T.brown : T.sub, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        >
          <Icon name={fav ? "starFilled" : "star"} size={18} strokeWidth={2.1} />
        </button>
      </div>

      {cafe.wifi > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: SPACE.groupGap }}>
          {scorePill("WiFi", cafe.wifi)}
          {scorePill(getCopy(lang, "detail.quiet"), cafe.quiet)}
          {scorePill(getCopy(lang, "detail.coffee"), cafe.tasty)}
        </div>
      )}

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
        {temporaryClosureTag(cafe, lang)}
        {limitedTag(cafe.limited_time, lang)}
        {socketTag(cafe.socket, lang)}
        {crowdTagFromIds(cafe.id, emptyCafeIds, lang)}
        {cafe.open_time && <Tag label={`${cafe.open_time.slice(0, 20)}${cafe.open_time.length > 20 ? "..." : ""}`} type="gray" icon="clock" />}
      </div>
    </div>
  </div>
);

// ── Page: Home ──
const HomePage = ({ cafes, loading, hasRegionSelection, onOpenRegionPicker, onSelect, favs, onFav, emptyCafeIds, filters, setFilters, lang }) => {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activePresetKey, setActivePresetKey] = useState(null);
  const filterLabels = getFilterLabels(lang);
  const filterPresets = getFilterPresets(lang);
  const searchPlaceholder = getCopy(lang, "searchPlaceholder");

  const toggle = (key) => { setFilters(prev => ({ ...prev, [key]: !prev[key] })); setActivePresetKey(null); setPage(1); };
  const applyPreset = (preset) => {
    setQ("");
    setPage(1);
    setActivePresetKey(preset.key);
    setFilters({ ...DEFAULT_HOME_FILTERS, ...preset.filters });
    setFiltersOpen(false);
  };
  const isPresetActive = (presetFilters) => {
    const activeKeys = Object.entries(filters).filter(([, value]) => value).map(([key]) => key);
    const presetKeys = Object.entries(presetFilters).filter(([, value]) => value).map(([key]) => key);
    return activeKeys.length === presetKeys.length && presetKeys.every((key) => filters[key]);
  };

  const allFiltered = cafes
    .filter(isOpen)
    .filter(c => !q || c.name.includes(q) || c.address.includes(q) || (c.mrt && c.mrt.includes(q)))
    .filter(c => !filters.noLimit || c.limited_time === "no")
    .filter(c => !filters.socket || c.socket === "yes")
    .filter(c => !filters.standing || c.standing_desk === "yes")
    .filter(c => !filters.wifi || c.wifi >= 4)
    .filter(c => !filters.quiet || c.quiet >= 4)
    .filter(c => !filters.tasty || c.tasty >= 4)
    .filter(c => !filters.cheap || c.cheap >= 4)
    .filter(c => !filters.music || c.music >= 4)
    .filter(c => !filters.empty || emptyCafeIds.has(c.id))
    .sort((a, b) => {
    const preset = filterPresets.find((item) => item.key === activePresetKey);
      if (preset?.score) return preset.score(b) - preset.score(a);
      return workScore(b) - workScore(a);
    });

  const total = allFiltered.length;
  const start = (page - 1) * PER_PAGE;
  const filtered = allFiltered.slice(start, start + PER_PAGE);

  // Reset page when search changes
  useEffect(() => { setPage(1); }, [q]);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const activeFilterLabels = Object.entries(filters).filter(([, value]) => value).map(([key]) => filterLabels[key]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      <div style={{ flexShrink: 0, padding: `${SPACE.headerTop + 2}px ${SPACE.pageX}px ${SPACE.headerBottom}px`, background: T.cream, borderBottom: `1px solid ${T.beige}` }}>
        <div style={{ position: "relative", marginBottom: SPACE.sectionGap + 2 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={UI.placeholder} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input className="search-input" aria-label={searchPlaceholder} value={q} onChange={e => setQ(e.target.value)} placeholder={searchPlaceholder}
            style={SEARCH_INPUT_STYLE} />
        </div>

        {!filtersOpen ? (
          <div style={{ display: "flex", alignItems: "center", gap: SPACE.chipGap + 1, flexWrap: "wrap" }}>
            {activeFilterLabels.slice(0, 2).map((label) => (
              <FilterChip key={label} active={true} label={label} onClick={() => setFiltersOpen(true)} />
            ))}
            {activeFilterCount > 2 && (
              <span style={{ background: UI.chipNeutral, color: UI.chipNeutralText, borderRadius: 18, padding: "9px 14px", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>+{activeFilterCount - 2}</span>
            )}
            <button
              className="soft-press"
              onClick={() => setFiltersOpen(true)}
              style={{ marginLeft: "auto", background: "none", border: "none", color: T.brown, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4, fontFamily: "inherit" }}
            >
              {getCopy(lang, "common.filter")} {activeFilterCount > 0 && <Icon name="chevronDown" size={12} strokeWidth={2.4} style={{ marginLeft: 2, verticalAlign: "-0.12em" }} />}
            </button>
          </div>
        ) : (
          <>
            <FilterSection filters={filters} toggle={toggle} lang={lang} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="soft-press"
                onClick={() => setFiltersOpen(false)}
                style={{ background: "none", border: "none", color: T.brown, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4, fontFamily: "inherit" }}
              >
                {getCopy(lang, "common.collapseFilters")} <Icon name="chevronUp" size={12} strokeWidth={2.4} style={{ marginLeft: 2, verticalAlign: "-0.12em" }} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* 滾動區：咖啡廳列表 */}
      <div style={{ flex: 1, overflowY: "auto", padding: `0 ${SPACE.pageX}px ${SPACE.pageX}px` }}>
        {!hasRegionSelection && (
          <div style={{ margin: `${SPACE.cardGap}px 0`, background: UI.surface, border: `1px solid ${UI.line}`, borderRadius: 14, padding: `${SPACE.cardPad}px ${SPACE.cardPad}px 12px` }}>
            <div style={{ ...TYPE.sectionTitle, color: T.text, marginBottom: 6 }}>{getCopy(lang, "home.chooseCity")}</div>
            <div style={{ ...TYPE.body, color: T.sub, marginBottom: 10 }}>
              {getCopy(lang, "home.chooseCityHint")}
            </div>
            <button
              className="soft-press"
              onClick={onOpenRegionPicker}
              style={{
                background: T.brown,
                color: UI.onDark,
                border: "none",
                borderRadius: 10,
                padding: "10px 14px",
                ...TYPE.control,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {getCopy(lang, "home.chooseCityAction")}
            </button>
          </div>
        )}
        {hasRegionSelection && (
          <div style={{ margin: `${SPACE.sectionGap}px 0 ${SPACE.cardGap}px` }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: SPACE.cardGap, marginBottom: SPACE.groupGap }}>
              <div>
                <div style={{ ...TYPE.sectionTitle, color: T.text }}>{getCopy(lang, "home.byNeed")}</div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  className="soft-press"
                  type="button"
                  onClick={() => { setFilters({ ...DEFAULT_HOME_FILTERS }); setActivePresetKey(null); setPage(1); }}
                  style={{ background: "none", border: "none", color: T.brown, ...TYPE.control, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  {getCopy(lang, "common.clear")}
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: SPACE.groupGap - 1, overflowX: "auto", padding: "2px 1px 8px", margin: "0 -1px" }}>
              {filterPresets.map((preset) => {
                const active = isPresetActive(preset.filters);
                return (
                  <button
                    className="soft-press preset-card"
                    key={preset.title}
                    type="button"
                    aria-pressed={active}
                    onClick={() => applyPreset(preset)}
                    style={{
                      background: active ? T.brown : UI.paper,
                      color: active ? UI.onDark : T.text,
                      border: `1px solid ${active ? T.brown : UI.line}`,
                      borderRadius: 16,
                      padding: "10px 12px",
                      width: "clamp(136px, 38vw, 168px)",
                      flex: "0 0 clamp(136px, 38vw, 168px)",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      boxShadow: active ? UI.activeShadow : UI.shadow,
                      minHeight: 76,
                      transition: "background 160ms ease, transform 160ms ease, box-shadow 160ms ease",
                    }}
                  >
                    <div style={{ ...TYPE.cardTitle, fontSize: "0.9rem", marginBottom: 4 }}>{preset.title}</div>
                    <div style={{ ...TYPE.caption, color: active ? UI.activeSubtitle : T.sub }}>{preset.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.sub }}>
            <Icon name="coffee" size={34} strokeWidth={1.9} style={{ color: T.brown, marginBottom: 10 }} />
            <div>{getCopy(lang, "common.loadingCafes")}</div>
          </div>
        ) : (
          <>
            <div style={{ ...TYPE.meta, color: T.sub, margin: `${SPACE.groupGap}px 0 ${SPACE.cardGap}px` }}>
              {total > PER_PAGE
                ? getCopy(lang, "home.totalPaged", { count: total, start: start + 1, end: Math.min(start + PER_PAGE, total) })
                : getCopy(lang, "home.total", { count: total })}
            </div>
            {filtered.map(c => <CafeCard key={c.id} cafe={c} onClick={() => onSelect(c)} fav={favs.has(c.id)} onFav={onFav} emptyCafeIds={emptyCafeIds} lang={lang} />)}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "42px 18px", color: T.sub }}>
                <Icon name="coffee" size={32} strokeWidth={1.9} style={{ color: T.brown, marginBottom: 10 }} />
                <div style={{ ...TYPE.sectionTitle, color: T.text, marginBottom: 6 }}>{getCopy(lang, "home.noResultsTitle")}</div>
                <div style={{ ...TYPE.body, color: T.sub }}>{getCopy(lang, "home.noResultsHint")}</div>
              </div>
            )}
            <Pagination page={page} total={total} onPage={setPage} lang={lang} />
          </>
        )}
      </div>
    </div>
  );
};

// ── Page: Nearby ──
const SearchPage = ({ cafes, loading, onSelect, favs, onFav, lang }) => {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [activePresetKey, setActivePresetKey] = useState("all");
  const requestedLocation = useRef(false);
  const nearbyLocateTimerRef = useRef(null);
  const filterPresets = getFilterPresets(lang);
  const searchPlaceholder = getCopy(lang, "searchPlaceholder");
  const activePreset = filterPresets.find((preset) => preset.key === activePresetKey);
  const matchesPreset = (cafe) => {
    if (!activePreset) return true;
    const presetFilters = activePreset.filters;
    if (presetFilters.noLimit && cafe.limited_time !== "no") return false;
    if (presetFilters.socket && cafe.socket !== "yes") return false;
    if (presetFilters.standing && cafe.standing_desk !== "yes") return false;
    if (presetFilters.wifi && cafe.wifi < 4) return false;
    if (presetFilters.quiet && cafe.quiet < 4) return false;
    if (presetFilters.tasty && cafe.tasty < 4) return false;
    if (presetFilters.cheap && cafe.cheap < 4) return false;
    if (presetFilters.music && cafe.music < 4) return false;
    return true;
  };

  const requestSortLocation = useCallback(() => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError(getCopy(lang, "nearby.browserNoLocation"));
      return;
    }

    if (nearbyLocateTimerRef.current) {
      clearTimeout(nearbyLocateTimerRef.current);
      nearbyLocateTimerRef.current = null;
    }

    const finishLocate = () => {
      if (nearbyLocateTimerRef.current) {
        clearTimeout(nearbyLocateTimerRef.current);
        nearbyLocateTimerRef.current = null;
      }
      setLocationLoading(false);
    };

    const attemptLocate = (options, retried = false) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          finishLocate();
        },
        (error) => {
          if (!retried && (error?.code === 2 || error?.code === 3)) {
            attemptLocate({ enableHighAccuracy: false, timeout: 20000, maximumAge: 600000 }, true);
            return;
          }
          if (error?.code === 1) {
            setLocationError(withGeoErrorDetails(lang, getCopy(lang, "nearby.allowPermission"), error));
          } else if (error?.code === 3) {
            setLocationError(withGeoErrorDetails(lang, getCopy(lang, "nearby.timeout"), error));
          } else {
            setLocationError(withGeoErrorDetails(lang, getCopy(lang, "nearby.locateFailed"), error));
          }
          finishLocate();
        },
        options,
      );
    };

    setLocationLoading(true);
    nearbyLocateTimerRef.current = setTimeout(() => {
      setLocationError(withGeoErrorDetails(lang, getCopy(lang, "nearby.timeout"), { code: 3 }));
      setLocationLoading(false);
      nearbyLocateTimerRef.current = null;
    }, 23000);
    attemptLocate({ enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
  }, [lang]);

  const allSorted = cafes
    .filter(isOpen)
    .filter(c => !q || c.name.includes(q) || c.address.includes(q) || (c.mrt && c.mrt.includes(q)))
    .filter(matchesPreset)
    .map((c) => ({ ...c, _workScore: workScore(c), _distanceKm: distanceKm(userLocation, c) }))
    .sort((a, b) => {
      if (userLocation) {
        return a._distanceKm - b._distanceKm;
      }
      return b._workScore - a._workScore;
    });

  const total = allSorted.length;
  const start = (page - 1) * PER_PAGE;
  const sorted = allSorted.slice(start, start + PER_PAGE);

  useEffect(() => { setPage(1); }, [q, activePresetKey]);
  useEffect(() => {
    if (requestedLocation.current) return;
    requestedLocation.current = true;
    requestSortLocation();
  }, [requestSortLocation]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      {/* 固定區 */}
      <div style={{ flexShrink: 0, padding: `${SPACE.headerTop}px ${SPACE.pageX}px 0`, background: T.cream, borderBottom: `1px solid ${T.beige}` }}>
        <div style={{ ...TYPE.pageTitle, marginBottom: SPACE.groupGap, color: T.text }}>{getCopy(lang, "nearby.title")}</div>
        <div style={{ position: "relative", marginBottom: SPACE.sectionGap }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={UI.placeholder} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input className="search-input" aria-label={searchPlaceholder} value={q} onChange={e => setQ(e.target.value)} placeholder={searchPlaceholder}
            style={SEARCH_INPUT_STYLE} />
        </div>
        <div style={{ display: "flex", gap: SPACE.chipGap, overflowX: "auto", paddingBottom: SPACE.cardGap }}>
          {[{ key: "all", title: getCopy(lang, "common.all") }, ...filterPresets].map((preset) => {
            const active = activePresetKey === preset.key;
            return (
              <button
                key={preset.key}
                type="button"
                className="soft-press"
                aria-pressed={active}
                onClick={() => setActivePresetKey(preset.key)}
                style={{
                  border: `1px solid ${active ? T.brown : UI.line}`,
                  background: active ? T.brown : UI.paper,
                  color: active ? UI.onDark : T.sub,
                  borderRadius: 999,
                  padding: "7px 12px",
                  ...TYPE.control,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  flexShrink: 0,
                  boxShadow: active ? UI.activeShadowSmall : "none",
                }}
              >
                {preset.title}
              </button>
            );
          })}
        </div>
        {locationError && <div style={{ ...TYPE.caption, color: UI.danger, marginBottom: 10 }}>{locationError}</div>}
      </div>

      {/* 滾動區 */}
      <div style={{ flex: 1, overflowY: "auto", padding: `0 ${SPACE.pageX}px ${SPACE.pageX}px` }}>
        <div style={{ ...TYPE.meta, color: T.sub, margin: `${SPACE.groupGap}px 0` }}>
          {total > PER_PAGE
            ? getCopy(lang, "nearby.totalPaged", { sort: userLocation ? getCopy(lang, "nearby.distanceSort") : locationLoading ? getCopy(lang, "nearby.locating") : getCopy(lang, "nearby.allowLocation"), count: total, start: start + 1, end: Math.min(start + PER_PAGE, total) })
            : getCopy(lang, "nearby.total", { sort: userLocation ? getCopy(lang, "nearby.distanceSort") : locationLoading ? getCopy(lang, "nearby.locating") : getCopy(lang, "nearby.allowLocation"), count: total })}
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.sub }}><Icon name="coffee" size={34} strokeWidth={1.9} style={{ color: T.brown, marginBottom: 10 }} /><div>{getCopy(lang, "common.loadingCafes")}</div></div>
        ) : (
          <>
            {sorted.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: SPACE.chipGap + 1 }}>
                {userLocation && (
                  <div style={{ minWidth: 46, minHeight: 24, borderRadius: 14, background: T.beige, color: T.sub, display: "flex", alignItems: "center", justifyContent: "center", ...TYPE.nav, fontWeight: 720, flexShrink: 0, marginTop: 14, padding: "3px 6px", textAlign: "center" }}>
                    {formatDistance(c._distanceKm)}
                  </div>
                )}
                <div style={{ flex: 1 }}><CafeCard cafe={c} onClick={() => onSelect(c)} fav={favs.has(c.id)} onFav={onFav} emptyCafeIds={new Set()} lang={lang} /></div>
              </div>
            ))}
            {sorted.length === 0 && (
              <div style={{ textAlign: "center", padding: "42px 18px", color: T.sub }}>
                <Icon name="coffee" size={32} strokeWidth={1.9} style={{ color: T.brown, marginBottom: 10 }} />
                <div style={{ ...TYPE.sectionTitle, color: T.text, marginBottom: 6 }}>{getCopy(lang, "nearby.noResultsTitle")}</div>
                <div style={{ ...TYPE.body, color: T.sub }}>{getCopy(lang, "nearby.noResultsHint")}</div>
              </div>
            )}
            <Pagination page={page} total={total} onPage={setPage} lang={lang} />
          </>
        )}
      </div>
    </div>
  );
};

// ── Page: Favorites ──
const FavoritesPage = ({ cafes, favs, onSelect, onFav, onExplore, lang }) => {
  const list = cafes.filter(isOpen).filter(c => favs.has(c.id));
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      {/* 固定區 */}
      <div style={{ flexShrink: 0, padding: "14px 16px 4px", background: T.cream, borderBottom: `1px solid ${T.beige}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Icon name="heart" size={21} strokeWidth={2.1} style={{ color: T.brown }} />
          <div style={{ ...TYPE.pageTitle, color: T.text }}>{getCopy(lang, "favorites.title")}</div>
        </div>
      </div>

      {/* 滾動區 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        <div style={{ fontSize: 12, color: T.sub, margin: "10px 0" }}>{getCopy(lang, "favorites.savedCount", { count: list.length })}</div>
        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "54px 8px", color: T.sub }}>
            <div
              style={{
                maxWidth: 320,
                margin: "0 auto",
                background: UI.paper,
                border: `1px solid ${UI.line}`,
                borderRadius: 24,
                boxShadow: UI.shadowSoft,
                padding: "26px 20px 20px",
              }}
            >
              <Icon name="heart" size={38} strokeWidth={1.9} style={{ color: T.brown, marginBottom: 12 }} />
              <div style={{ ...TYPE.sectionTitle, color: T.text, marginBottom: 6 }}>{getCopy(lang, "favorites.emptyTitle")}</div>
              <div style={{ ...TYPE.body, color: T.sub, marginBottom: 16 }}>{getCopy(lang, "favorites.emptyHint")}</div>
              <button
                type="button"
                className="soft-press"
                onClick={onExplore}
                style={{
                  width: "auto",
                  minWidth: 188,
                  maxWidth: 240,
                  border: "none",
                  borderRadius: 15,
                  background: T.brown,
                  color: UI.onDark,
                  padding: "11px 18px",
                  ...TYPE.control,
                  fontWeight: 760,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: UI.activeShadowSmall,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getCopy(lang, "favorites.emptyAction")}
              </button>
            </div>
          </div>
        ) : list.map(c => <CafeCard key={c.id} cafe={c} onClick={() => onSelect(c)} fav={true} onFav={onFav} emptyCafeIds={new Set()} lang={lang} />)}
      </div>
    </div>
  );
};

// ── Map helpers ──
const cafeIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><circle cx='12' cy='12' r='8' fill='${UI.mapUser}' stroke='${UI.mapPinInner}' stroke-width='3'/></svg>`),
  iconSize: [24, 24], iconAnchor: [12, 12],
});

const stationIcon = new L.Icon({
  iconUrl: "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='42' viewBox='0 0 30 42'>
      <path d='M15 1C8 1 2.5 6.5 2.5 13.4c0 10.2 12.5 27.6 12.5 27.6s12.5-17.4 12.5-27.6C27.5 6.5 22 1 15 1z' fill='${UI.mapStation}' stroke='${UI.mapPinInner}' stroke-width='2'/>
      <circle cx='15' cy='14' r='8' fill='${UI.mapPinInner}'/>
      <path d='M10 12h10v5a5 5 0 0 1-10 0z' fill='${UI.mapStation}'/>
      <rect x='12.5' y='18' width='1.6' height='5' rx='0.8' fill='${UI.mapStation}'/>
      <rect x='15.9' y='18' width='1.6' height='5' rx='0.8' fill='${UI.mapStation}'/>
      <circle cx='12.5' cy='14' r='1' fill='${UI.mapPinInner}'/>
      <circle cx='17.5' cy='14' r='1' fill='${UI.mapPinInner}'/>
    </svg>`
  ),
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -36],
});

const looksLikeTransitQuery = (query = "") => /站|捷運|mrt|metro|station/i.test(query);
const getAuthRedirectUrl = () => {
  if (typeof window === "undefined") return undefined;
  const url = new URL(window.location.href);
  url.hash = "";
  return url.toString();
};

// ── Page: Map ──
const FlyTo = ({ center, zoom, offsetY = 0 }) => {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    const targetZoom = typeof zoom === "number" ? zoom : map.getZoom();
    if (!offsetY) {
      map.setView(center, targetZoom, { animate: false });
      return;
    }
    const targetPoint = map.project(center, targetZoom).subtract([0, offsetY]);
    const adjustedCenter = map.unproject(targetPoint, targetZoom);
    map.setView(adjustedCenter, targetZoom, { animate: false });
  }, [center, map, zoom, offsetY]);
  return null;
};

const FlyToBySignal = ({ center, seq, zoom = 15 }) => {
  const map = useMap();
  useEffect(() => {
    if (!center || seq === 0) return;
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, seq, zoom, map]);
  return null;
};

const SaveMapView = ({ onMove, onBoundsChange }) => {
  const map = useMap();
  useEffect(() => {
    const handler = () => {
      const c = map.getCenter();
      onMove({ center: [c.lat, c.lng], zoom: map.getZoom() });
      if (onBoundsChange) {
        const bounds = map.getBounds();
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      }
    };
    map.on("moveend", handler);
    handler();
    return () => map.off("moveend", handler);
  }, [map, onMove, onBoundsChange]);
  return null;
};

const BindMapRef = ({ mapRef }) => {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
};

const EnsureMapLayout = () => {
  const map = useMap();

  useEffect(() => {
    const refresh = () => {
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    };

    const initialTimer = setTimeout(refresh, 0);
    const settleTimer = setTimeout(refresh, 250);

    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(settleTimer);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
    };
  }, [map]);

  return null;
};

const LocateController = ({ request, onStart, onSuccess, onError }) => {
  const map = useMapEvents({
    locationfound(event) {
      const pos = [event.latlng.lat, event.latlng.lng];
      onSuccess(pos);
    },
    locationerror(event) {
      onError(event);
    },
  });

  useEffect(() => {
    if (!request.seq) return;
    onStart();
    map.locate({
      setView: false,
      maxZoom: request.zoom,
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 600000,
    });
  }, [map, onStart, onSuccess, onError, request]);

  return null;
};

const MapPage = ({ cafes, loading, onSelect, mapView, setMapView, mapQuery, setMapQuery, lang }) => {
  const [userPos, setUserPos] = useState(null);
  const [geoTarget, setGeoTarget] = useState(null);
  const [searchTarget, setSearchTarget] = useState(null);
  const [searchMarker, setSearchMarker] = useState(null);
  const [searchPopupCafeId, setSearchPopupCafeId] = useState(null);
  const [locateRequest, setLocateRequest] = useState({ seq: 0, zoom: 15, mode: "auto" });
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");
  const [visibleBounds, setVisibleBounds] = useState(null);
  const mapRef = useRef(null);
  const markerRefs = useRef(new Map());
  const userMarkerRef = useRef(null);
  const searchMarkerRef = useRef(null);
  const hasAutoLocatedRef = useRef(false);
  const lastSearchQueryRef = useRef("");
  const mapLocateTimerRef = useRef(null);
  const allMapCafes = useMemo(() => cafes.filter(isOpen).filter(c => c.latitude && c.longitude), [cafes]);
  const visibleMapCafes = useMemo(() => {
    if (!visibleBounds) return allMapCafes;
    return allMapCafes.filter((cafe) => {
      const lat = parseFloat(cafe.latitude);
      const lng = parseFloat(cafe.longitude);
      return lat <= visibleBounds.north && lat >= visibleBounds.south && lng <= visibleBounds.east && lng >= visibleBounds.west;
    });
  }, [allMapCafes, visibleBounds]);

  const requestUserLocation = useCallback(async ({ silent = false, zoom = 15, mode = "manual" } = {}) => {
    if (!navigator.geolocation) {
      if (!silent) setLocateError(getCopy(lang, "map.locateUnsupported"));
      return;
    }

    if (mapLocateTimerRef.current) {
      clearTimeout(mapLocateTimerRef.current);
      mapLocateTimerRef.current = null;
    }

    setLocating(true);
    if (!silent) setLocateError("");
    mapLocateTimerRef.current = setTimeout(() => {
      setLocateError(withGeoErrorDetails(lang, getCopy(lang, "map.timeout"), { code: 3 }));
      setLocating(false);
      mapLocateTimerRef.current = null;
    }, 23000);
    setLocateRequest(prev => ({ seq: prev.seq + 1, zoom, mode }));
  }, [lang]);

  const closeSearchPopup = useCallback(() => {
    setSearchPopupCafeId(null);
    if (mapRef.current) {
      mapRef.current.closePopup();
    }
  }, []);

  const bindAccessibleMarker = useCallback((marker, label, onActivate) => {
    const element = marker?.getElement?.();
    if (!element) return;

    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    element.setAttribute("aria-label", label);
    element.setAttribute("title", label);

    if (element.__cvMarkerKeyHandler) {
      element.removeEventListener("keydown", element.__cvMarkerKeyHandler);
    }

    const handleKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onActivate?.();
    };

    element.addEventListener("keydown", handleKeyDown);
    element.__cvMarkerKeyHandler = handleKeyDown;
  }, []);

  const handleLocateStart = useCallback(() => {
    if (mapRef.current) mapRef.current.invalidateSize();
  }, []);

  const handleLocateSuccess = useCallback((pos) => {
    if (mapLocateTimerRef.current) {
      clearTimeout(mapLocateTimerRef.current);
      mapLocateTimerRef.current = null;
    }
    setUserPos(pos);
    setLocating(false);
    setLocateError("");
  }, []);

  const handleLocateError = useCallback((err) => {
    if (mapLocateTimerRef.current) {
      clearTimeout(mapLocateTimerRef.current);
      mapLocateTimerRef.current = null;
    }
    const code = err?.code;
    if (code === 1) {
      setLocateError(withGeoErrorDetails(lang, getCopy(lang, "map.allowPermission"), err));
    } else if (code === 3) {
      setLocateError(withGeoErrorDetails(lang, getCopy(lang, "map.timeout"), err));
    } else {
      setLocateError(withGeoErrorDetails(lang, getCopy(lang, "map.genericError"), err));
    }
    setLocating(false);
  }, []);

  useEffect(() => {
    if (hasAutoLocatedRef.current) return;
    hasAutoLocatedRef.current = true;
    requestUserLocation({ silent: false, zoom: 15, mode: "auto" });
  }, [requestUserLocation]);

  useEffect(() => {
    if (!mapQuery) {
      setSearchPopupCafeId(null);
    }
  }, [mapQuery]);

  const searchMatches = useMemo(() => {
    if (!mapQuery) return [];
    return allMapCafes.filter(c => c.name.includes(mapQuery) || c.address.includes(mapQuery) || (c.mrt && c.mrt.includes(mapQuery)));
  }, [allMapCafes, mapQuery]);

  // Geocode fallback: when no cafe matches, query Nominatim
  useEffect(() => {
    if (!mapQuery) {
      setGeoTarget(null);
      setSearchTarget(null);
      setSearchMarker(null);
      setSearchPopupCafeId(null);
      lastSearchQueryRef.current = "";
      return;
    }
    if (lastSearchQueryRef.current === mapQuery) return;
    lastSearchQueryRef.current = mapQuery;

    const isTransitQuery = looksLikeTransitQuery(mapQuery);

    if (searchMatches.length > 0 && !isTransitQuery) {
      setSearchPopupCafeId(searchMatches[0].id);
      setGeoTarget(null);
      setSearchTarget([parseFloat(searchMatches[0].latitude), parseFloat(searchMatches[0].longitude)]);
      setSearchMarker(null);
      return;
    }

    setSearchPopupCafeId(null);
    setGeoTarget(null);
    setSearchTarget(null);
    setSearchMarker(null);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapQuery)}&limit=1`,
          { headers: { "Accept-Language": "zh-TW", "User-Agent": "CafeVoyage/1.0" } }
        );
        const data = await res.json();
        if (data.length > 0) {
          const pos = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          setGeoTarget(pos);
          if (isTransitQuery) {
            setSearchMarker({
              position: pos,
              label: data[0].display_name || mapQuery,
            });
          }
        } else if (searchMatches.length > 0) {
          setSearchPopupCafeId(searchMatches[0].id);
          setSearchTarget([parseFloat(searchMatches[0].latitude), parseFloat(searchMatches[0].longitude)]);
        }
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [mapQuery, searchMatches]);

  useEffect(() => {
    if (!searchPopupCafeId) return;
    const marker = markerRefs.current.get(searchPopupCafeId);
    if (!marker) return;
    const timer = setTimeout(() => {
      marker.openPopup();
    }, 80);
    return () => clearTimeout(timer);
  }, [searchPopupCafeId, visibleMapCafes]);

  useEffect(() => {
    visibleMapCafes.forEach((cafe) => {
      const marker = markerRefs.current.get(cafe.id);
      if (!marker) return;
      bindAccessibleMarker(
        marker,
        lang === "en" ? `Cafe marker: ${cafe.name}` : `店家標記：${cafe.name}`,
        () => {
          setSearchPopupCafeId(cafe.id);
          marker.openPopup();
        },
      );
    });

    if (userMarkerRef.current) {
      bindAccessibleMarker(
        userMarkerRef.current,
        lang === "en" ? "Your location" : "你的位置",
        () => userMarkerRef.current?.openPopup?.(),
      );
    }

    if (searchMarkerRef.current && searchMarker?.label) {
      bindAccessibleMarker(
        searchMarkerRef.current,
        lang === "en" ? `Search result: ${searchMarker.label}` : `搜尋位置：${searchMarker.label}`,
        () => searchMarkerRef.current?.openPopup?.(),
      );
    }
  }, [bindAccessibleMarker, lang, searchMarker, visibleMapCafes]);

  const flyTarget = searchTarget || geoTarget;

  // Use saved map view or default
  const defaultCenter = mapView.center || (allMapCafes.length > 0
    ? [parseFloat(allMapCafes[0].latitude), parseFloat(allMapCafes[0].longitude)]
    : [25.033, 121.5654]);
  const defaultZoom = mapView.zoom || 14;

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 16px 6px" }}>
        <div style={{ ...TYPE.meta, color: T.sub }}>{loading ? getCopy(lang, "common.loadingMap") : `${visibleMapCafes.length} ${lang === "en" ? "cafes" : "間咖啡廳"}`}</div>
      </div>

      {/* Search */}
      <div style={{ padding: "0 16px 8px", position: "relative", width: "100%", boxSizing: "border-box" }}>
        <svg style={{ position: "absolute", left: 28, top: "50%", transform: "translateY(-50%)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={UI.placeholder} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input className="search-input" aria-label={getCopy(lang, "searchPlaceholder")} value={mapQuery} onFocus={closeSearchPopup} onClick={closeSearchPopup} onChange={e => setMapQuery(e.target.value)} placeholder={getCopy(lang, "searchPlaceholder")}
          style={SEARCH_INPUT_STYLE} />
      </div>

      <div style={{ flex: 1, minHeight: 0, position: "relative", borderTop: `1px solid ${T.beige}`, overflow: "hidden" }}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            detectRetina={true}
            maxNativeZoom={19}
            maxZoom={20}
          />
          <BindMapRef mapRef={mapRef} />
          <EnsureMapLayout />
          <LocateController
            request={locateRequest}
            onStart={handleLocateStart}
            onSuccess={handleLocateSuccess}
            onError={handleLocateError}
          />
          <SaveMapView onMove={setMapView} onBoundsChange={setVisibleBounds} />
          {flyTarget && <FlyTo center={flyTarget} offsetY={120} />}
          {(!mapQuery || locateRequest.mode === "manual") && <FlyToBySignal center={userPos} seq={locateRequest.seq} zoom={locateRequest.zoom} />}
          {userPos && <Marker position={userPos} icon={userIcon} ref={userMarkerRef}>
            <Popup><span style={{ ...TYPE.control }}><InlineIcon name="pin" size={13} color={T.brown} /> {getCopy(lang, "map.yourLocation")}</span></Popup>
          </Marker>}
          {searchMarker && (
            <Marker position={searchMarker.position} icon={stationIcon} ref={searchMarkerRef}>
              <Popup className="map-popup" minWidth={160} maxWidth={220} autoPan={false}>
                <div style={{ fontFamily: FONT.body }}>
                  <div style={{ ...TYPE.cardTitle, marginBottom: 4, color: T.text }}><InlineIcon name="train" size={14} color={T.brown} /> {getCopy(lang, "map.searchLocation")}</div>
                  <div style={{ ...TYPE.caption, color: T.sub }}>{searchMarker.label}</div>
                </div>
              </Popup>
            </Marker>
          )}
          {visibleMapCafes.map(c => (
            <Marker
              key={c.id}
              position={[parseFloat(c.latitude), parseFloat(c.longitude)]}
              icon={cafeIcon}
              ref={(marker) => {
                if (marker) markerRefs.current.set(c.id, marker);
                else markerRefs.current.delete(c.id);
              }}
              eventHandlers={{
                popupclose: () => {
                  setSearchPopupCafeId((current) => (current === c.id ? null : current));
                },
              }}
            >
              <Popup
                className="map-popup"
                minWidth={160}
                maxWidth={220}
                autoPan={false}
              >
                <div style={{ fontFamily: FONT.body }}>
                  <div style={{ ...TYPE.cardTitle, marginBottom: 4, color: T.text }}>{c.name}</div>
                  {c.mrt && <div style={{ ...TYPE.caption, color: T.sub, marginBottom: 2 }}><InlineIcon name="train" size={12} color={T.sub} /> {c.mrt}</div>}
                  <div style={{ ...TYPE.caption, color: T.sub, marginBottom: 6 }}><InlineIcon name="pin" size={12} color={T.sub} /> {c.address}</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                    {temporaryClosureTag(c, lang)}
                    {c.wifi > 0 && <span style={{ ...TYPE.caption, background: T.beige, borderRadius: 10, padding: "2px 7px" }}><InlineIcon name="wifi" size={11} color={T.sub} /> {c.wifi.toFixed(1)}</span>}
                    {c.quiet > 0 && <span style={{ ...TYPE.caption, background: T.beige, borderRadius: 10, padding: "2px 7px" }}><InlineIcon name="quiet" size={11} color={T.sub} /> {c.quiet.toFixed(1)}</span>}
                    {c.limited_time === "no" && <span style={{ ...TYPE.caption, background: T.green, color: UI.onDark, borderRadius: 10, padding: "2px 7px" }}><InlineIcon name="check" size={11} color={UI.onDark} /> {getCopy(lang, "tags.noLimit")}</span>}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelect(c); }}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      background: T.brown,
                      color: UI.onDark,
                      border: "none",
                      borderRadius: 10,
                      ...TYPE.control,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {getCopy(lang, "common.viewDetails")}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Locate me button */}
        <button
          aria-label={locating ? getCopy(lang, "map.locating") : getCopy(lang, "map.backToLocation")}
          onClick={() => {
            setLocateError("");
            requestUserLocation({ silent: false, zoom: 15, mode: "manual" });
          }}
          disabled={locating}
          style={{
            position: "absolute", bottom: 20, right: 16, zIndex: 1000,
            width: 40, height: 40, borderRadius: "50%",
            background: UI.paper, border: `1px solid ${UI.line}`,
            boxShadow: UI.controlShadow,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: locating ? "default" : "pointer",
            opacity: locating ? 0.7 : 1,
          }}
          title={locating ? getCopy(lang, "map.locatingTitle") : getCopy(lang, "map.backToLocation")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.brown} strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </button>
        {locateError && (
          <div style={{
            position: "absolute", right: 16, bottom: 68, zIndex: 1000,
            maxWidth: 260, background: UI.surface, color: T.text, border: `1px solid ${UI.line}`,
            borderRadius: 10, boxShadow: UI.shadow, padding: "8px 10px",
            fontSize: 12, lineHeight: 1.35,
          }}>
            {locateError}
          </div>
        )}
      </div>
    </div>
  );
};

// ── CrowdReport ──
const CrowdReport = ({ cafeId, onReport, lang }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getCrowdReport(cafeId).then(r => {
      if (active) {
        setReport(r);
        setLoading(false);
        setSubmitted(false);
        setEditing(false);
      }
    });
    return () => { active = false; };
  }, [cafeId]);

  const handleReport = async (status) => {
    await submitCrowdReport(cafeId, status);
    const latest = await getCrowdReport(cafeId);
    if (latest) {
      setReport(latest);
      if (onReport) onReport(cafeId, status);
    }
    setSubmitted(true);
    setEditing(false);
  };

  const statusLabel = {
    empty: getCopy(lang, "crowd.empty"),
    normal: getCopy(lang, "crowd.normal"),
    crowded: getCopy(lang, "crowd.crowded"),
  };
  const statusTone = {
    empty: "#20B02F",
    normal: "#D7A817",
    crowded: "#D83A34",
  };
  const StatusLabel = ({ status, children }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <Icon name="status" size={11} style={{ color: statusTone[status] || T.sub }} />
      {children}
    </span>
  );

  const buttons = (
    <div style={{ display: "flex", gap: 8 }}>
      {[["empty", getCopy(lang, "crowd.empty")],["normal", getCopy(lang, "crowd.normal")],["crowded", getCopy(lang, "crowd.crowded")]].map(([val, label]) => (
        <button key={val} className="soft-press" onClick={() => handleReport(val)} style={{
          flex: 1, padding: "10px 4px", borderRadius: 10, border: `1px solid ${T.beige}`,
          background: T.cream, ...TYPE.control, cursor: "pointer", fontFamily: "inherit"
        }}><StatusLabel status={val}>{label}</StatusLabel></button>
      ))}
    </div>
  );

  return (
    <div style={{ background: UI.surface, borderRadius: 12, border: `1px solid ${UI.line}`, padding: 16, marginBottom: 14 }}>
      <div style={{ ...TYPE.sectionTitle, color: T.text, marginBottom: 10 }}>{getCopy(lang, "crowd.title")}</div>
      {loading ? (
        <div style={{ ...TYPE.meta, color: T.sub }}>{getCopy(lang, "crowd.loading")}</div>
      ) : submitted && !editing ? (
        <>
          <div className="success-pop" style={{ ...TYPE.body, color: T.green, marginBottom: 4 }}><InlineIcon name="checkCircle" size={14} color={T.green} /> {getCopy(lang, "crowd.thanks")}</div>
          <div style={{ ...TYPE.body, color: T.text, marginBottom: 8 }}><StatusLabel status={report?.status}>{statusLabel[report?.status]}</StatusLabel></div>
          <button className="soft-press" onClick={() => setEditing(true)} style={{ ...TYPE.control, color: T.brown, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>{getCopy(lang, "crowd.update")}</button>
        </>
      ) : editing || !report ? (
        <>
          {editing && <div style={{ ...TYPE.meta, color: T.sub, marginBottom: 8 }}>{getCopy(lang, "crowd.current")}</div>}
          {buttons}
        </>
      ) : (
        <>
          <div style={{ ...TYPE.body, color: T.text, marginBottom: 6 }}><StatusLabel status={report.status}>{statusLabel[report.status]}</StatusLabel></div>
          <div style={{ ...TYPE.caption, color: T.sub, marginBottom: 10 }}>{timeAgo(report.reported_at, lang)}</div>
          <button className="soft-press" onClick={() => setEditing(true)} style={{ ...TYPE.control, color: T.brown, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>{getCopy(lang, "crowd.update")}</button>
        </>
      )}
    </div>
  );
};

// ── Page: Detail ──
const DetailPage = ({ cafe, onBack, fav, onFav, onReport, emptyCafeIds, onFilterTag, canManageCafe, onHideCafe, lang }) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swipeActive = useRef(false);
  const [swipeX, setSwipeX] = useState(0);
  const [hideBusy, setHideBusy] = useState(false);
  const [hideError, setHideError] = useState("");

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    swipeActive.current = touch.clientX <= 28;
  };

  const handleTouchMove = (e) => {
    if (!swipeActive.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      swipeActive.current = false;
      setSwipeX(0);
      return;
    }

    if (deltaX > 0) {
      setSwipeX(Math.min(deltaX, 120));
    } else {
      setSwipeX(0);
    }
  };

  const handleTouchEnd = () => {
    if (swipeActive.current && swipeX > 72) {
      setSwipeX(0);
      swipeActive.current = false;
      onBack();
      return;
    }
    swipeActive.current = false;
    setSwipeX(0);
  };

  const handleHideCafe = async () => {
    if (!canManageCafe || !onHideCafe || hideBusy) return;
    setHideBusy(true);
    setHideError("");
    try {
      await onHideCafe(cafe);
    } catch (error) {
      setHideError(error.message || getCopy(lang, "detail.hideFailed"));
      setHideBusy(false);
    }
  };
  const applyTagFilter = (filterKey) => {
    if (!onFilterTag) return undefined;
    return () => onFilterTag(filterKey, cafe);
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        transform: swipeX ? `translateX(${swipeX}px)` : "translateX(0)",
        transition: swipeActive.current ? "none" : "transform 0.18s ease-out",
        touchAction: "pan-y",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div style={{ background: T.brown, padding: `13px ${SPACE.pageX + 2}px`, display: "flex", alignItems: "center", gap: SPACE.groupGap }}>
        <button className="soft-press" aria-label={getCopy(lang, "detail.back")} onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: UI.onDark, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 2 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={UI.onDark} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span aria-hidden="true" style={{ flex: 1 }} />
        <button className="soft-press" aria-label={fav ? getCopy(lang, "aria.unfavorite", { name: cafe.name }) : getCopy(lang, "aria.favorite", { name: cafe.name })} onClick={() => onFav(cafe.id)} style={{ background: "none", border: "none", cursor: "pointer", color: UI.onDark, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 2 }}>
          <Icon name={fav ? "starFilled" : "star"} size={22} strokeWidth={2.1} />
        </button>
      </div>
      <div style={{ padding: `${SPACE.pageX}px ${SPACE.pageX + 2}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: SPACE.chipGap + 1, marginBottom: 4 }}>
          <div style={{ ...TYPE.detailTitle, color: T.text }}>
            {cafe.name}
          </div>
          {cafe.url && (
            <a aria-label={getCopy(lang, "detail.openStoreLink")} href={cafe.url} target="_blank" rel="noreferrer" style={{ color: T.sub, lineHeight: 1, textDecoration: "none", display: "inline-flex" }}>
              <Icon name="external" size={16} strokeWidth={2.1} />
            </a>
          )}
        </div>
        {cafe.mrt && <div style={{ ...TYPE.body, color: T.sub, marginBottom: 3 }}><InlineIcon name="train" size={14} color={T.sub} /> {cafe.mrt}</div>}
        <div style={{ ...TYPE.body, color: T.sub, marginBottom: SPACE.cardGap }}><InlineIcon name="pin" size={14} color={T.sub} /> {cafe.address}</div>
        {cafe.google_business_note && <div style={{ ...TYPE.body, color: UI.warning, marginBottom: 8, fontWeight: 650 }}><InlineIcon name="pause" size={14} color={UI.warning} /> {cafe.google_business_note}</div>}
        {cafe.open_time && <div style={{ ...TYPE.body, color: T.text, marginBottom: 8 }}><InlineIcon name="clock" size={14} color={T.text} /> {cafe.open_time}</div>}

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: SPACE.chipGap + 1 }}>
          {temporaryClosureTag(cafe, lang)}
          {limitedTag(cafe.limited_time, lang, applyTagFilter("noLimit"))}
          {socketTag(cafe.socket, lang, applyTagFilter("socket"))}
          {cafe.standing_desk === "yes" && <Tag label={getCopy(lang, "tags.standing")} type="gray" onClick={applyTagFilter("standing")} />}
          {crowdTagFromIds(cafe.id, emptyCafeIds, lang, applyTagFilter("empty"))}
        </div>
        <div style={{ ...TYPE.caption, color: T.sub, marginBottom: SPACE.pageX }}>{getCopy(lang, "common.similarTagsHint")}</div>

        <CrowdReport cafeId={cafe.id} onReport={onReport} lang={lang} />

        {cafe.wifi > 0 && (
          <div style={{ background: UI.paper, borderRadius: 16, border: `1px solid ${UI.line}`, padding: SPACE.pageX, marginBottom: SPACE.pageX, boxShadow: UI.shadow }}>
            <div style={{ ...TYPE.sectionTitle, marginBottom: SPACE.cardGap, color: T.text }}>{getCopy(lang, "detail.scores")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACE.chipGap + 1 }}>
              {[
                ["wifi", getCopy(lang, "detail.wifi"), getCopy(lang, "detail.stable"), cafe.wifi, cafe.wifi >= 4 ? "wifi" : null],
                ["quiet", getCopy(lang, "detail.quiet"), getCopy(lang, "detail.level"), cafe.quiet, cafe.quiet >= 4 ? "quiet" : null],
                ["coffee", getCopy(lang, "detail.coffee"), getCopy(lang, "detail.tasty"), cafe.tasty, cafe.tasty >= 4 ? "tasty" : null],
                ["seat", getCopy(lang, "detail.seat"), getCopy(lang, "detail.seatsAvailable"), cafe.seat, null],
                ["price", getCopy(lang, "detail.price"), getCopy(lang, "detail.cheap"), cafe.cheap, cafe.cheap >= 4 ? "cheap" : null],
                ["music", getCopy(lang, "detail.vibe"), getCopy(lang, "detail.music"), cafe.music, cafe.music >= 4 ? "music" : null],
              ].map(([iconName, label, subLabel, val, filterKey]) =>
                val > 0 ? (
                  <button
                    key={label}
                    type="button"
                    onClick={filterKey ? applyTagFilter(filterKey) : undefined}
                    disabled={!filterKey}
                    style={{
                      background: UI.oat,
                      border: `1px solid ${UI.softLine}`,
                      borderRadius: 14,
                      padding: "10px 10px",
                      textAlign: "left",
                      cursor: filterKey ? "pointer" : "default",
                      fontFamily: "inherit",
                      color: T.text,
                      opacity: 1,
                    }}
                  >
                    <div style={{ ...TYPE.control, fontWeight: 760, marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}><Icon name={iconName} size={13} /> {label}</div>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6 }}>
                      <span style={{ ...TYPE.caption, color: T.sub }}>{subLabel}</span>
                      <span style={{ fontSize: "1.08rem", lineHeight: 1, fontWeight: 760, fontVariantNumeric: "tabular-nums" }}>{Number(val).toFixed(1)}</span>
                    </div>
                  </button>
                ) : null
              )}
            </div>
          </div>
        )}

        {cafe.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cafe.name} ${cafe.address}`)}`}
            target="_blank"
            rel="noreferrer"
            className="soft-press"
            style={{ display: "block", background: T.brown, color: UI.onDark, borderRadius: 14, padding: "12px", textAlign: "center", textDecoration: "none", ...TYPE.control, marginBottom: 10, boxShadow: UI.activeShadow }}
          >
            <InlineIcon name="map" size={14} color={UI.onDark} /> {getCopy(lang, "common.openInGoogleMaps")}
          </a>
        )}
        {canManageCafe && (
          <>
            <button
              className="soft-press"
              onClick={handleHideCafe}
              disabled={hideBusy}
              style={{
                display: "block",
                width: "100%",
                background: UI.surface,
                color: T.brown,
                borderRadius: 10,
                padding: "12px",
                textAlign: "center",
                border: `1px solid ${T.beige}`,
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 10,
                cursor: hideBusy ? "default" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {hideBusy ? getCopy(lang, "detail.hidingCafe") : <><InlineIcon name="hide" size={14} color={T.brown} /> {getCopy(lang, "detail.hideCafe")}</>}
            </button>
            {hideError && <div style={{ fontSize: 12, color: UI.danger, marginBottom: 10 }}>{hideError}</div>}
          </>
        )}
      </div>
    </div>
  );
};

// ── Main App ──
export default function App() {
  const [tab, setTab] = useState("home");
  const [tabHistory, setTabHistory] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === "zh" || saved === "en") return saved;
      if (typeof navigator !== "undefined") {
        return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
      }
      return "zh";
    } catch {
      return "zh";
    }
  });
  const [country, setCountry] = useState(() => {
    try {
      return localStorage.getItem(COUNTRY_STORAGE_KEY) || "taiwan";
    } catch {
      return "taiwan";
    }
  });
  const [region, setRegion] = useState(() => {
    try {
      return localStorage.getItem(REGION_STORAGE_KEY) || REGION_PROMPT_KEY;
    } catch {
      return REGION_PROMPT_KEY;
    }
  });
  const [allCafes, setAllCafes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [homeFilters, setHomeFilters] = useState(DEFAULT_HOME_FILTERS);
  const [favs, setFavs] = useState(() => {
    try {
      const raw = localStorage.getItem("cafe-voyage:favs");
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? new Set(parsed.map(String)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [emptyCafeIds, setEmptyCafeIds] = useState(new Set());
  const [mapView, setMapView] = useState({ center: null, zoom: null });
  const [mapQuery, setMapQuery] = useState("");
  const isAdminUser = authUser?.email === ADMIN_EMAIL;
  const fetchAllCafes = useCallback(async () => {
    let cacheLoaded = false;
    try {
      const raw = localStorage.getItem(MAP_CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached?.timestamp && Array.isArray(cached?.data) && Date.now() - cached.timestamp < MAP_CACHE_TTL) {
          setAllCafes(cached.data);
          cacheLoaded = true;
        }
      }
    } catch (e) {
      console.error(e);
    }

    setLoading(!cacheLoaded);

    try {
      const [taiwanRes, hoiAnRes] = await Promise.all([
        fetch("/api/cafes"),
        fetch("/api/cafes?city=hoi-an-vn"),
      ]);
      const [taiwanData, hoiAnData] = await Promise.all([taiwanRes.json(), hoiAnRes.json()]);
      const data = [...taiwanData, ...hoiAnData];
      const seen = new Set();
      const merged = [];
      data.forEach((cafe) => {
        const dedupeKey = cafe.id || `${cafe.name}-${cafe.address}`;
        if (seen.has(dedupeKey)) return;
        seen.add(dedupeKey);
        merged.push(cafe);
      });

      setAllCafes(merged);
      localStorage.setItem(MAP_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: merged }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allCafes.length > 0 || loading) return;
    fetchAllCafes();
  }, [allCafes.length, loading, fetchAllCafes]);
  
  // App 啟動時抓取 emptyCafeIds
  useEffect(() => { 
    fetchEmptyCafeIds().then(setEmptyCafeIds).catch(() => {}); 
  }, []);

  useEffect(() => {
    localStorage.setItem("cafe-voyage:favs", JSON.stringify([...favs]));
  }, [favs]);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setAuthError(error.message);
        return;
      }
      setAuthUser(data.session?.user ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(COUNTRY_STORAGE_KEY, country);
    } catch {}
  }, [country]);

  useEffect(() => {
    try {
      if (region === REGION_PROMPT_KEY) {
        localStorage.removeItem(REGION_STORAGE_KEY);
      } else {
        localStorage.setItem(REGION_STORAGE_KEY, region);
      }
    } catch {}
  }, [region]);

  const handleGoogleSignIn = useCallback(async () => {
    let redirectStarted = false;
    setAuthBusy(true);
    setAuthError("");
    setAuthMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getAuthRedirectUrl(),
        },
      });
      if (error) throw error;
      redirectStarted = true;
      setAuthMessage(getCopy(lang, "auth.redirecting"));
    } catch (error) {
      setAuthError(error.message || getCopy(lang, "auth.signInFailed"));
    } finally {
      if (redirectStarted) return;
      window.setTimeout(() => {
        setAuthBusy(false);
      }, 0);
    }
  }, [lang]);

  const handleSignOut = useCallback(async () => {
    setAuthBusy(true);
    setAuthError("");
    setAuthMessage("");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAuthMessage(getCopy(lang, "auth.signedOut"));
    } catch (error) {
      setAuthError(error.message || getCopy(lang, "auth.signOutFailed"));
    } finally {
      setAuthBusy(false);
    }
  }, [lang]);

  const handleHideCafe = useCallback(async (cafe) => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    const session = data.session;
    const email = session?.user?.email || "";
    if (!session?.access_token || email !== ADMIN_EMAIL) {
      throw new Error(getCopy(lang, "auth.adminOnly"));
    }

    const countryCode = getCafeCountryKey(cafe) === "vietnam" ? "VN" : "TW";
    const cityKey = getCafeCountryKey(cafe) === "vietnam"
      ? (cafe.city_key || "hoi_an")
      : (getCafeRegionGroupKey(cafe) || "");

    const response = await fetch(`${SUPABASE_URL}/rest/v1/cafe_overrides?on_conflict=cafe_source,cafe_source_id`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify([{
        cafe_source: "cafenomad",
        cafe_source_id: String(cafe.id),
        country_code: countryCode,
        city_key: cityKey,
        is_hidden: true,
        sort_penalty: 999,
        note: "從詳細頁手動隱藏",
        is_active: true,
      }]),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Supabase request failed: ${response.status}`);
    }

    await fetchAllCafes();
    setSelected(null);
  }, [fetchAllCafes, lang]);

  const toggleFav = (id) => setFavs(prev => { const key = String(id); const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s; });
  const favoriteLookup = useMemo(() => ({ has: (id) => favs.has(String(id)) }), [favs]);
  const availableCountries = useMemo(() => {
    const existing = new Set(allCafes.map((cafe) => getCafeCountryKey(cafe)));
    return COUNTRY_OPTIONS.filter((item) => !item.comingSoon && existing.has(item.key));
  }, [allCafes]);
  const countryOptionKeys = useMemo(() => new Set(availableCountries.map((item) => item.key)), [availableCountries]);
  const selectedCountry = availableCountries.find((item) => item.key === country) || availableCountries[0] || COUNTRY_OPTIONS[0];
  const countryScopedCafes = useMemo(() => allCafes.filter((cafe) => getCafeCountryKey(cafe) === selectedCountry.key), [allCafes, selectedCountry.key]);
  const availableRegions = useMemo(() => {
    const seen = new Set();
    const options = [];
    countryScopedCafes.forEach((cafe) => {
      const groupKey = getCafeRegionGroupKey(cafe);
      if (!groupKey || seen.has(groupKey)) return;
      seen.add(groupKey);
    });
    REGION_GROUPS.forEach((group) => {
      if (group.country !== selectedCountry.key) return;
      if (!seen.has(group.key)) return;
      options.push({ key: group.key, label: getRegionLabel(group, lang) });
    });
    return options;
  }, [countryScopedCafes, selectedCountry.key, lang]);
  const regionOptionKeys = useMemo(() => new Set(availableRegions.map((item) => item.key)), [availableRegions]);
  const hasRegionSelection = region !== REGION_PROMPT_KEY;
  const regionLabel = region === REGION_PROMPT_KEY
    ? getCopy(lang, "common.cityPrompt")
    : (availableRegions.find((item) => item.key === region)?.label || getCopy(lang, "common.cityPrompt"));
  const regionScopedCafes = useMemo(() => {
    if (region === REGION_PROMPT_KEY) return [];
    return countryScopedCafes.filter((cafe) => getCafeRegionGroupKey(cafe) === region);
  }, [countryScopedCafes, region]);
  const homeCafes = hasRegionSelection ? regionScopedCafes : [];
  const searchCafes = hasRegionSelection ? regionScopedCafes : countryScopedCafes;
  const favoritesCafes = allCafes;

  useEffect(() => {
    if (region === REGION_PROMPT_KEY) return;
    if (availableRegions.length <= 1) return;
    if (regionOptionKeys.has(region)) return;
    setRegion(REGION_PROMPT_KEY);
  }, [availableRegions.length, region, regionOptionKeys]);

  useEffect(() => {
    if (countryOptionKeys.has(country)) return;
    if (availableCountries[0]) setCountry(availableCountries[0].key);
  }, [availableCountries, country, countryOptionKeys]);

  useEffect(() => {
    if (region !== REGION_PROMPT_KEY) return;
    if (availableRegions.length !== 1) return;
    setRegion(availableRegions[0].key);
  }, [availableRegions, region]);

  const handleCountryChange = (nextCountry) => {
    setCountry(nextCountry);
    setRegion(REGION_PROMPT_KEY);
    setMapView({ center: null, zoom: null });
    setMapQuery("");
    setSelected(null);
  };
  const handleRegionChange = (nextRegion) => { setRegion(nextRegion); setSelected(null); };
  const handleTabChange = (nextTab) => {
    if (nextTab === tab) return;
    setTabHistory(prev => [...prev, tab]);
    setTab(nextTab);
  };
  const handleTabBack = () => {
    setTabHistory(prev => {
      if (prev.length === 0) return prev;
      const nextTab = prev[prev.length - 1];
      setTab(nextTab);
      return prev.slice(0, -1);
    });
  };

  const handleReportAndUpdateMap = (cafeId, status) => {
    if (status === "empty") {
      setEmptyCafeIds(prev => new Set([...prev, cafeId]));
    } else {
      setEmptyCafeIds(prev => { const s = new Set(prev); s.delete(cafeId); return s; });
    }
  };

  const handleDetailTagFilter = useCallback((filterKey, cafe) => {
    if (!filterKey || !cafe) return;
    const cafeCountry = getCafeCountryKey(cafe);
    const cafeRegion = getCafeRegionGroupKey(cafe);

    setHomeFilters({ ...DEFAULT_HOME_FILTERS, [filterKey]: true });
    setCountry(cafeCountry);
    setRegion(cafeRegion || REGION_PROMPT_KEY);
    setSelected(null);
    setTab("home");
  }, []);

  const renderPage = () => {
    if (selected) return <DetailPage cafe={selected} onBack={() => setSelected(null)} fav={favoriteLookup.has(selected.id)} onFav={toggleFav} onReport={handleReportAndUpdateMap} emptyCafeIds={emptyCafeIds} onFilterTag={handleDetailTagFilter} canManageCafe={isAdminUser} onHideCafe={handleHideCafe} lang={lang} />;
    switch (tab) {
      case "home": return <HomePage cafes={homeCafes} loading={loading} hasRegionSelection={hasRegionSelection} onOpenRegionPicker={() => setMenuOpen(true)} onSelect={setSelected} favs={favoriteLookup} onFav={toggleFav} emptyCafeIds={emptyCafeIds} filters={homeFilters} setFilters={setHomeFilters} lang={lang} />;
      case "search": return <SearchPage cafes={searchCafes} loading={loading} onSelect={setSelected} favs={favoriteLookup} onFav={toggleFav} lang={lang} />;
      case "map": return <MapPage cafes={countryScopedCafes} onSelect={setSelected} mapView={mapView} setMapView={setMapView} mapQuery={mapQuery} setMapQuery={setMapQuery} loading={loading} lang={lang} />;
      case "favorites": return <FavoritesPage cafes={favoritesCafes} favs={favoriteLookup} onSelect={setSelected} onFav={toggleFav} onExplore={() => setTab("home")} lang={lang} />;
      default: return null;
    }
  };

  const headerSubtitle = tab === "map" || tab === "favorites"
    ? ""
    : hasRegionSelection
      ? <><InlineIcon name="pin" size={12} color={UI.onDarkMuted} /> {regionLabel}・{homeCafes.filter(isOpen).length} {lang === "en" ? "cafes" : getCopy(lang, "common.countUnit")}</>
      : <><InlineIcon name="pin" size={12} color={UI.onDarkMuted} /> {getCountryLabel(selectedCountry, lang)}・{getCopy(lang, "common.cityPrompt")}</>;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Playfair+Display:wght@400;700&display=swap');html,body,#root{height:100%}*{margin:0;padding:0;box-sizing:border-box}body{font-family:${FONT.body};font-kerning:normal;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;background:${UI.pageBg}}input,button,textarea,select{font:inherit}input::placeholder{color:${UI.placeholder};opacity:1}button:focus-visible,[role="button"]:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid ${UI.sage} !important;outline-offset:3px}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${T.beige};border-radius:3px}.app-shell{container-type:inline-size}.soft-press,.cafe-card-shell,.nav-item{-webkit-tap-highlight-color:transparent;transform:translateZ(0)}.search-input{transition:border-color 160ms ease,box-shadow 160ms ease,background 160ms ease}.search-input:focus{border-color:${T.brown}!important;box-shadow:0 0 0 3px rgba(92,61,46,.10),0 8px 18px rgba(62,39,35,.05)!important}.map-popup .leaflet-popup-content-wrapper{border-radius:16px;border:1px solid ${UI.line};box-shadow:${UI.popupShadow}}.map-popup .leaflet-popup-content{margin:10px 12px;min-width:0 !important;width:min(220px,calc(100vw - 88px)) !important}.map-popup .leaflet-popup-close-button{padding:8px 10px 0 0;font-size:18px}@media (max-width:480px){.app-shell{box-shadow:none!important}}@media (min-width:768px){body{padding:16px}.app-shell{height:calc(100dvh - 32px)!important;min-height:calc(100dvh - 32px)!important;border-radius:28px}}@media (orientation:landscape) and (max-height:520px){.app-shell{max-width:720px!important}.nav-item{min-height:42px!important}}@media (prefers-reduced-motion:no-preference){.soft-press,.cafe-card-shell{transition:transform 150ms cubic-bezier(.22,1,.36,1),filter 150ms ease,background-color 150ms ease,border-color 150ms ease,color 150ms ease,box-shadow 150ms ease}.soft-press:active,.cafe-card-shell:active{transform:translateY(1px) scale(.99)}.nav-item:active{transform:translateY(1px) scale(.98)}@media (hover:hover){.soft-press:hover,.cafe-card-shell:hover{transform:translateY(-1px)}}.preset-card[aria-pressed="true"]{animation:soft-settle 220ms cubic-bezier(.22,1,.36,1)}.success-pop{animation:success-pop 260ms cubic-bezier(.22,1,.36,1)}@keyframes soft-settle{from{transform:scale(.985)}to{transform:scale(1)}}@keyframes success-pop{0%{transform:translateY(2px);opacity:.72}100%{transform:translateY(0);opacity:1}}}`}</style>
      <div className="app-shell" style={{ maxWidth: 480, margin: "0 auto", width: "100%", height: "100svh", minHeight: "100dvh", display: "flex", flexDirection: "column", background: T.cream, overflow: "hidden", boxShadow: UI.shellShadow }}>
        {!selected && <Header cityLabel={hasRegionSelection ? regionLabel : getCountryLabel(selectedCountry, lang)} subtitle={headerSubtitle} onOpenMenu={() => setMenuOpen(true)} lang={lang} />}
        {selected ? (
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {renderPage()}
          </div>
        ) : (
          <SwipeBackShell enabled={tabHistory.length > 0} onBack={handleTabBack}>
            {renderPage()}
          </SwipeBackShell>
        )}
        {!selected && <BottomNav active={tab} onChange={handleTabChange} lang={lang} />}
        {!selected && (
          <SettingsPanel
            open={menuOpen}
            country={selectedCountry.key}
            countryOptions={availableCountries}
            setCountry={handleCountryChange}
            region={region}
            regionOptions={availableRegions}
            setRegion={handleRegionChange}
            onClose={() => setMenuOpen(false)}
            user={authUser}
            authBusy={authBusy}
            authMessage={authMessage}
            authError={authError}
            onGoogleSignIn={handleGoogleSignIn}
            onSignOut={handleSignOut}
            lang={lang}
            setLang={setLang}
          />
        )}
      </div>
    </>
  );
}
