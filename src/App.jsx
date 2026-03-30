import { useState, useEffect, useCallback } from "react";

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
  return Object.keys(map).filter(id => map[id].status === "empty");
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

const CITIES = [
  { key: "taipei", label: "台北" }, { key: "taichung", label: "台中" },
  { key: "tainan", label: "台南" }, { key: "kaohsiung", label: "高雄" },
  { key: "hsinchu", label: "新竹" }, { key: "taoyuan", label: "桃園" },
  { key: "yilan", label: "宜蘭" }, { key: "hualien", label: "花蓮" },
  { key: "taitung", label: "台東" }, { key: "keelung", label: "基隆" },
];

// ── helpers ──
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
  if (emptyCafeIds && emptyCafeIds.includes(cafeId)) {
    return <Tag label="🟢 很空" type="green" />;
  }
  return null;
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
const Header = () => (
  <div style={{ background: T.brown, padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
    <div style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>☕ Cafe Voyage</div>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </div>
);

// ── Bottom Nav ──
const NAV_ITEMS = [
  { key: "home", label: "首頁", d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
  { key: "search", label: "搜索", circle: true },
  { key: "map", label: "地圖", pin: true },
  { key: "favorites", label: "收藏", heart: true },
];
const BottomNav = ({ active, onChange }) => (
  <div style={{ background: T.beige, borderTop: `1px solid ${T.brown}22`, display: "flex", justifyContent: "space-around", padding: "9px 0 13px", flexShrink: 0 }}>
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
const HomePage = ({ cafes, loading, city, setCity, onSelect, favs, onFav, emptyCafeIds }) => {
  const [q, setQ] = useState("");
  const [filterNoLimit, setFilterNoLimit] = useState(false);
  const [filterSocket, setFilterSocket] = useState(false);
  const [filterWifi, setFilterWifi] = useState(false);
  const [filterEmpty, setFilterEmpty] = useState(false);

  const filtered = cafes
    .filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.address.includes(q) || (c.mrt && c.mrt.includes(q)))
    .filter(c => !filterNoLimit || c.limited_time === "no")
    .filter(c => !filterSocket || c.socket === "yes" || c.socket === "maybe")
    .filter(c => !filterWifi || c.wifi >= 4)
    .filter(c => !filterEmpty || (emptyCafeIds && emptyCafeIds.includes(c.id)))
    .slice(0, 30);

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "0 16px 16px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "14px 0 10px", color: T.text }}>首頁</div>

      {/* City Selector */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 10 }}>
        {CITIES.map(c => (
          <button key={c.key} onClick={() => setCity(c.key)} style={{
            background: city === c.key ? T.brown : "#fff",
            color: city === c.key ? "#fff" : T.text,
            border: `1px solid ${T.beige}`, borderRadius: 16,
            padding: "5px 13px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
            fontWeight: city === c.key ? 700 : 400, flexShrink: 0,
          }}>{c.label}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜尋店名、地址、捷運站..."
          style={{ width: "100%", padding: "9px 14px 9px 34px", borderRadius: 22, border: `1px solid ${T.beige}`, background: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box", color: T.text }} />
      </div>

      {/* Quick Filters */}
      <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
        {[["不限時", filterNoLimit, setFilterNoLimit], ["插座多", filterSocket, setFilterSocket], ["WiFi 穩", filterWifi, setFilterWifi], ["人少", filterEmpty, setFilterEmpty]].map(([label, active, set]) => (
          <button key={label} onClick={() => set(!active)} style={{
            background: active ? T.green : T.beige, color: active ? "#fff" : T.sub,
            border: "none", borderRadius: 16, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: active ? 700 : 400,
          }}>{active ? "✓ " : ""}{label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: T.sub }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>☕</div>
          <div>載入中...</div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 10 }}>共 {filtered.length} 間咖啡廳</div>
          {filtered.map(c => <CafeCard key={c.id} cafe={c} onClick={() => onSelect(c)} fav={favs.has(c.id)} onFav={onFav} emptyCafeIds={emptyCafeIds} />)}
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: T.sub }}>找不到符合條件的咖啡廳</div>}
        </>
      )}
    </div>
  );
};

// ── Page: Search (sorted by wifi+quiet) ──
const SearchPage = ({ cafes, loading, onSelect, favs, onFav }) => {
  const [q, setQ] = useState("");
  const sorted = cafes
    .filter(c => c.wifi > 0 || c.quiet > 0)
    .filter(c => !q || c.name.includes(q) || c.address.includes(q) || (c.mrt && c.mrt.includes(q)))
    .sort((a, b) => (b.wifi + b.quiet + b.tasty) - (a.wifi + a.quiet + a.tasty))
    .slice(0, 30);

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "0 16px 16px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "14px 0 10px", color: T.text }}>工作友善排行</div>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.sub} strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜尋..."
          style={{ width: "100%", padding: "9px 14px 9px 34px", borderRadius: 22, border: `1px solid ${T.beige}`, background: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box", color: T.text }} />
      </div>
      <div style={{ fontSize: 12, color: T.sub, marginBottom: 10 }}>依 WiFi + 安靜 + 咖啡 綜合排序</div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: T.sub }}><div style={{ fontSize: 32, marginBottom: 10 }}>☕</div><div>載入中...</div></div>
      ) : sorted.map((c, i) => (
        <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: i < 3 ? T.brown : T.beige, color: i < 3 ? "#fff" : T.sub, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 14 }}>{i + 1}</div>
          <div style={{ flex: 1 }}><CafeCard cafe={c} onClick={() => onSelect(c)} fav={favs.has(c.id)} onFav={onFav} emptyCafeIds={[]} /></div>
        </div>
      ))}
    </div>
  );
};

// ── Page: Favorites ──
const FavoritesPage = ({ cafes, favs, onSelect, onFav }) => {
  const list = cafes.filter(c => favs.has(c.id));
  return (
    <div style={{ flex: 1, overflow: "auto", padding: "0 16px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "14px 0 4px" }}>
        <span style={{ fontSize: 20 }}>❤️</span>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text }}>我的收藏</div>
      </div>
      <div style={{ fontSize: 12, color: T.sub, marginBottom: 12 }}>已收藏 {list.length} 間</div>
      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: T.sub }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>☕</div>
          <div>還沒有收藏</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>點擊 ☆ 加入收藏</div>
        </div>
      ) : list.map(c => <CafeCard key={c.id} cafe={c} onClick={() => onSelect(c)} fav={true} onFav={onFav} emptyCafeIds={[]} />)}
    </div>
  );
};

// ── Page: Map placeholder ──
const MapPage = ({ cafes, onSelect }) => {
  const top = cafes.filter(c => c.latitude && c.wifi > 3).slice(0, 5);
  return (
    <div style={{ flex: 1, overflow: "auto", padding: "0 16px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "14px 0 12px" }}>
        <span style={{ fontSize: 20 }}>📍</span>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text }}>地圖</div>
      </div>
      <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 16, background: "linear-gradient(135deg,#2d3a4a,#1a2535)", height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", position: "relative" }}>
        <div style={{ fontSize: 34, marginBottom: 6 }}>🗺️</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>互動地圖</div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>整合 Google Maps API 可顯示真實地圖</div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {top.slice(0, 3).map(c => <div key={c.id} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "3px 8px", fontSize: 10 }}>📍</div>)}
        </div>
      </div>
      <div style={{ fontSize: 13, color: T.sub, marginBottom: 10 }}>附近高評分咖啡廳</div>
      {top.map(c => <CafeCard key={c.id} cafe={c} onClick={() => onSelect(c)} fav={false} onFav={() => {}} emptyCafeIds={[]} />)}
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
const DetailPage = ({ cafe, onBack, fav, onFav, onReport }) => (
  <div style={{ flex: 1, overflow: "auto" }}>
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

      {/* Crowd Report — 放在最前面，一進來就看到 */}
      <CrowdReport cafeId={cafe.id} onReport={onReport} />

      {/* Tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {limitedTag(cafe.limited_time)}
        {socketTag(cafe.socket)}
        {cafe.standing_desk === "yes" && <Tag label="站立桌" type="gray" />}
      </div>

      {/* Scores */}
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

      {/* Links */}
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

// ── Main App ──
export default function App() {
  const [tab, setTab] = useState("home");
  const [city, setCity] = useState("taipei");
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [favs, setFavs] = useState(new Set());
  const [emptyCafeIds, setEmptyCafeIds] = useState([]);

  const fetchCafes = useCallback(async (c) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cafes?city=${c}`);
      const data = await res.json();
      setCafes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCafes(city); }, [city, fetchCafes]);
  
  // App 啟動時 / 切換城市時抓取 emptyCafeIds
  useEffect(() => { 
    fetchEmptyCafeIds().then(setEmptyCafeIds).catch(() => {}); 
  }, [city]);

  const toggleFav = (id) => setFavs(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const handleCityChange = (c) => { setCity(c); setSelected(null); };

  const handleReportAndUpdateMap = (cafeId, status) => {
    if (status === "empty") {
      setEmptyCafeIds(prev => [...new Set([...prev, cafeId])]);
    } else {
      setEmptyCafeIds(prev => prev.filter(id => id !== cafeId));
    }
  };

  const renderPage = () => {
    if (selected) return <DetailPage cafe={selected} onBack={() => setSelected(null)} fav={favs.has(selected.id)} onFav={toggleFav} onReport={handleReportAndUpdateMap} />;
    switch (tab) {
      case "home": return <HomePage cafes={cafes} loading={loading} city={city} setCity={handleCityChange} onSelect={setSelected} favs={favs} onFav={toggleFav} emptyCafeIds={emptyCafeIds} />;
      case "search": return <SearchPage cafes={cafes} loading={loading} onSelect={setSelected} favs={favs} onFav={toggleFav} />;
      case "map": return <MapPage cafes={cafes} onSelect={setSelected} />;
      case "favorites": return <FavoritesPage cafes={cafes} favs={favs} onSelect={setSelected} onFav={toggleFav} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,'PingFang TC',sans-serif;background:#f0ebe4}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${T.beige};border-radius:3px}`}</style>
      <div style={{ maxWidth: 400, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", background: T.cream, overflow: "hidden", boxShadow: "0 0 40px rgba(0,0,0,0.15)" }}>
        {!selected && <Header />}
        {renderPage()}
        {!selected && <BottomNav active={tab} onChange={t => { setTab(t); }} />}
      </div>
    </>
  );
}
