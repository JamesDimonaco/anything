import {
  type MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAnimations, SoftShadows, CameraControls, Circle } from "@react-three/drei";
import { type Group, Vector3, type Euler, type AnimationAction, LoopPingPong, LoopRepeat } from "three";
import { useAvatarLoader } from "./useAvatarLoader";
import { keyDownHandler, keyUpHandler } from "./keyHandler";
import { updateAvatarPosition } from "./actionVectors";

const PlayerAvatar = () => {
  const { nodes, materials, animations } = useAvatarLoader("default");
  const playerRef = useRef<Group>(null);
  const { actions } = useAnimations(animations, playerRef);
  const [currentAction, setCurrentAction] = useState<string>("idle");
  // Ref to store the current active animation action
  const currentActionRef = useRef<AnimationAction | null>(null);

  const positionRef = useRef([0, -1, 0]) as unknown as MutableRefObject<
    [number, number, number]
  >;
  const rotationRef = useRef([0, 0, 0]) as unknown as MutableRefObject<
    [number, number, number]
  >;

  const handleKeyDown = useCallback((event: globalThis.KeyboardEvent) => {
    keyDownHandler({ event, setCurrentAction });
  }, []);

  const handleKeyUp = useCallback((event: globalThis.KeyboardEvent) => {
    keyUpHandler({ event, setCurrentAction });
  }, []);
  let lastFrameTime = performance.now(); // Track the time of the last frame

  useFrame(() => {
    const currentTime = performance.now();
    const frameDuration = (currentTime - lastFrameTime) / 1000; // Duration of the frame in seconds
    lastFrameTime = currentTime; // Update the last frame time
    const avatarPosition = new Vector3();
    playerRef.current?.getWorldPosition(avatarPosition);
    if(actions[currentAction]) {
    const elapsed = actions[currentAction]!.time / actions[currentAction]!.getClip().duration
    updateAvatarPosition(
      elapsed,
      currentAction,
      playerRef,
      frameDuration,
    );
    }
  });

  useEffect(() => {
    const previousAction = currentActionRef.current;
    const newAction = actions[currentAction];

    if (previousAction && previousAction !== newAction) {
      // Fade out the previous action
      previousAction.fadeOut(0.5); // Adjust the fade duration as needed
    }

    if (newAction) {
      newAction.timeScale = 0.45;
      // Fade in the new action
      if (newAction === actions.running) {
        // clip to to only 0.5 seconds
        newAction.clampWhenFinished = true;
        newAction.stopFading();
        // set it so it loops in reverse afte r it's done
        newAction.loop = LoopRepeat;
        // slow mo
        newAction.timeScale = 1
        // no fade
        newAction.fadeIn(0);
      }
      newAction.reset().play(); // Adjust the fade duration as needed
      currentActionRef.current = newAction;
    }
  }, [actions, currentAction]);

  useEffect(() => {
    if (actions.idle) {
      actions.idle.play();
    }
  }, [actions]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <group
      ref={playerRef}
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
      {/* a simple red circle using positionRef */}
      <Circle
        args={[0.5, 32]}
        position={positionRef.current as unknown as Vector3}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
};

interface DefaultAvatarProps {
  children?: React.ReactNode;
}

export function Avatars() {
  return (
    <Canvas
      shadows
      gl={{ antialias: false }}
      camera={{ position: [10, 13, 25], fov: 50 }}
    >
      <CameraControls dragToOffset />
      <directionalLight
        intensity={2}
        position={[-5, 5, 5]}
        castShadow
        shadow-mapSize={2048}
        shadow-bias={-0.0001}
      />
      <PlayerAvatar />
      <SoftShadows size={40} samples={16} />
    </Canvas>
  );
}

const DashboardAvatars: React.FC<DefaultAvatarProps> = ({ children }) => {
  return (
    <div>
      {/* Adjust for header height */}
      {children}
      <div className="h-screen">
        <Avatars />
      </div>
    </div>
  );
};

export default DashboardAvatars;
