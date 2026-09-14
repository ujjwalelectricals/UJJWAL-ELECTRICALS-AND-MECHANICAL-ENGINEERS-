const BASE = 'https://ujjwalelectricals.github.io/UJJWAL-ELECTRICALS-AND-MECHANICAL-ENGINEERS-/';
const COMPANY = 'UJJWAL ELECTRICAL AND MECHANICAL ENGINEERS ENTERPRISE';

export type SeoPage = 'home' | 'services' | 'shop';

type SeoOptions = {
  page: SeoPage;
  product?: {
    id: string;
    name: string;
    brand: string;
    category: string;
    image?: string;
    price?: number;
  } | null;
};

function setMeta(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setJsonLd(id: string, payload: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(payload);
}

export function applySeo({ page, product = null }: SeoOptions) {
  const pageMeta = {
    home: {
      title: `${COMPANY} | CNC, VMC, Bearings & Industrial Engineering`,
      description: 'CNC and VMC service, industrial electrical and mechanical engineering, bearings and machine-shop tooling support in Ghaziabad, India.',
    },
    services: {
      title: `Industrial Engineering Services | ${COMPANY}`,
      description: 'CNC service and maintenance, industrial electrical work, mechanical engineering, plant installation, spindle/tooling support and breakdown response in Ghaziabad.',
    },
    shop: {
      title: `Industrial Bearings & CNC Tooling Catalogue | ${COMPANY}`,
      description: 'Industrial catalogue for deep groove ball bearings, BT/ISO/SK/BBT/HSK tooling, ER collets, pull studs, boring heads and machine-shop accessories.',
    },
  }[page];

  document.title = product ? `${product.name} | ${COMPANY}` : pageMeta.title;
  setMeta('description', product
    ? `${product.brand} ${product.name}. Catalogue reference for ${product.category}. Confirm availability, final pricing and suitability before purchase.`
    : pageMeta.description);
  setMeta('robots', 'index,follow,max-image-preview:large');

  setJsonLd('ue-page-schema', {
    '@context': 'https://schema.org',
    '@type': page === 'shop' ? 'CollectionPage' : 'WebPage',
    name: product ? product.name : pageMeta.title,
    description: product ? `${product.brand} ${product.name} — ${product.category}` : pageMeta.description,
    url: product ? `${BASE}#shop/${encodeURIComponent(product.id)}` : `${BASE}#${page}`,
    isPartOf: { '@type': 'WebSite', name: COMPANY, url: BASE },
    about: page === 'services' ? { '@type': 'Thing', name: 'Industrial engineering services' } : undefined,
  });

  if (product) {
    setJsonLd('ue-product-schema', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      sku: product.id,
      brand: { '@type': 'Brand', name: product.brand },
      category: product.category,
      image: product.image ? [product.image] : undefined,
      offers: product.price && product.price > 0 ? {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: product.price,
        availability: 'https://schema.org/InStock',
        url: `${BASE}#shop/${encodeURIComponent(product.id)}`,
      } : undefined,
    });
  } else {
    const productSchema = document.getElementById('ue-product-schema');
    productSchema?.remove();
  }
}
