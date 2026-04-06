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

const REGION_PROMPT_KEY = "prompt";
const REGION_STORAGE_KEY = "cafe-voyage:region";
const COUNTRY_STORAGE_KEY = "cafe-voyage:country";
const MAP_CACHE_KEY = "cafe-voyage:map-cafes:v2";
const MAP_CACHE_TTL = 1000 * 60 * 60 * 12;
const REGION_PATTERN = /(台北市|新北市|桃園市|台中市|臺中市|台南市|臺南市|高雄市|基隆市|新竹市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義市|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|臺東縣)/;
const COUNTRY_OPTIONS = [
  { key: "taiwan", label: "台灣", flag: "🇹🇼" },
  { key: "vietnam", label: "越南", flag: "🇻🇳" },
  { key: "thailand", label: "泰國", flag: "🇹🇭", comingSoon: true },
  { key: "japan", label: "日本", flag: "🇯🇵", comingSoon: true },
];
const REGION_GROUPS = [
  { key: "taipei", label: "台北", country: "taiwan", members: ["台北市", "新北市"] },
  { key: "taichung", label: "台中", country: "taiwan", members: ["台中市"] },
  { key: "tainan", label: "台南", country: "taiwan", members: ["台南市"] },
  { key: "kaohsiung", label: "高雄", country: "taiwan", members: ["高雄市"] },
  { key: "chiayi", label: "嘉義", country: "taiwan", members: ["嘉義市", "嘉義縣"] },
  { key: "hsinchu", label: "新竹", country: "taiwan", members: ["新竹市", "新竹縣"] },
  { key: "taoyuan", label: "桃園", country: "taiwan", members: ["桃園市"] },
  { key: "keelung", label: "基隆", country: "taiwan", members: ["基隆市"] },
  { key: "miaoli", label: "苗栗", country: "taiwan", members: ["苗栗縣"] },
  { key: "changhua", label: "彰化", country: "taiwan", members: ["彰化縣"] },
  { key: "nantou", label: "南投", country: "taiwan", members: ["南投縣"] },
  { key: "yunlin", label: "雲林", country: "taiwan", members: ["雲林縣"] },
  { key: "pingtung", label: "屏東", country: "taiwan", members: ["屏東縣"] },
  { key: "yilan", label: "宜蘭", country: "taiwan", members: ["宜蘭縣"] },
  { key: "hualien", label: "花蓮", country: "taiwan", members: ["花蓮縣"] },
  { key: "taitung", label: "台東", country: "taiwan", members: ["台東縣"] },
  { key: "hoi_an", label: "會安", country: "vietnam", members: ["Hội An", "Hoi An", "會安"] },
];

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
  const color = pct >= 70 ? T.green : pct >= 40 ? T.gold : "#c0392b";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
      <div style={{ flex: 1, height: 5, background: T.beige, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 11, color: T.sub, minWidth: 24 }}>{val.toFixed(1)}</span>
    </div>
  );
};

const Tag = ({ label, type = "green", onClick }) => {
  const styles = {
    green: { bg: T.green, color: "#fff" },
    amber: { bg: "#b7791f", color: "#fff" },
    red: { bg: "#9b2335", color: "#fff" },
    gray: { bg: T.beige, color: T.sub },
  };
  const s = styles[type] || styles.gray;
  const style = {
    background: s.bg,
    color: s.color,
    borderRadius: 14,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 500,
    whiteSpace: "nowrap",
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
        {label}
      </button>
    );
  }

  return (
    <span style={style}>
      {label}
    </span>
  );
};

const limitedTag = (v, onNoLimitClick) => {
  if (v === "no") return <Tag label="✓ 不限時" type="green" onClick={onNoLimitClick} />;
  if (v === "maybe") return <Tag label="△ 假日限時" type="amber" />;
  if (v === "yes") return <Tag label="✗ 有限時" type="red" />;
  return null;
};

const socketTag = (v, onSocketClick) => {
  if (v === "yes") return <Tag label="⚡ 插座多" type="green" onClick={onSocketClick} />;
  if (v === "maybe") return <Tag label="⚡ 插座少" type="amber" />;
  return null;
};

const temporaryClosureTag = (cafe) => {
  if (cafe.google_business_status === "CLOSED_TEMPORARILY") {
    return <Tag label="⏸ 暫停營業" type="amber" />;
  }
  return null;
};

// ── Crowd helpers ──
const crowdTagFromIds = (cafeId, emptyCafeIds, onEmptyClick) => {
  if (emptyCafeIds && emptyCafeIds.has && emptyCafeIds.has(cafeId)) {
    return <Tag label="🟢 很空" type="green" onClick={onEmptyClick} />;
  }
  return null;
};

// ── Filter Section ──
const FILTER_LABELS = {
  noLimit: "不限時",
  socket: "插座多",
  standing: "站立桌",
  wifi: "WiFi穩",
  quiet: "超安靜",
  tasty: "咖啡好喝",
  cheap: "價格實惠",
  music: "舒服氛圍",
  empty: "目前人少",
};
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
const FILTER_PRESETS = [
  {
    key: "focus",
    title: "專心工作",
    subtitle: "安靜、網路穩，適合打開電腦",
    filters: { wifi: true, quiet: true },
    score: (cafe) => (Number(cafe.wifi) || 0) * 0.4 + (Number(cafe.quiet) || 0) * 0.4 + (Number(cafe.seat) || 0) * 0.2,
  },
  {
    key: "longStay",
    title: "久坐友善",
    subtitle: "不趕時間，也不用擔心沒電",
    filters: { socket: true, noLimit: true },
    score: (cafe) => (Number(cafe.seat) || 0) * 0.4 + (Number(cafe.wifi) || 0) * 0.35 + (Number(cafe.quiet) || 0) * 0.25,
  },
  {
    key: "coffee",
    title: "好咖啡",
    subtitle: "想認真喝一杯的時候",
    filters: { tasty: true },
    score: (cafe) => (Number(cafe.tasty) || 0) * 0.7 + (Number(cafe.cheap) || 0) * 0.15 + (Number(cafe.seat) || 0) * 0.15,
  },
  {
    key: "vibe",
    title: "舒服氛圍",
    subtitle: "適合聊天、約會、放慢一點",
    filters: { music: true },
    score: (cafe) => (Number(cafe.music) || 0) * 0.5 + (Number(cafe.quiet) || 0) * 0.25 + (Number(cafe.tasty) || 0) * 0.25,
  },
];

const FilterChip = ({ active, label, onClick, icon }) => (
  <button onClick={onClick} style={{
    background: active ? T.green : "#e7dccd",
    color: active ? "#fff" : "#8a745f",
    border: "none",
    borderRadius: 18,
    padding: "9px 16px",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: active ? 700 : 500,
    fontFamily: "inherit",
    lineHeight: 1,
  }}>
    {active ? "✓ " : ""}{icon ? `${icon} ` : ""}{label}
  </button>
);

const FilterSection = ({ filters, toggle }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 11, color: T.sub, marginBottom: 8, fontWeight: 700 }}>工作環境</div>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
      {[
        { key: "noLimit", label: "不限時" },
        { key: "socket", label: "插座多" },
        { key: "standing", label: "站立桌" },
      ].map(({ key, label }) => (
        <FilterChip key={key} active={filters[key]} label={label} onClick={() => toggle(key)} />
      ))}
    </div>

    <div style={{ fontSize: 11, color: T.sub, marginBottom: 8, fontWeight: 700 }}>網路 & 環境</div>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
      {[
        { key: "wifi", label: "WiFi 穩" },
        { key: "quiet", label: "超安靜" },
        { key: "tasty", label: "咖啡好喝" },
        { key: "cheap", label: "價格實惠" },
      ].map(({ key, label }) => (
        <FilterChip key={key} active={filters[key]} label={label} onClick={() => toggle(key)} />
      ))}
    </div>

    <div style={{ fontSize: 11, color: T.sub, marginBottom: 8, fontWeight: 700 }}>即時狀態</div>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {[
        { key: "empty", label: "目前人少", icon: "🟢" },
      ].map(({ key, label }) => (
        <FilterChip key={key} active={filters[key]} label={label} icon="🟢" onClick={() => toggle(key)} />
      ))}
    </div>
  </div>
);

const PER_PAGE = 30;
const Pagination = ({ page, total, onPage }) => {
  const maxPage = Math.ceil(total / PER_PAGE);
  if (maxPage <= 1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "14px 0 4px" }}>
      <button onClick={() => onPage(page - 1)} disabled={page <= 1} style={{
        background: page <= 1 ? T.beige : T.brown, color: page <= 1 ? T.sub : "#fff",
        border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: page <= 1 ? "default" : "pointer", fontFamily: "inherit",
      }}>← 上一頁</button>
      <span style={{ fontSize: 12, color: T.sub }}>{page} / {maxPage}</span>
      <button onClick={() => onPage(page + 1)} disabled={page >= maxPage} style={{
        background: page >= maxPage ? T.beige : T.brown, color: page >= maxPage ? T.sub : "#fff",
        border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: page >= maxPage ? "default" : "pointer", fontFamily: "inherit",
      }}>下一頁 →</button>
    </div>
  );
};

const timeAgo = (ts) => {
  const date = new Date(ts);
  const mins = Math.floor((Date.now() - date) / 60000);
  const timeStr = date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (mins < 1) return `今天 ${timeStr}・剛剛`;
  if (mins < 60) return `今天 ${timeStr}・${mins} 分鐘前`;
  return `今天 ${timeStr}・${Math.floor(mins / 60)} 小時前`;
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
const Header = ({ title = "Cafe Voyage", cityLabel, subtitle, onOpenMenu }) => {
  const metaText = subtitle ?? cityLabel;
  return (
  <div style={{ background: T.brown, padding: "18px 22px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
    <div>
      <div style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, letterSpacing: 0.3 }}>{title}</div>
      {metaText !== "" && <div style={{ color: "#f1e5d6", fontSize: 12, marginTop: 5 }}>{metaText}</div>}
    </div>
    <button onClick={onOpenMenu} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
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
}) => {
  if (!open) return null;
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const menuLinks = [
    {
      title: "關於 Cafe Voyage",
      subtitle: "找工作、放空、約會都剛好的咖啡廳地圖",
      href: null,
    },
    {
      title: "意見回饋",
      subtitle: "功能建議與錯誤回報。",
      href: null,
    },
    {
      title: "Buy me a coffee",
      subtitle: "喜歡 Cafe Voyage 的話可以支持我們。",
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
      borderBottom: `1px solid rgba(92, 61, 46, 0.08)`,
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
          <div style={{ fontSize: 14, fontWeight: 650, color: T.text, marginBottom: subtitle ? 1 : 0, letterSpacing: "-0.01em" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 10.5, lineHeight: 1.45, color: "rgba(122, 102, 82, 0.86)" }}>{subtitle}</div>}
        </div>
        <div style={{ fontSize: 15, color: "rgba(122, 102, 82, 0.7)", flexShrink: 0, paddingTop: 1 }}>{href ? "›" : ""}</div>
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
    <div style={{ position: "absolute", inset: 0, zIndex: 40, background: "rgba(32, 24, 18, 0.26)" }} onClick={onClose}>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "min(84vw, 312px)",
          height: "100%",
          background: "#fffaf4",
          boxShadow: "-18px 0 40px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 18px 12px", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, color: T.text, letterSpacing: "-0.02em" }}>設定</div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: T.sub, fontSize: 23, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(232, 221, 208, 0.75)", borderRadius: 16, padding: 12, margin: "0 16px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(180deg, #f1e7da 0%, #eadccc 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {user ? "☕" : "👤"}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
                {user ? "已登入" : "尚未登入"}
              </div>
              <div style={{ fontSize: 10.5, color: "rgba(122, 102, 82, 0.88)", marginTop: 2, lineHeight: 1.35 }}>
                {user ? (user.email || "已連接 Google 帳號") : "用 Google 同步收藏"}
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
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "11px 12px",
                textAlign: "center",
                fontSize: 13,
                fontWeight: 700,
                cursor: authBusy ? "default" : "pointer",
                fontFamily: "inherit",
                opacity: authBusy ? 0.7 : 1,
                letterSpacing: "-0.01em",
              }}
            >
              {authBusy ? "處理中..." : "登出"}
            </button>
          ) : (
            <button
              onClick={onGoogleSignIn}
              disabled={authBusy}
              style={{
                width: "100%",
                background: T.brown,
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "11px 12px",
                textAlign: "center",
                fontSize: 13,
                fontWeight: 700,
                cursor: authBusy ? "default" : "pointer",
                fontFamily: "inherit",
                opacity: authBusy ? 0.7 : 1,
                letterSpacing: "-0.01em",
              }}
            >
              {authBusy ? "跳轉中..." : "Google 登入"}
            </button>
          )}

          {authMessage && <div style={{ fontSize: 10, color: T.green, marginTop: 6, lineHeight: 1.45 }}>{authMessage}</div>}
          {authError && <div style={{ fontSize: 10, color: "#9b2335", marginTop: 6, lineHeight: 1.45 }}>{authError}</div>}
        </div>

        <div style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(232, 221, 208, 0.75)", borderRadius: 16, padding: 12, margin: "0 16px 10px" }}>
          <div style={{ fontSize: 10.5, color: "rgba(122, 102, 82, 0.82)", marginBottom: 8 }}>地區選擇</div>
          <div style={{ border: "1px solid rgba(92, 61, 46, 0.12)", borderRadius: 14, overflow: "hidden", marginBottom: 10, background: "#fff" }}>
            <button
              onClick={() => setCountryMenuOpen((openState) => !openState)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                borderBottom: countryMenuOpen ? "1px solid rgba(92, 61, 46, 0.08)" : "none",
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
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.label}</span>
              </span>
              <span style={{ fontSize: 10, color: T.sub, transform: countryMenuOpen ? "rotate(180deg)" : "none" }}>▲</span>
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
                        background: isSelected ? "rgba(92, 61, 46, 0.04)" : "none",
                        border: "none",
                        borderBottom: "1px solid rgba(92, 61, 46, 0.06)",
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
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </span>
                      {item.comingSoon ? (
                        <span style={{ fontSize: 10, color: T.sub, background: T.beige, padding: "3px 7px", borderRadius: 999 }}>即將推出</span>
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
                  color: region === item.key ? "#fff" : T.text,
                  border: `1px solid ${region === item.key ? T.brown : "rgba(232, 221, 208, 0.92)"}`,
                  borderRadius: 14,
                  padding: "8px 4px",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: region === item.key ? 700 : 500,
                  lineHeight: 1.1,
                }}
              >
                {item.label}
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
const NAV_ITEMS = [
  { key: "home", label: "首頁", d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
  { key: "search", label: "附近", circle: true },
  { key: "map", label: "地圖", pin: true },
  { key: "favorites", label: "收藏", heart: true },
];
const BottomNav = ({ active, onChange }) => (
  <div style={{
    background: T.beige,
    borderTop: `1px solid ${T.brown}22`,
    display: "flex",
    justifyContent: "space-around",
    padding: "9px 0 calc(13px + env(safe-area-inset-bottom, 0px))",
    flexShrink: 0,
    position: "sticky",
    bottom: 0,
    zIndex: 20,
  }}>
    {NAV_ITEMS.map(({ key, label, d, circle, pin, heart }) => {
      const on = active === key;
      const c = on ? T.brown : T.sub;
      return (
        <button key={key} onClick={() => onChange(key)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: c }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={heart && on ? c : "none"} stroke={c} strokeWidth="2" strokeLinecap="round">
            {d && <path d={d} />}
            {circle && <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>}
            {pin && <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>}
            {heart && <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />}
          </svg>
          <span style={{ fontSize: 11, fontWeight: on ? 700 : 400 }}>{label}</span>
        </button>
      );
    })}
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
const CafeCard = ({ cafe, onClick, fav, onFav, emptyCafeIds }) => (
  <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${T.beige}`, marginBottom: 12, overflow: "hidden", cursor: "pointer" }} onClick={onClick}>
    <div style={{ padding: "13px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ flex: 1, marginRight: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text, lineHeight: 1.3 }}>{cafe.name}</div>
          {cafe.mrt && <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>🚇 {cafe.mrt}</div>}
          <div style={{ fontSize: 11, color: T.sub, marginTop: 1 }}>📍 {cafe.address}</div>
        </div>
        <button onClick={e => { e.stopPropagation(); onFav(cafe.id); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0, flexShrink: 0 }}>
          {fav ? "⭐" : "☆"}
        </button>
      </div>

      {/* Score bars */}
      {cafe.wifi > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", marginBottom: 8 }}>
          {[["WiFi", cafe.wifi], ["安靜", cafe.quiet], ["咖啡", cafe.tasty], ["座位", cafe.seat]].map(([label, val]) =>
            val > 0 ? (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: T.sub, width: 28, flexShrink: 0 }}>{label}</span>
                {scoreBar(val)}
              </div>
            ) : null
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {temporaryClosureTag(cafe)}
        {limitedTag(cafe.limited_time)}
        {socketTag(cafe.socket)}
        {crowdTagFromIds(cafe.id, emptyCafeIds)}
        {cafe.open_time && <Tag label={`🕐 ${cafe.open_time.slice(0, 20)}${cafe.open_time.length > 20 ? "..." : ""}`} type="gray" />}
      </div>
    </div>
  </div>
);

// ── Page: Home ──
const HomePage = ({ cafes, loading, hasRegionSelection, onOpenRegionPicker, onSelect, favs, onFav, emptyCafeIds, filters, setFilters }) => {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activePresetKey, setActivePresetKey] = useState(null);

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
      const preset = FILTER_PRESETS.find((item) => item.key === activePresetKey);
      if (preset?.score) return preset.score(b) - preset.score(a);
      return workScore(b) - workScore(a);
    });

  const total = allFiltered.length;
  const start = (page - 1) * PER_PAGE;
  const filtered = allFiltered.slice(start, start + PER_PAGE);

  // Reset page when search changes
  useEffect(() => { setPage(1); }, [q]);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const activeFilterLabels = Object.entries(filters).filter(([, value]) => value).map(([key]) => FILTER_LABELS[key]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      <div style={{ flexShrink: 0, padding: "18px 16px 12px", background: T.cream, borderBottom: `1px solid ${T.beige}` }}>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A89880" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜尋店名、地址..."
            style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 12, border: "1px solid #C8BFB5", background: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box", color: T.text, fontWeight: 500 }} />
        </div>

        {!filtersOpen ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {activeFilterLabels.slice(0, 2).map((label) => (
              <FilterChip key={label} active={true} label={label} onClick={() => setFiltersOpen(true)} />
            ))}
            {activeFilterCount > 2 && (
              <span style={{ background: "#e7dccd", color: "#8a745f", borderRadius: 18, padding: "9px 14px", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>+{activeFilterCount - 2}</span>
            )}
            <button
              onClick={() => setFiltersOpen(true)}
              style={{ marginLeft: "auto", background: "none", border: "none", color: T.brown, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4, fontFamily: "inherit" }}
            >
              {activeFilterCount > 0 ? "篩選 ▾" : "篩選"}
            </button>
          </div>
        ) : (
          <>
            <FilterSection filters={filters} toggle={toggle} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setFiltersOpen(false)}
                style={{ background: "none", border: "none", color: T.brown, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4, fontFamily: "inherit" }}
              >
                收起篩選 ▴
              </button>
            </div>
          </>
        )}
      </div>

      {/* 滾動區：咖啡廳列表 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        {!hasRegionSelection && (
          <div style={{ margin: "12px 0", background: "#fff", border: `1px solid ${T.beige}`, borderRadius: 14, padding: "14px 14px 12px" }}>
            <div style={{ fontSize: 14, color: T.text, fontWeight: 700, marginBottom: 6 }}>先選一個地區開始看</div>
            <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.6, marginBottom: 10 }}>
              右上角可以切換地區。首頁先聚焦在單一城市，列表會比較清楚。
            </div>
            <button
              onClick={onOpenRegionPicker}
              style={{
                background: T.brown,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              選擇地區
            </button>
          </div>
        )}
        {hasRegionSelection && (
          <div style={{ margin: "14px 0 12px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 15, color: T.text, fontWeight: 700, marginBottom: 3 }}>依需求找咖啡廳</div>
                <div style={{ fontSize: 11.5, color: T.sub }}>快速套用常用情境篩選</div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => { setFilters({ ...DEFAULT_HOME_FILTERS }); setActivePresetKey(null); setPage(1); }}
                  style={{ background: "none", border: "none", color: T.brown, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  清除
                </button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {FILTER_PRESETS.map((preset) => {
                const active = isPresetActive(preset.filters);
                return (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    style={{
                      background: active ? T.brown : "#fff",
                      color: active ? "#fff" : T.text,
                      border: `1px solid ${active ? T.brown : T.beige}`,
                      borderRadius: 14,
                      padding: "11px 12px",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      boxShadow: active ? "none" : "0 8px 20px rgba(92,61,46,0.05)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{preset.title}</div>
                    <div style={{ fontSize: 11, color: active ? "rgba(255,255,255,0.78)" : T.sub, lineHeight: 1.35 }}>{preset.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.sub }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>☕</div>
            <div>載入中...</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, color: T.sub, margin: "10px 0 12px" }}>共 {total} 間{total > PER_PAGE ? `（顯示第 ${start + 1}-${Math.min(start + PER_PAGE, total)} 間）` : ""}</div>
            {filtered.map(c => <CafeCard key={c.id} cafe={c} onClick={() => onSelect(c)} fav={favs.has(c.id)} onFav={onFav} emptyCafeIds={emptyCafeIds} />)}
            {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: T.sub }}>找不到符合條件的咖啡廳</div>}
            <Pagination page={page} total={total} onPage={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

// ── Page: Nearby ──
const SearchPage = ({ cafes, loading, onSelect, favs, onFav }) => {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const requestedLocation = useRef(false);

  const requestSortLocation = useCallback(() => {
    setLocationError("");
    if (!navigator.geolocation || !window.isSecureContext) {
      setLocationError("目前瀏覽器無法使用定位。");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setLocationError("無法取得位置，先用預設排序。");
        setLocationLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  const allSorted = cafes
    .filter(isOpen)
    .filter(c => !q || c.name.includes(q) || c.address.includes(q) || (c.mrt && c.mrt.includes(q)))
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

  useEffect(() => { setPage(1); }, [q]);
  useEffect(() => {
    if (requestedLocation.current) return;
    requestedLocation.current = true;
    requestSortLocation();
  }, [requestSortLocation]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      {/* 固定區 */}
      <div style={{ flexShrink: 0, padding: "14px 16px 0", background: T.cream, borderBottom: `1px solid ${T.beige}` }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 10, color: T.text }}>附近咖啡廳</div>
        <div style={{ position: "relative", marginBottom: 14 }}>
          <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜尋..."
            style={{ width: "100%", padding: "9px 14px 9px 34px", borderRadius: 22, border: `1px solid ${T.beige}`, background: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box", color: T.text }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button
            onClick={requestSortLocation}
            disabled={locationLoading}
            style={{
              border: `1px solid ${userLocation ? T.brown : T.beige}`,
              background: userLocation ? T.brown : "#fff",
              color: userLocation ? "#fff" : T.sub,
              borderRadius: 12,
              padding: "9px 12px",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: locationLoading ? "default" : "pointer",
              opacity: locationLoading ? 0.7 : 1,
            }}
          >
            {locationLoading ? "定位中..." : userLocation ? "重新定位" : "使用目前位置"}
          </button>
        </div>
        {locationError && <div style={{ fontSize: 11, color: "#9b2335", marginBottom: 10 }}>{locationError}</div>}
      </div>

      {/* 滾動區 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        <div style={{ fontSize: 12, color: T.sub, margin: "10px 0" }}>
          {userLocation ? "依距離由近到遠" : locationLoading ? "正在取得目前位置" : "開啟定位後可查看附近咖啡廳"}・共 {total} 間{total > PER_PAGE ? `（第 ${start + 1}-${Math.min(start + PER_PAGE, total)} 間）` : ""}
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.sub }}><div style={{ fontSize: 32, marginBottom: 10 }}>☕</div><div>載入中...</div></div>
        ) : (
          <>
            {sorted.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                {userLocation && (
                  <div style={{ width: 42, minHeight: 24, borderRadius: 14, background: T.beige, color: T.sub, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 700, flexShrink: 0, marginTop: 14, padding: "3px 5px", textAlign: "center", lineHeight: 1.15 }}>
                    {formatDistance(c._distanceKm)}
                  </div>
                )}
                <div style={{ flex: 1 }}><CafeCard cafe={c} onClick={() => onSelect(c)} fav={favs.has(c.id)} onFav={onFav} emptyCafeIds={new Set()} /></div>
              </div>
            ))}
            {sorted.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: T.sub }}>找不到符合條件的咖啡廳</div>}
            <Pagination page={page} total={total} onPage={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

// ── Page: Favorites ──
const FavoritesPage = ({ cafes, favs, onSelect, onFav }) => {
  const list = cafes.filter(isOpen).filter(c => favs.has(c.id));
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      {/* 固定區 */}
      <div style={{ flexShrink: 0, padding: "14px 16px 4px", background: T.cream, borderBottom: `1px solid ${T.beige}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 20 }}>❤️</span>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text }}>我的收藏</div>
        </div>
      </div>

      {/* 滾動區 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        <div style={{ fontSize: 12, color: T.sub, margin: "10px 0" }}>已收藏 {list.length} 間</div>
        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.sub }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>☕</div>
            <div>還沒有收藏</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>點擊 ☆ 加入收藏</div>
          </div>
        ) : list.map(c => <CafeCard key={c.id} cafe={c} onClick={() => onSelect(c)} fav={true} onFav={onFav} emptyCafeIds={new Set()} />)}
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
  iconUrl: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><circle cx='12' cy='12' r='8' fill='%234285F4' stroke='white' stroke-width='3'/></svg>`),
  iconSize: [24, 24], iconAnchor: [12, 12],
});

const stationIcon = new L.Icon({
  iconUrl: "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='42' viewBox='0 0 30 42'>
      <path d='M15 1C8 1 2.5 6.5 2.5 13.4c0 10.2 12.5 27.6 12.5 27.6s12.5-17.4 12.5-27.6C27.5 6.5 22 1 15 1z' fill='#C84C31' stroke='white' stroke-width='2'/>
      <circle cx='15' cy='14' r='8' fill='white'/>
      <path d='M10 12h10v5a5 5 0 0 1-10 0z' fill='#C84C31'/>
      <rect x='12.5' y='18' width='1.6' height='5' rx='0.8' fill='#C84C31'/>
      <rect x='15.9' y='18' width='1.6' height='5' rx='0.8' fill='#C84C31'/>
      <circle cx='12.5' cy='14' r='1' fill='white'/>
      <circle cx='17.5' cy='14' r='1' fill='white'/>
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
      timeout: 12000,
      maximumAge: 300000,
    });
  }, [map, onStart, onSuccess, onError, request]);

  return null;
};

const MapPage = ({ cafes, loading, onSelect, mapView, setMapView, mapQuery, setMapQuery }) => {
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
  const hasAutoLocatedRef = useRef(false);
  const lastSearchQueryRef = useRef("");
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
      if (!silent) setLocateError("目前瀏覽器不支援定位。");
      return;
    }
    if (!window.isSecureContext) {
      if (!silent) setLocateError("定位需要在 HTTPS 或 localhost 環境下使用。");
      return;
    }

    setLocating(true);
    if (!silent) setLocateError("");
    setLocateRequest(prev => ({ seq: prev.seq + 1, zoom, mode }));
  }, []);

  const closeSearchPopup = useCallback(() => {
    setSearchPopupCafeId(null);
    if (mapRef.current) {
      mapRef.current.closePopup();
    }
  }, []);

  const handleLocateStart = useCallback(() => {
    if (mapRef.current) mapRef.current.invalidateSize();
  }, []);

  const handleLocateSuccess = useCallback((pos) => {
    setUserPos(pos);
    setLocating(false);
    setLocateError("");
  }, []);

  const handleLocateError = useCallback((err) => {
    const code = err?.code;
    if (code === 1) {
      setLocateError("定位權限被拒絕，請在瀏覽器允許位置權限後再試一次。");
    } else if (code === 3) {
      setLocateError("定位逾時，請移動到訊號較好的地方再試一次。");
    } else {
      setLocateError("目前無法取得位置，請稍後再試。");
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

  const flyTarget = searchTarget || geoTarget;

  // Use saved map view or default
  const defaultCenter = mapView.center || (allMapCafes.length > 0
    ? [parseFloat(allMapCafes[0].latitude), parseFloat(allMapCafes[0].longitude)]
    : [25.033, 121.5654]);
  const defaultZoom = mapView.zoom || 14;

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 16px 6px" }}>
        <div style={{ fontSize: 12, color: T.sub }}>{loading ? "載入全台資料..." : `${visibleMapCafes.length} 間咖啡廳`}</div>
      </div>

      {/* Search */}
      <div style={{ padding: "0 16px 8px", position: "relative", width: "100%", boxSizing: "border-box" }}>
        <svg style={{ position: "absolute", left: 27, top: "50%", transform: "translateY(-60%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input value={mapQuery} onFocus={closeSearchPopup} onClick={closeSearchPopup} onChange={e => setMapQuery(e.target.value)} placeholder="搜尋店名、地址、捷運站..."
          style={{ width: "100%", padding: "9px 14px 9px 34px", borderRadius: 22, border: `1px solid ${T.beige}`, background: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box", color: T.text }} />
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
          {userPos && <Marker position={userPos} icon={userIcon}>
            <Popup><span style={{ fontSize: 13, fontWeight: 700 }}>📍 你的位置</span></Popup>
          </Marker>}
          {searchMarker && (
            <Marker position={searchMarker.position} icon={stationIcon}>
              <Popup className="map-popup" minWidth={160} maxWidth={220} autoPan={false}>
                <div style={{ fontFamily: "-apple-system, 'PingFang TC', sans-serif" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: T.text }}>🚇 搜尋站點</div>
                  <div style={{ fontSize: 11, color: T.sub }}>{searchMarker.label}</div>
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
                <div style={{ fontFamily: "-apple-system, 'PingFang TC', sans-serif" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: T.text }}>{c.name}</div>
                  {c.mrt && <div style={{ fontSize: 11, color: T.sub, marginBottom: 2 }}>🚇 {c.mrt}</div>}
                  <div style={{ fontSize: 11, color: T.sub, marginBottom: 6 }}>📍 {c.address}</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                    {temporaryClosureTag(c)}
                    {c.wifi > 0 && <span style={{ fontSize: 11, background: T.beige, borderRadius: 10, padding: "2px 7px" }}>📶 {c.wifi.toFixed(1)}</span>}
                    {c.quiet > 0 && <span style={{ fontSize: 11, background: T.beige, borderRadius: 10, padding: "2px 7px" }}>🔇 {c.quiet.toFixed(1)}</span>}
                    {c.limited_time === "no" && <span style={{ fontSize: 11, background: T.green, color: "#fff", borderRadius: 10, padding: "2px 7px" }}>✓ 不限時</span>}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelect(c); }}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      background: T.brown,
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    查看詳情
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Locate me button */}
        <button
          onClick={() => {
            setLocateError("");
            requestUserLocation({ silent: false, zoom: 15, mode: "manual" });
          }}
          disabled={locating}
          style={{
            position: "absolute", bottom: 20, right: 16, zIndex: 1000,
            width: 40, height: 40, borderRadius: "50%",
            background: "#fff", border: `1px solid ${T.beige}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: locating ? "default" : "pointer",
            opacity: locating ? 0.7 : 1,
          }}
          title={locating ? "定位中..." : "回到我的位置"}
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
            maxWidth: 260, background: "#fff", color: T.text, border: `1px solid ${T.beige}`,
            borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", padding: "8px 10px",
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
const CrowdReport = ({ cafeId, onReport }) => {
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
    empty: "🟢 很空，快來",
    normal: "🟡 普通",
    crowded: "🔴 很擠，慎入",
  };

  const buttons = (
    <div style={{ display: "flex", gap: 8 }}>
      {[["empty","🟢 很空"],["normal","🟡 普通"],["crowded","🔴 很擠"]].map(([val, label]) => (
        <button key={val} onClick={() => handleReport(val)} style={{
          flex: 1, padding: "10px 4px", borderRadius: 10, border: `1px solid ${T.beige}`,
          background: T.cream, fontSize: 12, cursor: "pointer", fontFamily: "inherit"
        }}>{label}</button>
      ))}
    </div>
  );

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${T.beige}`, padding: 16, marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 10 }}>現在人多嗎？</div>
      {loading ? (
        <div style={{ fontSize: 12, color: T.sub }}>載入中...</div>
      ) : submitted && !editing ? (
        <>
          <div style={{ fontSize: 13, color: T.green, marginBottom: 4 }}>✅ 感謝你的回報！</div>
          <div style={{ fontSize: 13, color: T.text, marginBottom: 8 }}>{statusLabel[report?.status]}</div>
          <button onClick={() => setEditing(true)} style={{ fontSize: 12, color: T.brown, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>更新回報</button>
        </>
      ) : editing || !report ? (
        <>
          {editing && <div style={{ fontSize: 12, color: T.sub, marginBottom: 8 }}>選擇目前狀況：</div>}
          {buttons}
        </>
      ) : (
        <>
          <div style={{ fontSize: 14, color: T.text, marginBottom: 6 }}>{statusLabel[report.status]}</div>
          <div style={{ fontSize: 11, color: T.sub, marginBottom: 10 }}>{timeAgo(report.reported_at)}</div>
          <button onClick={() => setEditing(true)} style={{ fontSize: 12, color: T.brown, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>更新回報</button>
        </>
      )}
    </div>
  );
};

// ── Page: Detail ──
const DetailPage = ({ cafe, onBack, fav, onFav, onReport, emptyCafeIds, onFilterTag, canManageCafe, onHideCafe }) => {
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
      setHideError(error.message || "目前無法隱藏這家店，請稍後再試。");
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
      <div style={{ background: T.brown, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, flex: 1 }}>{cafe.name}</span>
        <button onClick={() => onFav(cafe.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>{fav ? "⭐" : "☆"}</button>
      </div>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: T.text }}>
            {cafe.name}
          </div>
          {cafe.url && (
            <a href={cafe.url} target="_blank" rel="noreferrer" style={{ color: T.sub, fontSize: 13, lineHeight: 1, textDecoration: "none" }}>
              🔗
            </a>
          )}
        </div>
        {cafe.mrt && <div style={{ fontSize: 13, color: T.sub, marginBottom: 3 }}>🚇 {cafe.mrt}</div>}
        <div style={{ fontSize: 13, color: T.sub, marginBottom: 12 }}>📍 {cafe.address}</div>
        {cafe.google_business_note && <div style={{ fontSize: 13, color: "#b7791f", marginBottom: 8, fontWeight: 600 }}>⏸ {cafe.google_business_note}</div>}
        {cafe.open_time && <div style={{ fontSize: 13, color: T.text, marginBottom: 8 }}>🕐 {cafe.open_time}</div>}

        <CrowdReport cafeId={cafe.id} onReport={onReport} />

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {temporaryClosureTag(cafe)}
          {limitedTag(cafe.limited_time, applyTagFilter("noLimit"))}
          {socketTag(cafe.socket, applyTagFilter("socket"))}
          {cafe.standing_desk === "yes" && <Tag label="站立桌" type="gray" onClick={applyTagFilter("standing")} />}
          {crowdTagFromIds(cafe.id, emptyCafeIds, applyTagFilter("empty"))}
        </div>

        {cafe.wifi > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${T.beige}`, padding: 16, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 12, color: T.text }}>環境評分</div>
            {[
              ["📶 WiFi 穩定", cafe.wifi, cafe.wifi >= 4 ? "wifi" : null],
              ["🔇 安靜程度", cafe.quiet, cafe.quiet >= 4 ? "quiet" : null],
              ["☕ 咖啡好喝", cafe.tasty, cafe.tasty >= 4 ? "tasty" : null],
              ["💺 通常有位", cafe.seat, null],
              ["💰 價格便宜", cafe.cheap, cafe.cheap >= 4 ? "cheap" : null],
              ["🎵 裝潢音樂", cafe.music, cafe.music >= 4 ? "music" : null],
            ].map(([label, val, filterKey]) =>
              val > 0 ? (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  {filterKey ? (
                    <button
                      type="button"
                      onClick={applyTagFilter(filterKey)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        textAlign: "left",
                        fontSize: 13,
                        color: T.text,
                        width: 90,
                        flexShrink: 0,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </button>
                  ) : (
                    <span style={{ fontSize: 13, color: T.text, width: 90, flexShrink: 0 }}>{label}</span>
                  )}
                  {scoreBar(val)}
                </div>
              ) : null
            )}
          </div>
        )}

        {cafe.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cafe.name} ${cafe.address}`)}`}
            target="_blank"
            rel="noreferrer"
            style={{ display: "block", background: "#4285F4", color: "#fff", borderRadius: 10, padding: "12px", textAlign: "center", textDecoration: "none", fontSize: 14, fontWeight: 700, marginBottom: 10 }}
          >
            📍 在 Google Maps 開啟
          </a>
        )}
        {canManageCafe && (
          <>
            <button
              onClick={handleHideCafe}
              disabled={hideBusy}
              style={{
                display: "block",
                width: "100%",
                background: "#fff",
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
              {hideBusy ? "處理中..." : "🙈 隱藏這家店"}
            </button>
            {hideError && <div style={{ fontSize: 12, color: "#9b2335", marginBottom: 10 }}>{hideError}</div>}
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
      setAuthMessage("即將跳轉到 Google 完成登入。");
    } catch (error) {
      setAuthError(error.message || "目前無法登入，請稍後再試。");
    } finally {
      if (redirectStarted) return;
      window.setTimeout(() => {
        setAuthBusy(false);
      }, 0);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    setAuthBusy(true);
    setAuthError("");
    setAuthMessage("");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAuthMessage("已登出。");
    } catch (error) {
      setAuthError(error.message || "目前無法登出，請稍後再試。");
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const handleHideCafe = useCallback(async (cafe) => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    const session = data.session;
    const email = session?.user?.email || "";
    if (!session?.access_token || email !== ADMIN_EMAIL) {
      throw new Error("只有管理帳號可以隱藏店家。");
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
  }, [fetchAllCafes]);

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
      options.push({ key: group.key, label: group.label });
    });
    return options;
  }, [countryScopedCafes, selectedCountry.key]);
  const regionOptionKeys = useMemo(() => new Set(availableRegions.map((item) => item.key)), [availableRegions]);
  const hasRegionSelection = region !== REGION_PROMPT_KEY;
  const regionLabel = region === REGION_PROMPT_KEY
    ? "請選擇地區"
    : (availableRegions.find((item) => item.key === region)?.label || "請選擇地區");
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
    if (selected) return <DetailPage cafe={selected} onBack={() => setSelected(null)} fav={favoriteLookup.has(selected.id)} onFav={toggleFav} onReport={handleReportAndUpdateMap} emptyCafeIds={emptyCafeIds} onFilterTag={handleDetailTagFilter} canManageCafe={isAdminUser} onHideCafe={handleHideCafe} />;
    switch (tab) {
      case "home": return <HomePage cafes={homeCafes} loading={loading} hasRegionSelection={hasRegionSelection} onOpenRegionPicker={() => setMenuOpen(true)} onSelect={setSelected} favs={favoriteLookup} onFav={toggleFav} emptyCafeIds={emptyCafeIds} filters={homeFilters} setFilters={setHomeFilters} />;
      case "search": return <SearchPage cafes={searchCafes} loading={loading} onSelect={setSelected} favs={favoriteLookup} onFav={toggleFav} />;
      case "map": return <MapPage cafes={countryScopedCafes} onSelect={setSelected} mapView={mapView} setMapView={setMapView} mapQuery={mapQuery} setMapQuery={setMapQuery} loading={loading} />;
      case "favorites": return <FavoritesPage cafes={favoritesCafes} favs={favoriteLookup} onSelect={setSelected} onFav={toggleFav} />;
      default: return null;
    }
  };

  const headerSubtitle = tab === "map" || tab === "favorites"
    ? ""
    : hasRegionSelection
      ? `📍 ${regionLabel}・${homeCafes.filter(isOpen).length} 間`
      : `📍 ${selectedCountry.label}・請選擇地區`;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');html,body,#root{height:100%}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,'PingFang TC',sans-serif;background:#f0ebe4}input::placeholder{color:#A89880;opacity:1}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${T.beige};border-radius:3px}.map-popup .leaflet-popup-content-wrapper{border-radius:14px}.map-popup .leaflet-popup-content{margin:10px 12px;min-width:0 !important;width:min(220px,calc(100vw - 88px)) !important}.map-popup .leaflet-popup-close-button{padding:8px 10px 0 0;font-size:18px}`}</style>
      <div style={{ maxWidth: 430, margin: "0 auto", width: "100%", height: "100svh", minHeight: "100dvh", display: "flex", flexDirection: "column", background: T.cream, overflow: "hidden", boxShadow: "0 0 40px rgba(0,0,0,0.15)" }}>
        {!selected && <Header cityLabel={hasRegionSelection ? regionLabel : selectedCountry.label} subtitle={headerSubtitle} onOpenMenu={() => setMenuOpen(true)} />}
        {selected ? (
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {renderPage()}
          </div>
        ) : (
          <SwipeBackShell enabled={tabHistory.length > 0} onBack={handleTabBack}>
            {renderPage()}
          </SwipeBackShell>
        )}
        {!selected && <BottomNav active={tab} onChange={handleTabChange} />}
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
          />
        )}
      </div>
    </>
  );
}
