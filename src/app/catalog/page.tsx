import { Suspense } from "react";
import CatalogView from "@/components/CatalogView";

export default function CatalogPage() {
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

      <Suspense
        fallback={
          <div className="py-20 text-center text-sm text-silver">
            Загрузка каталога…
          </div>
        }
      >
        <CatalogView />
      </Suspense>
    </div>
  );
}
