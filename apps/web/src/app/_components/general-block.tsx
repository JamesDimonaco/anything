'use client';

import { type FC, useRef } from "react";

const Block: FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => {
  const blockRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (blockRef.current) {
      const x = e.clientX - blockRef.current.offsetLeft;
      const y = e.clientY - blockRef.current.offsetTop;
      
      blockRef.current.style.setProperty("--x", `${x}px`);
      blockRef.current.style.setProperty("--y", `${y}px`);
    }
  };

  return (
    <div
      ref={blockRef}
      onMouseMove={handleMouseMove}
      className={`block border-blue-900 border-opacity-60 w-full h-max border my-2 px-4 py-2 ${className}`}
    >
      {children}
    </div>
  );
};

export default Block;
