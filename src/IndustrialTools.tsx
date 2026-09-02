import { useEffect, useMemo, useState } from 'react';
import './industrial-tools.css';

type Product = { id:string; name:string; brand:string; price:number; category:string; image:string; images?:string[]; tags?:string[] };
type Catalog = { products: Product[] };

const BEARINGS = [
  { id:'6200', brand:'SKF / NSK / NTN / FAG', part:'6200', bore:10, od:30, width:9, type:'Deep Groove', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
  { id:'6201', brand:'SKF / NSK / NTN / FAG', part:'6201', bore:12, od:32, width:10, type:'Deep Groove', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
  { id:'6202', brand:'SKF / NSK / NTN / FAG', part:'6202', bore:15, od:35, width:11, type:'Deep Groove', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
  { id:'6203', brand:'SKF / NSK / NTN / FAG', part:'6203', bore:17, od:40, width:12, type:'Deep Groove', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
  { id:'6204', brand:'SKF / NSK / NTN / FAG', part:'6204', bore:20, od:47, width:14, type:'Deep Groove', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
  { id:'6205', brand:'SKF / NSK / NTN / FAG', part:'6205', bore:25, od:52, width:15, type:'Deep Groove', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
  { id:'6206', brand:'SKF / NSK / NTN / FAG', part:'6206', bore:30, od:62, width:16, type:'Deep Groove', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
  { id:'6207', brand:'SKF / NSK / NTN / FAG', part:'6207', bore:35, od:72, width:17, type:'Deep Groove', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
  { id:'6208', brand:'SKF / NSK / NTN / FAG', part:'6208', bore:40, od:80, width:18, type:'Deep Groove', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
  { id:'6304', brand:'SKF / NSK / NTN / FAG', part:'6304', bore:20, od:52, width:15, type:'Deep Groove / Heavy', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
  { id:'6305', brand:'SKF / NSK / NTN / FAG', part:'6305', bore:25, od:62, width:17, type:'Deep Groove / Heavy', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
  { id:'6306', brand:'SKF / NSK / NTN / FAG', part:'6306', bore:30, od:72, width:19, type:'Deep Groove / Heavy', seal:'Open / ZZ / 2RS', clearance:'Normal / C3' },
];

const MACHINES=['BT30','BT40','BT50','ISO40','SK40','BBT40','HSK'];
const TOOL_TYPES=['ER COLLET CHUCK','END MILL HOLDER','FACE MILL HOLDER','MILLING CHUCK','BORING HEAD','DRILL CHUCK','PULL STUD','ER COLLET','OTHER'];

function whatsappHref(message:string){ return `https://wa.me/919971276078?text=${encodeURIComponent(message)}`; }

export default function IndustrialTools(){
  const [bore,setBore]=useState(''); const [od,setOd]=useState(''); const [width,setWidth]=useState(''); const [bearingBrand,setBearingBrand]=useState('Any'); const [bearingType,setBearingType]=useState('Any'); const [bearingSeal,setBearingSeal]=useState('Any');
  const [machine,setMachine]=useState(''); const [toolType,setToolType]=useState(''); const [toolLength,setToolLength]=useState('');
  const [catalog,setCatalog]=useState<Product[]>([]); const [compare,setCompare]=useState<string[]>([]); const [compareOpen,setCompareOpen]=useState(false); const [quoteOpen,setQuoteOpen]=useState(false); const [filePreview,setFilePreview]=useState(''); const [partNote,setPartNote]=useState('');
  const [toast,setToast]=useState('');
  useEffect(()=>{ Promise.allSettled([fetch(`${import.meta.env.BASE_URL}industrial-products.json`).then(r=>r.ok?r.json():{products:[]}),fetch(`${import.meta.env.BASE_URL}bearings-catalog.json`).then(r=>r.ok?r.json():{products:[]})]).then(([a,b])=>setCatalog([...(a.status==='fulfilled'?a.value.products:[]),...(b.status==='fulfilled'?b.value.products:[])])).catch(()=>{}); },[]);
  const bearingMatches=useMemo(()=>BEARINGS.filter(b=>{ const d=(v:string,n:number)=>!v||Math.abs(Number(v)-n)<=0; return d(bore,b.bore)&&d(od,b.od)&&d(width,b.width)&&(bearingBrand==='Any'||b.brand.toLowerCase().includes(bearingBrand.toLowerCase()))&&(bearingType==='Any'||b.type.includes(bearingType))&&(bearingSeal==='Any'||b.seal.includes(bearingSeal)); }),[bore,od,width,bearingBrand,bearingType,bearingSeal]);
  const toolMatches=useMemo(()=>{ const q=`${machine} ${toolType} ${toolLength}`.toLowerCase().trim(); if(!q)return catalog.filter(p=>/holder|collet|boring|chuck|pull stud/i.test(`${p.name} ${p.category}`)).slice(0,8); return catalog.filter(p=>`${p.name} ${p.category} ${(p.tags||[]).join(' ')}`.toLowerCase().includes(q.split(/\s+/).find(x=>x.length>2)||q)).filter(p=>machine?p.name.toLowerCase().includes(machine.toLowerCase())||p.category.toLowerCase().includes(machine.toLowerCase())||((p.tags||[]).join(' ')).toLowerCase().includes(machine.toLowerCase()):true).slice(0,8); },[catalog,machine,toolType,toolLength]);
  const compareProducts=compare.map(id=>catalog.find(p=>p.id===id)).filter(Boolean) as Product[];
  const addCompare=(id:string)=>setCompare(c=>c.includes(id)?c.filter(x=>x!==id):c.length>=4?[...c.slice(1),id]:[...c,id]);
  const sendPartWhatsApp=()=>window.open(whatsappHref(`UJJWAL ELECTRICAL AND MECHANICAL ENGINEERS ENTERPRISE\n\nPART IDENTIFICATION REQUEST\nMachine: CNC / VMC\nApplication: ${partNote||'Not provided'}\nApproximate details: ${bore||'Not provided'} mm bore / ${od||'Not provided'} mm OD / ${width||'Not provided'} mm width\n\nI have uploaded a reference photo on the website. Please help identify the part and advise the correct specification.`),'_blank','noopener,noreferrer');
  const showToast=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(''),2600)};
  const speak=(text:string)=>{ if('speechSynthesis' in window){window.speechSynthesis.cancel();window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));} };
  return <section className="industrial-tools" aria-label="Industrial engineering tools">
    <div className="tools-head"><div><span className="section-code">02 / INDUSTRIAL TOOLS</span><h2>Find the <em>right part.</em></h2></div><p>Engineering utilities designed to help identify bearings, CNC tooling and the information needed for a quotation.</p></div>
    <div className="tools-bento">
      <article className="tool-panel bearing-finder">
        <div className="tool-panel-head"><div><span>01 / BEARING FINDER</span><h3>Match by dimensions.</h3></div><button className="read-tool" onClick={()=>speak('Bearing finder. Enter bore, outside diameter and width to find matching common bearing series.')}>🔊 READ</button></div>
        <div className="tool-form-grid"><label>Bore (mm)<input inputMode="decimal" value={bore} onChange={e=>setBore(e.target.value)} placeholder="20" /></label><label>Outer diameter (mm)<input inputMode="decimal" value={od} onChange={e=>setOd(e.target.value)} placeholder="47" /></label><label>Width (mm)<input inputMode="decimal" value={width} onChange={e=>setWidth(e.target.value)} placeholder="14" /></label><label>Brand<select value={bearingBrand} onChange={e=>setBearingBrand(e.target.value)}><option>Any</option><option>SKF</option><option>NSK</option><option>NTN</option><option>FAG</option></select></label><label>Type<select value={bearingType} onChange={e=>setBearingType(e.target.value)}><option>Any</option><option>Deep Groove</option><option>Heavy</option></select></label><label>Seal<select value={bearingSeal} onChange={e=>setBearingSeal(e.target.value)}><option>Any</option><option>2RS</option><option>ZZ</option><option>Open</option></select></label></div>
        <div className="tool-results"><strong>{bearingMatches.length} possible match{bearingMatches.length===1?'':'es'}</strong>{bearingMatches.slice(0,5).map(b=><div className="match-row" key={b.id}><div><b>{b.part}</b><span>{b.brand}</span></div><span>{b.bore} × {b.od} × {b.width} mm</span><span>{b.seal}</span><button onClick={()=>{window.location.hash='shop';}}>SHOP →</button></div>)}</div>
      </article>
      <article className="tool-panel tooling-finder">
        <div className="tool-panel-head"><div><span>02 / CNC TOOLING FINDER</span><h3>Filter the spindle interface.</h3></div></div>
        <div className="tool-form-grid"><label>Machine interface<select value={machine} onChange={e=>setMachine(e.target.value)}><option value="">Any interface</option>{MACHINES.map(x=><option key={x}>{x}</option>)}</select></label><label>Tool type<select value={toolType} onChange={e=>setToolType(e.target.value)}><option value="">Any tool</option>{TOOL_TYPES.map(x=><option key={x}>{x}</option>)}</select></label><label>Length / keyword<input value={toolLength} onChange={e=>setToolLength(e.target.value)} placeholder="70L / 100L / ER32" /></label></div>
        <div className="tool-results"><strong>{toolMatches.length} tooling result{toolMatches.length===1?'':'s'}</strong>{toolMatches.slice(0,6).map(p=><div className="match-row" key={p.id}><div><b>{p.name}</b><span>{p.brand} · {p.category}</span></div><button onClick={()=>addCompare(p.id)} className={compare.includes(p.id)?'selected':''}>{compare.includes(p.id)?'✓ COMPARED':'COMPARE'}</button></div>)}</div>
        <button className="solid-tool-action" onClick={()=>setCompareOpen(true)}>OPEN COMPARISON ({compare.length}) →</button>
      </article>
      <article className="tool-panel part-id">
        <div className="tool-panel-head"><div><span>03 / PART IDENTIFICATION</span><h3>Don't know the part number?</h3></div></div>
        <p>Upload a reference photo and add a few measurements or application details. The enquiry can be sent directly to the engineering team.</p>
        <label className="upload-zone"><input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(!f)return;setFilePreview(URL.createObjectURL(f));showToast('Reference photo loaded locally.')}}/><span>＋ UPLOAD PART PHOTO</span><small>Photo stays in your browser until you choose to share it.</small></label>
        {filePreview&&<img className="part-preview" src={filePreview} alt="Uploaded part reference"/>}
        <textarea value={partNote} onChange={e=>setPartNote(e.target.value)} placeholder="Machine, application, shaft diameter, visible markings…" rows={3}/>
        <div className="tool-action-row"><button className="solid-tool-action" onClick={sendPartWhatsApp}>WHATSAPP ENGINEER ↗</button><button className="ghost-tool-action" onClick={()=>speak('Upload a clear part photo and tell us the machine and application. We can use those details to help identify the component.')}>🔊 READ INSTRUCTIONS</button></div>
      </article>
      <article className="tool-panel quick-quote">
        <div className="tool-panel-head"><div><span>04 / QUOTATION</span><h3>Need a formal enquiry?</h3></div></div>
        <p>Turn your cart or selected requirements into one structured quote request with customer, delivery and tax details.</p>
        <button className="solid-tool-action" onClick={()=>setQuoteOpen(true)}>REQUEST A QUOTATION →</button>
        <a className="whatsapp-ghost" href={whatsappHref('Hello UJJWAL ELECTRICAL AND MECHANICAL ENGINEERS ENTERPRISE, I would like a quotation for industrial parts/tooling.') } target="_blank" rel="noreferrer">START ON WHATSAPP ↗</a>
      </article>
    </div>
    {compareOpen&&<div className="tool-modal-wrap" onMouseDown={e=>{if(e.currentTarget===e.target)setCompareOpen(false)}}><div className="tool-modal"><button className="tool-close" onClick={()=>setCompareOpen(false)}>×</button><span className="section-code">PRODUCT COMPARISON</span><h3>Side-by-side specifications.</h3>{compareProducts.length?<div className="compare-table-wrap"><table><thead><tr><th>Specification</th>{compareProducts.map(p=><th key={p.id}>{p.name}</th>)}</tr></thead><tbody><tr><td>Brand</td>{compareProducts.map(p=><td key={p.id}>{p.brand}</td>)}</tr><tr><td>Category</td>{compareProducts.map(p=><td key={p.id}>{p.category}</td>)}</tr><tr><td>Price</td>{compareProducts.map(p=><td key={p.id}>{p.price?`₹${p.price.toLocaleString('en-IN')}`:'Enquiry'}</td>)}</tr><tr><td>Tags</td>{compareProducts.map(p=><td key={p.id}>{(p.tags||[]).slice(0,5).join(' · ')||'—'}</td>)}</tr></tbody></table></div>:<div className="tool-empty">Choose up to four tooling products with COMPARE.</div>}<div className="tool-modal-actions"><a className="solid-tool-action" href="#shop" onClick={()=>setCompareOpen(false)}>GO TO SHOP →</a><button className="ghost-tool-action" onClick={()=>setCompareOpen(false)}>CLOSE</button></div></div></div>}
    {quoteOpen&&<QuoteModal onClose={()=>setQuoteOpen(false)}/>} {toast&&<div className="tool-toast" role="status">{toast}</div>}
  </section>;
}

function QuoteModal({onClose}:{onClose:()=>void}){
 const [name,setName]=useState(''); const [company,setCompany]=useState(''); const [phone,setPhone]=useState(''); const [email,setEmail]=useState(''); const [gstin,setGstin]=useState(''); const [city,setCity]=useState(''); const [date,setDate]=useState(''); const [notes,setNotes]=useState('');
 const valid=name.trim()&&company.trim()&&phone.trim()&&email.trim()&&city.trim(); const body=`Hello UJJWAL ELECTRICAL AND MECHANICAL ENGINEERS ENTERPRISE,\n\nREQUEST FOR QUOTATION\n\nName: ${name}\nCompany: ${company}\nPhone: ${phone}\nEmail: ${email}\nGSTIN: ${gstin||'Not provided'}\nDelivery city: ${city}\nRequired date: ${date||'Not specified'}\n\nNotes:\n${notes||'Please review my requirement and advise availability, pricing and delivery.'}`;
 return <div className="tool-modal-wrap" onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}><form className="tool-modal quote-modal" onSubmit={e=>{e.preventDefault();if(valid)window.location.href=`mailto:ujjwalelectricalengineers@gmail.com?subject=${encodeURIComponent('Quotation Request')}&body=${encodeURIComponent(body)}`}}><button type="button" className="tool-close" onClick={onClose}>×</button><span className="section-code">05 / QUOTE DETAILS</span><h3>Request a quotation.</h3><div className="quote-grid"><input required placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/><input required placeholder="Company" value={company} onChange={e=>setCompany(e.target.value)}/><input required placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)}/><input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input placeholder="GSTIN" value={gstin} onChange={e=>setGstin(e.target.value)}/><input required placeholder="Delivery city" value={city} onChange={e=>setCity(e.target.value)}/><input type="date" value={date} onChange={e=>setDate(e.target.value)}/><textarea rows={4} className="quote-full" placeholder="Requirement / notes" value={notes} onChange={e=>setNotes(e.target.value)}/></div><button className="solid-tool-action" type="submit">PREPARE QUOTATION EMAIL ↗</button></form></div>;
}
