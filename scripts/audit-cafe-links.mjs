import { readFile, writeFile, mkdir } from "node:fs/promises";

const INPUT_PATH = new URL("../data/hoi-an-cafes.json", import.meta.url);
const OUTPUT_JSON = new URL("../reviews/hoi-an-link-audit.json", import.meta.url);
const OUTPUT_MD = new URL("../reviews/hoi-an-suspected-closed.md", import.meta.url);
const TIMEOUT_MS = 12000;

function classifyResult(result) {
  if (result.error) {
    return {
      category: "review",
      reason: `Request failed: ${result.error}`,
      severity: "high",
    };
  }

  if (result.status === 404 || result.status === 410) {
    return {
      category: "suspected_closed",
      reason: `URL returned HTTP ${result.status}`,
      severity: "high",
    };
  }

  if (result.location && result.location.includes("suspendedpage.cgi")) {
    return {
      category: "suspected_closed",
      reason: "Website redirects to suspended hosting page",
      severity: "high",
    };
  }

  if (result.location && result.url.includes("facebook.com/")) {
    try {
      const original = new URL(result.url);
      const redirected = new URL(result.location, result.url);
      const originalPath = original.pathname.replace(/\/+$/, "").toLowerCase();
      const redirectedPath = redirected.pathname.replace(/\/+$/, "").toLowerCase();
      if (redirected.hostname.includes("facebook.com") && originalPath !== redirectedPath) {
        return {
          category: "review",
          reason: `Facebook URL redirects to a different page: ${redirected.pathname}`,
          severity: "medium",
        };
      }
    } catch {
      return {
        category: "review",
        reason: `Redirect needs manual check: ${result.location}`,
        severity: "medium",
      };
    }
  }

  return {
    category: "ok",
    reason: result.location ? `Redirects to ${result.location}` : `HTTP ${result.status}`,
    severity: "low",
  };
}

async function fetchStatus(cafe) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(cafe.url, {
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 CafeVoyageLinkAudit/1.0",
      },
    });
    return {
      name: cafe.name,
      address: cafe.address,
      url: cafe.url,
      status: response.status,
      location: response.headers.get("location") || "",
      checked_at: new Date().toISOString(),
    };
  } catch (error) {
    return {
      name: cafe.name,
      address: cafe.address,
      url: cafe.url,
      error: error.name || "Error",
      message: error.message || "",
      checked_at: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timer);
  }
}

function toMarkdown(flagged, allResults) {
  const lines = [
    "# Hoi An Link Audit",
    "",
    `Checked at: ${new Date().toISOString()}`,
    "",
    "This file lists cafes whose current website / Facebook link looks suspicious and should be manually reviewed before marking them closed.",
    "",
    "## Flagged For Review",
    "",
  ];

  if (!flagged.length) {
    lines.push("No suspicious links found in this run.", "");
  } else {
    for (const item of flagged) {
      lines.push(`### ${item.name}`);
      lines.push(`- Address: ${item.address || "N/A"}`);
      lines.push(`- URL: ${item.url}`);
      lines.push(`- Finding: ${item.audit.reason}`);
      if (item.status) lines.push(`- HTTP status: ${item.status}`);
      if (item.location) lines.push(`- Redirect: ${item.location}`);
      if (item.error) lines.push(`- Error: ${item.error}${item.message ? ` - ${item.message}` : ""}`);
      lines.push("");
    }
  }

  lines.push("## Full Summary", "");
  for (const item of allResults) {
    lines.push(`- ${item.name}: ${item.audit.category} (${item.audit.reason})`);
  }
  lines.push("");

  return lines.join("\n");
}

const cafes = JSON.parse(await readFile(INPUT_PATH, "utf8")).filter((cafe) => cafe.url);
const results = [];
for (const cafe of cafes) {
  const result = await fetchStatus(cafe);
  result.audit = classifyResult(result);
  results.push(result);
}

const flagged = results.filter((result) => result.audit.category !== "ok");
await mkdir(new URL("../reviews/", import.meta.url), { recursive: true });
await writeFile(OUTPUT_JSON, `${JSON.stringify(results, null, 2)}\n`);
await writeFile(OUTPUT_MD, toMarkdown(flagged, results));

console.log(`Checked ${results.length} cafes`);
console.log(`Flagged ${flagged.length} cafes for review`);
