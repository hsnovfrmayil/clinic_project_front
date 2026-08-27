import { MEDIA_URL } from "./api/config";
import type { Product, ProductVariant, Upload } from "./api/types";

export function mediaUrl(filePath?: string | null): string | null {
  if (!filePath) return null;
  if (/^https?:\/\//i.test(filePath)) return filePath;
  return `${MEDIA_URL}/${filePath.replace(/^\//, "")}`;
}

export function firstUploadUrl(uploads?: Upload[] | null): string | null {
  const path = uploads?.find((u) => u.file_path)?.file_path;
  return mediaUrl(path);
}

export function variantImage(variant?: ProductVariant | null): string | null {
  return firstUploadUrl(variant?.uploads);
}

export function productImage(product: Product): string | null {
  for (const variant of product.variants ?? []) {
    const url = variantImage(variant);
    if (url) return url;
  }
  return null;
}

export function brandImage(uploads?: Upload[] | null): string | null {
  return firstUploadUrl(uploads);
}
