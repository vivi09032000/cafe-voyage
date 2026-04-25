import { mkdir, readFile, writeFile } from "node:fs/promises";

const SCRIPT_DISABLED_MESSAGE = `
[DISABLED] scripts/audit-google-places-status.mjs

This script is intentionally disabled because a previous bulk run against
Google Places API caused unexpected charges in production billing.

Do not re-enable or run this script casually.

Before any future use, you must:
1. Review GOOGLE_PLACES_COST_WARNING.md in the repo root.
2. Confirm quotas, budget alerts, and API restrictions in Google Cloud.
3. Replace this bulk workflow with a deliberately small, manual sample.

If you truly need to revive this script, do it in a separate branch and add
strict rate limiting, hard caps, and a dry-run mode first.
`.trim();

throw new Error(SCRIPT_DISABLED_MESSAGE);

function createCafeNomadDataset(cityKey, label) {
  return {
    label,
    outputJson: new URL(`../reviews/${cityKey}-google-places-status.json`, import.meta.url),
    outputMd: new URL(`../reviews/${cityKey}-google-places-status.md`, import.meta.url),
    outputCsv: new URL(`../reviews/${cityKey}-google-places-review.csv`, import.meta.url),
    outputClosedCsv: new URL(`../reviews/${cityKey}-google-places-permanently-closed.csv`, import.meta.url),
    loadCafes: async () => {
      const res = await fetch(`https://cafenomad.tw/api/v1.2/cafes/${cityKey}`);
      if (!res.ok) throw new Error(`Cafe Nomad request failed: ${res.status}`);
      return await res.json();
    },
  };
}

function createCafeNomadRegionDataset(regionKey, label, patterns) {
  return {
    label,
    outputJson: new URL(`../reviews/${regionKey}-google-places-status.json`, import.meta.url),
    outputMd: new URL(`../reviews/${regionKey}-google-places-status.md`, import.meta.url),
    outputCsv: new URL(`../reviews/${regionKey}-google-places-review.csv`, import.meta.url),
    outputClosedCsv: new URL(`../reviews/${regionKey}-google-places-permanently-closed.csv`, import.meta.url),
    loadCafes: async () => {
      const res = await fetch("https://cafenomad.tw/api/v1.2/cafes");
      if (!res.ok) throw new Error(`Cafe Nomad request failed: ${res.status}`);
      const rows = await res.json();
      return rows.filter((cafe) => patterns.some((pattern) => String(cafe.address || "").includes(pattern)));
    },
  };
}

const DATASETS = {
  "hoi-an": {
    label: "Hoi An",
    outputJson: new URL("../reviews/hoi-an-google-places-status.json", import.meta.url),
    outputMd: new URL("../reviews/hoi-an-google-places-status.md", import.meta.url),
    outputCsv: new URL("../reviews/hoi-an-google-places-review.csv", import.meta.url),
    outputClosedCsv: new URL("../reviews/hoi-an-google-places-permanently-closed.csv", import.meta.url),
    loadCafes: async () => JSON.parse(await readFile(new URL("../data/hoi-an-cafes.json", import.meta.url), "utf8")),
  },
  taipei: createCafeNomadDataset("taipei", "Taipei"),
  taichung: createCafeNomadDataset("taichung", "Taichung"),
  tainan: createCafeNomadDataset("tainan", "Tainan"),
  kaohsiung: createCafeNomadDataset("kaohsiung", "Kaohsiung"),
  hsinchu: createCafeNomadDataset("hsinchu", "Hsinchu"),
  taoyuan: createCafeNomadDataset("taoyuan", "Taoyuan"),
  yilan: createCafeNomadDataset("yilan", "Yilan"),
  hualien: createCafeNomadDataset("hualien", "Hualien"),
  taitung: createCafeNomadDataset("taitung", "Taitung"),
  keelung: createCafeNomadDataset("keelung", "Keelung"),
  miaoli: createCafeNomadRegionDataset("miaoli", "Miaoli", ["苗栗縣"]),
  changhua: createCafeNomadRegionDataset("changhua", "Changhua", ["彰化縣"]),
  nantou: createCafeNomadRegionDataset("nantou", "Nantou", ["南投縣"]),
  yunlin: createCafeNomadRegionDataset("yunlin", "Yunlin", ["雲林縣"]),
  chiayi: createCafeNomadRegionDataset("chiayi", "Chiayi", ["嘉義市", "嘉義縣"]),
  pingtung: createCafeNomadRegionDataset("pingtung", "Pingtung", ["屏東縣"]),
};

async function getApiKey() {
  if (process.env.GOOGLE_PLACES_API_KEY) return process.env.GOOGLE_PLACES_API_KEY;
  throw new Error("Missing GOOGLE_PLACES_API_KEY");
}

async function searchPlace(apiKey, cafe) {
  if (cafe.latitude && cafe.longitude) {
    const nearby = await searchNearbyByCoords(apiKey, cafe);
    if (nearby) return nearby;
  }
  return await searchByText(apiKey, cafe);
}

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[()（）［］【】「」『』'"`~!@#$%^&*+=:;,.?/\\|<>_\-\s]/g, "");
}

function simplifyNameForMatch(value) {
  const stripped = String(value || "")
    .replace(/（[^）]*）|\([^)]*\)|［[^］]*］|\[[^\]]*\]|【[^】]*】|「[^」]*」|『[^』]*』/g, " ")
    .replace(/\s+-\s+.*/g, " ")
    .replace(/\s+\|.+$/g, " ");

  return normalizeName(
    stripped
      .toLowerCase()
      .replace(
        /咖啡館|咖啡店|咖啡|珈琲|早午餐|甜點|餐廳|餐館|小餐館|cafes?|coffee|coffeebar|coffeeroasters?|roastery|roaster|espresso|bakery|brunch|kitchen|restaurant|bar|house|studio|shop|deli/gi,
        " "
      )
  );
}

function tokenizeName(value) {
  const normalized = simplifyNameForMatch(value);
  return (normalized.match(/[a-z0-9]+|[\u3400-\u9fff]+/g) || [normalized]).filter(Boolean).sort();
}

function canonicalName(value) {
  return tokenizeName(value).join("|");
}

function levenshtein(a, b) {
  const aa = Array.from(a);
  const bb = Array.from(b);
  const dp = Array.from({ length: aa.length + 1 }, (_, i) =>
    Array.from({ length: bb.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= aa.length; i += 1) {
    for (let j = 1; j <= bb.length; j += 1) {
      const cost = aa[i - 1] === bb[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[aa.length][bb.length];
}

function tokenJaccard(aTokens, bTokens) {
  const aSet = new Set(aTokens);
  const bSet = new Set(bTokens);
  const union = new Set([...aSet, ...bSet]).size;
  if (!union) return 0;
  let intersection = 0;
  for (const token of aSet) {
    if (bSet.has(token)) intersection += 1;
  }
  return intersection / union;
}

function nameSimilarity(sourceName, matchedName) {
  const source = normalizeName(sourceName);
  const matched = normalizeName(matchedName);
  if (!source || !matched) return 0;
  if (source === matched) return 1;
  const prefixRatio = commonPrefixLength(source, matched)
    / Math.max(Math.min(Array.from(source).length, Array.from(matched).length), 1);
  if (prefixRatio >= 0.72) return 0.9;
  if (source.includes(matched) || matched.includes(source)) return 0.92;

  const sourceCanonical = canonicalName(sourceName);
  const matchedCanonical = canonicalName(matchedName);
  if (sourceCanonical && sourceCanonical === matchedCanonical) return 1;

  const sourceCore = simplifyNameForMatch(sourceName);
  const matchedCore = simplifyNameForMatch(matchedName);
  if (sourceCore && matchedCore) {
    if (sourceCore === matchedCore) return 0.96;
    if (sourceCore.includes(matchedCore) || matchedCore.includes(sourceCore)) return 0.88;
  }

  const maxLen = Math.max(Array.from(sourceCanonical).length, Array.from(matchedCanonical).length, 1);
  const editScore = 1 - (levenshtein(sourceCanonical, matchedCanonical) / maxLen);
  const tokenScore = tokenJaccard(tokenizeName(sourceName), tokenizeName(matchedName));
  const coreMaxLen = Math.max(Array.from(sourceCore).length, Array.from(matchedCore).length, 1);
  const coreEditScore = sourceCore && matchedCore
    ? 1 - (levenshtein(sourceCore, matchedCore) / coreMaxLen)
    : 0;

  return Math.max(editScore, tokenScore, coreEditScore);
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

function commonPrefixLength(a, b) {
  const aa = Array.from(a);
  const bb = Array.from(b);
  let i = 0;
  while (i < aa.length && i < bb.length && aa[i] === bb[i]) i += 1;
  return i;
}

function hasStrongNameMatch(sourceName, matchedName) {
  return nameSimilarity(sourceName, matchedName) >= 0.64;
}

function hasStrongAddressMatch(sourceAddress, matchedAddress) {
  const source = normalizeAddress(sourceAddress);
  const matched = normalizeAddress(matchedAddress);
  if (!source || !matched) return false;

  const sourceDoor = extractDoorToken(source);
  const matchedDoor = extractDoorToken(matched);
  if (sourceDoor && matchedDoor && sourceDoor === matchedDoor) return true;

  const sourcePrefix = source.slice(0, 10);
  const matchedPrefix = matched.slice(0, 10);
  if (sourcePrefix.length >= 6 && matched.includes(sourcePrefix)) return true;
  if (matchedPrefix.length >= 6 && source.includes(matchedPrefix)) return true;
  return false;
}

function distanceMeters(aLat, aLng, bLat, bLng) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const aa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

function mapLegacyPlace(place, addressField = "formatted_address") {
  return {
    place_id: place.place_id || "",
    name: place.name || "",
    formatted_address: place[addressField] || "",
    business_status: place.business_status || "",
    types: Array.isArray(place.types) ? place.types : [],
    google_maps_uri: "",
  };
}

function bigrams(value) {
  const chars = Array.from(simplifyNameForMatch(value));
  if (chars.length < 2) return new Set(chars[0] ? [chars[0]] : []);
  const out = new Set();
  for (let i = 0; i < chars.length - 1; i += 1) {
    out.add(chars.slice(i, i + 2).join(""));
  }
  return out;
}

function hasLooseNameOverlap(sourceName, matchedName) {
  if (hasStrongNameMatch(sourceName, matchedName)) return true;
  const a = bigrams(sourceName);
  const b = bigrams(matchedName);
  for (const token of a) {
    if (b.has(token)) return true;
  }
  return false;
}

function isCafeLikePlace(place) {
  const types = Array.isArray(place?.types) ? place.types : [];
  return types.includes("cafe") || types.includes("coffee_shop");
}

const EXPLICIT_NON_CAFE_TYPES = new Set([
  "restaurant",
  "hot_pot_restaurant",
  "chinese_restaurant",
  "japanese_restaurant",
  "ramen_restaurant",
  "thai_restaurant",
  "breakfast_restaurant",
  "fast_food_restaurant",
  "bar",
  "bakery",
  "ice_cream_shop",
  "hair_salon",
  "beauty_salon",
  "lodging",
  "hotel",
  "bank",
  "atm",
  "clothing_store",
  "shoe_store",
  "convenience_store",
  "supermarket",
  "grocery_store",
  "electronics_store",
  "furniture_store",
  "home_goods_store",
  "department_store",
  "book_store",
  "pharmacy",
  "hospital",
  "gas_station",
  "car_repair",
  "car_dealer",
  "gym",
  "movie_theater",
  "pet_store",
  "florist",
  "travel_agency",
  "real_estate_agency",
  "school",
  "university",
  "museum",
  "park",
  "tourist_attraction",
]);

function isExplicitNonCafePlace(place) {
  const types = Array.isArray(place?.types) ? place.types : [];
  if (isCafeLikePlace(place)) return false;
  return types.some((type) => EXPLICIT_NON_CAFE_TYPES.has(type));
}

function chooseBestNearbyResult(cafe, places) {
  const originLat = Number(cafe.latitude);
  const originLng = Number(cafe.longitude);

  return places
    .map((place) => {
      const similarity = nameSimilarity(cafe.name, place.name);
      const lat = Number(place.geometry?.location?.lat);
      const lng = Number(place.geometry?.location?.lng);
      const distance = Number.isFinite(lat) && Number.isFinite(lng)
        ? distanceMeters(originLat, originLng, lat, lng)
        : 999999;
      let score = -distance / 10;
      score += similarity * 180;
      if ((place.vicinity || place.formatted_address || "").includes(String(cafe.address || "").slice(0, 6))) {
        score += 20;
      }
      return { place, score };
    })
    .sort((a, b) => b.score - a.score)[0]?.place || null;
}

async function searchNearbyByCoords(apiKey, cafe) {
  const keyword = encodeURIComponent(cafe.name);
  const location = `${Number(cafe.latitude)},${Number(cafe.longitude)}`;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=120&keyword=${keyword}&language=zh-TW&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Nearby Search failed: ${res.status}`);
  const data = await res.json();
  if (data.status === "REQUEST_DENIED") {
    throw new Error(`Nearby Search denied: ${data.error_message || "REQUEST_DENIED"}`);
  }
  if (data.status === "OVER_QUERY_LIMIT") {
    throw new Error("Nearby Search over query limit");
  }
  if (!data.results?.length) return null;
  const best = chooseBestNearbyResult(cafe, data.results);
  return best ? mapLegacyPlace(best, "vicinity") : null;
}

async function searchByText(apiKey, cafe) {
  const query = encodeURIComponent(`${cafe.name} ${cafe.address}`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&language=zh-TW&region=tw&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Text Search failed: ${res.status}`);
  const data = await res.json();
  if (data.status === "REQUEST_DENIED") {
    throw new Error(`Text Search denied: ${data.error_message || "REQUEST_DENIED"}`);
  }
  if (data.status === "OVER_QUERY_LIMIT") {
    throw new Error("Text Search over query limit");
  }
  const place = data.results?.[0];
  return place ? mapLegacyPlace(place) : null;
}

async function getPlaceDetails(apiKey, placeId) {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "id,displayName,formattedAddress,businessStatus,movedPlace,movedPlaceId,googleMapsUri",
    },
  });

  if (!res.ok) {
    return { error: `Place Details failed: ${res.status}` };
  }

  return await res.json();
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function classify(result) {
  if (result.error) {
    return {
      category: "review",
      reason: result.error,
    };
  }

  if (!result.findPlace) {
    return {
      category: "review",
      reason: "No Google Places candidate found",
    };
  }

  const status = result.details?.businessStatus || result.findPlace.business_status || "";

  if (status === "CLOSED_PERMANENTLY" && result.details?.movedPlaceId) {
    return {
      category: "review",
      reason: `Marked CLOSED_PERMANENTLY but Google indicates a moved place (${result.details.movedPlaceId})`,
    };
  }

  if (status === "CLOSED_PERMANENTLY") {
    return {
      category: "suspected_closed",
      reason: "Google Places businessStatus = CLOSED_PERMANENTLY",
    };
  }

  if (status === "CLOSED_TEMPORARILY") {
    return {
      category: "review",
      reason: "Google Places businessStatus = CLOSED_TEMPORARILY",
    };
  }

  if (!status) {
    return {
      category: "review",
      reason: "Google Places returned no business status",
    };
  }

  return {
    category: "ok",
    reason: `Google Places businessStatus = ${status}`,
  };
}

function escapeCell(value) {
  return String(value || "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function rowStatus(row) {
  return row.details?.businessStatus || row.findPlace?.business_status || "";
}

function summarize(rows) {
  const summary = {
    total: rows.length,
    ok: 0,
    suspected_closed: 0,
    review: 0,
    permanently_closed: 0,
    temporarily_closed: 0,
    no_candidate: 0,
    api_issues: 0,
    no_status: 0,
  };

  for (const row of rows) {
    summary[row.audit.category] += 1;
    const status = rowStatus(row);
    if (status === "CLOSED_PERMANENTLY") summary.permanently_closed += 1;
    if (status === "CLOSED_TEMPORARILY") summary.temporarily_closed += 1;
    if (row.audit.reason === "No Google Places candidate found") summary.no_candidate += 1;
    if (row.audit.reason.includes("denied") || row.audit.reason.includes("failed") || row.audit.reason.includes("limit")) {
      summary.api_issues += 1;
    }
    if (row.audit.reason === "Google Places returned no business status") summary.no_status += 1;
  }

  return summary;
}

function pushTable(lines, headers, rows) {
  if (!rows.length) {
    lines.push("無。", "");
    return;
  }

  lines.push(`| ${headers.join(" | ")} |`);
  lines.push(`| ${headers.map(() => "---").join(" | ")} |`);
  for (const row of rows) {
    lines.push(`| ${row.map(escapeCell).join(" | ")} |`);
  }
  lines.push("");
}

function toMarkdown(label, rows) {
  const summary = summarize(rows);
  const permanentlyClosed = rows
    .filter((row) => row.audit.category === "suspected_closed")
    .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
  const temporarilyClosed = rows
    .filter((row) => row.audit.reason === "Google Places businessStatus = CLOSED_TEMPORARILY")
    .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));

  const lines = [
    `# ${label} Google Places Closure Review`,
    "",
    `Checked at: ${new Date().toISOString()}`,
    "",
    "Google Places was used as the primary signal for closure review.",
    "",
    "這份報表目前只保留兩類：永久歇業與暫停營業。",
    "",
    "## 總覽",
    "",
    `- 總店數：${summary.total}`,
    `- 疑似永久歇業：${summary.permanently_closed}`,
    `- 疑似暫停營業：${summary.temporarily_closed}`,
    "",
    "## 1. 疑似永久歇業",
    "",
  ];

  pushTable(
    lines,
    ["店名", "資料地址", "Google 比對地址", "狀態", "Google Maps"],
    permanentlyClosed.map((row) => [
      row.name,
      row.address || "",
      row.findPlace?.formatted_address || "",
      rowStatus(row),
      row.details?.googleMapsUri || "",
    ])
  );

  lines.push("## 2. 疑似暫停營業", "");
  pushTable(
    lines,
    ["店名", "資料地址", "Google 比對地址", "狀態", "Google Maps"],
    temporarilyClosed.map((row) => [
      row.name,
      row.address || "",
      row.findPlace?.formatted_address || "",
      rowStatus(row),
      row.details?.googleMapsUri || row.findPlace?.google_maps_uri || "",
    ])
  );

  return lines.join("\n");
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows) {
  const headers = [
    "category",
    "reason",
    "business_status",
    "name",
    "address",
    "source_url",
    "google_match_name",
    "google_match_address",
    "google_place_id",
    "google_maps_url",
    "moved_place_id",
  ];
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) {
    lines.push([
      row.audit.category,
      row.audit.reason,
      rowStatus(row),
      row.name,
      row.address || "",
      row.url || "",
      row.findPlace?.name || "",
      row.findPlace?.formatted_address || "",
      row.findPlace?.place_id || "",
      row.details?.googleMapsUri || row.findPlace?.google_maps_uri || "",
      row.details?.movedPlaceId || "",
    ].map(csvCell).join(","));
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const target = process.argv[2] || "hoi-an";
  const renderOnly = process.argv.includes("--render-only");
  const shouldFetchDetails = process.argv.includes("--details");
  const dataset = DATASETS[target];
  if (!dataset) {
    throw new Error(`Unsupported target: ${target}`);
  }

  let rows = [];

  if (renderOnly) {
    rows = JSON.parse(await readFile(dataset.outputJson, "utf8"));
    rows = rows.map((row) => ({
      ...row,
      audit: classify(row),
    }));
  } else {
    const apiKey = await getApiKey();
    const cafes = await dataset.loadCafes();

    for (const cafe of cafes) {
      let result = {
        id: cafe.id,
        name: cafe.name,
        address: cafe.address,
        url: cafe.url || "",
        findPlace: null,
        details: null,
      };

      try {
        const findPlace = await searchPlace(apiKey, cafe);
        result.findPlace = findPlace;
        if (shouldFetchDetails && findPlace?.place_id && findPlace.business_status === "CLOSED_PERMANENTLY") {
          result.details = await getPlaceDetails(apiKey, findPlace.place_id);
        }
      } catch (error) {
        result.error = error.message || String(error);
      }

      result.audit = classify(result);
      rows.push(result);
      if (rows.length % 50 === 0) {
        console.log(`Progress ${rows.length}/${cafes.length}`);
      }
      await sleep(120);
    }

    await mkdir(new URL("../reviews/", import.meta.url), { recursive: true });
    await writeFile(dataset.outputJson, `${JSON.stringify(rows, null, 2)}\n`);
  }

  await mkdir(new URL("../reviews/", import.meta.url), { recursive: true });
  await writeFile(dataset.outputJson, `${JSON.stringify(rows, null, 2)}\n`);
  await writeFile(dataset.outputMd, toMarkdown(dataset.label, rows));
  const flagged = rows.filter((row) =>
    row.audit.reason === "Google Places businessStatus = CLOSED_PERMANENTLY"
    || row.audit.reason === "Google Places businessStatus = CLOSED_TEMPORARILY"
  );
  const permanentlyClosed = rows.filter((row) => row.audit.category === "suspected_closed");
  await writeFile(dataset.outputCsv, toCsv(flagged));
  await writeFile(dataset.outputClosedCsv, toCsv(permanentlyClosed));

  console.log(`Checked ${rows.length} cafes`);
  console.log(`Flagged ${flagged.length} cafes for review`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
