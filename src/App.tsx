import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, Sparkles } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function Gear({ radius = 1.3, teeth = 12, speed = 0.45, reverse = false }: { radius?: number; teeth?: number; speed?: number; reverse?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.z += delta * speed * (reverse ? -1 : 1); });
  const toothWidth = (Math.PI * 2 * radius) / teeth * 0.48;
  return <group ref={ref} rotation={[Math.PI / 2, 0, 0]}>
    <mesh><cylinderGeometry args={[radius * .78, radius * .78, .22, 48]} /><meshStandardMaterial color="#151b24" metalness={.92} roughness={.2} /></mesh>
    {Array.from({ length: teeth }).map((_, i) => <mesh key={i} rotation={[0, 0, i / teeth * Math.PI * 2]} position={[Math.cos(i / teeth * Math.PI * 2) * radius, 0, Math.sin(i / teeth * Math.PI * 2) * radius]}><boxGeometry args={[toothWidth, .26, radius * .28]} /><meshStandardMaterial color="#273342" metalness={.9} roughness={.24} /></mesh>)}
    <mesh position={[0, .14, 0]}><torusGeometry args={[radius * .28, .07, 12, 32]} /><meshStandardMaterial color="#f59e0b" metalness={.85} roughness={.18} emissive="#5a3000" emissiveIntensity={.25} /></mesh>
  </group>;
}

function Machine() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * .22, .035);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * .08, .035);
    group.current.position.y = Math.sin(clock.elapsedTime * .7) * .08;
  });
  return <group ref={group} scale={1.05}>
    <mesh position={[0, -1.25, 0]}><boxGeometry args={[5.8, .45, 3.2]} /><meshStandardMaterial color="#111820" metalness={.86} roughness={.25} /></mesh>
    <mesh position={[0, -.7, 0]}><boxGeometry args={[4.7, .8, 2.5]} /><meshStandardMaterial color="#1b2530" metalness={.8} roughness={.3} /></mesh>
    <mesh position={[-1.75, .55, 0]}><boxGeometry args={[.55, 2.5, 1.9]} /><meshStandardMaterial color="#222d38" metalness={.82} roughness={.27} /></mesh>
    <mesh position={[1.75, .55, 0]}><boxGeometry args={[.55, 2.5, 1.9]} /><meshStandardMaterial color="#222d38" metalness={.82} roughness={.27} /></mesh>
    <mesh position={[0, 1.35, 0]}><boxGeometry args={[4.3, .38, 2.05]} /><meshStandardMaterial color="#283541" metalness={.88} roughness={.22} /></mesh>
    <mesh position={[0, .55, 1.12]}><boxGeometry args={[2.2, 1.25, .12]} /><meshStandardMaterial color="#071016" metalness={.3} roughness={.15} emissive="#0b3440" emissiveIntensity={.35} /></mesh>
    <group position={[-.45, .55, 1.25]}><Gear radius={.72} teeth={12} speed={.7} /><group position={[1.05, 0, .02]}><Gear radius={.42} teeth={9} speed={1.05} reverse /></group></group>
  </group>;
}

function Scene() {
  return <Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <PerspectiveCamera makeDefault position={[7, 3.5, 9]} fov={45} />
    <ambientLight intensity={.5} /><spotLight position={[5, 7, 6]} intensity={130} angle={.35} penumbra={1} color="#fff4df" /><pointLight position={[-5, 1, 3]} intensity={55} color="#0ea5e9" /><pointLight position={[4, -1, -4]} intensity={35} color="#f59e0b" />
    <Suspense fallback={null}><Environment preset="city" /></Suspense><Float speed={1.2} rotationIntensity={.15} floatIntensity={.35}><Machine /></Float><Sparkles count={70} scale={[12, 7, 10]} size={1.2} speed={.25} opacity={.35} />
  </Canvas>;
}

const services = ['Industrial Electrical Engineering', 'Mechanical Engineering', 'Plant Installation & Maintenance', 'Fabrication & Industrial Projects'];
const icons = ['⌁', '⚙', '◈', '▣'];

export default function App() {
  const [menu, setMenu] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);
  return <div className="site">
    <header className="nav"><a className="brand" href="#top"><span className="brand-mark">U</span><span>UJJWAL<span className="muted"> ENGINEERS</span></span></a><button className="menu" aria-label="Toggle menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button><nav className={menu ? 'open' : ''}><a href="#services" onClick={() => setMenu(false)}>Services</a><a href="#about" onClick={() => setMenu(false)}>About</a><a href="#contact" onClick={() => setMenu(false)}>Contact</a><a className="nav-cta" href="mailto:ujjwalelectricals@gmail.com">Start a project ↗</a></nav></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span /> ENGINEERING • FABRICATION • INSTALLATION</div><h1>Engineering that <em>moves</em> industry.</h1><p>Ujjwal Electricals & Mechanical Engineers delivers dependable electrical and mechanical solutions for demanding industrial environments.</p><div className="actions"><a className="primary" href="#contact">Discuss your project <span>→</span></a><a className="secondary" href="#services">Explore capabilities</a></div><div className="stats"><div><strong>10+</strong><span>Years experience</span></div><div><strong>50+</strong><span>Projects delivered</span></div><div><strong>24/7</strong><span>Industrial support</span></div></div></div><div className="scene" aria-label="Interactive 3D engineering visualization"><Scene /><div className="scene-label"><span className="pulse" /> LIVE ENGINEERING VIEW<br /><small>PRECISION / PERFORMANCE / RELIABILITY</small></div></div></section>
      <section id="services" className="section"><div className="section-head"><div><span className="kicker">01 / CAPABILITIES</span><h2>Built for the <em>real world.</em></h2></div><p>From electrical systems to mechanical execution, we turn engineering requirements into practical, maintainable industrial solutions.</p></div><div className="cards">{services.map((s, i) => <article className="card" key={s}><span className="num">0{i + 1}</span><div className="icon" aria-hidden="true">{icons[i]}</div><h3>{s}</h3><p>Precision-led execution with safety, reliability and long-term performance in mind.</p><a href="#contact">Learn more ↗</a></article>)}</div></section>
      <section id="about" className="about"><div className="about-grid"><div><span className="kicker">02 / WHY UJJWAL</span><h2>Serious engineering.<br /><em>Zero shortcuts.</em></h2></div><div><p className="large">We combine engineering discipline with hands-on execution to help industrial teams build, upgrade and maintain critical systems.</p><p>Our approach is simple: understand the site, engineer the right solution, execute safely, and leave behind work that lasts.</p><div className="principles"><span>01 / SAFETY</span><span>02 / PRECISION</span><span>03 / DELIVERY</span></div></div></div></section>
      <section id="contact" className="contact"><div><span className="kicker">03 / START A PROJECT</span><h2>Have a challenging<br /><em>engineering problem?</em></h2><p>Tell us what you're building. Let's engineer the way forward.</p></div><a className="contact-card" href="mailto:ujjwalelectricals@gmail.com"><span>EMAIL US</span><strong>ujjwalelectricals@gmail.com</strong><b>→</b></a></section>
    </main><footer><span>© {year} UJJWAL ELECTRICALS & MECHANICAL ENGINEERS</span><span>ENGINEERED FOR PERFORMANCE.</span></footer>
  </div>;
}
