"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import ProductMedia from "./ProductMedia";
import { formatMoney, variantPrice } from "@/lib/money";
import { variantImage } from "@/lib/media";

export default function CartToast() {
  const { toast, dismissToast } = useCart();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel p-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.14)] backdrop-blur-md">
            <div className="flex h-14 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-panel-2">
              <ProductMedia
                src={variantImage(toast.variant)}
                alt={toast.product.name}
                className="h-full w-full"
                bottleClassName="h-12"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-ion">
                <Check size={12} strokeWidth={2.5} />
                Добавлено в корзину
              </div>
              <p className="mt-1 truncate text-sm font-medium">
                {toast.product.name}
              </p>
              <p className="mt-0.5 text-xs text-silver-dim">
                × {toast.quantity} ·{" "}
                {formatMoney(variantPrice(toast.variant) * toast.quantity)}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <button
                type="button"
                onClick={dismissToast}
                className="flex h-7 w-7 items-center justify-center rounded-full text-silver-dim transition-colors hover:text-ion"
                aria-label="Закрыть"
              >
                <X size={14} />
              </button>
              <Link
                href="/cart"
                onClick={dismissToast}
                className="text-[11px] uppercase tracking-[0.1em] text-mist transition-colors hover:text-ion"
              >
                В корзину
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
