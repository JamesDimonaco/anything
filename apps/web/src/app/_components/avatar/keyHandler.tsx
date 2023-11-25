import type { RefObject, MutableRefObject, Dispatch, SetStateAction } from "react";
import { LoopOnce, type Group, type Object3DEventMap, LoopRepeat } from "three";
import { calculateResultantAction, getActionType } from "./actionVectors";

interface IAvatarKeyDownHandler {
  event: KeyboardEvent;
  setCurrentAction: Dispatch<SetStateAction<string>>
}

export const pressedKeys = new Map<string, KeyPressInfo>();
interface KeyPressInfo {
  pressedAt: number;
  duration?: number;
}


export const keyDownHandler = ({
  event,
  setCurrentAction
}: IAvatarKeyDownHandler) => {
  if (!pressedKeys.has(event.code)) {
    pressedKeys.set(event.code, { pressedAt: performance.now() });
    const actionToPlay = calculateResultantAction();
    setCurrentAction(actionToPlay);
  }
};

interface IKeyUpHandler {
  event: KeyboardEvent;
  setCurrentAction: Dispatch<SetStateAction<string>>
}

export const keyUpHandler = ({
  event,
  setCurrentAction,         
}: IKeyUpHandler) => {
  pressedKeys.delete(event.code);

  const newAction = calculateResultantAction(); // Recalculate the action after key release
  setCurrentAction(newAction); // Update the current action
};