import clsx from "clsx";
import { formatMoney } from "@/lib/money";

export default function PriceTag({
  price,
  oldPrice,
  size = "md",
  className,
}: {
  price: number;
  oldPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const discount =
    oldPrice && oldPrice > price
      ? Math.round(100 - (price / oldPrice) * 100)
      : 0;

  const priceSize = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  }[size];

  return (
    <div className={clsx("flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
      <span className={clsx("font-semibold", priceSize)}>{formatMoney(price)}</span>
      {discount > 0 && oldPrice ? (
        <>
          <span className="text-sm text-silver-dim line-through">
            {formatMoney(oldPrice)}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ion">
            −{discount}%
          </span>
        </>
      ) : null}
    </div>
  );
}
