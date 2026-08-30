import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

const steel = { color: '#aeb7bd', metalness: 0.97, roughness: 0.12 };
const darkSteel = { color: '#202a32', metalness: 0.93, roughness: 0.2 };
const machineSteel = { color: '#394852', metalness: 0.88, roughness: 0.24 };

function Material({ color = steel.color, metalness = steel.metalness, roughness = steel.roughness, emissive, intensity = 0 }: { color?: string; metalness?: number; roughness?: number; emissive?: string; intensity?: number }) {
  return <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} emissive={emissive} emissiveIntensity={intensity} />;
}

function DeepGrooveBearing({ active }: { active: boolean }) {
  const root = useRef<THREE.Group>(null);
  const cage = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (root.current) root.current.rotation.z += delta * (active ? 0.6 : 0.28);
    if (cage.current) cage.current.rotation.z -= delta * (active ? 1.8 : 0.7);
  });

  const ballCount = 12;
  const ballRadius = 1.18;

  return (
    <group ref={root} rotation={[0.18, 0.32, 0]} scale={1.08}>
      {/* Outer race */}
      <mesh>
        <torusGeometry args={[1.58, 0.34, 32, 128]} />
        <Material />
      </mesh>
      {/* Outer raceway groove */}
      <mesh>
        <torusGeometry args={[1.28, 0.07, 16, 128]} />
        <Material color="#eef2f4" roughness={0.08} />
      </mesh>

      {/* Inner race */}
      <mesh>
        <torusGeometry args={[0.84, 0.28, 32, 128]} />
        <Material color="#c4ccd1" />
      </mesh>
      {/* Inner raceway groove */}
      <mesh>
        <torusGeometry args={[1.02, 0.065, 16, 128]} />
        <Material color="#edf1f3" roughness={0.08} />
      </mesh>

      {/* Sealing/edge rings */}
      <mesh>
        <torusGeometry args={[1.45, 0.04, 12, 128]} />
        <Material color="#343f47" roughness={0.2} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.94, 0.04, 12, 128]} />
        <Material color="#343f47" roughness={0.2} />
      </mesh>

      {/* Ball cage */}
      <group ref={cage}>
        {Array.from({ length: ballCount }).map((_, i) => {
          const a = (i / ballCount) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * ballRadius, 0, Math.sin(a) * ballRadius]}>
              <sphereGeometry args={[0.17, 24, 24]} />
              <Material color="#f4f6f7" roughness={0.06} />
            </mesh>
          );
        })}
        <mesh>
          <torusGeometry args={[ballRadius, 0.025, 8, 96]} />
          <Material color="#59656d" roughness={0.18} />
        </mesh>
      </group>

      {/* Technical inspection rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.94, 0.025, 10, 96]} />
        <Material color="#f59e0b" emissive="#8a4a00" intensity={active ? 1 : 0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <torusGeometry args={[2.08, 0.018, 10, 96]} />
        <Material color="#38bdf8" emissive="#0b5e7e" intensity={active ? 0.8 : 0.3} metalness={0.72} roughness={0.18} />
      </mesh>
    </group>
  );
}

function VMC1160({ active }: { active: boolean }) {
  const machine = useRef<THREE.Group>(null);
  const spindle = useRef<THREE.Group>(null);
  const table = useRef<THREE.Group>(null);
  const atc = useRef<THREE.Group>(null);

  useFrame(({ pointer, clock }, delta) => {
    if (!machine.current) return;
    machine.current.rotation.y = THREE.MathUtils.lerp(machine.current.rotation.y, pointer.x * 0.12, 0.035);
    machine.current.rotation.x = THREE.MathUtils.lerp(machine.current.rotation.x, -pointer.y * 0.055, 0.035);
    if (spindle.current) spindle.current.rotation.y += delta * (active ? 8 : 4);
    if (table.current) table.current.position.x = Math.sin(clock.elapsedTime * (active ? 0.7 : 0.38)) * 0.18;
    if (atc.current) atc.current.rotation.z += delta * (active ? 0.7 : 0.2);
  });

  const buttons = Array.from({ length: 12 });
  const slots = Array.from({ length: 16 });

  return (
    <group ref={machine} scale={0.96}>
      {/* Base */}
      <mesh position={[0, -1.82, 0]}><boxGeometry args={[6.9, 0.44, 4.0]} /><Material color="#121a21" roughness={0.25} /></mesh>
      <mesh position={[0, -1.42, 0]}><boxGeometry args={[6.0, 0.5, 3.45]} /><Material color="#26343f" roughness={0.3} /></mesh>
      <mesh position={[-2.72, -1.55, 1.1]}><boxGeometry args={[0.65, 0.78, 0.6]} /><Material color="#303f49" /></mesh>
      <mesh position={[2.72, -1.55, 1.1]}><boxGeometry args={[0.65, 0.78, 0.6]} /><Material color="#303f49" /></mesh>

      {/* Left/right enclosure walls */}
      <mesh position={[-2.7, 0.1, 0]}><boxGeometry args={[0.5, 3.05, 3.2]} /><Material color="#4a5963" /></mesh>
      <mesh position={[2.7, 0.1, 0]}><boxGeometry args={[0.5, 3.05, 3.2]} /><Material color="#4a5963" /></mesh>
      <mesh position={[0, 1.66, 0]}><boxGeometry args={[5.8, 0.42, 3.2]} /><Material color="#495963" /></mesh>

      {/* Rear column + Z carriage */}
      <mesh position={[0, 0.3, -1.18]}><boxGeometry args={[3.85, 3.35, 0.48]} /><Material color="#354650" /></mesh>
      <mesh position={[0, 0.98, -0.9]}><boxGeometry args={[3.0, 0.24, 0.22]} /><Material color="#95a1a8" roughness={0.12} /></mesh>
      <mesh position={[-1.16, 0.98, -0.9]}><boxGeometry args={[0.16, 0.5, 0.3]} /><Material color="#697780" roughness={0.14} /></mesh>
      <mesh position={[1.16, 0.98, -0.9]}><boxGeometry args={[0.16, 0.5, 0.3]} /><Material color="#697780" roughness={0.14} /></mesh>

      {/* Front sliding safety doors */}
      <mesh position={[-1.28, 0.15, 1.45]}>
        <boxGeometry args={[2.35, 2.95, 0.12]} />
        <Material color="#5d6b74" roughness={0.26} />
      </mesh>
      <mesh position={[1.28, 0.15, 1.45]}>
        <boxGeometry args={[2.35, 2.95, 0.12]} />
        <Material color="#5d6b74" roughness={0.26} />
      </mesh>
      <mesh position={[-1.28, 0.42, 1.54]}>
        <boxGeometry args={[1.62, 1.75, 0.04]} />
        <meshStandardMaterial color="#081117" transparent opacity={0.65} metalness={0.35} roughness={0.08} />
      </mesh>
      <mesh position={[1.28, 0.42, 1.54]}>
        <boxGeometry args={[1.62, 1.75, 0.04]} />
        <meshStandardMaterial color="#081117" transparent opacity={0.65} metalness={0.35} roughness={0.08} />
      </mesh>
      <mesh position={[0, -1.04, 1.55]}><boxGeometry args={[0.1, 2.1, 0.13]} /><Material color="#86939a" /></mesh>

      {/* Work table */}
      <group ref={table} position={[0, -0.72, 0.45]}>
        <mesh><boxGeometry args={[3.55, 0.28, 2.15]} /><Material color="#4d5b64" /></mesh>
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[-1.48 + i * 0.493, 0.15, 0]}>
            <boxGeometry args={[0.095, 0.04, 1.84]} />
            <Material color="#161f25" roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 0.26, 0.15]}><boxGeometry args={[1.22, 0.18, 0.82]} /><Material color="#76848c" roughness={0.17} /></mesh>
      </group>

      {/* Tool spindle head */}
      <group ref={spindle} position={[0, 0.9, 0.3]}>
        <mesh position={[0, 0.35, 0]}><boxGeometry args={[1.45, 1.15, 1.28]} /><Material color="#51606a" /></mesh>
        <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.38, 0.48, 0.7, 48]} /><Material color="#abb5bb" roughness={0.1} /></mesh>
        <mesh position={[0, -0.73, 0]}><cylinderGeometry args={[0.22, 0.13, 0.55, 32]} /><Material color="#dfe4e7" roughness={0.07} /></mesh>
        <mesh position={[0, -1.07, 0]}><coneGeometry args={[0.15, 0.42, 24]} /><Material color="#f59e0b" emissive="#7a4100" intensity={0.55} roughness={0.12} /></mesh>
        <pointLight position={[0, -0.7, 1.1]} intensity={active ? 12 : 6} distance={4} color="#38bdf8" />
      </group>

      {/* Side-mounted automatic tool changer */}
      <group ref={atc} position={[2.2, 0.72, -0.8]}>
        <mesh><cylinderGeometry args={[0.72, 0.72, 0.22, 48]} /><Material color="#242f37" /></mesh>
        {slots.map((_, i) => {
          const a = (i / slots.length) * Math.PI * 2;
          return <mesh key={i} position={[Math.cos(a) * 0.56, 0.2, Math.sin(a) * 0.56]} rotation={[0, 0, -a]}><boxGeometry args={[0.13, 0.3, 0.28]} /><Material color={i % 4 === 0 ? '#f59e0b' : '#9da9af'} roughness={0.15} /></mesh>;
        })}
      </group>

      {/* Control cabinet */}
      <group position={[3.12, -0.05, 0.7]}>
        <mesh><boxGeometry args={[0.8, 2.65, 1.25]} /><Material color="#2f3e47" /></mesh>
        <mesh position={[0, 0.55, 0.66]}><boxGeometry args={[0.56, 0.78, 0.05]} /><meshStandardMaterial color="#071117" emissive="#38bdf8" emissiveIntensity={0.26} /></mesh>
        {buttons.map((_, i) => <mesh key={i} position={[-0.2 + (i % 4) * 0.14, -0.2 - Math.floor(i / 4) * 0.18, 0.66]}><cylinderGeometry args={[0.045, 0.045, 0.025, 16]} /><Material color={i % 5 === 0 ? '#f59e0b' : '#bac3c7'} roughness={0.12} /></mesh>)}
      </group>

      {/* Coolant hose + nozzle */}
      <mesh position={[0.72, -0.05, 1.15]} rotation={[0.35, -0.2, -0.5]}><cylinderGeometry args={[0.045, 0.045, 0.9, 16]} /><Material color="#2f3d45" roughness={0.3} /></mesh>
      <mesh position={[0.98, -0.48, 1.33]} rotation={[0.5, -0.15, -0.55]}><coneGeometry args={[0.1, 0.24, 18]} /><Material color="#aab5bb" roughness={0.14} /></mesh>

      {/* Workpiece + cutting chips */}
      <mesh position={[0.05, -0.34, 0.55]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.28, 0.28, 1.1, 36]} /><Material color="#c8d0d4" roughness={0.1} /></mesh>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = i * 0.9;
        const r = 0.45 + (i % 4) * 0.06;
        return <mesh key={i} position={[0.05 + Math.cos(a) * r, -0.18, 0.55 + Math.sin(a) * r]} rotation={[a, 0.3, a]}><boxGeometry args={[0.06, 0.025, 0.22]} /><Material color={i % 3 === 0 ? '#f59e0b' : '#89959c'} metalness={0.82} roughness={0.22} /></mesh>;
      })}

      {/* Status accents */}
      <mesh position={[-2.45, 0.92, 1.54]}><boxGeometry args={[0.08, 0.7, 0.04]} /><Material color="#f59e0b" emissive="#7a4100" intensity={0.6} /></mesh>
      <mesh position={[2.45, 0.92, 1.54]}><boxGeometry args={[0.08, 0.7, 0.04]} /><Material color="#f59e0b" emissive="#7a4100" intensity={0.6} /></mesh>
    </group>
  );
}

function Viewer({ type }: { type: 'bearing' | 'cnc' }) {
  const [active, setActive] = useState(false);

  return (
    <div className={`showcase-viewer ${active ? 'active' : ''}`} onPointerEnter={() => setActive(true)} onPointerLeave={() => setActive(false)}>
      <Canvas dpr={[1, 1.45]} camera={{ position: [0, 0.15, type === 'bearing' ? 5.3 : 8.6], fov: type === 'bearing' ? 38 : 34 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.34} />
        <directionalLight position={[5, 6, 6]} intensity={4.2} color="#fff1db" />
        <directionalLight position={[-5, 2, 2]} intensity={2.3} color="#0ea5e9" />
        <pointLight position={[3, 1, 3]} intensity={9} distance={8} color="#f59e0b" />
        <pointLight position={[-3, -1, 1]} intensity={10} distance={8} color="#38bdf8" />
        <Float speed={active ? 1.55 : 0.8} rotationIntensity={active ? 0.22 : 0.08} floatIntensity={active ? 0.18 : 0.08}>
          {type === 'bearing' ? <DeepGrooveBearing active={active} /> : <VMC1160 active={active} />}
        </Float>
        <Sparkles count={active ? (type === 'bearing' ? 55 : 42) : 18} scale={type === 'bearing' ? [6, 4, 6] : [10, 7, 9]} size={1.05} speed={0.16} opacity={0.25} />
      </Canvas>
      <div className="viewer-scan" />
      <div className="viewer-hud">
        <span>{type === 'bearing' ? 'DEEP-GROOVE BALL BEARING' : 'VERTICAL MACHINING CENTER'}</span>
        <b>{active ? 'LIVE / INSPECTING' : 'MOVE OVER TO INSPECT'}</b>
      </div>
      <div className="viewer-spec">
        {type === 'bearing' ? 'INNER RACE • OUTER RACE • 12 BALLS • CAGE' : 'SPINDLE • WORKTABLE • ATC • CONTROL • ENCLOSURE'}
      </div>
    </div>
  );
}

export default function IndustrialShowcase() {
  return (
    <section id="components" className="component-showcase">
      <div className="showcase-head reveal">
        <div>
          <span className="kicker">08 / REAL COMPONENT LAB</span>
          <h2>Machines &amp; <em>motion.</em></h2>
        </div>
        <p>Interactive 3D studies based on the kinds of hardware an industrial engineering team actually works around: a vertical machining center and a precision deep-groove ball bearing.</p>
      </div>

      <div className="showcase-grid">
        <article className="showcase-card reveal">
          <Viewer type="cnc" />
          <div className="showcase-copy">
            <span>CNC MACHINING</span>
            <h3>Vertical machining center</h3>
            <p>A recognizable VMC-style machine with enclosure panels, sliding safety doors, T-slot worktable, spindle and cutting tool, control cabinet, automatic tool changer, coolant nozzle, workpiece and chip field.</p>
            <div className="spec-tags"><span>VMC</span><span>SPINDLE</span><span>ATC</span><span>T-SLOT TABLE</span><span>CONTROL</span><span>COOLANT</span></div>
          </div>
        </article>

        <article className="showcase-card reveal">
          <Viewer type="bearing" />
          <div className="showcase-copy">
            <span>BEARING ASSEMBLY</span>
            <h3>Deep-groove ball bearing</h3>
            <p>A true bearing-style cross-section visual: concentric outer and inner races, raceway grooves, a 12-ball rolling set, cage ring and inspection rings. Hover to change the operating speed.</p>
            <div className="spec-tags"><span>OUTER RACE</span><span>INNER RACE</span><span>BALLS</span><span>CAGE</span><span>RACEWAYS</span><span>SEALED EDGES</span></div>
          </div>
        </article>
      </div>

      <div className="component-note reveal">
        <span>UJJWAL / VISUAL ENGINEERING LAB</span>
        <strong>VMC • CNC TOOLING • DEEP-GROOVE BEARINGS • MAINTENANCE</strong>
      </div>
    </section>
  );
}
