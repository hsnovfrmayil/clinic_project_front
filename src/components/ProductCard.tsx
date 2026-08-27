"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Product } from "@/lib/api/types";
import ProductMedia from "./ProductMedia";
import PriceTag from "./PriceTag";
import { useCart } from "@/lib/cart-context";
import { Plus } from "lucide-react";
import {
  defaultVariant,
  productHref,
  variantLabel,
  variantMrp,
  variantPrice,
} from "@/lib/money";
import { productImage } from "@/lib/media";

export default function ProductCard({
  product,
  onNavigate,
}: {
  product: Product;
  onNavigate?: () => void;
}) {
  const { add } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const variant = defaultVariant(product);
  const price = variantPrice(variant);
  const mrp = variantMrp(variant);
  const brand = product.brands?.[0]?.name;
  const category = product.categories?.[0]?.name;
  const href = productHref(product);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };

  const handleLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg)";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-[transform,border-color] duration-200 ease-out will-change-transform hover:border-ion/40"
    >
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.07), transparent 60%)",
        }}
      />

      <Link
        href={href}
        onClick={onNavigate}
        className="relative flex h-64 items-center justify-center overflow-hidden bg-panel-2"
      >
        <ProductMedia
          src={productImage(product)}
          alt={product.name}
          className="h-full w-full p-6"
          bottleClassName="h-48 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="text-[11px] uppercase tracking-[0.14em] text-silver-dim">
          {[brand, category, variantLabel(variant)].filter(Boolean).join(" · ")}
        </div>
        <Link href={href} onClick={onNavigate}>
          <h3 className="font-medium leading-snug transition-colors hover:text-ion">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="line-clamp-2 text-sm text-silver">{product.description}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <PriceTag
            price={price}
            oldPrice={mrp > price ? mrp : undefined}
            size="sm"
          />
          <button
            onClick={() => add(product, variant)}
            aria-label={`Добавить ${product.name} в корзину`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-ion hover:bg-ion hover:text-ink"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
