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

export function variantPrice(variant?: ProductVariant | null) {
  if (!variant) return 0;
  const discounted = toNumber(variant.discounted_price);
  if (discounted > 0) return discounted;
  return toNumber(variant.price);
}

export function variantMrp(variant?: ProductVariant | null) {
  if (!variant) return 0;
  return toNumber(variant.mrp);
}

export function defaultVariant(product: Product): ProductVariant | null {
  const variants = product.variants ?? [];
  return variants.find((v) => toNumber(v.stock) > 0) ?? variants[0] ?? null;
}

export function variantLabel(variant?: ProductVariant | null) {
  if (!variant?.attributeValues?.length) return "";
  return variant.attributeValues.map((v) => v.value).join(" · ");
}

export function productHref(product: { id: string | number }) {
  return `/product/${product.id}`;
}

export function asId(value: string | number) {
  return String(value);
}
