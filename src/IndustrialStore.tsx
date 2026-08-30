import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  sourceUrl: string;
  tags?: string[];
};

type Catalog = { syncedAt?: string; products: Product[] };

const CATEGORIES = [
  'ALL',
  'BEARINGS & CENTRES',
  'HIGH-SPEED CENTRES',
  'BT40 HOLDERS',
  'ISO40 HOLDERS',
  'SK40 HOLDERS',
  'BT40 BCA',
  'BBT40 HOLDERS',
  'BT30 HOLDERS',
  'HSK HOLDERS',
  'ER COLLETS',
  'ER TAP COLLETS',
  'ER NUTS',
  'ER SPANNERS',
  'PULL STUDS',
  'LOCKING DEVICES',
  'EDGE FINDERS',
  'KEYLESS DRILL CHUCKS',
  'STRAIGHT SHANK CHUCKS',
  'BORING HEADS',
  'COLLET CHUCKS',
  'VICES',
  'KNURLING TOOLS',
  'MACHINE TOOLS & ACCESSORIES',
  'ACCESSORIES',
  'LATHE TOOLS & ACCESSORIES',
  'CARBIDE CUTTERS',
];

const COLLECTION_KEY = 'ujjwal-industrial-collection-v2';

export default function IndustrialStore() {
  const [catalog, setCatalog] = useState<Catalog>({ products: [] });
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState<string[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [gallery, setGallery] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(COLLECTION_KEY) || '[]');
      if (Array.isArray(saved)) setCollection(saved.filter((value): value is string => typeof value === 'string'));
    } catch {
      localStorage.removeItem(COLLECTION_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  }, [collection]);

  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}jaibros-products.json`, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`Catalog HTTP ${response.status}`);
        return response.json() as Promise<Catalog>;
      })
      .then((data) => {
        if (!alive) return;
        if (!Array.isArray(data.products)) throw new Error('Invalid catalog format');
        setCatalog(data);
        setError('');
      })
      .catch(() => {
        if (alive) setError('The live catalog is temporarily unavailable. Refresh once the deployment finishes.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null); };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = catalog.products.filter((product) => {
      const categoryMatch = category === 'ALL' || product.category === category;
      const haystack = `${product.name} ${product.brand} ${product.category} ${(product.tags || []).join(' ')}`.toLowerCase();
      return categoryMatch && (!q || haystack.includes(q));
    });
    if (sort === 'price-low') list = [...list].sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    if (sort === 'price-high') list = [...list].sort((a, b) => (b.price || -1) - (a.price || -1));
    return list;
  }, [catalog.products, category, query, sort]);

  const toggleCollection = (id: string) => {
    setCollection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const openProduct = (product: Product) => {
    setSelected(product);
    setGallery(0);
  };

  const selectedImages = selected?.images?.length ? selected.images : selected ? [selected.image] : [];
  const savedProducts = collection.map((id) => catalog.products.find((product) => product.id === id)).filter(Boolean) as Product[];

  return (
    <section id="store" className="industrial-store">
      <div className="store-topbar"><span>UJJWAL INDUSTRIAL STORE</span><span>BEARINGS / BT40 / ISO40 / BT30 / ER / CNC TOOLING</span></div>

      <header className="store-header">
        <a className="store-logo" href="#store">UE<span>INDUSTRIAL</span></a>
        <nav className="store-nav"><a href="#products">SHOP</a><a href="#components">3D LAB</a><a href="#services">SERVICES</a><a href="#contact">CONTACT</a></nav>
        <div className="store-actions">
          <label className="store-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search BT40, ER32, bearing…" aria-label="Search industrial products" /></label>
          <button className="bag" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>COLLECTION ({collection.length})</button>
        </div>
      </header>

      <div className="store-hero store-hero-no-cnc">
        <div className="hero-product-art">
          <img src="https://www.jaibros.com/cdn/shop/files/20_b988e55f-0aef-4eab-bf1b-ed47b2cf875f.jpg?v=1785825100" alt="Jaibros BT40 ER32 tool holder" />
          <div className="hero-art-ring" />
          <div className="hero-art-label">BT40 / ER32 / PRECISION</div>
        </div>
        <div className="store-hero-overlay">
          <span>JAIBROS-CURATED INDUSTRIAL CATALOG</span>
          <h2>PRECISION<br /><em>TOOLING.</em></h2>
          <p>Browse bearing centres, CNC VMC tooling, BT40 and BT30 holders, ISO40, SK40, BBT40, HSK, ER collets, boring heads and machine-shop accessories.</p>
          <a href="#products" className="shop-now">EXPLORE THE CATALOG <b>→</b></a>
        </div>
        <div className="hero-corner"><span>BUILD CATALOG</span><small>{catalog.syncedAt ? 'SYNCED FROM JAIBROS' : 'LOADING CATALOG'}</small></div>
      </div>

      <section id="products" className="store-products">
        <div className="store-title-row"><div><span className="store-kicker">01 / SHOP</span><h3>Everything around the spindle.</h3></div><span>{loading ? 'SYNCING' : `${filtered.length} PRODUCTS`}</span></div>

        <div className="store-controls">
          <div className="category-scroll">{CATEGORIES.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">SORT: FEATURED</option><option value="price-low">PRICE: LOW TO HIGH</option><option value="price-high">PRICE: HIGH TO LOW</option></select>
        </div>

        {loading ? <div className="catalog-loading"><span /> BUILDING LIVE JAIBROS CATALOG…</div> : error ? <div className="empty-shop">{error}</div> : (
          <div className="product-grid">
            {filtered.map((product) => {
              const saved = collection.includes(product.id);
              return (
                <article className="product-card" key={product.id} onClick={() => openProduct(product)}>
                  <div className="product-image">
                    <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                    <span className="product-badge">{product.category.replace(' HOLDERS', '')}</span>
                    <button className={saved ? 'collect selected' : 'collect'} aria-label={saved ? `Remove ${product.name} from collection` : `Add ${product.name} to collection`} onClick={(event) => { event.stopPropagation(); toggleCollection(product.id); }}>{saved ? '♥' : '♡'}</button>
                    <span className="inspect-label">INSPECT</span>
                  </div>
                  <div className="product-copy"><div className="product-meta"><span>{product.brand}</span><span>{product.category}</span></div><h4>{product.name}</h4><div className="product-bottom"><strong>{product.price > 0 ? `₹${product.price.toLocaleString('en-IN')}` : 'ENQUIRE'}</strong><button className="inspect-button" onClick={(event) => { event.stopPropagation(); openProduct(product); }}>VIEW DETAILS →</button></div></div>
                </article>
              );
            })}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && <div className="empty-shop">NO MATCHES — TRY “BT40”, “ER32”, “BEARING” OR “ISO40”.</div>}
      </section>

      <section id="collection" className="store-shortlist">
        <div><span className="store-kicker">02 / MY COLLECTION</span><h3>Save parts for your <em>enquiry.</em></h3><p>Tap the heart on any product to build a persistent collection. Prices and availability should be confirmed on the live Jaibros listing before purchase.</p></div>
        <div className="shortlist-items">
          {savedProducts.length ? savedProducts.map((product) => <div key={product.id}><span>{product.category}</span><b>{product.name}</b><strong>{product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'ENQUIRE'}</strong></div>) : <span className="shortlist-empty">YOUR COLLECTION IS EMPTY</span>}
          <a className="enquire-btn" href="mailto:ujjwalelectricals@gmail.com?subject=Industrial%20tooling%20enquiry">SEND ENQUIRY →</a>
        </div>
      </section>

      <div className="store-source-note"><span>CATALOG + PRODUCT IMAGERY: JAIBROS</span><span>LIVE PRICES / AVAILABILITY: VERIFY ON PRODUCT PAGE</span></div>

      {selected && <div className="product-modal" role="dialog" aria-modal="true" aria-label={selected.name} onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}>
        <div className="product-modal-card">
          <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close product details">×</button>
          <div className="modal-gallery"><div className="modal-main-image"><img src={selectedImages[gallery] || selected.image} alt={selected.name} decoding="async" /></div><div className="modal-thumbs">{selectedImages.map((image, index) => <button key={`${image}-${index}`} className={gallery === index ? 'active' : ''} onClick={() => setGallery(index)}><img src={image} alt="" loading="lazy" /></button>)}</div></div>
          <div className="modal-copy"><span className="store-kicker">{selected.category}</span><h3>{selected.name}</h3><p>{selected.brand} • product imagery, variants and catalog metadata are synchronized from Jaibros at build time.</p><div className="modal-price">{selected.price ? `₹${selected.price.toLocaleString('en-IN')}` : 'PRICE ON ENQUIRY'}</div><div className="modal-specs">{(selected.tags || []).slice(0, 10).map((tag) => <span key={tag}>{String(tag).toUpperCase()}</span>)}</div><div className="modal-actions"><button className="enquire-btn" onClick={() => toggleCollection(selected.id)}>{collection.includes(selected.id) ? 'REMOVE FROM COLLECTION' : 'ADD TO COLLECTION'}</button><a className="modal-link" href={selected.sourceUrl} target="_blank" rel="noreferrer">OPEN JAIBROS PRODUCT ↗</a></div></div>
        </div>
      </div>}
    </section>
  );
}
