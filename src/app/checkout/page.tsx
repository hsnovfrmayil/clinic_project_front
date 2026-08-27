"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button, LinkButton } from "@/components/Button";
import ProductMedia from "@/components/ProductMedia";
import { CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { createOrder } from "@/lib/api/catalog";
import { toErrorMessage } from "@/lib/api/client";
import { formatMoney, toNumber, variantLabel, variantPrice } from "@/lib/money";
import { variantImage } from "@/lib/media";

const PAYMENT_OPTIONS = [
  { id: "card", label: "Картой онлайн" },
  { id: "cash", label: "Наличными при получении" },
] as const;

export default function CheckoutPage() {
  const { lines, subtotal, deliveryFee, total, clear } = useCart();
  const { isAuthenticated, token, hydrated } = useAuth();
  const [payment, setPayment] = useState<(typeof PAYMENT_OPTIONS)[number]["id"]>("card");
  const [useBonus, setUseBonus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<{
    number: string;
    bonusUsed: number;
    finalAmount: number;
  } | null>(null);

  if (confirmedOrder) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
        <CheckCircle2 size={44} className="text-ion" />
        <h1 className="mt-6 text-2xl font-medium">Заказ оформлен</h1>
        <p className="mt-3 text-silver">
          Номер вашего заказа —{" "}
          <span className="text-mist">{confirmedOrder.number}</span>. Мы свяжемся
          с вами для подтверждения деталей доставки.
        </p>
        {confirmedOrder.bonusUsed > 0 && (
          <p className="mt-2 text-sm text-gold/90">
            Списано бонусов: {confirmedOrder.bonusUsed}
          </p>
        )}
        <p className="mt-2 text-sm text-silver">
          Итого: {formatMoney(confirmedOrder.finalAmount)}
        </p>
        <LinkButton href="/catalog" className="mt-9">
          Вернуться в каталог
        </LinkButton>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
        <h1 className="text-2xl font-medium">Корзина пуста</h1>
        <p className="mt-3 text-silver">
          Добавьте продукты из каталога, чтобы оформить заказ.
        </p>
        <LinkButton href="/catalog" className="mt-8">
          В каталог
        </LinkButton>
      </div>
    );
  }

  if (hydrated && !isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
        <h1 className="text-2xl font-medium">Войдите, чтобы оформить заказ</h1>
        <p className="mt-3 text-silver">
          Сделать заказ можно только с аккаунтом EONAGE.
        </p>
        <LinkButton href="/auth?next=/checkout" className="mt-8">
          Войти
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
      <h1 className="mb-10 text-3xl font-medium">Оформление заказа</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!token) return;
          setError("");
          setSubmitting(true);
          try {
            const order = await createOrder(
              {
                idempotency_key: crypto.randomUUID(),
                bonus: useBonus,
                items: lines.map((l) => ({
                  product_variant_id: Number(l.variant.id),
                  quantity: l.quantity,
                })),
              },
              token
            );
            setConfirmedOrder({
              number: order.order_number,
              bonusUsed: toNumber(order.bonus_amount_used),
              finalAmount: toNumber(order.final_amount),
            });
            clear();
          } catch (err) {
            setError(toErrorMessage(err, "Не удалось оформить заказ"));
          } finally {
            setSubmitting(false);
          }
        }}
        className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]"
      >
        <div className="flex flex-col gap-10">
          <fieldset>
            <legend className="text-xs uppercase tracking-[0.14em] text-silver-dim">
              Способ оплаты
            </legend>
            <div className="mt-4 flex flex-col gap-3">
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={clsx(
                    "flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3.5 transition-colors",
                    payment === opt.id
                      ? "border-ion bg-ion/10"
                      : "border-line hover:border-ion/50"
                  )}
                >
                  <span className="text-sm">{opt.label}</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === opt.id}
                    onChange={() => setPayment(opt.id)}
                    className="accent-ion"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line px-4 py-3.5">
            <span className="text-sm">Списать бонусы (до 50% суммы)</span>
            <input
              type="checkbox"
              checked={useBonus}
              onChange={(e) => setUseBonus(e.target.checked)}
              className="accent-ion"
            />
          </label>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-sm uppercase tracking-[0.14em] text-silver-dim">
            Ваш заказ
          </h2>
          <ul className="mt-5 flex flex-col gap-4">
            {lines.map(({ product, variant, quantity }) => (
              <li key={String(variant.id)} className="flex items-center gap-3">
                <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-panel-2">
                  <ProductMedia
                    src={variantImage(variant)}
                    alt={product.name}
                    className="h-full w-full"
                    bottleClassName="h-full"
                  />
                </div>
                <div className="flex-1 text-sm">
                  <p className="leading-snug">{product.name}</p>
                  <span className="text-xs text-silver-dim">
                    {variantLabel(variant)} × {quantity}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {formatMoney(variantPrice(variant) * quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between text-silver">
              <span>Сумма</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-silver">
              <span>Доставка</span>
              <span>{deliveryFee === 0 ? "Бесплатно" : formatMoney(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-mist">
              <span>Итого</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-gold">{error}</p>}

          <Button type="submit" disabled={submitting} className="mt-6 w-full">
            {submitting ? "Оформляем…" : "Подтвердить заказ"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
