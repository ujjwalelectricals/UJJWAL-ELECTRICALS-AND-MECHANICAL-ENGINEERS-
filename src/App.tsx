import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, Sparkles } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

function Gear({ radius = 1.3, teeth = 12, speed = 0.45, reverse = false }: { radius?: number; teeth?: number; speed?: number; reverse?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed * (reverse ? -1 : 1);
  });
  const toothWidth = ((Math.PI * 2 * radius) / teeth) * 0.48;
  return (
    <group ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[radius * 0.78, radius * 0.78, 0.22, 48]} />
        <meshStandardMaterial color="#151b24" metalness={0.92} roughness={0.2} />
      </mesh>
      {Array.from({ length: teeth }).map((_, i) => (
        <mesh
          key={i}
          rotation={[0, 0, (i / teeth) * Math.PI * 2]}
          position={[Math.cos((i / teeth) * Math.PI * 2) * radius, 0, Math.sin((i / teeth) * Math.PI * 2) * radius]}
        >
          <boxGeometry args={[toothWidth, 0.26, radius * 0.28]} />
          <meshStandardMaterial color="#273342" metalness={0.9} roughness={0.24} />
        </mesh>
      ))}
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[radius * 0.28, 0.07, 12, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.18} emissive="#5a3000" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

function Machine() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.22, 0.035);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.08, 0.035);
    group.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.08;
  });
  return (
    <group ref={group} scale={1.05}>
      <mesh position={[0, -1.25, 0]}><boxGeometry args={[5.8, 0.45, 3.2]} /><meshStandardMaterial color="#111820" metalness={0.86} roughness={0.25} /></mesh>
      <mesh position={[0, -0.7, 0]}><boxGeometry args={[4.7, 0.8, 2.5]} /><meshStandardMaterial color="#1b2530" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[-1.75, 0.55, 0]}><boxGeometry args={[0.55, 2.5, 1.9]} /><meshStandardMaterial color="#222d38" metalness={0.82} roughness={0.27} /></mesh>
      <mesh position={[1.75, 0.55, 0]}><boxGeometry args={[0.55, 2.5, 1.9]} /><meshStandardMaterial color="#222d38" metalness={0.82} roughness={0.27} /></mesh>
      <mesh position={[0, 1.35, 0]}><boxGeometry args={[4.3, 0.38, 2.05]} /><meshStandardMaterial color="#283541" metalness={0.88} roughness={0.22} /></mesh>
      <mesh position={[0, 0.55, 1.12]}><boxGeometry args={[2.2, 1.25, 0.12]} /><meshStandardMaterial color="#071016" metalness={0.3} roughness={0.15} emissive="#0b3440" emissiveIntensity={0.35} /></mesh>
      <group position={[-0.45, 0.55, 1.25]}><Gear radius={0.72} teeth={12} speed={0.7} /><group position={[1.05, 0, 0.02]}><Gear radius={0.42} teeth={9} speed={1.05} reverse /></group></group>
    </group>
  );
}

function Scene() {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <PerspectiveCamera makeDefault position={[7, 3.5, 9]} fov={45} />
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 7, 6]} intensity={130} angle={0.35} penumbra={1} color="#fff4df" />
      <pointLight position={[-5, 1, 3]} intensity={55} color="#0ea5e9" />
      <pointLight position={[4, -1, -4]} intensity={35} color="#f59e0b" />
      <Suspense fallback={null}><Environment preset="city" /></Suspense>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}><Machine /></Float>
      <Sparkles count={70} scale={[12, 7, 10]} size={1.2} speed={0.25} opacity={0.35} />
    </Canvas>
  );
}

const services = ['CNC Service & Maintenance', 'Industrial Electrical Engineering', 'Mechanical Engineering', 'Plant Installation & Maintenance'];
const icons = ['⌁', '⚡', '⚙', '◈'];
const machines = ['Hyundai WIA', 'Makino', 'Daewoo', 'BFW', 'Doosan'];

export default function App() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="site">
      <header className="nav">
        <a className="brand" href="#top"><span className="brand-mark">U</span><span>UJJWAL<span className="muted"> ENGINEERS</span></span></a>
        <button className="menu" aria-label="Toggle menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button>
        <nav className={menu ? 'open' : ''}>
          <a href="#services" onClick={() => setMenu(false)}>Services</a>
          <a href="#about" onClick={() => setMenu(false)}>About</a>
          <a href="#contact" onClick={() => setMenu(false)}>Contact</a>
          <a className="nav-cta" href="mailto:ujjwalelectricals@gmail.com">Start a project ↗</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span /> CNC SERVICE • MAINTENANCE • ENGINEERING</div>
            <h1>Engineering that <em>keeps industry moving.</em></h1>
            <p>Ujjwal Electricals & Mechanical Engineers Enterprises provides CNC service and maintenance plus dependable electrical and mechanical engineering solutions for industrial environments.</p>
            <div className="actions">
              <a className="primary" href="#contact">Discuss your project <span>→</span></a>
              <a className="secondary" href="#services">Explore capabilities</a>
            </div>
            <div className="stats">
              <div><strong>CNC</strong><span>Service & maintenance</span></div>
              <div><strong>E&amp;M</strong><span>Electrical + mechanical</span></div>
              <div><strong>GZB</strong><span>Ghaziabad, Uttar Pradesh</span></div>
            </div>
          </div>
          <div className="scene" aria-label="Interactive 3D engineering visualization">
            <Scene />
            <div className="scene-label"><span className="pulse" /> LIVE ENGINEERING VIEW<br /><small>PRECISION / PERFORMANCE / RELIABILITY</small></div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="section-head">
            <div><span className="kicker">01 / CAPABILITIES</span><h2>Built for the <em>real world.</em></h2></div>
            <p>From CNC maintenance to electrical and mechanical execution, we focus on practical, maintainable industrial solutions.</p>
          </div>
          <div className="cards">
            {services.map((s, i) => (
              <article className="card" key={s}>
                <span className="num">0{i + 1}</span>
                <div className="icon" aria-hidden="true">{icons[i]}</div>
                <h3>{s}</h3>
                <p>Precision-led execution with safety, reliability and long-term performance in mind.</p>
                <a href="#contact">Enquire ↗</a>
              </article>
            ))}
          </div>
          <div className="machine-strip" aria-label="CNC machine brands serviced">
            <span className="kicker">CNC / MACHINE EXPERIENCE</span>
            <div>{machines.map((machine) => <span key={machine}>{machine}</span>)}</div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="about-grid">
            <div><span className="kicker">02 / WHY UJJWAL</span><h2>Serious engineering.<br /><em>Zero shortcuts.</em></h2></div>
            <div>
              <p className="large">We combine engineering discipline with hands-on execution to help industrial teams service, upgrade and maintain critical systems.</p>
              <p>Our approach is simple: understand the machine or site, engineer the right solution, execute safely, and leave behind work that lasts.</p>
              <div className="principles"><span>01 / SAFETY</span><span>02 / PRECISION</span><span>03 / DELIVERY</span></div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div>
            <span className="kicker">03 / CONTACT UJJWAL ENGINEERS</span>
            <h2>Have a challenging<br /><em>engineering problem?</em></h2>
            <p>Tell us what you're building, repairing or maintaining. Let's engineer the way forward.</p>
            <div className="company-details">
              <span>GSTIN: 09CWDPD3387A1ZS</span>
              <span>IEC: CWDPD3387A</span>
              <span>Sector-9, H.No. 2313, Block-51, Siddharth Vihar, Ghaziabad - 201009</span>
            </div>
          </div>
          <div className="contact-stack">
            <a className="contact-card" href="mailto:ujjwalelectricals@gmail.com"><span>PRIMARY EMAIL</span><strong>ujjwalelectricals@gmail.com</strong><b>→</b></a>
            <a className="contact-card" href="tel:+919971276078"><span>CALL / WHATSAPP</span><strong>+91 99712 76078</strong><b>→</b></a>
            <a className="contact-card" href="tel:+919910228978"><span>ALTERNATE PHONE</span><strong>+91 99102 28978</strong><b>→</b></a>
          </div>
        </section>
      </main>

      <footer><span>© {new Date().getFullYear()} UJJWAL ELECTRICALS &amp; MECHANICAL ENGINEERS ENTERPRISES</span><span>ENGINEERED FOR PERFORMANCE.</span></footer>
    </div>
  );
}
