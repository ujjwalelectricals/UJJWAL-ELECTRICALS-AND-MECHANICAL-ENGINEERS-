import { useEffect, useMemo, useState } from 'react';
import IndustrialScene from './IndustrialScene';
import IndustrialShowcase from './IndustrialShowcase';
import IndustrialStore from './IndustrialStore';
import './showcase.css';
import './store.css';
import './premium.css';

const machines = ['HYUNDAI WIA', 'MAKINO', 'DAEWOO', 'BFW', 'DOOSAN'];
const services = [
  { no: '01', title: 'CNC Service & Maintenance', copy: 'CNC equipment support, troubleshooting and maintenance focused on dependable machine health.', tag: 'CNC' },
  { no: '02', title: 'Industrial Electrical Engineering', copy: 'Electrical engineering support for industrial environments, upgrades and practical execution.', tag: 'ELECTRICAL' },
  { no: '03', title: 'Mechanical Engineering', copy: 'Mechanical repair, installation and engineering support with precision and maintainability in mind.', tag: 'MECHANICAL' },
  { no: '04', title: 'Plant Installation & Maintenance', copy: 'Installation, maintenance and industrial project execution from planning through commissioning support.', tag: 'PLANT' },
];
const process = [
  ['01', 'UNDERSTAND', 'We start with the machine, plant condition and actual operating problem.'],
  ['02', 'ENGINEER', 'We identify a practical technical path without unnecessary complexity.'],
  ['03', 'EXECUTE', 'Work is carried out with safety, precision and clean delivery in mind.'],
  ['04', 'SUPPORT', 'The objective is lasting performance, not a one-time intervention.'],
] as const;

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <article className={`tilt-card ${className}`}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        event.currentTarget.style.setProperty('--rx', `${-y * 7}deg`);
        event.currentTarget.style.setProperty('--ry', `${x * 9}deg`);
        event.currentTarget.style.setProperty('--px', `${(x + 0.5) * 100}%`);
        event.currentTarget.style.setProperty('--py', `${(y + 0.5) * 100}%`);
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty('--rx', '0deg');
        event.currentTarget.style.setProperty('--ry', '0deg');
        event.currentTarget.style.setProperty('--px', '50%');
        event.currentTarget.style.setProperty('--py', '50%');
      }}
    >{children}</article>
  );
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [worldEnabled, setWorldEnabled] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const root = document.documentElement;
    const onPointerMove = (event: PointerEvent) => {
      root.style.setProperty('--cursor-x', `${event.clientX}px`);
      root.style.setProperty('--cursor-y', `${event.clientY}px`);
    };
    const onScroll = () => setWorldEnabled(window.scrollY > window.innerHeight * 0.58);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="site">
      {worldEnabled && <IndustrialScene />}
      <div className="cursor-glow" aria-hidden="true" />
      <header className="nav">
        <a className="brand" href="#top" onClick={() => setMenu(false)}><span className="brand-mark">U</span><span>UJJWAL<span className="muted"> ENGINEERS</span></span></a>
        <button className="menu" aria-label="Toggle menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button>
        <nav className={menu ? 'open' : ''}>
          <a href="#services" onClick={() => setMenu(false)}>Capabilities</a>
          <a href="#machines" onClick={() => setMenu(false)}>Machines</a>
          <a href="#store" onClick={() => setMenu(false)}>Shop</a>
          <a href="#components" onClick={() => setMenu(false)}>CNC &amp; Bearings</a>
          <a href="#about" onClick={() => setMenu(false)}>Approach</a>
          <a href="#contact" onClick={() => setMenu(false)}>Contact</a>
          <a className="nav-cta" href="mailto:ujjwalelectricals@gmail.com">Start a project ↗</a>
        </nav>
      </header>

      <main id="top" className="content-layer">
        <section className="hero section-3d opening-hero">
          <div className="opening-backdrop" aria-hidden="true">
            <div className="opening-grid" />
            <div className="opening-sweep" />
          </div>
          <div className="hero-copy reveal opening-copy">
            <div className="eyebrow"><span /> UJJWAL / INDUSTRIAL ENGINEERING</div>
            <p className="hero-kicker">CNC SERVICE • MAINTENANCE • ELECTRICAL • MECHANICAL</p>
            <h1>Precision that <em>moves industry.</em></h1>
            <p className="hero-lede">Ujjwal Electricals &amp; Mechanical Engineers Enterprises supports CNC equipment, industrial systems and maintenance requirements with practical engineering execution.</p>
            <div className="actions"><a className="primary" href="#store">Explore tooling <span>→</span></a><a className="secondary" href="#services">Explore capabilities</a></div>
            <div className="hero-meta"><span><b>01</b> CNC SERVICE</span><span><b>02</b> ELECTRICAL</span><span><b>03</b> MECHANICAL</span><span><b>04</b> TOOLING</span></div>
          </div>
          <div className="opening-product" aria-label="Featured Jaibros BT40 tooling">
            <div className="opening-product-ring" />
            <img src="https://www.jaibros.com/cdn/shop/files/20_b988e55f-0aef-4eab-bf1b-ed47b2cf875f.jpg?v=1785825100" alt="Jaibros BT40 ER32 tool holder" />
            <span>FEATURED / BT40 ER32</span>
            <small>MOVE POINTER • SCROLL TO ENTER THE 3D SYSTEM</small>
          </div>
          <div className="hero-hud"><span>UJJWAL / INDUSTRIAL SYSTEM</span><b>PRECISION TOOLING</b><i>3D WORLD LOADS AS YOU ENTER THE SYSTEM</i></div>
        </section>

        <section id="services" className="section capabilities">
          <div className="section-head reveal"><div><span className="kicker">01 / CAPABILITIES</span><h2>Built around <em>real machines.</em></h2></div><p>Industrial support with practical engineering thinking. Each capability is part of one connected system rather than a collection of isolated services.</p></div>
          <div className="service-grid">{services.map((service) => <TiltCard key={service.no}><div className="service-top"><span>{service.no}</span><strong>{service.tag}</strong></div><div className="service-orb" /><h3>{service.title}</h3><p>{service.copy}</p><a href="#contact">ENQUIRE <span>↗</span></a></TiltCard>)}</div>
          <div id="machines" className="machine-belt reveal"><div className="belt-label"><span className="kicker">02 / CNC EXPERIENCE</span><strong>Machines we service</strong></div><div className="machine-list">{machines.map((machine) => <span key={machine}>{machine}</span>)}</div></div>
        </section>

        <IndustrialStore />
        <IndustrialShowcase />

        <section className="systems section-3d"><div className="systems-panel reveal"><div><span className="kicker">09 / SYSTEM VIEW</span><h2>Every intervention is part of a <em>larger system.</em></h2></div><div className="systems-copy"><p>Machines, electrical systems, mechanical assemblies and plant infrastructure interact. The 3D layer activates deeper in the experience so the opening stays fast while the interactive engineering world appears as you explore.</p><div className="signal-row"><span>PRECISION</span><span>SAFETY</span><span>RELIABILITY</span><span>DELIVERY</span></div></div></div></section>

        <section id="about" className="section approach">
          <div className="section-head reveal"><div><span className="kicker">10 / HOW WE WORK</span><h2>Less noise.<br /><em>More engineering.</em></h2></div><p>We focus on understanding the operating environment, choosing a practical solution and delivering work that is maintainable after the project is finished.</p></div>
          <div className="process-grid">{process.map(([no, title, copy]) => <TiltCard key={no} className="process-card"><span className="process-no">{no}</span><div><h3>{title}</h3><p>{copy}</p></div><span className="process-line" /></TiltCard>)}</div>
          <div className="quote-panel reveal"><span>ENGINEERING PRINCIPLE</span><p>“Understand the machine. Solve the actual problem. Execute it properly.”</p></div>
        </section>

        <section className="industrial-details"><div className="detail-card reveal"><span className="kicker">11 / INDUSTRIAL FOCUS</span><h3>CNC service &amp; maintenance</h3><p>Focused support for CNC equipment and industrial machine environments, with attention to tooling, spindle systems, bearings and machine health.</p><div className="micro-grid">{machines.map((machine) => <span key={machine}>{machine}</span>)}</div></div><div className="detail-card reveal"><span className="kicker">12 / BUSINESS DETAILS</span><h3>Ujjwal Electricals &amp; Mechanical Engineers Enterprises</h3><p>Sector-9, H.No. 2313, Block-51, Siddharth Vihar, Ghaziabad - 201009</p><div className="micro-grid"><span>GSTIN 09CWDPD3387A1ZS</span><span>IEC CWDPD3387A</span></div></div></section>

        <section id="contact" className="contact section-3d"><div className="contact-copy reveal"><span className="kicker">13 / CONTACT</span><h2>Have a challenging <em>engineering problem?</em></h2><p>Share the machine, plant or engineering requirement. Contact Ujjwal Engineers directly.</p></div><div className="contact-stack reveal"><a className="contact-card" href="mailto:ujjwalelectricals@gmail.com"><span>PRIMARY EMAIL</span><strong>ujjwalelectricals@gmail.com</strong><b>→</b></a><a className="contact-card" href="mailto:durga.pandey44@gmail.com"><span>DIRECT EMAIL</span><strong>durga.pandey44@gmail.com</strong><b>→</b></a><a className="contact-card" href="tel:+919971276078"><span>CALL / WHATSAPP</span><strong>+91 99712 76078</strong><b>→</b></a><a className="contact-card" href="tel:+919910228978"><span>ALTERNATE PHONE</span><strong>+91 99102 28978</strong><b>→</b></a></div></section>
      </main>

      <footer><span>© {year} UJJWAL ELECTRICALS &amp; MECHANICAL ENGINEERS ENTERPRISES</span><span>SIDDHARTH VIHAR • GHAZIABAD • INDIA</span></footer>
    </div>
  );
}
