import { Product } from "@/lib/types";
import clsx from "clsx";

export default function PriceTag({
  product,
  size = "md",
  className,
}: {
  product: Product;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const discount = product.oldPrice
    ? Math.round(100 - (product.price / product.oldPrice) * 100)
    : 0;

  const priceSize = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  }[size];

  return (
    <div className={clsx("flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
      <span className={clsx("font-semibold", priceSize)}>${product.price}</span>
      {product.oldPrice && (
        <>
          <span className="text-silver-dim line-through text-sm">
            ${product.oldPrice}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ion">
            −{discount}%
          </span>
        </>
      )}
      <span className="text-[11px] text-gold/90 tracking-wide">
        +{product.bonusPoints} бонусов
      </span>
    </div>
  );
}
