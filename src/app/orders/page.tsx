"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { fetchOrders } from "@/lib/api/catalog";
import { toErrorMessage } from "@/lib/api/client";
import type { Order } from "@/lib/api/types";
import { LinkButton } from "@/components/Button";
import {
  formatMoney,
  orderStatusLabel,
  toNumber,
} from "@/lib/money";

export default function OrdersPage() {
  const { hydrated, isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchOrders({ page, limit: 10 }, token);
        if (!cancelled) {
          setOrders(res.data ?? []);
          setTotalPages(res.meta?.totalPages ?? 1);
        }
      } catch (err) {
        if (!cancelled) setError(toErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, isAuthenticated, token, page]);

  if (hydrated && !isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-28 text-center">
        <h1 className="text-2xl font-medium">Войдите, чтобы видеть заказы</h1>
        <p className="mt-3 text-silver">
          История заказов доступна только авторизованным пользователям.
        </p>
        <LinkButton href="/auth?next=/orders" className="mt-8">
          Войти
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 lg:px-10">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-ion">
            Личный кабинет
          </p>
          <h1 className="mt-2 text-3xl font-medium">Мои заказы</h1>
        </div>
        <Link
          href="/auth"
          className="text-sm text-silver underline-offset-4 hover:text-ion hover:underline"
        >
          Аккаунт
        </Link>
      </div>

      {loading && (
        <p className="text-sm text-silver">Загружаем заказы…</p>
      )}
      {error && <p className="text-sm text-gold">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-2xl border border-line bg-panel px-6 py-12 text-center">
          <p className="text-silver">Заказов пока нет</p>
          <LinkButton href="/catalog" className="mt-6">
            В каталог
          </LinkButton>
        </div>
      )}

      <ul className="flex flex-col gap-4">
        {orders.map((order) => (
          <li key={String(order.id)}>
            <Link
              href={`/orders/${order.id}`}
              className="block rounded-2xl border border-line bg-panel px-5 py-5 transition-colors hover:border-ion/50"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-silver-dim">
                    {new Date(order.created_at).toLocaleString("ru-RU")}
                  </p>
                  <p className="mt-1 font-medium text-mist">
                    № {order.order_number}
                  </p>
                </div>
                <span className="rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-silver">
                  {orderStatusLabel(order.status)}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-silver">
                <span>Итого: {formatMoney(order.final_amount)}</span>
                {toNumber(order.bonus_amount_used) > 0 && (
                  <span>Бонусы: −{toNumber(order.bonus_amount_used)}</span>
                )}
                {toNumber(order.bonus_amount_earned) > 0 && (
                  <span className="text-ion">
                    +{toNumber(order.bonus_amount_earned)} бонусов
                  </span>
                )}
                <span>{order.items?.length ?? 0} поз.</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.1em] text-silver disabled:opacity-40"
          >
            Назад
          </button>
          <span className="text-sm text-silver">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.1em] text-silver disabled:opacity-40"
          >
            Далее
          </button>
        </div>
      )}
    </div>
  );
}
