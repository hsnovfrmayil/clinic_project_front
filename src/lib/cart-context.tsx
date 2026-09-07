"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DeliveryId, getDeliveryFee } from "./delivery";
import type { Product, ProductVariant } from "./api/types";
import {
  defaultAttributeSelection,
  selectionLabel,
  selectionValueIds,
  productAttributeGroups,
} from "./attributes";
import { defaultVariant, variantPrice } from "./money";

export interface CartLine {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  attribute_value_ids: number[];
  attribute_label?: string;
}

export interface CartToast {
  id: number;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  attribute_label?: string;
}

interface CartContextValue {
  lines: CartLine[];
  add: (
    product: Product,
    variant?: ProductVariant | null,
    quantity?: number,
    attributeValueIds?: number[],
    attributeLabel?: string
  ) => void;
  remove: (lineKey: string) => void;
  setQuantity: (lineKey: string, quantity: number) => void;
  clear: () => void;
  delivery: DeliveryId;
  setDelivery: (id: DeliveryId) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  toast: CartToast | null;
  dismissToast: () => void;
  cartPulse: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "eonage-cart-v3";

export function cartLineKey(
  variantId: string | number,
  attributeValueIds: number[] = []
) {
  const attrs = [...attributeValueIds].sort((a, b) => a - b).join(",");
  return `${variantId}:${attrs}`;
}

function normalizeLine(raw: Partial<CartLine> & { product: Product; variant: ProductVariant }): CartLine {
  const attribute_value_ids =
    raw.attribute_value_ids?.length
      ? raw.attribute_value_ids
      : selectionValueIds(defaultAttributeSelection(raw.variant));
  const attribute_label =
    raw.attribute_label ||
    selectionLabel(
      Object.fromEntries(
        (raw.variant.attributes ?? []).map((attr, i) => {
          const id = attribute_value_ids[i];
          return [String(attr.id), String(id ?? attr.values?.[0]?.id ?? "")];
        })
      ),
      productAttributeGroups(raw.product)
    ) ||
    undefined;

  return {
    product: raw.product,
    variant: raw.variant,
    quantity: raw.quantity ?? 1,
    attribute_value_ids,
    attribute_label,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [delivery, setDelivery] = useState<DeliveryId>("courier");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<CartToast | null>(null);
  const [cartPulse, setCartPulse] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        setLines(parsed.map((l) => normalizeLine(l)));
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const add = useCallback(
    (
      product: Product,
      variant?: ProductVariant | null,
      quantity = 1,
      attributeValueIds?: number[],
      attributeLabel?: string
    ) => {
      const selected = variant ?? defaultVariant(product);
      if (!selected) return;

      const attribute_value_ids =
        attributeValueIds?.length
          ? attributeValueIds
          : selectionValueIds(defaultAttributeSelection(selected));
      const attribute_label =
        attributeLabel ||
        selectionLabel(
          defaultAttributeSelection(selected),
          productAttributeGroups(product)
        );

      const key = cartLineKey(selected.id, attribute_value_ids);

      setLines((prev) => {
        const existing = prev.find(
          (l) => cartLineKey(l.variant.id, l.attribute_value_ids) === key
        );
        if (existing) {
          return prev.map((l) =>
            cartLineKey(l.variant.id, l.attribute_value_ids) === key
              ? {
                  ...l,
                  quantity: l.quantity + quantity,
                  product,
                  variant: selected,
                  attribute_value_ids,
                  attribute_label,
                }
              : l
          );
        }
        return [
          ...prev,
          {
            product,
            variant: selected,
            quantity,
            attribute_value_ids,
            attribute_label,
          },
        ];
      });
      setToast({
        id: Date.now(),
        product,
        variant: selected,
        quantity,
        attribute_label,
      });
      setCartPulse((n) => n + 1);
    },
    []
  );

  const remove = useCallback((lineKey: string) => {
    setLines((prev) =>
      prev.filter(
        (l) => cartLineKey(l.variant.id, l.attribute_value_ids) !== lineKey
      )
    );
  }, []);

  const setQuantity = useCallback((lineKey: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter(
            (l) => cartLineKey(l.variant.id, l.attribute_value_ids) !== lineKey
          )
        : prev.map((l) =>
            cartLineKey(l.variant.id, l.attribute_value_ids) === lineKey
              ? { ...l, quantity }
              : l
          )
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce(
      (sum, l) => sum + variantPrice(l.variant) * l.quantity,
      0
    );
    const deliveryFee = getDeliveryFee(delivery);
    const total = subtotal + deliveryFee;
    return {
      lines,
      add,
      remove,
      setQuantity,
      clear,
      delivery,
      setDelivery,
      deliveryAddress,
      setDeliveryAddress,
      count,
      subtotal,
      deliveryFee,
      total,
      toast,
      dismissToast,
      cartPulse,
    };
  }, [
    lines,
    add,
    remove,
    setQuantity,
    clear,
    delivery,
    deliveryAddress,
    toast,
    dismissToast,
    cartPulse,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
