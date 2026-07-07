"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import ProductBottle from "./ProductBottle";
import { Minus, Plus, X } from "lucide-react";
import { LinkButton } from "./Button";

export default function CartDrawer() {
  const { lines, isOpen, close, setQuantity, remove, subtotal, bonusEarned } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-panel border-l border-line"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="text-sm uppercase tracking-[0.14em]">
                Корзина · {lines.length}
              </h2>
              <button
                onClick={close}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-ion hover:text-ion"
                aria-label="Закрыть корзину"
              >
                <X size={16} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-silver">Ваша корзина пока пуста</p>
                <LinkButton href="/catalog" variant="outline" onClick={close}>
                  В каталог
                </LinkButton>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <ul className="flex flex-col gap-6">
                    {lines.map(({ product, quantity }) => (
                      <li key={product.id} className="flex gap-4">
                        <div className="h-24 w-20 shrink-0 rounded-xl bg-panel-2">
                          <ProductBottle
                            variant={product.bottle}
                            tint={product.tint}
                            className="h-full"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${product.slug}`}
                              onClick={close}
                              className="text-sm font-medium hover:text-ion"
                            >
                              {product.name}
                            </Link>
                            <button
                              onClick={() => remove(product.id)}
                              className="text-silver-dim hover:text-ion"
                              aria-label="Удалить"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <span className="text-xs text-silver-dim">
                            {product.volume}
                          </span>
                          <div className="mt-1 flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full border border-line px-2 py-1">
                              <button
                                onClick={() =>
                                  setQuantity(product.id, quantity - 1)
                                }
                                className="text-silver hover:text-ion"
                                aria-label="Уменьшить количество"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-4 text-center text-xs">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  setQuantity(product.id, quantity + 1)
                                }
                                className="text-silver hover:text-ion"
                                aria-label="Увеличить количество"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-medium">
                              ${product.price * quantity}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-line px-6 py-5">
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-silver">Сумма</span>
                    <span className="font-semibold">${subtotal}</span>
                  </div>
                  <div className="mb-5 flex items-center justify-between text-xs text-gold/90">
                    <span>Будет начислено бонусов</span>
                    <span>+{bonusEarned}</span>
                  </div>
                  <LinkButton
                    href="/checkout"
                    className="w-full"
                    onClick={close}
                  >
                    Оформить заказ
                  </LinkButton>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
