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
  const data = await response.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(data);
}
