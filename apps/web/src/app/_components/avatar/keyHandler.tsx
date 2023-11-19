import type {
  RefObject,
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from "react";
import {
  AnimationAction,
  LoopOnce,
  LoopPingPong,
  type Group,
  type Object3DEventMap,
} from "three";
import { generateUUID } from "three/src/math/MathUtils";
import type { AvatarAnimationQueueManager } from "./AvatarAnimationQueueManager";

interface IAvatarKeyDownHandler {
  event: globalThis.KeyboardEvent;
  actions: Record<string, AnimationAction | null>;
  avatarRef: RefObject<Group<Object3DEventMap>>;
  positionRef: MutableRefObject<number[]>;
  rotationRef: MutableRefObject<number[]>;
  avatarAnimationManager: AvatarAnimationQueueManager;
  charIdle: boolean;
  setCharIdle: Dispatch<SetStateAction<boolean>>;
  setRenderTrigger: Dispatch<SetStateAction<object>>;
  moveSpeed: number;
  moving: MutableRefObject<boolean>;
  rotateSpeed: number;
}

export const keyDownHandler = ({
  event,
  actions,
  avatarAnimationManager,
  avatarRef,
  positionRef,
  rotationRef,
  rotateSpeed,
  moveSpeed,
  moving
}: IAvatarKeyDownHandler) => {
  //TODO: user configurable keybindings

  if (event.code === "Space") {
    if (!actions.jump) return;
    avatarAnimationManager.enqueue(actions.jump);
  }
  // Key r for idle - toggles between idle and ready
  if (event.code === "KeyR") {
    if (!actions.idle || !actions.ready) return;
    avatarAnimationManager.enqueue(actions.ready);
  }
  const runningKeys = ["KeyW", "KeyA", "KeyS", "KeyD"];

  if (runningKeys.includes(event.code) && !moving.current) {
    
    //! WASD - we're going in
    moving.current = true;
    let updateTimer = 0;
    const currentRotationY = rotationRef.current[1]!;
    // Move forward
    if (event.code === "KeyW") {
      if (!actions.running) return;
      avatarAnimationManager.enqueue(actions.running);
      // Assuming forward movement is along the negative Z-axis
      positionRef.current[0] += moveSpeed * Math.sin(currentRotationY);
      positionRef.current[2] += moveSpeed * Math.cos(currentRotationY);
      updateTimer += actions.running.getClip().duration;
    }
    // Move backward
    else if (event.code === "KeyS") {
      if (!actions.walk_back) return;
      avatarAnimationManager.enqueue(actions.walk_back);
      // Assuming backward movement is along the positive Z-axis
      positionRef.current[0] -= moveSpeed/2 * Math.sin(currentRotationY);
      positionRef.current[2] -= moveSpeed/2 * Math.cos(currentRotationY);
      updateTimer += actions.walk_back.getClip().duration;
    }
    // Rotate left
    else if (event.code === "KeyA") {
      console.log('A');
      console.log('actions', actions);
      
      rotationRef.current[1] += rotateSpeed;
      if (!actions.left_turn) return;
      avatarAnimationManager.enqueue(actions.left_turn);
      updateTimer += actions.left_turn.getClip().duration;
    }

    // Rotate right
    else if (event.code === "KeyD") {
      rotationRef.current[1] -= rotateSpeed;
      if (!actions.right_turn) return;
      avatarAnimationManager.enqueue(actions.right_turn);
      updateTimer += actions.right_turn.getClip().duration;
    }

    setTimeout(() => {
      if (avatarRef.current) {
        avatarRef.current.position.set(
          ...(positionRef.current as [number, number, number]),
        );
        avatarRef.current.rotation.set(
          ...(rotationRef.current as [number, number, number]),
        );
        moving.current = false;
      }
    }, updateTimer * 1000);
  }
};
