import { useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  sourceUrl: string;
  badge?: string;
  specs: string[];
};

const products: Product[] = [
  {
    id: 'mt2-triple-bearing',
    name: 'Small Slim Long Body MT2 Revolving Centre – Triple Bearing',
    brand: 'JAIBROS',
    price: 2489,
    category: 'BEARINGS & CENTRES',
    image: 'https://www.jaibros.com/cdn/shop/files/1_a40250d3-ec09-4415-bb6e-748a283470db.jpg?v=1785302934',
    images: [
      'https://www.jaibros.com/cdn/shop/files/1_a40250d3-ec09-4415-bb6e-748a283470db.jpg?v=1785302934',
      'https://www.jaibros.com/cdn/shop/files/1_3727f388-7ac2-432c-8af0-6affb95b8947.jpg?v=1785302934',
      'https://www.jaibros.com/cdn/shop/files/1_b4bc5428-885c-45d4-9300-971b10adc18c.jpg?v=1785302934',
    ],
    sourceUrl: 'https://www.jaibros.com/products/small-slim-long-body-mt2-revolving-centre-triple-bearing',
    badge: 'TRIPLE BEARING',
    specs: ['MT2 SHANK', '3 PRECISION BEARINGS', '32 MM BODY', '130 MM OVERALL'],
  },
  {
    id: 'bt40-er32',
    name: 'BT40 ER32 Collet Chuck / Holder',
    brand: 'JAIBROS',
    price: 0,
    category: 'BT40 HOLDERS',
    image: 'https://www.jaibros.com/cdn/shop/products/BT40ERColletChuck_301a3d8d-4d2e-4167-a143-44819e8e7ce1.jpg?v=1757075415',
    images: [
      'https://www.jaibros.com/cdn/shop/products/BT40ERColletChuck_301a3d8d-4d2e-4167-a143-44819e8e7ce1.jpg?v=1757075415',
      'https://www.jaibros.com/cdn/shop/products/BT40ERColletChuck_f5092973-c29e-4676-bd03-760aebccd5ae.jpg?v=1757075415',
      'https://www.jaibros.com/cdn/shop/products/BT40ERColletChuck_68d914a3-a094-47bc-8999-cc2c6e99a113.jpg?v=1757075415',
      'https://www.jaibros.com/cdn/shop/products/BT40ERColletChuck_31045a9e-8cb1-411e-86db-183f20ebde83.jpg?v=1757075415',
    ],
    sourceUrl: 'https://www.jaibros.com/products/bt40-er32-collet-chuck-holder',
    badge: 'BT40',
    specs: ['BT40 TAPER', 'ER32 COLLET SYSTEM', 'CNC TOOLING', 'HIGH SPEED'],
  },
  {
    id: 'bt40-face-mill',
    name: 'BT40 FMA22 Face Milling Holder',
    brand: 'JAIBROS',
    price: 0,
    category: 'BT40 HOLDERS',
    image: 'https://www.jaibros.com/cdn/shop/products/BT40FMBFMCFMAFaceMillingHolder.jpg?v=1757075411',
    images: [
      'https://www.jaibros.com/cdn/shop/products/BT40FMBFMCFMAFaceMillingHolder.jpg?v=1757075411',
      'https://www.jaibros.com/cdn/shop/products/FaceMillingHolder_de62368b-0d02-4afb-9d6c-1ac5be242dd1.jpg?v=1757075411',
      'https://www.jaibros.com/cdn/shop/products/FaceMillingHolder_a9b8b922-8444-474c-936c-f38c99f1b708.jpg?v=1757075411',
    ],
    sourceUrl: 'https://www.jaibros.com/products/bt40-fma22-face-milling-holder',
    badge: 'FACE MILL',
    specs: ['BT40 TAPER', 'FMA22 / FMB22 FAMILY', 'FACE MILLING', 'CNC TOOL HOLDER'],
  },
  {
    id: 'bt40-hydraulic',
    name: 'BT40 Hydraulic Expansion Holder',
    brand: 'JAIBROS',
    price: 0,
    category: 'BT40 HOLDERS',
    image: 'https://www.jaibros.com/cdn/shop/files/BT40-HC-6X90.jpg?v=1757074639',
    images: [
      'https://www.jaibros.com/cdn/shop/files/BT40-HC-6X90.jpg?v=1757074639',
      'https://www.jaibros.com/cdn/shop/files/BT-40-HC-8X90.jpg?v=1757074639',
      'https://www.jaibros.com/cdn/shop/files/BT40-HC-10X90.jpg?v=1757074639',
      'https://www.jaibros.com/cdn/shop/files/BT40-HC-12X90.jpg?v=1757074640',
    ],
    sourceUrl: 'https://www.jaibros.com/products/bt40-hydraulic-expansion-chuck',
    badge: 'HYDRAULIC',
    specs: ['BT40 TAPER', 'HYDRAULIC CLAMPING', 'HIGH RUNOUT CONTROL', 'CNC MILLING'],
  },
  {
    id: 'iso40-holder',
    name: 'ISO 40 Face Mill Arbor Holder',
    brand: 'JAIBROS',
    price: 0,
    category: 'ISO40 HOLDERS',
    image: 'https://www.jaibros.com/cdn/shop/products/Untitled-1_cbf12454-f284-401f-ad56-5835f51b5c4e.png?v=1757074805',
    images: [
      'https://www.jaibros.com/cdn/shop/products/Untitled-1_cbf12454-f284-401f-ad56-5835f51b5c4e.png?v=1757074805',
      'https://www.jaibros.com/cdn/shop/products/1_bf7206f0-4a54-4e8c-8d5f-ec55f0939625.jpg?v=1757074804',
      'https://www.jaibros.com/cdn/shop/products/1_b37281f7-48bb-45ef-96f8-98224265a5bb.jpg?v=1757074804',
    ],
    sourceUrl: 'https://www.jaibros.com/products/iso40-holder-face-mill-arbor-adaptor',
    badge: 'ISO40',
    specs: ['ISO40 TAPER', 'FACE MILL ARBOR', 'CNC TOOLING', 'PRECISION FIT'],
  },
  {
    id: 'bt30-er20',
    name: 'BT30 ER20A Collet Chuck',
    brand: 'JAIBROS',
    price: 0,
    category: 'BT30 HOLDERS',
    image: 'https://www.jaibros.com/cdn/shop/products/Bt30ErColletChuck_14024ea7-d4fd-4d0b-a739-520b1a602b1e.jpg?v=1757075398',
    images: [
      'https://www.jaibros.com/cdn/shop/products/Bt30ErColletChuck_14024ea7-d4fd-4d0b-a739-520b1a602b1e.jpg?v=1757075398',
      'https://www.jaibros.com/cdn/shop/products/Bt30ErColletChuck_0740190f-d457-4846-9d1d-25ed38149a49.jpg?v=1757075399',
    ],
    sourceUrl: 'https://www.jaibros.com/products/bt30-er20a-collet-chuck',
    badge: 'BT30',
    specs: ['BT30 TAPER', 'ER20 COLLET SYSTEM', '70 / 100 L FAMILY', 'CNC TOOLING'],
  },
  {
    id: 'bt30-er32',
    name: 'BT30 ER32 Collet Chuck',
    brand: 'JAIBROS',
    price: 0,
    category: 'BT30 HOLDERS',
    image: 'https://www.jaibros.com/cdn/shop/products/BT30ErColletChuck_86885005-57fd-449f-890e-8bdac529007e.jpg?v=1757075396',
    sourceUrl: 'https://www.jaibros.com/products/bt30-er32-collet-chuck',
    badge: 'BT30',
    specs: ['BT30 TAPER', 'ER32 COLLET SYSTEM', 'CNC TOOLING', 'PRECISION HOLDING'],
  },
  {
    id: 'er32-collet',
    name: 'ER32 Precision Collet',
    brand: 'JAIBROS',
    price: 348,
    category: 'ER COLLETS',
    image: 'https://www.jaibros.com/cdn/shop/products/ER32COLLET.jpg?v=1757075280',
    sourceUrl: 'https://www.jaibros.com/products/er32-collet',
    badge: 'ER32',
    specs: ['ER32', 'PRECISION COLLET', 'CNC TOOLING', 'SINGLE COLLET'],
  },
  {
    id: 'er25-collet',
    name: 'ER25 Precision Collet',
    brand: 'JAIBROS',
    price: 253,
    category: 'ER COLLETS',
    image: 'https://www.jaibros.com/cdn/shop/products/ER32COLLET.jpg?v=1757075280',
    sourceUrl: 'https://www.jaibros.com/collections/collet',
    badge: 'ER25',
    specs: ['ER25', 'PRECISION COLLET', 'CNC TOOLING', 'SINGLE COLLET'],
  },
  {
    id: 'er20-collet',
    name: 'ER20 Precision Collet',
    brand: 'JAIBROS',
    price: 247,
    category: 'ER COLLETS',
    image: 'https://www.jaibros.com/cdn/shop/products/ER32COLLET.jpg?v=1757075280',
    sourceUrl: 'https://www.jaibros.com/collections/collet',
    badge: 'ER20',
    specs: ['ER20', 'PRECISION COLLET', 'CNC TOOLING', 'SINGLE COLLET'],
  },
  {
    id: 'er16-collet',
    name: 'ER16 Precision Collet',
    brand: 'JAIBROS',
    price: 241,
    category: 'ER COLLETS',
    image: 'https://www.jaibros.com/cdn/shop/products/ER32COLLET.jpg?v=1757075280',
    sourceUrl: 'https://www.jaibros.com/collections/collet',
    badge: 'ER16',
    specs: ['ER16', 'PRECISION COLLET', 'CNC TOOLING', 'SINGLE COLLET'],
  },
  {
    id: 'er40-collet',
    name: 'ER40 Precision Collet',
    brand: 'JAIBROS',
    price: 412,
    category: 'ER COLLETS',
    image: 'https://www.jaibros.com/cdn/shop/products/ER32COLLET.jpg?v=1757075280',
    sourceUrl: 'https://www.jaibros.com/collections/collet',
    badge: 'ER40',
    specs: ['ER40', 'PRECISION COLLET', 'CNC TOOLING', 'SINGLE COLLET'],
  },
];

const categories = ['ALL', 'BEARINGS & CENTRES', 'BT40 HOLDERS', 'ISO40 HOLDERS', 'BT30 HOLDERS', 'ER COLLETS'];

export default function IndustrialStore() {
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState<string[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [gallery, setGallery] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((product) => {
      const categoryMatch = category === 'ALL' || product.category === category;
      const queryMatch = !q || `${product.name} ${product.brand} ${product.category} ${product.specs.join(' ')}`.toLowerCase().includes(q);
      return categoryMatch && queryMatch;
    });
    if (sort === 'price-low') return [...list].sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    if (sort === 'price-high') return [...list].sort((a, b) => (b.price || -1) - (a.price || -1));
    return list;
  }, [category, query, sort]);

  const openProduct = (product: Product) => {
    setSelected(product);
    setGallery(0);
  };

  const toggleCollection = (id: string) => {
    setCollection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <section id="store" className="industrial-store">
      <div className="store-topbar"><span>UJJWAL INDUSTRIAL STORE</span><span>BEARINGS / BT40 / ISO40 / BT30 / ER COLLETS</span></div>
      <header className="store-header">
        <a className="store-logo" href="#store">UE<span>INDUSTRIAL</span></a>
        <nav className="store-nav"><a href="#products">SHOP</a><a href="#components">3D LAB</a><a href="#services">SERVICES</a><a href="#contact">CONTACT</a></nav>
        <div className="store-actions"><label className="store-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search holders, collets, bearings" aria-label="Search industrial products" /></label><button className="bag" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>COLLECTION ({collection.length})</button></div>
      </header>

      <div className="store-hero store-hero-no-cnc">
        <div className="hero-product-art"><img src={products[0].image} alt="Jaibros triple bearing revolving centre" /><div className="hero-art-ring" /></div>
        <div className="store-hero-overlay"><span>PRECISION TOOLING / JAIBROS CATALOG</span><h2>BUILD YOUR<br /><em>TOOLING STACK.</em></h2><p>Browse bearing-supported centres, BT tooling, ISO40 holders and ER collets presented as a modern industrial collection.</p><a href="#products" className="shop-now">EXPLORE THE COLLECTION <b>→</b></a></div>
        <div className="hero-corner"><span>LIVE CATALOG FORMAT</span><small>PRICES / AVAILABILITY MAY CHANGE</small></div>
      </div>

      <section id="products" className="store-products">
        <div className="store-title-row"><div><span className="store-kicker">01 / SHOP</span><h3>Precision tooling &amp; rotating components</h3></div><span>{filtered.length} ITEMS</span></div>
        <div className="store-controls"><div className="category-scroll">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">SORT: FEATURED</option><option value="price-low">PRICE: LOW TO HIGH</option><option value="price-high">PRICE: HIGH TO LOW</option></select></div>
        <div className="product-grid">{filtered.map((product) => { const saved = collection.includes(product.id); return <article className="product-card" key={product.id} onClick={() => openProduct(product)}><div className="product-image"><img src={product.image} alt={product.name} loading="lazy" />{product.badge && <span className="product-badge">{product.badge}</span>}<button className={saved ? 'collect selected' : 'collect'} aria-label={saved ? `Remove ${product.name} from collection` : `Add ${product.name} to collection`} onClick={(event) => { event.stopPropagation(); toggleCollection(product.id); }}>{saved ? '♥' : '♡'}</button><span className="inspect-label">INSPECT</span></div><div className="product-copy"><div className="product-meta"><span>{product.brand}</span><span>{product.category}</span></div><h4>{product.name}</h4><div className="product-bottom"><strong>{product.price > 0 ? `₹${product.price.toLocaleString('en-IN')}` : 'ENQUIRE'}</strong><button className="inspect-button" onClick={(event) => { event.stopPropagation(); openProduct(product); }}>VIEW DETAILS →</button></div></div></article>; })}</div>
        {filtered.length === 0 && <div className="empty-shop">NO MATCHES — TRY “BT40”, “ER32”, “BEARING” OR “ISO40”.</div>}
      </section>

      <section id="collection" className="store-shortlist"><div><span className="store-kicker">02 / MY COLLECTION</span><h3>Save the parts you want to <em>enquire about.</em></h3><p>Your collection is stored for this session. Prices and product availability should be confirmed with the supplier before purchase.</p></div><div className="shortlist-items">{collection.length ? collection.map((id) => { const product = products.find((item) => item.id === id); if (!product) return null; return <div key={id}><span>{product.category}</span><b>{product.name}</b><strong>{product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'ENQUIRE'}</strong></div>; }) : <span className="shortlist-empty">YOUR COLLECTION IS EMPTY</span>}<a className="enquire-btn" href="mailto:ujjwalelectricals@gmail.com?subject=Industrial%20tooling%20enquiry">SEND ENQUIRY →</a></div></section>

      <div className="store-source-note"><span>CATALOG DATA / IMAGERY: JAIBROS</span><span>PRODUCT LINKS OPEN JAIBROS</span></div>

      {selected && (
        <div className="product-modal" role="dialog" aria-modal="true" aria-label={selected.name} onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}>
          <div className="product-modal-card">
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close product details">×</button>
            <div className="modal-gallery"><div className="modal-main-image"><img src={(selected.images || [selected.image])[gallery] || selected.image} alt={selected.name} /></div><div className="modal-thumbs">{(selected.images || [selected.image]).map((image, index) => <button key={image} className={gallery === index ? 'active' : ''} onClick={() => setGallery(index)}><img src={image} alt="" /></button>)}</div></div>
            <div className="modal-copy"><span className="store-kicker">{selected.category}</span><h3>{selected.name}</h3><p>{selected.brand} catalog item presented in the Ujjwal industrial collection.</p><div className="modal-price">{selected.price ? `₹${selected.price.toLocaleString('en-IN')}` : 'PRICE ON ENQUIRY'}</div><div className="modal-specs">{selected.specs.map((spec) => <span key={spec}>{spec}</span>)}</div><div className="modal-actions"><button className="enquire-btn" onClick={() => toggleCollection(selected.id)}>{collection.includes(selected.id) ? 'REMOVE FROM COLLECTION' : 'ADD TO COLLECTION'}</button><a className="modal-link" href={selected.sourceUrl} target="_blank" rel="noreferrer">OPEN PRODUCT ↗</a></div></div>
          </div>
        </div>
      )}
    </section>
  );
}
