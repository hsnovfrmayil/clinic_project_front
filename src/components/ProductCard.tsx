"use client";

import { useRef } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import ProductBottle from "./ProductBottle";
import Badge from "./Badge";
import PriceTag from "./PriceTag";
import { useCart } from "@/lib/cart-context";
import { Plus } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

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
      cardRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
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
        href={`/product/${product.slug}`}
        className="relative flex h-64 items-center justify-center bg-panel-2 overflow-hidden"
      >
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {product.bestseller && <Badge tone="gold">Бестселлер</Badge>}
          {product.isNew && <Badge tone="ion">New</Badge>}
        </div>
        <ProductBottle
          variant={product.bottle}
          tint={product.tint}
          className="h-48 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="text-[11px] uppercase tracking-[0.14em] text-silver-dim">
          {product.category} · {product.volume}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium leading-snug hover:text-ion transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-silver line-clamp-2">{product.tagline}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <PriceTag product={product} size="sm" />
          <button
            onClick={() => add(product)}
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
