import clsx from "clsx";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={clsx("shrink-0", className)}
      aria-hidden
    >
      <circle
        cx="32"
        cy="32"
        r="26"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeDasharray="132 30"
        strokeDashoffset="-10"
      />
      <circle cx="25" cy="32" r="13" fill="currentColor" />
    </svg>
  );
}

export default function Logo({
  className,
  markOnly = false,
}: {
  className?: string;
  markOnly?: boolean;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5 select-none", className)}>
      <LogoMark className="h-[22px] w-[22px]" />
      {!markOnly && (
        <span className="font-logo text-[16px] font-semibold tracking-[0.22em] uppercase">
          Eonage
        </span>
      )}
    </span>
  );
}
