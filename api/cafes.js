export default async function handler(req, res) {
  const { city } = req.query;
  const endpoint = city
    ? `https://cafenomad.tw/api/v1.2/cafes/${city}`
    : 'https://cafenomad.tw/api/v1.2/cafes';
  const response = await fetch(endpoint);
  const data = await response.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(data);
}
