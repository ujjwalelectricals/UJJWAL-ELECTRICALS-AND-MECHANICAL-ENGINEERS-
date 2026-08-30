import { mkdir, writeFile } from 'node:fs/promises';

const collections = [
  ['BEARINGS & CENTRES', 'https://www.jaibros.com/collections/low-speed-revolving-center/products.json?limit=250'],
  ['BT40 HOLDERS', 'https://www.jaibros.com/collections/bt-40-type/products.json?limit=250'],
  ['ISO40 HOLDERS', 'https://www.jaibros.com/collections/iso40-holders/products.json?limit=250'],
  ['BT30 HOLDERS', 'https://www.jaibros.com/collections/bt-30-type/products.json?limit=250'],
  ['ER COLLETS', 'https://www.jaibros.com/collections/er-collets/products.json?limit=250'],
];

const normalize = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function mapProduct(product, category) {
  const title = normalize(product.title);
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const priced = variants.find((variant) => Number(variant.price) > 0) || variants[0];
  const images = Array.from(new Set((product.images || []).map((image) => image.src).filter(Boolean)));
  return {
    id: `${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${product.id}`,
    name: title,
    brand: product.vendor || 'JAIBROS',
    price: priced ? Number(priced.price) : 0,
    category,
    image: images[0] || '',
    images,
    sourceUrl: `https://www.jaibros.com/products/${product.handle}`,
    tags: product.tags || [],
  };
}

async function getCollection(category, url) {
  const response = await fetch(url, { headers: { 'user-agent': 'Ujjwal-Industrial-Catalog/1.0' } });
  if (!response.ok) throw new Error(`${category}: HTTP ${response.status}`);
  const data = await response.json();
  return (data.products || []).map((product) => mapProduct(product, category)).filter((product) => product.image);
}

const all = [];
for (const [category, url] of collections) {
  try {
    const items = await getCollection(category, url);
    all.push(...items);
    console.log(`${category}: ${items.length} products`);
  } catch (error) {
    console.warn(`Catalog sync skipped ${category}: ${error.message}`);
  }
}

const seen = new Set();
const products = all.filter((product) => {
  if (seen.has(product.id)) return false;
  seen.add(product.id);
  return true;
});

if (products.length < 5) {
  throw new Error('Jaibros sync returned too few products; refusing to overwrite the catalog.');
}

await mkdir('src/data', { recursive: true });
await writeFile('src/data/jaibros-products.json', JSON.stringify({ syncedAt: new Date().toISOString(), products }, null, 2));
console.log(`Saved ${products.length} Jaibros products to src/data/jaibros-products.json`);
