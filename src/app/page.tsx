import { LinkButton } from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import ProductBottle from "@/components/ProductBottle";
import Reveal from "@/components/Reveal";
import DiagonalMarquee from "@/components/DiagonalMarquee";
import HeroSlider from "@/components/HeroSlider";
import { fetchProducts, fetchSliders } from "@/lib/api/catalog";
import { mediaUrl } from "@/lib/media";
import { ScanFace, FlaskConical, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const MARQUEE_ITEMS = ["SCIENCE", "BEAUTY", "TECHNOLOGY"];

export default async function Home() {
  const [productRes, sliders] = await Promise.all([
    fetchProducts({ limit: 8, sortBy: "id", order: "DESC" }).catch(() => ({
      data: [],
      meta: { page: 1, limit: 8, total: 0, totalPages: 0 },
    })),
    fetchSliders().catch(() => []),
  ]);

  const list = productRes.data ?? [];
  const bestsellers = list.slice(0, 4);
  const newArrivals = list.slice(0, 3);
  const heroSlides = (sliders ?? []).map((s) => ({
    id: String(s.id),
    title: s.title,
    link_url: s.link_url,
    image: mediaUrl(s.upload?.file_path),
  }));

  return (
    <div className="overflow-x-clip">
      <HeroSlider slides={heroSlides} />

      <DiagonalMarquee items={MARQUEE_ITEMS} tone="light" />

      {/* BESTSELLERS */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ion">
              Бестселлеры
            </span>
          </div>
          <LinkButton href="/catalog" variant="outline">
            Весь каталог
          </LinkButton>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers.map((product, i) => (
            <Reveal key={String(product.id)} delay={i * 0.08}>
              <ProductCard product={product} layered />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="technology" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal className="order-2 flex justify-center lg:order-1" y={32}>
            <div className="relative flex h-80 w-full max-w-sm items-center justify-center rounded-3xl border border-line bg-panel-2">
              <div className="absolute h-1/2 w-1/2 rounded-full bg-ion/20 blur-3xl" />
              <ProductBottle variant="device" tint="silver" className="h-56" />
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2" y={32} delay={0.1}>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ion">
              AI Skin Analysis
            </span>
            <h2 className="mt-3 text-2xl font-medium sm:text-3xl">
              Полный чек-ап кожи за 5 минут
            </h2>
            <p className="mt-4 max-w-md text-silver">
              Первая клиника, где можно провести полный анализ кожи с помощью
              ИИ прямо перед подбором домашнего ухода. Теперь то же самое —
              в компактном устройстве для дома.
            </p>
            <ul className="mt-8 flex flex-col gap-5">
              {[
                { icon: ScanFace, text: "Уровень увлажнённости и эластичности" },
                { icon: FlaskConical, text: "Персональные рекомендации по уходу" },
                { icon: ShieldCheck, text: "Синхронизация с картой пациента клиники" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-silver">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ion">
                    <Icon size={15} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <LinkButton href="/catalog" className="mt-9 inline-flex">
              Смотреть каталог
            </LinkButton>
          </Reveal>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <Reveal className="mb-10">
            <span className="text-[11px] uppercase tracking-[0.16em] text-ion">
              Новинки
            </span>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newArrivals.map((product, i) => (
              <Reveal key={String(product.id)} delay={i * 0.08}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* BONUS PROGRAM CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-panel px-8 py-14 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(203,184,138,0.14), transparent 70%)",
            }}
          />
          <div className="relative">
            <span className="text-[11px] uppercase tracking-[0.16em] text-gold">
              Бонусная программа EONAGE
            </span>
            <h2 className="mx-auto mt-3 max-w-lg text-2xl font-medium sm:text-3xl">
              До 5% с каждой покупки возвращается бонусами
            </h2>
            <p className="mx-auto mt-4 max-w-md text-silver">
              Бонусы копятся автоматически и списываются как скидка — на
              продукты и процедуры в клинике.
            </p>
            <LinkButton href="/catalog" className="mt-8 inline-flex">
              Начать копить бонусы
            </LinkButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
