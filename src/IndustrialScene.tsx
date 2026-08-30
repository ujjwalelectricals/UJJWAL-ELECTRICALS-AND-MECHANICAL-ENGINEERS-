import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Gear({ radius, teeth, speed, position, color = '#18222c' }: { radius: number; teeth: number; speed: number; position: [number, number, number]; color?: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  const toothW = (Math.PI * 2 * radius / teeth) * 0.44;
  return (
    <group ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[radius * 0.72, radius * 0.72, 0.22, 48]} />
        <meshStandardMaterial color={color} metalness={0.94} roughness={0.2} />
      </mesh>
      {Array.from({ length: teeth }).map((_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]} rotation={[0, 0, a]}>
            <boxGeometry args={[toothW, 0.24, radius * 0.25]} />
            <meshStandardMaterial color="#263542" metalness={0.92} roughness={0.22} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[radius * 0.26, 0.055, 12, 32]} />
        <meshStandardMaterial color="#f59e0b" emissive="#6b3b00" emissiveIntensity={0.5} metalness={0.88} roughness={0.16} />
      </mesh>
    </group>
  );
}

function CNCAssembly() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ pointer, clock }) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.18, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.08, 0.04);
    group.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.05;
  });

  return (
    <group ref={group} scale={1.05}>
      <mesh position={[0, -1.65, 0]}><boxGeometry args={[6.3, 0.42, 3.5]} /><meshStandardMaterial color="#0d141b" metalness={0.9} roughness={0.22} /></mesh>
      <mesh position={[0, -1.15, 0]}><boxGeometry args={[5.25, 0.7, 2.7]} /><meshStandardMaterial color="#17222c" metalness={0.84} roughness={0.3} /></mesh>
      <mesh position={[-2.05, 0.3, 0]}><boxGeometry args={[0.52, 2.8, 2.05]} /><meshStandardMaterial color="#202e39" metalness={0.86} roughness={0.25} /></mesh>
      <mesh position={[2.05, 0.3, 0]}><boxGeometry args={[0.52, 2.8, 2.05]} /><meshStandardMaterial color="#202e39" metalness={0.86} roughness={0.25} /></mesh>
      <mesh position={[0, 1.55, 0]}><boxGeometry args={[4.9, 0.38, 2.3]} /><meshStandardMaterial color="#2b3b48" metalness={0.9} roughness={0.2} /></mesh>
      <mesh position={[0, 0.65, 1.18]}><boxGeometry args={[2.5, 1.45, 0.12]} /><meshStandardMaterial color="#061118" emissive="#0a4962" emissiveIntensity={0.55} metalness={0.35} roughness={0.13} /></mesh>
      <mesh position={[0, 0.75, 1.29]}><boxGeometry args={[1.35, 0.62, 0.04]} /><meshStandardMaterial color="#07151c" emissive="#38bdf8" emissiveIntensity={0.2} /></mesh>
      <Gear radius={0.82} teeth={12} speed={0.7} position={[-0.48, 0.72, 1.42]} />
      <Gear radius={0.46} teeth={9} speed={-1.2} position={[0.82, 0.72, 1.42]} color="#222e39" />
      <mesh position={[-0.55, 0.78, -0.35]} rotation={[0, Math.PI / 2, 0]}><cylinderGeometry args={[0.26, 0.26, 2.25, 32]} /><meshStandardMaterial color="#aeb7bf" metalness={0.95} roughness={0.12} /></mesh>
      <mesh position={[0.55, 0.78, -0.35]} rotation={[0, Math.PI / 2, 0]}><cylinderGeometry args={[0.16, 0.16, 1.65, 32]} /><meshStandardMaterial color="#67727d" metalness={0.92} roughness={0.18} /></mesh>
      <pointLight position={[0, 0.6, 2.8]} intensity={12} distance={5} color="#38bdf8" />
      <pointLight position={[-2.2, 0.2, 1.8]} intensity={10} distance={4} color="#f59e0b" />
    </group>
  );
}

function EngineeringCore() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ pointer, clock }) => {
    if (!group.current) return;
    group.current.rotation.y += 0.006;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.12, 0.03);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, pointer.x * 0.08, 0.03);
    group.current.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.15;
  });
  return (
    <group ref={group}>
      <mesh><icosahedronGeometry args={[0.82, 2]} /><meshStandardMaterial color="#17232f" metalness={0.88} roughness={0.16} emissive="#0b4054" emissiveIntensity={0.55} /></mesh>
      <mesh><icosahedronGeometry args={[1.12, 1]} wireframe /><meshBasicMaterial color="#38bdf8" transparent opacity={0.22} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.65, 0.045, 12, 96]} /><meshStandardMaterial color="#f59e0b" emissive="#8a4a00" emissiveIntensity={0.8} metalness={0.9} roughness={0.12} /></mesh>
      <mesh rotation={[0, Math.PI / 2, Math.PI / 5]}><torusGeometry args={[1.3, 0.035, 10, 80]} /><meshStandardMaterial color="#38bdf8" emissive="#08719d" emissiveIntensity={0.8} metalness={0.85} roughness={0.15} /></mesh>
      <mesh rotation={[Math.PI / 5, 0, Math.PI / 2]}><torusGeometry args={[0.95, 0.028, 10, 72]} /><meshStandardMaterial color="#f59e0b" emissive="#6b3b00" emissiveIntensity={0.7} /></mesh>
      <Sparkles count={60} scale={4.7} size={1.3} speed={0.35} opacity={0.55} />
      <pointLight position={[0, 0, 1.8]} intensity={16} distance={6} color="#38bdf8" />
      <pointLight position={[0, 0, -1.8]} intensity={12} distance={5} color="#f59e0b" />
    </group>
  );
}

function ContactOrb() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ pointer, clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.004;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, pointer.y * 0.08, 0.035);
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.1;
  });
  return (
    <group ref={ref}>
      <mesh><sphereGeometry args={[1.05, 48, 48]} /><meshStandardMaterial color="#141e27" metalness={0.9} roughness={0.18} emissive="#112f3c" emissiveIntensity={0.55} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.45, 0.04, 10, 80]} /><meshStandardMaterial color="#f59e0b" emissive="#8a4a00" emissiveIntensity={0.7} /></mesh>
      <mesh rotation={[0.8, 0.25, 0]}><torusGeometry args={[1.32, 0.035, 10, 80]} /><meshStandardMaterial color="#38bdf8" emissive="#08719d" emissiveIntensity={0.65} /></mesh>
      <Sparkles count={36} scale={3.8} size={1.2} speed={0.25} opacity={0.45} />
    </group>
  );
}

function Director() {
  const { camera, pointer } = useThree();
  const hero = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const orb = useRef<THREE.Group>(null);

  useFrame(() => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / maxScroll));

    const heroIn = 1 - THREE.MathUtils.smoothstep(p, 0.08, 0.32);
    const coreIn = THREE.MathUtils.smoothstep(p, 0.2, 0.38) * (1 - THREE.MathUtils.smoothstep(p, 0.55, 0.72));
    const orbIn = THREE.MathUtils.smoothstep(p, 0.64, 0.82);

    if (hero.current) {
      hero.current.position.x = THREE.MathUtils.lerp(hero.current.position.x, THREE.MathUtils.lerp(0.2, -3.8, THREE.MathUtils.smoothstep(p, 0, 0.35)), 0.035);
      hero.current.position.y = THREE.MathUtils.lerp(hero.current.position.y, THREE.MathUtils.lerp(0, 2.6, THREE.MathUtils.smoothstep(p, 0, 0.4)), 0.035);
      hero.current.scale.setScalar(THREE.MathUtils.lerp(hero.current.scale.x, Math.max(0.001, heroIn), 0.045));
    }
    if (core.current) {
      core.current.position.x = THREE.MathUtils.lerp(core.current.position.x, THREE.MathUtils.lerp(4.2, -0.4, THREE.MathUtils.smoothstep(p, 0.22, 0.62)), 0.035);
      core.current.position.y = THREE.MathUtils.lerp(core.current.position.y, THREE.MathUtils.lerp(-3, 0.2, THREE.MathUtils.smoothstep(p, 0.2, 0.5)), 0.035);
      core.current.scale.setScalar(THREE.MathUtils.lerp(core.current.scale.x, Math.max(0.001, coreIn), 0.045));
    }
    if (orb.current) {
      orb.current.position.x = THREE.MathUtils.lerp(orb.current.position.x, THREE.MathUtils.lerp(3.8, 0, THREE.MathUtils.smoothstep(p, 0.64, 0.9)), 0.035);
      orb.current.position.y = THREE.MathUtils.lerp(orb.current.position.y, THREE.MathUtils.lerp(-2.2, 0.2, THREE.MathUtils.smoothstep(p, 0.64, 0.9)), 0.035);
      orb.current.scale.setScalar(THREE.MathUtils.lerp(orb.current.scale.x, Math.max(0.001, orbIn), 0.05));
    }

    const targetX = pointer.x * 0.3;
    const targetY = pointer.y * 0.15 + (p - 0.5) * 0.22;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.025);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.025);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9.3 - p * 1.4, 0.025);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <group ref={hero}><Float speed={1.0} rotationIntensity={0.12} floatIntensity={0.18}><CNCAssembly /></Float></group>
      <group ref={core}><Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.28}><EngineeringCore /></Float></group>
      <group ref={orb}><Float speed={0.9} rotationIntensity={0.15} floatIntensity={0.25}><ContactOrb /></Float></group>
    </>
  );
}

export default function IndustrialScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 9.3], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <color attach="background" args={['#05080b']} />
      <fog attach="fog" args={['#05080b', 9, 23]} />
      <ambientLight intensity={0.38} />
      <directionalLight position={[5, 7, 6]} intensity={3.3} color="#fff3dc" />
      <directionalLight position={[-6, 3, 2]} intensity={2.1} color="#0ea5e9" />
      <pointLight position={[0, 1, 5]} intensity={10} distance={12} color="#f59e0b" />
      <Sparkles count={140} scale={[22, 12, 18]} size={1.05} speed={0.16} opacity={0.28} />
      <Director />
    </Canvas>
  );
}
