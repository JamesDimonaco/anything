'use client';

import { type CSSProperties, type FC, useRef } from "react";

const Container: FC<{ className?: string, children: React.ReactNode, style?: CSSProperties; }> = ({ className, children, style }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const x = e.clientX - containerRef.current.offsetLeft;
      const y = e.clientY - containerRef.current.offsetTop;
      
      containerRef.current.style.setProperty("--x", `${x}px`);
      containerRef.current.style.setProperty("--y", `${y}px`);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`container w-screen h-screen overflow-hidden mx-auto ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Container;
