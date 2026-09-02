import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Float, Sparkles } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const MOBILE_BREAKPOINT = 820;

function Metal({ color = '#7c8992', roughness = 0.26, metalness = 0.88, emissive = '#000000', emissiveIntensity = 0 }: {
  color?: string; roughness?: number; metalness?: number; emissive?: string; emissiveIntensity?: number;
}) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} emissive={emissive} emissiveIntensity={emissiveIntensity} envMapIntensity={1.15} />;
}

function useScenePulse() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (document.hidden || !ref.current) return;
    ref.current.rotation.y += delta * 0.12;
  });
  return ref;
}

function ScanlineRing({ mobile }: { mobile: boolean }) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#0ea5e9') } },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform float uTime; uniform vec3 uColor; varying vec2 vUv; void main(){float wave=sin((vUv.y+uTime*0.08)*48.0)*0.5+0.5;float band=smoothstep(0.89,1.0,wave);float edge=smoothstep(0.50,0.03,abs(vUv.x-0.5));gl_FragColor=vec4(uColor,band*edge*${mobile ? 0.22 : 0.34});}`,
  }), [mobile]);
  useEffect(() => () => material.dispose(), [material]);
  useFrame((_, delta) => { if (!document.hidden) material.uniforms.uTime.value += delta; });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, 0]}>
      <ringGeometry args={[3.4, 4.35, mobile ? 48 : 72]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function BearingAssembly({ position, mobile }: { position: [number, number, number]; mobile: boolean }) {
  const ref = useScenePulse();
  const count = mobile ? 8 : 12;
  return (
    <group ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow receiveShadow><torusGeometry args={[0.78, 0.16, 12, mobile ? 32 : 52]} /><Metal color="#303c46" roughness={0.22} /></mesh>
      <mesh><torusGeometry args={[0.48, 0.11, 10, mobile ? 28 : 42]} /><Metal color="#bcc5ca" roughness={0.13} /></mesh>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        return <mesh key={i} position={[Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0]} castShadow><sphereGeometry args={[0.105, mobile ? 10 : 16, mobile ? 10 : 16]} /><Metal color="#e1e6e9" roughness={0.09} metalness={0.97} /></mesh>;
      })}
      <mesh position={[0, 0, 0.035]}><torusGeometry args={[0.63, 0.026, 8, 48]} /><meshStandardMaterial color="#f59e0b" emissive="#7a4100" emissiveIntensity={0.75} metalness={0.8} roughness={0.14} /></mesh>
    </group>
  );
}

function Spindle({ speed }: { speed: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (!document.hidden && ref.current) ref.current.rotation.z += delta * speed; });
  return (
    <group ref={ref} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.58, 0.58, 0.62, 36]} /><Metal color="#6e7b85" roughness={0.15} /></mesh>
      <mesh position={[0, 0.50, 0]} castShadow><cylinderGeometry args={[0.40, 0.40, 0.28, 32]} /><Metal color="#b7c1c6" roughness={0.12} /></mesh>
      <mesh position={[0, 0.74, 0]} castShadow><cylinderGeometry args={[0.23, 0.23, 0.34, 28]} /><Metal color="#e0e6e9" roughness={0.09} /></mesh>
      <mesh position={[0, 1.04, 0]} castShadow><coneGeometry args={[0.17, 0.42, 24]} /><Metal color="#d2d9dd" roughness={0.1} /></mesh>
      <mesh position={[0, 1.36, 0]} castShadow><cylinderGeometry args={[0.085, 0.085, 0.52, 20]} /><Metal color="#f2f4f5" roughness={0.08} /></mesh>
      <mesh position={[0, 1.63, 0]}><cylinderGeometry args={[0.12, 0.12, 0.06, 20]} /><meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.0} metalness={0.8} roughness={0.15} /></mesh>
    </group>
  );
}

function CNCAssembly({ mobile }: { mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const carriage = useRef<THREE.Group>(null);
  useFrame(({ pointer, clock }, delta) => {
    if (document.hidden || !group.current || !carriage.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.13, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.045, 0.04);
    group.current.position.y = Math.sin(clock.elapsedTime * 0.75) * 0.025;
    carriage.current.position.x = Math.sin(clock.elapsedTime * 0.55) * 0.35;
  });
  return (
    <group ref={group} scale={mobile ? 0.72 : 0.98}>
      <mesh position={[0, -1.72, 0]} castShadow receiveShadow><boxGeometry args={[6.0, 0.42, 3.2]} /><Metal color="#1b252d" roughness={0.25} /></mesh>
      <mesh position={[0, -1.27, 0]} castShadow receiveShadow><boxGeometry args={[5.2, 0.70, 2.65]} /><Metal color="#25343e" roughness={0.29} /></mesh>
      <mesh position={[-2.02, 0.34, 0]} castShadow receiveShadow><boxGeometry args={[0.54, 2.78, 2.0]} /><Metal color="#33444f" roughness={0.25} /></mesh>
      <mesh position={[2.02, 0.34, 0]} castShadow receiveShadow><boxGeometry args={[0.54, 2.78, 2.0]} /><Metal color="#33444f" roughness={0.25} /></mesh>
      <mesh position={[0, 1.54, 0]} castShadow receiveShadow><boxGeometry args={[4.72, 0.34, 2.22]} /><Metal color="#40535f" roughness={0.20} /></mesh>
      <mesh position={[0, -0.70, 0.98]} castShadow><boxGeometry args={[4.0, 0.12, 0.12]} /><Metal color="#a6b1b7" roughness={0.14} /></mesh>
      <mesh position={[0, -0.70, 0.62]} castShadow><boxGeometry args={[4.0, 0.12, 0.12]} /><Metal color="#a6b1b7" roughness={0.14} /></mesh>
      <group ref={carriage} position={[-0.4, 0.08, 0.15]}>
        <mesh position={[0, -0.06, -0.05]} castShadow><boxGeometry args={[0.92, 0.98, 0.75]} /><Metal color="#344750" roughness={0.24} /></mesh>
        <Spindle speed={5.8} />
      </group>
      <BearingAssembly position={[1.18, -0.15, 1.04]} mobile={mobile} />
      <mesh position={[1.18, 0.82, 1.04]} rotation={[0, Math.PI / 2, 0]} castShadow><cylinderGeometry args={[0.30, 0.30, 1.06, 32]} /><Metal color="#c4ccd0" roughness={0.10} /></mesh>
      <mesh position={[2.27, 0.46, 1.22]} rotation={[0.08, -0.18, 0]} castShadow><boxGeometry args={[0.50, 1.12, 0.16]} /><Metal color="#101920" roughness={0.22} /></mesh>
      <mesh position={[2.27, 0.64, 1.30]} rotation={[0.08, -0.18, 0]}><boxGeometry args={[0.31, 0.37, 0.025]} /><meshStandardMaterial color="#06141a" emissive="#38bdf8" emissiveIntensity={0.65} roughness={0.18} metalness={0.65} /></mesh>
      <pointLight position={[-0.15, 0.28, 1.75]} intensity={mobile ? 3 : 5} distance={4.6} color="#38bdf8" />
    </group>
  );
}

function Director({ mobile, reducedMotion }: { mobile: boolean; reducedMotion: boolean }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const time = useRef(0);
  const last = useRef(performance.now());
  const slow = useRef(0);
  const [qualityDrop, setQualityDrop] = useState(false);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      target.current.x = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      target.current.y = -(event.clientY / Math.max(1, window.innerHeight)) * 2 + 1;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  useFrame((_, delta) => {
    if (document.hidden) return;
    const now = performance.now();
    const frame = now - last.current;
    last.current = now;
    if (frame > 34) slow.current += delta; else slow.current = Math.max(0, slow.current - delta * 0.5);
    if (!qualityDrop && slow.current > 2) setQualityDrop(true);
    time.current += delta;
    current.current.x = THREE.MathUtils.lerp(current.current.x, target.current.x, 0.035);
    current.current.y = THREE.MathUtils.lerp(current.current.y, target.current.y, 0.035);
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
    const idle = reducedMotion ? 0 : Math.sin(time.current * 0.4) * 0.05;
    const x = current.current.x * (mobile ? 0.25 : 0.48) + Math.sin(progress * Math.PI * 0.6) * 0.14;
    const y = 0.22 + current.current.y * (mobile ? 0.10 : 0.18) + idle;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, x, 0.055);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, 0.055);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, mobile ? (qualityDrop ? 9.5 : 8.9) : (qualityDrop ? 8.4 : 7.8), 0.05);
    camera.lookAt(0, -0.25 + progress * 0.25, 0);
  });
  return null;
}

function SceneContent({ mobile, reducedMotion }: { mobile: boolean; reducedMotion: boolean }) {
  return <>
    <ambientLight intensity={mobile ? 1.0 : 0.82} color="#ffffff" />
    <hemisphereLight args={['#f8fbfc', '#17242c', mobile ? 0.65 : 0.80]} />
    <directionalLight position={[4, 8, 6]} intensity={mobile ? 1.7 : 2.4} color="#fff1dc" castShadow={!mobile} shadow-mapSize-width={mobile ? 0 : 1536} shadow-mapSize-height={mobile ? 0 : 1536} shadow-bias={-0.0003} />
    <spotLight position={[-4, 5, 4]} intensity={mobile ? 2 : 3.8} distance={14} angle={0.55} penumbra={0.8} color="#38bdf8" />
    <pointLight position={[2.5, 1.5, 4]} intensity={mobile ? 1.8 : 3.6} distance={8} color="#f59e0b" />
    <Float speed={reducedMotion ? 0 : 0.65} rotationIntensity={reducedMotion ? 0 : 0.07} floatIntensity={reducedMotion ? 0 : 0.14}>
      <CNCAssembly mobile={mobile} />
    </Float>
    <ScanlineRing mobile={mobile} />
    {!mobile && !reducedMotion && <Sparkles count={62} scale={[18, 10, 14]} size={0.65} speed={0.11} opacity={0.14} />}
    {!mobile && <ContactShadows position={[0, -1.92, 0]} opacity={0.26} scale={8} blur={2.7} far={5.5} resolution={256} />}
    <Director mobile={mobile} reducedMotion={reducedMotion} />
  </>;
}

export default function IndustrialScene() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const resize = () => setMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const motion = () => setReducedMotion(Boolean(media?.matches));
    window.addEventListener('resize', resize, { passive: true });
    media?.addEventListener?.('change', motion);
    return () => { window.removeEventListener('resize', resize); media?.removeEventListener?.('change', motion); };
  }, []);
  return <div className="industrial-scene-canvas" aria-hidden="true">
    <Canvas dpr={mobile ? [1, 1.15] : [1, 1.7]} camera={{ position: [0, 0.2, mobile ? 8.9 : 7.8], fov: mobile ? 42 : 48, near: 0.1, far: 40 }} shadows="soft" gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }}>
      <SceneContent mobile={mobile} reducedMotion={reducedMotion} />
    </Canvas>
  </div>;
}
