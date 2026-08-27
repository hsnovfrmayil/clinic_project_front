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
import { defaultVariant, variantPrice } from "./money";

export interface CartLine {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface CartToast {
  id: number;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  add: (product: Product, variant?: ProductVariant | null, quantity?: number) => void;
  remove: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
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

const STORAGE_KEY = "eonage-cart-v2";

function lineKey(variantId: string | number) {
  return String(variantId);
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
      if (raw) setLines(JSON.parse(raw));
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
    (product: Product, variant?: ProductVariant | null, quantity = 1) => {
      const selected = variant ?? defaultVariant(product);
      if (!selected) return;

      setLines((prev) => {
        const key = lineKey(selected.id);
        const existing = prev.find((l) => lineKey(l.variant.id) === key);
        if (existing) {
          return prev.map((l) =>
            lineKey(l.variant.id) === key
              ? { ...l, quantity: l.quantity + quantity, product, variant: selected }
              : l
          );
        }
        return [...prev, { product, variant: selected, quantity }];
      });
      setToast({ id: Date.now(), product, variant: selected, quantity });
      setCartPulse((n) => n + 1);
    },
    []
  );

  const remove = useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l.variant.id) !== variantId));
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => lineKey(l.variant.id) !== variantId)
        : prev.map((l) =>
            lineKey(l.variant.id) === variantId ? { ...l, quantity } : l
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
