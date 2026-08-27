"use client";

import { useState } from "react";
import PriceTag from "@/components/PriceTag";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";
import ProductMedia from "@/components/ProductMedia";
import { Truck, ShieldCheck } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/api/types";
import {
  defaultVariant,
  variantLabel,
  variantMrp,
  variantPrice,
} from "@/lib/money";
import { productImage, variantImage } from "@/lib/media";

export default function ProductView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [variant, setVariant] = useState<ProductVariant | null>(
    defaultVariant(product)
  );
  const price = variantPrice(variant);
  const mrp = variantMrp(variant);
  const image = variantImage(variant) ?? productImage(product);
  const category = product.categories?.[0]?.name;
  const brand = product.brands?.[0]?.name;

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
        <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-3xl border border-line bg-panel">
          <ProductMedia
            src={image}
            alt={product.name}
            className="h-full w-full p-10"
            bottleClassName="h-72"
          />
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-[0.16em] text-ion">
            {[brand, category, variantLabel(variant)].filter(Boolean).join(" · ")}
          </span>
          <h1 className="mt-2 text-3xl font-medium sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-6">
            <PriceTag
              price={price}
              oldPrice={mrp > price ? mrp : undefined}
              size="lg"
            />
          </div>

          {product.description && (
            <p className="mt-6 max-w-lg leading-relaxed text-silver">
              {product.description}
            </p>
          )}

          <div className="mt-8">
            <ProductActions
              product={product}
              variant={variant}
              onVariantChange={setVariant}
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-sm text-silver">
            <div className="flex items-center gap-2.5">
              <Truck size={15} className="text-ion" />
              Доставка по Москве 1–2 дня, по России — 3–5 дней
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={15} className="text-ion" />
              Разработано и протестировано врачами клиники EONAGE
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 text-2xl font-medium">С этим продуктом покупают</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={String(p.id)} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
