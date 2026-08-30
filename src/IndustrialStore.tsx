import { useMemo, useState } from 'react';

type Product = { name: string; brand: string; price: number; tag: string; image: string; sourceUrl: string; badge?: string };

const cncImage = 'https://image.made-in-china.com/202f0j00bcHiAosBpNqk/WMTCNC-VMC-1050-high-speed-cnc-milling-machine-vertical-machining-center.webp';
const bearingImage = 'https://bearingtech.co.uk/cdn/shop/articles/Steel_Bearing_1024x1024.jpg?v=1544710043';

const products: Product[] = [
  { name: 'Double Bearing Live Center – Precision Revolving Center', brand: 'BUYOHLIC', price: 3070, tag: 'DOUBLE BEARING', image: bearingImage, sourceUrl: 'https://www.jaibros.com/collections/low-speed-revolving-center', badge: 'PRECISION' },
  { name: 'CNC Live Centre – Double Bearings, Standard Nose', brand: 'BUYOHLIC', price: 3090, tag: 'CNC LIVE CENTRE', image: bearingImage, sourceUrl: 'https://www.jaibros.com/collections/revolving-center', badge: 'CNC' },
  { name: 'Triple Bearing High Precision Live Revolving Center', brand: 'BUYOHLIC', price: 3070, tag: 'TRIPLE BEARING', image: bearingImage, sourceUrl: 'https://www.jaibros.com/collections/low-speed-revolving-center', badge: 'HIGH PRECISION' },
  { name: 'MT1 Shank Mini Live Revolving Center – Triple Bearing', brand: 'BUYOHLIC', price: 2149, tag: 'TRIPLE BEARING', image: bearingImage, sourceUrl: 'https://www.jaibros.com/collections/low-speed-revolving-center' },
  { name: 'Live Center Small Slim Body – Triple Bearing', brand: 'BUYOHLIC', price: 2489, tag: 'TRIPLE BEARING', image: bearingImage, sourceUrl: 'https://www.jaibros.com/collections/low-speed-revolving-center', badge: '10 MICRON' },
  { name: 'Precision Double Bearings Live Revolving Center', brand: 'BUYOHLIC', price: 3090, tag: 'DOUBLE BEARING', image: bearingImage, sourceUrl: 'https://www.jaibros.com/collections/low-speed-revolving-center', badge: 'RUNOUT < 0.01 MM' },
  { name: 'Double Bearing Lathe Machine Center – Long Tip', brand: 'BUYOHLIC', price: 3070, tag: 'DOUBLE BEARING', image: bearingImage, sourceUrl: 'https://www.jaibros.com/collections/lathe-machine-tools-accessories' },
  { name: 'CNC / VMC Vertical Machining Center – Visual Reference', brand: 'VMC / CNC', price: 0, tag: 'CNC MACHINES', image: cncImage, sourceUrl: 'https://wmtcnc.en.made-in-china.com/product/gduaUCDTgrWh/China-WMTCNC-VMC-1050-high-speed-cnc-milling-machine-vertical-machining-center.html', badge: 'FEATURED VISUAL' },
];

const categories = ['ALL', 'DOUBLE BEARING', 'TRIPLE BEARING', 'CNC LIVE CENTRE', 'CNC MACHINES'];

export default function IndustrialStore() {
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState('');
  const [bag, setBag] = useState<number[]>([]);
  const [menu, setMenu] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      const matchesCategory = category === 'ALL' || p.tag === category;
      const matchesQuery = !q || `${p.name} ${p.brand} ${p.tag}`.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
    if (sort === 'price-low') return [...list].sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    if (sort === 'price-high') return [...list].sort((a, b) => (b.price || -1) - (a.price || -1));
    return list;
  }, [category, query, sort]);

  const toggleBag = (index: number) => setBag((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);

  return (
    <section id="store" className="industrial-store">
      <div className="store-topbar"><span>UJJWAL INDUSTRIAL STORE</span><span>PRECISION COMPONENTS / CNC / ROTATING CENTERS</span></div>
      <header className="store-header">
        <button className="store-menu" onClick={() => setMenu(!menu)} aria-expanded={menu}>MENU</button>
        <a className="store-logo" href="#store">UE<span>INDUSTRIAL</span></a>
        <nav className={menu ? 'store-nav open' : 'store-nav'}>
          <a href="#store" onClick={() => setMenu(false)}>SHOP</a><a href="#components" onClick={() => setMenu(false)}>3D LAB</a><a href="#services" onClick={() => setMenu(false)}>SERVICES</a><a href="#contact" onClick={() => setMenu(false)}>CONTACT</a>
        </nav>
        <div className="store-actions"><label className="store-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search components" aria-label="Search components" /></label><button className="bag" onClick={() => document.getElementById('shortlist')?.scrollIntoView({ behavior: 'smooth' })}>SHORTLIST ({bag.length})</button></div>
      </header>
      <div className="store-hero">
        <img src={cncImage} alt="Vertical CNC machining center reference" />
        <div className="store-hero-overlay"><span>ENGINEERED FOR THE SHOP FLOOR</span><h2>BEARINGS<br /><em>IN MOTION.</em></h2><p>Explore bearing-related tooling and precision rotating centers referenced from the Jaibros catalog in a clean industrial storefront.</p><a href="#products" className="shop-now">SHOP THE COLLECTION <b>→</b></a></div>
        <div className="hero-corner"><span>VMC / CNC REFERENCE</span><small>SELECTED INDUSTRIAL MACHINE VIEW</small></div>
      </div>
      <section id="products" className="store-products">
        <div className="store-title-row"><div><span className="store-kicker">01 / SHOP</span><h3>Precision rotating components</h3></div><span>{filtered.length} ITEMS</span></div>
        <div className="store-controls"><div className="category-scroll">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products"><option value="featured">SORT: FEATURED</option><option value="price-low">PRICE: LOW TO HIGH</option><option value="price-high">PRICE: HIGH TO LOW</option></select></div>
        <div className="product-grid">{filtered.map((product) => { const index = products.indexOf(product); const selected = bag.includes(index); return <article className="product-card" key={`${product.name}-${index}`}><a href={product.sourceUrl} target="_blank" rel="noreferrer" className="product-image"><img src={product.image} alt={product.name} loading="lazy" />{product.badge && <span className="product-badge">{product.badge}</span>}<span className="quick-view">VIEW SOURCE ↗</span></a><div className="product-copy"><div className="product-meta"><span>{product.brand}</span><span>{product.tag}</span></div><h4>{product.name}</h4>{product.price > 0 ? <strong>₹{product.price.toLocaleString('en-IN')}</strong> : <strong>ENQUIRE</strong>}<button className={selected ? 'shortlisted selected' : 'shortlisted'} onClick={() => toggleBag(index)}>{selected ? '✓ SAVED' : '+ SHORTLIST'}</button></div></article>; })}</div>
        {filtered.length === 0 && <div className="empty-shop">NO MATCHES — TRY “BEARING”, “CNC” OR A CATEGORY.</div>}
      </section>
      <section id="shortlist" className="store-shortlist"><div><span className="store-kicker">02 / YOUR SHORTLIST</span><h3>Ready to <em>enquire?</em></h3><p>Saved items are collected here. Product names and listed prices are based on the current Jaibros catalog and can change; this page sends an enquiry rather than pretending to be a direct checkout.</p></div><div className="shortlist-items">{bag.length ? bag.map((index) => { const p = products[index]; return <div key={index}><span>{p.tag}</span><b>{p.name}</b><strong>{p.price ? `₹${p.price.toLocaleString('en-IN')}` : 'ENQUIRE'}</strong></div>; }) : <span className="shortlist-empty">YOUR SHORTLIST IS EMPTY</span>}<a className="enquire-btn" href="mailto:ujjwalelectricals@gmail.com?subject=Industrial%20component%20enquiry">SEND ENQUIRY →</a></div></section>
      <div className="store-source-note"><span>CATALOG REFERENCE: JAIBROS</span><a href="https://www.jaibros.com/" target="_blank" rel="noreferrer">OPEN JAIBROS ↗</a><span>VISUAL REFERENCE: WEB SOURCES</span></div>
    </section>
  );
}
