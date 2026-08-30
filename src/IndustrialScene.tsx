import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Metal({ color = '#263542', emissive, intensity = 0, roughness = 0.24 }: { color?: string; emissive?: string; intensity?: number; roughness?: number }) {
  return <meshStandardMaterial color={color} metalness={0.92} roughness={roughness} emissive={emissive} emissiveIntensity={intensity} />;
}

function Spindle({ position = [0, 0, 0] as [number, number, number], speed = 2.6 }: { position?: [number, number, number]; speed?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.z += delta * speed; });
  return (
    <group ref={ref} position={position} rotation={[0, Math.PI / 2, 0]}>
      <mesh><cylinderGeometry args={[0.6, 0.6, 0.7, 48]} /><Metal color="#71808b" roughness={0.16} /></mesh>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.42, 0.42, 0.35, 40]} /><Metal color="#aeb8bf" roughness={0.12} /></mesh>
      <mesh position={[0, 0.77, 0]}><cylinderGeometry args={[0.25, 0.25, 0.38, 32]} /><Metal color="#e1e6e8" roughness={0.1} /></mesh>
      <mesh position={[0, 1.04, 0]}><coneGeometry args={[0.18, 0.48, 32]} /><Metal color="#d2d9dd" roughness={0.1} /></mesh>
      <mesh position={[0, 1.36, 0]}><cylinderGeometry args={[0.095, 0.095, 0.55, 24]} /><Metal color="#f0f3f4" roughness={0.08} /></mesh>
      <mesh position={[0, 1.67, 0]}><cylinderGeometry args={[0.14, 0.14, 0.06, 24]} /><meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.15} emissive="#f59e0b" emissiveIntensity={0.35} /></mesh>
    </group>
  );
}

function Chuck({ position = [0, 0, 0] as [number, number, number] }: { position?: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.z += delta * 1.5; });
  const jaws = [0, 1, 2].map((i) => (i / 3) * Math.PI * 2);
  return (
    <group ref={ref} position={position} rotation={[0, Math.PI / 2, 0]}>
      <mesh><cylinderGeometry args={[1.0, 1.0, 0.5, 64]} /><Metal color="#1d2831" roughness={0.2} /></mesh>
      <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.75, 0.75, 0.16, 56]} /><Metal color="#51606c" roughness={0.18} /></mesh>
      <mesh position={[0, 0.39, 0]}><torusGeometry args={[0.5, 0.055, 12, 48]} /><meshStandardMaterial color="#f59e0b" metalness={0.84} roughness={0.16} emissive="#5a3000" emissiveIntensity={0.28} /></mesh>
      {jaws.map((a) => <mesh key={a} position={[Math.cos(a) * 0.4, 0.48, Math.sin(a) * 0.4]} rotation={[0, 0, a]}><boxGeometry args={[0.22, 0.32, 0.68]} /><Metal color="#8e9aa3" roughness={0.14} /></mesh>)}
      <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.16, 0.16, 0.9, 32]} /><Metal color="#cbd2d7" roughness={0.12} /></mesh>
    </group>
  );
}

function ToolTurret() {
  const ref = useRef<THREE.Group>(null);
  const toolRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.18;
    if (toolRef.current) toolRef.current.position.x = -0.9 + Math.sin(clock.elapsedTime * 0.7) * 0.28;
  });
  return (
    <group ref={ref} position={[1.2, -0.05, 0.7]}>
      <mesh><cylinderGeometry args={[0.62, 0.72, 0.55, 8]} /><Metal color="#46545f" roughness={0.25} /></mesh>
      <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.48, 0.48, 0.18, 8]} /><Metal color="#667580" roughness={0.2} /></mesh>
      <group ref={toolRef} position={[-0.9, 0.1, 0]}><mesh><boxGeometry args={[1.0, 0.22, 0.18]} /><Metal color="#a9b3b9" roughness={0.15} /></mesh><mesh position={[0.55, -0.02, 0]} rotation={[0, 0, -0.55]}><coneGeometry args={[0.14, 0.5, 6]} /><meshStandardMaterial color="#d7dde0" metalness={0.88} roughness={0.12} /></mesh></group>
      {Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.4, 0.48, Math.sin(a) * 0.4]} rotation={[0, -a, 0]}><boxGeometry args={[0.13, 0.18, 0.32]} /><Metal color="#9aa6ae" roughness={0.16} /></mesh>; })}
    </group>
  );
}

function CNCAssembly() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.14, 0.035);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.06, 0.035);
    group.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.035;
  });
  return (
    <group ref={group} scale={1.02}>
      <mesh position={[0, -1.7, 0]}><boxGeometry args={[6.5, 0.42, 3.6]} /><Metal color="#0d141b" roughness={0.22} /></mesh>
      <mesh position={[0, -1.22, 0]}><boxGeometry args={[5.4, 0.72, 2.8]} /><Metal color="#17222c" roughness={0.29} /></mesh>
      <mesh position={[-2.15, 0.35, 0]}><boxGeometry args={[0.55, 2.9, 2.15]} /><Metal color="#263641" roughness={0.24} /></mesh>
      <mesh position={[2.15, 0.35, 0]}><boxGeometry args={[0.55, 2.9, 2.15]} /><Metal color="#263641" roughness={0.24} /></mesh>
      <mesh position={[0, 1.58, 0]}><boxGeometry args={[5.0, 0.38, 2.35]} /><Metal color="#344550" roughness={0.2} /></mesh>
      <mesh position={[0, -0.72, 1.08]}><boxGeometry args={[4.35, 0.14, 0.14]} /><Metal color="#89969f" roughness={0.16} /></mesh>
      <mesh position={[0, -0.72, 0.72]}><boxGeometry args={[4.35, 0.14, 0.14]} /><Metal color="#89969f" roughness={0.16} /></mesh>
      <mesh position={[-0.95, -0.35, 0.88]}><boxGeometry args={[0.72, 0.45, 0.5]} /><Metal color="#4b5964" roughness={0.24} /></mesh>
      <group position={[-0.45, 0.1, 0.15]}><Spindle position={[0, 0, 0]} speed={4.8} /><mesh position={[0, -0.05, -0.08]}><boxGeometry args={[0.9, 1.0, 0.8]} /><Metal color="#2d3d48" roughness={0.24} /></mesh></group>
      <Chuck position={[1.15, -0.15, 1.1]} />
      <ToolTurret />
      <mesh position={[1.15, 0.86, 1.1]} rotation={[0, Math.PI / 2, 0]}><cylinderGeometry args={[0.32, 0.32, 1.15, 48]} /><Metal color="#c1c8cc" roughness={0.11} /></mesh>
      <mesh position={[2.35, 0.45, 1.25]} rotation={[0.08, -0.18, 0]}><boxGeometry args={[0.55, 1.25, 0.18]} /><Metal color="#111a21" roughness={0.22} /></mesh>
      <mesh position={[2.35, 0.63, 1.35]} rotation={[0.08, -0.18, 0]}><boxGeometry args={[0.35, 0.42, 0.03]} /><meshStandardMaterial color="#07151c" emissive="#38bdf8" emissiveIntensity={0.42} /></mesh>
      <mesh position={[2.35, 0.1, 1.35]} rotation={[0.08, -0.18, 0]}><boxGeometry args={[0.12, 0.12, 0.04]} /><meshStandardMaterial color="#f59e0b" emissive="#8a4a00" emissiveIntensity={0.65} /></mesh>
      <mesh position={[0.25, 0.7, 1.45]} rotation={[0.3, 0.35, -0.35]}><cylinderGeometry args={[0.055, 0.055, 0.72, 20]} /><Metal color="#687781" roughness={0.18} /></mesh>
      <mesh position={[0.42, 0.98, 1.72]} rotation={[0.2, 0.25, -0.2]}><coneGeometry args={[0.09, 0.22, 20]} /><meshStandardMaterial color="#a9b3b9" metalness={0.86} roughness={0.14} /></mesh>
      <pointLight position={[-0.2, 0.2, 2.0]} intensity={14} distance={5} color="#38bdf8" /><pointLight position={[1.4, 0.7, 1.8]} intensity={9} distance={4} color="#f59e0b" />
    </group>
  );
}

function SpindleDetail() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ pointer, clock }) => { if (!ref.current) return; ref.current.rotation.y += 0.006; ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, pointer.y * 0.1, 0.04); ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, pointer.x * 0.08, 0.04); ref.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.1; });
  return <group ref={ref}><Spindle speed={5.8} position={[0, -0.5, 0]} /><Chuck position={[0, -1.1, 0]} /><mesh position={[0, 0.55, 0]}><torusGeometry args={[1.0, 0.045, 12, 96]} /><meshStandardMaterial color="#38bdf8" emissive="#08719d" emissiveIntensity={0.6} metalness={0.85} roughness={0.12} /></mesh><mesh position={[0, 0.55, 0]}><torusGeometry args={[1.22, 0.03, 10, 80]} /><meshStandardMaterial color="#f59e0b" emissive="#7a4100" emissiveIntensity={0.65} metalness={0.85} roughness={0.14} /></mesh><Sparkles count={32} scale={[3.8, 4.2, 3.8]} size={1.1} speed={0.25} opacity={0.45} /></group>;
}

function ToolPathDetail() {
  const tool = useRef<THREE.Group>(null); const stock = useRef<THREE.Mesh>(null);
  useFrame(({ clock, pointer }) => { const t = (Math.sin(clock.elapsedTime * 0.65) + 1) / 2; if (tool.current) { tool.current.position.x = THREE.MathUtils.lerp(-1.7, 1.7, t); tool.current.rotation.y = pointer.x * 0.16; } if (stock.current) stock.current.rotation.y = pointer.y * 0.12; });
  return <group><mesh ref={stock} position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.62, 0.62, 4.1, 64]} /><Metal color="#8d999f" roughness={0.15} /></mesh><mesh position={[0, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.42, 0.42, 4.15, 64]} /><meshStandardMaterial color="#4a5964" metalness={0.9} roughness={0.18} emissive="#081820" emissiveIntensity={0.18} /></mesh><group ref={tool} position={[-1.7, 0.95, 0]}><mesh><boxGeometry args={[0.85, 0.22, 0.18]} /><Metal color="#d2d9dd" roughness={0.1} /></mesh><mesh position={[0.47, -0.05, 0]} rotation={[0, 0, -0.65]}><coneGeometry args={[0.13, 0.46, 6]} /><meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.12} emissive="#5a3000" emissiveIntensity={0.35} /></mesh><Sparkles count={16} scale={0.8} size={1.5} speed={0.5} opacity={0.55} /></group><pointLight position={[0, 0.6, 1.4]} intensity={8} distance={4} color="#38bdf8" /></group>;
}

function Director() {
  const { camera } = useThree();
  const input = useRef({ x: 0, y: 0 }); const hero = useRef<THREE.Group>(null); const spindle = useRef<THREE.Group>(null); const toolPath = useRef<THREE.Group>(null);
  useEffect(() => { const move = (event: PointerEvent) => { input.current.x = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1; input.current.y = -(event.clientY / Math.max(1, window.innerHeight)) * 2 + 1; }; window.addEventListener('pointermove', move, { passive: true }); return () => window.removeEventListener('pointermove', move); }, []);
  useFrame(() => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); const p = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
    const heroIn = 1 - THREE.MathUtils.smoothstep(p, 0.08, 0.27); const spindleIn = THREE.MathUtils.smoothstep(p, 0.22, 0.4) * (1 - THREE.MathUtils.smoothstep(p, 0.5, 0.66)); const toolIn = THREE.MathUtils.smoothstep(p, 0.58, 0.74) * (1 - THREE.MathUtils.smoothstep(p, 0.86, 1));
    if (hero.current) { const f = THREE.MathUtils.smoothstep(p, 0, 0.32); hero.current.position.x = THREE.MathUtils.lerp(hero.current.position.x, THREE.MathUtils.lerp(0.5, -3.7, f), 0.035); hero.current.position.y = THREE.MathUtils.lerp(hero.current.position.y, THREE.MathUtils.lerp(0, 2.6, f), 0.035); hero.current.scale.setScalar(THREE.MathUtils.lerp(hero.current.scale.x, Math.max(0.001, heroIn), 0.045)); }
    if (spindle.current) { spindle.current.position.x = THREE.MathUtils.lerp(spindle.current.position.x, THREE.MathUtils.lerp(4.2, -0.1, THREE.MathUtils.smoothstep(p, 0.2, 0.58)), 0.035); spindle.current.position.y = THREE.MathUtils.lerp(spindle.current.position.y, THREE.MathUtils.lerp(-3.0, 0.15, THREE.MathUtils.smoothstep(p, 0.2, 0.5)), 0.035); spindle.current.scale.setScalar(THREE.MathUtils.lerp(spindle.current.scale.x, Math.max(0.001, spindleIn), 0.045)); }
    if (toolPath.current) { toolPath.current.position.x = THREE.MathUtils.lerp(toolPath.current.position.x, THREE.MathUtils.lerp(4.0, 0.1, THREE.MathUtils.smoothstep(p, 0.58, 0.9)), 0.035); toolPath.current.position.y = THREE.MathUtils.lerp(toolPath.current.position.y, THREE.MathUtils.lerp(-2.3, -0.2, THREE.MathUtils.smoothstep(p, 0.58, 0.86)), 0.035); toolPath.current.scale.setScalar(THREE.MathUtils.lerp(toolPath.current.scale.x, Math.max(0.001, toolIn), 0.05)); }
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, input.current.x * 0.35, 0.028); camera.position.y = THREE.MathUtils.lerp(camera.position.y, input.current.y * 0.18 + (p - 0.5) * 0.2, 0.028); camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9.5 - p * 1.1, 0.025); camera.lookAt(0, 0, 0);
  });
  return <><group ref={hero}><Float speed={0.9} rotationIntensity={0.08} floatIntensity={0.12}><CNCAssembly /></Float></group><group ref={spindle}><Float speed={1.0} rotationIntensity={0.12} floatIntensity={0.2}><SpindleDetail /></Float></group><group ref={toolPath}><Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.16}><ToolPathDetail /></Float></group></>;
}

export default function IndustrialScene() {
  const compact = typeof window !== 'undefined' && window.innerWidth < 768;
  return <Canvas className="industrial-scene-canvas" dpr={compact ? [0.7, 1] : [1, 1.35]} camera={{ position: [0, 0, 9.5], fov: 42 }} gl={{ antialias: !compact, alpha: true, powerPreference: 'high-performance' }} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
    <ambientLight intensity={compact ? 0.28 : 0.34} />
    <directionalLight position={[5, 7, 6]} intensity={3.0} color="#fff3dc" />
    <directionalLight position={[-6, 3, 2]} intensity={1.7} color="#0ea5e9" />
    <pointLight position={[0, 1, 5]} intensity={8} distance={12} color="#f59e0b" />
    <Sparkles count={compact ? 40 : 90} scale={[22, 12, 18]} size={compact ? 0.65 : 0.9} speed={0.14} opacity={0.16} />
    <Director />
  </Canvas>;
}
