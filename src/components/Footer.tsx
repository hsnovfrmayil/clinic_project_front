import Link from "next/link";
import Logo from "./Logo";
import { Send } from "lucide-react";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo className="text-mist" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-silver">
              Наука. Красота. Технологии. Собственная линия ухода клиники
              эстетической медицины будущего.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.instagram.com/eonage.clinic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-silver transition-colors hover:border-ion hover:text-ion"
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-silver transition-colors hover:border-ion hover:text-ion"
                aria-label="Telegram"
              >
                <Send size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.14em] text-silver-dim">
              Магазин
            </h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-silver">
              <li><Link href="/catalog" className="hover:text-ion">Все продукты</Link></li>
              <li><Link href="/catalog?category=Сыворотки" className="hover:text-ion">Сыворотки</Link></li>
              <li><Link href="/catalog?category=Кремы" className="hover:text-ion">Кремы</Link></li>
              <li><Link href="/catalog?category=Домашние+устройства" className="hover:text-ion">Устройства</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.14em] text-silver-dim">
              Клиника
            </h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-silver">
              <li><Link href="/#clinic" className="hover:text-ion">О клинике</Link></li>
              <li><Link href="/#technology" className="hover:text-ion">AI Skin Analysis</Link></li>
              <li><a href="#" className="hover:text-ion">Москва, клиника Eonage</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-silver-dim md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} EONAGE. Все права защищены.</span>
          <span>Clinic from the future — Moscow</span>
        </div>
      </div>
    </footer>
  );
}
