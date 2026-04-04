import { readFile } from "node:fs/promises";

const SUPABASE_URL = "https://dmymcnmsyhppwstpwmal.supabase.co";
const SUPABASE_KEY = "sb_publishable_2mlstxr8qtRrybaIyBIB8Q_oS_Im60Q";
const CUSTOM_CITY_ALIASES = {
  "hoi-an-vn": "hoi_an",
  "hoi_an_vn": "hoi_an",
  "hoi-an": "hoi_an",
  "hoi_an": "hoi_an",
};

async function readHoiAnFallback() {
  const raw = await readFile(new URL("../data/hoi-an-cafes.json", import.meta.url), "utf8");
  return JSON.parse(raw);
}

let taipeiReviewCache = null;

async function readTaipeiClosureReview() {
  if (taipeiReviewCache) return taipeiReviewCache;
  const raw = await readFile(new URL("../reviews/taipei-google-places-status.json", import.meta.url), "utf8");
  const rows = JSON.parse(raw);
  const permanentlyClosedIds = new Set();
  const temporarilyClosedIds = new Set();

  for (const row of rows) {
    if (
      row.audit?.reason === "Google Places businessStatus = CLOSED_PERMANENTLY"
      || row.audit?.reason === "Google matched a non-cafe business at the same address"
    ) {
      permanentlyClosedIds.add(row.id);
    } else if (row.audit?.reason === "Google Places businessStatus = CLOSED_TEMPORARILY") {
      temporarilyClosedIds.add(row.id);
    }
  }

  taipeiReviewCache = { permanentlyClosedIds, temporarilyClosedIds };
  return taipeiReviewCache;
}

async function applyTaipeiClosureReview(cafes, normalizedCity) {
  if (!Array.isArray(cafes) || cafes.length === 0) return cafes;
  if (normalizedCity && normalizedCity !== "taipei") return cafes;

  const { permanentlyClosedIds, temporarilyClosedIds } = await readTaipeiClosureReview();

  return cafes
    .filter((cafe) => !permanentlyClosedIds.has(cafe.id))
    .map((cafe) => {
      if (!temporarilyClosedIds.has(cafe.id)) return cafe;
      return {
        ...cafe,
        google_business_status: "CLOSED_TEMPORARILY",
        google_business_note: "Google 顯示暫停營業",
      };
    });
}

async function fetchCafeStatusReviews(cityKey) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/cafe_status_reviews`);
  url.searchParams.set(
    "select",
    "cafe_source_id,google_business_status,manual_override_status,manual_note,review_reason,review_category"
  );
  url.searchParams.set("is_current", "eq.true");
  url.searchParams.set("cafe_source", "eq.cafenomad");
  url.searchParams.set("country_code", "eq.TW");
  if (cityKey) {
    url.searchParams.set("city_key", `eq.${cityKey}`);
  }
  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!response.ok) {
    throw new Error(`cafe_status_reviews request failed: ${response.status}`);
  }
  const rows = await response.json();
  return new Map(
    rows.map((row) => [
      row.cafe_source_id,
      {
        status: row.manual_override_status || row.google_business_status || "",
        note: row.manual_note || "",
        reviewReason: row.review_reason || "",
        reviewCategory: row.review_category || "",
      },
    ])
  );
}

function applyStatusReviewMap(cafes, statusMap) {
  if (!statusMap || statusMap.size === 0) return cafes;
  return cafes
    .filter((cafe) => {
      const status = statusMap.get(cafe.id);
      return status?.status !== "CLOSED_PERMANENTLY"
        && status?.reviewReason !== "Google matched a non-cafe business at the same address";
    })
    .map((cafe) => {
      const status = statusMap.get(cafe.id);
      if (!status || status.status !== "CLOSED_TEMPORARILY") return cafe;
      return {
        ...cafe,
        google_business_status: "CLOSED_TEMPORARILY",
        google_business_note: status.note || "Google 顯示暫停營業",
      };
    });
}

async function fetchCustomCafes(cityKey) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/custom_cafes`);
  url.searchParams.set("select", "id,slug,name,city,wifi,seat,quiet,tasty,cheap,music,url,address,latitude,longitude,limited_time,socket,standing_desk,mrt,open_time,country_code,country_name,city_key,city_label");
  url.searchParams.set("is_published", "eq.true");
  url.searchParams.set("city_key", `eq.${cityKey}`);
  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!response.ok) {
    throw new Error(`custom_cafes request failed: ${response.status}`);
  }
  const rows = await response.json();
  return rows.map((row) => ({
    id: row.slug || row.id,
    name: row.name,
    city: row.city,
    wifi: Number(row.wifi || 0),
    seat: Number(row.seat || 0),
    quiet: Number(row.quiet || 0),
    tasty: Number(row.tasty || 0),
    cheap: Number(row.cheap || 0),
    music: Number(row.music || 0),
    url: row.url || "",
    address: row.address || "",
    latitude: row.latitude != null ? String(row.latitude) : "",
    longitude: row.longitude != null ? String(row.longitude) : "",
    limited_time: row.limited_time || "",
    socket: row.socket || "",
    standing_desk: row.standing_desk || "",
    mrt: row.mrt || "",
    open_time: row.open_time || "",
    country_code: row.country_code || "",
    country_name: row.country_name || "",
    city_key: row.city_key || "",
    city_label: row.city_label || "",
  }));
}

export default async function handler(req, res) {
  const { city } = req.query;
  const normalizedCity = String(city || "").toLowerCase();

  if (CUSTOM_CITY_ALIASES[normalizedCity]) {
    let data = [];
    try {
      data = await fetchCustomCafes(CUSTOM_CITY_ALIASES[normalizedCity]);
    } catch (error) {
      console.error(error);
    }
    if (!Array.isArray(data) || data.length === 0) {
      data = await readHoiAnFallback();
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.json(data);
  }

  const endpoint = city
    ? `https://cafenomad.tw/api/v1.2/cafes/${city}`
    : 'https://cafenomad.tw/api/v1.2/cafes';
  const response = await fetch(endpoint);
  let data = await response.json();
  let applied = false;
  try {
    const statusMap = await fetchCafeStatusReviews(normalizedCity || undefined);
    if (statusMap.size > 0) {
      data = applyStatusReviewMap(data, statusMap);
      applied = true;
    }
  } catch (error) {
    console.error(error);
  }
  if (!applied) {
    data = await applyTaipeiClosureReview(data, normalizedCity);
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(data);
}
