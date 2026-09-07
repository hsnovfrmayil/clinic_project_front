import type { Product, ProductVariant } from "./api/types";

export function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(value: number | string | null | undefined) {
  const n = toNumber(value);
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

/** Final sell price (API already applies discounts into `price`). */
export function variantPrice(variant?: ProductVariant | null) {
  if (!variant) return 0;
  const legacyDiscounted = toNumber(variant.discounted_price);
  if (legacyDiscounted > 0) return legacyDiscounted;
  return toNumber(variant.price);
}

/** Strike-through / MRP: prefer original_price, then mrp. */
export function variantMrp(variant?: ProductVariant | null) {
  if (!variant) return 0;
  const price = variantPrice(variant);
  const original = toNumber(variant.original_price);
  if (original > price) return original;
  const mrp = toNumber(variant.mrp);
  if (mrp > price) return mrp;
  return original || mrp;
}

export function variantDiscountPercent(variant?: ProductVariant | null) {
  if (!variant) return 0;
  const fromApi = toNumber(variant.discount_percentage);
  if (fromApi > 0) return fromApi;
  const price = variantPrice(variant);
  const old = variantMrp(variant);
  if (old <= price || price <= 0) return 0;
  return Math.round(((old - price) / old) * 100);
}

export function defaultVariant(product: Product): ProductVariant | null {
  const variants = product.variants ?? [];
  return variants.find((v) => toNumber(v.stock) > 0) ?? variants[0] ?? null;
}

export function variantLabel(variant?: ProductVariant | null) {
  if (variant?.attributes?.length) {
    return variant.attributes
      .map((attr) => attr.values?.[0]?.value)
      .filter(Boolean)
      .join(" · ");
  }
  if (!variant?.attributeValues?.length) return "";
  return variant.attributeValues.map((v) => v.value).join(" · ");
}

/** @deprecated Prefer explicit selected attribute_value_ids from cart/PDP */
export function variantAttributeIds(variant?: ProductVariant | null): number[] {
  if (variant?.attributes?.length) {
    return variant.attributes
      .map((attr) => Number(attr.values?.[0]?.id))
      .filter((id) => Number.isFinite(id) && id > 0);
  }
  return (variant?.attributeValues ?? [])
    .map((av) => Number(av.id))
    .filter((id) => Number.isFinite(id) && id > 0);
}

export function productHref(product: { id: string | number }) {
  return `/product/${product.id}`;
}

export function asId(value: string | number) {
  return String(value);
}

export function orderStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Ожидает";
    case "paid":
      return "Оплачен";
    case "cancelled":
      return "Отменён";
    case "completed":
      return "Завершён";
    default:
      return status;
  }
}
