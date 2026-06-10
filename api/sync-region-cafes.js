const SUPABASE_URL = process.env.SUPABASE_URL || "https://dmymcnmsyhppwstpwmal.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_2mlstxr8qtRrybaIyBIB8Q_oS_Im60Q";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";

const SYNC_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const DAILY_REGION_LIMIT = 20;
const MAX_RESULTS = 20;

const CITY_LABELS = {
  taipei: "台北",
  taichung: "台中",
  tainan: "台南",
  kaohsiung: "高雄",
  hsinchu: "新竹",
  taoyuan: "桃園",
  keelung: "基隆",
  miaoli: "苗栗",
  changhua: "彰化",
  nantou: "南投",
  yunlin: "雲林",
  chiayi: "嘉義",
  pingtung: "屏東",
  yilan: "宜蘭",
  hualien: "花蓮",
  taitung: "台東",
};

const CITY_CENTERS = {
  taipei: { latitude: 25.036, longitude: 121.45 },
  taichung: { latitude: 24.1477, longitude: 120.6736 },
  tainan: { latitude: 22.9999, longitude: 120.227 },
  kaohsiung: { latitude: 22.6273, longitude: 120.3014 },
  hsinchu: { latitude: 24.8138, longitude: 120.9675 },
  taoyuan: { latitude: 24.9937, longitude: 121.301 },
  keelung: { latitude: 25.1276, longitude: 121.7392 },
  miaoli: { latitude: 24.5602, longitude: 120.8214 },
  changhua: { latitude: 24.0518, longitude: 120.5161 },
  nantou: { latitude: 23.9609, longitude: 120.9719 },
  yunlin: { latitude: 23.7092, longitude: 120.4313 },
  chiayi: { latitude: 23.4801, longitude: 120.4491 },
  pingtung: { latitude: 22.5519, longitude: 120.5488 },
  yilan: { latitude: 24.7021, longitude: 121.7378 },
  hualien: { latitude: 23.9872, longitude: 121.6015 },
  taitung: { latitude: 22.7972, longitude: 121.0714 },
};

function send(res, status, body) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}

function sanitizeRegion(value) {
  return String(value || "")
    .trim()
    .replace(/[^\p{Script=Han}a-zA-Z0-9\s-]/gu, "")
    .slice(0, 24);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/臺/g, "台")
    .replace(/[()（）［］【】「」『』'"`~!@#$%^&*+=:;,.?/\\|<>_\-\s]/g, "");
}

function simplifyName(value) {
  return normalize(
    String(value || "")
      .replace(/（[^）]*）|\([^)]*\)|［[^］]*］|\[[^\]]*\]|【[^】]*】|「[^」]*」|『[^』]*』/g, " ")
      .replace(/\s+-\s+.*/g, " ")
      .replace(/\s+\|.+$/g, " ")
      .replace(/咖啡館|咖啡店|咖啡|珈琲|甜點|早午餐|cafe|coffee|roasters?|roastery|bakery|brunch/gi, " ")
  );
}

function normalizeAddress(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/臺/g, "台")
    .replace(/^\d{3,5}/, "");
}

function extractDoorToken(address) {
  return normalizeAddress(address).match(/\d+(?:-\d+)?號/)?.[0] || "";
}

function isLikelySameCafe(place, cafe) {
  const placeId = place.id || place.google_place_id || "";
  const placeName = simplifyName(place.displayName?.text || place.name || "");
  const cafeName = simplifyName(cafe.name || "");
  const placeAddress = normalizeAddress(place.formattedAddress || place.address || "");
  const cafeAddress = normalizeAddress(cafe.address || "");
  const placeDoor = extractDoorToken(placeAddress);
  const cafeDoor = extractDoorToken(cafeAddress);

  if (placeId && cafe.google_place_id && placeId === cafe.google_place_id) return true;
  if (placeName && cafeName && (placeName.includes(cafeName) || cafeName.includes(placeName))) return true;
  if (placeDoor && cafeDoor && placeDoor === cafeDoor && placeAddress.slice(0, 8) === cafeAddress.slice(0, 8)) return true;
  return false;
}

function hashString(value) {
  let hash = 5381;
  for (const char of String(value)) {
    hash = ((hash << 5) + hash) + char.codePointAt(0);
    hash >>>= 0;
  }
  return hash.toString(36);
}

function createSlug(cityKey, regionQuery, place) {
  const seed = place.id || `${place.displayName?.text || ""}-${place.formattedAddress || ""}`;
  return `${cityKey}-${hashString(`${regionQuery}:${seed}`)}`;
}

function serviceHeaders(extra = {}) {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    ...extra,
  };
}

function readHeaders(extra = {}) {
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_PUBLISHABLE_KEY;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    ...extra,
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!response.ok) {
    throw new Error(`${response.status} ${typeof data === "string" ? data : JSON.stringify(data)}`);
  }
  return data;
}

async function fetchSyncRecord(cityKey, regionQuery) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/region_google_syncs`);
  url.searchParams.set("select", "id,last_synced_at,last_status");
  url.searchParams.set("country_code", "eq.TW");
  url.searchParams.set("city_key", `eq.${cityKey}`);
  url.searchParams.set("region_query", `eq.${regionQuery}`);
  url.searchParams.set("limit", "1");
  const rows = await fetchJson(url, { headers: serviceHeaders() });
  return rows?.[0] || null;
}

async function fetchTodaySyncCount() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const url = new URL(`${SUPABASE_URL}/rest/v1/region_google_syncs`);
  url.searchParams.set("select", "id");
  url.searchParams.set("country_code", "eq.TW");
  url.searchParams.set("last_synced_at", `gte.${start.toISOString()}`);
  const rows = await fetchJson(url, { headers: serviceHeaders() });
  return Array.isArray(rows) ? rows.length : 0;
}

async function upsertSyncRecord(record) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/region_google_syncs`);
  url.searchParams.set("on_conflict", "country_code,city_key,region_query");
  await fetchJson(url, {
    method: "POST",
    headers: serviceHeaders({
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    }),
    body: JSON.stringify(record),
  });
}

async function fetchCafeNomadCity(cityKey) {
  const endpoint = cityKey
    ? `https://cafenomad.tw/api/v1.2/cafes/${cityKey}`
    : "https://cafenomad.tw/api/v1.2/cafes";
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Cafe Nomad failed: ${response.status}`);
  return await response.json();
}

async function fetchCustomCafes(cityKey) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/custom_cafes`);
  url.searchParams.set("select", "slug,name,address,google_place_id");
  url.searchParams.set("country_code", "eq.TW");
  url.searchParams.set("city_key", `eq.${cityKey}`);
  const rows = await fetchJson(url, { headers: readHeaders() });
  return Array.isArray(rows) ? rows : [];
}

async function searchGooglePlaces(cityKey, regionQuery) {
  const center = CITY_CENTERS[cityKey] || CITY_CENTERS.taipei;
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.businessStatus",
        "places.googleMapsUri",
      ].join(","),
    },
    body: JSON.stringify({
      textQuery: `${regionQuery} 咖啡店`,
      includedType: "cafe",
      strictTypeFiltering: false,
      languageCode: "zh-TW",
      regionCode: "TW",
      maxResultCount: MAX_RESULTS,
      locationBias: {
        circle: {
          center,
          radius: 7000,
        },
      },
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Google Places failed: ${response.status} ${JSON.stringify(data)}`);
  }
  return Array.isArray(data.places) ? data.places : [];
}

function toCustomCafeRow(cityKey, regionQuery, place) {
  const name = place.displayName?.text || "";
  const mapsUrl = place.googleMapsUri || "";
  const address = place.formattedAddress || "";
  return {
    slug: createSlug(cityKey, regionQuery, place),
    name,
    city: cityKey,
    country_code: "TW",
    country_name: "Taiwan",
    city_key: cityKey,
    city_label: CITY_LABELS[cityKey] || cityKey,
    wifi: 0,
    seat: 0,
    quiet: 0,
    tasty: 0,
    cheap: 0,
    music: 0,
    url: mapsUrl,
    address,
    latitude: place.location?.latitude ?? null,
    longitude: place.location?.longitude ?? null,
    limited_time: "",
    socket: "",
    standing_desk: "",
    mrt: "",
    open_time: "",
    source: "google_places_demo",
    source_url: mapsUrl,
    google_place_id: place.id || "",
    editor_note: `Auto-discovered from a capped Google Places demo sync for ${regionQuery}. Needs manual Cafe Voyage scoring.`,
    verified: false,
    is_published: true,
  };
}

async function upsertCustomCafes(rows) {
  if (!rows.length) return;
  const url = new URL(`${SUPABASE_URL}/rest/v1/custom_cafes`);
  url.searchParams.set("on_conflict", "slug");
  await fetchJson(url, {
    method: "POST",
    headers: serviceHeaders({
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    }),
    body: JSON.stringify(rows),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return send(res, 405, { ok: false, error: "Method not allowed" });
  }

  const cityKey = String(req.query.city || "taipei").toLowerCase();
  const regionQuery = sanitizeRegion(req.query.region || "");

  if (!CITY_LABELS[cityKey]) {
    return send(res, 400, { ok: false, skipped: true, reason: "unsupported_city" });
  }
  if (!regionQuery || !/(區|鄉|鎮|市)$/.test(regionQuery)) {
    return send(res, 400, { ok: false, skipped: true, reason: "invalid_region" });
  }
  if (!GOOGLE_PLACES_API_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return send(res, 200, {
      ok: true,
      skipped: true,
      reason: "missing_server_keys",
      needs: ["GOOGLE_PLACES_API_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
    });
  }

  const startedAt = new Date().toISOString();

  try {
    const existingRecord = await fetchSyncRecord(cityKey, regionQuery);
    if (existingRecord?.last_synced_at && Date.now() - new Date(existingRecord.last_synced_at).getTime() < SYNC_TTL_MS) {
      return send(res, 200, {
        ok: true,
        skipped: true,
        reason: "recently_synced",
        lastSyncedAt: existingRecord.last_synced_at,
      });
    }

    const todaySyncCount = await fetchTodaySyncCount();
    if (todaySyncCount >= DAILY_REGION_LIMIT) {
      return send(res, 200, {
        ok: true,
        skipped: true,
        reason: "daily_region_limit_reached",
        todaySyncCount,
      });
    }

    await upsertSyncRecord({
      country_code: "TW",
      city_key: cityKey,
      region_query: regionQuery,
      last_status: "running",
      last_error: "",
    });

    const [cafeNomadCafes, customCafes, googlePlaces] = await Promise.all([
      fetchCafeNomadCity(cityKey),
      fetchCustomCafes(cityKey),
      searchGooglePlaces(cityKey, regionQuery),
    ]);
    const existingCafes = [...cafeNomadCafes, ...customCafes];
    const candidatePlaces = googlePlaces
      .filter((place) => place.businessStatus !== "CLOSED_PERMANENTLY")
      .filter((place) => String(place.formattedAddress || "").includes(regionQuery))
      .filter((place) => !existingCafes.some((cafe) => isLikelySameCafe(place, cafe)));
    const rows = candidatePlaces.map((place) => toCustomCafeRow(cityKey, regionQuery, place));

    await upsertCustomCafes(rows);
    await upsertSyncRecord({
      country_code: "TW",
      city_key: cityKey,
      region_query: regionQuery,
      last_synced_at: startedAt,
      last_status: "ok",
      last_error: "",
      places_checked: googlePlaces.length,
      new_cafes_inserted: rows.length,
    });

    return send(res, 200, {
      ok: true,
      skipped: false,
      cityKey,
      regionQuery,
      placesChecked: googlePlaces.length,
      newCafesInserted: rows.length,
    });
  } catch (error) {
    try {
      await upsertSyncRecord({
        country_code: "TW",
        city_key: cityKey,
        region_query: regionQuery,
        last_synced_at: startedAt,
        last_status: "error",
        last_error: String(error?.message || error).slice(0, 500),
      });
    } catch {}

    return send(res, 200, {
      ok: false,
      skipped: true,
      reason: "sync_failed",
      error: String(error?.message || error),
    });
  }
}
