"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import ProductMedia from "./ProductMedia";

export type ShowcaseBrand = {
  id: string;
  name: string;
  image: string | null;
  monogram: string;
  description: string;
};

export default function BrandShowcase({ brands }: { brands: ShowcaseBrand[] }) {
  const [active, setActive] = useState<ShowcaseBrand | null>(brands[0] ?? null);

  if (!brands.length || !active) {
    return (
      <p className="px-6 pb-24 text-center text-silver">
        Бренды скоро появятся.
      </p>
    );
  }

  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-20">
        <div className="flex flex-col justify-center">
          <p className="mb-8 text-[11px] uppercase tracking-[0.18em] text-silver-dim">
            Выберите бренд
          </p>

          <ul className="space-y-0">
            {brands.map((brand, i) => {
              const isActive = brand.id === active.id;
              return (
                <li key={brand.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(brand)}
                    onFocus={() => setActive(brand)}
                    onClick={() => setActive(brand)}
                    className={clsx(
                      "group flex w-full items-baseline gap-4 border-b border-line/60 py-4 text-left transition-colors duration-300 sm:py-5",
                      isActive ? "border-mist/40" : "hover:border-line"
                    )}
                  >
                    <span
                      className={clsx(
                        "w-7 shrink-0 font-mono text-[11px] tracking-wider transition-colors duration-300",
                        isActive ? "text-gold" : "text-silver-dim"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={clsx(
                          "block font-display text-2xl leading-none tracking-tight transition-all duration-500 sm:text-3xl lg:text-[2.15rem]",
                          isActive
                            ? "translate-x-1 text-mist"
                            : "text-silver-dim group-hover:text-mist"
                        )}
                      >
                        {brand.name}
                      </span>
                    </span>

                    <ArrowUpRight
                      size={16}
                      className={clsx(
                        "shrink-0 transition-all duration-300",
                        isActive
                          ? "translate-x-0 text-mist opacity-100"
                          : "-translate-x-1 text-silver-dim opacity-0 group-hover:opacity-50"
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-panel-2 sm:aspect-[5/6] lg:aspect-[4/5]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <ProductMedia
                  src={active.image}
                  alt={active.name}
                  className="h-full w-full"
                  imageClassName="object-cover"
                  bottleClassName="h-56"
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + "-copy"}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-display text-5xl leading-none text-white/15 sm:text-6xl">
                    {active.monogram}
                  </span>
                  <h2 className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl">
                    {active.name}
                  </h2>
                  {active.description && (
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-[15px]">
                      {active.description}
                    </p>
                  )}
                  <Link
                    href={`/catalog?brand=${active.id}`}
                    className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-80"
                  >
                    Смотреть в каталоге
                    <ArrowUpRight size={14} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
