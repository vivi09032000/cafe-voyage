import { mkdir, writeFile } from "node:fs/promises";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const AREAS = {
  xinzhuang: {
    label: "新莊區",
    query: "新莊區 咖啡店",
    cafenomadAddressPatterns: ["新莊區"],
    center: { latitude: 25.036, longitude: 121.45 },
  },
};

const MAX_RESULTS = Number(process.env.MAX_RESULTS || 20);
const MAX_PAGES = Number(process.env.MAX_PAGES || 1);

if (!GOOGLE_PLACES_API_KEY) {
  throw new Error("Missing GOOGLE_PLACES_API_KEY");
}

const areaKey = process.argv[2] || "xinzhuang";
const area = AREAS[areaKey];

if (!area) {
  throw new Error(`Unknown area "${areaKey}". Available: ${Object.keys(AREAS).join(", ")}`);
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
  const placeName = simplifyName(place.displayName?.text || "");
  const cafeName = simplifyName(cafe.name || "");
  const placeAddress = normalizeAddress(place.formattedAddress || "");
  const cafeAddress = normalizeAddress(cafe.address || "");
  const placeDoor = extractDoorToken(placeAddress);
  const cafeDoor = extractDoorToken(cafeAddress);

  if (place.id && cafe.google_place_id && place.id === cafe.google_place_id) return true;
  if (placeName && cafeName && (placeName.includes(cafeName) || cafeName.includes(placeName))) return true;
  if (placeDoor && cafeDoor && placeDoor === cafeDoor && placeAddress.slice(0, 8) === cafeAddress.slice(0, 8)) return true;
  return false;
}

async function fetchCafeNomadArea() {
  const res = await fetch("https://cafenomad.tw/api/v1.2/cafes/taipei");
  if (!res.ok) throw new Error(`Cafe Nomad request failed: ${res.status}`);
  const cafes = await res.json();
  return cafes.filter((cafe) =>
    area.cafenomadAddressPatterns.some((pattern) => String(cafe.address || "").includes(pattern))
  );
}

async function searchGooglePlaces() {
  const places = [];
  let pageToken = "";

  for (let page = 0; page < MAX_PAGES && places.length < MAX_RESULTS; page += 1) {
    const body = pageToken
      ? { pageToken }
      : {
          textQuery: area.query,
          includedType: "cafe",
          strictTypeFiltering: false,
          languageCode: "zh-TW",
          regionCode: "TW",
          locationBias: {
            circle: {
              center: {
                latitude: area.center.latitude,
                longitude: area.center.longitude,
              },
              radius: 5000,
            },
          },
        };

    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
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
          "places.types",
          "nextPageToken",
        ].join(","),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Google Places request failed: ${res.status} ${JSON.stringify(data)}`);
    }

    places.push(...(data.places || []));
    pageToken = data.nextPageToken || "";
    if (!pageToken) break;
  }

  const byId = new Map();
  for (const place of places) {
    if (!byId.has(place.id)) byId.set(place.id, place);
  }
  return [...byId.values()].slice(0, MAX_RESULTS);
}

function placeName(place) {
  return place.displayName?.text || "";
}

function toMarkdown({ places, existing, candidates }) {
  const lines = [
    `# ${area.label} Google Places New Cafe Sample`,
    "",
    `Checked at: ${new Date().toISOString()}`,
    "",
    `Google query: ${area.query}`,
    `Google results checked: ${places.length}`,
    `Cafe Nomad ${area.label} cafes: ${existing.length}`,
    `Likely new candidates: ${candidates.length}`,
    "",
    "This is a small sample report only. Nothing was inserted into production data.",
    "",
    "## Likely New Candidates",
    "",
  ];

  if (!candidates.length) {
    lines.push("No likely new candidates found in this sample.", "");
  } else {
    lines.push("| Name | Address | Status | Google Maps |");
    lines.push("| --- | --- | --- | --- |");
    for (const place of candidates) {
      lines.push(
        `| ${placeName(place).replace(/\|/g, "\\|")} | ${(place.formattedAddress || "").replace(/\|/g, "\\|")} | ${place.businessStatus || ""} | ${place.googleMapsUri || ""} |`
      );
    }
    lines.push("");
  }

  lines.push("## All Google Results", "");
  lines.push("| Name | Address | Status | In Cafe Nomad? |");
  lines.push("| --- | --- | --- | --- |");
  for (const place of places) {
    const matched = existing.find((cafe) => isLikelySameCafe(place, cafe));
    lines.push(
      `| ${placeName(place).replace(/\|/g, "\\|")} | ${(place.formattedAddress || "").replace(/\|/g, "\\|")} | ${place.businessStatus || ""} | ${matched ? matched.name.replace(/\|/g, "\\|") : "No"} |`
    );
  }

  return `${lines.join("\n")}\n`;
}

const existing = await fetchCafeNomadArea();
const places = await searchGooglePlaces();
const candidates = places.filter((place) => !existing.some((cafe) => isLikelySameCafe(place, cafe)));
const report = {
  area: areaKey,
  checkedAt: new Date().toISOString(),
  googleQuery: area.query,
  googleResultsChecked: places.length,
  cafeNomadAreaCount: existing.length,
  likelyNewCandidateCount: candidates.length,
  candidates,
  allGoogleResults: places,
};

await mkdir(new URL("../reviews/", import.meta.url), { recursive: true });
await writeFile(new URL(`../reviews/${areaKey}-google-places-new-cafes-sample.json`, import.meta.url), JSON.stringify(report, null, 2));
await writeFile(new URL(`../reviews/${areaKey}-google-places-new-cafes-sample.md`, import.meta.url), toMarkdown({ places, existing, candidates }));

console.log(JSON.stringify({
  area: area.label,
  googleResultsChecked: places.length,
  cafeNomadAreaCount: existing.length,
  likelyNewCandidateCount: candidates.length,
  report: `reviews/${areaKey}-google-places-new-cafes-sample.md`,
}, null, 2));
