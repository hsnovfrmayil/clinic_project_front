"use client";

import { useEffect, useRef } from "react";

export default function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      dotRef.current?.style.setProperty(
        "transform",
        `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      );
      glowRef.current?.style.setProperty(
        "transform",
        `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      );
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "a, button, input, textarea, [role='button']"
      );
      targetScale = el ? 2.1 : 1;
    };

    const loop = () => {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      scale += (targetScale - scale) * 0.18;
      ringRef.current?.style.setProperty(
        "transform",
        `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%) scale(${scale})`
      );
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hidden md:block">
      <div
        ref={glowRef}
        className="pointer-events-none fixed left-0 top-0 z-0 h-[480px] w-[480px] rounded-full bg-ion/10 blur-[110px] dark:mix-blend-screen"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-ion"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-ion/60"
      />
    </div>
  );
}
