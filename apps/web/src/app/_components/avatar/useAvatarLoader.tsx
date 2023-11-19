import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import type { AnimationClip, SkinnedMesh } from 'three';
import { type GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export interface CharGLTF extends GLTF {
  nodes: {
    mixamorigHips: THREE.Object3D;
    Ch46: SkinnedMesh;
  };
  materials: {
    Ch46_body: THREE.Material;
  };
}

export const useAvatarLoader = () => {
  const { nodes, materials, animations: ogAnimations } = useGLTF("/gltf/char.gltf") as CharGLTF;
  const [animations, setAnimations] = useState(ogAnimations);
  useEffect(() => {
    const animationPaths = [
    '/gltf/walk_back_out/walk_back.gltf',  
    '/gltf/idle_out/idle.gltf', 
    '/gltf/ready_out/ready.gltf',
    '/gltf/left_turn_out/left_turn.gltf',
    '/gltf/right_turn_out/right_turn.gltf',
     '/gltf/running_out/running.gltf'];
    loadGLTFAnim(animationPaths).then(loadedAnimations => {
      setAnimations(prevAnimations => [...prevAnimations, ...loadedAnimations]);
    }).catch(error => console.error('Error loading animations:', error));
  }, []); 
  return { nodes, materials, animations };
}

async function loadGLTFAnim(paths: string[]): Promise<AnimationClip[]> {
  const loader = new GLTFLoader();
  const gltfs = await Promise.all(paths.map(path => {
    return new Promise((resolve, reject) => {
      loader.load(path, gltf => resolve(gltf.animations), undefined, reject);
    });
  }));
  return gltfs.flat() as AnimationClip[];
}