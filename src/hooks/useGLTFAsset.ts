import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import type { Material, Object3D, Texture } from 'three';

type GLTFResult = ReturnType<typeof useGLTF>;

export function preloadGLTFAsset(path: string) {
  useGLTF.preload(path);
}

function disposeMaterial(material: Material) {
  material.dispose();
  const values = Object.values(material) as unknown[];
  for (const value of values) {
    if (value && typeof value === 'object' && 'isTexture' in value && value.isTexture) {
      (value as Texture).dispose();
    }
  }
}

/**
 * Dispose a local, non-cached Object3D tree that your component owns.
 * Do not call this on the scene returned directly by useGLTF: Drei caches
 * GLTF assets and other components may still be sharing the same resources.
 */
export function disposeOwnedObject3D(root: Object3D) {
  root.traverse((object) => {
    const mesh = object as Object3D & {
      geometry?: { dispose: () => void };
      material?: Material | Material[];
    };
    mesh.geometry?.dispose();
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(disposeMaterial);
    } else if (mesh.material) {
      disposeMaterial(mesh.material);
    }
  });
}

/**
 * Reusable loader for future optimized GLB/GLTF assets under public/models-optimized/.
 * The hook intentionally does not dispose Drei's cached result on unmount.
 */
export function useGLTFAsset(path: string): GLTFResult {
  const result = useGLTF(path) as GLTFResult;
  useMemo(() => result, [result]);

  useEffect(() => {
    // Intentionally no cache disposal here. Shared Drei assets must remain valid
    // while other routes/components may still reference them.
    return undefined;
  }, [path]);

  return result;
}
