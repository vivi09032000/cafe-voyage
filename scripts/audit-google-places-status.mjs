import { mkdir, readFile, writeFile } from "node:fs/promises";

const DATASETS = {
  "hoi-an": {
    label: "Hoi An",
    outputJson: new URL("../reviews/hoi-an-google-places-status.json", import.meta.url),
    outputMd: new URL("../reviews/hoi-an-google-places-status.md", import.meta.url),
    loadCafes: async () => JSON.parse(await readFile(new URL("../data/hoi-an-cafes.json", import.meta.url), "utf8")),
  },
  taipei: {
    label: "Taipei",
    outputJson: new URL("../reviews/taipei-google-places-status.json", import.meta.url),
    outputMd: new URL("../reviews/taipei-google-places-status.md", import.meta.url),
    loadCafes: async () => {
      const res = await fetch("https://cafenomad.tw/api/v1.2/cafes/taipei");
      if (!res.ok) throw new Error(`Cafe Nomad request failed: ${res.status}`);
      return await res.json();
    },
  },
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
    google_maps_uri: "",
  };
}

function chooseBestNearbyResult(cafe, places) {
  const wanted = normalizeName(cafe.name);
  const originLat = Number(cafe.latitude);
  const originLng = Number(cafe.longitude);

  return places
    .map((place) => {
      const candidate = normalizeName(place.name);
      const lat = Number(place.geometry?.location?.lat);
      const lng = Number(place.geometry?.location?.lng);
      const distance = Number.isFinite(lat) && Number.isFinite(lng)
        ? distanceMeters(originLat, originLng, lat, lng)
        : 999999;
      let score = -distance / 10;
      if (candidate === wanted) score += 200;
      else if (candidate.includes(wanted) || wanted.includes(candidate)) score += 120;
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

function toMarkdown(label, rows) {
  const flagged = rows.filter((row) => row.audit.category !== "ok");
  const lines = [
    `# ${label} Google Places Closure Review`,
    "",
    `Checked at: ${new Date().toISOString()}`,
    "",
    "Google Places was used as the primary signal for closure review.",
    "",
    "Per Google documentation, `business_status` may return `OPERATIONAL`, `CLOSED_TEMPORARILY`, or `CLOSED_PERMANENTLY`, and Place Details (New) can also indicate if a closed place has moved.",
    "",
    "## Flagged For Review",
    "",
  ];

  if (!flagged.length) {
    lines.push("No suspicious cafes found in this run.", "");
  } else {
    for (const row of flagged) {
      lines.push(`### ${row.name}`);
      lines.push(`- Address: ${row.address || "N/A"}`);
      lines.push(`- Finding: ${row.audit.reason}`);
      lines.push(`- Source URL: ${row.url || "N/A"}`);
      if (row.findPlace?.place_id) lines.push(`- Google Place ID: ${row.findPlace.place_id}`);
      if (row.findPlace?.formatted_address) lines.push(`- Google matched address: ${row.findPlace.formatted_address}`);
      if (row.details?.googleMapsUri) lines.push(`- Google Maps: ${row.details.googleMapsUri}`);
      if (row.details?.movedPlaceId) lines.push(`- Moved place ID: ${row.details.movedPlaceId}`);
      lines.push("");
    }
  }

  lines.push("## Full Summary", "");
  for (const row of rows) {
    lines.push(`- ${row.name}: ${row.audit.category} (${row.audit.reason})`);
  }
  lines.push("");

  return lines.join("\n");
}

async function main() {
  const target = process.argv[2] || "hoi-an";
  const dataset = DATASETS[target];
  if (!dataset) {
    throw new Error(`Unsupported target: ${target}`);
  }

  const apiKey = await getApiKey();
  const cafes = await dataset.loadCafes();
  const rows = [];

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
      if (findPlace?.place_id && findPlace.business_status === "CLOSED_PERMANENTLY") {
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
  await writeFile(dataset.outputMd, toMarkdown(dataset.label, rows));

  const flagged = rows.filter((row) => row.audit.category !== "ok");
  console.log(`Checked ${rows.length} cafes`);
  console.log(`Flagged ${flagged.length} cafes for review`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
