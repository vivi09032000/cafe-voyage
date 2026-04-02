import { readFile } from "node:fs/promises";

export default async function handler(req, res) {
  const { city } = req.query;
  const normalizedCity = String(city || "").toLowerCase();

  if (["hoi-an-vn", "hoi_an_vn", "hoi-an", "hoi_an"].includes(normalizedCity)) {
    const raw = await readFile(new URL("../data/hoi-an-cafes.json", import.meta.url), "utf8");
    const data = JSON.parse(raw);
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
