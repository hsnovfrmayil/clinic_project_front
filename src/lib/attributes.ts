import type {
  AttributeValue,
  Product,
  ProductVariant,
  UsedAttribute,
} from "./api/types";
import { asId, toNumber } from "./money";

/** Flatten selectable values listed on a variant (`attributes` or legacy `attributeValues`). */
export function variantOptionValues(variant?: ProductVariant | null): {
  attributeId: string;
  attributeName: string;
  id: string;
  value: string;
}[] {
  if (!variant) return [];

  if (variant.attributes?.length) {
    return variant.attributes.flatMap((attr) =>
      (attr.values ?? []).map((v) => ({
        attributeId: asId(attr.id),
        attributeName: attr.name,
        id: asId(v.id),
        value: v.value,
      }))
    );
  }

  return (variant.attributeValues ?? []).map((av: AttributeValue) => ({
    attributeId: asId(av.attribute_id ?? av.attribute?.id ?? ""),
    attributeName: av.attribute?.name ?? "Вариант",
    id: asId(av.id),
    value: av.value,
  }));
}

export function variantHasOption(
  variant: ProductVariant | null | undefined,
  valueId: string
) {
  return variantOptionValues(variant).some((v) => v.id === valueId);
}

/** Union of attribute groups across all variants (for PDP pickers). */
export function productAttributeGroups(product: Product): UsedAttribute[] {
  const map = new Map<string, UsedAttribute>();

  for (const variant of product.variants ?? []) {
    if (variant.attributes?.length) {
      for (const attr of variant.attributes) {
        const key = asId(attr.id);
        const current = map.get(key) ?? {
          id: attr.id,
          name: attr.name,
          values: [],
        };
        for (const value of attr.values ?? []) {
          if (!current.values.some((v) => asId(v.id) === asId(value.id))) {
            current.values.push(value);
          }
        }
        map.set(key, current);
      }
      continue;
    }

    for (const av of variant.attributeValues ?? []) {
      const key = asId(av.attribute_id ?? av.attribute?.id ?? "");
      if (!key) continue;
      const current = map.get(key) ?? {
        id: av.attribute_id ?? av.attribute?.id ?? av.id,
        name: av.attribute?.name ?? "Вариант",
        values: [],
      };
      if (!current.values.some((v) => asId(v.id) === asId(av.id))) {
        current.values.push({ id: av.id, value: av.value });
      }
      map.set(key, current);
    }
  }

  return [...map.values()];
}

/** Default: first value of each attribute group on the variant. */
export function defaultAttributeSelection(
  variant?: ProductVariant | null
): Record<string, string> {
  const selected: Record<string, string> = {};
  if (!variant) return selected;

  if (variant.attributes?.length) {
    for (const attr of variant.attributes) {
      const first = attr.values?.[0];
      if (first) selected[asId(attr.id)] = asId(first.id);
    }
    return selected;
  }

  for (const av of variant.attributeValues ?? []) {
    const attrId = asId(av.attribute_id ?? av.attribute?.id ?? "");
    if (attrId && !selected[attrId]) selected[attrId] = asId(av.id);
  }
  return selected;
}

export function selectionValueIds(
  selected: Record<string, string>
): number[] {
  return Object.values(selected)
    .map((id) => Number(id))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export function selectionLabel(
  selected: Record<string, string>,
  groups: UsedAttribute[]
) {
  return groups
    .map((g) => {
      const valueId = selected[asId(g.id)];
      return g.values.find((v) => asId(v.id) === valueId)?.value;
    })
    .filter(Boolean)
    .join(" · ");
}

/** Variant must include every selected value id in its option list. */
export function findVariantForSelection(
  product: Product,
  selected: Record<string, string>
): ProductVariant | null {
  const needed = Object.values(selected);
  if (!needed.length) return product.variants?.[0] ?? null;

  const match = (product.variants ?? []).find((variant) =>
    needed.every((valueId) => variantHasOption(variant, valueId))
  );
  return match ?? null;
}

export function resolveSelectionAfterPick(
  product: Product,
  prev: Record<string, string>,
  attributeId: string,
  valueId: string
): { selected: Record<string, string>; variant: ProductVariant | null } {
  const nextSelected = { ...prev, [attributeId]: valueId };
  const exact = findVariantForSelection(product, nextSelected);
  if (exact) return { selected: nextSelected, variant: exact };

  const carrier =
    (product.variants ?? []).find((v) => variantHasOption(v, valueId)) ?? null;
  if (!carrier) {
    return {
      selected: nextSelected,
      variant: product.variants?.[0] ?? null,
    };
  }

  const filled = defaultAttributeSelection(carrier);
  filled[attributeId] = valueId;
  for (const [attrId, valId] of Object.entries(prev)) {
    if (attrId === attributeId) continue;
    if (variantHasOption(carrier, valId)) filled[attrId] = valId;
  }
  return { selected: filled, variant: carrier };
}

export function defaultVariantAttributeIds(
  variant?: ProductVariant | null
): number[] {
  return selectionValueIds(defaultAttributeSelection(variant));
}

export function isOptionAvailable(
  product: Product,
  attributeId: string,
  valueId: string,
  selected: Record<string, string>
) {
  const trial = { ...selected, [attributeId]: valueId };
  if (findVariantForSelection(product, trial)) return true;
  return (product.variants ?? []).some((v) => variantHasOption(v, valueId));
}

export function variantStockOk(variant?: ProductVariant | null) {
  return toNumber(variant?.stock) > 0;
}
