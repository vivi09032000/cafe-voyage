import { readFile, writeFile } from "node:fs/promises";

const INPUT = process.argv[2];
const CITY_KEY = process.argv[3];
const COUNTRY_CODE = process.argv[4] || "TW";
const OUTPUT = process.argv[5];

if (!INPUT || !CITY_KEY || !OUTPUT) {
  console.error("Usage: node scripts/export-cafe-status-seed.mjs <review-json> <city-key> <country-code> <output-sql>");
  process.exit(1);
}

const rows = JSON.parse(await readFile(INPUT, "utf8"));
const kept = rows.filter((row) => {
  const reason = row.audit?.reason || "";
  return reason === "Google Places businessStatus = CLOSED_PERMANENTLY"
    || reason === "Google Places businessStatus = CLOSED_TEMPORARILY";
});

const esc = (value) => String(value ?? "").replace(/'/g, "''");
const statusCheckedAt = "now()";

const lines = [
  "insert into public.cafe_status_reviews (",
  "  status_source, cafe_source, cafe_source_id, country_code, city_key,",
  "  cafe_name, cafe_address, google_place_id, google_business_status, google_maps_url,",
  "  matched_name, matched_address, review_category, review_reason, status_checked_at, is_current",
  ") values",
  kept.map((row) => {
    const status = row.details?.businessStatus || row.findPlace?.business_status || "";
    const maps = row.details?.googleMapsUri || row.findPlace?.google_maps_uri || "";
    const placeId = row.findPlace?.place_id || "";
    const matchedName = row.findPlace?.name || "";
    const matchedAddress = row.findPlace?.formatted_address || "";
    return `  ('google_places', 'cafenomad', '${esc(row.id)}', '${esc(COUNTRY_CODE)}', '${esc(CITY_KEY)}', '${esc(row.name)}', '${esc(row.address)}', '${esc(placeId)}', '${esc(status)}', '${esc(maps)}', '${esc(matchedName)}', '${esc(matchedAddress)}', '${esc(row.audit?.category || "")}', '${esc(row.audit?.reason || "")}', ${statusCheckedAt}, true)`;
  }).join(",\n"),
  "on conflict (status_source, cafe_source, cafe_source_id) do update set",
  "  country_code = excluded.country_code,",
  "  city_key = excluded.city_key,",
  "  cafe_name = excluded.cafe_name,",
  "  cafe_address = excluded.cafe_address,",
  "  google_place_id = excluded.google_place_id,",
  "  google_business_status = excluded.google_business_status,",
  "  google_maps_url = excluded.google_maps_url,",
  "  matched_name = excluded.matched_name,",
  "  matched_address = excluded.matched_address,",
  "  review_category = excluded.review_category,",
  "  review_reason = excluded.review_reason,",
  "  status_checked_at = excluded.status_checked_at,",
  "  is_current = excluded.is_current;",
  "",
];

await writeFile(OUTPUT, lines.join("\n"));
console.log(`Wrote ${kept.length} rows to ${OUTPUT}`);
