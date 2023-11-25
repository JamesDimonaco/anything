import { useState, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { type AnimationClip, type SkinnedMesh } from "three";
import { type GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export interface CharGLTF extends GLTF {
  nodes: {
    mixamorigHips: THREE.Object3D;
    Ch46: SkinnedMesh;
  };
  materials: {
    Ch46_body: THREE.Material;
  };
}

type AvatarNames = "default" | "system" | "char1" | "char2" | "char3" | "char4";
 
export const useAvatarLoader = (avatarName: AvatarNames) => {
  const gltf = useGLTF(`/gltf/char.gltf`) as CharGLTF;
  const { nodes, materials, animations: ogAnimations, scene } = useMemo(() => gltf, [gltf]);
  // Clone the geometry to ensure unique instances for each avatar
  const clonedNodes = {
    ...nodes,
    Ch46: {
      ...nodes.Ch46,
      geometry: nodes.Ch46.geometry.clone(),
    },
  };

  const [animations, setAnimations] = useState(ogAnimations);

  useEffect(() => {
    const animationPaths = [
      "/gltf/left_run_out/left_run.gltf",
      "/gltf/right_run_out/right_run.gltf",
      "/gltf/walk_back_out/walk_back.gltf",
      "/gltf/idle_out/idle.gltf",
      "/gltf/ready_out/ready.gltf",
      "/gltf/left_turn_out/left_turn.gltf",
      "/gltf/right_turn_out/right_turn.gltf",
      "/gltf/running_out/running.gltf",
    ];
    loadGLTFAnim(animationPaths)
      .then((loadedAnimations) => {
        setAnimations((prevAnimations) => [
          ...prevAnimations,
          ...loadedAnimations,
        ]);
      })
      .catch((error) => console.error("Error loading animations:", error));
  }, [avatarName]);
  
  return { nodes: clonedNodes, materials, animations, scene };
};

async function loadGLTFAnim(paths: string[]): Promise<AnimationClip[]> {
  const loader = new GLTFLoader();
  const gltfs = await Promise.all(
    paths.map((path) => {
      return new Promise((resolve, reject) => {
        loader.load(
          path,
          (gltf) => resolve(gltf.animations),
          undefined,
          reject,
        );
      });
    }),
  );
  return gltfs.flat() as AnimationClip[];
}
