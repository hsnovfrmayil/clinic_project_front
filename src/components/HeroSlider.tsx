"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ScanFace,
  FlaskConical,
} from "lucide-react";
import clsx from "clsx";
import { LinkButton } from "./Button";
import ProductBottle from "./ProductBottle";
import { BottleVariant } from "@/lib/types";

type SlideVisual = {
  variant: BottleVariant;
  tint: "ion" | "silver" | "gold";
  topBadge?: string;
  bottomBadge?: string;
  showScanGrid?: boolean;
};

type HeroSlide = {
  id: string;
  badgeIcon: "sparkles" | "scan" | "flask";
  badge: string;
  titleLine1: string;
  titleLine2?: string;
  titleAccent?: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  visual: SlideVisual;
};

const BADGE_ICONS = {
  sparkles: Sparkles,
  scan: ScanFace,
  flask: FlaskConical,
} as const;

const SLIDES: HeroSlide[] = [
  {
    id: "science",
    badgeIcon: "sparkles",
    badge: "Клиника из будущего · Москва",
    titleLine1: "Наука",
    titleLine2: "долголетия",
    titleAccent: "кожи",
    description:
      "Собственная линия ухода клиники EONAGE — та же формула науки, что и в наших процедурах, теперь в домашнем протоколе.",
    primaryCta: { label: "В каталог", href: "/catalog" },
    secondaryCta: { label: "AI Skin Analysis", href: "/#technology" },
    visual: {
      variant: "dropper",
      tint: "ion",
      topBadge: "83% точность скана",
      bottomBadge: "Анализ за 5 минут",
      showScanGrid: true,
    },
  },
  {
    id: "protocol",
    badgeIcon: "flask",
    badge: "Домашний протокол · EONAGE",
    titleLine1: "Формулы",
    titleLine2: "клинического",
    titleAccent: "уровня",
    description:
      "Сыворотки, кремы и устройства — разработаны врачами-косметологами для продолжения результата процедур дома.",
    primaryCta: { label: "В каталог", href: "/catalog" },
    secondaryCta: { label: "Бестселлеры", href: "/catalog" },
    visual: {
      variant: "jar",
      tint: "silver",
      topBadge: "7 пептидов",
      bottomBadge: "Бестселлер клиники",
      showScanGrid: true,
    },
  },
  {
    id: "ai",
    badgeIcon: "scan",
    badge: "AI Skin Analysis · 5 минут",
    titleLine1: "Диагностика",
    titleLine2: "вашей",
    titleAccent: "кожи",
    description:
      "Сканирование, подбор протокола и рекомендации продуктов — на основе данных AI-анализа кожи в клинике EONAGE.",
    primaryCta: { label: "Узнать больше", href: "/#technology" },
    secondaryCta: { label: "В каталог", href: "/catalog" },
    visual: {
      variant: "pump",
      tint: "ion",
      topBadge: "SPF 30 · дневной уход",
      bottomBadge: "Подбор по данным AI",
      showScanGrid: true,
    },
  },
];

const AUTOPLAY_MS = 7000;

function SlideVisualBlock({ visual }: { visual: SlideVisual }) {
  return (
    <div className="relative flex flex-1 items-center justify-center">
      <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-line sm:h-96 sm:w-96">
        {visual.showScanGrid && (
          <>
            <div className="scan-grid scan-grid-animated absolute inset-3 rounded-full" />
            <div className="absolute inset-6 rounded-full border border-line/70" />
            <div className="scan-line absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-ion to-transparent" />
          </>
        )}
        <ProductBottle
          variant={visual.variant}
          tint={visual.tint}
          className="h-52 sm:h-64"
        />
        {visual.topBadge && (
          <div className="absolute -right-2 top-6 flex items-center gap-2 rounded-full border border-ion/40 bg-ink/80 px-3 py-1.5 text-[11px] text-ion backdrop-blur sm:right-2">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ion" />
            {visual.topBadge}
          </div>
        )}
        {visual.bottomBadge && (
          <div className="absolute -bottom-3 left-2 rounded-full border border-line bg-ink/80 px-3 py-1.5 text-[11px] text-silver backdrop-blur sm:left-6">
            {visual.bottomBadge}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HeroSlider({
  slides,
}: {
  slides?: {
    id: string;
    title: string;
    link_url?: string | null;
    image?: string | null;
  }[];
}) {
  const apiSlides = slides?.filter((s) => s.title) ?? [];
  const useApi = apiSlides.length > 0;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = useApi ? apiSlides.length : SLIDES.length;

  const goTo = useCallback(
    (index: number) => {
      setActive((index + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [next, paused]);

  const fallback = SLIDES[active] ?? SLIDES[0];
  const apiSlide = apiSlides[active];
  const BadgeIcon = BADGE_ICONS[fallback.badgeIcon];

  return (
    <section
      className="relative flex min-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden border-b border-line"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 0%, rgba(176,190,204,0.16), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(203,184,138,0.10), transparent 60%)",
        }}
      />
      <div className="grain absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8 lg:px-10 lg:py-10">
        <div className="relative flex flex-1 items-center">
          <AnimatePresence mode="wait">
            {useApi && apiSlide ? (
              <motion.div
                key={apiSlide.id}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex w-full flex-col items-center gap-10 lg:flex-row lg:gap-16"
              >
                <div className="flex-1 text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-silver">
                    EONAGE
                  </span>
                  <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-[5.5rem]">
                    {apiSlide.title}
                  </h1>
                  <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                    <LinkButton href={apiSlide.link_url || "/catalog"}>
                      Смотреть
                    </LinkButton>
                  </div>
                </div>
                {apiSlide.image && (
                  <div className="relative h-72 w-full max-w-md overflow-hidden rounded-[2rem] bg-panel-2 sm:h-96">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={apiSlide.image}
                      alt={apiSlide.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={fallback.id}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex w-full flex-col-reverse items-center gap-10 lg:flex-row lg:gap-16"
              >
                <div className="flex-1 text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-silver">
                    <BadgeIcon size={12} className="text-ion" />
                    {fallback.badge}
                  </span>
                  <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-[5.5rem]">
                    {fallback.titleLine1}
                    {fallback.titleLine2 && (
                      <>
                        <br />
                        {fallback.titleLine2}{" "}
                      </>
                    )}
                    {fallback.titleAccent && (
                      <span className="glitch italic text-ion">
                        {fallback.titleAccent}
                      </span>
                    )}
                  </h1>
                  <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-silver lg:mx-0">
                    {fallback.description}
                  </p>
                  <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                    <LinkButton href={fallback.primaryCta.href}>
                      {fallback.primaryCta.label}
                    </LinkButton>
                    <LinkButton
                      href={fallback.secondaryCta.href}
                      variant="outline"
                    >
                      {fallback.secondaryCta.label}
                    </LinkButton>
                  </div>
                </div>
                <SlideVisualBlock visual={fallback.visual} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex shrink-0 items-center justify-between gap-4 lg:mt-6">
          <div className="flex items-center gap-3">
            <span className="w-6 text-xs tabular-nums text-mist">
              {String(active + 1).padStart(2, "0")}
            </span>
            <div className="h-px w-24 overflow-hidden bg-line sm:w-32">
              <motion.div
                className="h-full bg-ion"
                initial={false}
                animate={{
                  width: `${((active + 1) / count) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <span className="w-6 text-xs tabular-nums text-silver-dim">
              {String(count).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Слайд ${i + 1}`}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active
                    ? "w-6 bg-ion"
                    : "w-1.5 bg-line hover:bg-silver-dim"
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Предыдущий слайд"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-ion hover:text-ion"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Следующий слайд"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-ion hover:text-ion"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
