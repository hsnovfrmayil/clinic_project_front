"use client";

import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/lib/api/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "./Button";
import { Minus, Plus } from "lucide-react";
import clsx from "clsx";
import { asId, toNumber } from "@/lib/money";

export default function ProductActions({
  product,
  variant,
  onVariantChange,
}: {
  product: Product;
  variant: ProductVariant | null;
  onVariantChange?: (variant: ProductVariant) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();

  const groups = useMemo(() => {
    const map = new Map<string, { name: string; values: { id: string; value: string }[] }>();
    for (const v of product.variants ?? []) {
      for (const av of v.attributeValues ?? []) {
        const attrId = asId(av.attribute_id ?? av.attribute?.id ?? av.id);
        const name = av.attribute?.name ?? "Вариант";
        const current = map.get(attrId) ?? { name, values: [] };
        if (!current.values.some((x) => x.id === asId(av.id))) {
          current.values.push({ id: asId(av.id), value: av.value });
        }
        map.set(attrId, current);
      }
    }
    return [...map.entries()].map(([id, group]) => ({ id, ...group }));
  }, [product.variants]);

  const selectedIds = new Set(
    (variant?.attributeValues ?? []).map((av) => asId(av.id))
  );

  const pickValue = (attributeId: string, valueId: string) => {
    const next = product.variants.find((v) => {
      const ids = new Set((v.attributeValues ?? []).map((av) => asId(av.id)));
      const required = [...selectedIds];
      const attrValueIds = new Set(
        (product.variants ?? [])
          .flatMap((x) => x.attributeValues ?? [])
          .filter((av) => asId(av.attribute_id ?? av.attribute?.id ?? "") === attributeId)
          .map((av) => asId(av.id))
      );
      const withoutAttr = required.filter((id) => !attrValueIds.has(id));
      return [...withoutAttr, valueId].every((id) => ids.has(id));
    });
    if (next) onVariantChange?.(next);
  };

  const inStock = toNumber(variant?.stock) > 0;

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-silver-dim">
            {group.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => {
              const active = selectedIds.has(value.id);
              return (
                <button
                  key={value.id}
                  type="button"
                  onClick={() => pickValue(group.id, value.id)}
                  className={clsx(
                    "rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.08em] transition-colors",
                    active
                      ? "border-ion bg-ion/10 text-ion"
                      : "border-line text-silver hover:border-ion hover:text-ion"
                  )}
                >
                  {value.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border border-line px-3 py-2.5">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-silver hover:text-ion"
            aria-label="Уменьшить количество"
          >
            <Minus size={14} />
          </button>
          <span className="w-5 text-center text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="text-silver hover:text-ion"
            aria-label="Увеличить количество"
          >
            <Plus size={14} />
          </button>
        </div>
        <Button
          disabled={!variant || !inStock}
          onClick={() => variant && add(product, variant, quantity)}
          className="flex-1 sm:flex-none"
        >
          {inStock ? "Добавить в корзину" : "Нет в наличии"}
        </Button>
      </div>
    </div>
  );
}
