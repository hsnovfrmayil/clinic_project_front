import clsx from "clsx";

export default function DiagonalMarquee({
  items,
  tone = "light",
  className,
}: {
  items: string[];
  tone?: "light" | "ion";
  className?: string;
}) {
  const content = [...items, ...items];

  return (
    <div
      className={clsx(
        "relative z-10 -rotate-1 border-y",
        tone === "light"
          ? "bg-foreground text-background border-foreground"
          : "bg-ion text-ink border-ion",
        className
      )}
    >
      <div className="overflow-hidden py-3">
        <div className="flex w-max animate-[marquee_24s_linear_infinite] gap-10">
          {content.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-10 whitespace-nowrap text-sm font-bold uppercase tracking-[0.14em]"
            >
              {item}
              <span aria-hidden>◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
