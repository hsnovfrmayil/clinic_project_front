"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, TrendingUp } from "lucide-react";
import clsx from "clsx";
import ProductCard from "./ProductCard";
import { fetchProducts } from "@/lib/api/catalog";
import type { Product } from "@/lib/api/types";

function SearchProductRow({
  products,
  onClose,
}: {
  products: Product[];
  onClose: () => void;
}) {
  return (
    <div className="no-scrollbar -mx-6 flex items-start gap-3 overflow-x-auto overflow-y-visible px-6 lg:-mx-10 lg:px-10">
      {products.map((product) => (
        <div
          key={String(product.id)}
          className="w-[196px] shrink-0"
          onClick={onClose}
        >
          <div className="w-[280px] origin-top-left scale-[0.7] -mb-36">
            <ProductCard product={product} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NavbarSearchButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      data-search-area
      className={clsx(
        "flex h-10 w-10 items-center justify-center rounded-full border text-mist transition-colors hover:border-ion hover:text-ion",
        open ? "border-ion bg-ion/10 text-ion" : "border-line"
      )}
      aria-label="Поиск"
      aria-expanded={open}
    >
      <Search size={17} />
    </button>
  );
}

export function NavbarSearchPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [trending, setTrending] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts({ limit: 8, sortBy: "id", order: "DESC" })
      .then((res) => setTrending(res.data ?? []))
      .catch(() => setTrending([]));
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = window.setTimeout(() => {
      fetchProducts({ search: q, limit: 9 })
        .then((res) => setResults(res.data ?? []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 280);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-search-area
          className="overflow-visible border-t border-line bg-void/95 backdrop-blur-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="mx-auto max-w-7xl px-6 py-3 lg:px-10">
            <div className="flex items-center gap-2 rounded-full border border-line bg-panel-2 px-3 transition-colors focus-within:border-ion">
              <Search size={14} className="shrink-0 text-silver-dim" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск продуктов..."
                className="min-w-0 flex-1 border-0 bg-transparent py-2 text-[13px] text-mist outline-none placeholder:text-silver-dim"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-silver-dim transition-colors hover:text-ion"
                  aria-label="Очистить поиск"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="mt-3">
              {query ? (
                loading ? (
                  <p className="py-4 text-center text-sm text-silver">Ищем…</p>
                ) : results.length > 0 ? (
                  <>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                      Результаты · {results.length}
                    </p>
                    <SearchProductRow products={results} onClose={onClose} />
                  </>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-sm text-silver">Ничего не найдено</p>
                    <p className="mt-1 text-xs text-silver-dim">
                      Попробуйте изменить запрос
                    </p>
                  </div>
                )
              ) : (
                <>
                  <div className="mb-2 flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-ion" />
                    <p className="text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                      В тренде
                    </p>
                  </div>
                  {trending.length > 0 ? (
                    <SearchProductRow products={trending} onClose={onClose} />
                  ) : (
                    <p className="py-4 text-center text-sm text-silver">
                      Загрузка…
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
