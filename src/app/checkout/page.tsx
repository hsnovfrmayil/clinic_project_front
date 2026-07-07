"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Button, LinkButton } from "@/components/Button";
import ProductBottle from "@/components/ProductBottle";
import { CheckCircle2, Truck, Store } from "lucide-react";
import clsx from "clsx";

const DELIVERY_OPTIONS = [
  { id: "courier", label: "Курьером по Москве", price: 0, eta: "1–2 дня" },
  { id: "pickup", label: "Самовывоз из клиники", price: 0, eta: "сегодня" },
  { id: "post", label: "Доставка по России", price: 12, eta: "3–5 дней" },
] as const;

const PAYMENT_OPTIONS = [
  { id: "card", label: "Картой онлайн" },
  { id: "cash", label: "Наличными при получении" },
] as const;

export default function CheckoutPage() {
  const { lines, subtotal, bonusEarned, clear } = useCart();
  const [delivery, setDelivery] = useState<(typeof DELIVERY_OPTIONS)[number]["id"]>("courier");
  const [payment, setPayment] = useState<(typeof PAYMENT_OPTIONS)[number]["id"]>("card");
  const [confirmedOrder, setConfirmedOrder] = useState<{
    number: string;
    bonus: number;
  } | null>(null);

  const deliveryFee = DELIVERY_OPTIONS.find((d) => d.id === delivery)?.price ?? 0;
  const total = subtotal + deliveryFee;

  const generatedOrder = useMemo(
    () => `EON-${Math.floor(10000 + Math.random() * 89999)}`,
    []
  );

  if (confirmedOrder) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
        <CheckCircle2 size={44} className="text-ion" />
        <h1 className="mt-6 text-2xl font-medium">Заказ оформлен</h1>
        <p className="mt-3 text-silver">
          Номер вашего заказа — <span className="text-mist">{confirmedOrder.number}</span>.
          Мы свяжемся с вами для подтверждения деталей доставки.
        </p>
        <p className="mt-2 text-sm text-gold/90">
          На бонусный счёт будет начислено +{confirmedOrder.bonus} баллов
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
      <h1 className="mb-10 text-3xl font-medium">Оформление заказа</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setConfirmedOrder({ number: generatedOrder, bonus: bonusEarned });
          clear();
        }}
        className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]"
      >
        <div className="flex flex-col gap-10">
          <fieldset>
            <legend className="text-xs uppercase tracking-[0.14em] text-silver-dim">
              Контактные данные
            </legend>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="Имя" className="input" />
              <input required type="tel" placeholder="Телефон" className="input" />
              <input
                required
                type="email"
                placeholder="Email"
                className="input sm:col-span-2"
              />
            </div>
          </fieldset>

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
                      {opt.price === 0 ? "Бесплатно" : `$${opt.price}`}
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
                required
                placeholder="Адрес доставки"
                className="input mt-4"
              />
            )}
          </fieldset>

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
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-sm uppercase tracking-[0.14em] text-silver-dim">
            Ваш заказ
          </h2>
          <ul className="mt-5 flex flex-col gap-4">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3">
                <div className="h-14 w-12 shrink-0 rounded-lg bg-panel-2">
                  <ProductBottle
                    variant={product.bottle}
                    tint={product.tint}
                    className="h-full"
                  />
                </div>
                <div className="flex-1 text-sm">
                  <p className="leading-snug">{product.name}</p>
                  <span className="text-xs text-silver-dim">× {quantity}</span>
                </div>
                <span className="text-sm font-medium">
                  ${product.price * quantity}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between text-silver">
              <span>Сумма</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-silver">
              <span>Доставка</span>
              <span>{deliveryFee === 0 ? "Бесплатно" : `$${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-mist">
              <span>Итого</span>
              <span>${total}</span>
            </div>
            <div className="flex justify-between text-xs text-gold/90">
              <span>Бонусы за заказ</span>
              <span>+{bonusEarned}</span>
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full">
            Подтвердить заказ
          </Button>
        </aside>
      </form>
    </div>
  );
}
