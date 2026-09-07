"use client";

import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/lib/api/types";
import {
  defaultAttributeSelection,
  isOptionAvailable,
  productAttributeGroups,
  resolveSelectionAfterPick,
  selectionLabel,
  selectionValueIds,
  variantStockOk,
} from "@/lib/attributes";
import { useCart } from "@/lib/cart-context";
import { Button } from "./Button";
import { Minus, Plus } from "lucide-react";
import clsx from "clsx";
import { asId } from "@/lib/money";

export default function ProductActions({
  product,
  variant,
  onVariantChange,
  onSelectionChange,
}: {
  product: Product;
  variant: ProductVariant | null;
  onVariantChange?: (variant: ProductVariant) => void;
  onSelectionChange?: (label: string, attributeValueIds: number[]) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();

  const groups = useMemo(
    () => productAttributeGroups(product),
    [product]
  );

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    defaultAttributeSelection(variant)
  );

  const applySelection = (
    nextSelected: Record<string, string>,
    nextVariant: ProductVariant | null
  ) => {
    setSelected(nextSelected);
    if (nextVariant) onVariantChange?.(nextVariant);
    onSelectionChange?.(
      selectionLabel(nextSelected, groups),
      selectionValueIds(nextSelected)
    );
  };

  const pickValue = (attributeId: string, valueId: string) => {
    const { selected: nextSelected, variant: nextVariant } =
      resolveSelectionAfterPick(product, selected, attributeId, valueId);
    applySelection(nextSelected, nextVariant);
  };

  const inStock = variantStockOk(variant);
  const attributeValueIds = selectionValueIds(selected);
  const label = selectionLabel(selected, groups);

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => {
        const groupId = asId(group.id);
        return (
          <div key={groupId}>
            <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-silver-dim">
              {group.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const valueId = asId(value.id);
                const active = selected[groupId] === valueId;
                const available = isOptionAvailable(
                  product,
                  groupId,
                  valueId,
                  selected
                );
                return (
                  <button
                    key={valueId}
                    type="button"
                    disabled={!available}
                    onClick={() => pickValue(groupId, valueId)}
                    className={clsx(
                      "rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.08em] transition-colors",
                      active
                        ? "border-ion bg-ion/10 text-ion"
                        : "border-line text-silver hover:border-ion hover:text-ion",
                      !available && "cursor-not-allowed opacity-40"
                    )}
                  >
                    {value.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

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
          onClick={() =>
            variant &&
            add(product, variant, quantity, attributeValueIds, label)
          }
          className="flex-1 sm:flex-none"
        >
          {inStock ? "Добавить в корзину" : "Нет в наличии"}
        </Button>
      </div>
    </div>
  );
}
