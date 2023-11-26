import {
  AnimationAction,
  Euler,
  Group,
  LoopOnce,
  LoopRepeat,
  Object3DEventMap,
  Vector3,
} from "three";
import { pressedKeys } from "./keyHandler";
import { RefObject } from "react";

const decayFactor = 0.95; // Adjust this value for desired inertia effect
let previousAction = "idle";
const maxSpeed = 20; // Maximum movement speed
const acceleration = 20; // Acceleration rate

export const updateAvatarPosition = (
  elapsed: number,
  currentAction = calculateResultantAction(),
  avatarRef: RefObject<Group<Object3DEventMap>>,
  frameDuration: number,
) => {
  const rotateSpeed = 4.8 * Math.PI; // Adjust as needed
  let { positionDeltaVector, rotationDeltaVector } =
    translateActionToVectors(currentAction);
// Current speed of the avatar
      // Acceleration and Deceleration Logic

  const { position, rotation } = avatarRef.current!;
  // Calculate new position
  const newPosition = calculateNewPosition(
    positionDeltaVector,
    position,
    rotation,
    1,
    currentAction === "idle" ? 0 : elapsed*4,
    frameDuration,
  );

  const newRotation = calculateNewRotation(
    rotationDeltaVector,
    rotation,
    rotateSpeed,
    frameDuration,
  );
  // use the elapsed time as offset for the animation

   if (currentAction === "idle") {
    
    // Apply decay to movement and rotation vectors
    positionDeltaVector = positionDeltaVector.map(v => v * decayFactor) as [
      number,
      number,
      number
    ];
    rotationDeltaVector = rotationDeltaVector.map(v => v * decayFactor) as [
      number,
      number,
      number
    ];
   }

  // Apply the new position and rotation to the avatar
  avatarRef.current!.position.set(...newPosition);
  avatarRef.current!.rotation.set(...newRotation);
  previousAction = currentAction;
};

// Calculate new position function (example implementation)
export const calculateNewPosition = (
  movementVector: [number, number, number],
  currentPosition: Vector3,
  rotation: Euler,
  moveSpeed: number,
  offset: number,
  frameDuration: number,
): [number, number, number] => {
  // Assuming y-axis is up and rotation.y is the direction character faces
  const forwardX = Math.sin(rotation.y);
  const forwardZ = Math.cos(rotation.y);

  // Calculate movement in the direction character is facing
  const deltaMoveX = forwardX * (movementVector[0]);
  const deltaMoveZ = forwardZ * (movementVector[2]);

  // Combine forward/back and strafe movements
  return [
    currentPosition.x + (deltaMoveX) * moveSpeed * frameDuration,
    currentPosition.y, // Assuming no vertical movement for simplicity
    currentPosition.z + (deltaMoveZ) * moveSpeed * frameDuration,
  ];
};


export const calculateNewRotation = (
  rotationVector: [number, number, number],
  currentRotation: Euler,
  rotateSpeed: number,
  frameDuration: number,
): [number, number, number] => {
  return [
    currentRotation.x + rotationVector[0] * rotateSpeed * frameDuration,
    currentRotation.y + rotationVector[1] * rotateSpeed * frameDuration,
    currentRotation.z + rotationVector[2] * rotateSpeed * frameDuration,
  ];
};

export const translateActionToVectors = (
  action: string,
): {
  positionDeltaVector: [number, number, number];
  rotationDeltaVector: [number, number, number];
} => {
  let positionDeltaVector: [number, number, number] = [0, 0, 0];
  let rotationDeltaVector: [number, number, number] = [0, 0, 0];


  switch (action) {
    case "running":
      positionDeltaVector = [5, 0, 5];
      break;
    case "walk_back":
      positionDeltaVector = [-2, 0, -2];
      break;
    case "left_run":
      positionDeltaVector = [5, 0, 5];
      rotationDeltaVector = [0, 0.2, 0];
      break;
    case "right_run":
      positionDeltaVector = [5, 0, 5];
      rotationDeltaVector = [0, -0.2, 0];
      break;
    case "left_turn":
      rotationDeltaVector = [0, 0.2, 0];
      break;
    case "right_turn":
      rotationDeltaVector = [0, -0.2, 0];
      break;
    case "idle":
    return { positionDeltaVector: [0, 0, 0], rotationDeltaVector: [0, 0, 0] };
      break;
  }
  return { positionDeltaVector, rotationDeltaVector };
};

export const calculateResultantAction = (): string => {
  let resultantAction: string | null = null;
  if (pressedKeys.has("KeyW") && pressedKeys.has("KeyA")) {
    resultantAction = "left_run";
  } else if (pressedKeys.has("KeyW") && pressedKeys.has("KeyD")) {
    resultantAction = "right_run";
  } else if (pressedKeys.has("KeyW")) {
    resultantAction = "running";
  } else if (pressedKeys.has("KeyS")) {
    resultantAction = "walk_back";
  } else if (pressedKeys.has("KeyA")) {
    resultantAction = "left_turn";
  } else if (pressedKeys.has("KeyD")) {
    resultantAction = "right_turn";
  } else if (pressedKeys.has("Space")) {
    resultantAction = "jump";
  } else if (pressedKeys.has("ShiftLeft")) {
    resultantAction = "sprint";
  } else {
    resultantAction = "idle";
  }
  return resultantAction;
};

export const actionTypeMap: Record<
  string,
  typeof LoopOnce | typeof LoopRepeat
> = {
  jump: LoopOnce,
  running: LoopRepeat,
  // ... other actions
};

export const getActionType = (
  action: AnimationAction,
): typeof LoopOnce | typeof LoopRepeat => {
  // Determine the action type based on action name or other criteria
  // Return ActionType.OneTime or ActionType.Continuous
  // Example:
  return actionTypeMap[action.getClip().name] ?? LoopOnce;
};
