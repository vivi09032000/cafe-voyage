export default async function handler(req, res) {
  const { city = 'taipei' } = req.query;
  const response = await fetch(`https://cafenomad.tw/api/v1.2/cafes/${city}`);
  const data = await response.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(data);
}
