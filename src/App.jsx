import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SUPABASE_URL = "https://dmymcnmsyhppwstpwmal.supabase.co";
const SUPABASE_KEY = "sb_publishable_2mlstxr8qtRrybaIyBIB8Q_oS_Im60Q";

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
const MAP_CACHE_KEY = "cafe-voyage:map-cafes";
const MAP_CACHE_TTL = 1000 * 60 * 60 * 12;
const REGION_PATTERN = /(台北市|新北市|桃園市|台中市|臺中市|台南市|臺南市|高雄市|基隆市|新竹市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義市|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|臺東縣)/;
const REGION_GROUPS = [
  { key: "taipei", label: "台北", members: ["台北市", "新北市"] },
  { key: "taichung", label: "台中", members: ["台中市"] },
  { key: "tainan", label: "台南", members: ["台南市"] },
  { key: "kaohsiung", label: "高雄", members: ["高雄市"] },
  { key: "chiayi", label: "嘉義", members: ["嘉義市", "嘉義縣"] },
  { key: "hsinchu", label: "新竹", members: ["新竹市", "新竹縣"] },
  { key: "taoyuan", label: "桃園", members: ["桃園市"] },
  { key: "keelung", label: "基隆", members: ["基隆市"] },
  { key: "miaoli", label: "苗栗", members: ["苗栗縣"] },
  { key: "changhua", label: "彰化", members: ["彰化縣"] },
  { key: "nantou", label: "南投", members: ["南投縣"] },
  { key: "yunlin", label: "雲林", members: ["雲林縣"] },
  { key: "pingtung", label: "屏東", members: ["屏東縣"] },
  { key: "yilan", label: "宜蘭", members: ["宜蘭縣"] },
  { key: "hualien", label: "花蓮", members: ["花蓮縣"] },
  { key: "taitung", label: "台東", members: ["台東縣"] },
];

const normalizeRegionLabel = (label = "") => label
  .replace("臺中市", "台中市")
  .replace("臺南市", "台南市")
  .replace("臺東縣", "台東縣");

const findRegionGroup = (regionLabel = "") =>
  REGION_GROUPS.find((group) => group.members.includes(regionLabel)) || null;

const getCafeRegion = (cafe) => {
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

const Tag = ({ label, type = "green" }) => {
  const styles = {
    green: { bg: T.green, color: "#fff" },
    amber: { bg: "#b7791f", color: "#fff" },
    red: { bg: "#9b2335", color: "#fff" },
    gray: { bg: T.beige, color: T.sub },
  };
  const s = styles[type] || styles.gray;
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 14, padding: "3px 10px", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
};

const limitedTag = (v) => {
  if (v === "no") return <Tag label="✓ 不限時" type="green" />;
  if (v === "maybe") return <Tag label="△ 假日限時" type="amber" />;
  if (v === "yes") return <Tag label="✗ 有限時" type="red" />;
  return null;
};

const socketTag = (v) => {
  if (v === "yes") return <Tag label="⚡ 插座多" type="green" />;
  if (v === "maybe") return <Tag label="⚡ 插座少" type="amber" />;
  return null;
};

// ── Crowd helpers ──
const crowdTagFromIds = (cafeId, emptyCafeIds) => {
  if (emptyCafeIds && emptyCafeIds.has && emptyCafeIds.has(cafeId)) {
    return <Tag label="🟢 很空" type="green" />;
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
  empty: "目前人少",
};

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

// ── Header ──
const Header = ({ title = "Cafe Voyage", cityLabel, subtitle, onOpenMenu }) => (
  <div style={{ background: T.brown, padding: "18px 22px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
    <div>
      <div style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, letterSpacing: 0.3 }}>{title}</div>
      <div style={{ color: "#f1e5d6", fontSize: 12, marginTop: 5 }}>{subtitle || cityLabel}</div>
    </div>
    <button onClick={onOpenMenu} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  </div>
);

const SettingsPanel = ({ open, region, regionOptions, setRegion, onClose }) => {
  if (!open) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 40, background: "rgba(32, 24, 18, 0.26)" }} onClick={onClose}>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "min(86vw, 320px)",
          height: "100%",
          background: "#fffaf4",
          boxShadow: "-18px 0 40px rgba(0,0,0,0.18)",
          padding: "20px 18px calc(24px + env(safe-area-inset-bottom, 0px))",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text }}>設定</div>
            <div style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>帳號與城市偏好</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.sub, fontSize: 24, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ background: "#fff", border: `1px solid ${T.beige}`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 10 }}>User</div>
          <button style={{ width: "100%", background: T.brown, color: "#fff", border: "none", borderRadius: 10, padding: "12px 14px", textAlign: "left", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Login
          </button>
          <div style={{ fontSize: 11, color: T.sub, marginTop: 8 }}>先預留登入入口，之後可接 Supabase Auth。</div>
        </div>

        <div style={{ background: "#fff", border: `1px solid ${T.beige}`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 10 }}>地區選擇</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {regionOptions.map((item) => (
              <button
                key={item.key}
                onClick={() => { setRegion(item.key); onClose(); }}
                style={{
                  background: region === item.key ? T.brown : T.cream,
                  color: region === item.key ? "#fff" : T.text,
                  border: `1px solid ${region === item.key ? T.brown : T.beige}`,
                  borderRadius: 16,
                  padding: "7px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: region === item.key ? 700 : 500,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Bottom Nav ──
const NAV_ITEMS = [
  { key: "home", label: "首頁", d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
  { key: "search", label: "搜索", circle: true },
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
        {limitedTag(cafe.limited_time)}
        {socketTag(cafe.socket)}
        {crowdTagFromIds(cafe.id, emptyCafeIds)}
        {cafe.open_time && <Tag label={`🕐 ${cafe.open_time.slice(0, 20)}${cafe.open_time.length > 20 ? "..." : ""}`} type="gray" />}
      </div>
    </div>
  </div>
);

// ── Page: Home ──
const HomePage = ({ cafes, loading, hasRegionSelection, onOpenRegionPicker, onSelect, favs, onFav, emptyCafeIds }) => {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    noLimit: true, socket: false, standing: false,
    wifi: true, quiet: false, tasty: false, cheap: false,
    empty: false,
  });

  const toggle = (key) => { setFilters(prev => ({ ...prev, [key]: !prev[key] })); setPage(1); };

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
    .filter(c => !filters.empty || emptyCafeIds.has(c.id));

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
              篩選 ▾
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

// ── Page: Search (sorted by wifi+quiet) ──
const SearchPage = ({ cafes, loading, onSelect, favs, onFav }) => {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const allSorted = cafes
    .filter(isOpen)
    .filter(c => c.wifi > 0 || c.quiet > 0)
    .filter(c => !q || c.name.includes(q) || c.address.includes(q) || (c.mrt && c.mrt.includes(q)))
    .sort((a, b) => (b.wifi + b.quiet + b.tasty) - (a.wifi + a.quiet + a.tasty));

  const total = allSorted.length;
  const start = (page - 1) * PER_PAGE;
  const sorted = allSorted.slice(start, start + PER_PAGE);

  useEffect(() => { setPage(1); }, [q]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      {/* 固定區 */}
      <div style={{ flexShrink: 0, padding: "14px 16px 0", background: T.cream, borderBottom: `1px solid ${T.beige}` }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 10, color: T.text }}>工作友善排行</div>
        <div style={{ position: "relative", marginBottom: 14 }}>
          <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜尋..."
            style={{ width: "100%", padding: "9px 14px 9px 34px", borderRadius: 22, border: `1px solid ${T.beige}`, background: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box", color: T.text }} />
        </div>
      </div>

      {/* 滾動區 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        <div style={{ fontSize: 12, color: T.sub, margin: "10px 0" }}>依 WiFi + 安靜 + 咖啡 綜合排序・共 {total} 間{total > PER_PAGE ? `（第 ${start + 1}-${Math.min(start + PER_PAGE, total)} 間）` : ""}</div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.sub }}><div style={{ fontSize: 32, marginBottom: 10 }}>☕</div><div>載入中...</div></div>
        ) : (
          <>
            {sorted.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: (start + i) < 3 ? T.brown : T.beige, color: (start + i) < 3 ? "#fff" : T.sub, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 14 }}>{start + i + 1}</div>
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

// ── Page: Map ──
const FlyTo = ({ center, zoom, offsetY = 0 }) => {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    const targetZoom = typeof zoom === "number" ? zoom : map.getZoom();
    if (!offsetY) {
      map.flyTo(center, targetZoom, { duration: 0.8 });
      return;
    }
    const targetPoint = map.project(center, targetZoom).subtract([0, offsetY]);
    const adjustedCenter = map.unproject(targetPoint, targetZoom);
    map.flyTo(adjustedCenter, targetZoom, { duration: 0.8 });
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

const DismissMapSelection = ({ onDismiss }) => {
  useMapEvents({
    click() {
      onDismiss();
    },
  });

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
  const [activeMapCafe, setActiveMapCafe] = useState(null);
  const [locateRequest, setLocateRequest] = useState({ seq: 0, zoom: 15, mode: "auto" });
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");
  const [visibleBounds, setVisibleBounds] = useState(null);
  const mapRef = useRef(null);
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
    setActiveMapCafe(null);
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
      lastSearchQueryRef.current = "";
      return;
    }
    if (lastSearchQueryRef.current === mapQuery) return;
    lastSearchQueryRef.current = mapQuery;

    if (searchMatches.length > 0) {
      setGeoTarget(null);
      setSearchTarget([parseFloat(searchMatches[0].latitude), parseFloat(searchMatches[0].longitude)]);
      return;
    }

    setSearchTarget(null);
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
        }
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [mapQuery, searchMatches]);

  const flyTarget = searchTarget || geoTarget;

  // Use saved map view or default
  const defaultCenter = mapView.center || (allMapCafes.length > 0
    ? [parseFloat(allMapCafes[0].latitude), parseFloat(allMapCafes[0].longitude)]
    : [25.033, 121.5654]);
  const defaultZoom = mapView.zoom || 14;

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 16px 6px" }}>
        <span style={{ fontSize: 20 }}>📍</span>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text }}>地圖</div>
        <div style={{ fontSize: 12, color: T.sub, marginLeft: "auto" }}>{loading ? "載入全台資料..." : `${visibleMapCafes.length} 間咖啡廳`}</div>
      </div>

      {/* Search */}
      <div style={{ padding: "0 16px 8px", position: "relative", width: "100%", boxSizing: "border-box" }}>
        <svg style={{ position: "absolute", left: 27, top: "50%", transform: "translateY(-60%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input value={mapQuery} onChange={e => setMapQuery(e.target.value)} placeholder="搜尋店名、地址、捷運站..."
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
          <DismissMapSelection onDismiss={() => setActiveMapCafe(null)} />
          <SaveMapView onMove={setMapView} onBoundsChange={setVisibleBounds} />
          {flyTarget && <FlyTo center={flyTarget} offsetY={120} />}
          {(!mapQuery || locateRequest.mode === "manual") && <FlyToBySignal center={userPos} seq={locateRequest.seq} zoom={locateRequest.zoom} />}
          {userPos && <Marker position={userPos} icon={userIcon}>
            <Popup><span style={{ fontSize: 13, fontWeight: 700 }}>📍 你的位置</span></Popup>
          </Marker>}
          {visibleMapCafes.map(c => (
            <Marker
              key={c.id}
              position={[parseFloat(c.latitude), parseFloat(c.longitude)]}
              icon={cafeIcon}
              eventHandlers={{
                click: () => setActiveMapCafe(c),
              }}
            />
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
            position: "absolute", bottom: activeMapCafe ? 192 : 20, right: 16, zIndex: 1000,
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
            position: "absolute", right: 16, bottom: activeMapCafe ? 240 : 68, zIndex: 1000,
            maxWidth: 260, background: "#fff", color: T.text, border: `1px solid ${T.beige}`,
            borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", padding: "8px 10px",
            fontSize: 12, lineHeight: 1.35,
          }}>
            {locateError}
          </div>
        )}
        {activeMapCafe && (
          <div
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              bottom: 16,
              zIndex: 1000,
              background: "#fff",
              border: `1px solid ${T.beige}`,
              borderRadius: 16,
              boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              padding: "14px 14px 12px",
            }}
          >
            <button
              onClick={() => setActiveMapCafe(null)}
              style={{
                position: "absolute",
                top: 8,
                right: 10,
                background: "none",
                border: "none",
                color: T.sub,
                fontSize: 24,
                lineHeight: 1,
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <div style={{ fontFamily: "-apple-system, 'PingFang TC', sans-serif" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: T.text, paddingRight: 24 }}>{activeMapCafe.name}</div>
              {activeMapCafe.mrt && <div style={{ fontSize: 11, color: T.sub, marginBottom: 2 }}>🚇 {activeMapCafe.mrt}</div>}
              <div style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>📍 {activeMapCafe.address}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                {activeMapCafe.wifi > 0 && <span style={{ fontSize: 11, background: T.beige, borderRadius: 10, padding: "2px 7px" }}>📶 {activeMapCafe.wifi.toFixed(1)}</span>}
                {activeMapCafe.quiet > 0 && <span style={{ fontSize: 11, background: T.beige, borderRadius: 10, padding: "2px 7px" }}>🔇 {activeMapCafe.quiet.toFixed(1)}</span>}
                {activeMapCafe.limited_time === "no" && <span style={{ fontSize: 11, background: T.green, color: "#fff", borderRadius: 10, padding: "2px 7px" }}>✓ 不限時</span>}
              </div>
              <button
                onClick={() => onSelect(activeMapCafe)}
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
const DetailPage = ({ cafe, onBack, fav, onFav, onReport }) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swipeActive = useRef(false);
  const [swipeX, setSwipeX] = useState(0);

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
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 4 }}>{cafe.name}</div>
        {cafe.mrt && <div style={{ fontSize: 13, color: T.sub, marginBottom: 3 }}>🚇 {cafe.mrt}</div>}
        <div style={{ fontSize: 13, color: T.sub, marginBottom: 12 }}>📍 {cafe.address}</div>
        {cafe.open_time && <div style={{ fontSize: 13, color: T.text, marginBottom: 8 }}>🕐 {cafe.open_time}</div>}

        <CrowdReport cafeId={cafe.id} onReport={onReport} />

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {limitedTag(cafe.limited_time)}
          {socketTag(cafe.socket)}
          {cafe.standing_desk === "yes" && <Tag label="站立桌" type="gray" />}
        </div>

        {cafe.wifi > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${T.beige}`, padding: 16, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 12, color: T.text }}>環境評分</div>
            {[["📶 WiFi 穩定", cafe.wifi], ["🔇 安靜程度", cafe.quiet], ["☕ 咖啡好喝", cafe.tasty], ["💺 通常有位", cafe.seat], ["💰 價格便宜", cafe.cheap], ["🎵 裝潢音樂", cafe.music]].map(([label, val]) =>
              val > 0 ? (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: T.text, width: 90, flexShrink: 0 }}>{label}</span>
                  {scoreBar(val)}
                </div>
              ) : null
            )}
          </div>
        )}

        {cafe.url && (
          <a href={cafe.url} target="_blank" rel="noreferrer" style={{ display: "block", background: T.green, color: "#fff", borderRadius: 10, padding: "12px", textAlign: "center", textDecoration: "none", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            🔗 前往官網
          </a>
        )}
        {cafe.address && (
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cafe.address)}`} target="_blank" rel="noreferrer" style={{ display: "block", background: T.brown, color: "#fff", borderRadius: 10, padding: "12px", textAlign: "center", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
            🧭 導航到這裡
          </a>
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
      const res = await fetch("/api/cafes");
      const data = await res.json();
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
    try {
      if (region === REGION_PROMPT_KEY) {
        localStorage.removeItem(REGION_STORAGE_KEY);
      } else {
        localStorage.setItem(REGION_STORAGE_KEY, region);
      }
    } catch {}
  }, [region]);

  const toggleFav = (id) => setFavs(prev => { const key = String(id); const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s; });
  const favoriteLookup = useMemo(() => ({ has: (id) => favs.has(String(id)) }), [favs]);
  const availableRegions = useMemo(() => {
    const seen = new Set();
    const options = [];
    allCafes.forEach((cafe) => {
      const groupKey = getCafeRegionGroupKey(cafe);
      if (!groupKey || seen.has(groupKey)) return;
      seen.add(groupKey);
    });
    REGION_GROUPS.forEach((group) => {
      if (!seen.has(group.key)) return;
      options.push({ key: group.key, label: group.label });
    });
    return options;
  }, [allCafes]);
  const regionOptionKeys = useMemo(() => new Set(availableRegions.map((item) => item.key)), [availableRegions]);
  const hasRegionSelection = region !== REGION_PROMPT_KEY;
  const regionLabel = region === REGION_PROMPT_KEY
    ? "請選擇縣市"
    : (availableRegions.find((item) => item.key === region)?.label || "請選擇縣市");
  const regionScopedCafes = useMemo(() => {
    if (region === REGION_PROMPT_KEY) return [];
    return allCafes.filter((cafe) => getCafeRegionGroupKey(cafe) === region);
  }, [allCafes, region]);
  const homeCafes = hasRegionSelection ? regionScopedCafes : [];
  const searchCafes = hasRegionSelection ? regionScopedCafes : allCafes;
  const favoritesCafes = hasRegionSelection ? regionScopedCafes : allCafes;

  useEffect(() => {
    if (region === REGION_PROMPT_KEY) return;
    if (availableRegions.length <= 1) return;
    if (regionOptionKeys.has(region)) return;
    setRegion(REGION_PROMPT_KEY);
  }, [availableRegions.length, region, regionOptionKeys]);

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

  const renderPage = () => {
    if (selected) return <DetailPage cafe={selected} onBack={() => setSelected(null)} fav={favoriteLookup.has(selected.id)} onFav={toggleFav} onReport={handleReportAndUpdateMap} />;
    switch (tab) {
      case "home": return <HomePage cafes={homeCafes} loading={loading} hasRegionSelection={hasRegionSelection} onOpenRegionPicker={() => setMenuOpen(true)} onSelect={setSelected} favs={favoriteLookup} onFav={toggleFav} emptyCafeIds={emptyCafeIds} />;
      case "search": return <SearchPage cafes={searchCafes} loading={loading} onSelect={setSelected} favs={favoriteLookup} onFav={toggleFav} />;
      case "map": return <MapPage cafes={allCafes} onSelect={setSelected} mapView={mapView} setMapView={setMapView} mapQuery={mapQuery} setMapQuery={setMapQuery} loading={loading} />;
      case "favorites": return <FavoritesPage cafes={favoritesCafes} favs={favoriteLookup} onSelect={setSelected} onFav={toggleFav} />;
      default: return null;
    }
  };

  const headerSubtitle = tab === "map"
    ? ""
    : hasRegionSelection
      ? `📍 ${regionLabel}・${homeCafes.filter(isOpen).length} 間`
      : "📍 從右上角選擇地區";

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');html,body,#root{height:100%}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,'PingFang TC',sans-serif;background:#f0ebe4}input::placeholder{color:#A89880;opacity:1}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${T.beige};border-radius:3px}.map-popup .leaflet-popup-content-wrapper{border-radius:14px}.map-popup .leaflet-popup-content{margin:10px 12px;min-width:0 !important;width:min(220px,calc(100vw - 88px)) !important}.map-popup .leaflet-popup-close-button{padding:8px 10px 0 0;font-size:18px}`}</style>
      <div style={{ maxWidth: 430, margin: "0 auto", width: "100%", height: "100svh", minHeight: "100dvh", display: "flex", flexDirection: "column", background: T.cream, overflow: "hidden", boxShadow: "0 0 40px rgba(0,0,0,0.15)" }}>
        {!selected && <Header cityLabel={regionLabel} subtitle={headerSubtitle} onOpenMenu={() => setMenuOpen(true)} />}
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
        {!selected && <SettingsPanel open={menuOpen} region={region} regionOptions={availableRegions} setRegion={handleRegionChange} onClose={() => setMenuOpen(false)} />}
      </div>
    </>
  );
}
