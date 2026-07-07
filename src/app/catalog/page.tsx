import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { products } from "@/lib/products";
import { ProductCategory } from "@/lib/types";
import clsx from "clsx";

const CATEGORIES: ProductCategory[] = [
  "Сыворотки",
  "Кремы",
  "Очищение",
  "Маски",
  "Домашние устройства",
];

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = category && CATEGORIES.includes(category as ProductCategory)
    ? (category as ProductCategory)
    : undefined;

  const filtered = active
    ? products.filter((p) => p.category === active)
    : products;

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <div className="mb-10">
        <span className="text-[11px] uppercase tracking-[0.16em] text-ion">
          Каталог
        </span>
        <h1 className="mt-2 text-3xl font-medium sm:text-4xl">
          Домашний протокол ухода
        </h1>
        <p className="mt-3 max-w-lg text-silver">
          Формулы, разработанные врачами-косметологами клиники EONAGE для
          продолжения результата процедур дома.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2.5">
        <Link
          href="/catalog"
          className={clsx(
            "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.08em] transition-colors",
            !active
              ? "border-ion bg-ion/10 text-ion"
              : "border-line text-silver hover:border-ion hover:text-ion"
          )}
        >
          Все продукты
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/catalog?category=${encodeURIComponent(cat)}`}
            className={clsx(
              "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.08em] transition-colors",
              active === cat
                ? "border-ion bg-ion/10 text-ion"
                : "border-line text-silver hover:border-ion hover:text-ion"
            )}
          >
            {cat}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-silver">В этой категории пока нет продуктов.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.06}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
