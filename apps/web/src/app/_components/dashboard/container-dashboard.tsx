"use client";
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import DefaultAvatar from '../avatar/defaultAvatar';

interface DashboardContainerProps {
  children?: React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => {
  const user = useSession().data?.user;

  return (
    <div>
      <div className="rounded-lg bg-black bg-opacity-20 p-5 text-white backdrop-blur-md">
        {user?.name}
      </div>
      <DefaultAvatar />
      {children}
    </div>
  );
};

export default DashboardContainer;
