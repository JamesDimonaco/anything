// useFollowCamera.ts
import { useRef, useEffect, RefObject } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Group, Object3DEventMap, Vector3 } from 'three';

const useFollowCamera = (targetRef: RefObject<Group<Object3DEventMap>>) => {
  const { camera } = useThree();
  const cameraOffset = useRef(new Vector3(0, 5, -10)); // Adjust as needed

  useFrame(() => {
    if (targetRef.current) {
      const desiredPosition = targetRef.current.position.clone().add(cameraOffset.current);
      camera.position.lerp(desiredPosition, 0.1); // Smooth transition
      camera.lookAt(targetRef.current.position);
    }
  });

  // Optional: Adjust this effect as needed for your use case
  useEffect(() => {
    return () => {
      // Reset or adjust camera settings when unmounting
    };
  }, [camera]);

  return camera;
};

export default useFollowCamera;
