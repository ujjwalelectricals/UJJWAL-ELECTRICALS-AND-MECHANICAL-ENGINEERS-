import { useEffect, useMemo, useState } from 'react';
import IndustrialScene from './IndustrialScene';

const services = [
  { no: '01', title: 'CNC Service & Maintenance', copy: 'Service and maintenance support for CNC equipment with a focus on dependable operation, troubleshooting and long-term machine health.', tag: 'CNC' },
  { no: '02', title: 'Industrial Electrical Engineering', copy: 'Electrical engineering support for industrial environments, upgrades, maintenance and practical on-site execution.', tag: 'ELECTRICAL' },
  { no: '03', title: 'Mechanical Engineering', copy: 'Mechanical repair, installation and engineering support built around precision, safety and maintainability.', tag: 'MECHANICAL' },
  { no: '04', title: 'Plant Installation & Maintenance', copy: 'Hands-on installation, maintenance and industrial project execution from planning through commissioning support.', tag: 'PLANT' },
];

const machines = ['HYUNDAI WIA', 'MAKINO', 'DAEWOO', 'BFW', 'DOOSAN'];
const process = [
  ['01', 'UNDERSTAND', 'We start with the machine, plant condition and the actual operating problem.'],
  ['02', 'ENGINEER', 'We identify a practical technical path instead of adding unnecessary complexity.'],
  ['03', 'EXECUTE', 'Work is carried out with a strong focus on safety, reliability and clean delivery.'],
  ['04', 'SUPPORT', 'The goal is lasting performance, not a one-time intervention.'],
] as const;

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <article
      className={`tilt-card ${className}`}
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
    >
      {children}
    </article>
  );
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const root = document.documentElement;
    const move = (event: PointerEvent) => {
      root.style.setProperty('--cursor-x', `${event.clientX}px`);
      root.style.setProperty('--cursor-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <div className="site">
      <IndustrialScene />
      <div className="cursor-glow" aria-hidden="true" />
      <header className="nav">
        <a className="brand" href="#top" onClick={() => setMenu(false)}>
          <span className="brand-mark">U</span>
          <span>UJJWAL<span className="muted"> ENGINEERS</span></span>
        </a>
        <button className="menu" aria-label="Toggle menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button>
        <nav className={menu ? 'open' : ''}>
          <a href="#services" onClick={() => setMenu(false)}>Capabilities</a>
          <a href="#machines" onClick={() => setMenu(false)}>Machines</a>
          <a href="#about" onClick={() => setMenu(false)}>Approach</a>
          <a href="#contact" onClick={() => setMenu(false)}>Contact</a>
          <a className="nav-cta" href="mailto:ujjwalelectricals@gmail.com">Start a project ↗</a>
        </nav>
      </header>

      <main id="top" className="content-layer">
        <section className="hero section-3d">
          <div className="hero-copy reveal">
            <div className="eyebrow"><span /> CNC SERVICE • MAINTENANCE • ENGINEERING</div>
            <p className="hero-kicker">UJJWAL ELECTRICALS &amp; MECHANICAL ENGINEERS ENTERPRISES</p>
            <h1>Engineering that <em>keeps industry moving.</em></h1>
            <p className="hero-lede">Dependable CNC service, maintenance, electrical engineering and mechanical support for industrial environments.</p>
            <div className="actions"><a className="primary" href="#contact">Discuss your project <span>→</span></a><a className="secondary" href="#services">Explore capabilities</a></div>
            <div className="hero-meta"><span><b>01</b> CNC SERVICE</span><span><b>02</b> ELECTRICAL</span><span><b>03</b> MECHANICAL</span><span><b>04</b> MAINTENANCE</span></div>
          </div>
          <div className="hero-hud"><span>UJJWAL / INDUSTRIAL SYSTEM</span><b>LIVE 3D ENVIRONMENT</b><i>MOVE YOUR POINTER • SCROLL TO NAVIGATE</i></div>
        </section>

        <section id="services" className="section capabilities">
          <div className="section-head reveal"><div><span className="kicker">01 / CAPABILITIES</span><h2>Built around <em>real machines.</em></h2></div><p>Industrial support with practical engineering thinking. Each capability is presented as part of one connected system rather than a collection of isolated services.</p></div>
          <div className="service-grid">{services.map((service) => <TiltCard key={service.no}><div className="service-top"><span>{service.no}</span><strong>{service.tag}</strong></div><div className="service-orb" /><h3>{service.title}</h3><p>{service.copy}</p><a href="#contact">ENQUIRE <span>↗</span></a></TiltCard>)}</div>
          <div id="machines" className="machine-belt reveal"><div className="belt-label"><span className="kicker">02 / CNC EXPERIENCE</span><strong>Machines we service</strong></div><div className="machine-list">{machines.map((machine) => <span key={machine}>{machine}</span>)}</div></div>
        </section>

        <section className="systems section-3d"><div className="systems-panel reveal"><div><span className="kicker">03 / SYSTEM VIEW</span><h2>Every intervention is part of a <em>larger system.</em></h2></div><div className="systems-copy"><p>Machines, electrical systems, mechanical assemblies and plant infrastructure interact. Scroll through the page and the 3D world shifts from machine hardware to engineering networks and finally into the contact stage.</p><div className="signal-row"><span>PRECISION</span><span>SAFETY</span><span>RELIABILITY</span><span>DELIVERY</span></div></div></div></section>

        <section id="about" className="section approach">
          <div className="section-head reveal"><div><span className="kicker">04 / HOW WE WORK</span><h2>Less noise.<br /><em>More engineering.</em></h2></div><p>We focus on understanding the operating environment, choosing a practical solution and delivering work that is maintainable after the project is finished.</p></div>
          <div className="process-grid">{process.map(([no, title, copy]) => <TiltCard key={no} className="process-card"><span className="process-no">{no}</span><div><h3>{title}</h3><p>{copy}</p></div><span className="process-line" /></TiltCard>)}</div>
          <div className="quote-panel reveal"><span>ENGINEERING PRINCIPLE</span><p>“Understand the machine. Solve the actual problem. Execute it properly.”</p></div>
        </section>

        <section className="industrial-details"><div className="detail-card reveal"><span className="kicker">05 / INDUSTRIAL FOCUS</span><h3>CNC service &amp; maintenance</h3><p>Focused support for CNC equipment and industrial machine environments.</p><div className="micro-grid">{machines.map((machine) => <span key={machine}>{machine}</span>)}</div></div><div className="detail-card reveal"><span className="kicker">06 / BUSINESS DETAILS</span><h3>Ujjwal Electricals &amp; Mechanical Engineers Enterprises</h3><p>Sector-9, H.No. 2313, Block-51, Siddharth Vihar, Ghaziabad - 201009</p><div className="micro-grid"><span>GSTIN 09CWDPD3387A1ZS</span><span>IEC CWDPD3387A</span></div></div></section>

        <section id="contact" className="contact section-3d"><div className="contact-copy reveal"><span className="kicker">07 / CONTACT</span><h2>Have a challenging <em>engineering problem?</em></h2><p>Share the machine, plant or engineering requirement. Contact Ujjwal Engineers directly.</p></div><div className="contact-stack reveal"><a className="contact-card" href="mailto:ujjwalelectricals@gmail.com"><span>PRIMARY EMAIL</span><strong>ujjwalelectricals@gmail.com</strong><b>→</b></a><a className="contact-card" href="mailto:durga.pandey44@gmail.com"><span>DIRECT EMAIL</span><strong>durga.pandey44@gmail.com</strong><b>→</b></a><a className="contact-card" href="tel:+919971276078"><span>CALL / WHATSAPP</span><strong>+91 99712 76078</strong><b>→</b></a><a className="contact-card" href="tel:+919910228978"><span>ALTERNATE PHONE</span><strong>+91 99102 28978</strong><b>→</b></a></div></section>
      </main>

      <footer><span>© {year} UJJWAL ELECTRICALS &amp; MECHANICAL ENGINEERS ENTERPRISES</span><span>SIDDHARTH VIHAR • GHAZIABAD • INDIA</span></footer>
    </div>
  );
}
