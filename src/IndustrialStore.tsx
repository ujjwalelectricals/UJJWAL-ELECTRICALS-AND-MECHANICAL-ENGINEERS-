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

const FALLBACK: Catalog = { products: [] };
const CATEGORIES = ['ALL', 'BEARINGS & CENTRES', 'BT40 HOLDERS', 'ISO40 HOLDERS', 'BT30 HOLDERS', 'ER COLLETS'];

export default function IndustrialStore() {
  const [catalog, setCatalog] = useState<Catalog>(FALLBACK);
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState<string[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [gallery, setGallery] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}jaibros-products.json`, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`Catalog HTTP ${response.status}`);
        return response.json() as Promise<Catalog>;
      })
      .then((data) => { if (alive && Array.isArray(data.products)) setCatalog(data); })
      .catch(() => { /* Keep the lightweight empty state instead of breaking the whole site. */ })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = catalog.products.filter((product) => {
      const categoryMatch = category === 'ALL' || product.category === category;
      const haystack = `${product.name} ${product.brand} ${product.category} ${(product.tags || []).join(' ')}`.toLowerCase();
      return categoryMatch && (!q || haystack.includes(q));
    });
    if (sort === 'price-low') list = [...list].sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    if (sort === 'price-high') list = [...list].sort((a, b) => (b.price || -1) - (a.price || -1));
    return list.slice(0, 36);
  }, [catalog, category, query, sort]);

  const openProduct = (product: Product) => { setSelected(product); setGallery(0); };
  const toggleCollection = (id: string) => setCollection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const selectedImages = selected?.images?.length ? selected.images : selected ? [selected.image] : [];

  return (
    <section id="store" className="industrial-store">
      <div className="store-topbar"><span>UJJWAL INDUSTRIAL STORE</span><span>BEARINGS / BT40 / ISO40 / BT30 / ER COLLETS</span></div>
      <header className="store-header">
        <a className="store-logo" href="#store">UE<span>INDUSTRIAL</span></a>
        <nav className="store-nav"><a href="#products">SHOP</a><a href="#components">3D LAB</a><a href="#services">SERVICES</a><a href="#contact">CONTACT</a></nav>
        <div className="store-actions"><label className="store-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search holders, collets, bearings" aria-label="Search industrial products" /></label><button className="bag" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>COLLECTION ({collection.length})</button></div>
      </header>

      <div className="store-hero store-hero-no-cnc">
        <div className="hero-product-art"><img src="https://www.jaibros.com/cdn/shop/files/1_a40250d3-ec09-4415-bb6e-748a283470db.jpg?v=1785302934" alt="Jaibros triple bearing revolving centre" /><div className="hero-art-ring" /><div className="hero-art-label">BT / ISO / ER / BEARING</div></div>
        <div className="store-hero-overlay"><span>JAIBROS-CURATED INDUSTRIAL CATALOG</span><h2>PRECISION<br /><em>TOOLING.</em></h2><p>Explore bearing centres, BT40 tooling, ISO40 holders, BT30 holders and ER collets in a clean product experience built for industrial buyers.</p><a href="#products" className="shop-now">SHOP THE COLLECTION <b>→</b></a></div>
        <div className="hero-corner"><span>CATALOG SYNC</span><small>{catalog.syncedAt ? 'LIVE BUILD SNAPSHOT' : 'INITIAL SNAPSHOT'}</small></div>
      </div>

      <section id="products" className="store-products">
        <div className="store-title-row"><div><span className="store-kicker">01 / SHOP</span><h3>Tooling for the machine shop</h3></div><span>{loading ? 'SYNCING' : `${filtered.length} SHOWN`}</span></div>
        <div className="store-controls"><div className="category-scroll">{CATEGORIES.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">SORT: FEATURED</option><option value="price-low">PRICE: LOW TO HIGH</option><option value="price-high">PRICE: HIGH TO LOW</option></select></div>
        {loading ? <div className="catalog-loading"><span /> LOADING JAIBROS CATALOG…</div> : (
          <div className="product-grid">
            {filtered.map((product) => { const saved = collection.includes(product.id); return (
              <article className="product-card" key={product.id} onClick={() => openProduct(product)}>
                <div className="product-image"><img src={product.image} alt={product.name} loading="lazy" />
                  <span className="product-badge">{product.category.replace(' HOLDERS', '')}</span>
                  <button className={saved ? 'collect selected' : 'collect'} aria-label={saved ? `Remove ${product.name} from collection` : `Add ${product.name} to collection`} onClick={(event) => { event.stopPropagation(); toggleCollection(product.id); }}>{saved ? '♥' : '♡'}</button>
                  <span className="inspect-label">INSPECT</span>
                </div>
                <div className="product-copy"><div className="product-meta"><span>{product.brand}</span><span>{product.category}</span></div><h4>{product.name}</h4><div className="product-bottom"><strong>{product.price > 0 ? `₹${product.price.toLocaleString('en-IN')}` : 'ENQUIRE'}</strong><button className="inspect-button" onClick={(event) => { event.stopPropagation(); openProduct(product); }}>VIEW DETAILS →</button></div></div>
              </article>
            ); })}
          </div>
        )}
        {!loading && filtered.length === 0 && <div className="empty-shop">NO MATCHES — TRY “BT40”, “ER32”, “BEARING” OR “ISO40”.</div>}
      </section>

      <section id="collection" className="store-shortlist"><div><span className="store-kicker">02 / MY COLLECTION</span><h3>Save parts for your <em>enquiry.</em></h3><p>Build a personal shortlist while browsing. The final product link opens the corresponding Jaibros page for current availability and checkout.</p></div><div className="shortlist-items">{collection.length ? collection.map((id) => { const product = catalog.products.find((item) => item.id === id); if (!product) return null; return <div key={id}><span>{product.category}</span><b>{product.name}</b><strong>{product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'ENQUIRE'}</strong></div>; }) : <span className="shortlist-empty">YOUR COLLECTION IS EMPTY</span>}<a className="enquire-btn" href="mailto:ujjwalelectricals@gmail.com?subject=Industrial%20tooling%20enquiry">SEND ENQUIRY →</a></div></section>

      <div className="store-source-note"><span>CATALOG + PRODUCT IMAGERY: JAIBROS</span><span>PRICES / AVAILABILITY: VERIFY AT CHECKOUT</span></div>

      {selected && <div className="product-modal" role="dialog" aria-modal="true" aria-label={selected.name} onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}>
        <div className="product-modal-card"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close product details">×</button>
          <div className="modal-gallery"><div className="modal-main-image"><img src={selectedImages[gallery] || selected.image} alt={selected.name} /></div><div className="modal-thumbs">{selectedImages.map((image, index) => <button key={image} className={gallery === index ? 'active' : ''} onClick={() => setGallery(index)}><img src={image} alt="" /></button>)}</div></div>
          <div className="modal-copy"><span className="store-kicker">{selected.category}</span><h3>{selected.name}</h3><p>{selected.brand} • imagery and product data are synced from the Jaibros catalog during the production build.</p><div className="modal-price">{selected.price ? `₹${selected.price.toLocaleString('en-IN')}` : 'PRICE ON ENQUIRY'}</div><div className="modal-specs">{(selected.tags || []).slice(0, 8).map((tag) => <span key={tag}>{String(tag).toUpperCase()}</span>)}</div><div className="modal-actions"><button className="enquire-btn" onClick={() => toggleCollection(selected.id)}>{collection.includes(selected.id) ? 'REMOVE FROM COLLECTION' : 'ADD TO COLLECTION'}</button><a className="modal-link" href={selected.sourceUrl} target="_blank" rel="noreferrer">OPEN JAIBROS PRODUCT ↗</a></div></div>
        </div>
      </div>}
    </section>
  );
}
