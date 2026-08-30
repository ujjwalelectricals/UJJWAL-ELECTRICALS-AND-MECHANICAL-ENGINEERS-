import { mkdir, writeFile } from 'node:fs/promises';

const collections = [
  ['BEARINGS & CENTRES', 'low-speed-revolving-center'],
  ['HIGH-SPEED CENTRES', 'revolving-center'],
  ['BT40 HOLDERS', 'bt-40-type'],
  ['ISO40 HOLDERS', 'iso40-holders'],
  ['SK40 HOLDERS', 'sk-40-type'],
  ['BT40 BCA', 'bt-40-bca'],
  ['BBT40 HOLDERS', 'bbt40-holders'],
  ['BT30 HOLDERS', 'bt-30-type'],
  ['HSK HOLDERS', 'hsk-holders'],
  ['ER COLLETS', 'er-collets'],
  ['ER TAP COLLETS', 'er-tap-collets'],
  ['ER NUTS', 'er-nuts'],
  ['ER SPANNERS', 'er-spanners'],
  ['PULL STUDS', 'pull-studs'],
  ['LOCKING DEVICES', 'locking-device'],
  ['EDGE FINDERS', 'edge-finders'],
  ['KEYLESS DRILL CHUCKS', 'keyless-drill-chuck'],
  ['STRAIGHT SHANK CHUCKS', 'straight-shank-chucks'],
  ['BORING HEADS', 'boring-heads'],
  ['COLLET CHUCKS', 'collet-chucks'],
  ['VICES', 'vices'],
  ['KNURLING TOOLS', 'knurling-tools'],
  ['MACHINE TOOLS & ACCESSORIES', 'machine-tools-accessories'],
  ['ACCESSORIES', 'accessories'],
  ['LATHE TOOLS & ACCESSORIES', 'lathe-machine-tools-accessories'],
  ['CARBIDE CUTTERS', 'carbide-cutters'],
];

const BASE = 'https://www.jaibros.com/collections';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const normalize = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function mapProduct(product, category) {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const priced = variants.find((variant) => Number(variant.price) > 0) || variants[0];
  const images = Array.from(new Set((product.images || []).map((image) => image.src).filter(Boolean)));
  return {
    id: `${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${product.id}`,
    name: normalize(product.title),
    brand: normalize(product.vendor || 'JAIBROS'),
    price: priced ? Number(priced.price) : 0,
    category,
    image: images[0] || '',
    images,
    sourceUrl: `https://www.jaibros.com/products/${product.handle}`,
    tags: Array.isArray(product.tags) ? product.tags : [],
  };
}

async function getCollection(category, handle) {
  const items = [];
  for (let page = 1; page <= 25; page += 1) {
    const url = `${BASE}/${handle}/products.json?limit=250&page=${page}`;
    const response = await fetch(url, { headers: { 'user-agent': 'Ujjwal-Industrial-Catalog/1.0' } });
    if (!response.ok) {
      if (page === 1) throw new Error(`${category}: HTTP ${response.status}`);
      break;
    }
    const data = await response.json();
    const batch = Array.isArray(data.products) ? data.products : [];
    items.push(...batch.map((product) => mapProduct(product, category)).filter((product) => product.image));
    if (batch.length < 250) break;
    await sleep(120);
  }
  return items;
}

const all = [];
for (const [category, handle] of collections) {
  try {
    const items = await getCollection(category, handle);
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

if (products.length < 5) throw new Error('Jaibros sync returned too few products; refusing to overwrite the catalog.');

await mkdir('public', { recursive: true });
await writeFile('public/jaibros-products.json', JSON.stringify({ syncedAt: new Date().toISOString(), products }, null, 2));
console.log(`Saved ${products.length} unique Jaibros products to public/jaibros-products.json`);
