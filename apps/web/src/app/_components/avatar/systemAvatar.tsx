import React, { useRef } from "react";
import { type Group, Vector3, type Euler } from "three";
import { useAnimations } from "@react-three/drei";
import { useAvatarLoader } from "./useAvatarLoader";

const SystemAvatar: React.FC = () => {
  const { nodes, materials, animations } = useAvatarLoader("default");
  const avatarRef = useRef<Group>(null);
  const { actions } = useAnimations(animations, avatarRef);

  // Assuming the default action is 'idle'
  React.useEffect(() => {
    if (actions.idle) {
      actions.idle.play();
    }
  }, [actions]);

  return (
    <group
      ref={avatarRef}
      position={[0, -1, 0] as unknown as Vector3}
      rotation={[0, 0, 0] as unknown as Euler}
      scale={1}
    >
      <primitive object={nodes.mixamorigHips} />
      <skinnedMesh
        castShadow
        receiveShadow
        geometry={nodes.Ch46.geometry}
        material={materials.Ch46_body}
        skeleton={nodes.Ch46.skeleton}
      />
    </group>
  );
};

export default SystemAvatar;
