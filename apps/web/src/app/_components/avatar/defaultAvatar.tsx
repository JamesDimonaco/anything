import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  useAnimations,
  SoftShadows,
  CameraControls,
  shaderMaterial,
} from "@react-three/drei";
import {
  type Group,
  type Vector3,
  type Euler,
  AnimationAction,
  AnimationMixer,
  ShaderMaterial,
} from "three";
import { useAvatarLoader } from "./useAvatarLoader";
import { keyDownHandler } from "./keyHandler";
import useFollowCamera from "./useFollowCamera";
import { AvatarAnimationQueueManager } from "./AvatarAnimationQueueManager";



const Model = () => {
  const avatarRef = useRef<Group>(null);
  const { nodes, materials, animations } = useAvatarLoader();
  const { actions } = useAnimations(
    animations,
    avatarRef,
  );
  const [ avatarAnimationManager ] = useState(new AvatarAnimationQueueManager(new AnimationMixer(avatarRef.current!)));
  const [charIdle, setCharIdle] = useState(true);
  const positionRef = useRef([0, -1, 0]);
  const rotationRef = useRef([0, 0, 0]);
  const [, setRenderTrigger] = useState({});
  const moving = useRef(false);
  const moveSpeed = 1;
  const rotateSpeed = Math.PI / 4; // Adjust as needed
  const handleKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      keyDownHandler({event, avatarRef, avatarAnimationManager, actions, positionRef, rotationRef, charIdle, setCharIdle, setRenderTrigger, moveSpeed, rotateSpeed, moving});
    },
    [actions, positionRef, rotationRef, charIdle, rotateSpeed, avatarAnimationManager],
  );

    

  useEffect(() => {
    if (actions.idle) {
      // Replace 'idle' with the name of your default pose or animation
      actions.idle.play();
    }
  }, [actions]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <group
      ref={avatarRef}
      position={positionRef.current as unknown as Vector3}
      rotation={rotationRef.current as unknown as Euler}
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
}

export function App() {
  return(
  <Canvas
    shadows
    gl={{ antialias: false }}
    camera={{ position: [1, 0.5, 2.5], fov: 50 }}
  >
    <CameraControls />
    <directionalLight
      intensity={2}
      position={[-5, 5, 5]}
      castShadow
      shadow-mapSize={2048}
      shadow-bias={-0.0001}
    />
    <Model />
    <SoftShadows size={40} samples={16} />

  </Canvas>
  );
}

interface DefaultAvatarProps {
  children?: React.ReactNode;
}

const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ children }) => {
  return (
    <div>
      {" "}
      {/* Set the container size */}
      <div className="h-screen">
        {" "}
        {/* Adjust for header height */}
        <App />
      </div>
      {children}
    </div>
  );
};

export default DefaultAvatar;
