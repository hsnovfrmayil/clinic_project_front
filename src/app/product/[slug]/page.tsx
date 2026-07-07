import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/products";
import ProductBottle from "@/components/ProductBottle";
import PriceTag from "@/components/PriceTag";
import Badge from "@/components/Badge";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";
import { Star, Truck, ShieldCheck } from "lucide-react";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
        <div className="relative flex h-[420px] items-center justify-center rounded-3xl border border-line bg-panel">
          <div className="absolute left-4 top-4 flex flex-col gap-1.5">
            {product.bestseller && <Badge tone="gold">Бестселлер</Badge>}
            {product.isNew && <Badge tone="ion">New</Badge>}
          </div>
          <ProductBottle
            variant={product.bottle}
            tint={product.tint}
            className="h-72"
          />
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-[0.16em] text-ion">
            {product.category} · {product.volume}
          </span>
          <h1 className="mt-2 text-3xl font-medium sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 font-display italic text-silver">
            {product.tagline}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-silver">
            <div className="flex items-center gap-1 text-gold">
              <Star size={14} fill="currentColor" />
              {product.rating}
            </div>
            <span className="text-silver-dim">
              · {product.reviews} отзывов
            </span>
          </div>

          <div className="mt-6">
            <PriceTag product={product} size="lg" />
          </div>

          <p className="mt-6 max-w-lg leading-relaxed text-silver">
            {product.description}
          </p>

          <div className="mt-8">
            <ProductActions product={product} />
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-sm text-silver">
            <div className="flex items-center gap-2.5">
              <Truck size={15} className="text-ion" />
              Доставка по Москве 1–2 дня, по России — 3–5 дней
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={15} className="text-ion" />
              Разработано и протестировано врачами клиники EONAGE
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <h3 className="text-xs uppercase tracking-[0.14em] text-silver-dim">
              Ключевые компоненты
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <li
                  key={ing}
                  className="rounded-full border border-line px-3 py-1.5 text-xs text-silver"
                >
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 text-2xl font-medium">С этим продуктом покупают</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
