"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { fetchProductFilters, fetchProducts } from "@/lib/api/catalog";
import type { Product, ProductFilters } from "@/lib/api/types";

type FilterState = {
  categoryIds: string[];
  brandIds: string[];
  attributeValueIds: string[];
  inStock: boolean;
};

const emptyFilters: FilterState = {
  categoryIds: [],
  brandIds: [],
  attributeValueIds: [],
  inStock: false,
};

function toggleId(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function parseFilters(params: URLSearchParams): FilterState {
  const split = (key: string) =>
    (params.get(key) ?? "").split(",").filter(Boolean);
  return {
    categoryIds: split("category"),
    brandIds: split("brand"),
    attributeValueIds: split("av"),
    inStock: params.get("in_stock") === "1",
  };
}

function toQuery(filters: FilterState, page = 1) {
  const parts: string[] = [];
  if (filters.categoryIds.length) parts.push(`category=${filters.categoryIds.join(",")}`);
  if (filters.brandIds.length) parts.push(`brand=${filters.brandIds.join(",")}`);
  if (filters.attributeValueIds.length) parts.push(`av=${filters.attributeValueIds.join(",")}`);
  if (filters.inStock) parts.push("in_stock=1");
  if (page > 1) parts.push(`page=${page}`);
  return parts.join("&");
}

function hasActiveFilters(filters: FilterState) {
  return (
    filters.categoryIds.length > 0 ||
    filters.brandIds.length > 0 ||
    filters.attributeValueIds.length > 0 ||
    filters.inStock
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-line/70 py-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">
          {title}
        </span>
        <ChevronDown
          size={15}
          className={clsx(
            "text-silver-dim transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="mt-4 space-y-1.5">{children}</div>}
    </div>
  );
}

function FilterCheck({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={clsx(
        "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors",
        checked
          ? "bg-panel-2/80 text-mist"
          : "text-silver hover:bg-panel-2/50 hover:text-mist"
      )}
    >
      <span
        className={clsx(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
          checked
            ? "border-mist bg-mist text-[var(--color-void)]"
            : "border-line bg-transparent"
        )}
      >
        {checked && <Check size={11} strokeWidth={3} />}
      </span>
      <span className="flex-1 leading-snug">{label}</span>
    </button>
  );
}

function FiltersPanel({
  filters,
  facets,
  onChange,
  onReset,
}: {
  filters: FilterState;
  facets: ProductFilters | null;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}) {
  const active = hasActiveFilters(filters);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium tracking-tight">Фильтры</h2>
        {active && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] uppercase tracking-[0.12em] text-silver-dim transition-colors hover:text-ion"
          >
            Сбросить
          </button>
        )}
      </div>

      <FilterSection title="Категория">
        {(facets?.categories ?? []).map((cat) => (
          <FilterCheck
            key={String(cat.id)}
            label={cat.name}
            checked={filters.categoryIds.includes(String(cat.id))}
            onChange={() =>
              onChange({
                ...filters,
                categoryIds: toggleId(filters.categoryIds, String(cat.id)),
              })
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Бренд">
        {(facets?.brands ?? []).map((brand) => (
          <FilterCheck
            key={String(brand.id)}
            label={brand.name}
            checked={filters.brandIds.includes(String(brand.id))}
            onChange={() =>
              onChange({
                ...filters,
                brandIds: toggleId(filters.brandIds, String(brand.id)),
              })
            }
          />
        ))}
      </FilterSection>

      {(facets?.attributes ?? []).map((attr) => (
        <FilterSection key={String(attr.id)} title={attr.name}>
          {attr.values.map((av) => (
            <FilterCheck
              key={String(av.id)}
              label={av.value}
              checked={filters.attributeValueIds.includes(String(av.id))}
              onChange={() =>
                onChange({
                  ...filters,
                  attributeValueIds: toggleId(
                    filters.attributeValueIds,
                    String(av.id)
                  ),
                })
              }
            />
          ))}
        </FilterSection>
      ))}

      <FilterSection title="Наличие">
        <FilterCheck
          label="Только в наличии"
          checked={filters.inStock}
          onChange={() => onChange({ ...filters, inStock: !filters.inStock })}
        />
      </FilterSection>
    </div>
  );
}

export default function CatalogView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [facets, setFacets] = useState<ProductFilters | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const page = Number(searchParams.get("page") || "1") || 1;
  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams]
  );

  useEffect(() => {
    fetchProductFilters()
      .then(setFacets)
      .catch(() => setFacets({ attributes: [], brands: [], categories: [] }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchProducts({
      page,
      limit: 12,
      category_id: filters.categoryIds,
      brand_id: filters.brandIds,
      attribute_value_ids: filters.attributeValueIds,
      in_stock: filters.inStock || undefined,
      sortBy: "id",
      order: "DESC",
    })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data ?? []);
        setTotal(res.meta?.total ?? 0);
        setTotalPages(res.meta?.totalPages ?? 1);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message || "Не удалось загрузить каталог");
        setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  const applyFilters = (next: FilterState, nextPage = 1) => {
    const qs = toQuery(next, nextPage);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const resetFilters = () => {
    applyFilters(emptyFilters);
    setMobileOpen(false);
  };

  const active = hasActiveFilters(filters);

  return (
    <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <FiltersPanel
            filters={filters}
            facets={facets}
            onChange={(next) => applyFilters(next)}
            onReset={resetFilters}
          />
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-silver">
            Найдено:{" "}
            <span className="font-medium text-mist">{total}</span>
          </p>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-mist transition-colors hover:border-ion lg:hidden"
          >
            <SlidersHorizontal size={14} />
            Фильтры
            {active && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-mist px-1.5 text-[10px] text-[var(--color-void)]">
                {filters.categoryIds.length +
                  filters.brandIds.length +
                  filters.attributeValueIds.length +
                  (filters.inStock ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl bg-panel px-6 py-16 text-center text-silver">
            {error}
          </div>
        ) : loading ? (
          <div className="py-20 text-center text-sm text-silver">
            Загрузка каталога…
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-panel px-6 py-16 text-center">
            <p className="text-silver">
              По выбранным фильтрам ничего не найдено.
            </p>
            {active && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 text-[12px] uppercase tracking-[0.12em] text-ion hover:underline"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product, i) => (
                <Reveal key={String(product.id)} delay={(i % 3) * 0.05}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => applyFilters(filters, n)}
                    className={clsx(
                      "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition-colors",
                      n === page
                        ? "bg-mist text-[var(--color-void)]"
                        : "text-silver hover:bg-panel hover:text-mist"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,340px)] flex-col bg-void shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="text-sm font-medium">Фильтры</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-silver hover:bg-panel hover:text-mist"
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              <FiltersPanel
                filters={filters}
                facets={facets}
                onChange={(next) => applyFilters(next)}
                onReset={resetFilters}
              />
            </div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl bg-mist py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-void)]"
              >
                Показать {total}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
