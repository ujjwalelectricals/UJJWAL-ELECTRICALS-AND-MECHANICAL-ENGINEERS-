import './business-sections.css';

const WHATSAPP='https://wa.me/919971276078?text=Hello%20UJJWAL%20ELECTRICAL%20AND%20MECHANICAL%20ENGINEERS%20ENTERPRISE%2C%20I%20would%20like%20to%20discuss%20an%20industrial%20requirement.';
const MAPS='https://www.google.com/maps/search/?api=1&query=Sector-9%2C%20H.No.%202313%2C%20Block-51%2C%20Siddharth%20Vihar%2C%20Ghaziabad%2C%20201009%2C%20India';
const industries=[
 ['AUTOMOTIVE','CNC machining support, rotating components, tooling and maintenance requirements.'],
 ['CNC MACHINING','Spindle-side tooling, holders, collets, bearings and machine-support requirements.'],
 ['FABRICATION','Workshop components, industrial electrical support and mechanical maintenance.'],
 ['INDUSTRIAL AUTOMATION','Electrical systems, controls support and maintenance execution.'],
 ['PLANT MAINTENANCE','Breakdown response, planned maintenance and component sourcing.'],
 ['MACHINE TOOLS','VMC/CNC tooling, precision components and technical identification support.'],
];
const proof=[
 ['FAST RESPONSE','Direct enquiry handling without a complicated purchasing path.'],
 ['PART IDENTIFICATION','Use dimensions, application details or a reference photograph to narrow the correct component.'],
 ['TECHNICAL FOCUS','CNC/VMC, electrical and mechanical requirements are presented in one engineering context.'],
 ['QUOTE READY','Cart quantities and customer details can be turned into a structured quotation request.'],
];

export default function BusinessSections(){
 return <>
  <section className="industries-section">
    <div className="business-section-head"><span className="section-code">03 / APPLICATIONS</span><h2>Built for the <em>working plant.</em></h2><p>Organised around the machines, maintenance teams and workshop environments that depend on reliable parts and engineering support.</p></div>
    <div className="industries-grid">{industries.map(([title,copy],i)=><article key={title}><span>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{copy}</p><a href="#services">Explore support →</a></article>)}</div>
  </section>
  <section className="proof-section">
    <div className="business-section-head"><span className="section-code">04 / WHY UJJWAL</span><h2>Useful beats <em>loud.</em></h2><p>No invented testimonials. No vague “world-class” claims. Just clear ways the website helps a real buyer move from problem to enquiry.</p></div>
    <div className="proof-grid">{proof.map(([title,copy],i)=><article key={title}><b>{String(i+1).padStart(2,'0')}</b><h3>{title}</h3><p>{copy}</p></article>)}</div>
  </section>
  <section className="case-section">
    <div className="business-section-head"><span className="section-code">05 / ENGINEERING STORIES</span><h2>From problem to <em>result.</em></h2><p>Case-study slots are ready for verified projects, with space for before/after photos, measured outcomes and the actual work performed.</p></div>
    <div className="case-grid">
      <article><span>01 / CNC SERVICE</span><h3>Machine health workflow</h3><p>Problem → inspection → root-cause assessment → repair/maintenance → verification.</p><small>Add a verified customer project here when available.</small></article>
      <article><span>02 / COMPONENT IDENTIFICATION</span><h3>Unknown bearing to correct part</h3><p>Photo + dimensions → candidate series → specification check → quotation → confirmation.</p><small>Designed to document a real identification story.</small></article>
      <article><span>03 / TOOLING</span><h3>Spindle interface selection</h3><p>Machine interface → holder type → collet/tool size → availability check → enquiry.</p><small>Add measured results or customer details only when verified.</small></article>
    </div>
  </section>
  <section className="contact-actions-section" id="contact-actions">
    <div><span className="section-code">06 / CONTACT</span><h2>Let's solve the <em>requirement.</em></h2><p>Sector-9, H.No. 2313, Block-51, Siddharth Vihar, Ghaziabad, 201009, India.</p></div>
    <div className="contact-action-grid"><a href={MAPS} target="_blank" rel="noreferrer">📍 GET DIRECTIONS</a><a href="tel:+919971276078">☎ CALL</a><a href="mailto:ujjwalelectricalengineers@gmail.com">✉ EMAIL</a><a href={WHATSAPP} target="_blank" rel="noreferrer">◉ WHATSAPP</a><a href="#premium-contact">↗ SEND ENQUIRY</a></div>
  </section>
 </>;
}
