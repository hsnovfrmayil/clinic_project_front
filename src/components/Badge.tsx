import clsx from "clsx";

export default function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "ion" | "gold";
  className?: string;
}) {
  const tones = {
    default: "border-line text-silver",
    ion: "border-ion/40 text-ion bg-ion/10",
    gold: "border-gold/40 text-gold bg-gold/10",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
