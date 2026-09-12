import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Color, MathUtils, Raycaster, Vector2, type Mesh, type MeshStandardMaterial } from 'three';

type QualityTier = 'high' | 'low';
type HotspotId = 'bearing' | 'spindle' | null;
type HotspotEntry = {
  hotspot: Exclude<HotspotId, null>;
  mesh: Mesh;
  material: MeshStandardMaterial;
  baseEmissive: Color;
  baseIntensity: number;
};

const HOTSPOT_CYAN = new Color('#22d3ee');

function getStandardMaterial(mesh: Mesh): MeshStandardMaterial | null {
  if (Array.isArray(mesh.material)) return null;
  return mesh.material instanceof Object && 'emissive' in mesh.material
    ? (mesh.material as MeshStandardMaterial)
    : null;
}

function classifyMesh(mesh: Mesh): Exclude<HotspotId, null> | null {
  const geometry = mesh.geometry as typeof mesh.geometry & { parameters?: Record<string, number> };
  const params = geometry.parameters || {};

  // Unique geometry signatures from the existing handcrafted industrial scene.
  if (geometry.type === 'TorusGeometry' && Math.abs((params.torusRadius ?? 0) - 0.78) < 0.01 && Math.abs((params.tube ?? 0) - 0.16) < 0.01) {
    return 'bearing';
  }
  if (geometry.type === 'CylinderGeometry' && Math.abs((params.radiusTop ?? 0) - 0.58) < 0.01 && Math.abs((params.height ?? 0) - 0.62) < 0.01) {
    return 'spindle';
  }
  return null;
}

function playHoverCue() {
  try {
    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;
    const ctx = new AudioContextCtor();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 660;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.018, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.055);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.06);
    window.setTimeout(() => void ctx.close(), 120);
  } catch {
    // Ignore browser audio-policy restrictions.
  }
}

/**
 * Adaptive cinematic post-processing plus a centralized mechanical raycaster.
 * The interaction layer stays inside the existing R3F scene, so the CNC model
 * and its performance controls do not need a second Canvas or dozens of handlers.
 */
export default function IndustrialPostFX({ mobile, quality, reducedMotion }: {
  mobile: boolean;
  quality: QualityTier;
  reducedMotion: boolean;
}) {
  const { scene, camera, gl } = useThree();
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const [activeHotspot, setActiveHotspot] = useState<HotspotId>(null);
  const raycaster = useMemo(() => new Raycaster(), []);
  const pointer = useRef(new Vector2());
  const hotspots = useRef<HotspotEntry[]>([]);
  const lastHotspot = useRef<HotspotId>(null);
  const cueLock = useRef(false);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const entries: HotspotEntry[] = [];
    scene.traverse((object) => {
      if (!(object as Mesh).isMesh) return;
      const mesh = object as Mesh;
      const hotspot = classifyMesh(mesh);
      const material = hotspot ? getStandardMaterial(mesh) : null;
      if (!hotspot || !material) return;
      entries.push({
        hotspot,
        mesh,
        material,
        baseEmissive: material.emissive.clone(),
        baseIntensity: material.emissiveIntensity,
      });
    });
    hotspots.current = entries;
    return () => { hotspots.current = []; };
  }, [scene]);

  useEffect(() => {
    const root = document.documentElement;
    const styleId = 'ueme-mechanical-hotspot-styles';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        [data-mechanical-hotspot="bearing"] .home-cards-light .bento-tall,
        [data-mechanical-hotspot="spindle"] .home-cards-light .bento-wide {
          outline: 2px solid rgba(34,211,238,.68);
          outline-offset: 4px;
          box-shadow: 0 0 0 1px rgba(34,211,238,.18), 0 18px 55px rgba(34,211,238,.16);
          transform: translateY(-3px);
          transition: outline-color .25s ease, box-shadow .25s ease, transform .25s ease;
        }
        [data-mechanical-hotspot="bearing"] .home-cards-light .bento-tall::after,
        [data-mechanical-hotspot="spindle"] .home-cards-light .bento-wide::after {
          content: '3D PART HIGHLIGHT';
          position: absolute;
          top: 14px;
          right: 16px;
          font-size: 9px;
          letter-spacing: .14em;
          font-weight: 800;
          color: #0891b2;
        }
      `;
      document.head.appendChild(style);
    }
    if (activeHotspot) root.dataset.mechanicalHotspot = activeHotspot;
    else delete root.dataset.mechanicalHotspot;
    return () => { delete root.dataset.mechanicalHotspot; };
  }, [activeHotspot]);

  useEffect(() => {
    const canvas = gl.domElement;
    const getCanvasBounds = () => canvas.getBoundingClientRect();

    const onPointerOver = () => undefined;
    const onPointerOut = () => {
      lastHotspot.current = null;
      setActiveHotspot(null);
    };
    const onPointerMove = (event: PointerEvent) => {
      const bounds = getCanvasBounds();
      if (!bounds.width || !bounds.height) return;
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!inside) return;

      pointer.current.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer.current, camera);

      const hits = raycaster.intersectObjects(scene.children, true);
      let next: HotspotId = null;
      for (const hit of hits) {
        let object = hit.object;
        while (object) {
          if ((object as Mesh).isMesh) {
            const hotspot = classifyMesh(object as Mesh);
            if (hotspot) {
              next = hotspot;
              break;
            }
          }
          object = object.parent as typeof object;
        }
        if (next) break;
      }

      if (next !== lastHotspot.current) {
        lastHotspot.current = next;
        setActiveHotspot(next);
        if (next && !cueLock.current) {
          cueLock.current = true;
          navigator.vibrate?.(8);
          playHoverCue();
          window.setTimeout(() => { cueLock.current = false; }, 120);
        }
      }
    };

    canvas.addEventListener('pointerover', onPointerOver, { passive: true });
    canvas.addEventListener('pointerout', onPointerOut, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      canvas.removeEventListener('pointerover', onPointerOver);
      canvas.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [camera, gl, raycaster, scene]);

  const lowPower = mobile || quality === 'low';
  const chromaticOffset = useMemo(
    () => new Vector2(lowPower ? 0.00025 : 0.00065, lowPower ? 0.00025 : 0.00065),
    [lowPower],
  );

  useFrame((_, delta) => {
    if (!visible || reducedMotion) return;
    const blend = 1 - Math.exp(-delta * 10);
    for (const entry of hotspots.current) {
      const active = activeHotspot === entry.hotspot;
      entry.material.emissive.copy(entry.baseEmissive).lerp(HOTSPOT_CYAN, active ? 1 : 0);
      entry.material.emissiveIntensity = MathUtils.lerp(
        entry.material.emissiveIntensity,
        active ? Math.max(entry.baseIntensity, 1.15) : entry.baseIntensity,
        blend,
      );
    }
  });

  if (!visible || reducedMotion) return null;

  return (
    <EffectComposer
      enabled
      multisampling={lowPower ? 0 : 2}
      renderPriority={-1}
    >
      <Bloom
        intensity={lowPower ? 0.32 : 0.58}
        luminanceThreshold={0.78}
        luminanceSmoothing={0.62}
        mipmapBlur
        levels={lowPower ? 1 : 2}
      />
      <Noise opacity={lowPower ? 0.008 : 0.014} premultiply />
      <Vignette eskil={false} offset={0.22} darkness={lowPower ? 0.58 : 0.72} />
      <ChromaticAberration offset={chromaticOffset} radialModulation={false} modulationOffset={0.15} />
    </EffectComposer>
  );
}
