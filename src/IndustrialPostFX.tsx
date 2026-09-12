import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { useEffect, useMemo, useState } from 'react';
import { Vector2 } from 'three';

type QualityTier = 'high' | 'low';

/**
 * Cinematic post-processing kept adaptive so the desktop can look rich while
 * integrated graphics/mobile devices avoid an unnecessary render-cost spike.
 */
export default function IndustrialPostFX({ mobile, quality, reducedMotion }: {
  mobile: boolean;
  quality: QualityTier;
  reducedMotion: boolean;
}) {
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const lowPower = mobile || quality === 'low';
  const chromaticOffset = useMemo(() => new Vector2(lowPower ? 0.00025 : 0.00065, lowPower ? 0.00025 : 0.00065), [lowPower]);

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
