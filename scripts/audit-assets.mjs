import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'public/hero-bearing-6200.svg',
  'public/product-image-fallback.svg',
  'public/ue-mark.svg',
  'public/bearings-catalog.json',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
];

const failures = [];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`Missing required asset: ${rel}`);
}

for (const rel of ['public/bearings-catalog.json', 'public/industrial-products.json']) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(data.products)) failures.push(`${rel}: products must be an array`);
    for (const product of data.products ?? []) {
      if (!product?.id || !product?.name || !product?.image) {
        failures.push(`${rel}: product is missing id/name/image`);
        break;
      }
      const urls = [product.image, ...(product.images ?? [])];
      if (urls.some((url) => /(?:jaibros\.com|www\.jaibros\.com)/i.test(String(url)))) {
        failures.push(`${rel}: supplier image URL detected for ${product.id}`);
        break;
      }
    }
  } catch (error) {
    failures.push(`${rel}: invalid JSON (${error.message})`);
  }
}

const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
if (!app.includes('BASE=import.meta.env.BASE_URL')) failures.push('src/App.tsx: BASE_URL asset guard missing');
if (!app.includes('product-image-fallback.svg')) failures.push('src/App.tsx: fallback image reference missing');
if (!app.includes('onError={e=>')) failures.push('src/App.tsx: hero image error fallback missing');

const fallback = path.join(root, 'public/product-image-fallback.svg');
if (fs.existsSync(fallback)) {
  const text = fs.readFileSync(fallback, 'utf8');
  if (!text.trim().startsWith('<svg') || !text.includes('</svg>')) failures.push('public/product-image-fallback.svg: invalid SVG markup');
  if (text.includes('${') || text.includes('Array(')) failures.push('public/product-image-fallback.svg: dynamic template text leaked into static SVG');
}

if (failures.length) {
  console.error('ASSET AUDIT FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('ASSET AUDIT PASSED');
console.log(`Verified ${required.length} required local assets and catalog/image invariants.`);
