import { LinkButton } from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import ProductBottle from "@/components/ProductBottle";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import DiagonalMarquee from "@/components/DiagonalMarquee";
import ScanCompare from "@/components/ScanCompare";
import { products } from "@/lib/products";
import { ScanFace, Sparkles, FlaskConical, ShieldCheck } from "lucide-react";

const MARQUEE_ITEMS = ["SCIENCE", "BEAUTY", "TECHNOLOGY"];
const MARQUEE_ITEMS_2 = ["EONAGE GAMES", "ЖЁСТКАЯ ПРАВДА", "AI SKIN ANALYSIS"];

const STATS = [
  { value: 4.9, decimals: 1, suffix: "", label: "средняя оценка" },
  { value: 1200, decimals: 0, suffix: "+", label: "пациентов клиники" },
  { value: 7, decimals: 0, suffix: "", label: "патентованных формул" },
  { value: 83, decimals: 0, suffix: "%", label: "точность AI-анализа" },
];

export default function Home() {
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 3);

  return (
    <div className="overflow-x-clip">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 30% 0%, rgba(111,184,255,0.16), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(203,184,138,0.10), transparent 60%)",
          }}
        />
        <div className="grain absolute inset-0" />

        <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-10 px-6 pb-20 pt-14 lg:flex-row lg:gap-16 lg:px-10 lg:pb-32 lg:pt-20">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-silver">
              <Sparkles size={12} className="text-ion" />
              Клиника из будущего · Москва
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-[5.5rem]">
              Наука
              <br />
              долголетия{" "}
              <span className="glitch italic text-ion">кожи</span>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-silver lg:mx-0">
              Собственная линия ухода клиники EONAGE — та же формула науки,
              что и в наших процедурах, теперь в домашнем протоколе.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <LinkButton href="/catalog">В каталог</LinkButton>
              <LinkButton href="/#technology" variant="outline">
                AI Skin Analysis
              </LinkButton>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-line sm:h-96 sm:w-96">
              <div className="scan-grid scan-grid-animated absolute inset-3 rounded-full" />
              <div className="absolute inset-6 rounded-full border border-line/70" />
              <div className="scan-line absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-ion to-transparent" />
              <ProductBottle variant="dropper" tint="ion" className="h-52 sm:h-64" />

              <div className="absolute -right-2 top-6 flex items-center gap-2 rounded-full border border-ion/40 bg-ink/80 px-3 py-1.5 text-[11px] text-ion backdrop-blur sm:right-2">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ion" />
                83% точность скана
              </div>
              <div className="absolute -bottom-3 left-2 rounded-full border border-line bg-ink/80 px-3 py-1.5 text-[11px] text-silver backdrop-blur sm:left-6">
                Анализ за 5 минут
              </div>
            </div>
          </div>
        </div>
      </section>

      <DiagonalMarquee items={MARQUEE_ITEMS} tone="light" />

      {/* BESTSELLERS */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ion">
              Бестселлеры
            </span>
            <h2 className="mt-2 text-2xl font-medium sm:text-3xl">
              Протокол, которому доверяют
            </h2>
          </div>
          <LinkButton href="/catalog" variant="outline">
            Весь каталог
          </LinkButton>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* EDITORIAL / HARD TRUTH */}
      <section className="border-y border-line bg-panel">
        <Reveal className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-10">
          <span className="text-[11px] uppercase tracking-[0.16em] text-gold">
            Жёсткая правда
          </span>
          <p className="mt-6 font-display text-2xl italic leading-snug text-mist sm:text-3xl lg:text-4xl">
            «Мы не обещаем чудо за одну ночь. Мы показываем измеримый
            результат — на данных, а не на фильтрах»
          </p>
          <span className="mt-6 block text-sm text-silver-dim">
            Dr. Sabisoy — врач-косметолог, основатель EONAGE
          </span>
        </Reveal>
      </section>

      {/* AI SCAN COMPARE */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="mb-10 text-center">
          <span className="text-[11px] uppercase tracking-[0.16em] text-ion">
            AI Skin Analysis
          </span>
          <h2 className="mt-2 text-2xl font-medium sm:text-3xl">
            Потяните за границу — сравните скан
          </h2>
          <p className="mx-auto mt-3 max-w-md text-silver">
            Так меняются показатели кожи после курса домашнего протокола
            EONAGE, по данным AI-анализа пациентов клиники.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ScanCompare />
        </Reveal>
      </section>

      <DiagonalMarquee items={MARQUEE_ITEMS_2} tone="ion" />

      {/* TECHNOLOGY */}
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
            <LinkButton href="/product/eonage-scanner-home" className="mt-9 inline-flex">
              Смотреть устройство
            </LinkButton>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section id="clinic" className="border-t border-line bg-panel">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 text-center lg:grid-cols-4 lg:px-10">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="font-display text-3xl text-ion sm:text-4xl">
                <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.1em] text-silver-dim">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <Reveal className="mb-10">
            <span className="text-[11px] uppercase tracking-[0.16em] text-ion">
              Новинки
            </span>
            <h2 className="mt-2 text-2xl font-medium sm:text-3xl">
              Только что со стенда лаборатории
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newArrivals.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.08}>
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
              До 10% с каждой покупки возвращается бонусами
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
