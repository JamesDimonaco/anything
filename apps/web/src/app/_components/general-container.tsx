'use client';

import { type CSSProperties, type FC, useRef } from "react";

const Container: FC<{ className?: string, children: React.ReactNode, style?: CSSProperties; }> = ({ className, children, style }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

const handleMouseMove = (e: React.MouseEvent) => {
  if (containerRef.current) {
    let x = e.clientX - containerRef.current.offsetLeft;
    let y = e.clientY - containerRef.current.offsetTop;

    // Calculate middle of the container
    const middleX = containerRef.current.offsetWidth / 2;
    const middleY = containerRef.current.offsetHeight / 2;

    // Default to middle if x and y are off the screen
    x = x === 0 ? middleX : x;
    y = y === 0 ? middleY : y;

    containerRef.current.style.setProperty("--x", `${x}px`);
    containerRef.current.style.setProperty("--y", `${y}px`);
  }
};


  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`graphic-container w-screen h-screen overflow-hidden mx-auto ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Container;
