"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { fetchOrder } from "@/lib/api/catalog";
import { toErrorMessage } from "@/lib/api/client";
import type { Order } from "@/lib/api/types";
import { LinkButton } from "@/components/Button";
import ProductMedia from "@/components/ProductMedia";
import {
  formatMoney,
  orderStatusLabel,
  toNumber,
  variantLabel,
} from "@/lib/money";
import { mediaUrl, variantImage } from "@/lib/media";

export default function OrderDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const { hydrated, isAuthenticated, token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated || !id) return;
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchOrder(id, token);
        if (!cancelled) setOrder(data);
      } catch (err) {
        if (!cancelled) setError(toErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, isAuthenticated, token, id]);

  if (hydrated && !isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
        <h1 className="text-2xl font-medium">Нужна авторизация</h1>
        <LinkButton href={`/auth?next=/orders/${id}`} className="mt-8">
          Войти
        </LinkButton>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-6 py-24 text-center text-sm text-silver">
        Загружаем заказ…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
        <h1 className="text-2xl font-medium">Заказ не найден</h1>
        <p className="mt-3 text-sm text-gold">{error || "Нет данных"}</p>
        <LinkButton href="/orders" className="mt-8">
          К списку заказов
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 lg:px-10">
      <Link
        href="/orders"
        className="text-xs uppercase tracking-[0.1em] text-silver transition-colors hover:text-ion"
      >
        ← Все заказы
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium">Заказ</h1>
          <p className="mt-2 text-sm text-silver">№ {order.order_number}</p>
          <p className="mt-1 text-sm text-silver-dim">
            {new Date(order.created_at).toLocaleString("ru-RU")}
          </p>
        </div>
        <span className="rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-silver">
          {orderStatusLabel(order.status)}
        </span>
      </div>

      <ul className="mt-10 flex flex-col gap-4">
        {(order.items ?? []).map((item) => {
          const variant = item.productVariant;
          const attrsFromSnapshot = (item.attributeValues ?? [])
            .map((av) => av.attributeValue?.value)
            .filter(Boolean)
            .join(" · ");
          const label =
            attrsFromSnapshot ||
            variantLabel(variant) ||
            `Вариант #${item.product_variant_id}`;
          const image =
            variantImage(variant) ||
            mediaUrl(variant?.uploads?.[0]?.file_path) ||
            null;

          return (
            <li
              key={String(item.id)}
              className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-4"
            >
              <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-panel-2">
                <ProductMedia
                  src={image}
                  alt={label}
                  className="h-full w-full"
                  bottleClassName="h-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{label}</p>
                <p className="mt-1 text-xs text-silver-dim">
                  ×{item.quantity}
                  {toNumber(item.price_per_item) > 0 &&
                    ` · ${formatMoney(item.price_per_item)} / шт`}
                </p>
              </div>
              <div className="text-right text-sm">
                <p>{formatMoney(item.final_price)}</p>
                {toNumber(item.allocated_bonus) > 0 && (
                  <p className="mt-1 text-xs text-gold">
                    −{toNumber(item.allocated_bonus)} бон.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 space-y-2 rounded-2xl border border-line bg-panel p-5 text-sm">
        <div className="flex justify-between text-silver">
          <span>Сумма</span>
          <span>{formatMoney(order.total_amount)}</span>
        </div>
        <div className="flex justify-between text-silver">
          <span>НДС</span>
          <span>{formatMoney(order.total_vat_amount)}</span>
        </div>
        {toNumber(order.bonus_amount_used) > 0 && (
          <div className="flex justify-between text-gold">
            <span>Списано бонусов</span>
            <span>−{toNumber(order.bonus_amount_used)}</span>
          </div>
        )}
        {toNumber(order.bonus_amount_earned) > 0 && (
          <div className="flex justify-between text-ion">
            <span>Начислено бонусов</span>
            <span>+{toNumber(order.bonus_amount_earned)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-line pt-3 text-base font-semibold text-mist">
          <span>Итого</span>
          <span>{formatMoney(order.final_amount)}</span>
        </div>
      </div>
    </div>
  );
}
