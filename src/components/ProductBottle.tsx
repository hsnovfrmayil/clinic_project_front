import { BottleVariant } from "@/lib/types";
import clsx from "clsx";

const TINTS = {
  ion: { glow: "#6fb8ff", body: "#dfe6ec", cap: "#cfd6dc" },
  silver: { glow: "#c9cdd3", body: "#e6e7e9", cap: "#b9bcc1" },
  gold: { glow: "#cbb88a", body: "#e9e2d3", cap: "#cbb88a" },
} as const;

export default function ProductBottle({
  variant,
  tint,
  className,
}: {
  variant: BottleVariant;
  tint: keyof typeof TINTS;
  className?: string;
}) {
  const c = TINTS[tint];

  return (
    <div className={clsx("relative flex items-center justify-center", className)}>
      <div
        className="absolute h-2/3 w-2/3 rounded-full blur-3xl opacity-30"
        style={{ background: c.glow }}
        aria-hidden
      />
      <svg
        viewBox="0 0 120 180"
        className="relative h-full w-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
        aria-hidden
      >
        <defs>
          <linearGradient id={`body-${tint}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c.body} stopOpacity="0.35" />
            <stop offset="45%" stopColor={c.body} stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor={c.body} stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {variant === "dropper" && (
          <g>
            <rect x="35" y="40" width="50" height="115" rx="10" fill={`url(#body-${tint})`} stroke={c.cap} strokeWidth="1" />
            <rect x="42" y="10" width="36" height="34" rx="6" fill={c.cap} />
            <rect x="52" y="0" width="16" height="14" rx="3" fill={c.cap} />
            <rect x="45" y="70" width="30" height="18" rx="2" fill="#0a0a0c" opacity="0.25" />
          </g>
        )}

        {variant === "pump" && (
          <g>
            <rect x="30" y="55" width="60" height="100" rx="12" fill={`url(#body-${tint})`} stroke={c.cap} strokeWidth="1" />
            <rect x="42" y="30" width="36" height="28" rx="6" fill={c.cap} />
            <rect x="54" y="8" width="12" height="26" rx="4" fill={c.cap} />
            <circle cx="60" cy="6" r="6" fill={c.cap} />
          </g>
        )}

        {variant === "jar" && (
          <g>
            <rect x="25" y="60" width="70" height="90" rx="14" fill={`url(#body-${tint})`} stroke={c.cap} strokeWidth="1" />
            <rect x="22" y="42" width="76" height="22" rx="8" fill={c.cap} />
          </g>
        )}

        {variant === "tube" && (
          <g>
            <path
              d="M40 20 h40 l6 12 v110 a6 6 0 0 1 -6 6 h-40 a6 6 0 0 1 -6 -6 v-110 z"
              fill={`url(#body-${tint})`}
              stroke={c.cap}
              strokeWidth="1"
            />
            <rect x="44" y="6" width="32" height="16" rx="4" fill={c.cap} />
          </g>
        )}

        {variant === "device" && (
          <g>
            <rect x="20" y="30" width="80" height="95" rx="24" fill={`url(#body-${tint})`} stroke={c.cap} strokeWidth="1.2" />
            <circle cx="60" cy="77" r="26" fill="none" stroke={c.cap} strokeWidth="1.4" />
            <circle cx="60" cy="77" r="8" fill={c.cap} />
            <rect x="46" y="14" width="28" height="18" rx="6" fill={c.cap} />
          </g>
        )}
      </svg>
    </div>
  );
}
