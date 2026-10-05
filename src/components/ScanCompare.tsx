"use client";

import { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

export default function ScanCompare() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-3xl border border-line bg-panel-2 sm:aspect-[16/9]"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && updateFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img
        src="/compare/before.jpg"
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain"
      />
      <span className="absolute top-4 right-4 rounded-full border border-white/30 bg-ink/50 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white">
        До
      </span>

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src="/compare/after.jpg"
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <span className="absolute top-4 left-4 rounded-full border border-white/30 bg-ink/50 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white">
          После
        </span>
      </div>

      <div
        className="absolute top-0 bottom-0 z-10 w-px bg-white/80"
        style={{ left: `${pos}%` }}
      >
        <button
          type="button"
          aria-label="Перетащите, чтобы сравнить до и после"
          className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-ink/80 text-white shadow-[0_0_24px_rgba(0,0,0,0.35)]"
        >
          <MoveHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
