"use client";

import { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

const METRICS_BEFORE = [
  { label: "Увлажнённость", value: 42 },
  { label: "Эластичность", value: 38 },
  { label: "Ровный тон", value: 51 },
];

const METRICS_AFTER = [
  { label: "Увлажнённость", value: 87 },
  { label: "Эластичность", value: 91 },
  { label: "Ровный тон", value: 94 },
];

export default function ScanCompare() {
  const [pos, setPos] = useState(52);
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
      onPointerMove={(e) => dragging.current && updateFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* BEFORE layer */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(214,110,90,0.16), transparent 60%), #15130f",
        }}
      >
        <span className="w-fit rounded-full border border-line px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-silver">
          Скан · До
        </span>
        <div className="flex max-w-xs flex-col gap-2.5">
          {METRICS_BEFORE.map((m) => (
            <div key={m.label}>
              <div className="mb-1 flex justify-between text-[11px] text-silver-dim">
                <span>{m.label}</span>
                <span>{m.value}%</span>
              </div>
              <div className="h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#d66e5a]"
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AFTER layer, clipped by slider position */}
      <div
        className="scan-grid absolute inset-0 flex flex-col justify-between p-6 sm:p-8"
        style={{
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          background:
            "radial-gradient(circle at 70% 30%, rgba(111,184,255,0.18), transparent 60%), #0c1116",
        }}
      >
        <span className="ml-auto w-fit rounded-full border border-ion/50 bg-ion/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-ion">
          Скан · После
        </span>
        <div className="ml-auto flex max-w-xs flex-col gap-2.5">
          {METRICS_AFTER.map((m) => (
            <div key={m.label}>
              <div className="mb-1 flex justify-between text-[11px] text-silver">
                <span>{m.label}</span>
                <span className="text-ion">{m.value}%</span>
              </div>
              <div className="h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-ion"
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* divider handle */}
      <div
        className="absolute top-0 bottom-0 z-10 w-px bg-ion/70"
        style={{ left: `${pos}%` }}
      >
        <button
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          aria-label="Перетащите, чтобы сравнить до и после"
          className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ion bg-ink text-ion shadow-[0_0_24px_rgba(111,184,255,0.45)]"
        >
          <MoveHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
