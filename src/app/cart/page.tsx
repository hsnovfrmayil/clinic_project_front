"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { DELIVERY_OPTIONS } from "@/lib/delivery";
import ProductMedia from "@/components/ProductMedia";
import { LinkButton } from "@/components/Button";
import { Minus, Plus, X, ArrowLeft, ShoppingBag, Truck, Store } from "lucide-react";
import clsx from "clsx";
import { formatMoney, productHref, variantLabel, variantPrice } from "@/lib/money";
import { variantImage } from "@/lib/media";

export default function CartPage() {
  const {
    lines,
    count,
    setQuantity,
    remove,
    subtotal,
    deliveryFee,
    total,
    delivery,
    setDelivery,
    deliveryAddress,
    setDeliveryAddress,
  } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-panel">
          <ShoppingBag size={24} className="text-silver-dim" />
        </div>
        <span className="mt-8 text-[11px] uppercase tracking-[0.16em] text-ion">
          Корзина
        </span>
        <h1 className="mt-2 text-3xl font-medium">Ваша корзина пуста</h1>
        <p className="mt-3 text-silver">
          Добавьте продукты из каталога, чтобы оформить заказ.
        </p>
        <LinkButton href="/catalog" className="mt-9">
          В каталог
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/catalog"
            className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-silver transition-colors hover:text-ion"
          >
            <ArrowLeft size={14} />
            Продолжить покупки
          </Link>
          <span className="text-[11px] uppercase tracking-[0.16em] text-ion">
            Корзина
          </span>
          <h1 className="mt-2 text-3xl font-medium sm:text-4xl">
            Ваш заказ
          </h1>
          <p className="mt-3 text-silver">
            {count} {count === 1 ? "товар" : count < 5 ? "товара" : "товаров"} ·
            готово к оформлению
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
        <div className="flex flex-col gap-10">
          <ul className="flex flex-col gap-4">
          {lines.map(({ product, variant, quantity }) => (
            <li
              key={String(variant.id)}
              className="group flex gap-5 rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-ion/30 sm:gap-6 sm:p-6"
            >
              <Link
                href={productHref(product)}
                className="flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-panel-2 transition-colors group-hover:bg-panel-2/80 sm:h-32 sm:w-28"
              >
                <ProductMedia
                  src={variantImage(variant)}
                  alt={product.name}
                  className="h-full w-full p-2"
                  bottleClassName="h-24 sm:h-28"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                      {variantLabel(variant) || product.categories?.[0]?.name}
                    </span>
                    <Link
                      href={productHref(product)}
                      className="mt-1 block text-base font-medium leading-snug transition-colors hover:text-ion sm:text-lg"
                    >
                      {product.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => remove(String(variant.id))}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent text-silver-dim transition-colors hover:border-line hover:text-ion"
                    aria-label="Удалить"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center gap-1 rounded-full border border-line bg-void/50 px-1.5 py-1">
                    <button
                      onClick={() => setQuantity(String(variant.id), quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-silver transition-colors hover:bg-panel-2 hover:text-ion"
                      aria-label="Уменьшить количество"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(String(variant.id), quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-silver transition-colors hover:bg-panel-2 hover:text-ion"
                      aria-label="Увеличить количество"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-lg font-semibold">
                    {formatMoney(variantPrice(variant) * quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
          </ul>

          <fieldset>
            <legend className="text-xs uppercase tracking-[0.14em] text-silver-dim">
              Способ получения
            </legend>
            <div className="mt-4 flex flex-col gap-3">
              {DELIVERY_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={clsx(
                    "flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3.5 transition-colors",
                    delivery === opt.id
                      ? "border-ion bg-ion/10"
                      : "border-line hover:border-ion/50"
                  )}
                >
                  <span className="flex items-center gap-3 text-sm">
                    {opt.id === "pickup" ? <Store size={16} /> : <Truck size={16} />}
                    {opt.label}
                    <span className="text-silver-dim">· {opt.eta}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm text-silver">
                      {opt.price === 0 ? "Бесплатно" : formatMoney(opt.price)}
                    </span>
                    <input
                      type="radio"
                      name="delivery"
                      checked={delivery === opt.id}
                      onChange={() => setDelivery(opt.id)}
                      className="accent-ion"
                    />
                  </span>
                </label>
              ))}
            </div>
            {delivery !== "pickup" && (
              <input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Адрес доставки"
                className="input mt-4"
              />
            )}
          </fieldset>
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="rounded-2xl border border-line bg-panel p-6">
            <h2 className="text-sm uppercase tracking-[0.14em] text-silver-dim">
              Итого
            </h2>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between text-silver">
                <span>
                  Товары ({count})
                </span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-silver">
                <span>Доставка</span>
                <span>{deliveryFee === 0 ? "Бесплатно" : formatMoney(deliveryFee)}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
              <span className="text-base font-medium">Итого</span>
              <span className="text-2xl font-semibold">{formatMoney(total)}</span>
            </div>

            <LinkButton href="/checkout" className="mt-6 w-full">
              Оформить заказ
            </LinkButton>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-silver-dim">
              Безопасная оплата · Бесплатный возврат в течение 14 дней
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
