import Reveal from "@/components/Reveal";
import BrandShowcase from "@/components/BrandShowcase";
import DiagonalMarquee from "@/components/DiagonalMarquee";
import { LinkButton } from "@/components/Button";
import { fetchBrands } from "@/lib/api/catalog";
import { brandImage } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const res = await fetchBrands({ limit: 50, sortBy: "name", order: "ASC" }).catch(
    () => ({ data: [], meta: { page: 1, limit: 50, total: 0, totalPages: 0 } })
  );
  const brands = (res.data ?? []).map((b) => ({
    id: String(b.id),
    name: b.name,
    image: brandImage(b.uploads),
    monogram: b.name.slice(0, 2).toUpperCase(),
    description: "",
  }));
  const MARQUEE = brands.map((b) => b.name.toUpperCase());

  return (
    <div className="overflow-x-clip">
      <section className="relative isolate min-h-[min(72vh,640px)] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 70% 20%, rgba(180,192,204,0.35), transparent 55%), radial-gradient(ellipse 50% 60% at 10% 90%, rgba(203,184,138,0.12), transparent 50%), linear-gradient(165deg, var(--color-panel) 0%, var(--color-void) 55%, var(--color-panel-2) 100%)",
          }}
        />
        <div className="grain pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative mx-auto flex min-h-[min(72vh,640px)] max-w-7xl flex-col justify-end px-6 pb-16 pt-28 lg:px-10 lg:pb-20">
          <Reveal y={18}>
            <span className="text-[11px] uppercase tracking-[0.2em] text-ion">
              EONAGE · Клиника
            </span>
          </Reveal>

          <Reveal delay={0.06} y={22}>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.75rem,8vw,5.75rem)] leading-[0.95] tracking-tight">
              Партнёры
              <span className="mt-1 block italic text-silver">клиники</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12} className="mt-8 flex flex-wrap items-end gap-8">
            <p className="max-w-md text-[15px] leading-relaxed text-silver">
              Профессиональные линии из процедур — для продолжения результата
              дома.
            </p>
            <div className="flex items-baseline gap-3 border-l border-line pl-6">
              <span className="font-display text-4xl leading-none text-mist">
                {brands.length}
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                брендов
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {MARQUEE.length > 0 && <DiagonalMarquee items={MARQUEE} tone="light" />}

      <div className="pt-16 lg:pt-24">
        <BrandShowcase brands={brands} />
      </div>

      <section className="border-t border-line/70 bg-panel">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 sm:flex-row sm:items-center lg:px-10 lg:py-20">
          <div>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              Продолжите протокол дома
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-silver">
              Все линии доступны в каталоге EONAGE — с рекомендациями врачей
              клиники.
            </p>
          </div>
          <LinkButton href="/catalog">Открыть каталог</LinkButton>
        </div>
      </section>
    </div>
  );
}
