import { KeyboardEvent, useEffect, useMemo, useRef } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, SoftShadows } from "@react-three/drei";
import { EffectComposer, TiltShift2 } from "@react-three/postprocessing";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationAction, LoopOnce, SkinnedMesh } from "three";
import { useSession } from "next-auth/react";
import { BufferGeometry } from 'three';

interface CustomGLTF extends GLTF {
  nodes: {
    mixamorigHips: THREE.Object3D;
    Ch03: SkinnedMesh;
    // Add other nodes here as per your model's structure
  };
  materials: {
    Ch03_Body: THREE.Material;
    // Define other materials as needed
  };
  // Include other properties if needed
}

function Model() {
  const { nodes, materials, animations } = useGLTF("/jump.glb") as CustomGLTF
  const { ref, actions } = useAnimations(animations);

  useEffect(() => {
    console.log(actions)

    if(actions.jump) {
    actions.jump!.reset().play();
    actions.jump!.paused = false;
    extend({ BufferGeometry });
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.code === "Space") {
        actions.jump!.paused = false;
        actions.jump!.clampWhenFinished = true;
        actions.jump!.loop = LoopOnce;
      }
    };

    window.addEventListener("keydown", (event) => handleKeyDown(event));
    return () => {
      window.removeEventListener("keydown", (event) => handleKeyDown(event));
    };
    }
  }, [actions]);

  return (
    <group position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
      <primitive object={nodes.mixamorigHips} />
      <skinnedMesh
        castShadow
        receiveShadow
        geometry={nodes.Ch03.geometry}
        material={materials.Ch03_Body}
        skeleton={nodes.Ch03.skeleton}
      />
    </group>
  );
}

export const App = () => (
  <Canvas shadows gl={{ antialias: false }} camera={{ position: [1, 0.5, 2.5], fov: 50 }}>
    <ambientLight intensity={0.5} />
    <directionalLight
      intensity={2}
      position={[-5, 5, 5]}
      castShadow
      shadow-mapSize={2048}
      shadow-bias={-0.0001}
    />
    <Model />
    <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -1.01, 0]} receiveShadow>
      <bufferGeometry />
      <shadowMaterial transparent opacity={0.75} />
    </mesh>
    <SoftShadows size={40} samples={16} />
    <EffectComposer disableNormalPass multisampling={4}>
      <TiltShift2 blur={1} />
    </EffectComposer>
  </Canvas>
);

interface DefaultAvatarProps {
  children?: React.ReactNode;
}

const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ children }) => {
  const user = useSession().data?.user;

  return (
    <div> {/* Set the container size */}
      <div className="h-screen"> {/* Adjust for header height */}
        <App />
      </div>
      {children}
    </div>
  );
};


export default DefaultAvatar;
