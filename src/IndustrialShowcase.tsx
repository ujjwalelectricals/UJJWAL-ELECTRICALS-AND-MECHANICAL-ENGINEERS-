import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function BearingModel({ active }: { active: boolean }) {
  const root = useRef<THREE.Group>(null);
  const balls = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (root.current) root.current.rotation.y += delta * (active ? 0.65 : 0.35);
    if (balls.current) balls.current.rotation.z -= delta * (active ? 1.15 : 0.7);
  });
  const count = 12;
  return (
    <group ref={root} rotation={[0.28, 0.15, 0]}>
      <mesh>
        <torusGeometry args={[1.75, 0.28, 24, 96]} />
        <meshStandardMaterial color="#5b6670" metalness={0.96} roughness={0.14} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.95, 0.23, 24, 96]} />
        <meshStandardMaterial color="#77838d" metalness={0.96} roughness={0.12} />
      </mesh>
      <mesh>
        <torusGeometry args={[1.35, 0.055, 12, 96]} />
        <meshStandardMaterial color="#f59e0b" emissive="#7a4100" emissiveIntensity={0.7} metalness={0.85} roughness={0.18} />
      </mesh>
      <group ref={balls}>
        {Array.from({ length: count }).map((_, i) => {
          const a = (i / count) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 1.35, 0, Math.sin(a) * 1.35]}>
              <sphereGeometry args={[0.155, 18, 18]} />
              <meshStandardMaterial color="#dce3e7" metalness={0.98} roughness={0.08} />
            </mesh>
          );
        })}
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.035, 10, 72]} />
        <meshStandardMaterial color="#38bdf8" emissive="#07506e" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function CNCPartModel({ active }: { active: boolean }) {
  const root = useRef<THREE.Group>(null);
  const spindle = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }, delta) => {
    if (!root.current || !spindle.current) return;
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pointer.x * 0.28, 0.04);
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -pointer.y * 0.12, 0.04);
    spindle.current.rotation.y += delta * (active ? 8 : 4.5);
    spindle.current.position.y = Math.sin(clock.elapsedTime * 1.7) * 0.06;
  });
  return (
    <group ref={root}>
      <mesh position={[0, -1.1, 0]}>
        <boxGeometry args={[4.1, 0.3, 2.6]} />
        <meshStandardMaterial color="#17232d" metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[2.9, 0.45, 1.9]} />
        <meshStandardMaterial color="#2b3944" metalness={0.88} roughness={0.2} />
      </mesh>
      <group ref={spindle} position={[0, 0.9, 0]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.32, 0.42, 1.05, 32]} />
          <meshStandardMaterial color="#9aa4ab" metalness={0.98} roughness={0.11} />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.23, 0.12, 0.42, 24]} />
          <meshStandardMaterial color="#d4dade" metalness={0.98} roughness={0.08} />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <coneGeometry args={[0.12, 0.4, 20]} />
          <meshStandardMaterial color="#f59e0b" emissive="#6b3b00" emissiveIntensity={0.65} metalness={0.88} roughness={0.12} />
        </mesh>
      </group>
      <mesh position={[0, -0.38, 0.04]}>
        <cylinderGeometry args={[0.44, 0.44, 0.08, 48]} />
        <meshStandardMaterial color="#4b5963" metalness={0.96} roughness={0.12} />
      </mesh>
      {Array.from({ length: 18 }).map((_, i) => {
        const a = i * 0.75;
        const r = 1.15 + (i % 3) * 0.2;
        return (
          <mesh key={i} position={[Math.cos(a) * r, -0.26 + (i % 2) * 0.05, Math.sin(a) * r]} rotation={[a, 0.4, a]}>
            <boxGeometry args={[0.06, 0.025, 0.28]} />
            <meshStandardMaterial color={i % 2 ? '#8e99a1' : '#f59e0b'} metalness={0.75} roughness={0.23} />
          </mesh>
        );
      })}
      <pointLight position={[0, 0.4, 1.3]} intensity={9} distance={4} color="#38bdf8" />
    </group>
  );
}

function Viewer({ type }: { type: 'bearing' | 'cnc' }) {
  const [active, setActive] = useState(false);
  return (
    <div className={`showcase-viewer ${active ? 'active' : ''}`} onPointerEnter={() => setActive(true)} onPointerLeave={() => setActive(false)}>
      <Canvas dpr={[1, 1.35]} camera={{ position: [0, 0.2, 5.5], fov: 38 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.42} />
        <directionalLight position={[4, 5, 4]} intensity={3.2} color="#fff0d5" />
        <pointLight position={[-3, 1, 2]} intensity={8} distance={7} color="#0ea5e9" />
        <pointLight position={[3, -1, -2]} intensity={6} distance={6} color="#f59e0b" />
        <Float speed={active ? 1.6 : 1} rotationIntensity={active ? 0.15 : 0.07} floatIntensity={0.16}>
          {type === 'bearing' ? <BearingModel active={active} /> : <CNCPartModel active={active} />}
        </Float>
        <Sparkles count={active ? 50 : 24} scale={[6, 4, 5]} size={1.15} speed={0.2} opacity={0.32} />
      </Canvas>
      <div className="viewer-scan" />
      <div className="viewer-hud"><span>{type === 'bearing' ? 'BEARING ASSEMBLY' : 'CNC TOOL / WORKPIECE'}</span><b>{active ? 'INTERACTIVE' : 'HOVER TO INSPECT'}</b></div>
    </div>
  );
}

export default function IndustrialShowcase() {
  return (
    <section id="components" className="component-showcase">
      <div className="showcase-head reveal">
        <div>
          <span className="kicker">08 / COMPONENT VISUAL LAB</span>
          <h2>Inside the <em>machine.</em></h2>
        </div>
        <p>Explore representative CNC hardware and bearing assemblies as interactive 3D studies. Move your pointer over each scene to change the motion and reveal the engineering details.</p>
      </div>
      <div className="showcase-grid">
        <article className="showcase-card reveal"><Viewer type="cnc" /><div className="showcase-copy"><span>CNC COMPONENTS</span><h3>Tooling, spindle &amp; precision work zone</h3><p>A compact animated view of a spindle, cutting tool, workpiece and machined chips — designed to communicate the precision-work environment at a glance.</p><div className="spec-tags"><span>SPINDLE</span><span>TOOLING</span><span>WORKPIECE</span><span>CHIPS</span></div></div></article>
        <article className="showcase-card reveal"><Viewer type="bearing" /><div className="showcase-copy"><span>BEARING ASSEMBLIES</span><h3>Races, rolling elements &amp; motion</h3><p>A layered bearing visualization with rotating races, rolling elements and inspection rings that becomes more dynamic when you move the pointer over it.</p><div className="spec-tags"><span>OUTER RACE</span><span>INNER RACE</span><span>ROLLING ELEMENTS</span><span>CAGE / GUIDE</span></div></div></article>
      </div>
      <div className="component-note reveal"><span>UJJWAL / VISUAL ENGINEERING LAB</span><strong>INTERACTIVE HARDWARE STUDIES • CNC • BEARINGS • MAINTENANCE</strong></div>
    </section>
  );
}
