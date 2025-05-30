"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, container.offsetHeight);
    gradient.addColorStop(0, "rgba(45, 212, 191, 0.15)"); // Primary color with low opacity
    gradient.addColorStop(1, "rgba(45, 212, 191, 0)");

    const handleResize = () => {
      if (!container || !canvas || !ctx) return;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      const beams = 8;
      const beamWidth = canvas.width / beams;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < beams; i++) {
        const x = i * beamWidth;
        ctx.fillStyle = gradient;
        ctx.fillRect(x, 0, beamWidth / 2, canvas.height);
      }
    };

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.zIndex = "0";
    container.appendChild(canvas);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black,transparent)]",
        className
      )}
    />
  );
};
